import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  Play, 
  Pause, 
  Headphones, 
  Video, 
  Clock, 
  Sparkles, 
  Volume2, 
  Radio, 
  Maximize2,
  X
} from 'lucide-react';
import { MediaItem } from '../types';
import { MediaCard } from '../components/cards/MediaCard';
import { MotionModal } from '../components/motion/MotionModal';
import { Badge } from '../components/ui/Badge';
import { Reveal } from '../components/motion/Reveal';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { EDITORIAL_EASE } from '../lib/motion';

interface MediaPageProps {
  mediaItems: MediaItem[];
  onShowToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const MediaPage: React.FC<MediaPageProps> = ({ mediaItems, onShowToast }) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(34); // simulated 34%
  const shouldReduceMotion = useReducedMotion();

  const formats = [
    { id: 'all', label: 'All Broadcasts' },
    { id: 'documentary', label: 'Video Documentaries' },
    { id: 'dialogue', label: 'Tathastu Dialogues' },
    { id: 'lecture', label: 'Technical Lectures' },
  ];

  const filteredItems = mediaItems.filter((item) => {
    return selectedFormat === 'all' || item.format === selectedFormat;
  });

  const featuredBroadcast = mediaItems.find((m) => m.format === 'documentary') || mediaItems[0];

  const handlePlayMedia = (item: MediaItem) => {
    setActiveMedia(item);
    if (item.format === 'dialogue') {
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <Reveal>
        <div className="max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-accent-violet block mb-2">
            Audiovisual Research Series
          </span>
          <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
            Documentaries &amp; Dialogues
          </h1>
          <p className="mt-4 text-base sm:text-lg text-foundation-muted dark:text-dark-muted leading-relaxed">
            In-depth visual walkthroughs of neural circuit mechanics, long-form technical discussions with research authors, and recorded symposium lectures.
          </p>
        </div>
      </Reveal>

      {/* Featured Video Feature (Phase 4.F item 1 & 2) */}
      <Reveal>
        <div className="relative rounded-3xl overflow-hidden border border-foundation-charcoal/10 dark:border-dark-border shadow-2xl bg-black aspect-video sm:aspect-[21/9] group">
          <img
            src={featuredBroadcast.coverImage}
            alt={featuredBroadcast.title}
            className="w-full h-full object-cover opacity-75 group-hover:opacity-85 transition-opacity"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 sm:p-10 flex flex-col justify-end text-white">
            <div className="flex items-center gap-3 mb-3">
              <Badge accent="violet" size="sm">
                Featured Documentary
              </Badge>
              <span className="text-xs font-mono opacity-80 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {featuredBroadcast.duration}
              </span>
            </div>

            <h2 className="font-editorial-serif text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight max-w-3xl leading-tight">
              {featuredBroadcast.title}
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed line-clamp-2">
              {featuredBroadcast.description}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <AnimatedButton
                variant="accent"
                size="md"
                onClick={() => handlePlayMedia(featuredBroadcast)}
                icon={<Play className="w-4 h-4 fill-current ml-0.5" />}
              >
                Watch 24-Min Film
              </AnimatedButton>

              <span className="text-xs font-mono text-white/60">
                With {featuredBroadcast.speaker}
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Format Filtering Pills (Phase 4.F item 4) */}
      <div className="flex items-center justify-between border-b border-foundation-charcoal/10 dark:border-dark-border pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {formats.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedFormat === fmt.id
                  ? 'bg-foundation-charcoal text-white dark:bg-white dark:text-foundation-charcoal'
                  : 'bg-white dark:bg-dark-surface text-foundation-muted hover:text-foundation-charcoal dark:hover:text-dark-text border border-foundation-charcoal/10 dark:border-dark-border'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-foundation-muted dark:text-dark-muted hidden sm:inline">
          {filteredItems.length} episodes
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            onPlay={handlePlayMedia}
          />
        ))}
      </div>

      {/* Persistent Audio Dialogue Player simulation for podcasts */}
      {isPlayingAudio && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          className="fixed bottom-6 left-4 right-4 max-w-3xl mx-auto p-4 rounded-2xl bg-foundation-charcoal text-white dark:bg-dark-surface dark:text-dark-text border border-white/10 dark:border-dark-border shadow-2xl z-40 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-accent-violet flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-accent-lavender uppercase block truncate">
                Now Playing • Tathastu Dialogues
              </span>
              <p className="text-xs sm:text-sm font-medium truncate">
                {activeMedia?.title || 'Episode #14: The Geometry of Latency in Agent Swarms'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="w-9 h-9 rounded-full bg-white text-foundation-charcoal flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Pause or play audio"
            >
              {isPlayingAudio ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
            <button
              onClick={() => setIsPlayingAudio(false)}
              className="text-white/60 hover:text-white p-1"
              aria-label="Close audio player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* 3. Smooth Video Modal Player (Phase 4.F item 3) */}
      <MotionModal
        isOpen={activeMedia !== null}
        onClose={() => setActiveMedia(null)}
        title={activeMedia?.title}
        subtitle={`${activeMedia?.speaker} • ${activeMedia?.duration}`}
        maxWidth="2xl"
      >
        {activeMedia && (
          <div className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
              <img
                src={activeMedia.coverImage}
                alt={activeMedia.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-6 text-center text-white">
                <div className="w-16 h-16 rounded-full bg-accent-violet flex items-center justify-center shadow-lg mb-3">
                  <Play className="w-7 h-7 ml-1 fill-current text-white" />
                </div>
                <p className="text-sm font-medium">Broadcast Stream Ready</p>
                <p className="text-xs text-white/70 mt-1 max-w-sm">
                  Full 4K editorial lecture stream encoded with synchronized timestamp notes.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-foundation-ivory dark:bg-dark-elevated text-xs text-foundation-muted dark:text-dark-muted leading-relaxed">
              <span className="font-medium text-foundation-charcoal dark:text-dark-text block mb-1">
                Transcript Summary:
              </span>
              {activeMedia.description}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <AnimatedButton
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  onShowToast('Episode Link Copied', 'Ready to share.', 'success');
                }}
              >
                Copy Timestamp Link
              </AnimatedButton>
              <AnimatedButton
                variant="primary"
                size="sm"
                onClick={() => {
                  onShowToast('Beginning Stream Playback', activeMedia.title, 'info');
                  setActiveMedia(null);
                }}
              >
                Start Fullscreen
              </AnimatedButton>
            </div>
          </div>
        )}
      </MotionModal>
    </div>
  );
};
