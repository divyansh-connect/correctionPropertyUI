import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = true,
  variant = 'white', // 'white' | 'beige' | 'outline'
  padding = 'normal', // 'compact' | 'normal' | 'spacious'
  ...props
}) {
  const bgVariants = {
    white: 'bg-white border-brand-neutral-border',
    beige: 'bg-brand-slate-surface border-brand-slate-accent',
    outline: 'bg-transparent border-brand-neutral-border hover:border-brand-blue/40'
  };

  const paddingVariants = {
    compact: 'p-4 sm:p-5',
    normal: 'p-6 sm:p-7',
    spacious: 'p-8 sm:p-10'
  };

  return (
    <div
      className={`rounded-2xl border shadow-card transition-all duration-300 ${hoverEffect ? 'hover:shadow-card-hover hover:-translate-y-1' : ''} ${bgVariants[variant] || bgVariants.white} ${paddingVariants[padding] || paddingVariants.normal} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
