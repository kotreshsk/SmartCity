import React from 'react';
import Button from '../Common/Button';
import { Download } from 'lucide-react';

const Certificate = ({ userName, reportsCount, verifiedCount }) => {
  const containerStyle = {
    padding: 'var(--space-6)',
    backgroundColor: 'var(--surface-primary)',
    borderRadius: 'var(--radius-xl)',
    border: '8px solid var(--color-primary-surface)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  };

  const handleDownload = () => {
    // In a real app, generate PDF using jspdf or html2canvas
    alert("Certificate download triggered (mock)");
  };

  return (
    <div style={containerStyle}>
      <div style={{ position: 'absolute', opacity: 0.05, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      <h2 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-primary-dark)', marginBottom: 'var(--space-4)' }}>
        Certificate of Impact
      </h2>
      <p style={{ color: 'var(--neutral-600)', marginBottom: 'var(--space-2)' }}>This certifies that</p>
      <h3 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, margin: 'var(--space-4) 0' }}>{userName || 'Active Citizen'}</h3>
      <p style={{ color: 'var(--neutral-600)', maxWidth: '400px', margin: '0 auto var(--space-6)' }}>
        has made significant contributions to improving our city infrastructure by reporting {reportsCount} issues and verifying {verifiedCount} resolutions.
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-8)' }}>
        <Button onClick={handleDownload} variant="outline" size="sm">
          <Download size={16} style={{ marginRight: '8px' }} />
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default Certificate;
