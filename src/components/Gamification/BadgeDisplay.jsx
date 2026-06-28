import React from 'react';
import { BADGES } from '../../utils/constants';
import BadgeCard from './BadgeCard';

const BadgeDisplay = ({ earnedBadgeIds = [] }) => {
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: 'var(--space-4)',
    width: '100%'
  };

  return (
    <div style={containerStyle}>
      {BADGES.map((badge) => (
        <BadgeCard 
          key={badge.id}
          badge={badge}
          isEarned={earnedBadgeIds.includes(badge.id)}
        />
      ))}
    </div>
  );
};

export default BadgeDisplay;
