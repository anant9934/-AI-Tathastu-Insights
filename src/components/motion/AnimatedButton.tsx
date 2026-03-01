import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MOTION_DURATIONS, EDITORIAL_EASE } from '../../lib/motion';
import { cn } from '../../lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  loading?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className = '',
  loading = false,
  disabled,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  const variantStyles = {
    primary:
      'bg-foundation-charcoal text-foundation-ivory hover:bg-black dark:bg-foundation-ivory dark:text-foundation-charcoal dark:hover:bg-white border border-foundation-charcoal dark:border-foundation-ivory',
    secondary:
      'bg-accent-lavender text-accent-violet hover:bg-accent-violet hover:text-white dark:bg-accent-violet/20 dark:text-accent-lavender dark:hover:bg-accent-violet/30 border border-transparent',
    outline:
      'bg-transparent text-foundation-charcoal dark:text-dark-text border border-foundation-charcoal/20 dark:border-dark-border hover:border-foundation-charcoal dark:hover:border-foundation-ivory',
    ghost:
      'bg-transparent text-foundation-charcoal dark:text-dark-text hover:bg-foundation-charcoal/5 dark:hover:bg-white/5 border border-transparent',
    accent:
      'bg-accent-violet text-white hover:bg-[#6e46be] border border-transparent shadow-sm',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2 font-medium',
    lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 font-medium',
  };

  return (
    <motion.button
      whileHover={shouldReduceMotion || disabled || loading ? {} : { y: -1 }}
      whileTap={shouldReduceMotion || disabled || loading ? {} : { scale: 0.98 }}
      transition={{
        duration: MOTION_DURATIONS.buttonFeedback,
        ease: EDITORIAL_EASE,
      }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center transition-colors cursor-pointer select-none',
        'focus-visible:outline-2 focus-visible:outline-accent-violet focus-visible:outline-offset-2',
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && 'opacity-60 cursor-not-allowed',
        className
      )}
      {...(props as any)}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <motion.span
              className="shrink-0"
              initial={false}
              whileHover={shouldReduceMotion ? {} : { x: 2 }}
              transition={{ duration: MOTION_DURATIONS.hoverFocus, ease: EDITORIAL_EASE }}
            >
              {icon}
            </motion.span>
          )}
        </>
      )}
    </motion.button>
  );
};
