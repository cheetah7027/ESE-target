import React from 'react';

export const ProgressBar = ({ progress = 0, size = 'md', showPercent = false, className = '' }) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-white border border-black overflow-hidden ${heightMap[size]}`} style={{ borderRadius: '2px' }}>
        <div
          className={`${heightMap[size]} bg-black transition-all duration-300`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showPercent && (
        <span className="text-xs font-bold text-black mt-1 inline-block font-mono">
          {clamped}%
        </span>
      )}
    </div>
  );
};
