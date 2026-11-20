import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
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
  Compass,
  Cpu,
  Shield,
  Activity,
  Code2,
  Terminal,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight
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
import { 
  mockPerspectives, 
  mockMediaItems, 
  mockEngineeringArticles, 
  mockCompanyUpdates 
} from '../lib/mockData';
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
    primaryDatasetLabel: 'Tathastu Top-K SAE (Model)',
    baselineDatasetLabel: 'Standard Gated SAE',
    unit: '%',
    isDemonstration: true,
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
    <div className="space-y-20 sm:space-y-28">
      {/* =========================================================================
          SECTION 2 — HERO SECTION (Master UI/UX Specification 1.0)
          Headline: "Building what comes next."
          Supporting copy: "Explore the ideas, research and engineering behind the AI Tathastu ecosystem."
          ========================================================================= */}
      <section className="relative pt-6 sm:pt-14 pb-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Deliberate Editorial Headline & Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-lavender text-accent-violet dark:bg-accent-violet/20 dark:text-accent-lavender text-xs font-mono font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Tathastu Company Publication • Master Edition</span>
              </div>

              {/* Exact Requested Master Specification Headline */}
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
                  Building what comes next.
                </motion.h1>
              </div>

              {/* Exact Requested Supporting Copy */}
              <p className="type-body text-foundation-secondary dark:text-dark-muted max-w-xl leading-relaxed text-base sm:text-lg">
                Explore the ideas, research and engineering behind the AI Tathastu ecosystem.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById('featured-investigation');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      onSelectArticle(featuredArticle);
                    }
                  }}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Read Featured Story
                </AnimatedButton>

                <AnimatedButton
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate('products')}
                  icon={<Layers className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Explore Products
                </AnimatedButton>
              </div>

              {/* Verified Editorial Invariants */}
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

            {/* Right Column: Featured Cinematic Visual */}
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
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-editorial"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Lead Story Badge & Headline Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white space-y-2">
                  <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-mono tracking-wider uppercase font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20">
                    Lead Story • {featuredArticle.category}
                  </span>
                  <h3 className="type-card-heading text-white font-normal line-clamp-2 drop-shadow-sm">
                    {featuredArticle.title}
                  </h3>
                  <div className="flex items-center gap-3 pt-2 text-xs font-mono text-white/80">
                    <span>{featuredArticle.author.name}</span>
                    <span>•</span>
                    <span>{featuredArticle.readingTimeMinutes} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — FEATURED INVESTIGATION (Deep Dive)
          ========================================================================= */}
      <section id="featured-investigation" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
              <div className="lg:w-1/2 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="type-meta text-accent-violet uppercase font-semibold tracking-wider">
                    Featured Investigation
                  </span>
                  <span className="text-foundation-secondary dark:text-dark-muted">•</span>
                  <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                    {featuredArticle.publishedAt}
                  </span>
                </div>
                <h2 className="type-section-heading text-foundation-ink dark:text-dark-text font-normal">
                  {featuredArticle.title}
                </h2>
                <p className="type-body text-foundation-secondary dark:text-dark-muted text-sm sm:text-base leading-relaxed">
                  {featuredArticle.subtitle || featuredArticle.abstract}
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <AnimatedButton
                    variant="primary"
                    size="md"
                    onClick={() => onSelectArticle(featuredArticle)}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Read Full Investigation
                  </AnimatedButton>
                  <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                    {featuredArticle.readingTimeMinutes} min read
                  </span>
                </div>
              </div>
              <div className="lg:w-1/2 w-full">
                <div 
                  onClick={() => onSelectArticle(featuredArticle)}
                  className="rounded-2xl overflow-hidden aspect-video relative group cursor-pointer border border-foundation-border dark:border-dark-border"
                >
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 4 — LATEST STORIES (Asymmetric Editorial Grid)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-foundation-border dark:border-dark-border pb-4 mb-8">
          <div>
            <span className="type-meta text-accent-violet block uppercase tracking-wider font-semibold">
              Editorial Dispatch
            </span>
            <h2 className="type-section-heading text-foundation-ink dark:text-dark-text">
              Latest Stories &amp; Inquiries
            </h2>
          </div>
          <button
            onClick={() => onNavigate('discover')}
            className="text-xs sm:text-sm font-medium text-foundation-ink dark:text-dark-text hover:text-accent-violet transition-colors flex items-center gap-1 cursor-pointer"
          >
            Explore all stories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {secondaryArticles.slice(0, 3).map((article) => (
            <StaggerItem key={article.id}>
              <StoryCard
                article={article}
                onSelect={onSelectArticle}
                isBookmarked={bookmarkedIds.includes(article.id)}
                onBookmark={(e) => onToggleBookmark(e, article)}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* =========================================================================
          SECTION 5 — PRODUCT ECOSYSTEM SHOWCASE (MentorMaze, Collaborate, Avsar, Iris)
          Master Specification: 180-280ms duration hover scale 1.02-1.04, 3-4px elevation,
          status pills, and 100% verified contrast.
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
              onClick={() => onNavigate('products')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Explore Full Ecosystem
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
                  borderClass: 'border-foundation-border hover:border-accent-violet hover:shadow-editorial-hover',
                  iconBg: 'bg-surface-lavender dark:bg-accent-violet/20',
                  iconColor: 'text-accent-violet',
                  badgeClass: 'bg-surface-lavender text-accent-violet',
                  icon: <GraduationCap className="w-5 h-5 text-accent-violet" />,
                },
                collaborate: {
                  borderClass: 'border-foundation-border hover:border-accent-blue hover:shadow-editorial-hover',
                  iconBg: 'bg-surface-softblue dark:bg-accent-blue/20',
                  iconColor: 'text-accent-blue',
                  badgeClass: 'bg-surface-softblue text-accent-blue',
                  icon: <Users className="w-5 h-5 text-accent-blue" />,
                },
                avsar: {
                  borderClass: 'border-foundation-border hover:border-accent-terracotta hover:shadow-editorial-hover',
                  iconBg: 'bg-surface-peach dark:bg-accent-terracotta/20',
                  iconColor: 'text-accent-terracotta',
                  badgeClass: 'bg-surface-peach text-accent-terracotta',
                  icon: <Award className="w-5 h-5 text-accent-terracotta" />,
                },
                iris: {
                  borderClass: 'border-foundation-border hover:border-accent-mint hover:shadow-editorial-hover',
                  iconBg: 'bg-surface-softmint dark:bg-accent-mint/20',
                  iconColor: 'text-accent-mint',
                  badgeClass: 'bg-surface-softmint text-accent-mint',
                  icon: <Eye className="w-5 h-5 text-accent-mint" />,
                },
              };

              const config = productConfig[product.id] || {
                borderClass: 'border-foundation-border hover:border-foundation-ink',
                iconBg: 'bg-foundation-paper dark:bg-dark-elevated',
                iconColor: 'text-foundation-ink dark:text-dark-text',
                badgeClass: 'bg-foundation-paper text-foundation-secondary',
                icon: <Layers className="w-5 h-5" />,
              };

              return (
                <div
                  key={product.id}
                  onClick={() => onExploreEcosystem(product)}
                  className={`p-6 rounded-2xl bg-white dark:bg-dark-surface border transition-all duration-200 ease-editorial cursor-pointer group flex flex-col justify-between shadow-editorial hover:-translate-y-1 ${config.borderClass}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0`}>
                        {config.icon}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold ${config.badgeClass}`}>
                        {product.status || product.badge}
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
          SECTION 6 — RESEARCH SPOTLIGHT (Empirical SAE Purity)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-foundation-border dark:border-dark-border pb-4 mb-8">
            <div>
              <span className="type-meta text-accent-violet block uppercase tracking-wider font-semibold">
                Rigorous Methodology
              </span>
              <h2 className="type-section-heading text-foundation-ink dark:text-dark-text">
                Research Spotlight
              </h2>
            </div>
            <button
              onClick={() => onNavigate('research')}
              className="text-xs sm:text-sm font-medium text-foundation-ink dark:text-dark-text hover:text-accent-violet transition-colors flex items-center gap-1 cursor-pointer"
            >
              Browse all papers <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Research Description & Invariants */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
              <span className="type-meta text-accent-violet uppercase font-semibold block mb-2">
                Empirical Evaluation
              </span>
              <h3 className="type-card-heading text-foundation-ink dark:text-dark-text font-normal mb-3">
                {featuredPaper.title}
              </h3>
              <p className="type-body text-xs sm:text-sm text-foundation-secondary dark:text-dark-muted leading-relaxed mb-6">
                {featuredPaper.abstract}
              </p>

              {/* Key Findings */}
              <div className="space-y-3 pt-4 border-t border-foundation-border dark:border-dark-border">
                <span className="text-xs font-mono uppercase tracking-wider text-foundation-ink dark:text-dark-text font-semibold block">
                  Key Empirical Invariants:
                </span>
                {featuredPaper.keyFindings.slice(0, 3).map((finding, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-foundation-secondary dark:text-dark-muted">
                    <Check className="w-3.5 h-3.5 text-accent-violet shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
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

            {/* Right: Meaningful Chart */}
            <div className="lg:col-span-7">
              <AnimatedChart data={chartData} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 7 — ENGINEERING INSIGHTS (Kernel & Systems Deep Dives)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-foundation-border dark:border-dark-border pb-4 mb-8">
            <div>
              <span className="type-meta text-accent-violet block uppercase tracking-wider font-semibold">
                Technical Depth
              </span>
              <h2 className="type-section-heading text-foundation-ink dark:text-dark-text">
                Engineering Insights &amp; Kernels
              </h2>
            </div>
            <button
              onClick={() => onNavigate('engineering')}
              className="text-xs sm:text-sm font-medium text-foundation-ink dark:text-dark-text hover:text-accent-violet transition-colors flex items-center gap-1 cursor-pointer"
            >
              Explore engineering <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockEngineeringArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('engineering')}
                className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial hover:shadow-editorial-hover transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-semibold bg-surface-lavender text-accent-violet dark:bg-accent-violet/20">
                      {item.category}
                    </span>
                    <span className="font-mono text-foundation-secondary dark:text-dark-muted text-[11px]">
                      {item.readingTimeMinutes} min read
                    </span>
                  </div>

                  <div>
                    <h3 className="type-card-heading text-foundation-ink dark:text-dark-text font-medium group-hover:text-accent-violet transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-foundation-secondary dark:text-dark-muted leading-relaxed line-clamp-3">
                      {item.abstract}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-foundation-border dark:border-dark-border flex items-center justify-between text-xs font-mono text-foundation-secondary dark:text-dark-muted group-hover:text-accent-violet">
                  <span>Architecture Deep Dive</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 8 — DEVELOPMENT UPDATES (Newsroom & Changelog Feed)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-foundation-border dark:border-dark-border pb-4 mb-8">
            <div>
              <span className="type-meta text-accent-violet block uppercase tracking-wider font-semibold">
                Living Changelog
              </span>
              <h2 className="type-section-heading text-foundation-ink dark:text-dark-text">
                Development Updates &amp; Milestones
              </h2>
            </div>
            <button
              onClick={() => onNavigate('updates')}
              className="text-xs sm:text-sm font-medium text-foundation-ink dark:text-dark-text hover:text-accent-violet transition-colors flex items-center gap-1 cursor-pointer"
            >
              View full newsroom <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCompanyUpdates.slice(0, 3).map((upd) => (
              <div
                key={upd.id}
                onClick={() => onNavigate('updates')}
                className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial hover:shadow-editorial-hover transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-foundation-paper dark:bg-dark-elevated text-foundation-ink dark:text-dark-text font-semibold border border-foundation-border dark:border-dark-border">
                      {upd.version || upd.category}
                    </span>
                    <span className="text-[11px] font-mono text-foundation-secondary dark:text-dark-muted">
                      {upd.date}
                    </span>
                  </div>
                  <h3 className="type-card-heading text-foundation-ink dark:text-dark-text font-medium group-hover:text-accent-violet transition-colors">
                    {upd.title}
                  </h3>
                  <p className="text-xs text-foundation-secondary dark:text-dark-muted leading-relaxed line-clamp-3">
                    {upd.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-foundation-border dark:border-dark-border text-xs font-mono text-accent-violet flex items-center gap-1">
                  <span>Read update notes</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 9 — MEDIA SHOWCASE (Cinematic Investigations & Dialogues)
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
            Explore media library <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockMediaItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('media')}
              className="rounded-2xl overflow-hidden bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial hover:shadow-editorial-hover transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-video overflow-hidden bg-foundation-ink">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-foundation-ink flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 text-accent-violet" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 text-white text-[11px] font-mono">
                  {item.duration}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-mono uppercase font-semibold text-accent-violet">
                  {item.format}
                </span>
                <h3 className="type-card-heading text-foundation-ink dark:text-dark-text font-medium group-hover:text-accent-violet transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-foundation-secondary dark:text-dark-muted line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 10 — COMPANY VISION & JOURNEY (Our Story & Purpose)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="p-8 sm:p-12 rounded-3xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border dark:border-dark-border">
            <div className="max-w-3xl space-y-4">
              <span className="type-meta text-accent-violet uppercase tracking-wider font-semibold">
                Company Vision &amp; Conviction
              </span>
              <h2 className="type-section-heading text-foundation-ink dark:text-dark-text font-normal">
                Why AI Tathastu Exists
              </h2>
              <p className="type-body text-foundation-secondary dark:text-dark-muted text-sm sm:text-base leading-relaxed">
                We believe that artificial intelligence should not be governed by corporate secrecy or opaque marketing rhetoric. AI Tathastu is committed to building what comes next and openly documenting every system architecture, mechanistic circuit, and empirical failure mode.
              </p>
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <AnimatedButton
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('about')}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Read Our Full Story &amp; Charter
                </AnimatedButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 11 — NEWSLETTER DISPATCH
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
          <div className="max-w-2xl space-y-3">
            <span className="type-meta text-accent-violet uppercase tracking-widest block font-medium">
              Fortnightly Peer Dispatch
            </span>
            <h3 className="type-section-heading text-foundation-ink dark:text-dark-text font-normal">
              Read verified research before public preprint distribution.
            </h3>
            <p className="type-secondary text-foundation-secondary dark:text-dark-muted leading-relaxed">
              We send concise summaries of verified residual circuits, multi-agent benchmarks, and statutory policy standards every second Tuesday. Zero promotional filler.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="mt-6 space-y-3 max-w-xl">
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
            {newsletterSubscribed && (
              <p className="text-xs font-mono text-green-600 dark:text-green-400">
                ✓ Dispatch confirmed. Volume 4 will arrive in your institutional inbox.
              </p>
            )}
            {newsletterError && (
              <p className="text-xs font-mono text-red-500">
                {newsletterError}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};
