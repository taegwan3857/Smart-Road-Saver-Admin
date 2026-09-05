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

  const getLabel = (opt) => typeof opt === 'object' ? opt.label : opt;
  const getValue = (opt) => typeof opt === 'object' ? opt.value : opt;
  
  const currentLabel = getLabel(options.find(opt => getValue(opt) === value)) || value;

  return (
    <div className="custom-select-container" ref={containerRef} style={style}>
      <div 
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="trigger-text">{currentLabel}</span>
        <i className="fas fa-chevron-down" style={{fontSize:"0.8rem", color:"var(--text-muted)"}}></i>
      </div>
      
      {isOpen && (
        <div className="custom-select-options open">
          {options.map((opt, index) => {
            const optValue = getValue(opt);
            const optLabel = getLabel(opt);
            const isSelected = value === optValue;
            return (
              <div 
                key={index} 
                className={`custom-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(optValue)}
              >
                <i className="fas fa-check check-icon"></i>
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}