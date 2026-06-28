import React from 'react';
import IssueCard from './IssueCard';
import EmptyState from '../Common/EmptyState';
import LoadingSpinner from '../Common/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

const IssueList = ({ issues, loading, error, onIssueClick }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState 
        icon={AlertCircle}
        title="Failed to load issues"
        message={error}
      />
    );
  }

  if (!issues || issues.length === 0) {
    return (
      <EmptyState 
        icon={AlertCircle} // Using AlertCircle as a fallback, realistically a Map icon
        title="No issues found"
        message="There are no reported issues in this area matching your filters."
      />
    );
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 'var(--space-4)',
    width: '100%'
  };

  return (
    <div style={gridStyle}>
      {issues.map(issue => (
        <IssueCard 
          key={issue.id} 
          issue={issue} 
          onClick={onIssueClick} 
        />
      ))}
    </div>
  );
};

export default IssueList;
