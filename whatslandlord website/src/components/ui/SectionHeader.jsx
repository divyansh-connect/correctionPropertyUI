import React from 'react';
import Badge from './Badge';

export default function SectionHeader({
  badge,
  badgeIcon,
  title,
  subtitle,
  align = 'center', // 'left' | 'center' | 'right'
  className = ''
}) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto'
  };

  const isInverse = className.includes('text-white');

  return (
    <div className={`flex flex-col max-w-3xl mb-12 sm:mb-16 ${alignClasses[align]} ${className}`}>
      {badge && (
        <div className="mb-4">
          <Badge variant={isInverse ? "gold" : "green"} icon={badgeIcon}>
            {badge}
          </Badge>
        </div>
      )}
      {title && (
        <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight break-words max-w-full ${isInverse ? 'text-white' : 'text-brand-neutral-dark'}`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`mt-3 sm:mt-4 text-sm sm:text-lg leading-relaxed font-normal break-words max-w-full ${isInverse ? 'text-gray-200' : 'text-brand-neutral-muted'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
