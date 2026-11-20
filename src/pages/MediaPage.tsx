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
  X,
  FileText,
  Share2
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <Reveal>
        <div className="max-w-3xl">
          <span className="type-meta text-accent-violet block uppercase mb-2">
            Audiovisual Research Channel
          </span>
          <h1 className="type-page-headline text-foundation-ink dark:text-dark-ink font-normal">
            Documentaries &amp; Dialogues
          </h1>
          <p className="type-body text-foundation-secondary dark:text-dark-secondary mt-3 leading-relaxed">
            In-depth visual walkthroughs of neural circuit mechanics, long-form technical discussions with research authors, and recorded symposium lectures.
          </p>
        </div>
      </Reveal>

      {/* Cinematic Featured Documentary Hero (Section 4.E) */}
      <Reveal>
        <div className="relative rounded-3xl overflow-hidden border border-foundation-border dark:border-dark-border shadow-2xl bg-foundation-ink aspect-video sm:aspect-[21/9] group">
          <img
            src={featuredBroadcast.coverImage}
            alt={featuredBroadcast.title}
            className="w-full h-full object-cover opacity-75 group-hover:opacity-85 transition-opacity duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-foundation-ink via-foundation-ink/50 to-transparent p-6 sm:p-12 flex flex-col justify-end text-white">
            <div className="flex items-center gap-3 mb-3">
              <Badge accent="violet" size="sm">
                Featured Documentary
              </Badge>
              <span className="type-meta opacity-90 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {featuredBroadcast.duration}
              </span>
            </div>

            <h2 className="type-article-title font-medium text-white max-w-4xl leading-tight">
              {featuredBroadcast.title}
            </h2>

            <p className="mt-3 text-xs sm:text-base text-white/80 max-w-2xl leading-relaxed line-clamp-2">
              {featuredBroadcast.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <AnimatedButton
                variant="accent"
                size="md"
                onClick={() => handlePlayMedia(featuredBroadcast)}
                icon={<Play className="w-4 h-4 fill-current ml-0.5" />}
              >
                Watch 24-Min Film
              </AnimatedButton>

              <span className="type-meta text-white/70">
                Featuring {featuredBroadcast.speaker} ({featuredBroadcast.speakerRole})
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Format Filtering Pills */}
      <div className="flex items-center justify-between border-b border-foundation-border dark:border-dark-border pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {formats.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedFormat === fmt.id
                  ? 'bg-foundation-ink text-foundation-paper dark:bg-white dark:text-foundation-ink'
                  : 'bg-white dark:bg-dark-surface text-foundation-secondary hover:text-foundation-ink border border-foundation-border dark:border-dark-border'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
        <span className="type-meta text-foundation-secondary dark:text-dark-secondary hidden sm:inline">
          {filteredItems.length} episodes archived
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

      {/* Interactive Audio Scrubber Bar for Podcasts (Section 4.E) */}
      {isPlayingAudio && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          className="fixed bottom-6 left-4 right-4 max-w-4xl mx-auto p-4 rounded-2xl bg-foundation-ink text-foundation-paper dark:bg-dark-surface dark:text-dark-ink border border-white/10 dark:border-dark-border shadow-2xl z-40 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-accent-violet flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="type-meta text-accent-lavender uppercase block truncate">
                Tathastu Dialogues • Episode Stream
              </span>
              <p className="text-xs sm:text-sm font-medium truncate">
                {activeMedia?.title || 'Tathastu Dialogues #14: The Geometry of Latency in Agent Swarms'}
              </p>
            </div>
          </div>

          {/* Scrubber Progress Slider */}
          <div className="w-full sm:w-64 flex items-center gap-2 text-xs font-mono">
            <span>16:24</span>
            <input
              type="range"
              min={0}
              max={100}
              value={audioProgress}
              onChange={(e) => setAudioProgress(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-accent-violet"
            />
            <span>48:32</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="w-9 h-9 rounded-full bg-white text-foundation-ink flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              aria-label="Pause or play podcast"
            >
              {isPlayingAudio ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
            <button
              onClick={() => setIsPlayingAudio(false)}
              className="text-white/60 hover:text-white p-1 cursor-pointer"
              aria-label="Close audio player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Video Stream Modal with Synchronized Transcript Notes */}
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
                <p className="text-sm font-semibold">4K Master Lecture Stream</p>
                <p className="type-meta text-white/70 mt-1 max-w-sm">
                  Synchronized slides and code bookmarks active.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-foundation-paper dark:bg-dark-elevated type-secondary text-xs leading-relaxed border border-foundation-border/70 dark:border-dark-border">
              <span className="font-semibold text-foundation-ink dark:text-dark-ink block mb-1">
                Transcript &amp; Abstract:
              </span>
              {activeMedia.description}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <AnimatedButton
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  onShowToast('Timestamp Link Copied', 'Episode URL ready to share.', 'success');
                }}
                icon={<Share2 className="w-3.5 h-3.5" />}
              >
                Copy Link
              </AnimatedButton>
              <AnimatedButton
                variant="primary"
                size="sm"
                onClick={() => {
                  onShowToast('Stream Initialized', activeMedia.title, 'info');
                  setActiveMedia(null);
                }}
              >
                Play in Fullscreen
              </AnimatedButton>
            </div>
          </div>
        )}
      </MotionModal>
    </div>
  );
};
