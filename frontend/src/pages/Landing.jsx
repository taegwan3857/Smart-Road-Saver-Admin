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
     <a href="#team" onClick={scrollToSection}>개발자 소개</a>
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
        관리자 관제 센터 <i className="fas fa-desktop" style={{marginLeft: '8px'}}></i>
       </Link>
       <a href="https://app-smart-road-saver.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
        운전자 앱 <i className="fas fa-mobile-alt" style={{marginLeft: '8px'}}></i>
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
   <section className="full-screen-section" id="purpose" style={{backgroundColor: "#ffffff", overflow: 'hidden'}}>
    <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto', position: 'relative'}}>
     <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '60px'}}>
      <h2 style={{fontSize: '2.5rem', fontWeight: '800', color: '#0f172a'}}>개발 목적</h2>
      <p style={{marginTop: '20px', fontSize: '1.15rem', color: '#64748b'}}>안전한 도로 환경 조성을 위한 스마트 예방 시스템 도입</p>
     </div>
     
     <div style={{display: 'flex', flexDirection: 'column', gap: '0', maxWidth: '900px', margin: '0 auto'}} className="fade-up d1">
      {/* Problem */}
      <div style={{background: '#fff1f2', borderLeft: '8px solid #f43f5e', padding: '40px', borderRadius: '24px 24px 24px 0', position: 'relative', zIndex: 1, boxShadow: '0 10px 30px rgba(244,63,94,0.1)'}}>
       <div style={{position: 'absolute', top: '-15px', left: '32px', background: '#f43f5e', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px'}}>PROBLEM</div>
       <h3 style={{fontSize: '1.6rem', fontWeight: '800', color: '#881337', marginBottom: '16px', marginTop: '10px'}}><i className="fas fa-exclamation-triangle" style={{marginRight: '10px'}}></i>기존 시스템의 한계</h3>
       <p style={{fontSize: '1.15rem', color: '#9f1239', lineHeight: '1.8', wordBreak: 'keep-all', margin: 0}}>매년 2만 건 이상의 교통사고가 도로 위의 장애물과 포트홀, 결빙 등으로 발생하고 있습니다. 그러나 사고 후 신고 또는 기존 도로 순찰 탐지 방법은 막대한 비용과 시간이 소요될 뿐만 아니라 순찰원의 2차 사고 위험까지 가지고 있으며 사고가 발생한 후에야 운전자가 직접 신고하고 대처하는 방식에 의존하여 사고 예방에 한계가 있었습니다.</p>
      </div>
      
      {/* Connector */}
      <div style={{display: 'flex', justifyContent: 'flex-end', padding: '0 40px', marginTop: '-20px', marginBottom: '-20px', position: 'relative', zIndex: 2}}>
        <div style={{width: '50px', height: '50px', background: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontSize: '1.2rem', color: '#3b82f6'}}>
          <i className="fas fa-arrow-down"></i>
        </div>
      </div>

      {/* Solution */}
      <div style={{background: '#eff6ff', borderRight: '8px solid #3b82f6', padding: '40px', borderRadius: '24px 0 24px 24px', position: 'relative', zIndex: 1, boxShadow: '0 10px 30px rgba(59,130,246,0.1)', textAlign: 'right'}}>
       <div style={{position: 'absolute', top: '-15px', right: '32px', background: '#3b82f6', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px'}}>SOLUTION</div>
       <h3 style={{fontSize: '1.6rem', fontWeight: '800', color: '#1e3a8a', marginBottom: '16px', marginTop: '10px'}}>SMART ROAD SAVER의 해결책 <i className="fas fa-lightbulb" style={{marginLeft: '10px'}}></i></h3>
       <p style={{fontSize: '1.15rem', color: '#1e40af', lineHeight: '1.8', wordBreak: 'keep-all', margin: 0}}>블랙박스와 결합하거나 별도의 디바이스로 구성된 SMART ROAD SAVER는 mmWave 레이더 센서와 비전 AI를 결합하여 일반 자동차들이 주행 중 도로 위의 위험 요소를 실시간으로 탐지하고 즉각 자동신고 및 전파함으로써 노면 결함으로 인한 사고를 사전에 차단하고, 또한 사용자가 신고된 위치를 지날 때 자동으로 알림을 받아 사고 위험을 대비하여 사고를 최소화 할 수 있도록 개발된 서비스입니다.</p>
      </div>
     </div>
    </div>
   </section>

   {/* Features */}
   {/* Features */}
   {/* Features (Using the Timeline Design) */}
   <section className="pdf-features-section full-screen-section" id="features" style={{backgroundColor: "#f1f5f9"}}>
    <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto'}}>
     <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '60px'}}>
      <h2 style={{fontSize: '2.5rem', fontWeight: '800', color: '#0f172a'}}>주요 내용 및 특징</h2>
      <p style={{marginTop: '20px', fontSize: '1.15rem', color: '#64748b', lineHeight: '1.6', wordBreak: 'keep-all', maxWidth: '800px', margin: '20px auto 0'}}>
       <span style={{whiteSpace: 'nowrap'}}>SMART ROAD SAVER</span>는 하드웨어부터 AI 딥러닝, 백엔드 서버, 앱과 웹의 프론트엔드까지 모든 과정을 직접 구현하고 개발한 시스템입니다.
      </p>
     </div>
     
     <div className="pdf-timeline">
      <div className="pdf-timeline-item slide-in-left">
       <div className="pdf-icon pulse-blue"><i className="fas fa-microchip"></i></div>
       <div className="pdf-content">
        <h3>하드웨어 (mmWave 레이더 도입)</h3>
        <p>하드웨어에서는 기존에 비전 AI만을 사용해서 도로 위의 결함을 측정하였으나 육안으로 식별이 어려운 도로 결빙이나 젖은 노면과 같은 상태는 탐지가 힘들다는 한계를 맞닥뜨리고 mmWave 레이더를 도입하여 도로에 부딪혀 돌아오는 반사파를 통해 이러한 한계를 극복하였습니다.</p>
       </div>
      </div>

      <div className="pdf-timeline-item slide-in-right d1">
       <div className="pdf-icon pulse-blue"><i className="fas fa-brain"></i></div>
       <div className="pdf-content">
        <h3>AI 모델 및 데이터 학습</h3>
        <p>mmWave 레이더 센서, 카메라, gps 수신기가 Jetson Nano에 장착되어 있습니다. 도로 위의 위험 요소를 탐지하고 분석하는 AI 모델은 직접 추출하고 수집한 데이터를 라벨링과 전처리 등의 과정을 거치고 학습시켜 개발하였습니다.</p>
       </div>
      </div>

      <div className="pdf-timeline-item slide-in-left d2">
       <div className="pdf-icon pulse-blue"><i className="fas fa-server"></i></div>
       <div className="pdf-content">
        <h3>백엔드 및 프론트엔드 구축</h3>
        <p>백엔드에서는 실시간 통신과 중복 위험 요소를 병합하는 로직 및 자동 신고 로직 등을 구축하였고 프론트엔드에서는 운전자에게 실시간 위험 접근 알림과 지도를 제공하는 모바일 앱과 전국 도로와 장치를 관제할 수 있는 관리자 웹 그리고 블랙박스나 전용 기기용 대시보드를 직접 개발하였습니다.</p>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Application */}
   <section className="full-screen-section" id="application" style={{backgroundColor: "#ffffff", overflow: 'hidden'}}>
    <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto'}}>
     <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '60px'}}>
      <h2>활용 분야 및 적용 방안</h2>
      <p>본 시스템은 차량의 블랙박스 및 전용 기기로 탑재되어 주행 중 도로 위의 위험 요소를 실시간으로 탐지합니다.</p>
     </div>
     
     <div style={{display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '900px', margin: '0 auto'}} className="fade-up d1">
      
      {/* 1 */}
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center', background: '#f8fafc', borderRadius: '30px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 15px 35px rgba(0,0,0,0.03)'}}>
       <div style={{minWidth: '100px', height: '100px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '24px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: '0 10px 20px rgba(16,185,129,0.2)'}}><i className="fas fa-bus"></i></div>
       <div style={{flex: 1, minWidth: '280px'}}>
        <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', marginBottom: '10px'}}>전국 단위 관제 (일반/공공 차량)</h3>
        <p style={{fontSize: '1.05rem', color: '#64748b', lineHeight: '1.6', margin: 0, wordBreak: 'keep-all'}}>일반 차량뿐만 아니라 시내버스, 택시, 도로순찰차량 등에 장착되어 전국의 도로를 탐지하고 관리할 수 있습니다. 이렇게 수집된 위험 요소는 지자체 및 도로관리기관에 자동으로 신고되어 신속한 보수를 가능하게 합니다.</p>
       </div>
      </div>
      
      {/* 2 */}
      <div style={{display: 'flex', flexWrap: 'wrap-reverse', gap: '30px', alignItems: 'center', background: '#f8fafc', borderRadius: '30px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 15px 35px rgba(0,0,0,0.03)'}}>
       <div style={{flex: 1, minWidth: '280px', textAlign: 'right'}}>
        <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', marginBottom: '10px'}}>운전자 모바일 연동</h3>
        <p style={{fontSize: '1.05rem', color: '#64748b', lineHeight: '1.6', margin: 0, wordBreak: 'keep-all'}}>운전자는 모바일 앱이나 내비게이션 연동을 통해 전방 위험 요소에 접근 시 실시간으로 알림을 받아 사고를 사전에 대비하고 예방할 수 있습니다.</p>
       </div>
       <div style={{minWidth: '100px', height: '100px', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', borderRadius: '24px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: '0 10px 20px rgba(139,92,246,0.2)'}}><i className="fas fa-mobile-alt"></i></div>
      </div>

      {/* 3 */}
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'center', background: '#f8fafc', borderRadius: '30px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 15px 35px rgba(0,0,0,0.03)'}}>
       <div style={{minWidth: '100px', height: '100px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '24px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: '0 10px 20px rgba(245,158,11,0.2)'}}><i className="fas fa-desktop"></i></div>
       <div style={{flex: 1, minWidth: '280px'}}>
        <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', marginBottom: '10px'}}>관리자 웹 대시보드</h3>
        <p style={{fontSize: '1.05rem', color: '#64748b', lineHeight: '1.6', margin: 0, wordBreak: 'keep-all'}}>관리자는 웹 대시보드를 통해 전국의 도로를 한눈에 관제하고 유연하게 대처할 수 있으며 이러한 시스템은 도로 위의 모든 차량과 지도 서비스 그리고 도로관리기관 등 광범위하게 적용될 수 있습니다.</p>
       </div>
      </div>

     </div>
    </div>
   </section>

   {/* Expected Effects */}
   <section className="full-screen-section" id="effects" style={{background: '#0f172a', color: '#fff'}}>
    <div className="section-inner" style={{maxWidth: '1000px', margin: '0 auto'}}>
     <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '60px'}}>
      <h2 style={{color: '#fff'}}>기대 효과</h2>
      <p style={{color: '#94a3b8', marginTop: '16px'}}>SMART ROAD SAVER가 만들어갈 긍정적인 변화와 사회적 가치</p>
     </div>
     
     <div style={{display: 'flex', flexDirection: 'column', gap: '40px'}} className="fade-up d1">
      
      <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '30px'}}>
       <div style={{fontSize: '5rem', fontWeight: '900', color: 'transparent', lineHeight: '0.8', WebkitTextStroke: '2px rgba(255,255,255,0.1)', minWidth: '100px', userSelect: 'none'}}>01</div>
       <div style={{flex: 1, minWidth: '280px'}}>
        <h3 style={{fontSize: '1.6rem', fontWeight: '800', color: '#60a5fa', marginBottom: '12px', letterSpacing: '-0.5px'}}>안전사고의 근본적 감소</h3>
        <p style={{fontSize: '1.15rem', color: '#cbd5e1', lineHeight: '1.7', wordBreak: 'keep-all', margin: 0}}>SMART ROAD SAVER는 도로 위의 안전사고를 근본적으로 감소시킬 수 있습니다. 주행 중 도로 위의 결함이나 상태를 실시간으로 탐지 및 분석하고 자동으로 신고하여 신속한 보수를 지원함으로써 도로 위의 안전사고와 그로 인한 인명 피해를 줄일 수 있습니다.</p>
       </div>
      </div>

      <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '30px'}}>
       <div style={{fontSize: '5rem', fontWeight: '900', color: 'transparent', lineHeight: '0.8', WebkitTextStroke: '2px rgba(255,255,255,0.1)', minWidth: '100px', userSelect: 'none'}}>02</div>
       <div style={{flex: 1, minWidth: '280px'}}>
        <h3 style={{fontSize: '1.6rem', fontWeight: '800', color: '#60a5fa', marginBottom: '12px', letterSpacing: '-0.5px'}}>노면 결함 피해 획기적 축소</h3>
        <p style={{fontSize: '1.15rem', color: '#cbd5e1', lineHeight: '1.7', wordBreak: 'keep-all', margin: 0}}>이러한 시스템은 일반 차량의 블랙박스나 전용 기기를 통해 쉽게 도입되어 전국의 도로를 상시 순찰할 수 있어 노면 결함으로 인한 피해를 획기적으로 낮출 수 있습니다. 또한 모바일 앱을 사용하는 운전자에게는 위험 요소에 접근하게 될 시 실시간 위험 접근 경고 알림을 전송하여 감속과 우회를 유도함으로써 도로 위의 사고에 미리 대처하고 예방할 수 있도록 돕습니다.</p>
       </div>
      </div>

      <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '30px'}}>
       <div style={{fontSize: '5rem', fontWeight: '900', color: 'transparent', lineHeight: '0.8', WebkitTextStroke: '2px rgba(255,255,255,0.1)', minWidth: '100px', userSelect: 'none'}}>03</div>
       <div style={{flex: 1, minWidth: '280px'}}>
        <h3 style={{fontSize: '1.6rem', fontWeight: '800', color: '#60a5fa', marginBottom: '12px', letterSpacing: '-0.5px'}}>막대한 비용과 시간 절감</h3>
        <p style={{fontSize: '1.15rem', color: '#cbd5e1', lineHeight: '1.7', wordBreak: 'keep-all', margin: 0}}>나아가 기존에 인력 중심의 순찰 방식으로 인해 소모되던 막대한 비용과 시간을 SMART ROAD SAVER 도입으로 자동화하고 기존의 사후 신고 처리 방식을 실시간 자동 신고하는 방식으로 전환하여 대폭 절감함과 동시에 순찰 인력의 2차 사고 또한 방지할 수 있습니다.</p>
       </div>
      </div>

     </div>
    </div>
   </section>

   {/* System Architecture (Image from Poster) */}
   {/* System Architecture (CSS Built) */}
   <section className="full-screen-section" id="system" style={{backgroundColor: "#f1f5f9", padding: '100px 24px'}}>
    <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
     <div className="section-heading fade-up" style={{marginBottom: '60px'}}>
      <h2 style={{fontSize: '2.5rem', fontWeight: '800', color: '#0f172a'}}>시스템 구성도</h2>
      <p style={{marginTop: '20px', fontSize: '1.15rem', color: '#64748b'}}>엣지 디바이스부터 클라우드 백엔드, 사용자 프론트엔드까지의 데이터 흐름</p>
     </div>
     
     <div className="fade-up d1" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '40px 0'}}>
      
      {/* Edge / IoT */}
      <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '32px', width: '320px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)'}}>
       <div style={{fontSize: '2.5rem', color: '#3b82f6', marginBottom: '16px'}}><i className="fas fa-car"></i></div>
       <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', marginBottom: '16px'}}>Edge AI (Jetson Nano)</h3>
       <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
        <div style={{background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', color: '#475569'}}><i className="fas fa-wifi text-blue" style={{marginRight:'8px'}}></i>mmWave 레이더</div>
        <div style={{background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', color: '#475569'}}><i className="fas fa-camera text-blue" style={{marginRight:'8px'}}></i>비전 카메라 (YOLO11n)</div>
        <div style={{background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', color: '#475569'}}><i className="fas fa-map-marker-alt text-blue" style={{marginRight:'8px'}}></i>GPS 수신기</div>
       </div>
      </div>

      {/* Arrow */}
      <div style={{fontSize: '2rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px'}}>
       <i className="fas fa-arrow-right hide-mobile"></i>
       <i className="fas fa-arrow-down hide-desktop"></i>
      </div>

      {/* Backend */}
      <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '32px', width: '320px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)'}}>
       <div style={{fontSize: '2.5rem', color: '#10b981', marginBottom: '16px'}}><i className="fas fa-server"></i></div>
       <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', marginBottom: '16px'}}>Cloud Backend</h3>
       <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
        <div style={{background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', color: '#475569'}}><i className="fas fa-database text-green" style={{marginRight:'8px'}}></i>Supabase DB</div>
        <div style={{background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', color: '#475569'}}><i className="fas fa-globe text-green" style={{marginRight:'8px'}}></i>PostGIS 공간 데이터</div>
        <div style={{background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', color: '#475569'}}><i className="fas fa-cogs text-green" style={{marginRight:'8px'}}></i>중복 병합 및 자동 신고 로직</div>
       </div>
      </div>

      {/* Arrow */}
      <div style={{fontSize: '2rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px'}}>
       <i className="fas fa-arrow-right hide-mobile"></i>
       <i className="fas fa-arrow-down hide-desktop"></i>
      </div>

      {/* Client */}
      <div style={{background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '32px', width: '320px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)'}}>
       <div style={{fontSize: '2.5rem', color: '#8b5cf6', marginBottom: '16px'}}><i className="fas fa-users"></i></div>
       <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#1e293b', marginBottom: '16px'}}>Frontend Clients</h3>
       <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
        <div style={{background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', color: '#475569'}}><i className="fas fa-desktop text-purple" style={{marginRight:'8px'}}></i>관리자 웹 (React JS)</div>
        <div style={{background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', color: '#475569'}}><i className="fas fa-mobile-alt text-purple" style={{marginRight:'8px'}}></i>사용자 앱 (React Native)</div>
        <div style={{background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', fontWeight: '600', color: '#475569'}}><i className="fas fa-bell text-purple" style={{marginRight:'8px'}}></i>실시간 위험 접근 알림</div>
       </div>
      </div>

     </div>
    </div>
   </section>
   
   {/* Team Intro */}
   {/* Team Intro */}
   <section className="qa-section full-screen-section" id="team" style={{backgroundColor: "#ffffff", overflow: 'hidden'}}>
    <div className="section-inner">
     <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '40px'}}>
      <h2>개발자 소개</h2>
      <p>SMART ROAD SAVER를 기획하고 개발한 MARS 팀원들을 소개합니다</p>
     </div>
     
     <div style={{maxWidth: '1000px', margin: '0 auto', background: '#1e1e1e', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.2)'}} className="fade-up d1">
      {/* Terminal Header */}
      <div style={{background: '#2d2d2d', padding: '16px 24px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #444'}}>
       <div style={{display: 'flex', gap: '8px'}}>
        <div style={{width: '14px', height: '14px', borderRadius: '50%', background: '#ff5f56'}}></div>
        <div style={{width: '14px', height: '14px', borderRadius: '50%', background: '#ffbd2e'}}></div>
        <div style={{width: '14px', height: '14px', borderRadius: '50%', background: '#27c93f'}}></div>
       </div>
       <div style={{marginLeft: '20px', color: '#999', fontSize: '0.95rem', fontFamily: 'monospace'}}>mars_team.json - SmartRoadSaver</div>
      </div>
      
      {/* Terminal Body */}
      <div style={{padding: '30px 40px', color: '#d4d4d4', fontFamily: '"Consolas", "Courier New", monospace', fontSize: '1.15rem', lineHeight: '1.9', overflowX: 'auto'}}>
       <div style={{color: '#ce9178'}}>"team_mars" <span style={{color: '#d4d4d4'}}>:</span> <span style={{color: '#ffd700'}}>{"{"}</span></div>
       
       <div style={{paddingLeft: '32px'}}>
        <div style={{color: '#9cdcfe'}}>"web_app_team" <span style={{color: '#d4d4d4'}}>:</span> <span style={{color: '#da70d6'}}>[</span> <span style={{color: '#ce9178'}}>"오태관"</span>, <span style={{color: '#ce9178'}}>"박서현"</span> <span style={{color: '#da70d6'}}>]</span>,</div>
        <div style={{color: '#9cdcfe'}}>"server_team" <span style={{color: '#d4d4d4'}}>:</span> <span style={{color: '#da70d6'}}>[</span> <span style={{color: '#ce9178'}}>"김찬희"</span>, <span style={{color: '#ce9178'}}>"정세희"</span> <span style={{color: '#da70d6'}}>]</span>,</div>
        <div style={{color: '#9cdcfe'}}>"ai_hardware_team" <span style={{color: '#d4d4d4'}}>:</span> <span style={{color: '#da70d6'}}>[</span> <span style={{color: '#ce9178'}}>"김수한"</span>, <span style={{color: '#ce9178'}}>"김시호"</span>, <span style={{color: '#ce9178'}}>"김민건"</span> <span style={{color: '#da70d6'}}>]</span></div>
       </div>
       
       <div style={{color: '#ffd700'}}>{"}"}</div>
       
       <div style={{marginTop: '24px', display: 'flex', alignItems: 'center'}}>
        <span style={{color: '#4fc1ff', marginRight: '10px', fontWeight: 'bold'}}>➜</span>
        <span style={{color: '#c586c0', marginRight: '12px'}}>~</span>
        <div className="blinking" style={{width: '10px', height: '22px', background: '#d4d4d4'}}></div>
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
