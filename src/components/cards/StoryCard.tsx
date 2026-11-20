import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Clock, Bookmark } from 'lucide-react';
import { Article } from '../../types';
import { Badge } from '../ui/Badge';
import { EDITORIAL_EASE, MOTION_DURATIONS } from '../../lib/motion';
import { formatDate } from '../../lib/utils';

interface StoryCardProps {
  article: Article;
  onSelect: (article: Article) => void;
  featured?: boolean;
  className?: string;
  onBookmark?: (e: React.MouseEvent, article: Article) => void;
  isBookmarked?: boolean;
  variant?: 'standard' | 'compact' | 'horizontal';
}

export const StoryCard: React.FC<StoryCardProps> = ({
  article,
  onSelect,
  featured = false,
  className = '',
  onBookmark,
  isBookmarked = false,
  variant = 'standard',
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Featured Lead Investigation Layout
  if (featured) {
    return (
      <motion.article
        onClick={() => onSelect(article)}
        whileHover={shouldReduceMotion ? {} : { y: -3 }}
        transition={{ duration: MOTION_DURATIONS.cardTransition, ease: EDITORIAL_EASE }}
        className={`group cursor-pointer bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border overflow-hidden shadow-editorial hover:shadow-editorial-hover transition-all grid grid-cols-1 lg:grid-cols-12 gap-0 ${className}`}
      >
        <div className="lg:col-span-7 relative overflow-hidden min-h-[300px] lg:min-h-[420px] aspect-[16/10] lg:aspect-auto">
          <motion.img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover min-h-[300px] lg:min-h-[420px]"
            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
            transition={{ duration: 0.6, ease: EDITORIAL_EASE }}
          />
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Badge accent={article.accentColor} size="sm">
              {article.category}
            </Badge>
            <Badge accent="neutral" size="sm">
              {article.publicationType || 'Lead Investigation'}
            </Badge>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-foundation-secondary dark:text-dark-secondary mb-4 font-mono">
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTimeMinutes} min read
              </span>
              {article.doi && (
                <>
                  <span>•</span>
                  <span className="text-[11px] truncate max-w-[130px] opacity-80">{article.doi}</span>
                </>
              )}
            </div>

            <h3 className="type-article-title text-foundation-ink dark:text-dark-ink group-hover:text-accent-violet transition-colors">
              {article.title}
            </h3>

            <p className="mt-3 type-secondary line-clamp-3">
              {article.subtitle}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-foundation-border dark:border-dark-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-10 h-10 rounded-full object-cover border border-foundation-border"
              />
              <div>
                <p className="text-xs font-semibold text-foundation-ink dark:text-dark-ink">
                  {article.author.name}
                </p>
                <p className="text-[11px] text-foundation-secondary dark:text-dark-secondary">
                  {article.author.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onBookmark && (
                <button
                  type="button"
                  onClick={(e) => onBookmark(e, article)}
                  className={`p-2 rounded-xl border transition-colors ${
                    isBookmarked
                      ? 'bg-accent-lavender text-accent-violet border-accent-violet/30'
                      : 'border-foundation-border text-foundation-secondary hover:text-foundation-ink hover:bg-foundation-paper dark:border-dark-border dark:hover:bg-white/5'
                  }`}
                  aria-label="Bookmark story"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              )}
              <motion.div
                className="w-9 h-9 rounded-xl bg-foundation-ink text-foundation-paper dark:bg-white dark:text-foundation-ink flex items-center justify-center shrink-0 group-hover:bg-accent-violet group-hover:text-white transition-colors"
                whileHover={shouldReduceMotion ? {} : { x: 2 }}
                transition={{ duration: MOTION_DURATIONS.hoverFocus, ease: EDITORIAL_EASE }}
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // Horizontal Card Variant for varied layouts (Section 4.A: Varied editorial content layouts)
  if (variant === 'horizontal') {
    return (
      <motion.article
        onClick={() => onSelect(article)}
        whileHover={shouldReduceMotion ? {} : { y: -2 }}
        transition={{ duration: MOTION_DURATIONS.cardTransition, ease: EDITORIAL_EASE }}
        className={`group cursor-pointer bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border p-5 shadow-editorial hover:shadow-editorial-hover transition-all flex flex-col sm:flex-row gap-5 items-start justify-between ${className}`}
      >
        <div className="relative overflow-hidden rounded-xl aspect-[16/10] sm:aspect-square w-full sm:w-36 shrink-0">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2">
            <Badge accent={article.accentColor} size="xs">
              {article.publicationType || 'Report'}
            </Badge>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-foundation-secondary dark:text-dark-secondary mb-1.5">
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{article.readingTimeMinutes}m read</span>
            </div>
            <h3 className="type-card-heading text-foundation-ink dark:text-dark-ink group-hover:text-accent-violet transition-colors">
              {article.title}
            </h3>
            <p className="mt-1.5 text-xs text-foundation-secondary dark:text-dark-secondary line-clamp-2 leading-relaxed">
              {article.subtitle}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-foundation-border/60 dark:border-dark-border flex items-center justify-between text-xs">
            <span className="font-medium text-foundation-ink dark:text-dark-ink truncate">
              By {article.author.name}
            </span>
            <span className="text-accent-violet font-medium flex items-center gap-1 group-hover:underline">
              Read <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </motion.article>
    );
  }

  // Standard Card Layout
  return (
    <motion.article
      onClick={() => onSelect(article)}
      whileHover={shouldReduceMotion ? {} : { y: -3 }}
      transition={{ duration: MOTION_DURATIONS.cardTransition, ease: EDITORIAL_EASE }}
      className={`group cursor-pointer bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border overflow-hidden shadow-editorial hover:shadow-editorial-hover transition-all flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="relative overflow-hidden aspect-[16/10]">
          <motion.img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
            whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
            transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
          />
          <div className="absolute top-3 left-3 z-10 flex gap-1.5">
            <Badge accent={article.accentColor} size="sm">
              {article.category}
            </Badge>
            {article.publicationType && (
              <Badge accent="neutral" size="xs">
                {article.publicationType}
              </Badge>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-mono text-foundation-secondary dark:text-dark-secondary mb-2.5">
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readingTimeMinutes}m read
            </span>
          </div>

          <h3 className="type-card-heading text-foundation-ink dark:text-dark-ink group-hover:text-accent-violet transition-colors">
            {article.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-foundation-secondary dark:text-dark-secondary leading-relaxed line-clamp-2">
            {article.subtitle}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 border-t border-foundation-border dark:border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-7 h-7 rounded-full object-cover border border-foundation-border shrink-0"
          />
          <div className="min-w-0">
            <span className="text-xs font-medium text-foundation-ink dark:text-dark-ink block truncate">
              {article.author.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onBookmark && (
            <button
              type="button"
              onClick={(e) => onBookmark(e, article)}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-accent-violet bg-accent-lavender/40'
                  : 'text-foundation-secondary hover:text-foundation-ink dark:hover:text-dark-ink'
              }`}
              aria-label="Bookmark story"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          )}
          <motion.div
            className="p-1.5 rounded-lg text-foundation-secondary group-hover:text-accent-violet transition-colors"
            whileHover={shouldReduceMotion ? {} : { x: 2 }}
            transition={{ duration: MOTION_DURATIONS.hoverFocus, ease: EDITORIAL_EASE }}
          >
            <ArrowUpRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};
