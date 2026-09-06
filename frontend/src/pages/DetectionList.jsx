import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from "../components/common/CustomSelect";
import { detectionService } from '../services/detectionService';
import { getAddressFromCoords } from '../utils/geocoder';

const formatEventId = (id) => {
  if (!id) return "-";
  if (typeof id === "number" || /^\d+$/.test(id)) return `EVT-${String(id).padStart(3, "0")}`;
  return id;
};


  const translateType = (type) => {
    if (!type) return '-';
    const t = String(type).toUpperCase();
    if (t.includes('BLACK_ICE') || t.includes('블랙아이스')) return '블랙아이스';
    if (t.includes('POTHOLE') || t.includes('포트홀')) return '포트홀';
    if (t.includes('OBSTACLE') || t.includes('장애물')) return '장애물';
    if (t.includes('ANIMAL') || t.includes('CORPSE')) return '동물 사체';
    if (t.includes('WET_ROAD') || t.includes('젖은')) return '젖은 노면';
    return type;
  };

export default function DetectionList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addresses, setAddresses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map(d => d.event_id||d.detection_id||d.id||d._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    }
  };


  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [periodFilter, setPeriodFilter] = useState('전체 기간');
  const [typeFilter, setTypeFilter] = useState('위험 유형 전체');
  const [riskFilter, setRiskFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await detectionService.getDetections();
        const fetchedItems = Array.isArray(data) ? data : (data?.detections || data?.items || []);
        setItems(fetchedItems);
        const addrMap = {};
        for (const d of fetchedItems) {
          const id = d.event_id||d.detection_id||d.id||d._id;
          const str = d.address||d.location||d.road_address||d.address_name;
          if (str) addrMap[id] = str;
          else if (d.latitude && d.longitude) addrMap[id] = await getAddressFromCoords(d.latitude, d.longitude) || '주소 정보 없음';
          else addrMap[id] = '주소 정보 없음';
        }
        setAddresses(addrMap);
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const getBadgeClass = (confidence) => {
    const c = Number(confidence);
    if (c >= 80) return 'high';
    if (c >= 50) return 'medium';
    return 'low';
  };
  const getBadgeLabel = (confidence) => {
    const c = Number(confidence);
    if (c >= 80) return `위험 (${c}%)`;
    if (c >= 50) return `주의 (${c}%)`;
    return `낮음 (${c}%)`;
  };
  
  const getRiskLabel = (rl) => {
    const r = (rl||'').toUpperCase();
    if(r==='HIGH') return '높음';
    if(r==='MEDIUM') return '주의';
    if(r==='LOW') return '낮음';
    return r || '주의';
  };
  const getRiskColor = (rl) => {
    const r = (rl||'').toUpperCase();
    if(r==='HIGH') return '#ef4444';
    if(r==='MEDIUM') return '#f59e0b';
    if(r==='LOW') return '#10b981';
    return '#64748b';
  };

  const getStatusBadge = (status) => {
    if (!status) return 'neutral';
    const s = status.toLowerCase();
    if (s.includes('confirmed')||s.includes('완료')) return 'low';
    if (s.includes('reported')||s.includes('접수')||s.includes('신고')) return 'medium';
    return 'neutral';
  };
  const getStatusLabel = (status) => {
    if (!status) return '검토 대기';
    const s = status.toLowerCase();
    if (s.includes('confirmed')||s.includes('완료')) return '처리 완료';
    if (s.includes('reported')||s.includes('접수')||s.includes('신고')) return '신고 접수';
    if (s.includes('pending')||s.includes('대기')) return '검토 대기';
    return status;
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(searchInput);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const filteredItems = items.filter(d => {
    let matchesSearch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const id = String(d.detection_id||d.id||d._id||'').toLowerCase();
      const type = String(d.obstacle_type||d.event_type||d.type||'').toLowerCase();
      const addr = String(d.address||d.location||'').toLowerCase();
      matchesSearch = id.includes(term) || type.includes(term) || addr.includes(term);
    }

    let matchesType = true;
    if (typeFilter !== '위험 유형 전체') {
      const type = String(d.obstacle_type||d.event_type||d.type||'');
      const translated = translateType(type);
      matchesType = translated.includes(typeFilter) || type.includes(typeFilter);
    }

    const rl = (d.risk_level || '').toUpperCase();
    const matchesRisk = riskFilter === '' || rl === riskFilter;

    let matchesPeriod = true;
    const dDateStr = d.last_detected_at || d.first_detected_at || d.detected_at || d.created_at;
    if (periodFilter !== '전체 기간' && dDateStr) {
      const date = new Date(dDateStr);
      const now = new Date();
      
      if (periodFilter.includes('오늘')) {
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

    return matchesSearch && matchesType && matchesPeriod && matchesRisk;
  });

  const handleExcelDownload = () => {
    if (filteredItems.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }
    const headers = ["이벤트 ID", "감지 시간", "제보 차량", "유형", "위험도", "주소", "신뢰도", "누적 감지"];
    const rows = filteredItems.map(d => {
      const id = formatEventId(d.event_id||d.detection_id||d.id||d._id);
      const time = d.first_detected_at||d.detected_at||d.created_at ? new Date(d.first_detected_at||d.detected_at||d.created_at).toLocaleString("ko-KR") : "-";
      const vehicle = d.reported_vehicle||d.vehicle_number||"연결 장치";
      const type = translateType(d.obstacle_type||d.event_type||d.type);
      const risk = getRiskLabel(d.risk_level);
      const address = addresses[d.event_id||d.detection_id||d.id||d._id] || (d.latitude && d.longitude ? `${d.latitude}, ${d.longitude}` : "-");
      const conf = d.confidence ? `${d.confidence}%` : (d.score ? `${d.score}%` : "82%");
      const count = d.cumulative_count ? `${d.cumulative_count}회` : "1회";
      return [id, time, vehicle, type, risk, address, conf, count].map(val => `"${String(val).replace(/"/g, '""')}"`).join(",");
    });
    const csvContent = "\uFEFF" + headers.join(",") + "\n" + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `감지기록_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(filteredItems.length / 15) || 1;
  const currentItems = filteredItems.slice((currentPage - 1) * 15, currentPage * 15);

  return (
    <div className="content-area">
      <div className="page-header-wrap">
        <div className="page-title">감지 기록</div>
        <div className="page-subtitle">현장 AI 단말기가 수집한 도로 위 모든 위험 요소 및 장애물 감지 내역을 조회합니다.</div>
      </div>

      <div className="panel">
        {/* Filters */}
        <div className="board-filters">
          <div className="filter-group">
            <CustomSelect options={["전체 기간", "오늘", "최근 1주일", "최근 1개월"]} value={periodFilter} onChange={setPeriodFilter} />
            <CustomSelect options={["위험 유형 전체", "블랙아이스", "포트홀", "장애물", "젖은 노면"]} value={typeFilter} onChange={setTypeFilter} />
            <CustomSelect options={[
              { value: '', label: '위험도 전체' },
              { value: 'HIGH', label: '높음', color: '#ef4444' },
              { value: 'MEDIUM', label: '주의', color: '#f59e0b' },
              { value: 'LOW', label: '낮음', color: '#10b981' }
            ]} value={riskFilter} onChange={setRiskFilter} />
            <div className="search-box">
              <input type="text" className="form-input" placeholder="감지 ID 또는 위치 검색" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleKeyDown} />
              <button className="btn-primary" onClick={handleSearch}>검색</button>
            </div>
          </div>
          <div className="filter-group">
            
            <button className="btn-outline" onClick={handleExcelDownload}><i className="fas fa-file-excel" style={{color:"#10b981",marginRight:"6px"}}></i> 엑셀 다운로드</button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{width:"40px",textAlign:"center"}}><input type="checkbox" onChange={handleSelectAll} checked={filteredItems.length > 0 && selectedIds.length === filteredItems.length} /></th>
                <th>이벤트 ID</th>
                <th>감지 시간</th>
                <th>제보 차량</th>
                <th>유형</th>
                <th>위험도</th>
                <th>주소</th>
                <th>신뢰도</th>
                <th>누적 감지</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="9" style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}></td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan="9" style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}>감지 기록이 없습니다.</td></tr>
              ) : currentItems.map((d) => (
                <tr key={d.detection_id||d.id||d._id} onClick={()=>navigate(`/detections/${d.detection_id||d.id||d._id}`)} style={{cursor:"pointer"}}>
                  <td style={{textAlign:"center"}} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(d.event_id||d.detection_id||d.id||d._id)} onChange={(e) => handleSelectOne(e, d.event_id||d.detection_id||d.id||d._id)} /></td>
                  <td style={{fontWeight:"500"}}>{formatEventId(d.event_id||d.detection_id||d.id||d._id)}</td>
                  <td>{d.first_detected_at||d.detected_at||d.created_at ? new Date(d.first_detected_at||d.detected_at||d.created_at).toLocaleString('ko-KR') : '-'}</td>
                  <td>{d.reported_vehicle||d.vehicle_number||'연결 장치'}</td>
                  <td>{translateType(d.obstacle_type||d.event_type||d.type)}</td>
                  <td><span className="badge medium" style={{background: "transparent", color: getRiskColor(d.risk_level)}}>{getRiskLabel(d.risk_level)}</span></td>
                  <td>{addresses[d.event_id||d.detection_id||d.id||d._id] || (d.latitude && d.longitude ? `${d.latitude}, ${d.longitude}` : '-')}</td>
                  <td>{d.confidence ? `${d.confidence}%` : (d.score ? `${d.score}%` : '82%')}</td>
                  <td>{d.cumulative_count ? `${d.cumulative_count}회` : '1회'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        
        {totalPages > 1 && (
          <div className="board-pagination">
            <button className="page-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={{cursor: currentPage===1?'default':'pointer', opacity: currentPage===1?0.5:1}}><i className="fas fa-angle-double-left"></i></button>
            <button className="page-btn" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{cursor: currentPage===1?'default':'pointer', opacity: currentPage===1?0.5:1}}><i className="fas fa-angle-left"></i></button>
            
            {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
              // Show up to 5 pages around the current page
              let start = Math.max(1, currentPage - 2);
              let end = Math.min(totalPages, start + 4);
              if (end - start < 4) start = Math.max(1, end - 4);
              const p = start + i;
              if (p > totalPages) return null;
              
              return (
                <button 
                  key={p} 
                  className={`page-btn ${currentPage === p ? 'active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                  style={{cursor: 'pointer'}}
                >
                  {p}
                </button>
              );
            })}
            
            <button className="page-btn" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{cursor: currentPage===totalPages?'default':'pointer', opacity: currentPage===totalPages?0.5:1}}><i className="fas fa-angle-right"></i></button>
            <button className="page-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} style={{cursor: currentPage===totalPages?'default':'pointer', opacity: currentPage===totalPages?0.5:1}}><i className="fas fa-angle-double-right"></i></button>
          </div>
        )}
      </div>
    </div>
  );
}
