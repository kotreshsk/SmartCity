import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../Common/Button';

const LoginForm = ({ onToggleMode, onSuccess }) => {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '0 auto', backgroundColor: '#ffffff', color: '#000000' }}>
      <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)', textAlign: 'center', color: '#000000' }}>Welcome Back</h2>
      
      {error && <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', fontWeight: 500, color: '#000000' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', backgroundColor: '#f9fafb', color: '#000000' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', fontWeight: 500, color: '#000000' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', backgroundColor: '#f9fafb', color: '#000000' }}
          />
        </div>
        
        <Button type="submit" isLoading={loading} style={{ marginTop: 'var(--space-4)' }}>
          Sign In
        </Button>
      </form>

      <div style={{ margin: 'var(--space-4) 0', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid var(--neutral-300)' }}></div>
        <span style={{ position: 'relative', background: '#ffffff', padding: '0 var(--space-2)', color: 'var(--neutral-500)', fontSize: 'var(--text-sm)' }}>OR</span>
      </div>

      <Button type="button" onClick={handleGoogleLogin} isLoading={loading} style={{ width: '100%', backgroundColor: '#ffffff', color: '#374151', border: '1px solid #d1d5db', marginBottom: 'var(--space-4)' }}>
        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
          </g>
        </svg>
        Sign in with Google
      </Button>
      
      <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: '#374151' }}>
        Don't have an account? <button onClick={onToggleMode} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign up</button>
      </p>
    </div>
  );
};

export default LoginForm;
