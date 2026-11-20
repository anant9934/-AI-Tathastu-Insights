import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, GraduationCap, Users, Award, Eye, CheckCircle2 } from 'lucide-react';
import { EcosystemProduct } from '../../types';
import { Badge } from '../ui/Badge';
import { EDITORIAL_EASE, MOTION_DURATIONS } from '../../lib/motion';

interface EcosystemCardProps {
  product: EcosystemProduct;
  onExplore: (product: EcosystemProduct) => void;
  className?: string;
}

export const EcosystemCard: React.FC<EcosystemCardProps> = ({
  product,
  onExplore,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const getProductIcon = () => {
    switch (product.id) {
      case 'mentormaze':
        return <GraduationCap className="w-5 h-5 text-accent-violet" />;
      case 'collaborate':
        return <Users className="w-5 h-5 text-[#205493]" />;
      case 'avsar':
        return <Award className="w-5 h-5 text-[#C2410C]" />;
      case 'iris':
        return <Eye className="w-5 h-5 text-[#166534]" />;
    }
  };

  return (
    <motion.div
      onClick={() => onExplore(product)}
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      transition={{ duration: MOTION_DURATIONS.cardTransition, ease: EDITORIAL_EASE }}
      className={`group cursor-pointer bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border p-6 sm:p-8 shadow-editorial hover:shadow-editorial-hover transition-all flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-foundation-ivory dark:bg-dark-elevated border border-foundation-charcoal/5 dark:border-dark-border flex items-center justify-center shrink-0"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {getProductIcon()}
            </motion.div>
            <div>
              <h3 className="font-editorial-serif text-2xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
                {product.name}
              </h3>
              <p className="text-[11px] font-mono text-foundation-muted dark:text-dark-muted">
                {product.badge}
              </p>
            </div>
          </div>

          <Badge accent={product.accentColor} size="xs">
            Live Platform
          </Badge>
        </div>

        <p className="text-sm font-medium text-foundation-charcoal/90 dark:text-dark-text/90 leading-snug">
          {product.tagline}
        </p>

        <p className="mt-3 text-xs sm:text-sm text-foundation-muted dark:text-dark-muted leading-relaxed line-clamp-3">
          {product.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 my-6 pt-4 border-t border-foundation-charcoal/5 dark:border-dark-border">
          {product.stats.slice(0, 2).map((stat) => (
            <div key={stat.label} className="bg-foundation-ivory dark:bg-dark-elevated p-3 rounded-xl">
              <span className="block text-lg font-mono font-semibold text-foundation-charcoal dark:text-dark-text">
                {stat.value}
              </span>
              <span className="text-[11px] text-foundation-muted dark:text-dark-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Core Capabilities */}
        <div className="space-y-2">
          {product.coreCapabilities.slice(0, 2).map((cap, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-foundation-charcoal/80 dark:text-dark-text/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-violet shrink-0 mt-0.5" />
              <span className="truncate">{cap.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-foundation-charcoal/5 dark:border-dark-border flex items-center justify-between">
        <span className="text-xs font-medium text-accent-violet group-hover:underline flex items-center gap-1">
          Explore Product Architecture
        </span>

        <motion.div
          className="w-8 h-8 rounded-lg bg-foundation-charcoal/5 dark:bg-white/5 flex items-center justify-center text-foundation-charcoal dark:text-dark-text group-hover:bg-accent-violet group-hover:text-white transition-colors"
          whileHover={shouldReduceMotion ? {} : { x: 2 }}
          transition={{ duration: MOTION_DURATIONS.hoverFocus, ease: EDITORIAL_EASE }}
        >
          <ArrowUpRight className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  );
};
