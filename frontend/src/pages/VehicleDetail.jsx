import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try { setData(await vehicleService.getVehicle(id)); }
      catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, [id]);

  if (isLoading) return <div className="content-area"><div style={{padding:"60px",textAlign:"center",color:"#94a3b8"}}></div></div>;
  if (!data) return <div className="content-area"><div style={{padding:"60px",textAlign:"center",color:"#94a3b8"}}>차량 정보를 찾을 수 없습니다.</div></div>;

  return (
    <div className="content-area">
      <div className="page-header-wrap" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div className="page-title" style={{marginBottom:"4px"}}>차량 상세 정보</div>
          <div className="page-subtitle">관제 차량의 배차 정보 및 연동 장치 상태를 확인합니다.</div>
        </div>
        <button className="btn-back" onClick={()=>navigate('/vehicles')}><i className="fas fa-list"></i> 목록으로</button>
      </div>

      {/* 프로필 헤더 */}
      <div className="profile-header">
        <div className="profile-avatar"><i className="fas fa-truck"></i></div>
        <div className="profile-info">
          <div className="profile-title">
            {data.plate_number||data.license_plate||'-'} <span className={`badge ${(data.status||'').toLowerCase().includes('운행')||(data.status||'').toLowerCase()==='active'?'low':'neutral'}`}>{data.status||'-'}</span>
          </div>
          <div className="profile-meta">
            <span><i className="fas fa-map-marker-alt"></i> 관할: {data.district||data.area||data.department||'-'}</span>
            <span><i className="fas fa-user"></i> 현재 배차: {data.driver_name||data.last_driver||'-'}</span>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn-outline"><i className="fas fa-exchange-alt"></i> 배차 변경</button>
        </div>
      </div>

      <div className="detail-cards-grid">
        {/* 차량 제원 */}
        <div className="detail-card">
          <div className="detail-card-title"><i className="fas fa-car"></i> 차량 제원 및 상태</div>
          <div className="info-grid" style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <div className="info-item">
              <div className="info-label">차종</div>
              <div className="info-value">{data.model||data.vehicle_type||'-'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">연식</div>
              <div className="info-value">{data.year||data.model_year||'-'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">총 주행거리</div>
              <div className="info-value">{data.mileage||data.total_distance||'-'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">최종 정비일</div>
              <div className="info-value">{data.last_maintenance ? new Date(data.last_maintenance).toLocaleDateString('ko-KR') : '-'}</div>
            </div>
          </div>
        </div>

        {/* 연동 장치 */}
        <div className="detail-card">
          <div className="detail-card-title"><i className="fas fa-microchip"></i> 연동 AI 장치 (Device)</div>
          <div style={{display:"flex",alignItems:"center",gap:"16px",padding:"16px",background:"#f8fafc",border:"1px solid var(--border-light)",borderRadius:"8px",marginBottom:"16px"}}>
            <div style={{fontSize:"2rem",color:"var(--primary-color)"}}><i className="fas fa-server"></i></div>
            <div style={{flex:"1"}}>
              <div style={{fontWeight:"700",fontSize:"1.05rem",marginBottom:"4px"}}>{data.device_id||'-'}</div>
              <div style={{color:"var(--text-muted)",fontSize:"0.9rem"}}>{data.device_model||'단말기 정보 없음'}</div>
            </div>
            <div><span className="badge low">{data.device_status||'연결 상태 미확인'}</span></div>
          </div>

          <table className="log-table">
            <thead>
              <tr><th>장치 센서</th><th>상태</th><th>최종 동기화</th></tr>
            </thead>
            <tbody>
              {(data.sensors||[]).length > 0 ? data.sensors.map((s,i) => (
                <tr key={i}>
                  <td>{s.name||'-'}</td>
                  <td><span className="badge low" style={{background:"transparent",padding:"0"}}>{s.status||'-'}</span></td>
                  <td>{s.last_sync||'-'}</td>
                </tr>
              )) : (
                <>
                  <tr><td>전방 카메라</td><td><span className="badge low" style={{background:"transparent",padding:"0"}}>-</span></td><td>-</td></tr>
                  <tr><td>mmWave 레이다</td><td><span className="badge low" style={{background:"transparent",padding:"0"}}>-</span></td><td>-</td></tr>
                  <tr><td>GPS 모듈</td><td><span className="badge low" style={{background:"transparent",padding:"0"}}>-</span></td><td>-</td></tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
