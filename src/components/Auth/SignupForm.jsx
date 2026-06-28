import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../Common/Button';

const SignupForm = ({ onToggleMode, onSuccess }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(email, password, name, role);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
      <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-6)', textAlign: 'center' }}>Create Account</h2>
      
      {error && <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Full Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            required
            style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', backgroundColor: 'var(--surface-primary)' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', backgroundColor: 'var(--surface-primary)' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', backgroundColor: 'var(--surface-primary)' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Account Type</label>
          <select 
            value={role} 
            onChange={e => setRole(e.target.value)}
            style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-300)', backgroundColor: 'var(--surface-primary)' }}
          >
            <option value="citizen">Citizen</option>
            <option value="admin">City Admin</option>
          </select>
        </div>
        
        <Button type="submit" isLoading={loading} style={{ marginTop: 'var(--space-4)' }}>
          Create Account
        </Button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--neutral-600)' }}>
        Already have an account? <button onClick={onToggleMode} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</button>
      </p>
    </div>
  );
};

export default SignupForm;
