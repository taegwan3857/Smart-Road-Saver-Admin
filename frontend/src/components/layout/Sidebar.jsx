import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";
import Modal from "../common/Modal";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    authService.logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <>
      <div className="sidebar-logo">
        <i className="fas fa-shield-alt"></i>
        <span style={{marginLeft:"8px"}}>Smart Road Saver</span>
      </div>
      <nav className="sidebar-menu">
        <div className="sidebar-group-title">관제 대시보드</div>
        <Link to="/" className={isActive("/")}><i className="fas fa-chart-line"></i> 대시보드</Link>
        
        <div className="sidebar-group-title">감지/신고 관리</div>
        <Link to="/detections" className={isActive("/detections")}><i className="fas fa-list"></i> 감지기록</Link>
        <Link to="/reports" className={isActive("/reports")}><i className="fas fa-file-alt"></i> 신고문서</Link>
        
        <div className="sidebar-group-title">계정 관리</div>
        <Link to="/users" className={isActive("/users")}><i className="fas fa-users-cog"></i> 사용자 관리</Link>
      </nav>
      
      <div style={{padding:"20px",borderTop:"1px solid rgba(255,255,255,0.1)",marginTop:"auto"}}>
        <button onClick={handleLogoutClick} style={{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",padding:"12px",background:"rgba(225,29,72,0.15)",color:"#fca5a5",border:"none",borderRadius:"0",cursor:"pointer",fontSize:"0.9rem",fontWeight:"600",transition:"all 0.2s"}}
          onMouseOver={e=>{e.currentTarget.style.background='rgba(225,29,72,0.3)';e.currentTarget.style.color='#fff';}}
          onMouseOut={e=>{e.currentTarget.style.background='rgba(225,29,72,0.15)';e.currentTarget.style.color='#fca5a5';}}>
          <i className="fas fa-sign-out-alt" style={{marginRight:"8px"}}></i> 로그아웃
        </button>
      </div>

      <Modal 
        isOpen={isLogoutModalOpen}
        title="로그아웃"
        message="정말로 로그아웃 하시겠습니까?"
        type="warning"
        confirmText="확인"
        cancelText="취소"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}
