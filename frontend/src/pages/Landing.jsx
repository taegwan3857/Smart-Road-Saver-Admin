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
   {/* Hero */}
   <section className="hero-section" id="home">
    <div className="hero-content">
     <div className="hero-text-col fade-up">
      <div className="hero-badge">AI 기반 도로 안전 솔루션</div>
      <h1 className="hero-title">
       미래를 향한 안전한 길,<br />
       <span className="text-gradient" style={{whiteSpace: "nowrap"}}>SMART ROAD SAVER</span>
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
     
     <div className="hero-graphic-col slide-in-right">
      <div className="radar-animation">
       <div className="radar-circle circle-1"></div>
       <div className="radar-circle circle-2"></div>
       <div className="radar-circle circle-3"></div>
       <div className="radar-scanner"></div>
       
       <div className="floating-ui ui-top-right">
        <i className="fas fa-circle text-green blinking"></i> AI 분석 서버 활성화
       </div>
       <div className="floating-ui ui-bottom-left">
        <strong><i className="fas fa-bolt text-blue"></i> YOLO11n</strong>
        <span>객체 탐지 가동 중</span>
       </div>
       <div className="floating-ui ui-bottom-right">
        <strong><i className="fas fa-wifi text-blue"></i> mmWave</strong>
        <span>노면 상태 스캔</span>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Purpose */}
   {/* Purpose */}
   <section className="full-screen-section" id="purpose" style={{backgroundColor: "#f8fafc"}}>
    <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto'}}>
     <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '60px'}}>
      <div style={{fontSize: '0.9rem', fontWeight: '800', color: '#3b82f6', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase'}}>Background & Purpose</div>
      <h2 style={{fontSize: '2.5rem', fontWeight: '800', color: '#0f172a'}}>개발 목적</h2>
     </div>
     
     <div style={{display: 'flex', gap: '30px', flexWrap: 'wrap'}} className="fade-up d1">
      <div style={{flex: '1 1 400px', background: '#ffffff', borderRadius: '24px', padding: '48px', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column'}}>
       <div style={{width: '64px', height: '64px', background: '#f1f5f9', color: '#475569', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '32px'}}><i className="fas fa-exclamation-triangle"></i></div>
       <h3 style={{fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '20px'}}>기존 시스템의 한계</h3>
       <p style={{fontSize: '1.1rem', color: '#64748b', lineHeight: '1.8', wordBreak: 'keep-all', margin: 0}}>매년 2만 건 이상의 교통사고가 도로 위의 장애물과 포트홀, 결빙 등으로 발생하고 있습니다. 그러나 사고 후 신고 또는 기존 도로 순찰 탐지 방법은 막대한 비용과 시간이 소요될 뿐만 아니라 순찰원의 2차 사고 위험까지 가지고 있으며 사고가 발생한 후에야 운전자가 직접 신고하고 대처하는 방식에 의존하여 사고 예방에 한계가 있었습니다.</p>
      </div>
      
      <div style={{flex: '1 1 400px', background: '#ffffff', borderRadius: '24px', padding: '48px', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column'}}>
       <div style={{width: '64px', height: '64px', background: '#eff6ff', color: '#3b82f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '32px'}}><i className="fas fa-shield-alt"></i></div>
       <h3 style={{fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '20px'}}><span style={{whiteSpace: 'nowrap'}}>SMART ROAD SAVER</span>의 해결책</h3>
       <p style={{fontSize: '1.1rem', color: '#64748b', lineHeight: '1.8', wordBreak: 'keep-all', margin: 0}}>블랙박스와 결합하거나 별도의 디바이스로 구성된 <span style={{whiteSpace: 'nowrap'}}>SMART ROAD SAVER</span>는 mmWave 레이더 센서와 비전 AI를 결합하여 일반 자동차들이 주행 중 도로 위의 위험 요소를 실시간으로 탐지하고 즉각 자동신고 및 전파함으로써 노면 결함으로 인한 사고를 사전에 차단하고, 또한 사용자가 신고된 위치를 지날 때 자동으로 알림을 받아 사고 위험을 대비하여 사고를 최소화 할 수 있도록 개발된 서비스입니다.</p>
      </div>
     </div>
    </div>
   </section>

   {/* Features */}
   {/* Features */}
   <section className="full-screen-section" id="features" style={{backgroundColor: "#ffffff", padding: '100px 24px'}}>
    <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto'}}>
     <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '60px'}}>
      <div style={{fontSize: '0.9rem', fontWeight: '800', color: '#3b82f6', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase'}}>Core Features</div>
      <h2 style={{fontSize: '2.5rem', fontWeight: '800', color: '#0f172a'}}>주요 내용 및 특징</h2>
      <p style={{marginTop: '20px', fontSize: '1.15rem', color: '#64748b', lineHeight: '1.6', wordBreak: 'keep-all', maxWidth: '800px', margin: '20px auto 0'}}>
       <span style={{whiteSpace: 'nowrap'}}>SMART ROAD SAVER</span>는 하드웨어부터 AI 딥러닝, 백엔드 서버, 앱과 웹의 프론트엔드까지 모든 과정을 직접 구현하고 개발한 통합 시스템입니다.
      </p>
     </div>
     
     <div style={{display: 'flex', flexDirection: 'column', gap: '40px'}} className="fade-up d1">
      <div style={{background: '#f8fafc', borderRadius: '24px', padding: '48px', border: '1px solid #e2e8f0', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center'}}>
       <div style={{flex: '1 1 300px'}}>
        <h3 style={{fontSize: '1.8rem', fontWeight: '800', color: '#1e293b', marginBottom: '20px'}}>하드웨어 및 AI</h3>
        <p style={{fontSize: '1.1rem', color: '#64748b', lineHeight: '1.8', wordBreak: 'keep-all'}}>기존에 비전 AI만을 사용해서 도로 위의 결함을 측정하였으나 육안으로 식별이 어려운 도로 결빙이나 젖은 노면과 같은 상태는 탐지가 힘들다는 한계를 맞닥뜨리고 mmWave 레이더를 도입하여 도로에 부딪혀 돌아오는 반사파를 통해 이러한 한계를 극복하였습니다.</p>
        <p style={{fontSize: '1.1rem', color: '#64748b', lineHeight: '1.8', wordBreak: 'keep-all', marginTop: '16px'}}>mmWave 레이더 센서, 카메라, GPS 수신기가 Jetson Nano에 장착되어 있습니다. 도로 위의 위험 요소를 탐지하고 분석하는 AI 모델은 직접 추출하고 수집한 데이터를 라벨링과 전처리 등의 과정을 거치고 학습시켜 개발하였습니다.</p>
       </div>
      </div>

      <div style={{background: '#f8fafc', borderRadius: '24px', padding: '48px', border: '1px solid #e2e8f0', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center'}}>
       <div style={{flex: '1 1 300px'}}>
        <h3 style={{fontSize: '1.8rem', fontWeight: '800', color: '#1e293b', marginBottom: '20px'}}>백엔드 & 프론트엔드</h3>
        <p style={{fontSize: '1.1rem', color: '#64748b', lineHeight: '1.8', wordBreak: 'keep-all'}}>백엔드에서는 실시간 통신과 중복 위험 요소를 병합하는 로직 및 자동 신고 로직 등을 구축하였고, 프론트엔드에서는 운전자에게 실시간 위험 접근 알림과 지도를 제공하는 모바일 앱과 전국 도로와 장치를 관제할 수 있는 관리자 웹 그리고 블랙박스나 전용 기기용 대시보드를 직접 개발하였습니다.</p>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* System Architecture */}
   <section className="pdf-features-section full-screen-section" id="system" style={{backgroundColor: "var(--bg-panel)"}}>
    <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto'}}>
     <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '60px'}}>
      <div style={{fontSize: '0.9rem', fontWeight: '800', color: '#3b82f6', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase'}}>System Architecture</div>
      <h2 style={{fontSize: '2.5rem', fontWeight: '800', color: '#0f172a'}}>시스템 구성도</h2>
      <p style={{marginTop: '20px', fontSize: '1.15rem', color: '#64748b', lineHeight: '1.6'}}>전용 하드웨어부터 모바일 앱까지 완벽한 통합 관제</p>
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
        <p>엣지 디바이스에서 전송된 위험 데이터를 실시간 통신 패키징(API)을 통해 수신합니다. DB(PostgreSQL/PostGIS) 로직을 통해 데이터 정제 및 신고 자동화 프로세스를 처리합니다.</p>
       </div>
      </div>

      <div className="pdf-timeline-item slide-in-right d3">
       <div className="pdf-icon pulse-blue"><i className="fas fa-mobile-alt"></i></div>
       <div className="pdf-content">
        <h3>모바일 앱 사용자</h3>
        <p>전방 100m 이내 장애물 구간 진입 시 스마트폰 알림(실시간 위험 요소 알림) 및 지도 내 상세 정보를 제공하여 사용자의 안전 사고를 선제적으로 예방합니다.</p>
       </div>
      </div>

      <div className="pdf-timeline-item slide-in-left d4">
       <div className="pdf-icon pulse-blue"><i className="fas fa-desktop"></i></div>
       <div className="pdf-content">
        <h3>관제센터 (관리자 웹)</h3>
        <p>전국 도로의 위험 상황(결함 종류, 위험도, 위경도 등)을 웹 기반 대시보드 지도 상에 표출하며, 실시간 탐지 기록과 지자체 신고 내역을 완벽하게 통합 관제합니다.</p>
       </div>
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
   {/* Team Intro */}
   <section className="qa-section full-screen-section" id="team" style={{backgroundColor: "#f8fafc", padding: '100px 24px'}}>
    <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto'}}>
    <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '60px'}}>
     <div style={{fontSize: '0.9rem', fontWeight: '800', color: '#3b82f6', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase'}}>Team Introduction</div>
     <h2 style={{fontSize: '2.5rem', fontWeight: '800', color: '#0f172a'}}>동아리 소개</h2>
     <p style={{marginTop: '20px', fontSize: '1.15rem', color: '#64748b', lineHeight: '1.6'}}>SMART ROAD SAVER를 기획하고 개발한 동양미래대학교 MARS 팀원들을 소개합니다</p>
    </div>
    
    <div className="fade-up d1" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
     {/* Central Node / Architecture Root */}
     <div style={{background: '#1e293b', color: '#fff', padding: '24px 60px', borderRadius: '20px', border: '1px solid #334155', boxShadow: '0 20px 40px rgba(15,23,42,0.15)', textAlign: 'center', position: 'relative', zIndex: 2}}>
       <div style={{fontSize: '2.5rem', marginBottom: '12px', color: '#3b82f6'}}><i className="fas fa-users-cog"></i></div>
       <h3 style={{fontSize: '1.8rem', fontWeight: '800', margin: '0 0 8px 0'}}>동아리 MARS</h3>
       <p style={{fontSize: '1.1rem', color: '#94a3b8', margin: 0}}>Project SMART ROAD SAVER</p>
     </div>
     
     {/* Architecture Lines Container */}
     <div style={{width: '2px', height: '40px', background: '#cbd5e1', zIndex: 1}}></div>

     {/* Grid of Teams (Architecture Flow) */}
     <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', width: '100%', maxWidth: '1000px', position: 'relative', borderTop: '3px solid #cbd5e1', paddingTop: '40px'}}>
       
       {/* Connection dots */}
       <div style={{position: 'absolute', top: '-7px', left: '16.66%', transform: 'translateX(-50%)', width: '11px', height: '11px', background: '#cbd5e1', borderRadius: '50%'}}></div>
       <div style={{position: 'absolute', top: '-7px', left: '50%', transform: 'translateX(-50%)', width: '11px', height: '11px', background: '#cbd5e1', borderRadius: '50%'}}></div>
       <div style={{position: 'absolute', top: '-7px', left: '83.33%', transform: 'translateX(-50%)', width: '11px', height: '11px', background: '#cbd5e1', borderRadius: '50%'}}></div>

       {/* Team 1 */}
       <div style={{background: '#ffffff', borderRadius: '20px', padding: '32px 24px', textAlign: 'center', border: '1px solid #e2e8f0', borderTopColor: '#3b82f6', borderTopWidth: '6px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative', marginTop: '-20px'}}>
         <div style={{width: '2px', height: '20px', background: '#cbd5e1', position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)'}}></div>
         <div style={{width: '64px', height: '64px', background: '#eff6ff', color: '#3b82f6', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 20px'}}><i className="fas fa-mobile-alt"></i></div>
         <h4 style={{fontSize: '1.3rem', fontWeight: '800', color: '#1e293b', marginBottom: '16px'}}>웹 & 앱 팀</h4>
         <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
           <span style={{fontSize: '1.05rem', color: '#64748b', fontWeight: '600'}}>오태관</span>
           <span style={{fontSize: '1.05rem', color: '#64748b', fontWeight: '600'}}>박서현</span>
         </div>
       </div>

       {/* Team 2 */}
       <div style={{background: '#ffffff', borderRadius: '20px', padding: '32px 24px', textAlign: 'center', border: '1px solid #e2e8f0', borderTopColor: '#10b981', borderTopWidth: '6px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative', marginTop: '-20px'}}>
         <div style={{width: '2px', height: '20px', background: '#cbd5e1', position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)'}}></div>
         <div style={{width: '64px', height: '64px', background: '#ecfdf5', color: '#10b981', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 20px'}}><i className="fas fa-server"></i></div>
         <h4 style={{fontSize: '1.3rem', fontWeight: '800', color: '#1e293b', marginBottom: '16px'}}>서버 팀</h4>
         <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
           <span style={{fontSize: '1.05rem', color: '#64748b', fontWeight: '600'}}>김찬희</span>
           <span style={{fontSize: '1.05rem', color: '#64748b', fontWeight: '600'}}>정세희</span>
         </div>
       </div>

       {/* Team 3 */}
       <div style={{background: '#ffffff', borderRadius: '20px', padding: '32px 24px', textAlign: 'center', border: '1px solid #e2e8f0', borderTopColor: '#f59e0b', borderTopWidth: '6px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', position: 'relative', marginTop: '-20px'}}>
         <div style={{width: '2px', height: '20px', background: '#cbd5e1', position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)'}}></div>
         <div style={{width: '64px', height: '64px', background: '#fffbeb', color: '#f59e0b', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 20px'}}><i className="fas fa-microchip"></i></div>
         <h4 style={{fontSize: '1.3rem', fontWeight: '800', color: '#1e293b', marginBottom: '16px'}}>하드웨어 & AI 팀</h4>
         <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
           <span style={{fontSize: '1.05rem', color: '#64748b', fontWeight: '600'}}>김수한</span>
           <span style={{fontSize: '1.05rem', color: '#64748b', fontWeight: '600'}}>김시호</span>
           <span style={{fontSize: '1.05rem', color: '#64748b', fontWeight: '600'}}>김민건</span>
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
