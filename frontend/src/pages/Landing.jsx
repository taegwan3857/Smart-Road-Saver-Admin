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
   <section className="full-screen-section" id="purpose" style={{backgroundColor: "#ffffff", padding: '120px 24px', overflow: 'hidden'}}>
    <div style={{maxWidth: '1000px', margin: '0 auto'}} className="fade-up d1">
        {/* Heading */}
        <div style={{marginBottom: '80px'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.05em', color: '#0f172a'}}>개발 목적</h2>
        </div>
        {/* Content */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '60px'}}>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start'}}>
                <div style={{flex: '1 1 250px'}}>
                    <h3 style={{fontSize: '1.6rem', fontWeight: '800', color: '#e11d48', margin: 0}}>기존 방식의 한계</h3>
                </div>
                <div style={{flex: '2 1 400px'}}>
                    <p style={{fontSize: '1.25rem', color: '#475569', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all'}}>
                        기존 도로 순찰 및 사후 신고 방식은 <b style={{color:'#0f172a'}}>막대한 시간과 비용</b>이 소요되며, 순찰원의 2차 사고 위험과 사전 예방의 한계가 존재했습니다.
                    </p>
                </div>
            </div>
            <div style={{width: '100%', height: '1px', background: '#e2e8f0'}}></div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start'}}>
                <div style={{flex: '1 1 250px'}}>
                    <h3 style={{fontSize: '1.6rem', fontWeight: '800', color: '#2563eb', margin: 0}}>우리의 해결책</h3>
                </div>
                <div style={{flex: '2 1 400px'}}>
                    <p style={{fontSize: '1.25rem', color: '#475569', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all'}}>
                        비전 AI와 mmWave 레이더를 결합하여 주행 중 위험 요소를 <b style={{color:'#0f172a'}}>실시간 탐지</b>하고, 자동 신고 및 앱 알림을 통해 사고를 원천 차단합니다.
                    </p>
                </div>
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
      <h2 style={{fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.05em', color: '#0f172a'}}>주요 내용 및 특징</h2>
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
   <section className="full-screen-section" id="application" style={{backgroundColor: "#f8fafc", padding: '120px 24px'}}>
    <div style={{maxWidth: '1000px', margin: '0 auto'}} className="fade-up d1">
        <h2 style={{fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.05em', color: '#0f172a', marginBottom: '80px'}}>활용 분야</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '60px'}}>
            
            <div style={{display: 'flex', gap: '30px', alignItems: 'flex-start'}}>
                <div style={{fontSize: '2.5rem', color: '#10b981', minWidth: '40px'}}><i className="fas fa-bus"></i></div>
                <div style={{flex: 1}}>
                    <h3 style={{fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px'}}>전국 단위 관제</h3>
                    <p style={{fontSize: '1.15rem', color: '#475569', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all'}}>버스, 택시 등 공공 및 일반 차량에 장착되어 <b style={{color:'#0f172a'}}>전국 도로망을 24시간 모니터링</b>합니다.</p>
                </div>
            </div>
            
            <div style={{display: 'flex', gap: '30px', alignItems: 'flex-start'}}>
                <div style={{fontSize: '2.5rem', color: '#8b5cf6', minWidth: '40px'}}><i className="fas fa-mobile-alt"></i></div>
                <div style={{flex: 1}}>
                    <h3 style={{fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px'}}>운전자 모바일 연동</h3>
                    <p style={{fontSize: '1.15rem', color: '#475569', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all'}}>위험 구간 접근 시 모바일 앱을 통해 <b style={{color:'#0f172a'}}>실시간 푸시 알림</b>을 제공하여 안전 운전을 유도합니다.</p>
                </div>
            </div>

            <div style={{display: 'flex', gap: '30px', alignItems: 'flex-start'}}>
                <div style={{fontSize: '2.5rem', color: '#f59e0b', minWidth: '40px'}}><i className="fas fa-desktop"></i></div>
                <div style={{flex: 1}}>
                    <h3 style={{fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '12px'}}>웹 대시보드</h3>
                    <p style={{fontSize: '1.15rem', color: '#475569', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all'}}>수집된 위험 데이터를 한눈에 파악하고, 지자체와 연계하여 <b style={{color:'#0f172a'}}>즉각적인 유지보수</b>를 지원합니다.</p>
                </div>
            </div>

        </div>
    </div>
</section>

   {/* Expected Effects */}
   <section className="full-screen-section" id="effects" style={{backgroundColor: '#0a0a0a', padding: '120px 24px'}}>
    <div style={{maxWidth: '1000px', margin: '0 auto'}} className="fade-up d1">
        <h2 style={{fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.05em', color: '#fff', marginBottom: '80px'}}>기대 효과</h2>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '50px'}}>
            
            <div style={{borderLeft: '3px solid #3b82f6', paddingLeft: '24px'}}>
                <h3 style={{fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '16px'}}>사고 원천 예방</h3>
                <p style={{fontSize: '1.1rem', color: '#a3a3a3', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all'}}>실시간 탐지와 즉각적인 자동 신고로 도로 위 인명 피해와 사고를 <b style={{color:'#fff'}}>원천적으로 예방</b>합니다.</p>
            </div>

            <div style={{borderLeft: '3px solid #10b981', paddingLeft: '24px'}}>
                <h3 style={{fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '16px'}}>2차 피해 차단</h3>
                <p style={{fontSize: '1.1rem', color: '#a3a3a3', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all'}}>접근 경고 알림으로 자발적인 감속과 우회를 유도하여 결빙이나 포트홀로 인한 <b style={{color:'#fff'}}>2차 사고를 방지</b>합니다.</p>
            </div>

            <div style={{borderLeft: '3px solid #f59e0b', paddingLeft: '24px'}}>
                <h3 style={{fontSize: '1.5rem', fontWeight: '800', color: '#fff', marginBottom: '16px'}}>비용 획기적 절감</h3>
                <p style={{fontSize: '1.1rem', color: '#a3a3a3', lineHeight: '1.7', margin: 0, wordBreak: 'keep-all'}}>수작업 순찰과 사후 신고에 의존하던 방식을 100% 자동화하여 <b style={{color:'#fff'}}>막대한 예산과 시간</b>을 절감합니다.</p>
            </div>

        </div>
    </div>
</section>

   {/* System Architecture (Image from Poster) */}
   {/* System Architecture (CSS Built) */}
   <section className="full-screen-section" id="system" style={{backgroundColor: "#f1f5f9", padding: '100px 24px'}}>
    <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto', textAlign: 'center'}}>
     <div className="section-heading fade-up" style={{marginBottom: '60px'}}>
      <h2 style={{fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.05em', color: '#0f172a'}}>시스템 구성도</h2>
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
   <section className="qa-section full-screen-section" id="team" style={{backgroundColor: "#ffffff", overflow: 'hidden', padding: '100px 0'}}>
    <div className="section-inner" style={{maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '0 24px'}}>
     <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '40px'}}>
      <h2 style={{fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.05em', color: '#0f172a'}}>개발자 소개</h2>
      <p style={{marginTop: '20px', fontSize: '1.15rem', color: '#64748b'}}>SMART ROAD SAVER를 기획하고 개발한 MARS 팀원들을 소개합니다</p>
     </div>
     
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
