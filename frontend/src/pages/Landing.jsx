import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/landing.css';

export default function Landing() {
  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-logo">
          <i className="fas fa-shield-alt"></i> Smart Road Saver
        </div>
        <nav>
          <Link to="/login" className="landing-btn-login">관리자 시작하기</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">도로 위 숨은 위험,<br/>AI가 가장 먼저 찾고 해결합니다.</h1>
        <p className="hero-subtitle">
          스마트폰 기반 실시간 도로 위험물 감지 및 지자체 자동 신고 솔루션.<br/>
          안전한 도로 환경, Smart Road Saver가 만들어갑니다.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link to="/login" className="landing-btn-login" style={{ padding: '16px 32px', fontSize: '1.1rem', backgroundColor: '#fff', color: 'var(--primary-color)' }}>
            관제 시스템 로그인
          </Link>
          <a href="#" className="landing-btn-login" style={{ padding: '16px 32px', fontSize: '1.1rem', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
            <i className="fab fa-google-play" style={{marginRight: '8px'}}></i> 앱 다운로드
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-title">Smart Road Saver 핵심 솔루션</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{color: '#3b82f6'}}><i className="fas fa-mobile-alt"></i></div>
            <h3>AI 비전 인식 기반 감지</h3>
            <p>별도의 고가 장비 없이, 운전자의 스마트폰 카메라를 통해 주행 중 블랙아이스, 포트홀, 장애물을 실시간으로 식별합니다.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{color: '#f59e0b'}}><i className="fas fa-map-marked-alt"></i></div>
            <h3>실시간 관제 대시보드</h3>
            <p>전국에서 수집되는 도로 위험 요소 데이터를 지도 상에 시각화하여, 관리자가 실시간으로 현황을 파악하고 대응할 수 있습니다.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{color: '#10b981'}}><i className="fas fa-paper-plane"></i></div>
            <h3>유관 기관 자동 신고 발송</h3>
            <p>위험도가 높은 감지 건은 시스템이 즉각 공문서 형태로 자동 변환하여 해당 지자체 및 관할 부서로 즉시 전송합니다.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>
          <i className="fas fa-shield-alt"></i> Smart Road Saver
        </div>
        <p>© 2026 Smart Road Saver. All rights reserved.</p>
      </footer>
    </div>
  );
}
