import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ShieldAlert, Bell, Menu } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

const Header = ({ onOpenChat }) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.uid);

  const headerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 'var(--z-sticky)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-3) var(--space-4)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Glassmorphism base
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(0,0,0,0.05)'
  };

  const isDark = document.body.classList.contains('dark');
  if (isDark) {
    headerStyle.backgroundColor = 'rgba(15, 23, 42, 0.8)';
    headerStyle.borderBottom = '1px solid rgba(255,255,255,0.05)';
  }

  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '6px', borderRadius: 'var(--radius-md)' }}>
          <ShieldAlert size={20} />
        </div>
        <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
          Smart<span style={{ color: 'var(--color-primary)' }}>City</span>
        </h1>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button 
            style={{ position: 'relative', padding: '4px', color: 'var(--neutral-600)' }}
            onClick={() => {/* Open Notifications */}}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{ 
                position: 'absolute', top: 0, right: 0, 
                backgroundColor: 'var(--color-error)', color: 'white', 
                fontSize: '10px', fontWeight: 'bold',
                minWidth: '16px', height: '16px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--surface-secondary)', overflow: 'hidden', border: '1px solid var(--color-primary-light)' }}>
            <img src={`https://ui-avatars.com/api/?name=\${user.displayName || user.email}&background=random`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
