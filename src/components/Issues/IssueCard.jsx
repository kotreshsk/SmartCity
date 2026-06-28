import React from 'react';
import StatusBadge from '../Common/StatusBadge';
import SLATimer from '../Common/SLATimer';
import UpvoteButton from './UpvoteButton';
import { formatRelativeTime } from '../../utils/helpers';
import { MapPin, Clock } from 'lucide-react';

const IssueCard = ({ issue, onClick }) => {
  const urgencyColor = issue.urgency_score > 7 ? 'var(--color-error)' : 
                       issue.urgency_score > 4 ? 'var(--color-warning)' : 
                       'var(--color-success)';

  return (
    <div className="card" onClick={() => onClick && onClick(issue)} style={{ cursor: onClick ? 'pointer' : 'default', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '160px', width: '100%', backgroundColor: 'var(--neutral-200)' }}>
        {issue.image_url ? (
          <img src={issue.image_url} alt={issue.category} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--neutral-500)' }}>No Image</div>
        )}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <StatusBadge status={issue.status} />
        </div>
        <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 'var(--text-xs)', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
          Urgency {issue.urgency_score}/10
        </div>
      </div>
      
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, margin: 0, textTransform: 'capitalize' }}>
          {issue.category.replace(/_/g, ' ')}
        </h3>
        
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-600)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {issue.description}
        </p>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>
          <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{issue.address || 'Location unknown'}</span>
        </div>
        
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--neutral-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <UpvoteButton issueId={issue.id} initialCount={issue.upvote_count || 0} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            {['received', 'reviewed', 'under_progress'].includes(issue.status) ? (
              <SLATimer deadline={issue.sla_deadline} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--neutral-500)' }}>
                <Clock size={12} />
                {formatRelativeTime(issue.created_at)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
