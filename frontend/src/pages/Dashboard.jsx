import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DetectionDetailModal from '../components/common/DetectionDetailModal';
import CustomSelect from "../components/common/CustomSelect";

import { dashboardService } from '../services/dashboardService';
import { deviceService } from '../services/deviceService';
import { getAddressFromCoords } from '../utils/geocoder';

const getHazardIcon = (type) => {
  const t = String(type || '').toUpperCase();
  if (t === 'BLACK_ICE') return 'fas fa-snowflake';
  if (t === 'POTHOLE') return 'fas fa-road';
  if (t === 'OBSTACLE') return 'fas fa-box-open';
  if (t === 'ANIMAL_CORPSE' || t === 'ANIMAL') return 'fas fa-paw';
  if (t === 'WET_ROAD') return 'fas fa-tint';
  return 'fas fa-exclamation-triangle';
};

const getKoreanType = (type) => {
  if (type === 'BLACK_ICE') return '블랙아이스';
  if (type === 'POTHOLE') return '포트홀';
  if (type === 'OBSTACLE') return '장애물';
  if (type === 'ANIMAL_CORPSE' || type === 'ANIMAL') return '동물 사체';
  if (type === 'WET_ROAD') return '젖은 노면';
  return '위험 요소';
};


const formatAddress = (addr, lat, lng) => {
  if (!addr) {
    if (lat && lng) return `${lat}, ${lng}`;
    return '위치 정보 없음';
  }
  let str = String(addr);
  // JSON 문자열인 경우 파싱 시도
  if (str.startsWith('{')) {
    try {
      const obj = JSON.parse(str);
      str = obj.road_address_name || obj.road_address || obj.address_name || str;
    } catch(e) {}
  }
  // 불필요한 '대한민국 ' 제거
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [deviceCount, setDeviceCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [typeFilter, setTypeFilter] = useState('위험 유형 전체');
  const [riskFilter, setRiskFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('오늘');
  const [mapInstance, setMapInstance] = useState(null);
  const [activeEventId, setActiveEventId] = useState(null);
  const [navigatingId, setNavigatingId] = useState(null);
  const [addresses, setAddresses] = useState({});

  
  const [modalDetectionId, setModalDetectionId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const openDetailModal = (e, id) => {
    e?.stopPropagation();
    setModalDetectionId(id);
    setIsDetailModalOpen(true);
  };

  const handleNavigateDetail = (e, id) => {
    e?.stopPropagation();
    setNavigatingId(id);
    setTimeout(() => { navigate(`/detections/${id}`); }, 200);
  };
  const markersRef = useRef([]);
  const overlayRef = useRef(null);
  const hasInitialPannedRef = useRef(false);

  const handlePanTo = (ev) => {
    if (mapInstance && window.kakao) {
      const moveLatLon = new window.kakao.maps.LatLng(Number(ev.latitude), Number(ev.longitude));
      mapInstance.panTo(moveLatLon);
      setActiveEventId(ev.event_id || ev.detection_id || ev.id || ev._id);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsDataRaw, devicesData] = await Promise.all([
          dashboardService.getEvents().catch(() => []),
          deviceService.getDevices().catch(() => [])
        ]);
        
        const eventsData = Array.isArray(eventsDataRaw) ? eventsDataRaw : (eventsDataRaw?.data || eventsDataRaw?.events || eventsDataRaw?.items || []);
        
        // 프론트엔드에서 직접 금일 등록 감지 건수 계산 (API 미구현 대응)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = eventsData.filter(ev => {
          const d = new Date(ev.first_detected_at || ev.created_at || ev.detected_at);
          return d >= today;
        }).length;
        
        const summaryData = { total_detections_today: todayCount };
        const devList = Array.isArray(devicesData) ? devicesData : (devicesData?.items || []);
        if (devList.length > 0) setDeviceCount(devList.length);
        
        setSummary(summaryData);
        const list = Array.isArray(eventsData) ? eventsData : (eventsData?.events || eventsData?.data || eventsData?.events || eventsData?.items || []);
        list.sort((a, b) => {
          const timeA = new Date(a.first_detected_at || a.created_at || a.detected_at || 0).getTime();
          const timeB = new Date(b.first_detected_at || b.created_at || b.detected_at || 0).getTime();
          return timeB - timeA;
        });
        
        setEvents(list);
        
        // Fetch missing road addresses using Geocoder
        for (const d of list) {
          const id = d.event_id || d.detection_id || d.id || d._id;
          
          setAddresses(prev => {
            if (prev[id]) return prev; // Already have it in state
            
            // It's not in state, let's fetch it asynchronously without blocking the loop
            const fetchAddr = async () => {
              try {
                let finalAddr = '주소 정보 없음';
                const addr = d.address || d.location || d.road_address || d.address_name;
                
                if (addr && addr !== 'null' && !/GPS/i.test(addr) && !/POINT/i.test(addr)) {
                  finalAddr = formatAddress(addr, d.latitude, d.longitude);
                } else if (d.latitude && d.longitude) {
                  finalAddr = await getAddressFromCoords(d.latitude, d.longitude) || '주소 정보 없음';
                }
                
                setAddresses(curr => ({ ...curr, [id]: finalAddr }));
              } catch (e) {
                console.warn('Geocoding error for id', id, e);
              }
            };
            fetchAddr();
            
            // Mark as '변환 중...' temporarily so we don't refetch
            return { ...prev, [id]: '도로명 주소 변환 중...' };
          });
        }
        
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getTypeColor = (type) => {
    if (!type) return 'warning';
    const t = type.toLowerCase();
    if (t.includes('블랙아이스') || t.includes('black_ice') || t.includes('ice')) return 'danger';
    if (t.includes('포트홀') || t.includes('pothole')) return 'warning';
    return 'info';
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const filteredEvents = events.filter(ev => {
    let matchesSearch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const id = String(ev.id||ev._id||'').toLowerCase();
      const addr = String(ev.address||ev.location||'').toLowerCase();
      matchesSearch = id.includes(term) || addr.includes(term);
    }
    
    let matchesType = true;
    if (typeFilter !== '위험 유형 전체') {
      const t = String(ev.obstacle_type||ev.event_type||ev.type||'');
      if (typeFilter === '장애물/낙하물' && !t.includes('장애물') && !t.includes('낙하물')) matchesType = false;
      else if (typeFilter !== '장애물/낙하물' && !t.includes(typeFilter)) matchesType = false;
    }

    let matchesRisk = true;
    if (riskFilter !== '') {
      const rl = (ev.risk_level || '').toUpperCase();
      if (rl !== riskFilter) matchesRisk = false;
    }

    let matchesPeriod = true;
    const evDateStr = ev.last_detected_at || ev.first_detected_at || ev.created_at || ev.detected_at;
    if (periodFilter !== '전체 기간' && evDateStr) {
      const date = new Date(evDateStr);
      const now = new Date();
      
      if (periodFilter.includes('오늘')) {
        // 오늘(자정 기준)
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (date < today) matchesPeriod = false;
      }
      else if (periodFilter.includes('최근 1주일')) {
        const diffDays = (now - date) / (1000 * 60 * 60 * 24);
        if (diffDays > 7) matchesPeriod = false;
      }
      else if (periodFilter.includes('최근 1개월')) {
        const diffDays = (now - date) / (1000 * 60 * 60 * 24);
        if (diffDays > 30) matchesPeriod = false;
      }
    }

    return matchesSearch && matchesType && matchesRisk && matchesPeriod;
  });


  // 지도 인스턴스 초기화 (최초 1회)
  useEffect(() => {
    const initMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        setTimeout(initMap, 500);
        return;
      }
      window.kakao.maps.load(() => {
        const container = document.getElementById('kakao-map');
        if (!container || container.childNodes.length > 0) return; // 이미 지도가 그려져있으면 무시
        
        // 첫 번째 이벤트 위치로 지도 중심 설정 (없으면 기본값 강남역)
        let initialLat = 37.4979;
        let initialLng = 127.0280;
        
        // useEffect 외부 스코프에서 최신 데이터를 가져올 수 없으므로(빈 의존성 배열),
        // 일단 기본값으로 그리고 아래의 마커 렌더링 useEffect에서 첫 로드 시 카메라를 이동시킴
        const options = {
          center: new window.kakao.maps.LatLng(initialLat, initialLng),
          level: 4
        };
        const map = new window.kakao.maps.Map(container, options);
        // flex 레이아웃 등에서 크기가 안 잡히는 현상 방지
        setTimeout(() => map.relayout(), 100);
        setMapInstance(map);
      });
    };
    initMap();
  }, []); // 빈 의존성 배열로 마운트 시 1회만 실행

  // 데이터 및 활성 이벤트 변경 시 마커/오버레이 업데이트
  useEffect(() => {
    if (!mapInstance || !window.kakao || !window.kakao.maps) return;
    
    // 기존 마커 및 오버레이 제거
    markersRef.current.forEach(m => m.setMap(null));
    if (overlayRef.current) overlayRef.current.setMap(null);
    markersRef.current = [];
    
    filteredEvents.forEach(ev => {
      if (ev.latitude && ev.longitude) {
        const markerPosition = new window.kakao.maps.LatLng(Number(ev.latitude), Number(ev.longitude));
        const evId = ev.event_id || ev.detection_id || ev.id || ev._id;
        const eType = ev.obstacle_type || ev.event_type || ev.type || '';
        
        // 1. 아이콘 모양은 위험 유형(obstacle_type)에 따라 결정
        let iconClass = 'fas fa-exclamation-triangle';
        if (eType === 'BLACK_ICE') iconClass = 'fas fa-snowflake';
        else if (eType === 'POTHOLE') iconClass = 'fas fa-road';
        else if (eType === 'OBSTACLE') iconClass = 'fas fa-box-open';
        else if (eType === 'ANIMAL_CORPSE' || eType === 'ANIMAL') iconClass = 'fas fa-paw';
        else if (eType === 'WET_ROAD') iconClass = 'fas fa-tint';

        // 2. 배경 색상은 위험도(risk_level)에 따라 결정
        const rl = (ev.risk_level || '').toUpperCase();
        let bgColor = rl === 'LOW' ? '#eab308' : '#ef4444';
        
        const iconContent = document.createElement('div');
        const isActive = activeEventId === evId;
        iconContent.style.cssText = `width:${isActive?38:32}px;height:${isActive?38:32}px;background:${bgColor};color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 6px rgba(0,0,0,0.3);border:2px solid white;font-size:${isActive?18:14}px;cursor:pointer;transition:all 0.2s; position:relative; z-index: ${isActive?50:10};`;
        iconContent.innerHTML = `<i class="${iconClass}"></i>`;
        if (isActive) iconContent.classList.add('marker-active-jump');
        iconContent.onclick = () => {
          setActiveEventId(evId);
          mapInstance.panTo(markerPosition);
          openDetailModal(null, evId);
        };
        
        const customMarker = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          map: mapInstance,
          content: iconContent,
          yAnchor: 0.5,
          zIndex: isActive ? 50 : 10
        });
        
        markersRef.current.push(customMarker);
        
        
      }
    });

    // 만약 마운트 후 처음 데이터를 불러왔다면 지도를 최신 이벤트 위치로 옮김
    if (filteredEvents.length > 0 && !hasInitialPannedRef.current) {
      const firstEvent = filteredEvents[0];
      if (firstEvent.latitude && firstEvent.longitude) {
        const initialPos = new window.kakao.maps.LatLng(Number(firstEvent.latitude), Number(firstEvent.longitude));
        mapInstance.setCenter(initialPos);
        hasInitialPannedRef.current = true;
      }
    }
  }, [filteredEvents, mapInstance, activeEventId, navigate]);


  return (
    <div className="content-area" style={{display: "flex", flexDirection: "column", height: "calc(100vh - 60px)", overflow: "hidden"}}>

      <div className="dashboard-grid" style={{marginBottom: "16px", flexShrink: 0}}>
        <div className="panel summary-card span-3">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div className="summary-title">온라인 장치</div>
              <div className="summary-value" style={{display:"flex", alignItems:"center", gap:"8px", color: "#10b981"}}>
                {summary?.active_devices || deviceCount} <span style={{fontSize: "1rem", color: "var(--text-muted)", fontWeight: "500"}}>대 작동중</span>
              </div>
            </div>
            <div style={{width:'46px', height:'46px', borderRadius:'12px', background:'rgba(16, 185, 129, 0.12)', color:'#10b981', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'}}>
              <i className="fas fa-satellite-dish"></i>
            </div>
          </div>
        </div>
        <div className="panel summary-card span-3">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div className="summary-title">현재 경고 (발생/진행)</div>
              <div className="summary-value" style={{color: "#f59e0b"}}>{events.length} <span style={{fontSize: "1rem", color: "var(--text-muted)", fontWeight: "500"}}>건</span></div>
            </div>
            <div style={{width:'46px', height:'46px', borderRadius:'12px', background:'rgba(245, 158, 11, 0.12)', color:'#f59e0b', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'}}>
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>
        </div>
        <div className="panel summary-card span-3">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div className="summary-title">금일 등록 감지</div>
              <div className="summary-value" style={{color: "var(--primary-color)"}}>{summary?.total_detections_today || 0} <span style={{fontSize: "1rem", color: "var(--text-muted)", fontWeight: "500"}}>건</span></div>
            </div>
            <div style={{width:'46px', height:'46px', borderRadius:'12px', background:'rgba(29, 49, 98, 0.08)', color:'var(--primary-color)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'}}>
              <i className="fas fa-search-location"></i>
            </div>
          </div>
        </div>
        <div className="panel summary-card span-3">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div className="summary-title">자동 신고 완료</div>
              <div className="summary-value" style={{color: "#3b82f6"}}>{summary?.completed_reports || events.length} <span style={{fontSize: "1rem", color: "var(--text-muted)", fontWeight: "500"}}>건</span></div>
            </div>
            <div style={{width:'46px', height:'46px', borderRadius:'12px', background:'rgba(59, 130, 246, 0.12)', color:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'}}>
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="panel" style={{flex: 1, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", minHeight: 0}}>
        {/* 통합 헤더 및 필터 영역 */}
        <div className="map-header-wrap" style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", borderBottom: "1px solid #e2e8f0", background: "#ffffff", flexShrink: 0}}>
          <div style={{fontWeight: 600, fontSize: "1.1rem", color: "var(--text-main)", display: "flex", alignItems: "center"}}>
            위험 위치 통합 모니터링
          </div>
          <div className="filter-group" style={{gap: "10px", margin: 0}}>
            <CustomSelect options={["위험 유형 전체", "블랙아이스", "포트홀", "장애물"]} value={typeFilter} onChange={setTypeFilter} style={{width: "150px"}} />
            <CustomSelect options={[
              { value: '', label: '위험도 전체' },
              { value: 'HIGH', label: '높음', color: '#ef4444' },
              { value: 'LOW', label: '낮음', color: '#eab308' }
            ]} value={riskFilter} onChange={setRiskFilter} style={{width: "140px"}} />
            <CustomSelect options={["전체 기간", "오늘", "최근 1주일", "최근 1개월"]} value={periodFilter} onChange={setPeriodFilter} style={{width: "130px"}} />
            <div className="search-box" style={{marginLeft: "4px"}}>
              <input type="text" className="form-input" placeholder="위치 또는 ID 검색" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleKeyDown} style={{width: "180px"}} />
              <button className="btn-primary" onClick={handleSearch}>검색</button>
            </div>
          </div>
        </div>

        {/* 지도 및 리스트 영역 */}
        <div className="map-body-wrap" style={{display: "flex", flex: 1, minHeight: 0}}>
          {/* 감지 위치 목록 (좌측) */}
          <div className="map-list-wrap" style={{width: "340px", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", background: "#f8fafc"}}>
            <div style={{padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff"}}>
              <span style={{fontWeight: 600, color: "var(--text-main)", fontSize: "1rem"}}>목록</span>
              <span className="badge neutral">{filteredEvents.length}건</span>
            </div>
            <div style={{flex: 1, overflowY: "auto", padding: "12px"}}>
              {filteredEvents.length === 0 ? (
                <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8", gap: "8px"}}>
                  <i className="fas fa-search" style={{fontSize: "1.5rem"}}></i>
                  <p style={{margin: 0}}>조건에 맞는 감지 기록이 없습니다.</p>
                </div>
              ) : (
                filteredEvents.map(ev => (
                  <div key={ev.event_id||ev.detection_id||ev.id||ev._id} className={`list-item ${navigatingId === (ev.event_id||ev.detection_id||ev.id||ev._id) ? 'navigating-out' : ''}`} onClick={(e) => { handlePanTo(ev); openDetailModal(e, ev.event_id||ev.detection_id||ev.id||ev._id); }} style={{background: activeEventId === (ev.event_id||ev.detection_id||ev.id||ev._id) ? "rgba(29, 49, 98, 0.05)" : "#ffffff", border: activeEventId === (ev.event_id||ev.detection_id||ev.id||ev._id) ? "1px solid var(--primary-color)" : "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", marginBottom: "12px", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.02)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"10px",alignItems:"center"}}>
                      <span className="badge medium" style={{background: "transparent", color: (ev.risk_level||'').toUpperCase()==='LOW' ? '#eab308' : '#ef4444', display:"inline-flex", alignItems:"center", gap:"6px"}}><i className={getHazardIcon(ev.obstacle_type || ev.event_type || ev.type)}></i> {getKoreanType(ev.obstacle_type || ev.event_type || ev.type)}</span>
                      <button className="detail-link-btn" onClick={(e) => handleNavigateDetail(e, ev.event_id||ev.detection_id||ev.id||ev._id)}>상세보기 <span className="arrow">&rarr;</span></button>
                    </div>
                    <div style={{fontWeight:"600",color:"var(--text-main)",fontSize:"0.95rem",lineHeight:"1.4",marginBottom:"6px"}}>{addresses[ev.event_id||ev.detection_id||ev.id||ev._id] || formatAddress(ev.address||ev.location, ev.latitude, ev.longitude)}</div>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <div style={{fontSize:"0.8rem",color:"#94a3b8"}}><i className="fas fa-map-marker-alt"></i> {ev.latitude||'-'}, {ev.longitude||'-'}</div>
                      <span style={{fontSize:"0.85rem",color:"var(--text-muted)"}}>
                        {ev.first_detected_at||ev.detected_at||ev.created_at 
                          ? (() => {
                              const d = new Date(ev.first_detected_at||ev.detected_at||ev.created_at);
                              const m = d.getMonth() + 1;
                              const day = d.getDate();
                              const timeStr = d.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});
                              return `${m}월 ${day}일 ${timeStr}`;
                            })() 
                          : '-'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 카카오맵 (우측) */}
          <div className="map-container-wrap" style={{flex: 1, position: "relative", background: "#f1f5f9"}}>
            <div id="kakao-map" style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}></div>
          </div>
        </div>
      </div>
      <DetectionDetailModal isOpen={isDetailModalOpen} id={modalDetectionId} onClose={() => setIsDetailModalOpen(false)} />
    </div>
  );
}
