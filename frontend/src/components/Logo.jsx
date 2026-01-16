import React from 'react';

// Logo unique ArchAdvisor - Représente une architecture avec des connexions
export const ArchAdvisorLogo = ({ size = 40, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Background gradient circle */}
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#0891b2" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Outer glow ring */}
    <circle cx="50" cy="50" r="48" fill="url(#glowGradient)" />
    
    {/* Main background */}
    <rect x="8" y="8" width="84" height="84" rx="16" fill="url(#logoGradient)" />
    
    {/* Architecture symbol - Building blocks */}
    <g filter="url(#glow)">
      {/* Top block - represents cloud/strategy */}
      <rect x="35" y="20" width="30" height="12" rx="2" fill="white" fillOpacity="0.95"/>
      
      {/* Connection lines from top */}
      <line x1="42" y1="32" x2="42" y2="40" stroke="white" strokeWidth="2" strokeOpacity="0.8"/>
      <line x1="58" y1="32" x2="58" y2="40" stroke="white" strokeWidth="2" strokeOpacity="0.8"/>
      
      {/* Middle layer - two blocks representing services */}
      <rect x="22" y="40" width="24" height="12" rx="2" fill="white" fillOpacity="0.9"/>
      <rect x="54" y="40" width="24" height="12" rx="2" fill="white" fillOpacity="0.9"/>
      
      {/* Connection lines to bottom */}
      <line x1="34" y1="52" x2="34" y2="58" stroke="white" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="50" y1="46" x2="50" y2="58" stroke="white" strokeWidth="2" strokeOpacity="0.7"/>
      <line x1="66" y1="52" x2="66" y2="58" stroke="white" strokeWidth="2" strokeOpacity="0.7"/>
      
      {/* Bottom layer - data/infrastructure */}
      <rect x="18" y="58" width="64" height="14" rx="3" fill="white" fillOpacity="0.85"/>
      
      {/* Database symbols inside bottom block */}
      <ellipse cx="32" cy="65" rx="6" ry="3" fill="url(#logoGradient)" fillOpacity="0.6"/>
      <ellipse cx="50" cy="65" rx="6" ry="3" fill="url(#logoGradient)" fillOpacity="0.6"/>
      <ellipse cx="68" cy="65" rx="6" ry="3" fill="url(#logoGradient)" fillOpacity="0.6"/>
    </g>
    
    {/* Decorative dots - representing nodes/connections */}
    <circle cx="20" cy="30" r="3" fill="white" fillOpacity="0.4"/>
    <circle cx="80" cy="30" r="3" fill="white" fillOpacity="0.4"/>
    <circle cx="15" cy="50" r="2" fill="white" fillOpacity="0.3"/>
    <circle cx="85" cy="50" r="2" fill="white" fillOpacity="0.3"/>
    
    {/* AI sparkle accent */}
    <g transform="translate(72, 18)">
      <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="white" fillOpacity="0.9"/>
    </g>
  </svg>
);

// Logo avec texte
export const ArchAdvisorLogoFull = ({ size = 40, showText = true, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <ArchAdvisorLogo size={size} />
    {showText && (
      <div className="flex flex-col">
        <span className="font-heading font-bold text-xl text-white leading-tight">
          Arch<span className="text-cyan-400">Advisor</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
          IT Architecture Assistant
        </span>
      </div>
    )}
  </div>
);

// Favicon version (simplified)
export const ArchAdvisorIcon = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="6" fill="url(#iconGradient)" />
    <rect x="10" y="6" width="12" height="5" rx="1" fill="white" fillOpacity="0.95"/>
    <rect x="6" y="13" width="9" height="5" rx="1" fill="white" fillOpacity="0.9"/>
    <rect x="17" y="13" width="9" height="5" rx="1" fill="white" fillOpacity="0.9"/>
    <rect x="5" y="20" width="22" height="6" rx="1" fill="white" fillOpacity="0.85"/>
  </svg>
);

export default ArchAdvisorLogo;
