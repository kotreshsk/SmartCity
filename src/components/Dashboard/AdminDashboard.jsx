import React from 'react';
import TicketQueue from './TicketQueue';
import ProofViewer from './ProofViewer';

const AdminDashboard = () => {
  const [selectedTicket, setSelectedTicket] = React.useState(null);

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: selectedTicket ? '1fr 400px' : '1fr',
    gap: 'var(--space-6)',
    height: 'calc(100vh - 100px)', // adjust for header
    padding: 'var(--space-4)'
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)' }}>Ticket Queue</h2>
        <TicketQueue onSelectTicket={setSelectedTicket} />
      </div>
      
      {selectedTicket && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 'var(--text-xl)' }}>Ticket Detail</h2>
            <button 
              onClick={() => setSelectedTicket(null)}
              style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}
            >
              Close
            </button>
          </div>
          
          <div className="card" style={{ flex: 1, overflowY: 'auto' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>Issue #{selectedTicket.id.slice(0, 8)}</h3>
            <p style={{ color: 'var(--neutral-600)', marginBottom: 'var(--space-4)' }}>{selectedTicket.description}</p>
            
            <img 
              src={selectedTicket.image_url} 
              alt="Reported Issue" 
              style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }} 
            />
            
            {selectedTicket.status === 'resolved_pending' && (
              <div style={{ marginTop: 'var(--space-6)' }}>
                <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Contractor Proof Submitted</h4>
                <ProofViewer issue={selectedTicket} />
              </div>
            )}
            
            {/* Action buttons would go here to update status via issueService */}
            <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-2)' }}>
              {selectedTicket.status === 'received' && (
                <button className="card" style={{ flex: 1, textAlign: 'center', backgroundColor: 'var(--color-primary)', color: 'white' }}>
                  Acknowledge (Review)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
