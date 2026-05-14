import React from 'react';

/**
 * Sankore Investments logo — three interlocking rings from the brand mark,
 * rendered as an inline SVG for crisp rendering at any size.
 */
export const SankoreLogo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background circle */}
    <rect width="80" height="80" rx="16" fill="url(#logoGradientEq)" />
    
    {/* Three interlocking rings */}
    <circle cx="32" cy="46" r="14" stroke="#C4A95A" strokeWidth="3.5" fill="none" opacity="0.9" />
    <circle cx="48" cy="46" r="14" stroke="#7BA4C7" strokeWidth="3.5" fill="none" opacity="0.9" />
    <circle cx="40" cy="32" r="14" stroke="#B8C4CC" strokeWidth="3.5" fill="none" opacity="0.85" />

    <defs>
      <linearGradient id="logoGradientEq" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E3D6F" />
        <stop offset="100%" stopColor="#142B4F" />
      </linearGradient>
    </defs>
  </svg>
);
