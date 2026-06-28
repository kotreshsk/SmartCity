import React from 'react';
import { ISSUE_STATUSES } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (s) => {
    switch (s) {
      case ISSUE_STATUSES.RECEIVED:
        return { label: 'Received', colorVar: '--status-received' };
      case ISSUE_STATUSES.REVIEWED:
        return { label: 'Reviewed', colorVar: '--status-reviewed' };
      case ISSUE_STATUSES.PROGRESS:
        return { label: 'In Progress', colorVar: '--status-progress' };
      case ISSUE_STATUSES.RESOLVED_PENDING:
        return { label: 'Pending Verification', colorVar: '--status-resolved' };
      case ISSUE_STATUSES.VERIFIED_CLOSED:
        return { label: 'Verified & Closed', colorVar: '--status-verified' };
      default:
        return { label: 'Unknown', colorVar: '--neutral-500' };
    }
  };

  const config = getStatusConfig(status);

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: `var(\${config.colorVar})`,
    backgroundColor: `color-mix(in srgb, var(\${config.colorVar}) 15%, transparent)`,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  return (
    <span style={style}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
