import React, { useState, useEffect } from 'react';
import CustomSelect from "../components/common/CustomSelect";
import { useNavigate } from 'react-router-dom';
import { reportService } from '../services/reportService';
import { getAddressFromCoords } from '../utils/geocoder';


const formatAddress = (addr, lat, lng) => {
  if (!addr) {
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
  return str;
};

export default function ReportList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map(d => d.report_id||d.id||d._id));
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

  const [addresses, setAddresses] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await reportService.getReports();
        const fetchedItems = Array.isArray(data) ? data : (data?.reports || data?.items || []);
        setItems(fetchedItems);
        
        try {
          const addrMap = {};
          for (const d of fetchedItems) {
            const id = d.report_id||d.id||d._id;
            const addr = d.address || d.location || d.road_address || d.address_name;
            if (addr && addr !== 'null' && !/GPS/i.test(addr) && !/POINT/i.test(addr)) {
              addrMap[id] = formatAddress(addr, d.latitude, d.longitude);
            } else if (d.latitude && d.longitude) {
              addrMap[id] = await getAddressFromCoords(d.latitude, d.longitude) || '주소 정보 없음';
            } else {
              addrMap[id] = '주소 정보 없음';
            }
          }
          setAddresses(addrMap);
        } catch (e) {
          console.warn('Geocoding error in report list:', e);
        }
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  
  const translateType = (type) => {
    if (!type) return '-';
    const t = String(type).toUpperCase();
    if (t.includes('BLACK_ICE') || t.includes('블랙아이스')) return '블랙아이스';
    if (t.includes('POTHOLE') || t.includes('포트홀')) return '포트홀';
    if (t.includes('OBSTACLE') || t.includes('장애물')) return '장애물';
    if (t.includes('ANIMAL') || t.includes('CORPSE')) return '동물 사체';
    return type;
  };

  const getStatusBadge = (status) => {
    if (!status) return 'neutral';
    const s = status.toLowerCase();
    if (s.includes('완료')||s.includes('approved')||s.includes('접수')) return 'low';
    if (s.includes('반려')||s.includes('rejected')) return 'high';
    return 'neutral';
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(searchInput);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const filteredItems = items.filter(r => {
    let matchesSearch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const id = String(r.report_id||r.id||r._id||'').toLowerCase();
      const author = String(r.author||r.created_by||'').toLowerCase();
      const title = String(r.title||r.subject||'').toLowerCase();
      matchesSearch = id.includes(term) || author.includes(term) || title.includes(term);
    }
    
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="content-area">
      <div className="page-header-wrap">
        <div className="page-title">신고 문서 관리</div>
        <div className="page-subtitle">도로 관리 부서 및 지자체로 발송될 위험 요소 긴급 신고 문서의 결재 현황을 관리합니다.</div>
      </div>

      <div className="panel">
        <div className="board-filters">
          <div className="filter-group">
            <div className="search-box">
              <input type="text" className="form-input" placeholder="문서 번호 또는 담당자 검색" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleKeyDown} />
              <button className="btn-primary" onClick={handleSearch}>검색</button>
            </div>
            <CustomSelect 
              options={[
                { value: 10, label: '10개씩 보기' },
                { value: 15, label: '15개씩 보기' },
                { value: 30, label: '30개씩 보기' },
                { value: 50, label: '50개씩 보기' },
                { value: 100, label: '100개씩 보기' }
              ]} 
              value={itemsPerPage} 
              onChange={(val) => { setItemsPerPage(Number(val)); setCurrentPage(1); }} 
            />
          
            
          </div>
          
        </div>

        <div className="table-responsive">
          <table className="data-table">
                        <thead>
              <tr>
                <th style={{width:"40px",textAlign:"center"}}><input type="checkbox" onChange={handleSelectAll} checked={filteredItems.length > 0 && selectedIds.length === filteredItems.length} /></th>
                <th>신고 ID</th>
                <th>유형</th>
                <th>위치</th>
                <th>감지 시간</th>
                <th>신고자</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}></td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}>신고 문서가 없습니다.</td></tr>
                                          ) : currentItems.map((r) => (
                <tr key={r.report_id||r.id||r._id} onClick={()=>navigate(`/reports/${r.report_id||r.id||r._id}`)} style={{cursor:"pointer"}}>
                  <td style={{textAlign:"center"}} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(r.report_id||r.id||r._id)} onChange={(e) => handleSelectOne(e, r.report_id||r.id||r._id)} /></td>
                  <td style={{fontWeight:"500"}}>{r.report_id||r.id||r._id||'-'}</td>
                  <td>{translateType(r.type||r.event_type||r.obstacle_type)}</td>
                  <td>{addresses[r.report_id||r.id||r._id] || formatAddress(r.address||r.location, r.latitude, r.longitude)}</td>
                  <td>{r.created_at ? new Date(r.created_at).toLocaleString('ko-KR') : '-'}</td>
                  <td>{r.author||r.created_by||'-'}</td>
                  <td><span className={`badge ${getStatusBadge(r.status)}`}>{r.status||'결재 대기'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '20px' }}>
          <div className="board-pagination" style={{ margin: 0, marginTop: 0 }}>
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
        </div>
      </div>
    </div>
  );
}
