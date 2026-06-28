import React from 'react';

const EscalationInbox = () => {
  return (
    <div className="card">
      <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-4)' }}>Escalation Inbox</h3>
      <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--neutral-500)' }}>
        No active escalations.
      </div>
    </div>
  );
};

export default EscalationInbox;
