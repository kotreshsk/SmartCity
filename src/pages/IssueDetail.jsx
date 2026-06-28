import React, { useState, useEffect } from 'react';
import { issueService } from '../services/issueService';
import StatusBadge from '../components/Common/StatusBadge';
import SLATimer from '../components/Common/SLATimer';
import UpvoteButton from '../components/Issues/UpvoteButton';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { formatRelativeTime } from '../utils/helpers';
import { MapPin, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import ProofViewer from '../components/Dashboard/ProofViewer';
import Button from '../components/Common/Button';
import { useAuth } from '../hooks/useAuth';

const IssueDetail = ({ issueId, onNavigate }) => {
  const { user } = useAuth();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const data = await issueService.getIssue(issueId);
        setIssue(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (issueId) fetchIssue();
  }, [issueId]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}><LoadingSpinner size={40} /></div>;
  if (error) return <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-error)' }}>{error}</div>;
  if (!issue) return <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>Issue not found.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: 'var(--neutral-900)' }}>
        <img src={issue.image_url} alt="Issue" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 'var(--space-4)', background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }}>
          <button onClick={() => onNavigate(-1)} style={{ color: 'white', padding: '8px' }}>← Back</button>
        </div>
      </div>

      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', backgroundColor: 'var(--surface-primary)', borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)', marginTop: '-24px', zIndex: 1, position: 'relative' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: '0 0 var(--space-2) 0', textTransform: 'capitalize' }}>
              {issue.category.replace(/_/g, ' ')}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <StatusBadge status={issue.status} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> {formatRelativeTime(issue.created_at)}
              </span>
            </div>
          </div>
          <UpvoteButton issueId={issue.id} initialCount={issue.upvote_count} />
        </div>

        {issue.sla_deadline && ['received', 'reviewed', 'under_progress'].includes(issue.status) && (
          <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Target Resolution</span>
            <SLATimer deadline={issue.sla_deadline} />
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <MapPin style={{ color: 'var(--color-primary)', marginTop: '2px' }} size={20} />
          <div>
            <div style={{ fontWeight: 600 }}>Location</div>
            <div style={{ color: 'var(--neutral-600)', fontSize: 'var(--text-sm)' }}>{issue.address || 'Location unknown'}</div>
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Description</div>
          <p style={{ color: 'var(--neutral-700)', lineHeight: 1.5 }}>{issue.description}</p>
        </div>

        {issue.ai_tags && issue.ai_tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {issue.ai_tags.map(tag => (
              <span key={tag} style={{ padding: '4px 10px', backgroundColor: 'var(--surface-secondary)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', color: 'var(--neutral-600)' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* If resolved or pending resolution */}
        {issue.proof_image_url && (
          <div style={{ marginTop: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={20} color="var(--color-success)" /> Resolution Proof
            </h3>
            <ProofViewer issue={issue} />
          </div>
        )}

        {/* User Action: Verify Fix if status is resolved_pending and user is the reporter */}
        {issue.status === 'resolved_pending' && user && user.uid === issue.user_id && (
          <div className="card" style={{ marginTop: 'var(--space-4)', backgroundColor: 'var(--color-primary-surface)', border: '1px solid var(--color-primary-light)' }}>
            <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>Verify Resolution</h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-700)', marginBottom: 'var(--space-4)' }}>
              The contractor has marked this issue as resolved. Please verify if the fix is satisfactory to close the ticket and earn your verification badge!
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button style={{ flex: 1 }}>Accept Fix</Button>
              <Button variant="outline" style={{ flex: 1, backgroundColor: 'white', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>Reject</Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default IssueDetail;
