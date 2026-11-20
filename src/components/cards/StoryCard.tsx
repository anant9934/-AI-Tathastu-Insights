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
}

export const StoryCard: React.FC<StoryCardProps> = ({
  article,
  onSelect,
  featured = false,
  className = '',
  onBookmark,
  isBookmarked = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (featured) {
    return (
      <motion.article
        onClick={() => onSelect(article)}
        whileHover={shouldReduceMotion ? {} : { y: -4 }}
        transition={{ duration: MOTION_DURATIONS.cardTransition, ease: EDITORIAL_EASE }}
        className={`group cursor-pointer bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border overflow-hidden shadow-editorial hover:shadow-editorial-hover transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-0 ${className}`}
      >
        <div className="lg:col-span-7 relative overflow-hidden aspect-[16/10] lg:aspect-auto">
          <motion.img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
            whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
            transition={{ duration: 0.6, ease: EDITORIAL_EASE }}
            loading="lazy"
          />
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Badge accent={article.accentColor} size="sm">
              {article.category}
            </Badge>
            <Badge accent="neutral" size="sm">
              Lead Investigation
            </Badge>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-foundation-muted dark:text-dark-muted mb-4 font-mono">
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTimeMinutes} min read
              </span>
              {article.doi && (
                <>
                  <span>•</span>
                  <span className="text-[11px] truncate max-w-[120px]">{article.doi}</span>
                </>
              )}
            </div>

            <h3 className="font-editorial-serif text-2xl sm:text-3xl lg:text-4xl leading-[1.15] text-foundation-charcoal dark:text-dark-text tracking-tight font-normal group-hover:text-accent-violet transition-colors">
              {article.title}
            </h3>

            <p className="mt-3 text-sm sm:text-base text-foundation-muted dark:text-dark-muted leading-relaxed line-clamp-3">
              {article.subtitle}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-foundation-charcoal/5 dark:border-dark-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-9 h-9 rounded-full object-cover border border-foundation-charcoal/10"
              />
              <div>
                <p className="text-xs font-medium text-foundation-charcoal dark:text-dark-text">
                  {article.author.name}
                </p>
                <p className="text-[11px] text-foundation-muted dark:text-dark-muted">
                  {article.author.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onBookmark && (
                <button
                  type="button"
                  onClick={(e) => onBookmark(e, article)}
                  className={`p-2 rounded-lg border transition-colors ${
                    isBookmarked
                      ? 'bg-accent-lavender text-accent-violet border-accent-violet/30'
                      : 'border-foundation-charcoal/10 text-foundation-muted hover:text-foundation-charcoal hover:bg-foundation-charcoal/5 dark:border-dark-border dark:hover:bg-white/5'
                  }`}
                  aria-label="Bookmark story"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              )}
              <motion.div
                className="w-9 h-9 rounded-xl bg-foundation-charcoal text-white dark:bg-white dark:text-foundation-charcoal flex items-center justify-center shrink-0"
                whileHover={shouldReduceMotion ? {} : { x: 3 }}
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

  // Standard Card Layout
  return (
    <motion.article
      onClick={() => onSelect(article)}
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      transition={{ duration: MOTION_DURATIONS.cardTransition, ease: EDITORIAL_EASE }}
      className={`group cursor-pointer bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border overflow-hidden shadow-editorial hover:shadow-editorial-hover transition-shadow flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="relative overflow-hidden aspect-[16/10]">
          <motion.img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
            loading="lazy"
          />
          <div className="absolute top-3 left-3 z-10">
            <Badge accent={article.accentColor} size="sm">
              {article.topicTag}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-[11px] text-foundation-muted dark:text-dark-muted font-mono mb-2.5">
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readingTimeMinutes}m
            </span>
          </div>

          <h3 className="font-editorial-serif text-xl sm:text-2xl leading-snug text-foundation-charcoal dark:text-dark-text tracking-tight font-normal group-hover:text-accent-violet transition-colors">
            {article.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-foundation-muted dark:text-dark-muted leading-relaxed line-clamp-2">
            {article.subtitle}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 border-t border-foundation-charcoal/5 dark:border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-7 h-7 rounded-full object-cover border border-foundation-charcoal/10 shrink-0"
          />
          <span className="text-xs font-medium text-foundation-charcoal dark:text-dark-text truncate">
            {article.author.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onBookmark && (
            <button
              type="button"
              onClick={(e) => onBookmark(e, article)}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-accent-violet'
                  : 'text-foundation-muted hover:text-foundation-charcoal dark:hover:text-dark-text'
              }`}
              aria-label="Bookmark"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          )}
          <motion.div
            className="p-1.5 rounded-lg text-foundation-muted group-hover:text-accent-violet transition-colors"
            whileHover={shouldReduceMotion ? {} : { x: 3 }}
            transition={{ duration: MOTION_DURATIONS.hoverFocus, ease: EDITORIAL_EASE }}
          >
            <ArrowUpRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};
