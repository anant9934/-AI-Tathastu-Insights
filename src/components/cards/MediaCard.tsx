import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Play, Headphones, Video, Clock } from 'lucide-react';
import { MediaItem } from '../../types';
import { Badge } from '../ui/Badge';
import { EDITORIAL_EASE, MOTION_DURATIONS } from '../../lib/motion';

interface MediaCardProps {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
  className?: string;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onPlay, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  const getFormatIcon = () => {
    switch (item.format) {
      case 'documentary':
        return <Video className="w-3.5 h-3.5" />;
      case 'dialogue':
        return <Headphones className="w-3.5 h-3.5" />;
      case 'lecture':
        return <Video className="w-3.5 h-3.5" />;
    }
  };

  return (
    <motion.article
      onClick={() => onPlay(item)}
      whileHover={shouldReduceMotion ? {} : { y: -3 }}
      transition={{ duration: MOTION_DURATIONS.cardTransition, ease: EDITORIAL_EASE }}
      className={`group cursor-pointer bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border overflow-hidden shadow-editorial hover:shadow-editorial-hover transition-shadow flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Thumbnail with Play Overlay */}
        <div className="relative aspect-video overflow-hidden">
          <motion.img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-full object-cover"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            transition={{ duration: 0.5, ease: EDITORIAL_EASE }}
            loading="lazy"
          />

          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors flex items-center justify-center">
            <motion.div
              className="w-12 h-12 rounded-full bg-white/90 dark:bg-foundation-charcoal/90 backdrop-blur text-foundation-charcoal dark:text-white flex items-center justify-center shadow-lg"
              whileHover={shouldReduceMotion ? {} : { scale: 1.12 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
              transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
            >
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            </motion.div>
          </div>

          <div className="absolute top-3 left-3 flex gap-2">
            <Badge accent="neutral" size="xs" icon={getFormatIcon()}>
              {item.format.toUpperCase()}
            </Badge>
          </div>

          <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/75 backdrop-blur text-white font-mono text-[11px] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {item.duration}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <span className="text-[11px] font-mono text-accent-violet uppercase tracking-wider block mb-1">
            {item.category}
          </span>

          <h3 className="font-editorial-serif text-xl sm:text-2xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal group-hover:text-accent-violet transition-colors line-clamp-2">
            {item.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-foundation-muted dark:text-dark-muted leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 border-t border-foundation-charcoal/5 dark:border-dark-border flex items-center justify-between text-xs text-foundation-muted dark:text-dark-muted">
        <div>
          <p className="font-medium text-foundation-charcoal dark:text-dark-text">
            {item.speaker}
          </p>
          <p className="text-[11px]">{item.speakerRole}</p>
        </div>

        <span className="text-accent-violet font-medium text-xs group-hover:underline">
          {item.format === 'dialogue' ? 'Listen Episode' : 'Watch Feature'}
        </span>
      </div>
    </motion.article>
  );
};
