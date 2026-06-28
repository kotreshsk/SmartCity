import React from 'react';
import { useUpvotes } from '../../hooks/useUpvotes';
import { ThumbsUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const UpvoteButton = ({ issueId, initialCount = 0 }) => {
  const { user } = useAuth();
  const { toggleUpvote, checkHasUpvoted, getUpvoteCount, loading } = useUpvotes(issueId);
  
  const hasUpvoted = checkHasUpvoted();
  const currentCount = getUpvoteCount() !== undefined ? getUpvoteCount() : initialCount;

  const handleToggle = (e) => {
    e.stopPropagation(); // prevent triggering card clicks
    if (!user) {
      alert("Please sign in to upvote"); // Replace with toast in real app
      return;
    }
    toggleUpvote();
  };

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: hasUpvoted ? 'var(--color-primary-surface)' : 'var(--surface-secondary)',
    color: hasUpvoted ? 'var(--color-primary)' : 'var(--neutral-600)',
    border: `1px solid \${hasUpvoted ? 'var(--color-primary-light)' : 'transparent'}`,
    cursor: loading ? 'wait' : 'pointer',
    transition: 'all var(--transition-fast)',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    opacity: loading ? 0.7 : 1
  };

  return (
    <button onClick={handleToggle} disabled={loading} style={style}>
      <ThumbsUp size={16} fill={hasUpvoted ? 'currentColor' : 'none'} />
      {currentCount}
    </button>
  );
};

export default UpvoteButton;
