import React from 'react';

const MessageBubble = ({ message, isUser }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: isUser ? 'flex-end' : 'flex-start',
    marginBottom: 'var(--space-3)',
    maxWidth: '85%',
    alignSelf: isUser ? 'flex-end' : 'flex-start'
  };

  const bubbleStyle = {
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-xl)',
    backgroundColor: isUser ? 'var(--color-primary)' : 'var(--surface-secondary)',
    color: isUser ? 'white' : 'var(--neutral-900)',
    fontSize: 'var(--text-md)',
    lineHeight: 1.4,
    borderBottomRightRadius: isUser ? '4px' : 'var(--radius-xl)',
    borderBottomLeftRadius: isUser ? 'var(--radius-xl)' : '4px',
    boxShadow: 'var(--shadow-sm)'
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={bubbleStyle}>
        {message.text}
      </div>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-500)', marginTop: '4px', padding: '0 4px' }}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

export default MessageBubble;
