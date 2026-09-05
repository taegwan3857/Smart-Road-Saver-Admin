// 공통 컴포넌트 로드 함수
async function loadComponent(elementId, url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const html = await response.text();
      document.getElementById(elementId).innerHTML = html;
      
      // 사이드바 로드 후 현재 페이지 활성화 처리
      if(elementId === 'sidebar-placeholder') {
        setActiveNav();
      }
    } else {
      console.error('Failed to load', url);
    }
  } catch (error) {
    console.error('Error fetching', url, error);
    document.getElementById(elementId).innerHTML = 
      `<div style="padding:20px; color:var(--accent-warning);">
        로컬 서버 환경(http://localhost)에서 실행해주세요.
      </div>`;
  }
}

// 현재 경로에 맞춰 사이드바 active 클래스 설정
function setActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.sidebar-menu a');
  
  navItems.forEach(item => {
    item.classList.remove('active');
    if(item.getAttribute('data-path') === currentPath) {
      item.classList.add('active');
    }
  });
}

// 공통 모달 생성 및 제어 함수 (아이콘 배제, 하드코어 엔터프라이즈 스타일)
window.showModal = function({ title, message, type = 'info', confirmText = '확인', cancelText = null, onConfirm }) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  let footerButtons = '';
  if (cancelText) {
    footerButtons += `<button class="btn-modal secondary" id="modal-cancel-btn">${cancelText}</button>`;
  }
  footerButtons += `<button class="btn-modal primary" id="modal-confirm-btn">${confirmText}</button>`;

  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <span>${title}</span>
      </div>
      <div class="modal-body">
        <div>${message}</div>
      </div>
      <div class="modal-footer">${footerButtons}</div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => overlay.classList.add('show'), 10);

  const closeAndRemove = () => {
    overlay.classList.remove('show');
    setTimeout(() => document.body.removeChild(overlay), 150);
  };

  document.getElementById('modal-confirm-btn').addEventListener('click', () => {
    if (onConfirm) onConfirm();
    closeAndRemove();
  });

  if (cancelText) {
    document.getElementById('modal-cancel-btn').addEventListener('click', closeAndRemove);
  }
};

// 모든 기본 <select>를 커스텀 UI로 자동 변환하는 공통 스크립트
function autoConvertSelects() {
  const selects = document.querySelectorAll('select.form-select');
  selects.forEach(select => {
    if (select.nextElementSibling && select.nextElementSibling.classList.contains('custom-select-container')) return;
    
    select.style.display = 'none'; // 기존 select 숨김
    
    const container = document.createElement('div');
    container.className = 'custom-select-container';
    
    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';
    trigger.innerHTML = `
      <span class="trigger-text">${select.options[select.selectedIndex]?.text || ''}</span>
      <i class="fas fa-chevron-down" style="font-size:0.8rem; color:var(--text-muted);"></i>
    `;
    container.appendChild(trigger);
    
    const optionsPanel = document.createElement('div');
    optionsPanel.className = 'custom-select-options';
    
    Array.from(select.options).forEach((opt, index) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'custom-option' + (index === select.selectedIndex ? ' selected' : '');
      optionDiv.innerHTML = `<i class="fas fa-check check-icon"></i> ${opt.text}`;
      
      optionDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        optionsPanel.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
        optionDiv.classList.add('selected');
        trigger.querySelector('.trigger-text').innerText = opt.text;
        optionsPanel.classList.remove('open');
        select.selectedIndex = index;
        select.dispatchEvent(new Event('change')); // 기존 이벤트 트리거 연동
      });
      optionsPanel.appendChild(optionDiv);
    });
    
    container.appendChild(optionsPanel);
    select.parentNode.insertBefore(container, select.nextSibling);
    
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.custom-select-options').forEach(p => {
        if (p !== optionsPanel) p.classList.remove('open');
      });
      optionsPanel.classList.toggle('open');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-options').forEach(p => p.classList.remove('open'));
  });
}

// 로그아웃 핸들러
window.handleLogout = function(e) {
  e.preventDefault();
  showModal({
    title: '로그아웃',
    message: '정말로 로그아웃 하시겠습니까?',
    type: 'warning',
    cancelText: '취소',
    onConfirm: () => {
      window.location.href = 'login.html';
    }
  });
};

// 컴포넌트 초기화
document.addEventListener("DOMContentLoaded", () => {
  if(document.getElementById('sidebar-placeholder')) {
    loadComponent('sidebar-placeholder', 'components/sidebar.html');
  }
  if(document.getElementById('header-placeholder')) {
    loadComponent('header-placeholder', 'components/header.html');
  }
  
  // 모든 화면의 Select 박스를 공통 커스텀 UI로 덮어씌움
  autoConvertSelects();

  // 시계 업데이트
  setInterval(() => {
    const clock = document.getElementById('clock');
    if (clock) {
      const now = new Date();
      const kstDate = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
      const y = kstDate.getFullYear();
      const m = kstDate.getMonth() + 1;
      const d = kstDate.getDate();
      const h = kstDate.getHours();
      const min = kstDate.getMinutes();
      const s = kstDate.getSeconds();
      
      clock.innerText = `${y}년 ${m}월 ${d}일 ${h}시 ${min}분 ${s}초`;
    }
  }, 1000);
});
