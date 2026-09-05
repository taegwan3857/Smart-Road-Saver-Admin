import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { deviceService } from '../services/deviceService';
import CustomSelect from "../components/common/CustomSelect";

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [deviceCount, setDeviceCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [typeFilter, setTypeFilter] = useState('위험 유형 전체');
  const [riskFilter, setRiskFilter] = useState('위험도 전체');
  const [periodFilter, setPeriodFilter] = useState('전체 기간');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, eventsData, devicesData] = await Promise.all([
          dashboardService.getSummary().catch(() => null),
          dashboardService.getEvents().catch(() => []),
          deviceService.getDevices().catch(() => [])
        ]);
        const devList = Array.isArray(devicesData) ? devicesData : (devicesData?.items || []);
        if (devList.length > 0) setDeviceCount(devList.length);
        
        setSummary(summaryData);
        let list = Array.isArray(eventsData) ? eventsData : (eventsData?.events || eventsData?.items || []);
        list.sort((a, b) => {
          const timeA = new Date(a.created_at || a.detected_at || 0).getTime();
          const timeB = new Date(b.created_at || b.detected_at || 0).getTime();
          return timeB - timeA;
        });
        setEvents(list);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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
      const t = String(ev.event_type||ev.type||'');
      if (typeFilter === '장애물/낙하물' && !t.includes('장애물') && !t.includes('낙하물')) matchesType = false;
      else if (typeFilter !== '장애물/낙하물' && !t.includes(typeFilter)) matchesType = false;
    }

    let matchesRisk = true;
    if (riskFilter !== '위험도 전체') {
      const color = getTypeColor(ev.event_type||ev.type);
      if (riskFilter === '높음 (High)' && color !== 'danger') matchesRisk = false;
      if (riskFilter === '주의 (Medium)' && color !== 'warning') matchesRisk = false;
    }

    let matchesPeriod = true;
    if (periodFilter !== '전체 기간' && (ev.created_at||ev.detected_at)) {
      const date = new Date(ev.created_at||ev.detected_at);
      const now = new Date();
      const diffDays = (now - date) / (1000 * 60 * 60 * 24);
      if (periodFilter.includes('오늘') && diffDays > 1) matchesPeriod = false;
      if (periodFilter.includes('최근 1주일') && diffDays > 7) matchesPeriod = false;
      if (periodFilter.includes('최근 1개월') && diffDays > 30) matchesPeriod = false;
    }

    return matchesSearch && matchesType && matchesRisk && matchesPeriod;
  });

  useEffect(() => {
    const initMap = () => {
      if (!window.kakao || !window.kakao.maps) {
        setTimeout(initMap, 500);
        return;
      }
      window.kakao.maps.load(() => {
        const container = document.getElementById('kakao-map');
        if (!container) return;
        const options = {
          center: new window.kakao.maps.LatLng(37.4979, 127.0280),
          level: 4
        };
        const map = new window.kakao.maps.Map(container, options);
        
        filteredEvents.forEach(ev => {
          if (ev.latitude && ev.longitude) {
            const markerPosition = new window.kakao.maps.LatLng(ev.latitude, ev.longitude);
            const marker = new window.kakao.maps.Marker({ position: markerPosition });
            marker.setMap(map);
          }
        });
      });
    };
    initMap();
  }, [filteredEvents]);

  return (
    <div className="content-area">
      <div className="page-header-wrap">
        <div className="page-title">대시보드</div>
        <div className="page-subtitle">S.R.S 관제 시스템의 핵심 지표와 실시간 위험 감지 현황을 한눈에 파악합니다.</div>
      </div>

      <div className="dashboard-grid" style={{marginBottom: "24px"}}>
        <div className="panel summary-card span-3">
          <div className="summary-title">온라인 장치</div>
          <div className="summary-value text-success" style={{display:"flex", alignItems:"center", gap:"8px"}}>
            {summary?.active_devices || deviceCount} <span style={{fontSize: "1rem", color: "var(--text-muted)", fontWeight: "500"}}>대 작동중</span>
          </div>
        </div>
        <div className="panel summary-card span-3">
          <div className="summary-title">현재 경고 (발생/진행)</div>
          <div className="summary-value text-warning">{events.length} <span style={{fontSize: "1rem", color: "var(--text-muted)", fontWeight: "500"}}>건</span></div>
        </div>
        <div className="panel summary-card span-3">
          <div className="summary-title">금일 등록 감지</div>
          <div className="summary-value text-primary">{summary?.total_detections_today || 0} <span style={{fontSize: "1rem", color: "var(--text-muted)", fontWeight: "500"}}>건</span></div>
        </div>
        <div className="panel summary-card span-3">
          <div className="summary-title">자동 신고 완료</div>
          <div className="summary-value text-success">{summary?.completed_reports || events.length} <span style={{fontSize: "1rem", color: "var(--text-muted)", fontWeight: "500"}}>건</span></div>
        </div>
      </div>

      <div className="panel" style={{marginBottom: "24px", padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"}}>
        {/* 통합 헤더 및 필터 영역 */}
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #e2e8f0", background: "#ffffff"}}>
          <div style={{fontWeight: 600, fontSize: "1.1rem", color: "var(--text-main)", display: "flex", alignItems: "center"}}>
            위험 위치 통합 모니터링
          </div>
          <div className="filter-group" style={{gap: "10px", margin: 0}}>
            <CustomSelect options={["위험 유형 전체", "블랙아이스", "포트홀", "장애물", "젖은 노면"]} value={typeFilter} onChange={setTypeFilter} style={{width: "150px"}} />
            <CustomSelect options={["위험도 전체", "높음 (High)", "주의 (Medium)"]} value={riskFilter} onChange={setRiskFilter} style={{width: "140px"}} />
            <CustomSelect options={["전체 기간", "오늘", "최근 1주일", "최근 1개월"]} value={periodFilter} onChange={setPeriodFilter} style={{width: "130px"}} />
            <div className="search-box" style={{marginLeft: "4px"}}>
              <input type="text" className="form-input" placeholder="위치 또는 ID 검색" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleKeyDown} style={{width: "180px"}} />
              <button className="btn-primary" onClick={handleSearch}>검색</button>
            </div>
          </div>
        </div>

        {/* 지도 및 리스트 영역 */}
        <div style={{display: "flex", height: "600px"}}>
          {/* 감지 위치 목록 (좌측) */}
          <div style={{width: "340px", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", background: "#f8fafc"}}>
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
                  <div key={ev.event_id||ev.detection_id||ev.id||ev._id} className="list-item" onClick={() => navigate(`/detections/${ev.event_id||ev.detection_id||ev.id||ev._id}`)} style={{background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", marginBottom: "12px", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.02)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"10px",alignItems:"center"}}>
                      <span className="badge medium" style={{background: getTypeColor(ev.event_type||ev.type)==='danger'?'var(--color-danger)':'var(--color-warning)', color:"#fff"}}>{ev.event_type||ev.type||'위험 요소'}</span>
                      <span style={{fontSize:"0.85rem",color:"var(--text-muted)"}}>{ev.detected_at||ev.created_at ? new Date(ev.detected_at||ev.created_at).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}) : '-'}</span>
                    </div>
                    <div style={{fontWeight:"600",color:"var(--text-main)",fontSize:"0.95rem",lineHeight:"1.4",marginBottom:"6px"}}>{ev.address||ev.location||'위치 정보 없음'}</div>
                    <div style={{fontSize:"0.8rem",color:"#94a3b8"}}><i className="fas fa-map-marker-alt"></i> {ev.latitude||'-'}, {ev.longitude||'-'}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 카카오맵 (우측) */}
          <div style={{flex: 1, position: "relative", background: "#f1f5f9", minHeight: "600px"}}>
            <div id="kakao-map" style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%"}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
