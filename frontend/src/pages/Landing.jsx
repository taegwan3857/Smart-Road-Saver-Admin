import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/landing.css';

export default function Landing() {
 const [openFaq, setOpenFaq] = useState(null);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const navigate = useNavigate();

 useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
    if (entry.isIntersecting) {
     entry.target.classList.add('visible');
    } else {
     entry.target.classList.remove('visible');
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
   setMobileMenuOpen(false);
  }
 };

 return (
  <div className="landing-container">
   {/* Nav */}
   <header className="landing-header">
    <a href="#home" onClick={scrollToSection} className="landing-logo" style={{ textDecoration: 'none' }}>
     <i className="fas fa-shield-alt"></i> SMART ROAD SAVER
    </a>
    <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
     <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
    </button>
    <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
     <a href="#home" onClick={scrollToSection}>홈</a>
     <a href="#purpose" onClick={scrollToSection}>개발 목적</a>
     <a href="#features" onClick={scrollToSection}>주요 내용 및 특징</a>
     <a href="#application" onClick={scrollToSection}>활용 분야</a>
     <a href="#effects" onClick={scrollToSection}>기대 효과</a>
     <a href="#team" onClick={scrollToSection}>동아리 소개</a>
    </nav>
   </header>

   {/* Hero */}
   <section className="hero-section" id="home">
    <div className="hero-content">
     <div className="hero-text-col fade-up">
      <div className="hero-badge">AI 기반 도로 안전 솔루션</div>
      <h1 className="hero-title">
       미래를 향한 안전한 길,<br />
       <span className="text-gradient">SMART ROAD SAVER</span>
      </h1>
      <p className="hero-subtitle" style={{ wordBreak: 'keep-all' }}>
       mmWave 레이더 센서와 비전 AI를 결합하여<br className="hide-mobile" />
       주행 중 도로 위의 위험 요소를 실시간으로 탐지하고<br className="hide-mobile" />
       자동 신고 및 알림을 통해 사고를 사전에 예방합니다.
      </p>
      <div className="hero-btns">
       <Link to="/login" className="btn-primary">
        관리자 관제 센터 <i className="fas fa-arrow-right" style={{marginLeft: '8px'}}></i>
       </Link>
       <a href="#purpose" onClick={scrollToSection} className="btn-secondary">
        솔루션 알아보기
       </a>
      </div>
     </div>
    </div>
   </section>

   {/* Purpose */}
   <section className="full-screen-section" id="purpose" style={{backgroundColor: "var(--bg-body)"}}>
    <div className="section-inner">
     <div className="section-heading fade-up">
      <div className="hero-badge" style={{background: '#f1f5f9', color: '#1d3162', marginBottom: '16px', display: 'inline-block'}}>배경 및 목적</div>
      <h2>개발 목적</h2>
     </div>
     <div className="bg-grid">
      <div className="bg-card slide-in-left d1">
       <div className="bg-icon"><i className="fas fa-exclamation-triangle"></i></div>
       <h3>기존 시스템의 한계</h3>
       <p>매년 2만 건 이상의 교통사고가 도로 위의 장애물과 포트홀, 결빙 등으로 발생하고 있습니다. 그러나 사고 후 신고 또는 기존 도로 순찰 탐지 방법은 막대한 비용과 시간이 소요될 뿐만 아니라 순찰원의 2차 사고 위험까지 가지고 있으며 사고가 발생한 후에야 운전자가 직접 신고하고 대처하는 방식에 의존하여 사고 예방에 한계가 있었습니다.</p>
      </div>
      <div className="bg-card slide-in-right d2">
       <div className="bg-icon" style={{color: '#10b981', background: '#d1fae5'}}><i className="fas fa-shield-alt"></i></div>
       <h3>SMART ROAD SAVER의 해결책</h3>
       <p>블랙박스와 결합하거나 별도의 디바이스로 구성된 SMART ROAD SAVER는 mmWave 레이더 센서와 비전 AI를 결합하여 일반 자동차들이 주행 중 도로 위의 위험 요소를 실시간으로 탐지하고 즉각 자동신고 및 전파함으로써 노면 결함으로 인한 사고를 사전에 차단하고, 또한 사용자가 신고된 위치를 지날 때 자동으로 알림을 받아 사고 위험을 대비하여 사고를 최소화 할 수 있도록 개발된 서비스입니다.</p>
      </div>
     </div>
    </div>
   </section>

   {/* Features */}
   <section className="full-screen-section" id="features" style={{backgroundColor: "var(--bg-panel)"}}>
    <div className="section-inner">
     <div className="section-heading fade-up">
      <div className="hero-badge" style={{background: '#f1f5f9', color: '#1d3162', marginBottom: '16px', display: 'inline-block'}}>특징 및 구성</div>
      <h2>주요 내용 및 특징</h2>
      <p style={{marginTop: '16px', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6', wordBreak: 'keep-all'}}>
       SMART ROAD SAVER는 하드웨어부터 AI 딥러닝, 백엔드 서버, 앱과 웹의 프론트엔드까지 모든 과정을 직접 구현하고 개발한 시스템입니다.
      </p>
     </div>
     <div className="feature-cards">
      <div className="feature-card-modern fade-up d1">
       <div className="f-icon"><i className="fas fa-microchip"></i></div>
       <h3>하드웨어 및 AI</h3>
       <p>기존에 비전 AI만을 사용해서 도로 위의 결함을 측정하였으나 육안으로 식별이 어려운 도로 결빙이나 젖은 노면과 같은 상태는 탐지가 힘들다는 한계를 맞닥뜨리고 mmWave 레이더를 도입하여 도로에 부딪혀 돌아오는 반사파를 통해 이러한 한계를 극복하였습니다.<br/><br/>mmWave 레이더 센서, 카메라, GPS 수신기가 Jetson Nano에 장착되어 있습니다. 도로 위의 위험 요소를 탐지하고 분석하는 AI 모델은 직접 추출하고 수집한 데이터를 라벨링과 전처리 등의 과정을 거치고 학습시켜 개발하였습니다.</p>
      </div>
      <div className="feature-card-modern fade-up d2">
       <div className="f-icon"><i className="fas fa-server"></i></div>
       <h3>백엔드 & 프론트엔드</h3>
       <p>백엔드에서는 실시간 통신과 중복 위험 요소를 병합하는 로직 및 자동 신고 로직 등을 구축하였고 프론트엔드에서는 운전자에게 실시간 위험 접근 알림과 지도를 제공하는 모바일 앱과 전국 도로와 장치를 관제할 수 있는 관리자 웹 그리고 블랙박스나 전용 기기용 대시보드를 직접 개발하였습니다.</p>
      </div>
     </div>
    </div>
   </section>

   {/* Application */}
   <section className="full-screen-section" id="application" style={{backgroundColor: "var(--bg-body)"}}>
    <div className="section-inner">
     <div className="section-heading fade-up">
      <h2>활용 분야 및 적용 방안</h2>
      <p>본 시스템은 차량의 블랙박스 및 전용 기기로 탑재되어 주행 중 도로 위의 위험 요소를 실시간으로 탐지합니다.</p>
     </div>
     <div className="feature-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      
      <div className="feature-card-new fade-up d1">
       <div className="fc-icon"><i className="fas fa-bus"></i></div>
       <h3>전국 단위 관제 (일반/공공 차량)</h3>
       <p>일반 차량뿐만 아니라 시내버스, 택시, 도로순찰차량 등에 장착되어 전국의 도로를 탐지하고 관리할 수 있습니다. 이렇게 수집된 위험 요소는 지자체 및 도로관리기관에 자동으로 신고되어 신속한 보수를 가능하게 합니다.</p>
      </div>
      
      <div className="feature-card-new fade-up d2">
       <div className="fc-icon"><i className="fas fa-mobile-alt"></i></div>
       <h3>운전자 모바일 연동</h3>
       <p>운전자는 모바일 앱이나 내비게이션 연동을 통해 전방 위험 요소에 접근 시 실시간으로 알림을 받아 사고를 사전에 대비하고 예방할 수 있습니다.</p>
      </div>

      <div className="feature-card-new fade-up d3">
       <div className="fc-icon"><i className="fas fa-desktop"></i></div>
       <h3>관리자 웹 대시보드</h3>
       <p>관리자는 웹 대시보드를 통해 전국의 도로를 한눈에 관제하고 유연하게 대처할 수 있으며 이러한 시스템은 도로 위의 모든 차량과 지도 서비스 그리고 도로관리기관 등 광범위하게 적용될 수 있습니다.</p>
      </div>

     </div>
    </div>
   </section>

   {/* Expected Effects */}
   <section className="full-screen-section" id="effects" style={{background: '#0f172a', color: '#fff'}}>
    <div className="section-inner">
     <div className="section-heading fade-up">
      <h2 style={{color: '#fff'}}>기대 효과</h2>
     </div>
     <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}} className="fade-up d1">
      
      <div className="effect-item">
       <h3 style={{fontSize: '1.3rem', fontWeight: '800', marginBottom: '12px', color: '#60a5fa'}}><i className="fas fa-shield-alt" style={{marginRight: '8px'}}></i>안전사고의 근본적 감소</h3>
       <p style={{color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6', wordBreak: 'keep-all'}}>SMART ROAD SAVER는 도로 위의 안전사고를 근본적으로 감소시킬 수 있습니다. 주행 중 도로 위의 결함이나 상태를 실시간으로 탐지 및 분석하고 자동으로 신고하여 신속한 보수를 지원함으로써 도로 위의 안전사고와 그로 인한 인명 피해를 줄일 수 있습니다.</p>
      </div>

      <div className="effect-item">
       <h3 style={{fontSize: '1.3rem', fontWeight: '800', marginBottom: '12px', color: '#60a5fa'}}><i className="fas fa-car-crash" style={{marginRight: '8px'}}></i>노면 결함 피해 획기적 축소</h3>
       <p style={{color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6', wordBreak: 'keep-all'}}>이러한 시스템은 일반 차량의 블랙박스나 전용 기기를 통해 쉽게 도입되어 전국의 도로를 상시 순찰할 수 있어 노면 결함으로 인한 피해를 획기적으로 낮출 수 있습니다. 또한 모바일 앱을 사용하는 운전자에게는 위험 요소에 접근하게 될 시 실시간 위험 접근 경고 알림을 전송하여 감속과 우회를 유도함으로써 도로 위의 사고에 미리 대처하고 예방할 수 있도록 돕습니다.</p>
      </div>

      <div className="effect-item">
       <h3 style={{fontSize: '1.3rem', fontWeight: '800', marginBottom: '12px', color: '#60a5fa'}}><i className="fas fa-won-sign" style={{marginRight: '8px'}}></i>막대한 비용과 시간 절감</h3>
       <p style={{color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6', wordBreak: 'keep-all'}}>나아가 기존에 인력 중심의 순찰 방식으로 인해 소모되던 막대한 비용과 시간을 SMART ROAD SAVER 도입으로 자동화하고 기존의 사후 신고 처리 방식을 실시간 자동 신고하는 방식으로 전환하여 대폭 절감함과 동시에 순찰 인력의 2차 사고 또한 방지할 수 있습니다.</p>
      </div>

     </div>
    </div>
   </section>

   {/* Team Intro */}
   <section className="qa-section full-screen-section" id="team" style={{backgroundColor: "var(--bg-panel)"}}>
    <div className="section-inner">
     <div className="section-heading fade-up">
      <h2>동아리 소개</h2>
      <p>동양미래대학교 컴퓨터공학부 웹응용소프트웨어공학과 동아리</p>
     </div>
     
     <div className="fade-up d1" style={{background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '40px', maxWidth: '800px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.02)'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '32px', flexWrap: 'wrap'}}>
        <div style={{fontSize: '2rem', fontWeight: '800', color: '#1d3162'}}>동아리명 : MARS</div>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px'}}>
        <div style={{padding: '20px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center'}}>
          <h4 style={{fontSize: '1.1rem', color: '#475569', marginBottom: '12px', fontWeight: '700'}}>지도교수</h4>
          <p style={{fontSize: '1.2rem', color: '#0f172a', fontWeight: '800'}}>조강홍, 이동규</p>
        </div>
        
        <div style={{padding: '20px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', gridColumn: '1 / -1'}}>
          <h4 style={{fontSize: '1.1rem', color: '#475569', marginBottom: '12px', fontWeight: '700'}}>참여학생</h4>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center'}}>
            {['김찬희', '정세희', '김수한', '김시호', '김민건', '오태관', '박서현', '김병원', '유한영', '엄희재'].map((name, idx) => (
              <span key={idx} style={{background: '#eff6ff', color: '#1d3162', padding: '8px 16px', borderRadius: '100px', fontWeight: '600'}}>{name}</span>
            ))}
          </div>
        </div>
      </div>
     </div>
    </div>
   </section>

   {/* Footer */}
   <footer className="landing-footer">
    <strong><i className="fas fa-shield-alt" style={{marginRight:'6px'}}></i>SMART ROAD SAVER</strong>
    <p>© 2026 동양미래대학교 MARS. All rights reserved.</p>
   </footer>
  </div>
 );
}
