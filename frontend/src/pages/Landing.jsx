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
    <div className="landing-wrapper">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <i className="fas fa-shield-alt"></i> Smart Road Saver
        </div>
        <Link to="/login" className="btn-nav-login">관리자 접속</Link>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">AI 기반 실시간 도로 관제 솔루션</div>
            <h1 className="hero-title">도로 위 숨은 위험,<br/>AI가 가장 먼저 찾고 해결합니다.</h1>
            <p className="hero-desc">
              스마트폰 기반 실시간 도로 위험물 감지 및 지자체 자동 신고 솔루션.<br/>
              안전한 도로 환경, Smart Road Saver가 만들어갑니다.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn-hero-primary">관제 시스템 로그인</Link>
              <button className="btn-hero-secondary"><i className="fab fa-google-play" style={{marginRight: '8px'}}></i> 앱 다운로드</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-circle"></div>
            <div className="visual-card top">
              <i className="fas fa-exclamation-triangle" style={{color: '#f59e0b'}}></i> 블랙아이스 감지됨!
            </div>
            <div className="visual-card bottom">
              <i className="fas fa-check-circle" style={{color: '#10b981'}}></i> 지자체 신고 발송 완료
            </div>
          </div>
        </div>
      </header>

      {/* Process Section */}
      <section className="process-wrapper">
        <div className="section-container">
          <h2 className="section-title">Smart Road Saver는 어떻게 작동하나요?</h2>
          <p className="section-subtitle">단 4번의 매끄러운 단계를 통해 위험을 감지하고 해결합니다.</p>
          <div className="process-grid">
            <div className="process-card">
              <div className="p-step">STEP 01</div>
              <div className="p-icon"><i className="fas fa-car-side"></i></div>
              <h3 className="p-title">주행 중 영상 촬영</h3>
              <p className="p-desc">스마트폰 전용 앱을 켜고 주행하면, 카메라가 차량 전방의 도로 상황을 실시간으로 스캔합니다.</p>
            </div>
            <div className="process-card">
              <div className="p-step">STEP 02</div>
              <div className="p-icon"><i className="fas fa-brain"></i></div>
              <h3 className="p-title">AI 실시간 분석</h3>
              <p className="p-desc">엣지 컴퓨팅 기반 AI가 포트홀, 블랙아이스 등 도로 위 위험 요소를 0.1초 만에 식별해 냅니다.</p>
            </div>
            <div className="process-card">
              <div className="p-step">STEP 03</div>
              <div className="p-icon"><i className="fas fa-desktop"></i></div>
              <h3 className="p-title">관제 센터 모니터링</h3>
              <p className="p-desc">감지된 위험 위치와 이미지가 관제 시스템에 즉각 전송되어 지도 상에 경고 알림으로 표출됩니다.</p>
            </div>
            <div className="process-card">
              <div className="p-step">STEP 04</div>
              <div className="p-icon"><i className="fas fa-file-signature"></i></div>
              <h3 className="p-title">자동 신고 및 복구</h3>
              <p className="p-desc">위험도가 높은 건은 시스템이 지자체 공문 양식으로 자동 변환하여 신고를 접수, 빠른 복구를 돕습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-wrapper">
        <div className="section-container">
          <h2 className="section-title">핵심 솔루션</h2>
          <p className="section-subtitle">Smart Road Saver만이 제공하는 강력하고 유연한 기능들입니다.</p>
          <div className="features-grid">
            <div className="feature-box">
              <div className="f-icon-circle"><i className="fas fa-mobile-alt"></i></div>
              <h3 className="f-title">AI 비전 인식 기반 감지</h3>
              <p className="f-desc">별도의 고가 장비 없이, 운전자의 스마트폰 카메라를 통해 주행 중 블랙아이스, 포트홀, 장애물을 실시간으로 식별합니다.</p>
            </div>
            <div className="feature-box">
              <div className="f-icon-circle"><i className="fas fa-map-marked-alt"></i></div>
              <h3 className="f-title">실시간 관제 대시보드</h3>
              <p className="f-desc">전국에서 수집되는 도로 위험 요소 데이터를 지도 상에 시각화하여, 관리자가 실시간으로 현황을 파악하고 대응할 수 있습니다.</p>
            </div>
            <div className="feature-box">
              <div className="f-icon-circle"><i className="fas fa-paper-plane"></i></div>
              <h3 className="f-title">유관 기관 자동 신고 발송</h3>
              <p className="f-desc">위험도가 높은 감지 건은 시스템이 즉각 공문서 형태로 자동 변환하여 해당 지자체 및 관할 부서로 즉시 전송합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Q&A Section */}
      <section className="qa-wrapper">
        <div className="section-container">
          <h2 className="section-title">자주 묻는 질문 (Q&A)</h2>
          <p className="section-subtitle">시스템 도입 전 궁금하신 점들을 확인해보세요.</p>
          <div className="qa-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`qa-item ${openFaq === idx ? 'active' : ''}`}>
                <button className="qa-btn" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                  <div style={{display: 'flex', alignItems: 'flex-start'}}>
                    <span style={{color: '#1d3162', marginRight: '12px', flexShrink: 0}}>Q.</span>
                    <span>{faq.q}</span>
                  </div>
                  <i className={`fas fa-chevron-${openFaq === idx ? 'up' : 'down'}`} style={{ color: '#94a3b8', flexShrink: 0, marginLeft: '16px' }}></i>
                </button>
                <div style={{ maxHeight: openFaq === idx ? '500px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease-in-out' }}>
                  <div className="qa-answer">
                    <span style={{color: '#e11d48', fontWeight: '800', marginRight: '12px', flexShrink: 0}}>A.</span>
                    <span>{faq.a}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">지금 바로 도로 위 안전 혁신에 동참하세요.</h2>
        <p className="cta-desc">Smart Road Saver 앱을 다운로드하거나 관리자 시스템에 접속해보세요.</p>
        <Link to="/login" className="btn-hero-primary" style={{display: 'inline-block'}}>관제 시스템 시작하기</Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-brand"><i className="fas fa-shield-alt"></i> Smart Road Saver</div>
        <p>© 2026 Smart Road Saver. All rights reserved.</p>
      </footer>
    </div>
  );
}
