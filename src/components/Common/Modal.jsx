import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--surface-overlay)',
    zIndex: 'var(--z-modal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-4)',
    backdropFilter: 'blur(4px)'
  };

  const modalStyle = {
    backgroundColor: 'var(--surface-primary)',
    borderRadius: 'var(--radius-xl)',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-xl)',
    overflow: 'hidden'
  };

  const headerStyle = {
    padding: 'var(--space-4) var(--space-5)',
    borderBottom: '1px solid var(--neutral-200)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const bodyStyle = {
    padding: 'var(--space-5)',
    overflowY: 'auto'
  };

  return (
    <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={modalStyle} className="animate-slide-up">
        <div style={headerStyle}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0 }}>{title}</h2>
          <button 
            onClick={onClose}
            style={{ padding: '8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--surface-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={bodyStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
