import React from 'react';
// Mock SLA metrics component since Recharts is large to fully implement without real data structure
const SLAMetrics = () => {
  return (
    <div className="card" style={{ padding: 'var(--space-6)' }}>
      <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>SLA Compliance</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div style={{ textAlign: 'center', padding: 'var(--space-4)', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-success)' }}>92%</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>On Time Resolution</div>
        </div>
        <div style={{ textAlign: 'center', padding: 'var(--space-4)', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-primary)' }}>4.2</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>Avg Days to Resolve</div>
        </div>
      </div>
    </div>
  );
};

export default SLATimer;
