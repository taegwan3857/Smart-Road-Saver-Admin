import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/landing.css';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up, .fade-in, .slide-in-left, .slide-in-right').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href').substring(1);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    { q: "어떤 종류의 도로 위험물을 감지할 수 있나요?", a: "포트홀, 낙하물(장애물), 젖은 노면, 블랙아이스(결빙) 등을 실시간으로 감지합니다. 특히 mmWave 레이더를 통해 육안으로 식별이 어려운 결빙 상태를 정확하게 판별합니다." },
    { q: "기존 차량의 블랙박스와 연동되는 방식인가요?", a: "아닙니다. Smart Road Saver는 카메라, mmWave 레이더, Jetson NANO 보드가 결합된 전용 하드웨어 장비입니다. 차량에 장착하여 독립적으로 데이터를 수집하고 실시간 AI 추론을 수행합니다." },
    { q: "지자체 신고는 어떻게 이루어지나요?", a: "AI가 결함을 탐지하면, 서버에서 중복 여부(PostGIS 활용)를 확인한 후 결함을 등록합니다. 등록된 결함 데이터를 기반으로 공문서 형태의 신고서가 시스템에서 자동 생성되어 유관 기관으로 원클릭 접수됩니다." },
  ];

  return (
    <div className="landing-container">
      {/* Nav */}
      <header className="landing-header">
        <div className="landing-logo">
          <i className="fas fa-shield-alt"></i> Smart Road Saver
        </div>
        <nav className="nav-links">
          <a href="#home" onClick={scrollToSection}>홈</a>
          <a href="#background" onClick={scrollToSection}>배경</a>
          <a href="#service-features" onClick={scrollToSection}>서비스 특징</a>
          <a href="#system" onClick={scrollToSection}>시스템 구조</a>
          <a href="#faq" onClick={scrollToSection}>FAQ</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="hero-text-col fade-up">
            <h1 className="hero-title">
              Smart Road Saver
            </h1>
            <p className="hero-subtitle">
              mmWave 레이더와 비전 AI를 결합하여 실시간 도로 결함 탐지 및 자동 신고를 통해 도로 안전사고를 예방하는 시스템
            </p>
            <div className="hero-btns">
              <Link to="/login" className="btn-primary">관리자 관제 접속</Link>
              <a href="#background" onClick={scrollToSection} className="btn-secondary">솔루션 알아보기</a>
            </div>
          </div>
          <div className="hero-graphic-col slide-in-right">
            <div className="radar-animation">
              <div className="radar-circle circle-1"></div>
              <div className="radar-circle circle-2"></div>
              <div className="radar-circle circle-3"></div>
              <div className="radar-scanner"></div>
              
              {/* Floating Animation Elements */}
              <div className="floating-badge badge-1"><i className="fas fa-bolt"></i> YOLO11n</div>
              <div className="floating-badge badge-2"><i className="fas fa-wifi"></i> mmWave</div>
              <div className="radar-dot dot-1"><div className="dot-ripple"></div></div>
              <div className="radar-dot dot-2"><div className="dot-ripple"></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Background */}
      <section className="background-section" id="background">
        <div className="section-heading fade-up">
          <h2>프로젝트 배경 및 필요성</h2>
          <p>매년 20,000건 이상의 피해가 노면 결함으로 발생합니다.</p>
        </div>
        <div className="bg-grid">
          <div className="bg-card fade-up d1">
            <div className="bg-icon warning"><i className="fas fa-exclamation-triangle"></i></div>
            <h3>사후 대처 신고 시스템</h3>
            <p>사고가 발생한 이후에야 대처가 이루어지는 기존 신고 시스템의 치명적인 한계</p>
          </div>
          <div className="bg-card fade-up d2">
            <div className="bg-icon time"><i className="fas fa-hourglass-half"></i></div>
            <h3>비효율적인 순찰 시스템</h3>
            <p>제한된 인력으로 광범위한 전국 도로를 모두 실시간 순찰하기 어려운 현실</p>
          </div>
          <div className="bg-card fade-up d3">
            <div className="bg-icon danger"><i className="fas fa-hard-hat"></i></div>
            <h3>순찰 인력의 안전 위협</h3>
            <p>고속도로 및 위험 구간에서 사고 처리 중 발생하는 2차 사고의 위험성</p>
          </div>
        </div>
        <div className="bg-solution fade-up">
          <div className="solution-box animated-gradient">
            <i className="fas fa-check-circle bounce-icon"></i>
            <h4>실제 도로 탐지와 신속한 신고 처리</h4>
            <p>사고 발생 전 위험 요인을 차단하고 도로 순찰을 자동화하여 안전사고를 근본적으로 감소시킵니다.</p>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="service-features-section" id="service-features">
        <div className="section-heading fade-up">
          <h2>핵심 서비스 특징</h2>
          <p>기존 시스템의 한계를 극복하는 혁신적인 솔루션</p>
        </div>
        <div className="feature-cards">
          <div className="feature-card-modern fade-up d1">
            <div className="f-icon"><i className="fas fa-layer-group"></i></div>
            <h3>중복 병합 및 스마트 결함 관리</h3>
            <p>PostGIS 기반 공간 분석을 통해 동일한 위치의 결함 데이터(포트홀 등)가 중복 신고되는 것을 방지하고 효과적으로 병합 관리합니다.</p>
          </div>
          <div className="feature-card-modern fade-up d2">
            <div className="f-icon"><i className="fas fa-file-signature"></i></div>
            <h3>지자체 공문서 자동 생성</h3>
            <p>감지된 위험 요소 데이터를 바탕으로 관할 지자체 제출용 표준 공문서를 시스템이 즉각 생성하여 업무 부담을 덜어줍니다.</p>
          </div>
          <div className="feature-card-modern fade-up d3">
            <div className="f-icon"><i className="fas fa-satellite-dish"></i></div>
            <h3>실시간 알림 및 통합 관제</h3>
            <p>현장의 위험 상황은 모바일 앱을 통해 운전자에게 실시간 경고되며, 관리자 웹 대시보드 지도 위에 즉시 동기화됩니다.</p>
          </div>
        </div>
      </section>

      {/* System Structure (Timeline) */}
      <section className="pdf-features-section" id="system">
        <div className="section-heading fade-up">
          <h2>End-to-End 시스템 구조</h2>
          <p>전용 하드웨어부터 모바일 앱까지</p>
        </div>
        <div className="pdf-timeline">
          
          <div className="pdf-timeline-item slide-in-left">
            <div className="pdf-icon pulse-blue"><i className="fas fa-microchip"></i></div>
            <div className="pdf-content">
              <h3>전용 하드웨어 플랫폼 (Jetson Nano)</h3>
              <p>기존 블랙박스 의존도를 탈피하여 <strong>mmWave 레이더와 카메라 모듈</strong>이 통합된 전용 하드웨어 장치를 운영합니다. 육안 식별이 불가능한 젖음 및 결빙 상태를 레이더 반사 데이터를 통해 수치화합니다.</p>
            </div>
          </div>

          <div className="pdf-timeline-item slide-in-right d1">
            <div className="pdf-icon pulse-blue"><i className="fas fa-brain"></i></div>
            <div className="pdf-content">
              <h3>AI / 딥러닝 엣지 컴퓨팅</h3>
              <p>Jetson Nano 디바이스 내에서 자체 개발 AI 모델(도로 상태 추론)과 YOLO11n 모델(포트홀/장애물 탐지)을 구동하여 지연 시간 없이 현장에서 즉각적인 결함 탐지를 수행합니다.</p>
            </div>
          </div>

          <div className="pdf-timeline-item slide-in-left d2">
            <div className="pdf-icon pulse-blue"><i className="fas fa-server"></i></div>
            <div className="pdf-content">
              <h3>클라우드 서버 / 백엔드</h3>
              <p>엣지 디바이스에서 전송된 위험 데이터를 실시간 통신 패키징(API)을 통해 수신합니다. DB(Supabase)와 PostGIS 로직을 통해 데이터 정제 및 신고 자동화 프로세스를 처리합니다.</p>
            </div>
          </div>

          <div className="pdf-timeline-item slide-in-right d3">
            <div className="pdf-icon pulse-blue"><i className="fas fa-mobile-alt"></i></div>
            <div className="pdf-content">
              <h3>모바일 앱 (사용자/순찰자)</h3>
              <p>전방 100m 이내 장애물 구간 진입 시 스마트폰 알림(실시간 위험 요소 알림) 및 지도 내 상세 정보를 제공하여 안전 사고를 예방합니다.</p>
            </div>
          </div>

          <div className="pdf-timeline-item slide-in-left d4">
            <div className="pdf-icon pulse-blue"><i className="fas fa-desktop"></i></div>
            <div className="pdf-content">
              <h3>관리자 웹 시스템</h3>
              <p>전국 도로의 위험 상황(결함 종류, 위험도, 위경도 등)을 웹 기반 대시보드 지도 상에 표출하며, 탐지 기록 관리 및 지자체 신고 내역을 통합 관제합니다.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Q&A */}
      <section className="qa-section" id="faq">
        <div className="section-heading fade-up">
          <h2>자주 묻는 질문</h2>
        </div>
        <div className="qa-list">
          {faqs.map((faq, idx) => (
            <div key={idx} className="qa-item fade-up">
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
        <p>© 2026 Smart Road Saver. MARS / 웹응용소프트웨어공학과</p>
      </footer>
    </div>
  );
}
