import React, { useState } from 'react';

const InfoBox = ({ title, icon, children }) => (
  <div style={{ background: "var(--bg-body)", padding: '20px', borderRadius: '8px', marginTop: '16px', marginBottom: '24px' }}>
    <h4 style={{ margin: '0 0 12px 0', color: 'var(--primary-color)', fontSize: '1.05rem' }}>
      <i className={`fas ${icon}`} style={{marginRight:'8px'}}></i>{title}
    </h4>
    <div style={{ margin: 0, color: 'var(--text-main)', lineHeight: '1.6' }}>
      {children}
    </div>
  </div>
);

export default function Manual() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: '관제 대시보드', icon: 'fas fa-chart-line' },
    { id: 'detection', label: '감지 기록', icon: 'fas fa-list-ul' },
    { id: 'report', label: '신고 문서 관리', icon: 'fas fa-file-alt' }
  ];

  return (
    <div className="content-area">
      <div className="page-header-wrap">
        <div className="page-title">시스템 매뉴얼</div>
        <div className="page-subtitle">Smart Road Saver 관제 시스템의 메뉴별 주요 기능과 이용 방법을 상세히 안내합니다.</div>
      </div>
      
      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', backgroundColor: "var(--bg-body)" }}>
          {tabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '16px 24px',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? '600' : '400',
                color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? '3px solid var(--primary-color)' : '3px solid transparent',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </div>
          ))}
        </div>

        <div style={{ padding: '32px' }}>
          {/* 대시보드 탭 */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-main)' }}>관제 대시보드</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                대시보드에서는 전국 도로의 위험 요소 감지 현황을 <strong>지도 상에서 실시간으로 한눈에 파악</strong>할 수 있습니다.<br/>
                상단 요약 카드를 통해 현재 작동 중인 장치 수, 경고 및 금일 감지 건수 등을 직관적으로 확인하세요.
              </p>
              
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                <img src="/images/manual/dashboard.png" alt="대시보드 화면" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', display: 'block' }} />
              </div>

              <InfoBox title="활용 팁" icon="fa-lightbulb">
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li><strong>위치 이동:</strong> 좌측 목록에서 특정 이벤트를 클릭하면 지도가 해당 위치로 자동 이동하며 마커가 강조됩니다.</li>
                  <li><strong>실시간 알림:</strong> 새로운 위험 요소가 발견될 경우 상단 헤더 영역에 알림이 표시되며 경고음이 울립니다.</li>
                  <li><strong>필터링:</strong> 지도 우측 상단의 필터를 통해 원하는 위험 유형과 위험도만 골라서 볼 수 있습니다.</li>
                </ul>
              </InfoBox>
            </div>
          )}

          {/* 감지 기록 탭 */}
          {activeTab === 'detection' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-main)' }}>감지 기록 목록 및 상세</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                AI 관제 장비가 부착된 차량들로부터 수집된 <strong>모든 위험 요소 감지 내역을 조회</strong>하고 상세 데이터를 분석합니다.<br/>
                Vision AI가 실제로 분석한 원본 이미지를 확인하고 위험 요소를 식별할 수 있습니다.
              </p>
              
              <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', marginTop: '32px' }}>1. 감지 기록 목록</h4>
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                <img src="/images/manual/detection_list.png" alt="감지 기록 목록" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', display: 'block' }} />
              </div>

              <InfoBox title="데이터 활용 및 추출" icon="fa-search">
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>다양한 필터(기간, 위험 유형, 위험도)와 검색을 통해 원하는 데이터를 쉽게 찾아낼 수 있습니다.</li>
                  <li>필요한 경우 목록 우측 상단의 <strong>[엑셀 다운로드]</strong> 버튼을 눌러 데이터를 추출할 수 있습니다.</li>
                </ul>
              </InfoBox>

              <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>2. 감지 상세 (원본 이미지 확인)</h4>
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                <img src="/images/manual/detection_detail.png" alt="감지 기록 상세" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', display: 'block' }} />
              </div>

              <InfoBox title="상세 정보 및 오탐 처리" icon="fa-info-circle">
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>목록에서 특정 항목을 클릭하면 나타나는 상세 창입니다.</li>
                  <li>AI가 식별한 위험 요소(포트홀, 블랙아이스, 장애물 등)가 이미지 내에 <strong>바운딩 박스(노란색/빨간색 네모)</strong>로 표시됩니다.</li>
                  <li>오탐(잘못 감지된 건)으로 판단되는 경우 상단의 <strong>[오탐 처리]</strong> 버튼을 눌러 통계 및 지도에서 제외할 수 있습니다.</li>
                </ul>
              </InfoBox>
            </div>
          )}

          {/* 신고 문서 관리 탭 */}
          {activeTab === 'report' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--text-main)' }}>신고 문서 관리 및 인쇄</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                시스템에 의해 <strong>자동 생성된 위험 요소 신고 문서</strong>를 관리하고, 필요시 PDF로 저장하거나 인쇄하여 유관 부서에 전달할 수 있습니다.
              </p>
              
              <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', marginTop: '32px' }}>1. 신고 문서 목록</h4>
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                <img src="/images/manual/report_list.png" alt="신고 문서 목록" style={{ maxWidth: '850px', width: '100%', margin: '0 auto', display: 'block' }} />
              </div>

              <InfoBox title="자동 발송 알림" icon="fa-robot">
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>고위험(높음)으로 판단된 감지 건들은 <strong>자동으로 시스템(SYSTEM)에 의해 신고 문서가 작성</strong>됩니다.</li>
                  <li>작성이 완료된 문서는 상태가 '신고 완료'로 전환되며 유관 부서로 자동 전달됩니다.</li>
                </ul>
              </InfoBox>

              <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>2. 문서 인쇄 및 PDF 저장</h4>
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px', background: "var(--border-light)", padding: '24px' }}>
                <img src="/images/manual/report_detail.png" alt="신고 문서 인쇄" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', display: 'block', borderRadius: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
              </div>

              <InfoBox title="인쇄 전용 모드 지원" icon="fa-print">
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>우측 상단의 <strong>[인쇄 / PDF 저장]</strong> 버튼을 누르거나 키보드 <code>Ctrl + P</code>를 누르면 <strong>문서 용지 형태의 본문 내용만 깔끔하게 출력</strong>됩니다.</li>
                  <li>사이드바, 헤더, 불필요한 버튼 등은 인쇄 화면에서 자동으로 숨겨집니다.</li>
                </ul>
              </InfoBox>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
