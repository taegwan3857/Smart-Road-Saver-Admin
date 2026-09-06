import React from 'react';

export default function Manual() {
  return (
    <div className="content-area">
      <div className="page-header-wrap">
        <div className="page-title">시스템 매뉴얼</div>
        <div className="page-subtitle">Smart Road Saver 관제 시스템 이용 방법 및 주요 기능을 안내합니다.</div>
      </div>
      
      <div className="panel" style={{ padding: '30px', lineHeight: '1.6' }}>
        <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', fontSize: '1.15rem' }}>1. 관제 대시보드</h3>
        <p style={{ marginBottom: '32px', color: 'var(--text-muted)' }}>
          대시보드에서는 실시간으로 감지되는 도로 위험 요소(블랙아이스, 포트홀 등)를 지도 상에서 확인할 수 있습니다. 우측 상단의 실시간 감지 알림을 통해 즉각적인 대응이 가능합니다.
        </p>

        <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', fontSize: '1.15rem' }}>2. 감지 및 신고 관리</h3>
        <p style={{ marginBottom: '8px', color: 'var(--text-muted)' }}><strong>- 감지기록:</strong> AI 관제 장비가 부착된 차량들로부터 전송된 모든 위험 요소 감지 내역을 조회합니다. 오탐(False Alarm)으로 판단되는 경우 상세 페이지에서 오탐 처리를 할 수 있습니다.</p>
        <p style={{ marginBottom: '32px', color: 'var(--text-muted)' }}><strong>- 신고 문서 관리:</strong> 시스템에 의해 자동 생성된 위험 요소 신고 문서를 관리합니다. 해당 문서는 유관 부서 및 지자체로 자동 발송됩니다.</p>

        <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', fontSize: '1.15rem' }}>3. 계정 관리</h3>
        <p style={{ marginBottom: '32px', color: 'var(--text-muted)' }}>
          <strong>- 사용자 관리:</strong> 앱을 사용하는 운전자(사용자) 및 시스템을 관리하는 관리자 계정을 조회하고 권한을 관리합니다. 비정상적인 접근이 의심되는 계정은 선택하여 삭제할 수 있습니다.
        </p>

        <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', fontSize: '1.15rem' }}>자주 묻는 질문 (FAQ)</h3>
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '12px' }}>
          <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--text-main)' }}><i className="fas fa-question-circle" style={{ color: 'var(--primary-color)', marginRight: '6px' }}></i> 오탐 처리를 하면 어떻게 되나요?</strong>
          <p style={{ margin: '0', color: 'var(--text-muted)', paddingLeft: '24px' }}>오탐 처리된 감지 건은 지도에 더 이상 위험으로 표시되지 않으며, 누적 위험 알림 및 보고서 작성 대상에서 제외됩니다.</p>
        </div>
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
          <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--text-main)' }}><i className="fas fa-question-circle" style={{ color: 'var(--primary-color)', marginRight: '6px' }}></i> 신고 문서는 언제 자동 발송되나요?</strong>
          <p style={{ margin: '0', color: 'var(--text-muted)', paddingLeft: '24px' }}>위험도 등급이 'High(위험)' 인 요소가 감지되어 AI 신뢰도가 80% 이상일 경우, 지정된 유관 부서 시스템으로 즉각 기안 및 전송 처리됩니다.</p>
        </div>
      </div>
    </div>
  );
}
