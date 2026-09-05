import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from "../components/common/CustomSelect";
import { deviceService } from '../services/deviceService';

export default function DeviceList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('네트워크 상태 전체');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await deviceService.getDevices();
        setItems(Array.isArray(data) ? data : (data?.devices || data?.items || []));
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const filteredItems = items.filter(d => {
    let matchesSearch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const id = String(d.device_id||d.id||d._id||'').toLowerCase();
      matchesSearch = id.includes(term);
    }
    
    let matchesStatus = true;
    if (statusFilter !== '네트워크 상태 전체') {
      const isOnline = (d.camera_status||'').toLowerCase()==='active' || (d.gps_status||'').toLowerCase()==='active' || (d.network_status||'').toLowerCase()==='active' || (d.status||'').toLowerCase()==='online';
      if (statusFilter === '연결됨 (Online)' && !isOnline) matchesStatus = false;
      if (statusFilter === '연결 끊김 (Offline)' && isOnline) matchesStatus = false;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="content-area">
      <div className="page-header-wrap">
        <div className="page-title">장치 상태 관리</div>
        <div className="page-subtitle">차량에 부착된 AI Edge 단말기의 실시간 센서 및 네트워크 상태를 모니터링합니다.</div>
      </div>

      <div className="panel">
        <div className="board-filters">
          <div className="filter-group">
            <CustomSelect options={["네트워크 상태 전체", "연결됨 (Online)", "연결 끊김 (Offline)"]} value={statusFilter} onChange={setStatusFilter} />
            <div className="search-box">
              <input type="text" className="form-input" placeholder="장치 ID 검색" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleKeyDown} />
              <button className="btn-primary" onClick={handleSearch}>검색</button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{width:"40px",textAlign:"center"}}><input type="checkbox" /></th>
                <th>장치 ID</th>
                <th>카메라</th>
                <th>GPS</th>
                <th>레이더</th>
                <th>최종 통신</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}></td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign:"center",padding:"40px",color:"#94a3b8"}}>등록된 장치가 없습니다.</td></tr>
              ) : filteredItems.map((d) => (
                <tr key={d.device_id||d.id||d._id} onClick={()=>navigate(`/devices/${d.device_id||d.id||d._id}`)} style={{cursor:"pointer"}}>
                  <td style={{textAlign:"center"}} onClick={e=>e.stopPropagation()}><input type="checkbox" /></td>
                  <td style={{fontWeight:"500"}}>{d.device_id||d.id||d._id||'-'}</td>
                  <td><span className={`badge ${(d.camera_status||'').toLowerCase()==='active'?'low':'high'}`}>{d.camera_status||'-'}</span></td>
                  <td><span className={`badge ${(d.gps_status||'').toLowerCase()==='active'?'low':'high'}`}>{d.gps_status||'-'}</span></td>
                  <td><span className={`badge ${(d.radar_status||'').toLowerCase()==='active'?'low':'high'}`}>{d.radar_status||'-'}</span></td>
                  <td>{d.last_connected_at||d.updated_at ? new Date(d.last_connected_at||d.updated_at).toLocaleString('ko-KR') : '-'}</td>
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
