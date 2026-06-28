import React from 'react';
import { Home, Map as MapIcon, PlusCircle, LayoutDashboard, User } from 'lucide-react';

const BottomNav = ({ currentPath, onNavigate, userRole }) => {
  const navStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 'var(--z-fixed)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 'var(--space-2) var(--space-4)',
    paddingBottom: 'calc(var(--space-2) + env(safe-area-inset-bottom, 16px))',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderTop: '1px solid rgba(0,0,0,0.05)',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.03)'
  };

  const isDark = document.body.classList.contains('dark');
  if (isDark) {
    navStyle.backgroundColor = 'rgba(15, 23, 42, 0.85)';
    navStyle.borderTop = '1px solid rgba(255,255,255,0.05)';
  }

  const NavItem = ({ icon: Icon, label, path, primary = false }) => {
    const isActive = currentPath === path;
    
    if (primary) {
      return (
        <button 
          onClick={() => onNavigate(path)}
          style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            transform: 'translateY(-16px)',
            transition: 'transform var(--transition-fast)'
          }}
        >
          <div style={{
            width: '56px', height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white',
            boxShadow: 'var(--shadow-lg)',
            border: '4px solid ' + (isDark ? 'var(--neutral-900)' : 'white')
          }}>
            <Icon size={28} />
          </div>
          <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--neutral-700)', marginTop: '4px' }}>{label}</span>
        </button>
      );
    }

    return (
      <button 
        onClick={() => onNavigate(path)}
        style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
          color: isActive ? 'var(--color-primary)' : 'var(--neutral-500)',
          padding: 'var(--space-2)',
          transition: 'color var(--transition-fast)'
        }}
      >
        <div style={{ position: 'relative' }}>
          <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
          {isActive && (
            <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
          )}
        </div>
        <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 500 }}>{label}</span>
      </button>
    );
  };

  return (
    <nav style={navStyle}>
      <NavItem icon={Home} label="Home" path="/" />
      
      {userRole === 'admin' ? (
        <NavItem icon={LayoutDashboard} label="Admin" path="/admin" />
      ) : (
        <NavItem icon={MapIcon} label="Map" path="/map" />
      )}
      
      {/* Primary Report Button */}
      <NavItem icon={PlusCircle} label="Report" path="/report" primary={true} />
      
      <NavItem icon={LayoutDashboard} label="My Reports" path="/my-reports" />
      <NavItem icon={User} label="Profile" path="/profile" />
    </nav>
  );
};

export default BottomNav;
