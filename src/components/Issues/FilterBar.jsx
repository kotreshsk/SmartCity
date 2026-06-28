import React from 'react';
import { ISSUE_CATEGORIES } from '../../utils/constants';

const FilterBar = ({ currentFilter, onFilterChange }) => {
  const scrollContainerStyle = {
    display: 'flex',
    gap: 'var(--space-2)',
    overflowX: 'auto',
    paddingBottom: 'var(--space-2)',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE/Edge
  };

  const getButtonStyle = (isActive) => ({
    padding: '8px 16px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: isActive ? 'var(--color-primary)' : 'var(--surface-secondary)',
    color: isActive ? 'white' : 'var(--neutral-700)',
    fontWeight: isActive ? 600 : 500,
    fontSize: 'var(--text-sm)',
    whiteSpace: 'nowrap',
    transition: 'all var(--transition-fast)'
  });

  const categories = ['all', ...Object.values(ISSUE_CATEGORIES)];

  return (
    <div style={scrollContainerStyle} className="hide-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat}
          style={getButtonStyle(currentFilter === cat)}
          onClick={() => onFilterChange(cat)}
        >
          {cat === 'all' ? 'All Issues' : cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
