import React, { useState, useEffect } from 'react';
import { getRemainingSLAText, checkIsOverdue } from '../../services/slaService';
import { Clock, AlertTriangle } from 'lucide-react';

const SLATimer = ({ deadline }) => {
  const [text, setText] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (!deadline) return;

    const updateTimer = () => {
      setText(getRemainingSLAText(deadline));
      setIsOverdue(checkIsOverdue(deadline));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // update every minute

    return () => clearInterval(interval);
  }, [deadline]);

  if (!deadline) return null;

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    backgroundColor: isOverdue ? 'color-mix(in srgb, var(--status-overdue) 10%, transparent)' : 'var(--surface-secondary)',
    color: isOverdue ? 'var(--status-overdue)' : 'var(--neutral-600)'
  };

  return (
    <div style={style}>
      {isOverdue ? <AlertTriangle size={14} /> : <Clock size={14} />}
      <span>{text}</span>
    </div>
  );
};

export default SLATimer;
