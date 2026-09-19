import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variantStyles = {
    critical: 'bg-black text-white border-black font-bold',
    high: 'bg-white text-black border-black font-semibold',
    medium: 'bg-white text-black border-black font-medium',
    low: 'bg-white text-black border-black font-normal',
    success: 'bg-black text-white border-black font-bold',
    primary: 'bg-black text-white border-black font-bold',
    default: 'bg-white text-black border-black font-medium',
  };

  const selected = variantStyles[variant.toLowerCase()] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs border ${selected} ${className}`}
      style={{ borderRadius: '4px' }}
    >
      {children}
    </span>
  );
};
