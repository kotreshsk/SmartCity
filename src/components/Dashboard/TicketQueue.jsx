import React, { useState } from 'react';
import { useIssues } from '../../hooks/useIssues';
import StatusBadge from '../Common/StatusBadge';
import { CATEGORY_LABELS } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/helpers';
import { AlertCircle } from 'lucide-react';

const TicketQueue = ({ onSelectTicket }) => {
  const { issues, loading } = useIssues();
  const [filter, setFilter] = useState('all');

  if (loading) return <div className="p-4 text-center">Loading queue...</div>;

  // Sorting: Urgency DESC, Upvotes DESC, SLA (is_overdue first)
  const sortedIssues = [...issues].sort((a, b) => {
    if (a.is_overdue && !b.is_overdue) return -1;
    if (!a.is_overdue && b.is_overdue) return 1;
    if (b.urgency_score !== a.urgency_score) return b.urgency_score - a.urgency_score;
    return (b.upvote_count || 0) - (a.upvote_count || 0);
  });

  const filteredIssues = sortedIssues.filter(issue => {
    if (filter === 'all') return true;
    if (filter === 'overdue') return issue.is_overdue;
    if (filter === 'open') return ['received', 'reviewed', 'under_progress'].includes(issue.status);
    if (filter === 'review') return issue.status === 'resolved_pending';
    return true;
  });

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: 'minmax(120px, 1fr) 2fr 100px 100px',
    gap: 'var(--space-4)',
    padding: 'var(--space-3) var(--space-4)',
    borderBottom: '1px solid var(--neutral-200)',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color var(--transition-fast)'
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--neutral-200)', display: 'flex', gap: 'var(--space-2)' }}>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-300)' }}
        >
          <option value="all">All Tickets</option>
          <option value="open">Open Issues</option>
          <option value="overdue">Overdue</option>
          <option value="review">Pending Verification</option>
        </select>
      </div>

      <div style={{ backgroundColor: 'var(--surface-secondary)', fontWeight: 600, fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--neutral-500)', ...rowStyle, cursor: 'default' }}>
        <span>Status</span>
        <span>Issue & Location</span>
        <span style={{ textAlign: 'center' }}>Urgency</span>
        <span style={{ textAlign: 'right' }}>Reported</span>
      </div>

      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {filteredIssues.length === 0 ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--neutral-500)' }}>No tickets match criteria.</div>
        ) : (
          filteredIssues.map(issue => (
            <div 
              key={issue.id} 
              style={rowStyle} 
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => onSelectTicket(issue)}
            >
              <div>
                <StatusBadge status={issue.status} />
                {issue.is_overdue && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-overdue)', fontSize: 'var(--text-xs)', marginTop: '4px', fontWeight: 600 }}>
                    <AlertCircle size={12} /> Overdue
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {CATEGORY_LABELS[issue.category] || issue.category}
                </span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {issue.address || 'Location unknown'}
                </span>
              </div>
              <div style={{ textAlign: 'center', fontWeight: 600, color: issue.urgency_score > 7 ? 'var(--color-error)' : 'inherit' }}>
                {issue.urgency_score} / 10
              </div>
              <div style={{ textAlign: 'right', fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>
                {formatRelativeTime(issue.created_at)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketQueue;
