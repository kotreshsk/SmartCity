import React from 'react';

const QuickReplies = ({ replies, onSelect }) => {
  if (!replies || replies.length === 0) return null;

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-2)',
    padding: 'var(--space-2)',
    marginBottom: 'var(--space-2)'
  };

  const replyStyle = {
    padding: '8px 16px',
    backgroundColor: 'var(--color-primary-surface)',
    color: 'var(--color-primary-dark)',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-primary-light)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap'
  };

  return (
    <div style={containerStyle}>
      {replies.map((reply, index) => (
        <button 
          key={index} 
          style={replyStyle}
          onClick={() => onSelect(reply)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-surface)';
            e.currentTarget.style.color = 'var(--color-primary-dark)';
          }}
        >
          {reply}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
