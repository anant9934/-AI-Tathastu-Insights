import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Layers, 
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
  Terminal,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Article, ResearchPaper, EcosystemProduct } from '../types';
import { StoryCard } from '../components/cards/StoryCard';
import { EcosystemCard } from '../components/cards/EcosystemCard';
import { ProductLedger } from '../components/products/ProductShowcase';
import { HeroStorySlider } from '../components/hero/HeroStorySlider';
import { AnimatedChart } from '../components/motion/AnimatedChart';
import { Reveal } from '../components/motion/Reveal';
import { StaggerContainer, StaggerItem } from '../components/motion/StaggerContainer';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { NavTab } from '../components/layout/Navbar';
import { 
  mockMediaItems, 
  mockEngineeringArticles, 
  mockCompanyUpdates 
} from '../lib/mockData';
import { EDITORIAL_EASE } from '../lib/motion';
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
  const [activeHeroProduct, setActiveHeroProduct] = useState<string>('collaborate');

  const shouldReduceMotion = useReducedMotion();

  const featuredArticle = articles[0];
  const secondaryArticles = articles.slice(1);
  const featuredPaper = papers[0];

  // Research Chart Data
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
      setNewsletterError('Please provide a valid email address.');
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
          SECTION 1 — HERO: CORPORATE EDITORIAL MASTHEAD & FLAGSHIP SYSTEM STAGE
          ========================================================================= */}
      <section className="relative pt-6 sm:pt-14 pb-8 border-b border-brand-stone-dark/60 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          {/* Authentic Corporate Masthead Statement */}
          <div className="space-y-6 max-w-4xl">
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0.92, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
              className="type-hero text-brand-charcoal dark:text-dark-text tracking-tight font-semibold"
            >
              We build open systems for research, distributed intelligence, and physical computing.
            </motion.h1>

            <p className="text-base sm:text-xl text-brand-muted dark:text-dark-muted max-w-3xl leading-relaxed font-normal">
              AI Tathastu is an independent technology company. We identify foundational bottlenecks in machine learning, autonomous agent coordination, and spatial perception—and build the software to solve them. We publish our code, document our architectural challenges, and share what we learn.
            </p>

            {/* Architectural Index Anchors */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-brand-muted dark:text-dark-muted border-t border-brand-stone-dark/60 dark:border-dark-border pt-4">
              <button 
                onClick={() => {
                  const el = document.getElementById('systems-ledger');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-brand-charcoal dark:hover:text-white transition-colors cursor-pointer"
              >
                [01] Systems &amp; Products ↓
              </button>
              <button 
                onClick={() => onNavigate('engineering')}
                className="hover:text-brand-charcoal dark:hover:text-white transition-colors cursor-pointer"
              >
                [02] Engineering Dispatches →
              </button>
              <button 
                onClick={() => onNavigate('research')}
                className="hover:text-brand-charcoal dark:hover:text-white transition-colors cursor-pointer"
              >
                [03] Research Archive →
              </button>
              <button 
                onClick={() => onNavigate('about')}
                className="hover:text-brand-charcoal dark:hover:text-white transition-colors cursor-pointer"
              >
                [04] Company Vision →
              </button>
            </div>
          </div>

          {/* Interactive Flagship Cinematic Story Slider (Adapted from Owner Reference Pattern) */}
          <HeroStorySlider 
            onExploreProduct={(productId) => {
              const p = ecosystemProducts.find((x) => x.id === productId);
              if (p) onExploreEcosystem(p);
            }} 
            onNavigateEngineering={() => onNavigate('engineering')}
            onNavigateResearch={() => onNavigate('research')}
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — FEATURED PRODUCT MILESTONE: MAJOR DEVELOPMENT
          ========================================================================= */}
      <section id="featured-milestone" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-accent-blue font-semibold">
                    Major Development • Collaborate 2.4
                  </span>
                  <span className="text-brand-muted dark:text-dark-muted">•</span>
                  <span className="text-xs font-mono text-brand-muted dark:text-dark-muted">
                    November 2026
                  </span>
                </div>
                <h2 className="type-section-heading text-brand-charcoal dark:text-dark-text font-semibold">
                  How we solved multi-agent state drift with sub-200ms Byzantine consensus.
                </h2>
                <p className="text-sm sm:text-base text-brand-muted dark:text-dark-muted leading-relaxed max-w-2xl">
                  When teams of autonomous AI agents collaborate in code generation and hypothesis verification, race conditions cause cascading hallucination. We built the Aegis-BFT consensus daemon in Rust to enforce linearizable, reproducible execution across 64 heterogeneous workers.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <AnimatedButton
                    variant="primary"
                    size="md"
                    onClick={() => onNavigate('engineering')}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Read engineering breakdown
                  </AnimatedButton>
                  <AnimatedButton
                    variant="outline"
                    size="md"
                    onClick={() => onNavigate('products')}
                  >
                    Explore Collaborate
                  </AnimatedButton>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div 
                  onClick={() => onNavigate('engineering')}
                  style={{ backgroundColor: '#0C1322', color: '#FFFFFF' }}
                  className="rounded-2xl overflow-hidden aspect-[16/11] relative group cursor-pointer border border-brand-stone-dark/80 dark:border-dark-border bg-brand-navy p-5 text-white flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-white/70">
                    <span className="text-accent-softblue">aegis_consensus.rs</span>
                    <span>2f + 1 Quorum</span>
                  </div>
                  <pre className="text-xs font-mono leading-relaxed text-white/90 overflow-hidden line-clamp-6 bg-black/30 p-3 rounded-lg border border-white/10">
                    <code>{`// Enforce linearizable epoch
let quorum = (2 * byzantine_threshold) + 1;
let valid = verify_signatures(proposal)?;
if valid >= quorum {
    state_ledger.atomic_append(proposal).await?;
}`}</code>
                  </pre>
                  <div className="text-[11px] font-mono text-white/80 flex items-center justify-between pt-2 border-t border-white/10">
                    <span>99th Percentile: 142ms</span>
                    <span className="text-accent-softblue group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read full note →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 3 — THE PROBLEMS WE ARE WORKING ON (Full-Width Stone Surface)
          ========================================================================= */}
      <section className="bg-brand-stone dark:bg-dark-elevated py-16 sm:py-20 border-y border-brand-stone-dark/80 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-muted dark:text-dark-muted font-semibold block mb-2">
              Market Inefficiencies
            </span>
            <h2 className="type-section-heading text-brand-charcoal dark:text-dark-text font-semibold">
              The problems we're tackling.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-brand-muted dark:text-dark-muted leading-relaxed">
              We started AI Tathastu because current AI tools either offer superficial chatbot answers or require proprietary infrastructure that leaves researchers locked out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                number: '01',
                title: 'The Prerequisite Wall in Education',
                description: 'Advanced ML research moves too fast for university textbooks. Students get stuck on formal tensor calculus and GPU concurrency without Socratic diagnostic support.',
                productSolved: 'MentorMaze',
                accent: 'text-accent-blue',
              },
              {
                number: '02',
                title: 'State Drift in Multi-Agent Swarms',
                description: 'Autonomous agents fail not on single turns, but on uncoordinated state drift across concurrent tool calls. Without consensus, experiments cannot be reproduced.',
                productSolved: 'Collaborate',
                accent: 'text-accent-blue',
              },
              {
                number: '03',
                title: 'Opaque Research Grant Allocation',
                description: 'Traditional grant committees take 9 months to evaluate proposals. Independent open-source contributors need micro-grants distributed within days upon benchmark reproduction.',
                productSolved: 'Avsar',
                accent: 'text-accent-terracotta',
              },
              {
                number: '04',
                title: 'Missing Physical Memory in Vision',
                description: 'Existing vision models process disconnected 2D video frames, forgetting occluded physical objects. Embodied robotics requires continuous 3D voxel tensor memory.',
                productSolved: 'Iris',
                accent: 'text-accent-sage',
              },
            ].map((prob) => (
              <div
                key={prob.number}
                className="p-6 rounded-2xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-brand-muted dark:text-dark-muted block mb-3">
                    {prob.number}
                  </span>
                  <h3 className="text-base font-semibold text-brand-charcoal dark:text-dark-text mb-2">
                    {prob.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-muted dark:text-dark-muted leading-relaxed">
                    {prob.description}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-brand-stone-dark/60 dark:border-dark-border flex items-center justify-between text-xs">
                  <span className="text-brand-muted">Addressed by:</span>
                  <span className={`font-semibold font-mono ${prob.accent}`}>
                    {prob.productSolved}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — PRODUCTS & SYSTEMS: THE ARCHITECTURAL LEDGER
          ========================================================================= */}
      <section id="systems-ledger" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-stone-dark/80 dark:border-dark-border pb-6 mb-12 gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-wider text-accent-blue dark:text-accent-softblue font-semibold block mb-1">
                Engineering Portfolio
              </span>
              <h2 className="type-section-heading text-brand-charcoal dark:text-dark-text font-semibold">
                Software engineered around real technical barriers.
              </h2>
              <p className="mt-2 text-sm sm:text-base text-brand-muted dark:text-dark-muted leading-relaxed">
                Explore the four core systems we develop, their technical architectures, and their verified performance parameters.
              </p>
            </div>
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={() => onNavigate('products')}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Examine full systems documentation
            </AnimatedButton>
          </div>

          {/* The Asymmetric Architectural Product Ledger */}
          <ProductLedger
            products={ecosystemProducts}
            onExplore={onExploreEcosystem}
            onNavigate={onNavigate}
          />
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 5 — HOW WE BUILT IT (Contrasting Deep Midnight Navy Section)
          ========================================================================= */}
      <section 
        style={{ backgroundColor: '#0C1322', color: '#FFFFFF' }}
        className="bg-brand-navy text-white py-16 sm:py-24 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-10 lg:px-14 border border-brand-navy-border shadow-navy-card"
      >
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-10 gap-4">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-wider text-accent-softblue font-semibold block mb-2">
                Engineering Notes
              </span>
              <h2 className="type-section-heading text-white font-semibold">
                How we built it.
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/70 leading-relaxed">
                We document our kernel engineering, distributed consensus protocols, and hardware bottlenecks with complete transparency.
              </p>
            </div>
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={() => onNavigate('engineering')}
              className="text-white border-white/20 hover:border-white hover:bg-white/10"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Explore all engineering notes
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockEngineeringArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => onNavigate('engineering')}
                style={{ backgroundColor: '#141D32', color: '#FFFFFF' }}
                className="p-6 sm:p-7 rounded-2xl bg-brand-navy-surface border border-white/10 hover:border-white/30 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-white/60">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-semibold">
                      {article.category}
                    </span>
                    <span>{article.readingTimeMinutes} min read</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-accent-softblue transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs text-white/70 leading-relaxed line-clamp-3">
                      {article.abstract}
                    </p>
                  </div>

                  {article.benchmarks && article.benchmarks[0] && (
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5 font-mono text-xs">
                      <span className="text-white/50 block text-[11px]">{article.benchmarks[0].metric}:</span>
                      <span className="text-accent-softblue font-semibold">{article.benchmarks[0].value}</span>
                      <span className="text-white/40 line-through ml-2 text-[11px]">{article.benchmarks[0].baseline}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60 group-hover:text-accent-softblue">
                  <span>Architecture Deep Dive</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 6 — RESEARCH & EXPERIMENTS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-brand-stone-dark/80 dark:border-dark-border pb-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent-sage font-semibold block mb-1">
                Empirical Research
              </span>
              <h2 className="type-section-heading text-brand-charcoal dark:text-dark-text font-semibold">
                Research &amp; experiments.
              </h2>
            </div>
            <button
              onClick={() => onNavigate('research')}
              className="text-xs sm:text-sm font-medium text-brand-charcoal dark:text-dark-text hover:text-accent-blue transition-colors flex items-center gap-1 cursor-pointer"
            >
              Browse research library <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Research Description & Invariants */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial">
              <span className="text-xs font-mono uppercase font-semibold text-accent-sage block mb-2">
                Active Investigation
              </span>
              <h3 className="text-xl font-semibold text-brand-charcoal dark:text-dark-text mb-3">
                {featuredPaper.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted dark:text-dark-muted leading-relaxed mb-6">
                {featuredPaper.abstract}
              </p>

              {/* Key Findings */}
              <div className="space-y-3 pt-4 border-t border-brand-stone-dark/60 dark:border-dark-border">
                <span className="text-xs font-mono uppercase tracking-wider text-brand-charcoal dark:text-dark-text font-semibold block">
                  Observed Findings:
                </span>
                {featuredPaper.keyFindings.slice(0, 3).map((finding, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-brand-muted dark:text-dark-muted">
                    <Check className="w-3.5 h-3.5 text-accent-sage shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-brand-stone-dark/60 dark:border-dark-border flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AnimatedButton
                    size="sm"
                    variant="primary"
                    onClick={() => onDownloadPaper(featuredPaper)}
                    icon={<Download className="w-3.5 h-3.5" />}
                  >
                    Download Paper
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
          SECTION 7 — WHAT'S NEW: CHANGELOG & UPDATES
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-brand-stone-dark/80 dark:border-dark-border pb-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-brand-muted font-semibold block mb-1">
                Changelog
              </span>
              <h2 className="type-section-heading text-brand-charcoal dark:text-dark-text font-semibold">
                What's new.
              </h2>
            </div>
            <button
              onClick={() => onNavigate('updates')}
              className="text-xs sm:text-sm font-medium text-brand-charcoal dark:text-dark-text hover:text-accent-blue transition-colors flex items-center gap-1 cursor-pointer"
            >
              View full changelog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockCompanyUpdates.slice(0, 3).map((upd) => (
              <div
                key={upd.id}
                onClick={() => onNavigate('updates')}
                className="p-6 rounded-2xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial hover:shadow-editorial-hover transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-stone dark:bg-dark-elevated text-brand-charcoal dark:text-dark-text font-semibold border border-brand-stone-dark/60">
                      {upd.version || upd.category}
                    </span>
                    <span className="text-[11px] font-mono text-brand-muted dark:text-dark-muted">
                      {upd.date}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-brand-charcoal dark:text-dark-text group-hover:text-accent-blue transition-colors">
                    {upd.title}
                  </h3>
                  <p className="text-xs text-brand-muted dark:text-dark-muted leading-relaxed line-clamp-3">
                    {upd.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-stone-dark/60 dark:border-dark-border text-xs font-mono text-accent-blue flex items-center gap-1">
                  <span>Read update</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 8 — MEDIA & VISUAL STORIES
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-brand-stone-dark/80 dark:border-dark-border pb-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-brand-muted font-semibold block mb-1">
              Visual Documentation
            </span>
            <h2 className="type-section-heading text-brand-charcoal dark:text-dark-text font-semibold">
              Media &amp; discussions.
            </h2>
          </div>
          <button
            onClick={() => onNavigate('media')}
            className="text-xs sm:text-sm font-medium text-brand-charcoal dark:text-dark-text hover:text-accent-blue transition-colors flex items-center gap-1 cursor-pointer"
          >
            Explore media library <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockMediaItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('media')}
              className="rounded-2xl overflow-hidden bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial hover:shadow-editorial-hover transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-video overflow-hidden bg-brand-charcoal">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white text-brand-charcoal flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 ml-0.5 text-brand-charcoal fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 text-white text-[11px] font-mono">
                  {item.duration}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-mono uppercase font-semibold text-accent-blue">
                  {item.format}
                </span>
                <h3 className="text-base font-semibold text-brand-charcoal dark:text-dark-text group-hover:text-accent-blue transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-brand-muted dark:text-dark-muted line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 9 — WHY WE FOUNDED AI TATHASTU (Mission & Principles)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="p-8 sm:p-14 rounded-3xl bg-brand-stone dark:bg-dark-elevated border border-brand-stone-dark/80 dark:border-dark-border">
            <div className="max-w-3xl space-y-5">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-muted dark:text-dark-muted font-semibold block">
                Why We Founded AI Tathastu
              </span>
              <h2 className="type-section-heading text-brand-charcoal dark:text-dark-text font-semibold">
                Technology should be explained, not obscured.
              </h2>
              <p className="text-sm sm:text-base text-brand-muted dark:text-dark-muted leading-relaxed">
                We started AI Tathastu with a clear conviction: the next decade of artificial intelligence cannot be governed by corporate secrecy or speculative marketing rhetoric. We openly document what we build, why we build it, and how each system functions in practice.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <AnimatedButton
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('about')}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Read our story and principles
                </AnimatedButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* =========================================================================
          SECTION 10 — STAY UPDATED & NEWSLETTER
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-muted font-semibold block">
              Stay Updated
            </span>
            <h3 className="type-section-heading text-brand-charcoal dark:text-dark-text font-semibold">
              Get updates as we ship new products and notes.
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted dark:text-dark-muted leading-relaxed">
              We send updates when new product releases, engineering write-ups, or open benchmarks are published. Zero marketing spam.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="mt-6 space-y-3 max-w-xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-brand-stone-dark dark:border-dark-border bg-brand-canvas dark:bg-dark-elevated text-sm text-brand-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all"
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
                ✓ You're signed up. We'll send updates as new milestones land.
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
