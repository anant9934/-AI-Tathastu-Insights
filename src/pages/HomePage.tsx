import React, { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowUpRight, 
  BookOpen, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Check, 
  Download, 
  Copy, 
  Play, 
  Volume2, 
  Quote, 
  GraduationCap, 
  Users, 
  Award, 
  Eye, 
  FileText, 
  Bookmark, 
  ExternalLink, 
  Lock, 
  Scale, 
  RefreshCw, 
  X,
  Compass,
  Cpu,
  Shield,
  Activity,
  Code2
} from 'lucide-react';
import { Article, ResearchPaper, EcosystemProduct, PerspectiveItem, MediaItem } from '../types';
import { StoryCard } from '../components/cards/StoryCard';
import { ResearchCard } from '../components/cards/ResearchCard';
import { AnimatedChart } from '../components/motion/AnimatedChart';
import { Reveal } from '../components/motion/Reveal';
import { StaggerContainer, StaggerItem } from '../components/motion/StaggerContainer';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { Badge } from '../components/ui/Badge';
import { NavTab } from '../components/layout/Navbar';
import { mockPerspectives, mockMediaItems } from '../lib/mockData';
import { EDITORIAL_EASE, MOTION_DURATIONS, heroImageVariants } from '../lib/motion';
import { api } from '../lib/api';

interface HomePageProps {
  articles: Article[];
  papers: ResearchPaper[];
  ecosystemProducts: EcosystemProduct[];
  onSelectArticle: (article: Article) => void;
  onNavigate: (tab: NavTab) => void;
  onDownloadPaper: (paper: ResearchPaper) => void;
  onCopyBibtex: (paper: ResearchPaper) => void;
  onExploreEcosystem: (product: EcosystemProduct) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (e: React.MouseEvent, article: Article) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  articles,
  papers,
  ecosystemProducts,
  onSelectArticle,
  onNavigate,
  onDownloadPaper,
  onCopyBibtex,
  onExploreEcosystem,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');
  const [selectedPerspective, setSelectedPerspective] = useState<PerspectiveItem | null>(null);
  const [activeMediaItem, setActiveMediaItem] = useState<MediaItem | null>(null);
  const [copiedBibtexId, setCopiedBibtexId] = useState<string | null>(null);

  const shouldReduceMotion = useReducedMotion();

  // Selected Lead & Secondary Articles
  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];
  const secondaryArticles = articles.filter((a) => a.id !== featuredArticle.id);
  const featuredPaper = papers[0];

  // Research Spotlight Chart Data (Empirical SAE Feature Purity)
  const chartData = {
    title: 'Monosemantic Feature Purity vs Latent Dictionary Size',
    subtitle: 'Evaluation on Layer 28 residual stream across expansion factors (4x to 64x) on 70B parameter dense model',
    xAxisLabel: 'Expansion Factor (Dictionary Size)',
    yAxisLabel: 'Feature Purity (%)',
    primaryDatasetLabel: 'Tathastu Top-K SAE',
    baselineDatasetLabel: 'Standard Gated SAE',
    unit: '%',
    points: [
      { label: '4x (16k)', value: 68.4, baseline: 52.1 },
      { label: '8x (32k)', value: 79.2, baseline: 58.4 },
      { label: '16x (65k)', value: 88.6, baseline: 64.2 },
      { label: '32x (131k)', value: 93.1, baseline: 69.8 },
      { label: '64x (262k)', value: 95.8, baseline: 71.5 },
    ],
  };

  const handleCopyBibtex = (e: React.MouseEvent, paper: ResearchPaper) => {
    e.stopPropagation();
    onCopyBibtex(paper);
    setCopiedBibtexId(paper.id);
    setTimeout(() => setCopiedBibtexId(null), 2500);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError('Please provide a valid research or institutional email.');
      return;
    }
    setNewsletterError('');
    try {
      await api.newsletter.subscribe(newsletterEmail);
    } catch {
      // Graceful fallback
    }
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubscribed(false);
    }, 4500);
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* =========================================================================
          SECTION 2 — HERO SECTION (Asymmetric Editorial Layout)
          ========================================================================= */}
      <section className="relative pt-6 sm:pt-14 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Deliberate Editorial Headline & Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-lavender text-accent-violet dark:bg-accent-violet/20 dark:text-accent-lavender text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Volume 4 • Fall/Winter 2026 Series</span>
              </div>

              {/* Exact Requested Headline */}
              <div className="max-w-2xl">
                <motion.h1
                  initial={shouldReduceMotion ? {} : { opacity: 0.9, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    ease: EDITORIAL_EASE,
                  }}
                  className="type-hero text-foundation-ink dark:text-dark-text font-normal tracking-tight"
                >
                  Understanding AI beyond the surface.
                </motion.h1>
              </div>

              {/* Exact Requested Supporting Copy */}
              <p className="type-body text-foundation-secondary dark:text-dark-muted max-w-xl leading-relaxed text-base sm:text-lg">
                We investigate how intelligent systems work, where they fail, and what the evidence tells us.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById('editors-selection');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      onSelectArticle(featuredArticle);
                    }
                  }}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore investigations
                </AnimatedButton>

                <AnimatedButton
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate('research')}
                  icon={<BookOpen className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Browse research
                </AnimatedButton>
              </div>

              {/* Editorial Quality Attestation (Replaces fabricated telemetry counters) */}
              <div className="pt-6 border-t border-foundation-border dark:border-dark-border flex flex-wrap items-center gap-6 text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-violet shrink-0" />
                  <span>Double-blind peer review</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent-blue shrink-0" />
                  <span>Open weights &amp; reproducible seeds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-accent-mint shrink-0" />
                  <span>Open Access (CC BY-NC 4.0)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Featured Lead Story Card & Artwork */}
            <div className="lg:col-span-5">
              <div 
                onClick={() => onSelectArticle(featuredArticle)}
                className="relative rounded-3xl overflow-hidden border border-foundation-border dark:border-dark-border shadow-xl bg-foundation-ink aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] group cursor-pointer"
              >
                <motion.img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  variants={shouldReduceMotion ? {} : heroImageVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foundation-ink/95 via-foundation-ink/40 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge accent={featuredArticle.accentColor} size="xs">
                      {featuredArticle.topicTag}
                    </Badge>
                    <span className="text-[11px] font-mono text-white/80">
                      {featuredArticle.author.name} • {featuredArticle.readingTimeMinutes} min read
                    </span>
                  </div>
                  <h2 className="type-card-heading font-medium text-white leading-snug">
                    {featuredArticle.title}
                  </h2>
                  <p className="mt-2 text-xs text-white/80 line-clamp-2">
                    {featuredArticle.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — EDITOR'S SELECTION (Dedicated Asymmetric Lead Story)
          ========================================================================= */}
      <section id="editors-selection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-foundation-border dark:border-dark-border pb-4 mb-8">
            <div>
              <span className="type-meta text-accent-violet block uppercase tracking-wider font-semibold">
                Editor's Selection
              </span>
              <h2 className="type-section-heading text-foundation-ink dark:text-dark-text">
                Lead Research Investigation
              </h2>
            </div>
            <button
              onClick={() => onSelectArticle(featuredArticle)}
              className="text-xs sm:text-sm font-medium text-accent-violet hover:underline flex items-center gap-1 cursor-pointer"
            >
              Read full investigation <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <StoryCard
            article={featuredArticle}
            onSelect={onSelectArticle}
            featured={true}
            onBookmark={onToggleBookmark}
            isBookmarked={bookmarkedIds.includes(featuredArticle.id)}
          />
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 4 — LATEST STORIES (Varied Grid: 1 Featured + Supporting)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-foundation-border dark:border-dark-border pb-4 mb-8">
          <div>
            <span className="type-meta text-foundation-secondary dark:text-dark-muted block uppercase tracking-wider">
              Recent Dispatches
            </span>
            <h2 className="type-section-heading text-foundation-ink dark:text-dark-text">
              Latest Inquiries &amp; Failure Analyses
            </h2>
          </div>
          <button
            onClick={() => onNavigate('discover')}
            className="text-xs sm:text-sm font-medium text-foundation-ink dark:text-dark-text hover:text-accent-violet transition-colors flex items-center gap-1 cursor-pointer"
          >
            View all stories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column: Featured Latest Story */}
          {secondaryArticles[0] && (
            <div className="lg:col-span-7">
              <StoryCard
                article={secondaryArticles[0]}
                onSelect={onSelectArticle}
                onBookmark={onToggleBookmark}
                isBookmarked={bookmarkedIds.includes(secondaryArticles[0].id)}
              />
            </div>
          )}

          {/* Side Column: Stack of 2 Supporting Stories */}
          <div className="lg:col-span-5 space-y-4">
            {secondaryArticles.slice(1, 3).map((article) => (
              <StoryCard
                key={article.id}
                article={article}
                onSelect={onSelectArticle}
                onBookmark={onToggleBookmark}
                isBookmarked={bookmarkedIds.includes(article.id)}
                variant="horizontal"
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — RESEARCH SPOTLIGHT (Preprints, Benchmarks & Interactive Chart)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-foundation-border dark:border-dark-border pb-4 mb-8">
            <div>
              <span className="type-meta text-accent-violet block uppercase tracking-wider font-semibold">
                Research Spotlight
              </span>
              <h2 className="type-section-heading text-foundation-ink dark:text-dark-text">
                Empirical Preprints &amp; Benchmarks
              </h2>
            </div>
            <button
              onClick={() => onNavigate('research')}
              className="text-xs sm:text-sm font-medium text-accent-violet hover:underline flex items-center gap-1 cursor-pointer"
            >
              Explore Research Library <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Featured Preprint Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge accent="violet" size="xs">
                    {featuredPaper.category}
                  </Badge>
                  <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                    {featuredPaper.publishedAt}
                  </span>
                </div>

                <div>
                  <h3 className="type-card-heading text-foundation-ink dark:text-dark-text font-medium leading-snug">
                    {featuredPaper.title}
                  </h3>
                  <p className="mt-1 text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                    {featuredPaper.authors.join(', ')}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-foundation-secondary dark:text-dark-muted leading-relaxed line-clamp-4">
                  {featuredPaper.abstract}
                </p>

                {/* Key Findings List */}
                <div className="pt-3 border-t border-foundation-border dark:border-dark-border space-y-1.5">
                  <span className="text-[11px] font-mono uppercase text-foundation-ink dark:text-dark-text font-semibold">
                    Key Empirical Findings:
                  </span>
                  {featuredPaper.keyFindings.slice(0, 3).map((finding, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-foundation-secondary dark:text-dark-muted">
                      <Check className="w-3.5 h-3.5 text-accent-violet shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions: Download PDF, Copy BibTeX, DOI Link */}
              <div className="mt-6 pt-4 border-t border-foundation-border dark:border-dark-border flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AnimatedButton
                    size="sm"
                    variant="primary"
                    onClick={() => onDownloadPaper(featuredPaper)}
                    icon={<Download className="w-3.5 h-3.5" />}
                  >
                    Download PDF
                  </AnimatedButton>
                  <AnimatedButton
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleCopyBibtex(e, featuredPaper)}
                    icon={copiedBibtexId === featuredPaper.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedBibtexId === featuredPaper.id ? 'Copied' : 'BibTeX'}
                  </AnimatedButton>
                </div>
                {featuredPaper.doi && (
                  <span className="text-[11px] font-mono text-foundation-secondary dark:text-dark-muted">
                    DOI: {featuredPaper.doi}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Meaningful Research Visualization */}
            <div className="lg:col-span-7">
              <AnimatedChart data={chartData} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 6 — AREAS OF INQUIRY (6 Semantic Topics)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-foundation-border dark:border-dark-border pb-4 mb-8">
          <div>
            <span className="type-meta text-foundation-secondary dark:text-dark-muted block uppercase tracking-wider">
              Classification
            </span>
            <h2 className="type-section-heading text-foundation-ink dark:text-dark-text">
              Areas of Inquiry
            </h2>
          </div>
          <button
            onClick={() => onNavigate('discover')}
            className="text-xs sm:text-sm font-medium text-foundation-ink dark:text-dark-text hover:text-accent-violet transition-colors flex items-center gap-1 cursor-pointer"
          >
            Explore all topics <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: 'interpretability',
              title: 'Mechanistic Interpretability',
              color: 'text-accent-violet',
              bg: 'bg-surface-lavender dark:bg-accent-violet/10',
              border: 'border-accent-violet/30 hover:border-accent-violet',
              desc: 'Reverse-engineering latent feature representations, residual stream circuits, and polysemantic superpositions.',
              count: 32,
              icon: <Cpu className="w-5 h-5 text-accent-violet" />
            },
            {
              id: 'agentic',
              title: 'Agentic Systems',
              color: 'text-accent-blue',
              bg: 'bg-surface-softblue dark:bg-accent-blue/10',
              border: 'border-accent-blue/30 hover:border-accent-blue',
              desc: 'Autonomous multi-agent orchestration, Byzantine fault tolerance, tool calling verification, and state drift.',
              count: 28,
              icon: <Users className="w-5 h-5 text-accent-blue" />
            },
            {
              id: 'perceptual',
              title: 'Perceptual Intelligence',
              color: 'text-accent-mint',
              bg: 'bg-surface-softmint dark:bg-accent-mint/10',
              border: 'border-accent-mint/30 hover:border-accent-mint',
              desc: 'Embodied spatial voxel memory, multi-modal sensor fusion, visual affordance synthesis, and robotics permanence.',
              count: 19,
              icon: <Eye className="w-5 h-5 text-accent-mint" />
            },
            {
              id: 'governance',
              title: 'AI Governance',
              color: 'text-accent-ochre',
              bg: 'bg-surface-butter dark:bg-accent-ochre/10',
              border: 'border-accent-ochre/30 hover:border-accent-ochre',
              desc: 'Statutory auditing sandboxes, cryptographic weight verification treaties, liability regimes, and model red-teaming.',
              count: 22,
              icon: <Scale className="w-5 h-5 text-accent-ochre" />
            },
            {
              id: 'inference',
              title: 'Inference Architectures',
              color: 'text-accent-terracotta',
              bg: 'bg-surface-peach dark:bg-accent-terracotta/10',
              border: 'border-accent-terracotta/30 hover:border-accent-terracotta',
              desc: 'Speculative decoding, KV cache compression, sparse attention kernels, and low-latency hardware co-design.',
              count: 26,
              icon: <Layers className="w-5 h-5 text-accent-terracotta" />
            },
            {
              id: 'safety',
              title: 'AI Evaluation & Safety',
              color: 'text-foundation-secondary dark:text-dark-text',
              bg: 'bg-foundation-paper dark:bg-dark-elevated',
              border: 'border-foundation-border dark:border-dark-border hover:border-foundation-ink dark:hover:border-white',
              desc: 'Adversarial jailbreak frontiers, automated circuit ablation, catastrophic risk bounds, and mechanistic guarantees.',
              count: 24,
              icon: <Shield className="w-5 h-5 text-foundation-secondary dark:text-dark-text" />
            },
          ].map((topic) => (
            <div
              key={topic.id}
              onClick={() => onNavigate('discover')}
              className={`p-6 rounded-2xl bg-white dark:bg-dark-surface border transition-all cursor-pointer group flex flex-col justify-between hover:shadow-editorial ${topic.border}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${topic.bg} flex items-center justify-center shrink-0`}>
                    {topic.icon}
                  </div>
                  <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                    {topic.count} Papers
                  </span>
                </div>

                <div>
                  <h3 className={`type-card-heading font-medium mb-1 transition-colors group-hover:text-accent-violet ${topic.color}`}>
                    {topic.title}
                  </h3>
                  <p className="type-secondary text-xs text-foundation-secondary dark:text-dark-muted leading-relaxed line-clamp-3">
                    {topic.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-foundation-border dark:border-dark-border flex items-center justify-between text-xs font-mono text-foundation-secondary dark:text-dark-muted group-hover:text-accent-violet transition-colors">
                <span>Explore inquiries</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — PERSPECTIVES (Human-Centred Essays & Debates: id="perspectives")
          ========================================================================= */}
      <section id="perspectives" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-foundation-border dark:border-dark-border pb-4 mb-8">
            <div>
              <span className="type-meta text-accent-ochre block uppercase tracking-wider font-semibold">
                Perspectives &amp; Debates
              </span>
              <h2 className="type-section-heading text-foundation-ink dark:text-dark-text">
                Researcher Viewpoints &amp; Theoretical Inquiries
              </h2>
            </div>
            <button
              onClick={() => onNavigate('discover')}
              className="text-xs sm:text-sm font-medium text-accent-ochre hover:underline flex items-center gap-1 cursor-pointer"
            >
              Read perspectives <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {mockPerspectives.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPerspective(item)}
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial hover:shadow-editorial-hover transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Category & Format Tag */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-accent-ochre font-medium">
                      {item.format}
                    </span>
                    <span className="font-mono text-foundation-secondary dark:text-dark-muted">
                      {item.readingTimeMinutes} min read
                    </span>
                  </div>

                  {/* Pull Quote Highlight */}
                  <div className="relative pl-4 border-l-2 border-accent-ochre/60 py-1">
                    <Quote className="w-4 h-4 text-accent-ochre/40 absolute -left-2 -top-1" />
                    <p className="font-serif italic text-sm text-foundation-ink dark:text-dark-text leading-snug">
                      "{item.pullQuote}"
                    </p>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="type-card-heading text-foundation-ink dark:text-dark-text font-medium group-hover:text-accent-ochre transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-foundation-secondary dark:text-dark-muted leading-relaxed line-clamp-3">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Author Metadata Footer */}
                <div className="mt-6 pt-4 border-t border-foundation-border dark:border-dark-border flex items-center gap-3">
                  <img
                    src={item.author.avatar}
                    alt={item.author.name}
                    className="w-9 h-9 rounded-full object-cover shrink-0 border border-foundation-border"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-foundation-ink dark:text-dark-text">
                      {item.author.name}
                    </span>
                    <span className="block text-[11px] font-mono text-foundation-secondary dark:text-dark-muted truncate max-w-[200px]">
                      {item.author.affiliation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 8 — MEDIA (Cinematic Showcase: Documentaries, Podcasts, Lectures)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-foundation-border dark:border-dark-border pb-4 mb-8">
          <div>
            <span className="type-meta text-foundation-secondary dark:text-dark-muted block uppercase tracking-wider">
              Multimedia
            </span>
            <h2 className="type-section-heading text-foundation-ink dark:text-dark-text">
              Cinematic Investigations &amp; Dialogues
            </h2>
          </div>
          <button
            onClick={() => onNavigate('media')}
            className="text-xs sm:text-sm font-medium text-foundation-ink dark:text-dark-text hover:text-accent-violet transition-colors flex items-center gap-1 cursor-pointer"
          >
            Explore media <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Cinematic Video Feature (Left 7 cols) */}
          <div 
            onClick={() => setActiveMediaItem(mockMediaItems[0])}
            className="lg:col-span-7 rounded-3xl overflow-hidden border border-foundation-border dark:border-dark-border shadow-xl bg-foundation-ink group cursor-pointer relative"
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={mockMediaItems[0].coverImage}
                alt={mockMediaItems[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foundation-ink/95 via-foundation-ink/40 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-accent-violet/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
                      Featured Documentary • {mockMediaItems[0].duration}
                    </span>
                    <span className="block text-[11px] font-mono text-white/80 mt-0.5">
                      {mockMediaItems[0].speaker}
                    </span>
                  </div>
                </div>

                <h3 className="type-card-heading font-medium text-white text-lg sm:text-xl">
                  {mockMediaItems[0].title}
                </h3>
                <p className="mt-1 text-xs text-white/80 line-clamp-2 max-w-xl">
                  {mockMediaItems[0].description}
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Media Stack (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {mockMediaItems.slice(1, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveMediaItem(item)}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial hover:shadow-editorial-hover transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className="w-24 h-20 rounded-xl overflow-hidden relative shrink-0 bg-foundation-paper">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-white/90 text-foundation-ink flex items-center justify-center">
                      {item.format === 'dialogue' ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-foundation-ink ml-0.5" />}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-foundation-secondary dark:text-dark-muted mb-1">
                    <span className="uppercase text-accent-violet font-semibold">
                      {item.format}
                    </span>
                    <span>•</span>
                    <span>{item.duration}</span>
                  </div>
                  <h4 className="type-card-heading text-sm text-foundation-ink dark:text-dark-text font-medium line-clamp-2 group-hover:text-accent-violet transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-mono text-foundation-secondary dark:text-dark-muted mt-1 truncate">
                    {item.speaker}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9 — AI TATHASTU ECOSYSTEM (Living Software Platforms)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-foundation-border dark:border-dark-border pb-6 mb-8 gap-4">
            <div className="max-w-2xl">
              <span className="type-meta text-accent-violet block uppercase mb-1 font-semibold">
                The Tathastu Platform
              </span>
              <h2 className="type-section-heading text-foundation-ink dark:text-dark-text font-normal">
                Applied Laboratories &amp; Research Systems
              </h2>
              <p className="mt-2 type-body text-foundation-secondary dark:text-dark-muted leading-relaxed">
                Our research is married to living software. Discover how our open-source platforms turn theoretical interpretability, swarm consensus, and spatial vision into accessible community infrastructure.
              </p>
            </div>
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={() => onNavigate('ecosystem')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Explore the ecosystem
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemProducts.map((product) => {
              const productConfig: Record<string, {
                borderClass: string;
                iconBg: string;
                iconColor: string;
                badgeClass: string;
                icon: React.ReactNode;
              }> = {
                mentormaze: {
                  borderClass: 'border-accent-violet/30 hover:border-accent-violet',
                  iconBg: 'bg-surface-lavender dark:bg-accent-violet/20',
                  iconColor: 'text-accent-violet',
                  badgeClass: 'bg-surface-lavender text-accent-violet',
                  icon: <GraduationCap className="w-5 h-5 text-accent-violet" />,
                },
                collaborate: {
                  borderClass: 'border-accent-blue/30 hover:border-accent-blue',
                  iconBg: 'bg-surface-softblue dark:bg-accent-blue/20',
                  iconColor: 'text-accent-blue',
                  badgeClass: 'bg-surface-softblue text-accent-blue',
                  icon: <Users className="w-5 h-5 text-accent-blue" />,
                },
                avsar: {
                  borderClass: 'border-accent-terracotta/30 hover:border-accent-terracotta',
                  iconBg: 'bg-surface-peach dark:bg-accent-terracotta/20',
                  iconColor: 'text-accent-terracotta',
                  badgeClass: 'bg-surface-peach text-accent-terracotta',
                  icon: <Award className="w-5 h-5 text-accent-terracotta" />,
                },
                iris: {
                  borderClass: 'border-accent-mint/30 hover:border-accent-mint',
                  iconBg: 'bg-surface-softmint dark:bg-accent-mint/20',
                  iconColor: 'text-accent-mint',
                  badgeClass: 'bg-surface-softmint text-accent-mint',
                  icon: <Eye className="w-5 h-5 text-accent-mint" />,
                },
              };

              const config = productConfig[product.id] || {
                borderClass: 'border-foundation-border dark:border-dark-border hover:border-foundation-ink',
                iconBg: 'bg-foundation-paper dark:bg-dark-elevated',
                iconColor: 'text-foundation-ink dark:text-dark-text',
                badgeClass: 'bg-foundation-paper dark:bg-dark-elevated text-foundation-secondary dark:text-dark-muted',
                icon: <Layers className="w-5 h-5" />,
              };

              return (
                <div
                  key={product.id}
                  onClick={() => onExploreEcosystem(product)}
                  className={`p-6 rounded-2xl bg-white dark:bg-dark-surface border transition-all cursor-pointer group flex flex-col justify-between hover:shadow-editorial ${config.borderClass}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0`}>
                        {config.icon}
                      </div>
                      <span className={`type-meta px-2 py-0.5 rounded font-mono uppercase ${config.badgeClass}`}>
                        {product.badge}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="type-card-heading text-foundation-ink dark:text-dark-text font-medium group-hover:text-accent-violet transition-colors">
                          {product.name}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-foundation-secondary group-hover:text-accent-violet group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <p className="type-secondary text-xs text-foundation-secondary dark:text-dark-muted leading-relaxed line-clamp-3">
                        {product.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-foundation-border dark:border-dark-border text-xs font-mono text-foundation-secondary dark:text-dark-muted flex justify-between items-center">
                    <span>{product.stats[0]?.label}</span>
                    <span className="text-foundation-ink dark:text-dark-text font-semibold">{product.stats[0]?.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 10 — EDITORIAL STANDARDS (Trust & Open Science Invariants)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="p-8 sm:p-12 rounded-3xl bg-foundation-paper dark:bg-dark-surface border border-foundation-border dark:border-dark-border">
            <div className="max-w-3xl mb-8 space-y-2">
              <span className="type-meta text-accent-violet uppercase tracking-widest block font-medium">
                Scientific Integrity
              </span>
              <h2 className="type-section-heading text-foundation-ink dark:text-dark-text font-normal">
                Editorial Standards &amp; Open Science Invariants
              </h2>
              <p className="type-body text-foundation-secondary dark:text-dark-muted leading-relaxed text-sm sm:text-base">
                AI Tathastu Insights operates as an independent research journal committed to reproducible artifacts, empirical rigor, and complete transparency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  title: 'Verifiable Checkpoints',
                  desc: 'Every published investigation includes open model weights, activation seeds, or execution traces.',
                  icon: <Check className="w-5 h-5 text-accent-violet" />
                },
                {
                  title: 'Double-Blind Review',
                  desc: 'Manuscripts undergo rigorous multi-stage peer review by independent academic researchers.',
                  icon: <ShieldCheck className="w-5 h-5 text-accent-blue" />
                },
                {
                  title: 'Zero Sponsorship',
                  desc: 'We accept zero commercial ads, corporate sponsorships, or proprietary influence.',
                  icon: <Lock className="w-5 h-5 text-accent-mint" />
                },
                {
                  title: 'Open Access CC BY-NC',
                  desc: 'All findings and editorial analyses are indexed under Creative Commons licenses.',
                  icon: <Code2 className="w-5 h-5 text-accent-ochre" />
                },
                {
                  title: 'Permanent Corrections',
                  desc: 'All revisions and errata are permanently tracked with cryptographic hash timestamps.',
                  icon: <RefreshCw className="w-5 h-5 text-accent-terracotta" />
                },
              ].map((item, idx) => (
                <div key={idx} className="space-y-3 p-4 rounded-xl bg-white dark:bg-dark-elevated border border-foundation-border dark:border-dark-border">
                  <div className="w-9 h-9 rounded-lg bg-foundation-paper dark:bg-dark-surface flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-foundation-ink dark:text-dark-text">
                    {item.title}
                  </h4>
                  <p className="text-xs text-foundation-secondary dark:text-dark-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-foundation-border dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                Governed by the Tathastu Academic &amp; Research Board
              </span>
              <AnimatedButton
                variant="outline"
                size="sm"
                onClick={() => onNavigate('about')}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Read our editorial charter
              </AnimatedButton>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 11 — NEWSLETTER (Refined Fortnightly Peer Dispatch)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
          <div className="max-w-2xl space-y-3">
            <span className="type-meta text-accent-violet uppercase tracking-widest block font-medium">
              Fortnightly Peer Dispatch
            </span>
            {/* Exact Requested Headline */}
            <h3 className="type-section-heading text-foundation-ink dark:text-dark-text font-normal">
              Research worth keeping up with.
            </h3>
            {/* Exact Requested Supporting Copy */}
            <p className="type-secondary text-foundation-secondary dark:text-dark-muted leading-relaxed">
              Receive selected investigations, research papers and editorial updates. Fortnightly dispatches. Zero promotional filler. One-click unsubscribe.
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="mt-6 space-y-3 max-w-xl"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="name@institution.edu"
                className="flex-1 px-4 py-3 rounded-xl border border-foundation-border dark:border-dark-border bg-foundation-paper dark:bg-dark-elevated text-sm text-foundation-ink dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-violet transition-all"
              />
              <AnimatedButton
                type="submit"
                variant="primary"
                size="md"
                icon={newsletterSubscribed ? <Check className="w-4 h-4 text-green-300" /> : <ArrowRight className="w-4 h-4" />}
              >
                {newsletterSubscribed ? 'Subscribed' : 'Subscribe'}
              </AnimatedButton>
            </div>
            {newsletterError && (
              <p className="text-xs font-mono text-red-500">
                {newsletterError}
              </p>
            )}
            {newsletterSubscribed && (
              <p className="text-xs font-mono text-green-600 dark:text-green-400">
                ✓ Dispatch confirmed. Volume 26 will arrive in your institutional inbox.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* =========================================================================
          PERSPECTIVE DETAIL MODAL (Accessible Reader)
          ========================================================================= */}
      <AnimatePresence>
        {selectedPerspective && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPerspective(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedPerspective(null)}
                className="absolute top-6 right-6 p-2 rounded-xl text-foundation-secondary hover:text-foundation-ink dark:hover:text-white hover:bg-foundation-paper dark:hover:bg-dark-elevated transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge accent={selectedPerspective.accentColor} size="xs">
                    {selectedPerspective.format}
                  </Badge>
                  <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                    {selectedPerspective.category} • {selectedPerspective.publishedAt}
                  </span>
                </div>

                <h2 className="type-section-heading text-foundation-ink dark:text-dark-text">
                  {selectedPerspective.title}
                </h2>

                <div className="p-4 rounded-xl bg-foundation-paper dark:bg-dark-elevated border-l-4 border-accent-ochre font-serif italic text-sm text-foundation-ink dark:text-dark-text">
                  "{selectedPerspective.pullQuote}"
                </div>

                <p className="type-body text-foundation-secondary dark:text-dark-muted leading-relaxed">
                  {selectedPerspective.subtitle}
                </p>

                <div className="pt-4 border-t border-foundation-border dark:border-dark-border flex items-center gap-4">
                  <img
                    src={selectedPerspective.author.avatar}
                    alt={selectedPerspective.author.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-foundation-ink dark:text-dark-text">
                      {selectedPerspective.author.name}
                    </h4>
                    <p className="text-xs text-foundation-secondary dark:text-dark-muted">
                      {selectedPerspective.author.role} • {selectedPerspective.author.affiliation}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <AnimatedButton
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setSelectedPerspective(null);
                      onNavigate('discover');
                    }}
                  >
                    Explore all perspectives
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MEDIA PLAYBACK MODAL (Clean, Accessible, No Autoplay Sound)
          ========================================================================= */}
      <AnimatePresence>
        {activeMediaItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveMediaItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveMediaItem(null)}
                className="absolute top-6 right-6 p-2 rounded-xl text-foundation-secondary hover:text-foundation-ink dark:hover:text-white hover:bg-foundation-paper dark:hover:bg-dark-elevated transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="aspect-video rounded-2xl overflow-hidden bg-foundation-ink relative border border-foundation-border">
                  <img
                    src={activeMediaItem.coverImage}
                    alt={activeMediaItem.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-accent-violet text-white flex items-center justify-center mb-3 shadow-xl">
                      <Play className="w-7 h-7 fill-white ml-1" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider text-white/90">
                      Playback Ready • {activeMediaItem.duration}
                    </span>
                    <span className="text-[11px] font-mono text-white/70 mt-1">
                      Audio / Video streams require user interaction to begin.
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono uppercase text-accent-violet font-semibold">
                      {activeMediaItem.format}
                    </span>
                    <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                      • {activeMediaItem.publishedAt}
                    </span>
                  </div>
                  <h3 className="type-card-heading text-xl text-foundation-ink dark:text-dark-text font-medium">
                    {activeMediaItem.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-foundation-secondary dark:text-dark-muted leading-relaxed">
                    {activeMediaItem.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-foundation-border dark:border-dark-border flex items-center justify-between text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                  <span>Speaker: {activeMediaItem.speaker}</span>
                  <AnimatedButton
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setActiveMediaItem(null);
                      onNavigate('media');
                    }}
                  >
                    Open in Media Archive
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};