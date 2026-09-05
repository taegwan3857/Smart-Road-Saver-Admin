import React from 'react';

export default function Modal({ isOpen, title, message, type = 'info', confirmText = '확인', cancelText, onConfirm, onCancel }) {
  if (!isOpen) return null;

  const getConfirmBtnClass = () => {
    if (type === 'danger' || type === 'warning') return 'btn-modal danger';
    return 'btn-modal primary';
  };

  return (
    <div className="modal-overlay show">
      <div className="modal-box">
        <div className="modal-header">
          <span>{title}</span>
        </div>
        <div className="modal-body">
          <div>{message}</div>
        </div>
        <div className="modal-footer">
          {cancelText && (
            <button className="btn-modal secondary" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button className={getConfirmBtnClass()} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
