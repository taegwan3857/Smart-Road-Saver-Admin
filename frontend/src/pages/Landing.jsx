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

 const faqs = [
  { q: "어떤 종류의 도로 위험물을 감지할 수 있나요?", a: "포트홀, 낙하물(장애물), 젖은 노면, 블랙아이스(결빙) 등을 실시간으로 감지합니다. 특히 mmWave 레이더를 통해 육안으로 식별이 어려운 결빙 상태를 정확하게 판별합니다." },
  { q: "기존 차량의 블랙박스와 연동되는 방식인가요?", a: "아닙니다. Smart Road Saver는 카메라, mmWave 레이더, Jetson NANO 보드가 결합된 전용 하드웨어 장비입니다. 차량에 장착하여 독립적으로 데이터를 수집하고 실시간 AI 추론을 수행합니다." },
  { q: "지자체 신고는 어떻게 이루어지나요?", a: "AI가 결함을 탐지하면, 서버에서 중복 여부(PostGIS 활용)를 확인한 후 결함을 등록합니다. 등록된 결함 데이터를 기반으로 공문서 형태의 신고서가 시스템에서 자동 생성되어 유관 기관으로 원클릭 접수됩니다." },
 ];

 return (
  <div className="landing-container">
   {/* Nav */}
   <header className="landing-header">
    <a href="#home" onClick={scrollToSection} className="landing-logo" style={{ textDecoration: 'none' }}>
     <i className="fas fa-shield-alt"></i> Smart Road Saver
    </a>
    <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
     <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
    </button>
    <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
     <a href="#home" onClick={scrollToSection}>홈</a>
     <a href="#background" onClick={scrollToSection}>프로젝트 배경</a>
     <a href="#service-features" onClick={scrollToSection}>주요 기능</a>
     <a href="#system" onClick={scrollToSection}>시스템 구성도</a>
     <a href="#faq" onClick={scrollToSection}>Q&A</a>
     <a href="#team" onClick={scrollToSection}>개발자 소개</a>
    </nav>
   </header>

   {/* Hero */}
   <section className="hero-section" id="home">
    <div className="hero-content">
     <div className="hero-text-col fade-up">
      <div className="hero-badge">AI 기반 도로 안전 솔루션</div>
      <h1 className="hero-title">
       미래를 향한 안전한 길,<br />
       <span className="text-gradient">Smart Road Saver</span>
      </h1>
      <p className="hero-subtitle" style={{ wordBreak: 'keep-all' }}>
       mmWave 레이더와 비전 AI를 결합하여 실시간 도로 결함 탐지 및 <br className="hide-mobile" />
       지자체 자동 신고를 수행합니다. 단 한 번의 스캔으로 <br className="hide-mobile" />
       보이지 않는 블랙아이스까지 완벽하게 차단하세요.
      </p>
      <div className="hero-btns">
       <Link to="/login" className="btn-primary">
        관리자 관제 센터 <i className="fas fa-arrow-right" style={{marginLeft: '8px'}}></i>
       </Link>
       <a href="#background" onClick={scrollToSection} className="btn-secondary">
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
       
       {/* Floating UI Elements */}
       <div className="floating-ui ui-top-right">
        <i className="fas fa-circle text-green blinking"></i> 시스템 정상 작동
       </div>
       <div className="floating-ui ui-bottom-left">
        <strong><i className="fas fa-bolt text-blue"></i> YOLO11n</strong>
        <span>객체 탐지 활성화</span>
       </div>
       <div className="floating-ui ui-bottom-right">
        <strong><i className="fas fa-wifi text-blue"></i> mmWave</strong>
        <span>노면 상태 분석 중...</span>
       </div>

       <div className="radar-dot dot-1"><div className="dot-ripple"></div></div>
       <div className="radar-dot dot-2"><div className="dot-ripple"></div></div>
      </div>
     </div>
    </div>
    <div className="scroll-indicator">
     <span>Scroll Down</span>
     <i className="fas fa-chevron-down bouncing"></i>
    </div>
   </section>

   {/* Background */}
   <section className="background-section full-screen-section" id="background" style={{backgroundColor: '#ffffff'}}>
    <div className="section-inner">
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
    </div>
   </section>

   {/* Service Features & Expected Effects */}
   <section className="service-features-section full-screen-section" id="service-features" style={{backgroundColor: '#f8fafc', padding: '100px 24px'}}>
    <div className="section-inner" style={{maxWidth: '1200px', margin: '0 auto'}}>
      
      <div className="section-heading fade-up" style={{textAlign: 'center', marginBottom: '60px'}}>
       <h2 style={{fontSize: '2.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px'}}>주요 기능 및 기대효과</h2>
       <p style={{fontSize: '1.2rem', color: '#64748b'}}>스마트 로드 세이버가 제안하는 안전한 도로의 미래</p>
      </div>
      
      {/* 주요 기능 (3 Columns) */}
      <div className="features-grid fade-up d1" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px'}}>
        <div className="feature-card-new">
          <div className="fc-icon"><i className="fas fa-broadcast-tower"></i></div>
          <div className="fc-content">
            <div className="fc-tag">하드웨어 & AI</div>
            <h3>다중 센서 융합 탐지</h3>
            <p>비전 AI 카메라와 mmWave 레이더를 결합하여 식별이 어려운 결빙(블랙아이스) 및 젖음 상태까지 수치화하여 실시간으로 완벽하게 탐지합니다.</p>
          </div>
        </div>
        <div className="feature-card-new">
          <div className="fc-icon"><i className="fas fa-database"></i></div>
          <div className="fc-content">
            <div className="fc-tag">백엔드 & 데이터</div>
            <h3>자동 병합 및 원클릭 신고</h3>
            <p>수집된 방대한 데이터를 PostGIS로 분석해 중복 신고를 방지하고, 지자체 표준 규격 공문서를 자동 생성하여 담당자에게 즉시 발송합니다.</p>
          </div>
        </div>
        <div className="feature-card-new">
          <div className="fc-icon"><i className="fas fa-mobile-alt"></i></div>
          <div className="fc-content">
            <div className="fc-tag">모바일 & 관리자 웹</div>
            <h3>실시간 알림 및 통합 관제</h3>
            <p>관리자는 웹 대시보드로 도로 전체 위험 상황을 통합 관제하고, 현장 근무자나 운전자는 모바일 앱을 통해 접근 전 실시간 위험 알림을 받습니다.</p>
          </div>
        </div>
      </div>

      {/* 기대효과 (Dark Banner Bento Box) */}
      <div className="effects-bento fade-up d2" style={{background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', padding: '50px', color: '#fff', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)'}}>
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
          <h3 style={{fontSize: '1.8rem', fontWeight: '800', margin: '0 0 12px 0', color: '#38bdf8'}}>기대효과</h3>
          <p style={{color: '#94a3b8', fontSize: '1.1rem', margin: 0}}>시스템 도입을 통해 달성하는 최종 목표</p>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px'}}>
          <div className="effect-item">
            <div className="ei-icon" style={{fontSize: '2.2rem', color: '#38bdf8', marginBottom: '20px'}}><i className="fas fa-shield-alt"></i></div>
            <h4 style={{fontSize: '1.35rem', fontWeight: '700', marginBottom: '12px', color: '#fff'}}>사고 발생 전 위험 요인 차단</h4>
            <p style={{color: '#cbd5e1', lineHeight: '1.6', fontSize: '1.05rem', margin: 0, wordBreak: 'keep-all'}}>
              사후 대처에만 의존하던 기존 방식의 한계를 넘어, 선제적인 위험 탐지와 실시간 알림을 통해 운전자와 작업자의 안전사고를 근본적으로 예방합니다.
            </p>
          </div>
          <div className="effect-item">
            <div className="ei-icon" style={{fontSize: '2.2rem', color: '#38bdf8', marginBottom: '20px'}}><i className="fas fa-cogs"></i></div>
            <h4 style={{fontSize: '1.35rem', fontWeight: '700', marginBottom: '12px', color: '#fff'}}>도로 순찰 자동화 및 행정 효율</h4>
            <p style={{color: '#cbd5e1', lineHeight: '1.6', fontSize: '1.05rem', margin: 0, wordBreak: 'keep-all'}}>
              비효율적이고 2차 사고 위험이 높은 인력 중심의 현장 순찰을 무인 시스템으로 완벽히 대체하고, 민원 신고 처리를 자동화하여 행정 효율을 극대화합니다.
            </p>
          </div>
        </div>

        <div style={{marginTop: '40px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center'}}>
          <div style={{display: 'inline-flex', alignItems: 'center', background: 'rgba(56, 189, 248, 0.1)', padding: '16px 32px', borderRadius: '100px', border: '1px solid rgba(56, 189, 248, 0.2)'}}>
            <i className="fas fa-check-circle" style={{color: '#38bdf8', marginRight: '12px', fontSize: '1.4rem'}}></i>
            <span style={{fontWeight: '800', fontSize: '1.15rem', color: '#e0f2fe', wordBreak: 'keep-all'}}>최종 목표 : 신속한 실제 도로 탐지를 통한 노면 결함 안전사고의 근본적 감소</span>
          </div>
        </div>
      </div>

    </div>
   </section>

   {/* System Structure (Timeline) */}
   <section className="pdf-features-section full-screen-section" id="system" style={{backgroundColor: '#ffffff'}}>
    <div className="section-inner">
    <div className="section-heading fade-up">
     <h2>시스템 구성도</h2>
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

   {/* Q&A */}
   <section className="qa-section full-screen-section" id="faq" style={{backgroundColor: '#f8fafc'}}>
    <div className="section-inner">
    <div className="section-heading fade-up">
     <h2>Q&A</h2>
    </div>
    <div className="qa-list">
     <div className="qa-item fade-up d1">
      <button className="qa-question" onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}>
       어떤 종류의 도로 위험물을 감지할 수 있나요?
       <i className={`fas fa-chevron-${openFaq === 0 ? 'up' : 'down'}`}></i>
      </button>
      <div className="qa-answer-wrap" style={{ maxHeight: openFaq === 0 ? '200px' : '0' }}>
       <div className="qa-answer">포트홀, 크랙(균열), 낙하물과 같은 물리적 장애물은 물론, mmWave 레이더를 통해 눈에 보이지 않는 블랙아이스, 젖은 노면 등의 상태까지 종합적으로 감지합니다.</div>
      </div>
     </div>
     <div className="qa-item fade-up d2">
      <button className="qa-question" onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}>
       카메라도 있는데 왜 굳이 mmWave 레이더를 함께 사용하나요?
       <i className={`fas fa-chevron-${openFaq === 1 ? 'up' : 'down'}`}></i>
      </button>
      <div className="qa-answer-wrap" style={{ maxHeight: openFaq === 1 ? '200px' : '0' }}>
       <div className="qa-answer">블랙아이스나 얇은 살얼음처럼 육안이나 일반 카메라 비전만으로는 구별하기 어려운 노면 상태를 정확히 탐지하기 위해서입니다. 레이더 반사 데이터와 비전 AI를 융합하여 주야간 및 악천후 환경에서도 99% 이상의 탐지 신뢰도를 제공합니다.</div>
      </div>
     </div>
     <div className="qa-item fade-up d3">
      <button className="qa-question" onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}>
       동일한 포트홀이 여러 번 신고되면 어떻게 처리되나요?
       <i className={`fas fa-chevron-${openFaq === 2 ? 'up' : 'down'}`}></i>
      </button>
      <div className="qa-answer-wrap" style={{ maxHeight: openFaq === 2 ? '200px' : '0' }}>
       <div className="qa-answer">시스템 백엔드에 구축된 PostGIS 공간 데이터베이스를 활용하여, 일정 반경 내에서 중복 수집된 동일 결함 데이터는 자동으로 하나의 건으로 병합(Deduplication) 처리됩니다. 이를 통해 관리자의 중복 업무를 최소화합니다.</div>
      </div>
     </div>
     <div className="qa-item fade-up d4">
      <button className="qa-question" onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}>
       지자체 신고는 어떻게 이루어지나요?
       <i className={`fas fa-chevron-${openFaq === 3 ? 'up' : 'down'}`}></i>
      </button>
      <div className="qa-answer-wrap" style={{ maxHeight: openFaq === 3 ? '200px' : '0' }}>
       <div className="qa-answer">관리자 웹 대시보드에서 감지된 내역을 확인한 후 신고 버튼을 누르면, 시스템이 지정된 양식에 맞춰 관할 지자체용 공문서를 자동 생성 및 발송하여 번거로운 수작업을 없앴습니다.</div>
      </div>
     </div>
     <div className="qa-item fade-up d5">
      <button className="qa-question" onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}>
       시스템 도입을 위해 필요한 인프라는 무엇인가요?
       <i className={`fas fa-chevron-${openFaq === 4 ? 'up' : 'down'}`}></i>
      </button>
      <div className="qa-answer-wrap" style={{ maxHeight: openFaq === 4 ? '200px' : '0' }}>
       <div className="qa-answer">전용 하드웨어(Jetson Nano 기반 AI 디바이스 및 센서 모듈)를 일반 사용자 차량에 부착하기만 하면 됩니다. 대규모 도로 인프라 공사 없이 즉시 운영이 가능한 플러그 앤 플레이(Plug & Play) 방식을 지원합니다.</div>
      </div>
     </div>
    </div>
    </div>
   </section>

   {/* Team Intro */}
   <section className="qa-section full-screen-section" id="team" style={{backgroundColor: '#ffffff'}}>
    <div className="section-inner">
    <div className="section-heading fade-up">
     <h2>개발자 소개</h2>
     <p>Smart Road Saver를 기획하고 개발한 팀원들을 소개합니다</p>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', maxWidth: '1000px', width: '100%', margin: '0 auto'}} className="fade-up d1">
     
     <div style={{background: '#fff', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.02)'}}>
      <div style={{width: '64px', height: '64px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 20px'}}>
       <i className="fas fa-mobile-alt"></i>
      </div>
      <h3 style={{fontSize: '1.25rem', color: '#0f172a', fontWeight: '700', marginBottom: '12px'}}>웹/앱 팀</h3>
      <p style={{fontSize: '1.05rem', color: '#64748b', fontWeight: '500'}}>오태관, 박서현</p>
     </div>

     <div style={{background: '#fff', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.02)'}}>
      <div style={{width: '64px', height: '64px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 20px'}}>
       <i className="fas fa-server"></i>
      </div>
      <h3 style={{fontSize: '1.25rem', color: '#0f172a', fontWeight: '700', marginBottom: '12px'}}>서버 팀</h3>
      <p style={{fontSize: '1.05rem', color: '#64748b', fontWeight: '500'}}>김찬희, 정세희</p>
     </div>

     <div style={{background: '#fff', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.02)'}}>
      <div style={{width: '64px', height: '64px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', margin: '0 auto 20px'}}>
       <i className="fas fa-microchip"></i>
      </div>
      <h3 style={{fontSize: '1.25rem', color: '#0f172a', fontWeight: '700', marginBottom: '12px'}}>하드웨어 및 AI 팀</h3>
            <p style={{fontSize: '1.05rem', color: '#64748b', fontWeight: '500'}}>김수한, 김시호, 김민건</p>
     </div>

    </div>
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
