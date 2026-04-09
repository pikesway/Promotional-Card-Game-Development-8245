import React from 'react';

export const GameButton = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "font-game font-bold text-xl md:text-2xl px-6 py-3 rounded-full transition-all duration-150 transform active:translate-y-1 select-none flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-400 text-white border-b-4 border-blue-700 active:border-b-0 shadow-lg",
    success: "bg-green-500 hover:bg-green-400 text-white border-b-4 border-green-700 active:border-b-0 shadow-lg",
    danger: "bg-red-500 hover:bg-red-400 text-white border-b-4 border-red-700 active:border-b-0 shadow-lg",
    outline: "bg-transparent hover:bg-white/10 text-white border-2 border-white active:bg-white/20",
    disabled: "bg-gray-400 text-gray-200 border-b-4 border-gray-500 cursor-not-allowed opacity-70"
  };

  return (
    <button 
      onClick={disabled ? undefined : onClick}
      className={`${baseStyle} ${disabled ? variants.disabled : variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const MenuPanel = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-game-navy border-4 border-slate-600 rounded-3xl shadow-panel p-6 md:p-8 flex flex-col relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
      {title && (
        <h2 className="font-game text-3xl md:text-4xl text-white text-center mb-6 drop-shadow-md tracking-wide">
          {title}
        </h2>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const StyledInput = ({ label, type = 'text', value, onChange, placeholder, required }) => {
  return (
    <div className="flex flex-col mb-4">
      <label className="font-body font-bold text-slate-300 text-sm mb-1 ml-2 uppercase tracking-wider">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="bg-slate-800 border-2 border-slate-600 rounded-xl px-4 py-3 text-white font-body text-lg focus:outline-none focus:border-blue-400 focus:bg-slate-700 transition-colors placeholder-slate-500"
      />
    </div>
  );
};

export const CheckboxRow = ({ checked, onChange, label, sublabel }) => {
  return (
    <label className="flex items-start gap-3 cursor-pointer group mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors">
      <div className="relative flex-shrink-0 mt-1">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <div className="w-6 h-6 bg-slate-800 border-2 border-slate-500 rounded flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-colors">
          {checked && (
            <svg className="w-4 h-4 text-white font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-white font-body text-sm md:text-base leading-tight">{label}</span>
        {sublabel && <span className="text-slate-400 text-xs mt-1 leading-tight">{sublabel}</span>}
      </div>
    </label>
  );
};

export const Badge = ({ children, className = '' }) => (
  <span className={`px-3 py-1 rounded-full font-bold text-sm shadow-sm ${className}`}>
    {children}
  </span>
);