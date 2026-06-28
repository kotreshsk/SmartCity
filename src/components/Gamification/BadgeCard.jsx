import React from 'react';
import * as Icons from 'lucide-react';

const BadgeCard = ({ badge, isEarned }) => {
  const Icon = Icons[badge.icon] || Icons.Award;

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: 'var(--space-4)',
    backgroundColor: 'var(--surface-primary)',
    borderRadius: 'var(--radius-lg)',
    border: `1px solid \${isEarned ? 'var(--color-primary-light)' : 'var(--neutral-200)'}`,
    position: 'relative',
    opacity: isEarned ? 1 : 0.6,
    filter: isEarned ? 'none' : 'grayscale(100%)',
    transition: 'all var(--transition-normal)'
  };

  const iconContainerStyle = {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: isEarned ? 'var(--color-primary-surface)' : 'var(--surface-secondary)',
    color: isEarned ? 'var(--color-primary)' : 'var(--neutral-500)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'var(--space-2)'
  };

  return (
    <div style={cardStyle} title={badge.description}>
      <div style={iconContainerStyle}>
        <Icon size={24} />
      </div>
      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--neutral-900)' }}>
        {badge.name}
      </span>
      {!isEarned && (
        <div style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'var(--surface-elevated)', borderRadius: 'var(--radius-full)', padding: '2px', boxShadow: 'var(--shadow-sm)' }}>
          <Icons.Lock size={12} color="var(--neutral-500)" />
        </div>
      )}
    </div>
  );
};

export default BadgeCard;
