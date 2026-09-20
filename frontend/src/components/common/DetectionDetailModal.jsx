import React, { useEffect, useState } from 'react';
import { detectionService } from '../../services/detectionService';
import { getAddressFromCoords } from '../../utils/geocoder';

const getKoreanType = (type) => {
  if (type === 'BLACK_ICE') return '블랙아이스';
  if (type === 'POTHOLE') return '포트홀';
  if (type === 'OBSTACLE') return '장애물';
  if (type === 'ANIMAL_CORPSE' || type === 'ANIMAL') return '동물 사체';
  if (type === 'WET_ROAD') return '젖은 노면';
  return '기타 위험 요소';
};

const formatAddress = (addr, lat, lng) => {
  if (!addr || addr === 'null') {
    if (lat && lng) return `${lat}, ${lng}`;
    return '위치 정보 없음';
  }
  let str = String(addr);
  if (str.startsWith('{')) {
    try {
      const obj = JSON.parse(str);
      str = obj.road_address_name || obj.road_address || obj.address_name || str;
    } catch(e) {}
  }
  str = str.replace(/^대한민국\s+/, '');
  if (str.includes('POINT') || /^[0-9a-fA-F]{20,}$/.test(str)) {
    if (lat && lng) return `${lat}, ${lng}`;
    return '위치 정보 없음';
  }
  if (/GPS/i.test(str)) {
    return '도로명 주소 변환 중...';
  }
  return str;
};

export default function DetectionDetailModal({ isOpen, id, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('주소 정보 확인 중...');

  useEffect(() => {
    if (!isOpen || !id) return;
    
    let isMounted = true;
    setLoading(true);
    
    const fetchDetail = async () => {
      try {
        const d = await detectionService.getDetection(id);
        if (!isMounted) return;
        setData(d);
        
        let addrStr = d.address || d.location || d.road_address || d.address_name;
        if (addrStr && addrStr !== 'null' && !/GPS/i.test(addrStr) && !/POINT/i.test(addrStr)) {
          setAddress(formatAddress(addrStr, d.latitude, d.longitude));
        } else if (d.latitude && d.longitude) {
          const res = await getAddressFromCoords(d.latitude, d.longitude);
          if (isMounted) {
            setAddress(res || '주소 정보 없음');
          }
        } else {
          if (isMounted) setAddress('주소 정보 없음');
        }
      } catch (e) {
        console.error('Failed to fetch detail', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchDetail();
    
    return () => { isMounted = false; };
  }, [isOpen, id]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const hazardTypeKor = data ? getKoreanType(data.obstacle_type || data.event_type || data.type) : '위험 요소';
  
  // Format dates
  const formatTime = (ts) => {
    if (!ts) return '-';
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const isPM = d.getHours() >= 12;
    const hour = d.getHours() % 12 || 12;
    const min = d.getMinutes().toString().padStart(2, '0');
    const sec = d.getSeconds().toString().padStart(2, '0');
    return `${y}. ${m}. ${day}. ${isPM ? '오후' : '오전'} ${hour}:${min}:${sec}`;
  };

  const images = data?.detection_images || [];
  const imageUrl = images.length > 0 ? images[0] : (data?.image_url || 'https://via.placeholder.com/800x450?text=No+Image');

  return (
    <div className="modal-overlay show" onClick={handleBackdropClick} style={{zIndex: 9999, background: 'rgba(0,0,0,0.6)'}}>
      <div className="modal-box" style={{
        background: '#111827', 
        color: '#ffffff', 
        width: '100%', 
        maxWidth: '800px',
        padding: 0,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 style={{margin: 0, fontSize: '1.25rem', fontWeight: '700'}}>분석 정보</h2>
          <button onClick={onClose} style={{
            background: 'none', 
            border: 'none', 
            color: '#94a3b8', 
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1
          }}>&times;</button>
        </div>

        <div style={{padding: '24px', maxHeight: '80vh', overflowY: 'auto'}}>
          {loading ? (
            <div style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>데이터를 불러오는 중입니다...</div>
          ) : !data ? (
            <div style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>데이터를 찾을 수 없습니다.</div>
          ) : (
            <>
              {/* Image Section */}
              <div style={{position: 'relative', width: '100%', marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000'}}>
                <img src={imageUrl} alt="Detection snapshot" style={{width: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block'}} />
                {images.length > 0 && (
                  <div style={{
                    position: 'absolute', 
                    bottom: '16px', 
                    right: '16px', 
                    background: 'rgba(0,0,0,0.7)', 
                    padding: '6px 12px', 
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    원본 스냅샷 보기 (1/{images.length})
                  </div>
                )}
              </div>

              {/* Grid Section */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px'
              }}>
                <div style={{background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{color: '#9ca3af', fontSize: '0.85rem', marginBottom: '8px'}}>장애물 종류</div>
                  <div style={{fontSize: '1.1rem', fontWeight: '700'}}>{hazardTypeKor}</div>
                </div>
                
                <div style={{background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{color: '#9ca3af', fontSize: '0.85rem', marginBottom: '8px'}}>위험 등급</div>
                  <div style={{fontSize: '1.1rem', fontWeight: '700', color: (data.risk_level||'').toUpperCase() === 'LOW' ? '#eab308' : '#ef4444'}}>
                    {(data.risk_level||'').toUpperCase() === 'LOW' ? '낮음' : '높음'}
                  </div>
                </div>

                <div style={{background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', gridColumn: '1 / -1'}}>
                  <div style={{color: '#9ca3af', fontSize: '0.85rem', marginBottom: '8px'}}>발생 주소</div>
                  <div style={{fontSize: '1.1rem', fontWeight: '700'}}>{address}</div>
                </div>

                <div style={{background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{color: '#9ca3af', fontSize: '0.85rem', marginBottom: '8px'}}>최초 감지 시간</div>
                  <div style={{fontSize: '1.1rem', fontWeight: '700'}}>{formatTime(data.first_detected_at || data.detected_at || data.created_at)}</div>
                </div>

                <div style={{background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{color: '#9ca3af', fontSize: '0.85rem', marginBottom: '8px'}}>최근 갱신 시간</div>
                  <div style={{fontSize: '1.1rem', fontWeight: '700'}}>{formatTime(data.last_detected_at || data.detected_at || data.created_at)}</div>
                </div>

                <div style={{background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{color: '#9ca3af', fontSize: '0.85rem', marginBottom: '8px'}}>누적 감지 횟수</div>
                  <div style={{fontSize: '1.1rem', fontWeight: '700'}}>{data.cumulative_count || data.detection_count || data.count || 1}회 감지</div>
                </div>

                <div style={{background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{color: '#9ca3af', fontSize: '0.85rem', marginBottom: '8px'}}>공공기관 신고 상태</div>
                  <div style={{fontSize: '1.1rem', fontWeight: '700'}}>{data.report_status ? '자동 신고 완료' : '미신고'}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
