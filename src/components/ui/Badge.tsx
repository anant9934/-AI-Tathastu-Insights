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
    // Redesign V2 Semantic Categories
    violet: 'bg-[#EEE8FA] text-[#7955D5] border-[#7955D5]/25 dark:bg-[#7955D5]/20 dark:text-[#EEE8FA] dark:border-[#7955D5]/40',
    blue: 'bg-[#E8EFFB] text-[#4775C9] border-[#4775C9]/25 dark:bg-[#4775C9]/20 dark:text-[#E8EFFB] dark:border-[#4775C9]/40',
    mint: 'bg-[#E4F1E9] text-[#368A70] border-[#368A70]/25 dark:bg-[#368A70]/20 dark:text-[#E4F1E9] dark:border-[#368A70]/40',
    terracotta: 'bg-[#F8EAE2] text-[#D9785D] border-[#D9785D]/25 dark:bg-[#D9785D]/20 dark:text-[#F8EAE2] dark:border-[#D9785D]/40',
    ochre: 'bg-[#F5EEDB] text-[#C58B35] border-[#C58B35]/25 dark:bg-[#C58B35]/20 dark:text-[#F5EEDB] dark:border-[#C58B35]/40',
    // Aliases
    lavender: 'bg-[#EEE8FA] text-[#7955D5] border-[#7955D5]/25 dark:bg-[#7955D5]/20 dark:text-[#EEE8FA]',
    softblue: 'bg-[#E8EFFB] text-[#4775C9] border-[#4775C9]/25 dark:bg-[#4775C9]/20 dark:text-[#E8EFFB]',
    sage: 'bg-[#E4F1E9] text-[#368A70] border-[#368A70]/25 dark:bg-[#368A70]/20 dark:text-[#E4F1E9]',
    peach: 'bg-[#F8EAE2] text-[#D9785D] border-[#D9785D]/25 dark:bg-[#D9785D]/20 dark:text-[#F8EAE2]',
    coral: 'bg-[#F8EAE2] text-[#D9785D] border-[#D9785D]/25 dark:bg-[#D9785D]/20 dark:text-[#F8EAE2]',
    butter: 'bg-[#F5EEDB] text-[#C58B35] border-[#C58B35]/25 dark:bg-[#C58B35]/20 dark:text-[#F5EEDB]',
    neutral: 'bg-foundation-paper text-foundation-secondary dark:bg-white/5 dark:text-dark-secondary border-foundation-border dark:border-dark-border',
  };

  const sizeStyles = {
    xs: 'text-[11px] px-2 py-0.5 rounded font-mono',
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
