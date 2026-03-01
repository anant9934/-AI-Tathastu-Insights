import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, GraduationCap, Users, Award, Eye, CheckCircle2, ChevronRight } from 'lucide-react';
import { EcosystemProduct } from '../../types';
import { EDITORIAL_EASE } from '../../lib/motion';

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
        return <GraduationCap className="w-5 h-5 text-accent-blue" />;
      case 'collaborate':
        return <Users className="w-5 h-5 text-accent-blue" />;
      case 'avsar':
        return <Award className="w-5 h-5 text-accent-terracotta" />;
      case 'iris':
        return <Eye className="w-5 h-5 text-accent-sage" />;
      default:
        return <GraduationCap className="w-5 h-5 text-accent-blue" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Live Platform':
        return 'bg-accent-softmint text-accent-sage dark:bg-accent-sage/20 dark:text-green-300';
      case 'Beta Lab':
        return 'bg-accent-softblue text-accent-blue dark:bg-accent-blue/20 dark:text-blue-300';
      case 'Frontier Preview':
        return 'bg-accent-peach text-accent-terracotta dark:bg-accent-terracotta/20 dark:text-orange-300';
      default:
        return 'bg-brand-stone text-brand-muted dark:bg-dark-elevated dark:text-dark-muted';
    }
  };

  return (
    <motion.div
      onClick={() => onExplore(product)}
      whileHover={shouldReduceMotion ? {} : { y: -3 }}
      transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
      className={`group cursor-pointer bg-brand-surface dark:bg-dark-surface rounded-2xl border border-brand-stone-dark/80 dark:border-dark-border p-6 shadow-editorial hover:shadow-editorial-hover hover:border-brand-charcoal/30 dark:hover:border-white/30 transition-all flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header: Icon, Name & Status */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-stone dark:bg-dark-elevated flex items-center justify-center shrink-0">
              {getProductIcon()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl font-semibold text-brand-charcoal dark:text-dark-text tracking-tight group-hover:text-accent-blue transition-colors">
                  {product.name}
                </h3>
                <span className="text-[11px] font-mono text-brand-muted">
                  {product.version}
                </span>
              </div>
              <p className="text-xs text-brand-muted dark:text-dark-muted">
                {product.badge}
              </p>
            </div>
          </div>

          <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeColor(product.status)}`}>
            {product.status}
          </span>
        </div>

        {/* Product Image / Interface Thumbnail */}
        {product.coverImage && (
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] mb-4 bg-brand-stone dark:bg-dark-elevated border border-brand-stone-dark/50 dark:border-dark-border">
            <img
              src={product.coverImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-editorial"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] font-medium truncate drop-shadow">
              {product.tagline}
            </div>
          </div>
        )}

        {/* Problem Statement Preview */}
        <div className="mb-3 p-3 rounded-xl bg-brand-stone/60 dark:bg-dark-elevated/60 text-xs">
          <span className="font-semibold text-brand-charcoal dark:text-dark-text block mb-0.5">
            Problem addressed:
          </span>
          <p className="text-brand-muted dark:text-dark-muted line-clamp-2 leading-relaxed">
            {product.problem}
          </p>
        </div>

        {/* What It Does */}
        <p className="text-xs sm:text-sm text-brand-charcoal/90 dark:text-dark-text/90 leading-relaxed line-clamp-2">
          {product.overview || product.description}
        </p>

        {/* Stats Preview */}
        {product.stats && product.stats.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-brand-stone-dark/60 dark:border-dark-border text-xs">
            {product.stats.slice(0, 2).map((st) => (
              <div key={st.label}>
                <span className="block text-[11px] text-brand-muted dark:text-dark-muted truncate">
                  {st.label}
                </span>
                <span className="block font-semibold font-mono text-sm text-brand-charcoal dark:text-dark-text">
                  {st.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer Action */}
      <div className="pt-4 mt-4 border-t border-brand-stone-dark/60 dark:border-dark-border flex items-center justify-between text-xs font-medium text-accent-blue group-hover:text-brand-charcoal dark:group-hover:text-white transition-colors">
        <span>View product details</span>
        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </motion.div>
  );
};
