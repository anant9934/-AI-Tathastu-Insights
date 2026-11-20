import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Sparkles, BookOpen, Layers, ArrowUpRight, ShieldCheck, Cpu, Flame, Compass } from 'lucide-react';
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
  const secondaryArticles = articles.filter((a) => a.id !== featuredArticle.id);
  const featuredPaper = papers[0];

  const headlineLines = [
    'Empirical Investigations into',
    'Frontier Intelligence &',
    'Mechanistic Safety.',
  ];

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left: Deliberate Editorial Headline & Statement */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-lavender text-accent-violet dark:bg-accent-violet/20 dark:text-accent-lavender text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Volume 4 • Fall/Winter 2026 Series</span>
              </div>

              {/* Line-by-line reveal with controlled line length */}
              <div className="space-y-0.5 max-w-3xl">
                {headlineLines.map((line, idx) => (
                  <div key={idx} className="overflow-hidden">
                    <motion.h1
                      custom={idx}
                      variants={shouldReduceMotion ? {} : heroHeadlineVariants}
                      initial="hidden"
                      animate="visible"
                      className="type-hero text-foundation-ink dark:text-dark-ink font-normal"
                    >
                      {line}
                    </motion.h1>
                  </div>
                ))}
              </div>

              {/* Delayed Supporting Description */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: MOTION_DURATIONS.sectionReveal,
                  delay: 0.35,
                  ease: EDITORIAL_EASE,
                }}
                className="type-body text-foundation-secondary dark:text-dark-secondary max-w-2xl"
              >
                An independent research publication exploring mechanistic interpretability, decentralized swarm arbitration, and embodied spatial memory. Every finding is verifiable with open checkpoints and reproducible evaluation suites.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
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

              {/* Publication Telemetry */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="pt-6 border-t border-foundation-border dark:border-dark-border grid grid-cols-3 gap-6 max-w-lg type-meta text-foundation-secondary dark:text-dark-secondary"
              >
                <div>
                  <span className="block text-xl font-bold font-mono text-foundation-ink dark:text-dark-ink">
                    16M
                  </span>
                  <span>SAE Latents Audited</span>
                </div>
                <div>
                  <span className="block text-xl font-bold font-mono text-foundation-ink dark:text-dark-ink">
                    178ms
                  </span>
                  <span>Swarm Latency (p99)</span>
                </div>
                <div>
                  <span className="block text-xl font-bold font-mono text-foundation-ink dark:text-dark-ink">
                    100%
                  </span>
                  <span>Open Verification</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Balanced Featured Artwork with Editorial Framing */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-foundation-border dark:border-dark-border shadow-xl bg-foundation-ink aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] group">
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
                    <Badge accent="violet" size="xs">
                      {featuredArticle.topicTag}
                    </Badge>
                    <span className="text-[11px] font-mono opacity-80">
                      {featuredArticle.author.name}
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

      {/* 2. LEAD INVESTIGATION FEATURED SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between border-b border-foundation-border dark:border-dark-border pb-4 mb-8">
            <div>
              <span className="type-meta text-accent-violet block uppercase">
                Editor's Selection
              </span>
              <h2 className="type-section-heading text-foundation-ink dark:text-dark-ink">
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

      {/* 3. VARIED EDITORIAL LAYOUT: TWO-COLUMN DISPATCH SPLIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-foundation-border dark:border-dark-border pb-4 mb-8">
          <div>
            <span className="type-meta text-foundation-secondary dark:text-dark-secondary block uppercase">
              Current Dispatch
            </span>
            <h2 className="type-section-heading text-foundation-ink dark:text-dark-ink">
              Recent Preprints &amp; Perspectives
            </h2>
          </div>
          <button
            onClick={() => onNavigate('discover')}
            className="text-xs sm:text-sm font-medium text-foundation-ink dark:text-dark-ink hover:text-accent-violet transition-colors flex items-center gap-1 cursor-pointer"
          >
            Explore all topics <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Featured Research Preprint Card (Left 6 cols) */}
          <div className="lg:col-span-6">
            {featuredPaper && (
              <ResearchCard
                paper={featuredPaper}
                onDownload={onDownloadPaper}
                onCopyBibtex={onCopyBibtex}
              />
            )}
          </div>

          {/* Horizontal Story Cards (Right 6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {secondaryArticles.slice(0, 2).map((article) => (
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

      {/* 4. THREE-COLUMN CONTINUOUS DISPATCH GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-foundation-border dark:border-dark-border pb-4 mb-8">
          <div>
            <span className="type-meta text-accent-violet block uppercase">
              Peer-Reviewed Series
            </span>
            <h2 className="type-section-heading text-foundation-ink dark:text-dark-ink">
              Selected Inquiries Across Frontier Systems
            </h2>
          </div>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {secondaryArticles.slice(2).map((article) => (
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

      {/* 5. ECOSYSTEM SPOTLIGHT WITH DISTINCT PRODUCT TREATMENTS */}
      <section className="bg-foundation-ink text-white dark:bg-dark-surface py-16 sm:py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-10 lg:px-14 border border-foundation-border/20 dark:border-dark-border">
        <Reveal>
          <div className="max-w-3xl mb-12">
            <span className="type-meta text-accent-lavender tracking-wider uppercase block mb-2">
              The Tathastu Platform
            </span>
            <h2 className="type-section-heading text-white font-normal">
              Applied Laboratories &amp; Research Systems
            </h2>
            <p className="mt-4 type-body text-white/70 leading-relaxed">
              Our research is married to living software. Discover how our open-source platforms turn theoretical interpretability, swarm consensus, and spatial vision into accessible infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemProducts.map((product) => {
              const borderAccent = {
                mentormaze: 'hover:border-accent-violet',
                collaborate: 'hover:border-accent-blue',
                avsar: 'hover:border-accent-terracotta',
                iris: 'hover:border-accent-mint',
              }[product.id] || 'hover:border-white/40';

              return (
                <div
                  key={product.id}
                  onClick={() => onExploreEcosystem(product)}
                  className={`p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group flex flex-col justify-between ${borderAccent}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="type-meta text-accent-lavender uppercase">
                        {product.badge}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <h3 className="type-card-heading text-white font-medium mb-2">
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
              );
            })}
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

      {/* 6. REFINED INSTITUTIONAL DISPATCH NEWSLETTER (Section 4.A) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
          <div className="max-w-2xl space-y-3">
            <span className="type-meta text-accent-violet uppercase tracking-widest block">
              Fortnightly Peer Dispatch
            </span>
            <h3 className="type-section-heading text-foundation-ink dark:text-dark-ink">
              Read verified research before public preprint distribution.
            </h3>
            <p className="type-secondary leading-relaxed">
              We send concise summaries of verified residual circuits, multi-agent benchmarks, and statutory policy standards every second Tuesday. Zero promotional filler.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Subscribed to Tathastu Dispatch.');
            }}
            className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl"
          >
            <input
              type="email"
              required
              placeholder="name@institution.edu"
              className="flex-1 px-4 py-3 rounded-xl border border-foundation-border dark:border-dark-border bg-foundation-paper dark:bg-dark-elevated text-sm text-foundation-ink dark:text-dark-ink focus:outline-none focus:ring-2 focus:ring-accent-violet"
            />
            <AnimatedButton
              type="submit"
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Subscribe
            </AnimatedButton>
          </form>
        </div>
      </section>
    </div>
  );
};
