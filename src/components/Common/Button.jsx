import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', // primary, secondary, outline, ghost
  size = 'md', // sm, md, lg
  className = '', 
  isLoading = false,
  disabled = false,
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] focus:ring-[var(--color-primary)]',
    secondary: 'bg-[var(--surface-secondary)] text-[var(--neutral-900)] hover:bg-[var(--neutral-200)] focus:ring-[var(--neutral-400)]',
    outline: 'border border-[var(--neutral-300)] bg-transparent text-[var(--neutral-900)] hover:bg-[var(--surface-secondary)] focus:ring-[var(--neutral-400)]',
    ghost: 'bg-transparent text-[var(--neutral-700)] hover:bg-[var(--surface-secondary)] hover:text-[var(--neutral-900)] focus:ring-[var(--neutral-400)]',
    danger: 'bg-[var(--color-error)] text-white hover:opacity-90 focus:ring-[var(--color-error)]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-base h-11', // 44px min touch target
    lg: 'px-6 py-3 text-lg h-14'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

  // We are using raw CSS properties and simple utility classes mimicking standard behavior since Tailwind is not allowed.
  // We'll write inline styles for variables if they don't map to standard css.
  
  const getVariantStyle = (v) => {
    switch (v) {
      case 'primary': return { backgroundColor: 'var(--color-primary)', color: 'var(--surface-primary)' };
      case 'secondary': return { backgroundColor: 'var(--surface-secondary)', color: 'var(--neutral-900)' };
      case 'outline': return { border: '1px solid var(--neutral-300)', backgroundColor: 'transparent', color: 'var(--neutral-900)' };
      case 'ghost': return { backgroundColor: 'transparent', color: 'var(--neutral-700)' };
      case 'danger': return { backgroundColor: 'var(--color-error)', color: 'var(--surface-primary)' };
      default: return {};
    }
  };

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    transition: 'all var(--transition-fast)',
    borderRadius: 'var(--radius-md)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    border: variant === 'outline' ? '1px solid var(--neutral-300)' : 'none',
    ...getVariantStyle(variant),
    // mapping size manually since we can't use tailwind
    height: size === 'sm' ? '32px' : size === 'lg' ? '56px' : '44px',
    padding: size === 'sm' ? '0 12px' : size === 'lg' ? '0 24px' : '0 16px',
    fontSize: size === 'sm' ? 'var(--text-sm)' : size === 'lg' ? 'var(--text-lg)' : 'var(--text-base)',
  };

  return (
    <button 
      style={style}
      disabled={disabled || isLoading}
      className={`\${className}`}
      {...props}
    >
      {isLoading ? (
        <svg style={{ animation: 'spin 1s linear infinite', marginRight: '8px', height: '16px', width: '16px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
