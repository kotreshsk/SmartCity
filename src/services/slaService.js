import { SLA_HOURS } from '../utils/constants';

export const calculateSLADeadline = (category, reportedAt) => {
  const hours = SLA_HOURS[category] || 168; // Default 7 days
  const date = reportedAt?.toDate ? reportedAt.toDate() : new Date(reportedAt);
  date.setHours(date.getHours() + hours);
  return date;
};

export const checkIsOverdue = (slaDeadline) => {
  if (!slaDeadline) return false;
  const deadline = slaDeadline?.toDate ? slaDeadline.toDate() : new Date(slaDeadline);
  return new Date() > deadline;
};

export const getRemainingSLAText = (slaDeadline) => {
  if (!slaDeadline) return 'N/A';
  const deadline = slaDeadline?.toDate ? slaDeadline.toDate() : new Date(slaDeadline);
  const now = new Date();
  
  if (now > deadline) {
    const overdueMs = now - deadline;
    const hours = Math.floor(overdueMs / (1000 * 60 * 60));
    return `Overdue by \${hours}h`;
  }
  
  const remainingMs = deadline - now;
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `\${days}d remaining`;
  return `\${hours}h remaining`;
};
