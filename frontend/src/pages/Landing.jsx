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
    <section className="full-screen-section" id="purpose" style={{backgroundColor: '#ffffff', padding: '120px 24px'}}>
     <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto'}}>
      <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '80px'}}>
       <h2 style={{fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.05em', color: '#0f172a'}}>개발 목적</h2>
       <p style={{marginTop: '20px', fontSize: '1.15rem', color: '#64748b', wordBreak: 'keep-all', maxWidth: '800px', margin: '20px auto 0'}}>안전한 도로 환경 조성을 위한 스마트 예방 시스템 도입</p>
      </div>

      <div style={{display: 'flex', flexWrap: 'wrap', gap: '80px', alignItems: 'center'}} className="fade-up d1">
       {/* Illustration */}
       <div style={{flex: '1 1 380px', display: 'flex', justifyContent: 'center'}}>
        <img src="/purpose_illustration.jpg" alt="도로 위험요소 탐지 일러스트" style={{width: '100%', maxWidth: '460px', borderRadius: '20px'}} />
       </div>
       {/* Text */}
       <div style={{flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '48px'}}>
        <div>
         <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
          <span style={{width: '36px', height: '36px', borderRadius: '50%', background: '#fef2f2', color: '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'}}><i className="fas fa-times"></i></span>
          <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0}}>기존 방식의 한계</h3>
         </div>
         <p style={{fontSize: '1.05rem', color: '#475569', lineHeight: '1.75', wordBreak: 'keep-all', margin: 0, paddingLeft: '48px'}}>매년 2만 건 이상의 교통사고가 포트홀 등 도로 노면 결함으로 발생합니다. 기존 순찰 방식은 비용과 시간이 막대하게 소요되며 사전 예방에 한계가 있었습니다.</p>
        </div>
        <div style={{height: '1px', background: '#e2e8f0'}}></div>
        <div>
         <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
          <span style={{width: '36px', height: '36px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'}}><i className="fas fa-check"></i></span>
          <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0}}>우리의 해결책</h3>
         </div>
         <p style={{fontSize: '1.05rem', color: '#475569', lineHeight: '1.75', wordBreak: 'keep-all', margin: 0, paddingLeft: '48px'}}>비전 AI와 mmWave 레이더를 결합하여 주행 중 위험 요소를 실시간 탐지하고, 자동 신고 및 앱 알림을 통해 사고를 원천 차단합니다.</p>
        </div>
       </div>
      </div>
     </div>
    </section>

    {/* Features — numbered step layout */}
    <section className="full-screen-section" id="features" style={{backgroundColor: '#f8fafc', padding: '120px 24px'}}>
     <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto'}}>
      <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '80px'}}>
       <h2 style={{fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.05em', color: '#0f172a'}}>주요 내용 및 특징</h2>
       <p style={{marginTop: '20px', fontSize: '1.15rem', color: '#64748b', wordBreak: 'keep-all', maxWidth: '800px', margin: '20px auto 0'}}><span style={{whiteSpace: 'nowrap'}}>SMART ROAD SAVER</span>는 하드웨어부터 AI, 서버, 프론트엔드까지 모든 과정을 직접 구현한 시스템입니다.</p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '0'}} className="fade-up d1">
       {/* Step 1 */}
       <div style={{display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-start', padding: '48px 0', borderBottom: '1px solid #e2e8f0'}}>
        <div style={{minWidth: '80px'}}>
         <span style={{fontSize: '3.5rem', fontWeight: '900', color: '#e2e8f0', lineHeight: 1}}>01</span>
        </div>
        <div style={{flex: '1 1 300px'}}>
         <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
          <i className="fas fa-microchip" style={{fontSize: '1.4rem', color: '#4f46e5'}}></i>
          <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0}}>하드웨어 (mmWave 레이더 도입)</h3>
         </div>
         <p style={{fontSize: '1.05rem', color: '#475569', lineHeight: '1.75', wordBreak: 'keep-all', margin: 0}}>기존 비전 AI의 한계였던 젖은 노면 및 블랙아이스 탐지를 위해 mmWave 레이더를 도입하여 어떠한 환경에서도 완벽한 탐지를 지원합니다.</p>
        </div>
       </div>

       {/* Step 2 */}
       <div style={{display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-start', padding: '48px 0', borderBottom: '1px solid #e2e8f0'}}>
        <div style={{minWidth: '80px'}}>
         <span style={{fontSize: '3.5rem', fontWeight: '900', color: '#e2e8f0', lineHeight: 1}}>02</span>
        </div>
        <div style={{flex: '1 1 300px'}}>
         <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
          <i className="fas fa-brain" style={{fontSize: '1.4rem', color: '#2563eb'}}></i>
          <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0}}>AI 모델 및 데이터 학습</h3>
         </div>
         <p style={{fontSize: '1.05rem', color: '#475569', lineHeight: '1.75', wordBreak: 'keep-all', margin: 0}}>카메라와 레이더 센서를 Jetson Nano에 장착하고, 직접 수집한 도로 결함 데이터를 학습시킨 독자적인 객체 탐지 모델을 가동합니다.</p>
        </div>
       </div>

       {/* Step 3 */}
       <div style={{display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-start', padding: '48px 0'}}>
        <div style={{minWidth: '80px'}}>
         <span style={{fontSize: '3.5rem', fontWeight: '900', color: '#e2e8f0', lineHeight: 1}}>03</span>
        </div>
        <div style={{flex: '1 1 300px'}}>
         <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
          <i className="fas fa-code" style={{fontSize: '1.4rem', color: '#9333ea'}}></i>
          <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0}}>백엔드 및 풀스택 구축</h3>
         </div>
         <p style={{fontSize: '1.05rem', color: '#475569', lineHeight: '1.75', wordBreak: 'keep-all', margin: 0}}>실시간 데이터 통신, 중복 결함 병합 및 자동 신고 로직은 물론, 운전자용 모바일 앱과 관리자용 웹 대시보드를 100% 자체 개발하였습니다.</p>
        </div>
       </div>
      </div>
     </div>
    </section>

    {/* Application — zigzag keyword blocks */}
    <section className="full-screen-section" id="application" style={{backgroundColor: '#f8fafc', padding: '120px 24px'}}>
     <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto'}}>
      <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '80px'}}>
       <h2 style={{fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.05em', color: '#0f172a'}}>활용 분야</h2>
       <p style={{marginTop: '20px', fontSize: '1.15rem', color: '#64748b', wordBreak: 'keep-all', maxWidth: '800px', margin: '20px auto 0'}}>본 시스템은 차량의 블랙박스 및 전용 기기로 탑재되어 주행 중 도로 위의 위험 요소를 실시간으로 탐지합니다.</p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '960px', margin: '0 auto'}} className="fade-up d1">

       {/* Block 1 — left accent */}
       <div style={{display: 'flex', flexWrap: 'wrap', borderRadius: '20px', overflow: 'hidden', minHeight: '200px'}}>
        <div style={{flex: '0 0 160px', background: 'linear-gradient(135deg, #059669, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px'}}>
         <span style={{fontSize: '2.8rem', fontWeight: '900', color: '#fff', lineHeight: 1, textAlign: 'center'}}>관제</span>
        </div>
        <div style={{flex: '1 1 300px', background: '#fff', padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
         <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px'}}>전국 단위 관제</h3>
         <p style={{fontSize: '1.05rem', color: '#64748b', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all'}}>버스, 택시 등 공공 및 일반 차량에 장착되어 전국 도로망을 24시간 실시간으로 모니터링하고, 탐지된 위험 요소를 지자체에 자동으로 신고합니다.</p>
        </div>
       </div>

       {/* Block 2 — right accent */}
       <div style={{display: 'flex', flexWrap: 'wrap', borderRadius: '20px', overflow: 'hidden', minHeight: '200px', flexDirection: 'row-reverse'}}>
        <div style={{flex: '0 0 160px', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px'}}>
         <span style={{fontSize: '2.8rem', fontWeight: '900', color: '#fff', lineHeight: 1, textAlign: 'center'}}>알림</span>
        </div>
        <div style={{flex: '1 1 300px', background: '#fff', padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
         <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px'}}>운전자 모바일 연동</h3>
         <p style={{fontSize: '1.05rem', color: '#64748b', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all'}}>위험 구간에 접근하면 모바일 앱을 통해 실시간 푸시 알림을 제공하여 감속과 우회를 유도하고, 안전 운전을 돕습니다.</p>
        </div>
       </div>

       {/* Block 3 — left accent */}
       <div style={{display: 'flex', flexWrap: 'wrap', borderRadius: '20px', overflow: 'hidden', minHeight: '200px'}}>
        <div style={{flex: '0 0 160px', background: 'linear-gradient(135deg, #d97706, #fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px'}}>
         <span style={{fontSize: '2.8rem', fontWeight: '900', color: '#fff', lineHeight: 1, textAlign: 'center'}}>관리</span>
        </div>
        <div style={{flex: '1 1 300px', background: '#fff', padding: '40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
         <h3 style={{fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px'}}>웹 대시보드</h3>
         <p style={{fontSize: '1.05rem', color: '#64748b', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all'}}>수집된 위험 데이터를 지도 상에서 한눈에 파악하고, 지자체와 연계하여 즉각적인 유지보수를 지원합니다.</p>
        </div>
       </div>

      </div>
     </div>
    </section>

    {/* Effects — bento grid with stat keywords */}
    <section className="full-screen-section" id="effects" style={{backgroundColor: '#111827', padding: '120px 24px'}}>
     <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto'}}>
      <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '80px'}}>
       <h2 style={{fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.05em', color: '#fff'}}>기대 효과</h2>
       <p style={{marginTop: '20px', fontSize: '1.15rem', color: '#94a3b8', wordBreak: 'keep-all', maxWidth: '800px', margin: '20px auto 0'}}>SMART ROAD SAVER가 만들어갈 긍정적인 변화와 사회적 가치</p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '900px', margin: '0 auto'}} className="fade-up d1">
       {/* Large top-left */}
       <div style={{gridRow: 'span 2', background: '#1e293b', borderRadius: '20px', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
        <span style={{fontSize: '4rem', fontWeight: '900', color: '#3b82f6', lineHeight: 1, marginBottom: '20px'}}>24H</span>
        <h3 style={{fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '12px'}}>사고 원천 예방</h3>
        <p style={{fontSize: '1.05rem', color: '#94a3b8', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all'}}>24시간 실시간 탐지와 즉각적인 자동 신고로 도로 위 인명 피해와 사고를 원천적으로 예방합니다.</p>
       </div>
       {/* Top-right */}
       <div style={{background: '#1e293b', borderRadius: '20px', padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
        <span style={{fontSize: '3rem', fontWeight: '900', color: '#10b981', lineHeight: 1, marginBottom: '16px'}}>SAFE</span>
        <h3 style={{fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '10px'}}>2차 피해 차단</h3>
        <p style={{fontSize: '1rem', color: '#94a3b8', lineHeight: '1.6', margin: 0, wordBreak: 'keep-all'}}>접근 경고 알림으로 감속과 우회를 유도하여 2차 사고를 방지합니다.</p>
       </div>
       {/* Bottom-right */}
       <div style={{background: '#1e293b', borderRadius: '20px', padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
        <span style={{fontSize: '3rem', fontWeight: '900', color: '#f59e0b', lineHeight: 1, marginBottom: '16px'}}>100%</span>
        <h3 style={{fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '10px'}}>비용 획기적 절감</h3>
        <p style={{fontSize: '1rem', color: '#94a3b8', lineHeight: '1.6', margin: 0, wordBreak: 'keep-all'}}>수작업 순찰을 완전 자동화하여 막대한 예산과 시간을 절감합니다.</p>
       </div>
      </div>
     </div>
    </section>


   {/* System Architecture (Image from Poster) */}
   {/* System Architecture (CSS Built) */}
   <section className="full-screen-section" id="system" style={{backgroundColor: "#f1f5f9", padding: '100px 24px'}}>
    <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
     <div className="section-heading fade-up" style={{textAlign: "center", marginBottom: "80px"}}><h2 style={{fontSize: "2.5rem", fontWeight: "800", letterSpacing: "-0.05em", color: "#0f172a"}}>시스템 구성도</h2><p style={{marginTop: "20px", fontSize: "1.15rem", color: "#64748b", wordBreak: "keep-all", maxWidth: "800px", margin: "20px auto 0"}}>엣지 디바이스부터 클라우드 백엔드, 사용자 프론트엔드까지의 데이터 흐름</p></div>
     
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
   
   
    {/* UI/UX Terms Section - CSS Sticky Scrolljacking */}
    <section className="full-screen-section" id="scroll-terms" style={{backgroundColor: '#000000', padding: '0', position: 'relative'}}>
     <div style={{display: 'flex', flexDirection: 'column'}}>
      {/* Spacer for sticky effect */}
      <div style={{display: 'flex', flexWrap: 'wrap', maxWidth: '1400px', margin: '0 auto', width: '100%', alignItems: 'flex-start'}}>
       
       {/* Left Pinned Side */}
       <div style={{flex: '1 1 400px', position: 'sticky', top: '20vh', padding: '120px 40px', height: 'fit-content'}}>
        <h2 style={{fontSize: '3rem', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.05em', marginBottom: '20px', lineHeight: 1.2}}>
         최신 웹 트렌드<br/>스크롤 인터랙션
        </h2>
        <p style={{fontSize: '1.15rem', color: '#9ca3af', wordBreak: 'keep-all', lineHeight: 1.7}}>
         사용자 경험(UX)을 극대화하기 위해 웹 디자인 실무에서 활용되는 대표적인 5가지 스크롤 애니메이션 기법입니다. (현재 보시는 이 화면 또한 CSS Sticky를 활용한 스크롤 하이재킹 기법의 일종입니다.)
        </p>
       </div>

       {/* Right Scrolling Side */}
       <div style={{flex: '1 1 600px', padding: '120px 40px', display: 'flex', flexDirection: 'column', gap: '80px'}}>
        
        <div className="fade-up d1">
         <div style={{fontSize: '1.2rem', fontWeight: '800', color: '#60a5fa', marginBottom: '12px'}}>01</div>
         <h3 style={{fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', marginBottom: '16px'}}>스크롤 인터랙션 <span style={{fontSize:'1.2rem', color:'#6b7280', fontWeight:500}}>(Scroll Interaction)</span></h3>
         <p style={{fontSize: '1.1rem', color: '#d1d5db', lineHeight: '1.7', wordBreak: 'keep-all', margin: 0}}>
          사용자의 스크롤 동작에 반응하여 웹페이지의 요소들이 움직이거나 변하는 효과를 통칭하는 가장 대중적인 실무 용어입니다.
         </p>
        </div>

        <div className="fade-up d1">
         <div style={{fontSize: '1.2rem', fontWeight: '800', color: '#a78bfa', marginBottom: '12px'}}>02</div>
         <h3 style={{fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', marginBottom: '16px'}}>스크롤리텔링 <span style={{fontSize:'1.2rem', color:'#6b7280', fontWeight:500}}>(Scrollytelling)</span></h3>
         <p style={{fontSize: '1.1rem', color: '#d1d5db', lineHeight: '1.7', wordBreak: 'keep-all', margin: 0}}>
          '스크롤(Scroll)'과 '스토리텔링(Storytelling)'의 합성어로, 스크롤을 내리며 제품의 특징을 한 편의 이야기처럼 순차적으로 보여주는 기획 방식을 뜻합니다.
         </p>
        </div>

        <div className="fade-up d1">
         <div style={{fontSize: '1.2rem', fontWeight: '800', color: '#34d399', marginBottom: '12px'}}>03</div>
         <h3 style={{fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', marginBottom: '16px'}}>패럴랙스 스크롤링 <span style={{fontSize:'1.2rem', color:'#6b7280', fontWeight:500}}>(Parallax Scrolling)</span></h3>
         <p style={{fontSize: '1.1rem', color: '#d1d5db', lineHeight: '1.7', wordBreak: 'keep-all', margin: 0}}>
          화면의 배경과 전경(텍스트나 제품 이미지)의 이동 속도를 다르게 설정하여 화면에 시각적인 입체감과 깊이감을 주는 기법입니다.
         </p>
        </div>

        <div className="fade-up d1">
         <div style={{fontSize: '1.2rem', fontWeight: '800', color: '#f87171', marginBottom: '12px'}}>04</div>
         <h3 style={{fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', marginBottom: '16px'}}>스크롤 하이재킹 <span style={{fontSize:'1.2rem', color:'#6b7280', fontWeight:500}}>(Scrolljacking)</span></h3>
         <p style={{fontSize: '1.1rem', color: '#d1d5db', lineHeight: '1.7', wordBreak: 'keep-all', margin: 0}}>
          스크롤 시 화면이 아래로 내려가는 대신 특정 섹션을 화면에 고정(Pinning)한 상태에서 3D 모델 회전 등의 애니메이션만 재생되도록 웹사이트가 스크롤 제어권을 가로채는 기법입니다.
         </p>
        </div>

        <div className="fade-up d1" style={{paddingBottom: '120px'}}>
         <div style={{fontSize: '1.2rem', fontWeight: '800', color: '#fbbf24', marginBottom: '12px'}}>05</div>
         <h3 style={{fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', marginBottom: '16px'}}>이미지 시퀀스 애니메이션 <span style={{fontSize:'1.2rem', color:'#6b7280', fontWeight:500}}>(Image Sequence Animation)</span></h3>
         <p style={{fontSize: '1.1rem', color: '#d1d5db', lineHeight: '1.7', wordBreak: 'keep-all', margin: 0}}>
          수십에서 수백 장의 렌더링 이미지를 스크롤 위치(진행도)에 맞춰 빠르게 교체하여, 마치 사용자가 스크롤로 동영상을 앞뒤로 재생하는 것처럼 보이게 만드는 기술입니다.
         </p>
        </div>

       </div>
      </div>
     </div>
    </section>

    {/* Team Intro */}
   {/* Team Intro */}
   <section className="qa-section full-screen-section" id="team" style={{backgroundColor: "#ffffff", overflow: 'hidden', padding: '100px 0'}}>
    <div className="section-inner" style={{maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '0 24px'}}>
     <div className="section-heading fade-up" style={{textAlign: "center", marginBottom: "80px"}}><h2 style={{fontSize: "2.5rem", fontWeight: "800", letterSpacing: "-0.05em", color: "#0f172a"}}>개발자 소개</h2><p style={{marginTop: "20px", fontSize: "1.15rem", color: "#64748b", wordBreak: "keep-all", maxWidth: "800px", margin: "20px auto 0"}}>SMART ROAD SAVER를 기획하고 개발한 MARS 팀원들을 소개합니다</p></div>
     
     <div style={{maxWidth: '1000px', width: '100%', margin: '0 auto', background: '#1e1e1e', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.2)'}} className="fade-up d1">
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
