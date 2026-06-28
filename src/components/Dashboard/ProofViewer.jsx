import React from 'react';

const ProofViewer = ({ issue }) => {
  if (!issue.proof_image_url) return null;

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--space-2)',
    marginTop: 'var(--space-2)'
  };

  const imgStyle = {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--neutral-200)'
  };

  return (
    <div>
      <div style={containerStyle}>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', marginBottom: '4px' }}>BEFORE</div>
          <img src={issue.image_url} alt="Before" style={imgStyle} />
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', marginBottom: '4px' }}>AFTER</div>
          <img src={issue.proof_image_url} alt="After" style={imgStyle} />
        </div>
      </div>
      
      {issue.anticheat_result && (
        <div style={{ 
          marginTop: 'var(--space-4)', 
          padding: 'var(--space-3)', 
          backgroundColor: issue.anticheat_result.overall_verdict === 'pass' ? 'var(--color-success)' : 'var(--color-error)',
          color: 'white',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)'
        }}>
          <strong>AI Verification: {issue.anticheat_result.overall_verdict.toUpperCase()}</strong>
          <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>{issue.anticheat_result.repair_explanation}</p>
        </div>
      )}
    </div>
  );
};

export default ProofViewer;
