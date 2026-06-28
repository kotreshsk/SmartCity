import React from 'react';

const LoadingSpinner = ({ size = 24, color = 'var(--color-primary)' }) => {
  const style = {
    animation: 'spin 1s linear infinite',
    height: `${size}px`,
    width: `${size}px`
  };

  return (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" style={{ stroke: color }}></circle>
      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ color }}></path>
    </svg>
  );
};

export default LoadingSpinner;
