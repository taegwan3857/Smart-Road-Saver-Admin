import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/landing.css';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "오탐(False Alarm) 처리는 어떻게 진행되나요?", a: "AI가 위험 요소로 식별했으나 실제 위험이 아닌 경우, 관리자가 감지기록 상세 페이지에서 '오탐 처리' 버튼을 눌러 지도에서 즉시 제외할 수 있습니다." },
    { q: "유관 기관 신고는 정말 자동으로 되나요?", a: "네, AI 신뢰도와 위험도(High) 기준을 충족하는 감지 건은 시스템 설정에 따라 행정안전부 안전신문고나 지자체 도로관리 부서로 자동 기안 및 전송됩니다." },
    { q: "야간이나 악천후에도 감지가 가능한가요?", a: "다양한 조도와 기상 환경의 도로 데이터를 학습한 AI 비전 모델이 야간이나 비 오는 날에도 높은 정확도로 위험을 감지합니다." },
    { q: "운전자 앱은 누구나 사용할 수 있나요?", a: "네, 앱스토어에서 전용 앱을 다운로드하여 거치대에 켜두기만 하면 됩니다. 주행 중 카메라가 자동으로 도로를 스캔하며 위험 요소를 관제 센터로 전송합니다." }
  ];

  return (
    <div className="landing-container">
      {/* Nav */}
      <header className="landing-header">
        <div className="landing-logo">
          <i className="fas fa-shield-alt"></i> Smart Road Saver
        </div>
        <Link to="/login" className="landing-btn-login">관리자 로그인</Link>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <h1 className="hero-title">도로 위 숨은 위험을<br/>AI가 먼저 찾아냅니다</h1>
        <p className="hero-subtitle">
          스마트폰 카메라 기반 실시간 도로 위험물 감지 · 지자체 자동 신고 솔루션
        </p>
        <div className="hero-btns">
          <Link to="/login" className="btn-white">관제 시스템 접속</Link>
          <a href="#" className="btn-ghost">
            <i className="fab fa-google-play" style={{marginRight: '6px'}}></i>앱 다운로드
          </a>
        </div>
      </section>

      {/* Process */}
      <section className="process-section">
        <div className="section-heading">
          <h2>작동 방식</h2>
          <p>4단계로 위험을 감지하고 해결합니다</p>
        </div>
        <div className="process-grid">
          <div className="process-card">
            <span className="process-num">1</span>
            <i className="fas fa-car-side"></i>
            <h3>주행 중 촬영</h3>
            <p>스마트폰 앱을 켜고 주행하면 카메라가 도로 상황을 실시간으로 스캔합니다.</p>
          </div>
          <div className="process-card">
            <span className="process-num">2</span>
            <i className="fas fa-brain"></i>
            <h3>AI 분석</h3>
            <p>엣지 컴퓨팅 기반 AI가 포트홀, 블랙아이스 등 위험 요소를 즉시 식별합니다.</p>
          </div>
          <div className="process-card">
            <span className="process-num">3</span>
            <i className="fas fa-desktop"></i>
            <h3>관제 모니터링</h3>
            <p>감지된 위험 위치가 관제 시스템 지도에 실시간 경고로 표출됩니다.</p>
          </div>
          <div className="process-card">
            <span className="process-num">4</span>
            <i className="fas fa-file-signature"></i>
            <h3>자동 신고</h3>
            <p>위험도가 높은 건은 지자체 공문 양식으로 자동 변환하여 신고를 접수합니다.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-heading">
          <h2>핵심 기능</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{color: '#1d3162'}}><i className="fas fa-mobile-alt"></i></div>
            <h3>스마트폰 기반 감지</h3>
            <p>별도 장비 없이 운전자의 스마트폰 카메라만으로 블랙아이스, 포트홀, 장애물을 실시간 식별합니다.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{color: '#1d3162'}}><i className="fas fa-map-marked-alt"></i></div>
            <h3>실시간 관제 대시보드</h3>
            <p>전국에서 수집되는 위험 요소 데이터를 지도 위에 시각화하여 현황을 한눈에 파악합니다.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{color: '#1d3162'}}><i className="fas fa-paper-plane"></i></div>
            <h3>유관 기관 자동 발송</h3>
            <p>위험도가 높은 감지 건은 공문서 형태로 자동 변환하여 해당 지자체로 즉시 전송합니다.</p>
          </div>
        </div>
      </section>

      {/* Q&A */}
      <section className="qa-section">
        <div className="section-heading">
          <h2>자주 묻는 질문</h2>
        </div>
        <div className="qa-list">
          {faqs.map((faq, idx) => (
            <div key={idx} className="qa-item">
              <button className="qa-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <span>{faq.q}</span>
                <i className={`fas fa-chevron-${openFaq === idx ? 'up' : 'down'}`}></i>
              </button>
              <div className="qa-answer-wrap" style={{ maxHeight: openFaq === idx ? '300px' : '0' }}>
                <div className="qa-answer">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <strong><i className="fas fa-shield-alt" style={{marginRight:'6px'}}></i>Smart Road Saver</strong>
        <p>© 2026 Smart Road Saver. All rights reserved.</p>
      </footer>
    </div>
  );
}
