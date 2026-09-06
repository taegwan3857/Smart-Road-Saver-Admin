import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleService } from "../services/vehicleService";
import { userService } from '../services/userService';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [assignedVehicle, setAssignedVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userData;
        if (id === 'admin_001') {
          userData = {
            id: 'admin_001',
            user_id: 'admin_001',
            login_id: 'admin',
            name: 'S.R.S.관리자',
            role: 'ADMIN',
            phone: '010-7182-6783',
            email: 'mars@dongyang.ac.kr',
            status: '정상 (Active)'
          };
        } else {
          userData = await userService.getUser(id);
        }
        setData(userData);
        
        // Fetch vehicles to find assigned vehicle for this user
        try {
          const vehiclesData = await vehicleService.getVehicles();
          const vehiclesList = Array.isArray(vehiclesData) ? vehiclesData : (vehiclesData?.vehicles || vehiclesData?.items || []);
          const matchedVehicle = vehiclesList.find(v => 
            v.driver_id === id || 
            v.driver_id === userData.user_id || 
            v.driver_name === userData.name || 
            v.driver_name === userData.username
          );
          setAssignedVehicle(matchedVehicle || null);
        } catch (vErr) {
          console.error("Failed to fetch vehicles:", vErr);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) return <div className="content-area"><div style={{padding:"60px",textAlign:"center",color:"#94a3b8"}}></div></div>;
  if (!data) return <div className="content-area"><div style={{padding:"60px",textAlign:"center",color:"#94a3b8"}}>사용자를 찾을 수 없습니다.</div></div>;

  const getRoleBadge = (role) => {
    if (!role) return 'neutral';
    const r = role.toLowerCase();
    if (r.includes('admin')||r.includes('최고')) return 'high';
    return 'medium';
  };

  return (
    <div className="content-area">
      <div className="page-header-wrap" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div className="page-title" style={{marginBottom:"4px"}}>사용자 상세 정보</div>
          <div className="page-subtitle">해당 사용자의 기본 계정 정보와 배차된 관제 차량, 연동된 단말기 내역을 확인합니다.</div>
        </div>
        <button className="btn-back" onClick={()=>navigate('/users')}><i className="fas fa-list"></i> 목록으로</button>
      </div>

      {/* 프로필 헤더 */}
      <div className="profile-header">
        <div className="profile-avatar"><i className="fas fa-user-circle" style={{fontSize: "80px", color: "#1d3162", lineHeight: 1}}></i></div>
        <div className="profile-info">
          <div className="profile-title">
            {data.name||data.username||'-'} <span className={`badge ${getRoleBadge(data.role)}`}>{String(data.role).toLowerCase() === 'driver' || String(data.role).includes('관제') || String(data.role) === '사용자' ? '사용자' : '관리자'}</span>
          </div>
          <div className="profile-meta">
            <span><i className="fas fa-id-badge"></i> 아이디: {data.login_id||data.email||'-'}</span>
          </div>
        </div>
      </div>

      <div className="detail-cards-grid" style={{gridTemplateColumns: "1fr"}}>
        {/* 기본 정보 카드 */}
        <div className="detail-card">
          <div className="detail-card-title"><i className="fas fa-info-circle"></i> 기본 계정 정보</div>
          <div className="info-grid" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px"}}>
            <div className="info-item">
              <div className="info-label">사용자 ID</div>
              <div className="info-value">{data.user_id||data.id||data._id||'-'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">이름</div>
              <div className="info-value">{data.name||data.username||'-'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">이메일</div>
              <div className="info-value">{data.email||data.login_id||'-'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">연락처</div>
              <div className="info-value">{data.phone||data.phone_number||data.contact||'-'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">권한</div>
              <div className="info-value">{String(data.role).toLowerCase() === 'driver' || String(data.role).includes('관제') || String(data.role) === '사용자' ? '사용자' : '관리자'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">계정 상태</div>
              <div className="info-value"><span className={`badge ${data.status === '비활성' ? 'high' : 'low'}`}>{data.status||'정상 (Active)'}</span></div>
            </div>
            <div className="info-item">
              <div className="info-label">차량 번호</div>
              <div className="info-value">{data.vehicle_number||data.plate_number||assignedVehicle?.plate_number||assignedVehicle?.license_plate||'-'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">연동 디바이스</div>
              <div className="info-value">{data.device_id||data.linked_device||assignedVehicle?.device_id||'-'}</div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
