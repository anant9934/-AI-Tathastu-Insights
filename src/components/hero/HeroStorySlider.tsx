import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Layers, 
  ExternalLink,
  Code2,
  Terminal,
  Activity,
  Cpu,
  Eye,
  GitBranch,
  Lock,
  Maximize2
} from 'lucide-react';
import { 
  MentorMazeConsole, 
  CollaborateConsole, 
  AvsarConsole, 
  IrisConsole 
} from '../products/ProductConsoles';
import { AnimatedButton } from '../motion/AnimatedButton';
import { EDITORIAL_EASE } from '../../lib/motion';

export interface HeroSlide {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  component: React.ReactNode;
  imageUrl: string;
  liveUrl?: string;
  provenanceLabel: string;
  primaryAction: {
    label: string;
    onClick: () => void;
  };
  secondaryAction: {
    label: string;
    onClick: () => void;
  };
  previewBadge: string;
  visualAssetType: string;
}

interface HeroStorySliderProps {
  onExploreProduct: (productId: string) => void;
  onNavigateEngineering: () => void;
  onNavigateResearch: () => void;
}

export const HeroStorySlider: React.FC<HeroStorySliderProps> = ({
  onExploreProduct,
  onNavigateEngineering,
  onNavigateResearch,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'real' | 'sim'>('real');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 7000; // 7 seconds per slide

  const slides: HeroSlide[] = [
    {
      id: 'collaborate',
      number: '01',
      category: 'Distributed Systems • Aegis-BFT (Architecture Spec)',
      title: 'Solving multi-agent state drift with Byzantine consensus.',
      subtitle: 'Targeting linearizable execution across 64 heterogeneous research agents.',
      description: 'When autonomous agents generate code and run benchmarks concurrently, uncoordinated tool calls corrupt shared branches. Collaborate proposes an Aegis-BFT consensus engine in Rust to target atomic, reproducible state commits across distributed agents.',
      component: <CollaborateConsole />,
      imageUrl: '/media/products/collaborate/collaborate-live.png',
      liveUrl: 'https://collaborate.aitathastu.com',
      provenanceLabel: 'Live Product Interface • Rudra Ojha & EORA AI Guide',
      primaryAction: {
        label: 'Explore Collaborate',
        onClick: () => onExploreProduct('collaborate'),
      },
      secondaryAction: {
        label: 'Read Engineering Story',
        onClick: onNavigateEngineering,
      },
      previewBadge: 'Live Platform • 28 Repositories',
      visualAssetType: 'Live Application Screenshot (collaborate.aitathastu.com)',
    },
    {
      id: 'mentormaze',
      number: '02',
      category: 'Research Pedagogy • Triton Kernels (Prototype)',
      title: 'Diagnosing prerequisite lattices for frontier machine learning research.',
      subtitle: 'Socratic debugging interface for CUDA pointer arithmetic and memory strides.',
      description: 'Advanced machine learning moves too fast for static textbooks. MentorMaze models student prerequisite trees and designs an interactive feedback environment for Triton and CUDA kernel engineering.',
      component: <MentorMazeConsole />,
      imageUrl: '/media/products/mentormaze/architecture-spec.svg',
      liveUrl: 'https://aitathastu.info/products/mentormaze',
      provenanceLabel: 'Verified Architecture Specification • AST & gVisor Sandbox',
      primaryAction: {
        label: 'Explore MentorMaze',
        onClick: () => onExploreProduct('mentormaze'),
      },
      secondaryAction: {
        label: 'View Prerequisite DAG',
        onClick: () => onExploreProduct('mentormaze'),
      },
      previewBadge: 'Architecture Spec • AST Sandbox',
      visualAssetType: 'Verified Architectural Specification (Vector SVG)',
    },
    {
      id: 'avsar',
      number: '03',
      category: 'Research Infrastructure • Fellowships (In Development)',
      title: 'Unlocking compute grants through automated benchmark reproduction.',
      subtitle: 'Targeting automated empirical verification to replace 9-month grant committees.',
      description: 'Traditional grants require institutional affiliations and 9-month delays. Avsar is designed to evaluate candidate preprint reproductions automatically on cloud clusters, granting compute credits to independent researchers directly.',
      component: <AvsarConsole />,
      imageUrl: '/media/products/avsar/avsar-live.png',
      liveUrl: 'https://avsar.aitathastu.com',
      provenanceLabel: 'Live Product Interface • Opportunities Discovery Doors',
      primaryAction: {
        label: 'Explore Avsar',
        onClick: () => onExploreProduct('avsar'),
      },
      secondaryAction: {
        label: 'Inspect Benchmark Suite',
        onClick: onNavigateResearch,
      },
      previewBadge: 'Live Platform • Fellowships',
      visualAssetType: 'Live Application Screenshot (avsar.aitathastu.com)',
    },
    {
      id: 'iris',
      number: '04',
      category: 'Embodied Vision • Edge Silicon (In Development)',
      title: 'Continuous 3D spatial occupancy for real-time edge robotics.',
      subtitle: 'Overcoming 2D video frame forgetting with egocentric voxel memory.',
      description: 'Standard 2D vision models forget physical objects when occluded. Iris designs continuous 3D voxel occupancy tensor memory targeting 80+ FPS on embedded silicon such as NVIDIA Jetson Orin AGX for robot manipulators.',
      component: <IrisConsole />,
      imageUrl: '/media/products/iris/architecture-spec.svg',
      liveUrl: 'https://aitathastu.info/products/iris',
      provenanceLabel: 'Verified Architecture Specification • 3D Voxel Memory',
      primaryAction: {
        label: 'Explore Iris',
        onClick: () => onExploreProduct('iris'),
      },
      secondaryAction: {
        label: 'View Robotics Specs',
        onClick: () => onExploreProduct('iris'),
      },
      previewBadge: 'Architecture Spec • Jetson Orin AGX',
      visualAssetType: 'Verified Architectural Specification (Vector SVG)',
    },
  ];

  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex];

  // Auto-advance progress timer
  useEffect(() => {
    if (!isPlaying || shouldReduceMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = 50; // update every 50ms
    const step = (interval / SLIDE_DURATION) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % totalSlides);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex, totalSlides, shouldReduceMotion]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <div 
      className="relative w-full rounded-3xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial overflow-hidden p-6 sm:p-8 lg:p-10"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Top Slider Navigation & Progress Bar Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-brand-stone-dark/60 dark:border-dark-border gap-4">
        {/* Slide Numbers & Active Category */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="font-bold text-accent-blue dark:text-accent-softblue text-sm">
              {currentSlide.number}
            </span>
            <span className="text-brand-muted/40 dark:text-dark-muted/40">/</span>
            <span className="text-brand-muted dark:text-dark-muted">
              0{totalSlides}
            </span>
          </div>

          <span className="w-1.5 h-1.5 rounded-full bg-brand-stone-dark dark:bg-dark-border" />

          <span className="text-xs font-mono font-medium text-brand-muted dark:text-dark-muted">
            {currentSlide.category}
          </span>
        </div>

        {/* Controls: Prev, Next, Play/Pause & Mini Progress Dots */}
        <div className="flex items-center gap-3">
          {/* Progress Bar Container */}
          <div className="w-24 sm:w-36 h-1.5 rounded-full bg-brand-stone dark:bg-dark-elevated overflow-hidden">
            <div 
              className="h-full bg-accent-blue dark:bg-accent-softblue transition-all duration-75 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Pause / Play Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            className="p-1.5 rounded-lg text-brand-muted hover:text-brand-charcoal dark:hover:text-white transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={prevSlide}
              aria-label="Previous featured system"
              className="p-1.5 rounded-lg border border-brand-stone-dark/60 dark:border-dark-border text-brand-charcoal dark:text-white hover:bg-brand-stone dark:hover:bg-dark-elevated transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next featured system"
              className="p-1.5 rounded-lg border border-brand-stone-dark/60 dark:border-dark-border text-brand-charcoal dark:text-white hover:bg-brand-stone dark:hover:bg-dark-elevated transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Cinematic Grid: Asymmetric Active Story & Live Console Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Active Story Narrative */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
              className="space-y-4"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-display font-bold text-brand-charcoal dark:text-dark-text tracking-tight leading-[1.12]">
                {currentSlide.title}
              </h2>

              <p className="text-sm font-sans font-medium text-accent-blue dark:text-accent-softblue">
                {currentSlide.subtitle}
              </p>

              <p className="text-sm text-brand-muted dark:text-dark-muted leading-relaxed font-sans font-normal">
                {currentSlide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <AnimatedButton
              variant="primary"
              size="md"
              onClick={currentSlide.primaryAction.onClick}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {currentSlide.primaryAction.label}
            </AnimatedButton>

            <AnimatedButton
              variant="outline"
              size="md"
              onClick={currentSlide.secondaryAction.onClick}
            >
              {currentSlide.secondaryAction.label}
            </AnimatedButton>
          </div>
        </div>

        {/* Right: Live Authentic Screenshot / Architecture Viewport with Crossfade */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-brand-muted dark:text-dark-muted px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-neutral-900 dark:text-white">
                {viewMode === 'real' ? currentSlide.provenanceLabel : currentSlide.visualAssetType}
              </span>
            </span>

            {/* View Mode Toggle: Real Image (Default) vs Code Simulation */}
            <div className="inline-flex rounded-lg border border-neutral-300 dark:border-neutral-700 p-0.5 bg-neutral-100 dark:bg-neutral-900 text-[11px]">
              <button
                type="button"
                onClick={() => setViewMode('real')}
                className={`px-3 py-1 rounded-md transition-all font-sans ${
                  viewMode === 'real'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                Real Interface
              </button>
              <button
                type="button"
                onClick={() => setViewMode('sim')}
                className={`px-3 py-1 rounded-md transition-all font-sans ${
                  viewMode === 'sim'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                Simulation
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentSlide.id}-${viewMode}`}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
            >
              {viewMode === 'real' ? (
                <div className="rounded-2xl overflow-hidden border border-brand-stone-dark/80 dark:border-dark-border bg-white dark:bg-[#10141D] shadow-xl">
                  {/* Browser Chrome Header */}
                  <div className="px-4 py-2.5 bg-neutral-100/90 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                      <div className="ml-2 flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
                        <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{currentSlide.liveUrl || 'https://aitathastu.info'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentSlide.liveUrl?.includes('aitathastu.com') && (
                        <a
                          href={currentSlide.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[11px] font-mono text-accent-blue hover:underline"
                        >
                          <span>Open Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Real Authentic Image View */}
                  <div className="relative group overflow-hidden bg-neutral-900 aspect-[16/10]">
                    <img
                      src={currentSlide.imageUrl}
                      alt={currentSlide.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 text-white">
                      <span className="text-xs font-mono bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded">
                        {currentSlide.provenanceLabel}
                      </span>
                      {currentSlide.liveUrl && (
                        <a
                          href={currentSlide.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold bg-accent-blue text-white px-3 py-1 rounded shadow-md hover:bg-accent-blue/90 transition-colors flex items-center gap-1"
                        >
                          <span>Visit Live Platform</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                currentSlide.component
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Layered Preview Cards Strip (Inspired by Travel Slider Grammars) */}
      <div className="mt-10 pt-6 border-t border-brand-stone-dark/60 dark:border-dark-border">
        <div className="flex items-center justify-between mb-3 text-xs font-mono text-brand-muted dark:text-dark-muted">
          <span>FEATURED ECOSYSTEM SYSTEMS:</span>
          <span className="hidden sm:inline">CLICK TO INSPECT REAL-TIME CONSOLE</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {slides.map((slide, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                className={`p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer relative overflow-hidden border ${
                  isActive
                    ? 'bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal border-transparent shadow-md ring-2 ring-accent-blue/30'
                    : 'bg-brand-stone/50 dark:bg-dark-elevated text-brand-muted hover:text-brand-charcoal dark:hover:text-white border-brand-stone-dark/60 dark:border-dark-border hover:border-brand-charcoal/30'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5 opacity-70">
                  <span>{slide.number}</span>
                  <span className="truncate">{slide.previewBadge}</span>
                </div>
                <div className="font-display font-semibold text-xs sm:text-sm truncate">
                  {slide.id === 'collaborate' && 'Collaborate'}
                  {slide.id === 'mentormaze' && 'MentorMaze'}
                  {slide.id === 'avsar' && 'Avsar'}
                  {slide.id === 'iris' && 'Iris'}
                </div>
                <div className="text-[10px] opacity-70 truncate mt-0.5 font-sans">
                  {slide.id === 'collaborate' && 'Byzantine Swarm Consensus'}
                  {slide.id === 'mentormaze' && 'Triton Kernel Socratic Sandbox'}
                  {slide.id === 'avsar' && 'Automated Benchmark Grants'}
                  {slide.id === 'iris' && '3D Voxel Spatial Memory'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
