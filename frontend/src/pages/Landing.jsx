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

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
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
    { q: "어떤 종류의 도로 위험물을 감지할 수 있나요?", a: "포트홀, 블랙아이스, 낙하물(장애물), 도로 균열 등을 실시간으로 감지합니다. 특히 mmWave 레이더를 통해 육안으로 식별이 어려운 결빙 상태도 정확하게 파악할 수 있습니다." },
    { q: "기존 블랙박스에도 적용 가능한가요?", a: "네, 일반 차량에 부착된 블랙박스 카메라 영상과 당사의 센서 모듈(Jetson NANO, mmWave)을 결합하여 바로 활용할 수 있습니다." },
    { q: "지자체 신고는 어떻게 이루어지나요?", a: "위험물이 감지되면 서버에서 위치(GPS) 및 현장 사진을 분석하여 공문서 형태로 자동 변환하며, 설정된 지자체 담당 부서로 자동 접수됩니다." },
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
          <a href="#background" onClick={scrollToSection}>선정 배경</a>
          <a href="#features" onClick={scrollToSection}>시스템 구조</a>
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
              <Link to="/login" className="btn-primary">관제 시스템 접속</Link>
              <a href="#background" onClick={scrollToSection} className="btn-secondary">자세히 보기</a>
            </div>
          </div>
          <div className="hero-graphic-col fade-up d1">
            <div className="radar-animation">
              <div className="radar-circle circle-1"></div>
              <div className="radar-circle circle-2"></div>
              <div className="radar-circle circle-3"></div>
              <div className="radar-scanner"></div>
              <div className="radar-dot dot-1"></div>
              <div className="radar-dot dot-2"></div>
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
            <div className="bg-icon warning">⚠️</div>
            <h3>사후 대처 신고 시스템</h3>
            <p>사고가 발생한 이후에야 대처가 이루어지는 기존 신고 시스템의 한계</p>
          </div>
          <div className="bg-card fade-up d2">
            <div className="bg-icon time">⏳</div>
            <h3>비효율적인 순찰 시스템</h3>
            <p>제한된 인력으로 광범위한 도로를 모두 순찰하기 어려운 현실</p>
          </div>
          <div className="bg-card fade-up d3">
            <div className="bg-icon danger">🚨</div>
            <h3>순찰 인력의 안전 위협</h3>
            <p>고속도로 및 위험 구간에서 사고 처리 중 발생하는 2차 사고 위험</p>
          </div>
        </div>
        <div className="bg-solution fade-up">
          <div className="solution-box">
            <i className="fas fa-check-circle"></i>
            <h4>실제 도로 탐지와 신속한 신고 처리</h4>
            <p>사고 발생 전 위험 요인을 차단하고 도로 순찰을 자동화하여 안전사고를 근본적으로 감소시킵니다.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pdf-features-section" id="features">
        <div className="section-heading fade-up">
          <h2>시스템 주요 기능</h2>
          <p>하드웨어부터 관리자 웹까지, 완벽한 End-to-End 솔루션</p>
        </div>
        <div className="pdf-timeline">
          
          <div className="pdf-timeline-item fade-up">
            <div className="pdf-icon"><i className="fas fa-microchip"></i></div>
            <div className="pdf-content">
              <h3>하드웨어 (Jetson Nano)</h3>
              <p>mmWave 레이더와 카메라 모듈을 결합하여 데이터를 수집합니다. 육안으로 식별 불가능한 젖음 및 결빙 상태를 mmWave 레이더 노면 반사 데이터를 통해 정확하게 수치화합니다.</p>
            </div>
          </div>

          <div className="pdf-timeline-item fade-up d1">
            <div className="pdf-icon"><i className="fas fa-brain"></i></div>
            <div className="pdf-content">
              <h3>AI / 딥러닝</h3>
              <p>자체 개발 AI 모델을 통해 도로 상태(결빙, 젖음 등)를 추론하고, YOLO11n 모델을 활용하여 포트홀 및 장애물을 실시간으로 결함 탐지합니다.</p>
            </div>
          </div>

          <div className="pdf-timeline-item fade-up d2">
            <div className="pdf-icon"><i className="fas fa-server"></i></div>
            <div className="pdf-content">
              <h3>서버 / 백엔드</h3>
              <p>수집된 위험 데이터를 중복 병합하고, 데이터베이스(Supabase)에 저장하여 실시간 결함 관리 및 지자체 자동 신고 로직을 수행합니다.</p>
            </div>
          </div>

          <div className="pdf-timeline-item fade-up d3">
            <div className="pdf-icon"><i className="fas fa-mobile-alt"></i></div>
            <div className="pdf-content">
              <h3>모바일 앱</h3>
              <p>운전자에게 실시간 위험 요소 알림 및 상세 정보를 제공하여 안전 사고를 선제적으로 예방합니다.</p>
            </div>
          </div>

          <div className="pdf-timeline-item fade-up d4">
            <div className="pdf-icon"><i className="fas fa-desktop"></i></div>
            <div className="pdf-content">
              <h3>관리자 웹</h3>
              <p>전국 도로의 위험 상황을 실시간 지도 기반으로 표출하며, 탐지 기록과 자동 신고 문서를 통합 관제합니다.</p>
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
