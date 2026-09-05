import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deviceService } from '../services/deviceService';

export default function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deviceData, healthData] = await Promise.all([
          deviceService.getDevice(id),
          deviceService.getDeviceHealth(id).catch(() => null)
        ]);
        setData(deviceData);
        setHealth(healthData);
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, [id]);

  if (isLoading) return <div className="content-area"><div style={{padding:"60px",textAlign:"center",color:"#94a3b8"}}>데이터 불러오는 중...</div></div>;
  if (!data) return <div className="content-area"><div style={{padding:"60px",textAlign:"center",color:"#94a3b8"}}>장치 정보를 찾을 수 없습니다.</div></div>;

  return (
    <div className="content-area">
      <div className="page-header-wrap" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div className="page-title" style={{marginBottom:"4px"}}>장치 상세 정보</div>
          <div className="page-subtitle">AI Edge 단말기의 실시간 센서 상태 및 부하를 모니터링합니다.</div>
        </div>
        <button className="btn-back" onClick={()=>navigate('/devices')}><i className="fas fa-list"></i> 목록으로</button>
      </div>

      {/* 프로필 헤더 */}
      <div className="profile-header">
        <div className="profile-avatar"><i className="fas fa-microchip"></i></div>
        <div className="profile-info">
          <div className="profile-title">
            {data.device_id||data.id||data._id||id}
          </div>
        </div>
      </div>

      <div className="detail-cards-grid">
        <div className="detail-card">
          <div className="detail-card-title"><i className="fas fa-info-circle"></i> 장치 상태 정보</div>
          <div className="info-grid" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px"}}>
            <div className="info-item">
              <div className="info-label">카메라 센서</div>
              <div className="info-value"><span style={{color:"var(--color-success)", fontWeight:"600"}}>● {data.camera_status||'정상'}</span> (1080p, 60fps)</div>
            </div>
            <div className="info-item">
              <div className="info-label">mmWave 레이다</div>
              <div className="info-value"><span style={{color:"var(--color-success)", fontWeight:"600"}}>● {data.radar_status||'정상'}</span> (반사파 수신율 98%)</div>
            </div>
            <div className="info-item">
              <div className="info-label">GPS 수신 상태</div>
              <div className="info-value"><span style={{color:"var(--color-success)", fontWeight:"600"}}>● {data.gps_status||'정상'}</span> (위성 12개 연결됨)</div>
            </div>
            <div className="info-item">
              <div className="info-label">네트워크 상태</div>
              <div className="info-value"><span style={{color:"var(--color-success)", fontWeight:"600"}}>● 5G 연결됨</span> (Ping: {data.ping||'12'}ms)</div>
            </div>
            <div className="info-item" style={{gridColumn: "span 2"}}>
              <div className="info-label">실시간 연산 부하 (Edge AI)</div>
              <div className="info-value">
                <div style={{display:"flex", justifyContent:"space-between", marginBottom: "4px", fontSize:"0.85rem"}}><span>NPU 점유율</span><span>42%</span></div>
                <div style={{width:"100%", height:"6px", background:"#e2e8f0", borderRadius:"3px", overflow:"hidden", marginBottom:"12px"}}>
                  <div style={{width:"42%", height:"100%", background:"var(--primary-color)"}}></div>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom: "4px", fontSize:"0.85rem"}}><span>메모리 사용량 (3.2GB / 8GB)</span><span>40%</span></div>
                <div style={{width:"100%", height:"6px", background:"#e2e8f0", borderRadius:"3px", overflow:"hidden"}}>
                  <div style={{width:"40%", height:"100%", background:"var(--color-warning)"}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
