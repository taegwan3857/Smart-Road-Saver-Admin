import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { detectionService } from '../../services/detectionService';
import { authService } from '../../services/authService';
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
        
        if ('speechSynthesis' in window) {
          const typeKo = translateType(latestEvent.obstacle_type||latestEvent.event_type||latestEvent.type);
          const msg = new SpeechSynthesisUtterance(`새로운 위험 요소가 감지되었습니다. ${eventAddress}, ${typeKo} 감지.`);
          msg.lang = 'ko-KR';
          msg.rate = 1.0;
          window.speechSynthesis.speak(msg);
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

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await detectionService.getDetections({ limit: 1 });
        const list = Array.isArray(data) ? data : (data?.detections || data?.items || []);
        if (list.length > 0) {
          const event = list[0];
          setLatestEvent(event);
          const addrStr = event.address||event.location||event.road_address||event.address_name;
          if (addrStr) setEventAddress(addrStr);
          else if (event.latitude && event.longitude) setEventAddress(await getAddressFromCoords(event.latitude, event.longitude) || '주소 정보 없음');
          else setEventAddress('주소 정보 없음');
        }
      } catch (err) {}
    };
    fetchLatest();
    const timer = setInterval(fetchLatest, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTickerClick = () => {
    if (latestEvent) {
      const id = latestEvent.detection_id || latestEvent.id || latestEvent._id;
      if (id) navigate(`/detections/${id}`);
    }
  };

  const formatEventTime = (timestamp) => {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    if (isNaN(d)) return '';
    return d.toLocaleTimeString('en-US', { hour12: false });
  };

  return (
    <>
      {/* Left Side: Real-time Ticker */}
      <div className="header-left">
        <div 
          className="live-ticker" 
          onClick={handleTickerClick} 
          style={{ cursor: latestEvent ? "pointer" : "default" }}
        >
          <span style={{color: "var(--color-danger)", display: "flex", alignItems: "center", gap: "6px", fontWeight: "700"}}>
            <i className="fas fa-circle" style={{fontSize: "0.6rem", animation: "pulse-dot 1.5s infinite"}}></i> 실시간 감지
          </span>
          <div style={{width: "1px", height: "14px", background: "#cbd5e1"}}></div>
          <span style={{color: "var(--text-main)", fontWeight: "600"}}>
            {latestEvent ? `${eventAddress}_${translateType(latestEvent.obstacle_type||latestEvent.event_type||latestEvent.type)} 감지 (${formatEventTime(latestEvent.timestamp||latestEvent.created_at||latestEvent.detected_at||latestEvent.date)})` : '실시간 감지 대기'}
          </span>
        </div>
      </div>

      {/* Right Side: Clock & Profile */}
      <div className="header-right" style={{display: "flex", alignItems: "center", gap: "16px"}}>
        <div style={{display: "flex", alignItems: "center", gap: "8px", fontSize: "0.95rem", color: "var(--text-muted)"}}>
          <i className="far fa-clock"></i> <span style={{fontFamily: "monospace", fontSize: "1.05rem", fontWeight: "500"}}>{timeStr}</span>
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
    </>
  );
}
