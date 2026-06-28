import React from 'react';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import SLAMetrics from '../components/Dashboard/SLAMetrics';
import EscalationInbox from '../components/Dashboard/EscalationInbox';

const Admin = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--neutral-200)', backgroundColor: 'var(--surface-primary)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0 }}>Command Center</h1>
        <p style={{ color: 'var(--neutral-500)', margin: '4px 0 0 0' }}>City Administrator Dashboard</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-4)', padding: 'var(--space-4)', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', overflow: 'hidden' }}>
          <AdminDashboard />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', overflowY: 'auto' }}>
          <SLAMetrics />
          <EscalationInbox />
        </div>
      </div>
    </div>
  );
};

export default Admin;
