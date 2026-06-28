import React from 'react';

const EmptyState = ({ icon: Icon, title, message, action }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-12) var(--space-6)',
    textAlign: 'center',
    backgroundColor: 'var(--surface-primary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px dashed var(--neutral-300)'
  };

  const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--color-primary-surface)',
    color: 'var(--color-primary)',
    marginBottom: 'var(--space-4)'
  };

  return (
    <div style={containerStyle}>
      {Icon && (
        <div style={iconContainerStyle}>
          <Icon size={32} />
        </div>
      )}
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--neutral-500)', marginBottom: action ? 'var(--space-6)' : 0, maxWidth: '400px' }}>
        {message}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
