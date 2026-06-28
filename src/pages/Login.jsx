import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import SignupForm from '../components/Auth/SignupForm';
import { ShieldAlert } from 'lucide-react';

const Login = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 'var(--space-4)',
      background: 'linear-gradient(135deg, var(--surface-primary) 0%, var(--color-primary-surface) 100%)'
    }}>
      
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <div style={{ 
          display: 'inline-flex', 
          backgroundColor: 'var(--color-primary)', 
          color: 'white', 
          padding: '16px', 
          borderRadius: '24px',
          marginBottom: 'var(--space-4)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <ShieldAlert size={48} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
          Smart<span style={{ color: 'var(--color-primary)' }}>City</span>
        </h1>
        <p style={{ color: 'var(--neutral-600)', fontSize: 'var(--text-lg)', marginTop: '8px' }}>
          Hyperlocal Problem Solver
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '400px' }} className="animate-fade-in">
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} onSuccess={onSuccess} />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} onSuccess={onSuccess} />
        )}
      </div>
      
    </div>
  );
};

export default Login;
