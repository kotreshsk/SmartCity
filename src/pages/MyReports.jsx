import React from 'react';
import IssueList from '../components/Issues/IssueList';
import { useIssues } from '../hooks/useIssues';
import { useAuth } from '../hooks/useAuth';

const MyReports = ({ onNavigate }) => {
  const { user } = useAuth();
  const { issues, loading, error } = useIssues();

  // Filter issues to only those reported by the current user
  const userIssues = issues.filter(issue => issue.user_id === user?.uid);

  return (
    <div style={{ padding: 'var(--space-4)' }}>
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>My Reports</h2>
      
      <IssueList 
        issues={userIssues} 
        loading={loading} 
        error={error} 
        onIssueClick={(issue) => onNavigate(`/issue/\${issue.id}`)} 
      />
    </div>
  );
};

export default MyReports;
