import React from 'react';
import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getColors = (val: string) => {
    const s = val.toLowerCase();
    switch (s) {
      case 'active':
      case 'occupied':
      case 'approved':
      case 'accepted':
      case 'paid':
      case 'completed':
      case 'success':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-500/20';
      case 'pending':
      case 'in progress':
      case 'contacted':
      case 'partial':
      case 'medium':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20 dark:bg-amber-500/20';
      case 'vacant':
      case 'new':
      case 'showing scheduled':
      case 'low':
      case 'info':
        return 'bg-sky-500/10 text-sky-500 border-sky-500/20 dark:bg-sky-500/20';
      case 'overdue':
      case 'urgent':
      case 'high':
      case 'rejected':
      case 'declined':
      case 'terminated':
      case 'failed':
      case 'unpaid':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20 dark:bg-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:bg-slate-500/20';
    }
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors duration-150',
        getColors(status),
        className
      )}
    >
      {status}
    </span>
  );
};
export default StatusBadge;
