import React, { useState, useEffect, useRef } from 'react';

export default function CustomSelect({ options, value, onChange, className = "form-select", style = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-container" ref={containerRef} style={style}>
      <div 
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="trigger-text">{value}</span>
        <i className="fas fa-chevron-down" style={{fontSize:"0.8rem", color:"var(--text-muted)"}}></i>
      </div>
      
      {isOpen && (
        <div className="custom-select-options open">
          {options.map((opt, index) => {
            const isSelected = value === opt;
            return (
              <div 
                key={index} 
                className={`custom-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(opt)}
              >
                <i className="fas fa-check check-icon"></i>
                {opt}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
