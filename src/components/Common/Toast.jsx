import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

// A simple local state toast manager for MVP
// In a full app, use Context or a library like react-hot-toast
let toastCount = 0;
const listeners = [];

export const toast = (message, type = 'info') => {
  const id = ++toastCount;
  listeners.forEach(listener => listener({ id, message, type }));
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (newToast) => {
      setToasts(prev => [...prev, newToast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);
    };
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  if (toasts.length === 0) return null;

  const containerStyle = {
    position: 'fixed',
    bottom: '80px', // above bottom nav
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 'var(--z-toast)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    pointerEvents: 'none'
  };

  return (
    <div style={containerStyle}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle size={20} color="var(--color-success)" />;
      case 'error': return <AlertCircle size={20} color="var(--color-error)" />;
      default: return <Info size={20} color="var(--color-primary)" />;
    }
  };

  const style = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-4)',
    backgroundColor: 'var(--surface-elevated)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--neutral-200)',
    pointerEvents: 'auto',
    minWidth: '300px',
    maxWidth: '90vw'
  };

  return (
    <div style={style} className="animate-slide-up">
      {getIcon()}
      <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500 }}>{toast.message}</span>
      <button onClick={onClose} style={{ padding: '4px', opacity: 0.5 }}>
        <X size={16} />
      </button>
    </div>
  );
};

export default ToastContainer;
