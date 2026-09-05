import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import Modal from '../components/common/Modal';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, message: '', type: 'warning' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) { 
      setModalState({ isOpen: true, message: '아이디를 입력해 주세요.', type: 'warning' });
      return; 
    }
    if (!userPw) { 
      setModalState({ isOpen: true, message: '비밀번호를 입력해 주세요.', type: 'warning' });
      return; 
    }
    setIsLoading(true);
    try {
      await authService.login(userId, userPw);
      navigate('/');
    } catch (err) {
      let msg = '서버와 통신할 수 없습니다. 네트워크 상태를 확인해주세요.';
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 400) {
          msg = '등록되지 않은 아이디이거나, 아이디 또는 비밀번호를 잘못 입력하셨습니다.';
        } else if (err.response.status === 404) {
          msg = '존재하지 않는 계정입니다.';
        } else {
          msg = err.response?.data?.error?.message || err.response?.data?.message || '로그인 처리 중 오류가 발생했습니다.';
        }
      }
      setModalState({ isOpen: true, message: msg, type: 'danger' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card-split">
        <div className="login-left" style={{justifyContent: "flex-start", paddingTop: "120px"}}>
          <i className="fas fa-shield-alt" style={{fontSize:"3rem",marginBottom:"20px"}}></i>
          <h1>Smart Road Saver</h1>
          <p>실시간 센서 데이터와 AI 분석으로<br />도로 위의 위험을 가장 먼저 감지합니다.</p>
          <div style={{position: "absolute", bottom: "40px", fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.5)"}}>
            &copy; 2026 Smart Road Saver. All rights reserved.
          </div>
        </div>
        <div className="login-right">
          <h2>관제센터 로그인</h2>
          <p className="subtitle">계정 정보를 입력하세요.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>아이디</label>
              <input type="text" value={userId} onChange={e=>setUserId(e.target.value)} placeholder="아이디를 입력하세요" required={false} />
            </div>
            <div className="form-group">
              <label>비밀번호</label>
              <input type="password" value={userPw} onChange={e=>setUserPw(e.target.value)} placeholder="비밀번호를 입력하세요" required={false} />
            </div>
            <button type="submit" className="btn-login" disabled={isLoading}>
              {'로그인'}
            </button>
          </form>
        </div>
      </div>

      <Modal 
        isOpen={modalState.isOpen}
        title={modalState.type === 'danger' ? "로그인 실패" : "입력 확인"}
        message={modalState.message}
        type={modalState.type}
        confirmText="확인"
        onConfirm={() => setModalState({ ...modalState, isOpen: false })}
        onCancel={() => setModalState({ ...modalState, isOpen: false })}
      />
    </div>
  );
}
