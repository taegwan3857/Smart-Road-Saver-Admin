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
  const getColor = (opt) => typeof opt === 'object' ? opt.color : null;
  
  const selectedOpt = options.find(opt => getValue(opt) === value);
  const currentLabel = selectedOpt ? getLabel(selectedOpt) : value;
  const currentColor = selectedOpt ? getColor(selectedOpt) : null;

  return (
    <div className="custom-select-container" ref={containerRef} style={style}>
      <div 
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="trigger-text" style={{display:'flex', alignItems:'center'}}>
          {currentColor && <span style={{display:'inline-block', width:'10px', height:'10px', borderRadius:'50%', backgroundColor:currentColor, marginRight:'8px'}}></span>}
          {currentLabel}
        </span>
        <i className="fas fa-chevron-down" style={{fontSize:"0.8rem", color:"var(--text-muted)"}}></i>
      </div>
      
      {isOpen && (
        <div className="custom-select-options open">
          {options.map((opt, index) => {
            const optValue = getValue(opt);
            const optLabel = getLabel(opt);
            const optColor = getColor(opt);
            const isSelected = value === optValue;
            return (
              <div 
                key={index} 
                className={`custom-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(optValue)}
                style={{display:'flex', alignItems:'center'}}
              >
                <i className="fas fa-check check-icon" style={{marginRight:'8px'}}></i>
                {optColor && <span style={{display:'inline-block', width:'10px', height:'10px', borderRadius:'50%', backgroundColor:optColor, marginRight:'8px'}}></span>}
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}