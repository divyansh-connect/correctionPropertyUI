import React from 'react';

export default function Badge({
  children,
  variant = 'green', // 'green' | 'gold' | 'neutral' | 'outline'
  className = '',
  icon: Icon
}) {
  const variants = {
    green: 'bg-brand-blue-surface text-brand-blue border-brand-blue/20',
    gold: 'bg-brand-indigo-surface text-brand-indigo-dark border-brand-indigo/30',
    neutral: 'bg-brand-slate-muted text-brand-neutral-dark border-brand-neutral-border',
    outline: 'bg-white text-brand-neutral-dark border-brand-neutral-border shadow-xs'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${variants[variant] || variants.green} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}
