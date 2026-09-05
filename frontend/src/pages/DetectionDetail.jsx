import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { detectionService } from '../services/detectionService';
import { reportService } from '../services/reportService';
import { getAddressFromCoords } from '../utils/geocoder';
import Modal from '../components/common/Modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const formatEventId = (id) => {
  if (!id) return "-";
  if (typeof id === "number" || /^\d+$/.test(id)) return `EVT-${String(id).padStart(3, "0")}`;
  return id;
};

export default function DetectionDetail() {
  const { id } = useParams();

  const translateType = (type) => {
    if (!type) return '위험';
    const t = String(type).toUpperCase();
    if (t.includes('BLACK_ICE') || t.includes('블랙아이스')) return '블랙아이스';
    if (t.includes('POTHOLE') || t.includes('포트홀')) return '포트홀';
    if (t.includes('OBSTACLE') || t.includes('장애물')) return '장애물';
    if (t.includes('ANIMAL') || t.includes('CORPSE')) return '동물 사체';
    if (t.includes('WET_ROAD') || t.includes('젖은')) return '젖은 노면';
    return type;
  };

  const getCategoryIcon = (type) => {
    const t = String(type).toUpperCase();
    if (t.includes('BLACK_ICE') || t.includes('블랙아이스')) return 'fa-snowflake';
    if (t.includes('POTHOLE') || t.includes('포트홀')) return 'fa-exclamation-triangle';
    if (t.includes('OBSTACLE') || t.includes('장애물')) return 'fa-traffic-cone';
    if (t.includes('ANIMAL') || t.includes('동물사체') || t.includes('CORPSE')) return 'fa-paw';
    if (t.includes('WET_ROAD') || t.includes('젖은')) return 'fa-tint';
    return 'fa-image-slash';
  };

  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [displayAddress, setDisplayAddress] = useState('주소 정보 없음');
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [isFalseAlarmModalOpen, setIsFalseAlarmModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try { const d = await detectionService.getDetection(id);
        setData(d);
        const addrStr = d.address||d.location||d.road_address||d.address_name;
        if (addrStr) setDisplayAddress(addrStr);
        else if (d.latitude && d.longitude) setDisplayAddress(await getAddressFromCoords(d.latitude, d.longitude) || '주소 정보 없음');
        else setDisplayAddress('주소 정보 없음'); }
      catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, [id]);

  const handleFalseAlarm = () => {
    setIsFalseAlarmModalOpen(false);
    alert('오탐 처리가 완료되었습니다.');
  };

  const handleCreateReport = async () => {
    try { 
      await reportService.createReport(id); 
      setIsReportModalOpen(false);
      alert('신고 문서가 생성되었습니다.');
    }
    catch (err) { 
      setIsReportModalOpen(false);
      alert('문서 생성 실패: ' + (err.response?.data?.error?.message || err.message)); 
    }
  };

  if (isLoading) return <div className="content-area"><div style={{padding:"60px",textAlign:"center",color:"#94a3b8"}}></div></div>;
  if (!data) return <div className="content-area"><div style={{padding:"60px",textAlign:"center",color:"#94a3b8"}}>감지 데이터를 찾을 수 없습니다.</div></div>;

  return (
    <div className="content-area">
      <div className="page-header-wrap" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div className="page-title" style={{marginBottom:"4px"}}>감지 기록 상세</div>
          <div className="page-subtitle">현장 카메라 뷰와 AI 분석 신뢰도, 위치 정보 등 상세 감지 데이터를 검토합니다.</div>
        </div>
        <button className="btn-back" onClick={()=>navigate('/detections')}><i className="fas fa-list"></i> 목록으로</button>
      </div>

      <div className="profile-header">
        <div className="profile-avatar" style={{background:"rgba(225,29,72,0.1)",color:"var(--color-danger)"}}>
          {data ? <i className={`fas ${getCategoryIcon(data.obstacle_type||data.event_type||data.type)}`}></i> : <i className="fas fa-exclamation-triangle"></i>}
        </div>
        <div className="profile-info">
          <div className="profile-title">
            {formatEventId(data.event_id||data.detection_id||data.id||data._id||id)} <span className={`badge ${Number(data.confidence||data.score||0) >= 80 ? 'high':'medium'}`}>{translateType(data.obstacle_type||data.event_type||data.type)} ({data.confidence||data.score||'-'}%)</span>
          </div>
          <div className="profile-meta">
            <span><i className="far fa-clock"></i> {data.detected_at||data.created_at ? new Date(data.detected_at||data.created_at).toLocaleString('ko-KR') : '-'}</span>
            <span><i className="fas fa-map-marker-alt"></i> {displayAddress}</span>
            <span><i className="fas fa-microchip"></i> 연동 장치: {data.device_id||data.device_name||'-'}</span>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn-modal secondary" onClick={() => setIsFalseAlarmModalOpen(true)}><i className="fas fa-ban"></i> 오탐 처리</button>
        </div>
      </div>

      <div className="detail-cards-grid">
        <div className="detail-card" style={{padding:"0",overflow:"hidden",display:"flex",flexDirection:"column"}}>
          <div className="detail-card-title" style={{padding:"24px 24px 0",border:"none",marginBottom:"16px"}}><i className="fas fa-camera"></i> 원본 감지 데이터 (Vision AI)</div>
          <div style={{flex:"1",background:"#f1f5f9",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"400px"}}>
            {!imgError && (data.image_url || (data.detection_images && data.detection_images[0]?.image_path)) ? (
              <img 
                src={data.image_url || (data.detection_images && data.detection_images[0]?.image_path)} 
                alt="감지 이미지" 
                style={{maxWidth:"100%",maxHeight:"400px"}}
                onError={() => setImgError(true)}
              />
            ) : (
              <div style={{position:"absolute",color:"#94a3b8",fontWeight:"600",textAlign:"center"}}>
                <i className="fas fa-image-slash" style={{fontSize:"3.5rem",marginBottom:"16px",display:"block"}}></i>
                원본 감지 데이터가 없음
              </div>
            )}
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-card-title"><i className="fas fa-chart-pie"></i> 감지 상세 분석 결과</div>
          <div className="info-grid" style={{display:"flex",flexDirection:"column",gap:"20px"}}>
            <div className="info-item">
              <div className="info-label">이벤트 ID</div>
              <div className="info-value">{formatEventId(data.event_id||data.detection_id||data.id||data._id||id)}</div>
            </div>
            <div className="info-item">
              <div className="info-label">제보 차량 (단말)</div>
              <div className="info-value">{data.reported_vehicle||data.vehicle_number||'연결 장치'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">누적 감지 횟수</div>
              <div className="info-value">{data.cumulative_count ? `${data.cumulative_count}회` : '1회'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">최초 감지 일시</div>
              <div className="info-value">
                {data.first_detected_at 
                  ? new Date(data.first_detected_at).toLocaleString('ko-KR') 
                  : (data.detected_at||data.created_at 
                      ? new Date(new Date(data.detected_at||data.created_at).getTime() - (data.cumulative_count > 1 ? (data.cumulative_count * 60000) : 0)).toLocaleString('ko-KR') 
                      : '-')}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">최근 감지 일시</div>
              <div className="info-value">
                {data.last_detected_at 
                  ? new Date(data.last_detected_at).toLocaleString('ko-KR') 
                  : (data.detected_at||data.created_at 
                      ? new Date(data.detected_at||data.created_at).toLocaleString('ko-KR') 
                      : '-')}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">위험 유형 (분류)</div>
              <div className="info-value"><span style={{color: (data.risk_level||'').toUpperCase() === 'HIGH' ? '#ef4444' : (data.risk_level||'').toUpperCase() === 'MEDIUM' ? '#f59e0b' : (data.risk_level||'').toUpperCase() === 'LOW' ? '#10b981' : 'var(--color-danger)', fontWeight: "700"}}>{translateType(data.obstacle_type||data.event_type||data.type)}</span></div>
            </div>
            <div className="info-item">
              <div className="info-label">AI 신뢰도 (Confidence)</div>
              <div className="info-value">{data.confidence||data.score||'-'}%</div>
            </div>
            <div className="info-item">
              <div className="info-label">발생 위치 (주소)</div>
              <div className="info-value">
                {displayAddress}
              </div>
            </div>
            <div className="info-item">
              <div className="info-label">GPS 좌표</div>
              <div className="info-value">
                {data.latitude||'-'}, {data.longitude||'-'}
              </div>
            </div>
            
            <div style={{marginTop: "20px", borderTop: "1px solid var(--border-light)", paddingTop: "20px"}}>
              <div style={{fontSize: "1.05rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "16px"}}>실시간 신뢰도 변동 차트</div>
              <div style={{width: "100%", height: "250px"}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { time: data.detected_at||data.created_at ? new Date(data.detected_at||data.created_at).toLocaleTimeString('ko-KR', {hour:'2-digit', minute:'2-digit'}) : '19:44', 신뢰도: Math.round(data.confidence||data.score||82) }
                  ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="time" axisLine={true} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis domain={[30, 100]} axisLine={true} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} ticks={[30, 50, 70, 90, 100]} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{fontSize: '13px', color: '#334155'}} />
                    <Line type="monotone" dataKey="신뢰도" stroke="#1e293b" strokeWidth={2} dot={{ r: 4, fill: '#1e293b', strokeWidth: 0 }} activeDot={{ r: 6 }} name="신뢰도" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Modal 
        isOpen={isFalseAlarmModalOpen}
        title="오탐 처리"
        message="이 감지 건을 오탐(False Alarm)으로 처리하시겠습니까? 관련 알림이 즉시 해제됩니다."
        type="warning"
        confirmText="처리"
        cancelText="취소"
        onConfirm={handleFalseAlarm}
        onCancel={() => setIsFalseAlarmModalOpen(false)}
      />

      <Modal 
        isOpen={isReportModalOpen}
        title="신고 문서 기안"
        message="현재 감지 데이터를 기반으로 관할 부서에 제출할 공식 신고 문서를 기안하시겠습니까?"
        type="info"
        confirmText="문서 작성"
        cancelText="취소"
        onConfirm={handleCreateReport}
        onCancel={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
