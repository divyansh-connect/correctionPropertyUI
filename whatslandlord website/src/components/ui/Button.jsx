import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({
  children,
  to,
  href,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  onClick,
  type = 'button',
  icon: Icon,
  iconPosition = 'right',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue max-w-full text-center leading-normal';

  const variants = {
    primary: 'bg-brand-blue text-white hover:bg-brand-blue-dark shadow-sm hover:shadow-md border border-transparent',
    secondary: 'bg-brand-blue-surface text-brand-blue hover:bg-brand-blue/10 border border-brand-blue/20',
    outline: 'bg-white text-brand-neutral-dark hover:bg-brand-slate border border-brand-neutral-border hover:border-brand-blue',
    ghost: 'bg-transparent text-brand-neutral-dark hover:bg-brand-slate-muted hover:text-brand-blue',
    gold: 'bg-brand-indigo text-white hover:bg-brand-indigo-dark shadow-sm border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm gap-1.5 sm:gap-2',
    lg: 'px-4 sm:px-7 py-2.5 sm:py-3.5 text-sm sm:text-base gap-2 sm:gap-2.5',
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className={`w-4 h-4 ${size === 'lg' ? 'w-5 h-5' : ''}`} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className={`w-4 h-4 ${size === 'lg' ? 'w-5 h-5' : ''}`} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClasses} {...props}>
      {content}
    </button>
  );
}
