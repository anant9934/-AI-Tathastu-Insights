import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Layers, 
  ArrowUpRight, 
  ShieldCheck, 
  Cpu, 
  Flame, 
  Compass,
  GraduationCap,
  Users,
  Award,
  Eye,
  Check
} from 'lucide-react';
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
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-foundation-border dark:border-dark-border pb-6 mb-8 gap-4">
            <div className="max-w-2xl">
              <span className="type-meta text-accent-violet block uppercase mb-1">
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
              Explore Full Architecture
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
                borderClass: 'border-foundation-border hover:border-foundation-ink',
                iconBg: 'bg-foundation-paper',
                iconColor: 'text-foundation-ink',
                badgeClass: 'bg-foundation-paper text-foundation-secondary',
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

      {/* 6. REFINED INSTITUTIONAL DISPATCH NEWSLETTER (Section 4.A) */}
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setNewsletterSubscribed(true);
              setTimeout(() => {
                setNewsletterEmail('');
                setNewsletterSubscribed(false);
              }, 4000);
            }}
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
            {newsletterSubscribed && (
              <p className="text-xs font-mono text-green-600 dark:text-green-400">
                ✓ Dispatch confirmed. Volume 26 will arrive in your institutional inbox.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};
