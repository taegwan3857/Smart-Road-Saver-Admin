import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportService } from '../services/reportService';
import Modal from '../components/common/Modal';

const translateType = (type) => {
  if (!type) return '위험 요소';
  const t = String(type).toUpperCase();
  if (t.includes('BLACK_ICE') || t.includes('블랙아이스')) return '블랙아이스';
  if (t.includes('POTHOLE') || t.includes('포트홀')) return '포트홀';
  if (t.includes('OBSTACLE') || t.includes('장애물')) return '장애물';
  if (t.includes('ANIMAL') || t.includes('CORPSE')) return '동물 사체';
  if (t.includes('WET_ROAD') || t.includes('젖은')) return '젖은 노면';
  return type;
};

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try { setData(await reportService.getReport(id)); }
      catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, [id]);

  const handleReject = () => {
    setIsRejectModalOpen(false);
    alert('반려 처리되었습니다.');
  };

  const handleApprove = () => {
    setIsApproveModalOpen(false);
    alert('승인(결재) 처리되었습니다.');
  };

  if (isLoading) return <div className="content-area"><div style={{padding:"60px",textAlign:"center",color:"#94a3b8"}}></div></div>;
  if (!data) return <div className="content-area"><div style={{padding:"60px",textAlign:"center",color:"#94a3b8"}}>신고 문서를 찾을 수 없습니다.</div></div>;

  return (
    <div className="content-area">
      <div className="page-header-wrap" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div className="page-title" style={{marginBottom:"4px"}}>자동 발송 신고 문서 상세</div>
          <div className="page-subtitle">AI 관제 시스템이 위험 요소를 감지하여 유관 부서로 자동 발송한 긴급 신고 문서 내역입니다.</div>
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          
          
          
          <button className="btn-back" onClick={()=>navigate('/reports')}><i className="fas fa-list"></i> 목록으로</button>
        </div>
      </div>

      
      
      <div className="document-paper">
        <div className="doc-header-top">
          <div className="doc-header-logo">
            <i className="fas fa-shield-alt" style={{marginRight:"8px"}}></i>
            Smart Road Saver
          </div>
          
        </div>
        <div className="doc-header">도로 위험 감지 자동 보고서</div>

        
        <div className="doc-approval-wrap">
          <div className="doc-approval">
            <div className="approval-box">
              <div className="approval-title">기안자</div>
              <div className="approval-sign">{data.author||'김관리'}</div>
            </div>
            <div className="approval-box">
              <div className="approval-title">자동결재</div>
              <div className="approval-sign">시스템</div>
            </div>
            <div className="approval-box">
              <div className="approval-title">센터장</div>
              <div className="approval-sign">전결</div>
            </div>
          </div>
        </div>

        <table className="doc-meta-table">
          <tbody>
            <tr>
              <th>신고 ID</th>
              <td style={{fontWeight: "bold"}}>{data.report_id||data.id||data._id||id}</td>
              <th>작성 시간</th>
              <td>{data.created_at ? new Date(data.created_at).toLocaleString('ko-KR') : '2026. 09. 05. 오전 01:15'}</td>
            </tr>
            <tr>
              <th>연계 이벤트</th>
              <td>{data.detection_id||data.event_id||'EVT-0001'}</td>
              <th>최초 신고자</th>
              <td>SYSTEM</td>
            </tr>
            <tr>
              <th>위험 유형</th>
              <td style={{fontWeight: "bold"}}>{translateType(data.event_type||data.type)}</td>
              <th>위험도</th>
              <td style={{fontWeight: "bold"}}>중간</td>
            </tr>
            <tr>
              <th>발생 위치</th>
              <td colSpan="3">{data.address||data.location||'위치 정보 없음'}</td>
            </tr>
            <tr>
              <th>GPS 좌표</th>
              <td colSpan="3">{data.latitude||'37.4979'}, {data.longitude||'127.0280'}</td>
            </tr>
          </tbody>
        </table>

        <div className="doc-content">
          {data.content ? data.content.split('\n').map((line, i) => (
            <React.Fragment key={i}>{line}<br/></React.Fragment>
          )) : (
            <>
              1. 평소 구정 발전과 구민 안전을 위해 애쓰시는 노고에 감사드립니다.<br/><br/>
              2. 우리 구 관내 도로 모니터링 중, AI 스마트 관제 장비에 의해 아래와 같이 <strong>{translateType(data.event_type||data.type)}</strong> 현상이 감지되었습니다.<br/><br/>
              3. 해당 구간은 차량 통행 시 2차 사고 발생 위험이 높으므로, 유관 부서의 즉각적인 현장 확인 및 안전 조치를 요청드립니다.<br/><br/>
              <strong>- 아 래 -</strong><br/><br/>
              가. 감지 일시 : {data.created_at ? new Date(data.created_at).toLocaleString('ko-KR') : '2026. 09. 04 18:32'}<br/>
              나. 감지 장소 : {data.address||data.location||'서대문구 연희로 10길'}<br/>
              다. 감지 확률 : AI 분석결과 {data.confidence||'87'}% 신뢰도<br/>
              라. 요청 사항 : 현장 출동 및 위험 요소 제거<br/>
            </>
          )}
        </div>

        <div className="doc-images">
          {data.images && data.images.length > 0 ? (
            data.images.map((img, i) => (
              <div key={i} className="doc-img-box" style={{backgroundImage: `url(${img.url})`}}></div>
            ))
          ) : (
            <>
              <div className="doc-img-box"><i className="fas fa-camera" style={{marginRight:"8px"}}></i> 현장 카메라 사진</div>
              <div className="doc-img-box"><i className="fas fa-map-marker-alt" style={{marginRight:"8px"}}></i> 감지 위치 지도</div>
            </>
          )}
        </div>

        <div style={{textAlign: "center"}}>
          <div className="paper-footer">
            Smart Road Saver 관제센터
            <span className="doc-stamp">직인</span>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isRejectModalOpen}
        title="반려"
        message="신고 문서를 반려 처리하시겠습니까?"
        type="danger"
        confirmText="반려"
        cancelText="취소"
        onConfirm={handleReject}
        onCancel={() => setIsRejectModalOpen(false)}
      />

      <Modal 
        isOpen={isApproveModalOpen}
        title="승인 (결재)"
        message="신고 문서를 승인하고 발송하시겠습니까?"
        type="info"
        confirmText="승인"
        cancelText="취소"
        onConfirm={handleApprove}
        onCancel={() => setIsApproveModalOpen(false)}
      />
    </div>
  );
}
