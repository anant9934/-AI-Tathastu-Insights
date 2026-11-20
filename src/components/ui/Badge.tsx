import React from 'react';
import { AccentColor } from '../../types';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  accent?: AccentColor | 'neutral';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  accent = 'neutral',
  size = 'sm',
  className = '',
  icon,
}) => {
  const accentStyles: Record<string, string> = {
    violet: 'bg-accent-lavender text-accent-violet border-accent-violet/20 dark:bg-accent-violet/15 dark:text-accent-lavender dark:border-accent-violet/30',
    lavender: 'bg-[#F2EDFD] text-[#6943C2] border-[#6943C2]/20 dark:bg-[#6943C2]/20 dark:text-[#E2D5FC]',
    softblue: 'bg-accent-softblue text-[#205493] border-[#205493]/20 dark:bg-[#205493]/20 dark:text-[#BFDCFC]',
    mint: 'bg-accent-mint text-[#166534] border-[#166534]/20 dark:bg-[#166534]/20 dark:text-[#BBF7D0]',
    sage: 'bg-accent-sage text-[#2D5A3C] border-[#2D5A3C]/20 dark:bg-[#2D5A3C]/20 dark:text-[#C7E3CF]',
    peach: 'bg-accent-peach text-[#9A3412] border-[#9A3412]/20 dark:bg-[#9A3412]/20 dark:text-[#FED7AA]',
    coral: 'bg-[#FDE8E1] text-[#C2410C] border-[#C2410C]/20 dark:bg-[#C2410C]/20 dark:text-[#FFD8CB]',
    butter: 'bg-accent-butter text-[#854D0E] border-[#854D0E]/20 dark:bg-[#854D0E]/20 dark:text-[#FEF08A]',
    neutral: 'bg-foundation-charcoal/5 text-foundation-charcoal dark:bg-white/10 dark:text-dark-text border-foundation-charcoal/10 dark:border-dark-border',
  };

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 rounded font-mono',
    sm: 'text-xs px-2.5 py-1 rounded-full font-medium',
    md: 'text-xs px-3 py-1.5 rounded-full font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border transition-colors select-none tracking-tight',
        accentStyles[accent] || accentStyles.neutral,
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
