import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/landing.css';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "오탐(False Alarm) 처리는 어떻게 진행되나요?", a: "AI가 위험 요소로 식별했으나 실제 위험이 아닌 경우, 관리자가 대시보드 및 감지기록 상세 페이지에서 '오탐 처리' 버튼을 눌러 지도에서 즉시 제외할 수 있습니다." },
    { q: "유관 기관 신고는 정말 자동으로 되나요?", a: "네, AI 신뢰도와 위험도(High) 기준을 충족하는 감지 건은 시스템 내부 설정에 따라 행정안전부 안전신문고나 지자체 도로관리 부서로 자동 기안 및 전송됩니다." },
    { q: "야간이나 악천후에도 감지가 가능한가요?", a: "S.R.S 시스템의 AI 비전 모델은 다양한 조도와 기상 환경의 도로 데이터를 학습하여 야간이나 비 오는 날에도 높은 정확도로 위험을 감지해 냅니다." },
    { q: "운전자 앱은 누구나 다운받아 쓸 수 있나요?", a: "네, 일반 사용자(운전자)는 앱스토어에서 전용 스마트폰 앱을 다운로드 받아 거치대에 켜두기만 하면 됩니다. 주행 중 카메라가 자동으로 도로를 스캔하며 위험 요소를 관제 센터로 전송합니다." }
  ];

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

      
      {/* Q&A Section */}
      <section style={{ padding: '80px 40px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="features-title" style={{ textAlign: 'center', marginBottom: '40px' }}>자주 묻는 질문 (Q&A)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '24px 16px', fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background-color 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{display: "flex", alignItems: "flex-start", textAlign: "left"}}><span style={{color: "var(--primary-color)", marginRight: "8px", flexShrink: 0}}>Q.</span><span>{faq.q}</span></div>
                  <i className={`fas fa-chevron-${openFaq === idx ? 'up' : 'down'}`} style={{ color: '#94a3b8', flexShrink: 0, marginLeft: '16px' }}></i>
                </button>
                <div style={{ 
                  maxHeight: openFaq === idx ? '500px' : '0', 
                  overflow: 'hidden', 
                  transition: 'all 0.3s ease-in-out',
                  opacity: openFaq === idx ? 1 : 0
                }}>
                  <div style={{ padding: "0 16px 24px 16px", color: "#64748b", lineHeight: "1.7", fontSize: "1.05rem", wordBreak: "keep-all", display: "flex", alignItems: "flex-start" }}>
                    <span style={{color: "#e11d48", fontWeight: "800", marginRight: "8px", flexShrink: 0}}>A.</span>
                    <span>{faq.a}</span>
                  </div>
                </div>
              </div>
            ))}
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
