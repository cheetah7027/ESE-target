import React from 'react';

export const Card = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-black text-black p-3 transition-colors ${
        hover ? 'hover:bg-black hover:text-white cursor-pointer' : ''
      } ${className}`}
      style={{ borderRadius: '4px' }}
    >
      {children}
    </div>
  );
};
