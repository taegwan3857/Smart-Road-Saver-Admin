import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { detectionService } from '../../services/detectionService';

import { authService } from '../../services/authService';
import DetectionDetailModal from '../common/DetectionDetailModal';
import { getAddressFromCoords } from '../../utils/geocoder';


const translateType = (type) => {
  if (!type) return '위험';
  const t = String(type).toUpperCase();
  if (t.includes('BLACK_ICE') || t.includes('블랙아이스')) return '블랙아이스';
  if (t.includes('POTHOLE') || t.includes('포트홀')) return '포트홀';
  if (t.includes('OBSTACLE') || t.includes('장애물')) return '장애물';
  if (t.includes('ANIMAL') || t.includes('CORPSE')) return '동물 사체';
  if (t.includes('WET_ROAD') || t.includes('젖은')) return '젖은 노면';
  return type;
};


const formatAddress = (addr) => {
  if (!addr) return '';
  let str = String(addr);
  if (str.startsWith('{')) {
    try {
      const obj = JSON.parse(str);
      str = obj.road_address_name || obj.road_address || obj.address_name || str;
    } catch(e) {}
  }
  str = str.replace(/^대한민국\s+/, '');
  if (str.includes(',')) {
    let parts = str.split(',').map(s => s.trim());
    parts = parts.filter(p => p !== '대한민국');
    parts = parts.filter(p => !/^\d{5}$/.test(p));
    str = parts.reverse().join(' ');
  }
  if (str.includes('POINT') || /^[0-9a-fA-F]{20,}$/.test(str)) {
    return '';
  }
  return str;
};

const playAlertSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();

    // 삼중 경고 비프 (삐삐삐!)
    const beepTimes = [0, 0.15, 0.30]; // 3연타 간격
    beepTimes.forEach((startTime) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime + startTime);

      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime + startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start(audioCtx.currentTime + startTime);
      oscillator.stop(audioCtx.currentTime + startTime + 0.1);
    });
  } catch(e) {
    console.warn('Audio play failed', e);
  }
};

export default function Header() {
  const navigate = useNavigate();
  const [timeStr, setTimeStr] = useState('');
  const [latestEvent, setLatestEvent] = useState(null);
  const [eventAddress, setEventAddress] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState({ name: '관리자', role: 'ADMIN' });

  const lastAnnouncedEventId = useRef(null);

  useEffect(() => {
    if (latestEvent && eventAddress && eventAddress !== '주소 정보 없음' && eventAddress !== '주소 정보 없음 (응답 지연)') {
      const currentId = latestEvent.event_id || latestEvent.detection_id || latestEvent.id || latestEvent._id;
      // Only announce if it's a new event
      if (lastAnnouncedEventId.current !== currentId) {
        // Removed initial skip so user can hear it on Vite HMR reload
        
        lastAnnouncedEventId.current = currentId;
        
        if (lastAnnouncedEventId.current) { // Prevent beep on very first load
          playAlertSound();
        }
      }
    }
  }, [latestEvent, eventAddress]);


  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const time = now.toLocaleTimeString('en-US', { hour12: false });
      setTimeStr(`${y}-${m}-${d} ${time}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      try { setUser(JSON.parse(u)); } catch(e) {}
    }
  }, []);

  const lastEventId = useRef(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await detectionService.getDetections({ limit: 1 });
        const list = Array.isArray(data) ? data : (data?.detections || data?.items || []);
        if (list.length > 0) {
          const event = list[0];
          setLatestEvent(event);
          
          const currentId = event.event_id || event.detection_id || event.id || event._id;
          
          // playAlertSound는 위의 useEffect에서 처리됨
          if (currentId) lastEventId.current = currentId;

          // events API가 도로명 주소를 제공하므로 직접 사용
          const addr = event.address || event.location || event.road_address || event.address_name;
          if (addr && !/GPS/i.test(addr)) {
            setEventAddress(formatAddress(addr));
          } else if (event.latitude && event.longitude) {
            const geoAddr = await getAddressFromCoords(event.latitude, event.longitude);
            setEventAddress(geoAddr || '주소 정보 없음');
          } else {
            setEventAddress('주소 정보 없음');
          }
        }
      } catch (err) {}
    };
    fetchLatest();
    const timer = setInterval(fetchLatest, 5000);
    return () => clearInterval(timer);
  }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalId, setModalId] = useState(null);

  const handleTickerClick = () => {
    if (latestEvent) {
      const id = latestEvent.event_id || latestEvent.detection_id || latestEvent.id || latestEvent._id;
      if (id) { setModalId(id); setIsModalOpen(true); }
    }
  };

  const formatEventTime = (timestamp) => {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    if (isNaN(d)) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const time = d.toLocaleTimeString('en-US', { hour12: false });
    return `${year}-${month}-${day} ${time}`;
  };


  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <>
      {/* Left Side: Real-time Ticker */}
      <div className="header-left">
        <div 
          className="live-ticker" 
          onClick={handleTickerClick} 
          style={{ cursor: latestEvent ? "pointer" : "default" }}
        >
          <span style={{color: "var(--color-danger)", display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", lineHeight: 1}}>
            <i className="fas fa-circle" style={{fontSize: "0.5rem", marginTop: "1px", animation: "pulse-dot 1.5s infinite"}}></i> 실시간 감지
          </span>
          <div style={{width: "1px", height: "14px", background: "#cbd5e1"}}></div>
          <span style={{color: "var(--text-main)", display: "flex", alignItems: "center", fontWeight: "600", lineHeight: 1, paddingTop: "1px"}}>
            {latestEvent ? `${eventAddress}_${translateType(latestEvent.obstacle_type||latestEvent.event_type||latestEvent.type)} 감지 (${formatEventTime(latestEvent.first_detected_at||latestEvent.timestamp||latestEvent.created_at||latestEvent.detected_at||latestEvent.date)})` : '실시간 감지 대기'}
          </span>
        </div>
      </div>

      {/* Right Side: Clock & Profile */}
      <div className="header-right" style={{display: "flex", alignItems: "center", gap: "16px"}}>
        <button 
          onClick={toggleDarkMode}
          style={{
            background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer',
            color: isDarkMode ? '#fbbf24' : '#64748b', fontSize: '1.1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '50%',
            transition: 'all 0.3s'
          }}
          title={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          <i className={isDarkMode ? "fas fa-sun" : "fas fa-moon"}></i>
        </button>
        <div style={{display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", height: "100%"}}>
          <i className="far fa-clock" style={{fontSize: "1.1rem", display: "flex", alignItems: "center", paddingTop: "1px"}}></i> 
          <span style={{fontSize: "1.05rem", fontWeight: "500", display: "flex", alignItems: "center"}}>{timeStr}</span>
        </div>
        <div style={{width: "1px", height: "24px", background: "var(--border-light)", margin: "0 8px"}}></div>
        <div className="header-profile" style={{display: "flex", alignItems: "center", gap: "12px"}}>
          <div className="profile-text" style={{textAlign: "right"}}>
            <div style={{fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)"}}>admin</div>
            <div style={{fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px"}}>S.R.S.관리자</div>
          </div>
          <div className="profile-avatar-small" style={{width: "36px", height: "36px", background: "var(--primary-color)", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem"}}>
            <i className="fas fa-user"></i>
          </div>
        </div>
      </div>
      <DetectionDetailModal isOpen={isModalOpen} id={modalId} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
