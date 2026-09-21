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

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return 'https://smart-road-saver-api.onrender.com' + (path.startsWith('/') ? '' : '/') + path;
  };

  const images = data?.detection_images || [];
  const rawImagePath = data?.image_url || (images.length > 0 ? images[0]?.image_path : null);
  const imageUrl = getImageUrl(rawImagePath);

  return (
    <div className="modal-overlay show" onClick={handleBackdropClick} style={{zIndex: 9999, background: 'rgba(15, 23, 42, 0.6)'}}>
      <div className="modal-box" style={{
        background: 'var(--bg-panel)', 
        color: 'var(--text-main)', 
        width: '100%', 
        maxWidth: '800px',
        maxHeight: '90vh',
        padding: 0,
        overflow: 'hidden',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header - Light theme (Navy) */}
        <div style={{
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '14px 24px',
          background: 'var(--primary-color)',
          color: 'var(--bg-panel)',
          flexShrink: 0
        }}>
          <h2 style={{margin: 0, fontSize: '1.15rem', fontWeight: '700'}}>분석 정보</h2>
          <button onClick={onClose} className="modal-close-btn" style={{ fontSize: '1.25rem' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div style={{padding: '12px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0}}>
          {loading ? (
            <div style={{padding: '40px', textAlign: 'center', color: 'var(--text-light)'}}>데이터 불러오는 중</div>
          ) : !data ? (
            <div style={{padding: '40px', textAlign: 'center', color: 'var(--text-light)'}}>데이터를 찾을 수 없습니다.</div>
          ) : (
            <>
              {/* Image Section - 원본 비율, 남는 공간에 맞춤 */}
              <div style={{flex: 1, minHeight: 0, marginBottom: '10px', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-hover)', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {imageUrl ? (
                  <img src={imageUrl} alt="Detection snapshot" style={{width: '100%', height: '100%', objectFit: 'contain', display: 'block'}} onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x450?text=Image+Load+Failed'; }} />
                ) : (
                  <div style={{width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)'}}>
                    원본 감지 데이터가 없음
                  </div>
                )}
                
              </div>

              {/* Redesigned Info Panel */}
              <div style={{
                background: 'var(--bg-panel)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {/* Type & Risk */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: 'var(--bg-body)' }}>
                  <div style={{ flex: 1, padding: '14px 16px', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-car-crash" style={{color: 'var(--text-light)'}}></i> 장애물 종류
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>{hazardTypeKor}</div>
                  </div>
                  <div style={{ flex: 1, padding: '14px 16px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-exclamation-triangle" style={{color: 'var(--text-light)'}}></i> 위험 등급
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: (data.risk_level||'').toUpperCase() === 'LOW' ? '#eab308' : '#ef4444' }}>
                      {(data.risk_level||'').toUpperCase() === 'LOW' ? '낮음' : '높음'}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fas fa-map-marker-alt" style={{color: 'var(--text-light)'}}></i> 발생 주소
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>{address}</div>
                </div>

                {/* Times */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="far fa-clock" style={{color: 'var(--text-light)'}}></i> 최초 감지 시간
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-muted)' }}>{formatTime(data.first_detected_at || data.detected_at || data.created_at)}</div>
                  </div>
                  <div style={{ flex: 1, padding: '12px 16px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <i className="fas fa-history" style={{color: 'var(--text-light)'}}></i> 최근 갱신 시간
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-muted)' }}>{formatTime(data.last_detected_at || data.detected_at || data.created_at)}</div>
                  </div>
                </div>

                {/* Count & Status */}
                <div style={{ display: 'flex', background: 'var(--bg-body)' }}>
                  <div style={{ flex: 1, padding: '14px 16px', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-layer-group" style={{color: 'var(--text-light)'}}></i> 누적 감지 횟수
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>
                      <span style={{ color: '#3b82f6', fontWeight: '800' }}>{data.cumulative_count || data.detection_count || data.count || 1}</span>회 감지
                    </div>
                  </div>
                  <div style={{ flex: 1, padding: '14px 16px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-shield-alt" style={{color: 'var(--text-light)'}}></i> 신고 상태
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: '700', color: data.report_status ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {data.report_status ? <><i className="fas fa-check-circle"></i> 자동 신고 완료</> : <><i className="fas fa-hourglass-half"></i> 미신고</>}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
