import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Sparkles, BookOpen, Layers, ArrowUpRight, ShieldCheck, Cpu } from 'lucide-react';
import { Article, ResearchPaper, EcosystemProduct } from '../types';
import { StoryCard } from '../components/cards/StoryCard';
import { ResearchCard } from '../components/cards/ResearchCard';
import { EcosystemCard } from '../components/cards/EcosystemCard';
import { Reveal } from '../components/motion/Reveal';
import { StaggerContainer, StaggerItem } from '../components/motion/StaggerContainer';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { Badge } from '../components/ui/Badge';
import { NavTab } from '../components/layout/Navbar';
import { EDITORIAL_EASE, MOTION_DURATIONS, heroHeadlineVariants, heroImageVariants } from '../lib/motion';

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
  const shouldReduceMotion = useReducedMotion();
  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];
  const regularArticles = articles.filter((a) => a.id !== featuredArticle.id);

  // Headlines lines for line-by-line reveal
  const headlineLines = [
    'Empirical Investigations into',
    'Frontier Intelligence &',
    'Mechanistic Safety.',
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        {/* Subtle background ambient gradient (Phase 4.A item 8: restrained gradient transitions) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-accent-lavender/30 via-accent-softblue/15 to-transparent dark:from-accent-violet/10 dark:via-transparent dark:to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Line-by-line Headline Reveal & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-lavender/70 dark:bg-accent-violet/20 border border-accent-violet/20 text-accent-violet dark:text-accent-lavender text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Volume 4 • Fall/Winter 2026 Series</span>
              </div>

              {/* 1. Hero headline: line-by-line reveal */}
              <div className="space-y-1">
                {headlineLines.map((line, idx) => (
                  <div key={idx} className="overflow-hidden">
                    <motion.h1
                      custom={idx}
                      variants={shouldReduceMotion ? {} : heroHeadlineVariants}
                      initial="hidden"
                      animate="visible"
                      className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-foundation-charcoal dark:text-dark-text font-normal"
                    >
                      {line}
                    </motion.h1>
                  </div>
                ))}
              </div>

              {/* 2. Supporting description: delayed fade-in */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: MOTION_DURATIONS.sectionReveal,
                  delay: 0.35,
                  ease: EDITORIAL_EASE,
                }}
                className="text-base sm:text-lg text-foundation-muted dark:text-dark-muted max-w-2xl leading-relaxed font-editorial-sans"
              >
                AI Tathastu Insights publishes rigorous research at the frontier of machine learning. We deconstruct residual representations, prove fault-tolerant agent protocols, and advance grounded spatial vision without speculative hype.
              </motion.p>

              {/* 3. CTA buttons: subtle entrance with a small upward movement */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: MOTION_DURATIONS.sectionReveal,
                  delay: 0.5,
                  ease: EDITORIAL_EASE,
                }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  onClick={() => onSelectArticle(featuredArticle)}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Read Lead Investigation
                </AnimatedButton>

                <AnimatedButton
                  variant="outline"
                  size="lg"
                  onClick={() => onNavigate('research')}
                  icon={<BookOpen className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Browse Research Library
                </AnimatedButton>
              </motion.div>

              {/* Publication metadata stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="pt-6 border-t border-foundation-charcoal/10 dark:border-dark-border grid grid-cols-3 gap-4 max-w-lg text-xs font-mono text-foundation-muted dark:text-dark-muted"
              >
                <div>
                  <span className="block text-lg font-semibold text-foundation-charcoal dark:text-dark-text">
                    16M
                  </span>
                  <span>SAE Features Audited</span>
                </div>
                <div>
                  <span className="block text-lg font-semibold text-foundation-charcoal dark:text-dark-text">
                    178ms
                  </span>
                  <span>Swarm Consensus (p99)</span>
                </div>
                <div>
                  <span className="block text-lg font-semibold text-foundation-charcoal dark:text-dark-text">
                    100%
                  </span>
                  <span>Open Verification</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Hero image with gentle scale 1.04 to 1 */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-foundation-charcoal/10 dark:border-dark-border shadow-2xl bg-foundation-charcoal aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]">
                <motion.img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  variants={shouldReduceMotion ? {} : heroImageVariants}
                  initial="hidden"
                  animate="visible"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foundation-charcoal/90 via-foundation-charcoal/30 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge accent="violet" size="xs">
                      {featuredArticle.topicTag}
                    </Badge>
                    <span className="text-[11px] font-mono opacity-80">
                      {featuredArticle.author.name}
                    </span>
                  </div>
                  <h2 className="font-editorial-serif text-2xl sm:text-3xl font-medium leading-tight">
                    {featuredArticle.title}
                  </h2>
                  <p className="mt-2 text-xs opacity-80 line-clamp-2">
                    {featuredArticle.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED STORY: SCROLL-TRIGGERED REVEAL (Phase 4.A item 5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-foundation-charcoal/10 dark:border-dark-border pb-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent-violet block">
                Editor's Selection
              </span>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
                Lead Research Investigation
              </h2>
            </div>
            <button
              onClick={() => onSelectArticle(featuredArticle)}
              className="text-xs sm:text-sm font-medium text-accent-violet hover:underline flex items-center gap-1 cursor-pointer"
            >
              Full Manuscript &amp; Datasets <ArrowRight className="w-3.5 h-3.5" />
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

      {/* LATEST STORIES: STAGGERED CARD ENTRANCE (Phase 4.A item 6) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-foundation-charcoal/10 dark:border-dark-border pb-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-foundation-muted dark:text-dark-muted block">
              Continuous Dispatches
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
              Latest Peer-Reviewed Articles
            </h2>
          </div>
          <button
            onClick={() => onNavigate('discover')}
            className="text-xs sm:text-sm font-medium text-foundation-charcoal dark:text-dark-text hover:text-accent-violet transition-colors flex items-center gap-1 cursor-pointer"
          >
            Explore all 24 topics <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {regularArticles.map((article) => (
            <StaggerItem key={article.id}>
              <StoryCard
                article={article}
                onSelect={onSelectArticle}
                onBookmark={onToggleBookmark}
                isBookmarked={bookmarkedIds.includes(article.id)}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ECOSYSTEM SPOTLIGHT SECTION (MentorMaze, Collaborate, Avsar, Iris) */}
      <section className="bg-foundation-charcoal text-white dark:bg-dark-surface py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-10 lg:px-16 border border-foundation-charcoal/20 dark:border-dark-border">
        <Reveal>
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono text-accent-lavender tracking-wider uppercase block mb-2">
              The Tathastu Platform
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-5xl tracking-tight font-normal">
              Applied Laboratories &amp; Research Systems
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed">
              Our editorial journalism is inextricably linked with living tools. Discover how our open-source platforms turn theoretical interpretability, swarm consensus, and spatial vision into accessible infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onExploreEcosystem(product)}
                className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-accent-lavender uppercase">
                      {product.badge}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <h3 className="font-editorial-serif text-2xl font-medium tracking-tight mb-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {product.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-white/50">
                  {product.stats[0]?.label}: <span className="text-white font-medium">{product.stats[0]?.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-end">
            <AnimatedButton
              variant="outline"
              size="md"
              className="text-white border-white/20 hover:border-white"
              onClick={() => onNavigate('ecosystem')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Full Ecosystem Architecture
            </AnimatedButton>
          </div>
        </Reveal>
      </section>

      {/* RESEARCH LIBRARY HIGHLIGHT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-foundation-charcoal/10 dark:border-dark-border pb-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent-violet block">
                Open Access Archive
              </span>
              <h2 className="font-editorial-serif text-3xl sm:text-4xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
                Preprints &amp; Technical Reports
              </h2>
            </div>
            <button
              onClick={() => onNavigate('research')}
              className="text-xs sm:text-sm font-medium text-accent-violet hover:underline flex items-center gap-1 cursor-pointer"
            >
              View all preprints <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {papers.slice(0, 2).map((paper) => (
              <ResearchCard
                key={paper.id}
                paper={paper}
                onDownload={onDownloadPaper}
                onCopyBibtex={onCopyBibtex}
              />
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
};
