import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from "../components/common/CustomSelect";
import { reportService } from '../services/reportService';

export default function ReportList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
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
  const [statusFilter, setStatusFilter] = useState('진행 상태 전체');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await reportService.getReports();
        setItems(Array.isArray(data) ? data : (data?.reports || data?.items || []));
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    if (!status) return 'neutral';
    const s = status.toLowerCase();
    if (s.includes('완료')||s.includes('approved')||s.includes('접수')) return 'low';
    if (s.includes('반려')||s.includes('rejected')) return 'high';
    return 'neutral';
  };

  const handleSearch = () => {
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
    
    let matchesStatus = true;
    if (statusFilter !== '진행 상태 전체') {
      const status = String(r.status||'결재 대기');
      matchesStatus = status.includes(statusFilter);
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="content-area">
      <div className="page-header-wrap">
        <div className="page-title">신고 문서 관리</div>
        <div className="page-subtitle">도로 관리 부서 및 지자체로 발송될 위험 요소 긴급 신고 문서의 결재 현황을 관리합니다.</div>
      </div>

      <div className="panel">
        <div className="board-filters">
          <div className="filter-group">
            <CustomSelect options={["진행 상태 전체", "결재 대기", "승인 완료", "접수 완료", "반려"]} value={statusFilter} onChange={setStatusFilter} />
            <div className="search-box">
              <input type="text" className="form-input" placeholder="문서 번호 또는 담당자 검색" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleKeyDown} />
              <button className="btn-primary" onClick={handleSearch}>검색</button>
            </div>
          </div>
          
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{width:"40px",textAlign:"center"}}><input type="checkbox" onChange={handleSelectAll} checked={filteredItems.length > 0 && selectedIds.length === filteredItems.length} /></th>
                <th>문서 번호</th>
                <th>기안 일시</th>
                <th>제목 (위험 유형)</th>
                <th>관련 감지 ID</th>
                <th>담당자</th>
                <th>결재 상태</th>
                
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="8" style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}></td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan="8" style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}>신고 문서가 없습니다.</td></tr>
              ) : filteredItems.map((r) => (
                <tr key={r.report_id||r.id||r._id} onClick={()=>navigate(`/reports/${r.report_id||r.id||r._id}`)} style={{cursor:"pointer"}}>
                  <td style={{textAlign:"center"}} onClick={e=>e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(r.report_id||r.id||r._id)} onChange={(e) => handleSelectOne(e, r.report_id||r.id||r._id)} /></td>
                  <td style={{fontWeight:"500"}}>{r.report_id||r.id||r._id||'-'}</td>
                  <td>{r.created_at ? new Date(r.created_at).toLocaleString('ko-KR') : '-'}</td>
                  <td style={{textAlign:"left"}}>{r.title||r.subject||'-'}</td>
                  <td>{r.event_id||r.detection_id||'-'}</td>
                  <td>{r.author||r.created_by||'-'}</td>
                  <td><span className={`badge ${getStatusBadge(r.status)}`}>{r.status||'결재 대기'}</span></td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="board-pagination">
          <a href="#" className="page-btn"><i className="fas fa-angle-left"></i></a>
          <a href="#" className="page-btn active">1</a>
          <a href="#" className="page-btn"><i className="fas fa-angle-right"></i></a>
        </div>
      </div>
    </div>
  );
}
