import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from "../components/common/CustomSelect";
import { vehicleService } from '../services/vehicleService';

export default function VehicleList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('차량 상태 전체');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await vehicleService.getVehicles();
        setItems(Array.isArray(data) ? data : (data?.vehicles || data?.items || []));
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(searchInput);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const filteredItems = items.filter(v => {
    let matchesSearch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const plate = String(v.plate_number||v.license_plate||'').toLowerCase();
      const district = String(v.district||v.area||v.department||'').toLowerCase();
      const driver = String(v.driver_name||v.last_driver||'').toLowerCase();
      matchesSearch = plate.includes(term) || district.includes(term) || driver.includes(term);
    }
    
    let matchesStatus = true;
    if (statusFilter !== '차량 상태 전체') {
      const status = String(v.status||'');
      if (statusFilter === '운행 중' && !status.includes('운행') && status.toLowerCase() !== 'active') matchesStatus = false;
      if (statusFilter === '대기 중' && !status.includes('대기') && !status.includes('idle')) matchesStatus = false;
      if (statusFilter === '수리/점검' && !status.includes('수리') && !status.includes('점검')) matchesStatus = false;
    }

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredItems.length / 15) || 1;
  const currentItems = filteredItems.slice((currentPage - 1) * 15, currentPage * 15);

  return (
    <div className="content-area">
      <div className="page-header-wrap">
        <div className="page-title">차량 관리</div>
        <div className="page-subtitle">순찰 차량과 센서 단말기 장착 현황을 조회하고 관리합니다.</div>
      </div>

      <div className="panel">
        <div className="board-filters">
          <div className="filter-group">
            <CustomSelect options={["차량 상태 전체", "운행 중", "대기 중", "수리/점검"]} value={statusFilter} onChange={setStatusFilter} />
            <div className="search-box">
              <input type="text" className="form-input" placeholder="차량 번호, 운전자, 구역 검색" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleKeyDown} />
              <button className="btn-primary" onClick={handleSearch}>검색</button>
            </div>
          </div>
          <div className="filter-group">
            <button className="btn-primary"><i className="fas fa-plus"></i> 차량 등록</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{width:"40px",textAlign:"center"}}><input type="checkbox" /></th>
                <th>차량 번호</th>
                <th>관할 구역</th>
                <th>할당 장치 (Device ID)</th>
                <th>최근 운전자</th>
                <th>현재 상태</th>
                <th>누적 주행거리</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="8" style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}></td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan="8" style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}>등록된 차량이 없습니다.</td></tr>
              ) : currentItems.map((v) => (
                <tr key={v.vehicle_id||v.id||v._id} onClick={()=>navigate(`/vehicles/${v.vehicle_id||v.id||v._id}`)} style={{cursor:"pointer"}}>
                  <td style={{textAlign:"center"}} onClick={e=>e.stopPropagation()}><input type="checkbox" /></td>
                  <td style={{fontWeight:"500"}}>{v.plate_number||v.license_plate||'-'}</td>
                  <td>{v.district||v.area||v.department||'-'}</td>
                  <td>{v.device_id||'-'}</td>
                  <td>{v.driver_name||v.last_driver||'-'}</td>
                  <td><span className={`badge ${(v.status||'').toLowerCase().includes('운행')||(v.status||'').toLowerCase()==='active'?'low':'neutral'}`}>{v.status||'-'}</span></td>
                  <td>{v.mileage||v.total_distance||'-'}</td>
                  <td onClick={e=>e.stopPropagation()}>
                    <div className="action-buttons">
                      <button className="btn-small" onClick={()=>navigate(`/vehicles/${v.vehicle_id||v.id||v._id}`)}>상세</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        {totalPages > 1 && (
          <div className="board-pagination">
            <button className="page-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1} style={{cursor: currentPage===1?'default':'pointer', opacity: currentPage===1?0.5:1}}><i className="fas fa-angle-double-left"></i></button>
            <button className="page-btn" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{cursor: currentPage===1?'default':'pointer', opacity: currentPage===1?0.5:1}}><i className="fas fa-angle-left"></i></button>
            
            {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
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
