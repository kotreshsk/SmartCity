import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

const ProfileSettings = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  if (!user) return null;

  return (
    <div className="card" style={{ maxWidth: '500px', margin: 'var(--space-8) auto' }}>
      <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)' }}>Settings</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div>
          <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>Account</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--neutral-200)' }}>
            <span style={{ fontWeight: 500 }}>Name</span>
            <span style={{ color: 'var(--neutral-600)' }}>{user.displayName || 'Citizen'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--neutral-200)' }}>
            <span style={{ fontWeight: 500 }}>Email</span>
            <span style={{ color: 'var(--neutral-600)' }}>{user.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--neutral-200)' }}>
            <span style={{ fontWeight: 500 }}>Role</span>
            <span style={{ color: 'var(--neutral-600)', textTransform: 'capitalize' }}>{user.role}</span>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>Preferences</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--neutral-200)' }}>
            <span style={{ fontWeight: 500 }}>Dark Mode</span>
            <button 
              onClick={toggleTheme}
              style={{
                width: '40px',
                height: '24px',
                borderRadius: '12px',
                backgroundColor: isDarkMode ? 'var(--color-primary)' : 'var(--neutral-300)',
                position: 'relative',
                transition: 'background-color var(--transition-fast)'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '2px',
                left: isDarkMode ? '18px' : '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'white',
                transition: 'left var(--transition-fast)'
              }} />
            </button>
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-4)' }}>
          <Button onClick={logout} variant="outline" style={{ width: '100%', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
