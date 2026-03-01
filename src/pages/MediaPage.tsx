import React, { useState, useEffect, useRef } from 'react';
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
  Share2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { MediaItem } from '../types';
import { Reveal } from '../components/motion/Reveal';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { EDITORIAL_EASE } from '../lib/motion';

interface MediaPageProps {
  mediaItems: MediaItem[];
  onShowToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const MediaPage: React.FC<MediaPageProps> = ({ mediaItems, onShowToast }) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const formats = [
    { id: 'all', label: 'All Media' },
    { id: 'documentary', label: 'Documentaries' },
    { id: 'dialogue', label: 'Technical Dialogues' },
    { id: 'lecture', label: 'Lectures' },
  ];

  const filteredItems = mediaItems.filter((item) => {
    return selectedFormat === 'all' || item.format === selectedFormat;
  });

  const featuredBroadcast = mediaItems.find((m) => m.format === 'documentary') || mediaItems[0];

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImageIndex === null && activeVideo === null) return;

      if (e.key === 'Escape') {
        setLightboxImageIndex(null);
        setActiveVideo(null);
      } else if (lightboxImageIndex !== null) {
        if (e.key === 'ArrowRight') {
          setLightboxImageIndex((prev) => (prev !== null && prev < mediaItems.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowLeft') {
          setLightboxImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : mediaItems.length - 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImageIndex, activeVideo, mediaItems.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <Reveal>
        <div className="max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-blue font-semibold block mb-2">
            Visual &amp; Audio Stories
          </span>
          <h1 className="type-page-headline text-brand-charcoal dark:text-dark-text tracking-tight font-semibold">
            Media &amp; Discussions
          </h1>
          <p className="mt-3 text-base sm:text-lg text-brand-muted dark:text-dark-muted leading-relaxed">
            In-depth visual walkthroughs of our system architecture, recorded technical lectures from our research team, and discussions on what we're learning.
          </p>
        </div>
      </Reveal>

      {/* Featured Cinematic Hero */}
      <Reveal>
        <div className="relative rounded-3xl overflow-hidden border border-brand-stone-dark dark:border-dark-border shadow-editorial bg-brand-charcoal aspect-video sm:aspect-[21/9] group">
          <img
            src={featuredBroadcast.coverImage}
            alt={featuredBroadcast.title}
            className="w-full h-full object-cover opacity-75 group-hover:opacity-85 transition-opacity duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 sm:p-12 flex flex-col justify-end text-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                Featured Film
              </span>
              <span className="text-xs font-mono opacity-90 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {featuredBroadcast.duration}
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-semibold text-white max-w-3xl leading-tight">
              {featuredBroadcast.title}
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed line-clamp-2">
              {featuredBroadcast.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <AnimatedButton
                variant="primary"
                size="md"
                onClick={() => setActiveVideo(featuredBroadcast)}
                icon={<Play className="w-4 h-4 fill-current ml-0.5" />}
              >
                Watch 24-Min Film
              </AnimatedButton>

              <button
                onClick={() => setLightboxImageIndex(0)}
                className="text-xs font-mono text-white/80 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>View Full-Res Artwork</span>
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Format Filtering Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {formats.map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => setSelectedFormat(fmt.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              selectedFormat === fmt.id
                ? 'bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal shadow-sm'
                : 'bg-brand-surface dark:bg-dark-surface text-brand-muted dark:text-dark-muted border border-brand-stone-dark/80 dark:border-dark-border hover:border-brand-charcoal dark:hover:border-white'
            }`}
          >
            {fmt.label}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial hover:shadow-editorial-hover transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative aspect-video overflow-hidden bg-brand-charcoal">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setActiveVideo(item)}
                    className="w-12 h-12 rounded-full bg-white text-brand-charcoal flex items-center justify-center shadow-lg group-hover:scale-108 transition-transform cursor-pointer"
                    aria-label={`Play video: ${item.title}`}
                  >
                    <Play className="w-5 h-5 ml-0.5 fill-current text-brand-charcoal" />
                  </button>
                  <button
                    onClick={() => setLightboxImageIndex(idx)}
                    className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                    aria-label="View photo in lightbox"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 text-white text-[11px] font-mono">
                  {item.duration}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-brand-muted dark:text-dark-muted">
                  <span className="uppercase text-accent-blue font-semibold">{item.format}</span>
                  <span>{item.publishedAt}</span>
                </div>
                <h3 className="text-base font-semibold text-brand-charcoal dark:text-dark-text group-hover:text-accent-blue transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted dark:text-dark-muted line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="px-6 pb-5 pt-3 border-t border-brand-stone-dark/60 dark:border-dark-border flex items-center justify-between text-xs">
              <span className="text-brand-muted truncate max-w-[200px]">
                {item.speaker}
              </span>
              <button
                onClick={() => setActiveVideo(item)}
                className="text-accent-blue font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Watch <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Actual HTML5 Video Modal Player (No simulated controls!) */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
              className="bg-brand-surface dark:bg-dark-surface rounded-3xl overflow-hidden max-w-4xl w-full border border-brand-stone-dark/80 dark:border-dark-border shadow-2xl flex flex-col"
            >
              {/* Modal Top Bar */}
              <div className="px-6 py-4 border-b border-brand-stone-dark/80 dark:border-dark-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-brand-charcoal dark:text-dark-text truncate max-w-md sm:max-w-xl">
                    {activeVideo.title}
                  </h3>
                  <p className="text-xs font-mono text-brand-muted">
                    {activeVideo.speaker} • {activeVideo.duration}
                  </p>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-lg text-brand-muted hover:text-brand-charcoal dark:hover:text-white hover:bg-brand-stone dark:hover:bg-dark-elevated transition-colors cursor-pointer"
                  aria-label="Close video player"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Real HTML5 Video Player */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  poster={activeVideo.coverImage}
                  className="w-full h-full object-contain"
                  src={activeVideo.videoSrc || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                >
                  <source src={activeVideo.videoSrc || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Context & Description */}
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-brand-muted font-semibold mb-1">
                    Discussion Summary
                  </h4>
                  <p className="text-xs sm:text-sm text-brand-charcoal dark:text-dark-text leading-relaxed">
                    {activeVideo.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-stone-dark/80 dark:border-dark-border flex items-center justify-between text-xs">
                  <span className="font-mono text-brand-muted">Format: {activeVideo.format}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      onShowToast('Link Copied', 'Video reference copied to clipboard.', 'success');
                    }}
                    className="text-accent-blue hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share discussion</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full-Screen Image Lightbox with Keyboard Navigation */}
      <AnimatePresence>
        {lightboxImageIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <button
              onClick={() => setLightboxImageIndex(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Button */}
            <button
              onClick={() => setLightboxImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : mediaItems.length - 1))}
              className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer hidden sm:block z-10"
              aria-label="Previous artwork"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={() => setLightboxImageIndex((prev) => (prev !== null && prev < mediaItems.length - 1 ? prev + 1 : 0))}
              className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer hidden sm:block z-10"
              aria-label="Next artwork"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content */}
            <motion.div
              key={lightboxImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl w-full flex flex-col items-center text-center text-white space-y-4"
            >
              <div className="max-h-[75vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <img
                  src={mediaItems[lightboxImageIndex].coverImage}
                  alt={mediaItems[lightboxImageIndex].title}
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>
              <div className="max-w-2xl px-4">
                <h3 className="text-lg font-semibold">{mediaItems[lightboxImageIndex].title}</h3>
                <p className="text-xs text-white/70 mt-1">{mediaItems[lightboxImageIndex].description}</p>
                <p className="text-[11px] font-mono text-white/50 mt-2">
                  Image {lightboxImageIndex + 1} of {mediaItems.length} • Use Arrow Keys to navigate, Esc to close
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
