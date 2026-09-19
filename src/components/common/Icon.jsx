import React from 'react';

export const Icon = ({ name, className = '', size = 'text-xl' }) => {
  return (
    <span className={`material-symbols-rounded select-none align-middle inline-block leading-none ${size} ${className}`}>
      {name}
    </span>
  );
};
