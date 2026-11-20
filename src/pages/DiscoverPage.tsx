import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Search, Compass, BookOpen, ArrowRight, Tag, Sparkles, Network, Eye, ShieldCheck, Cpu, GitBranch, Layers } from 'lucide-react';
import { Article, Topic } from '../types';
import { StoryCard } from '../components/cards/StoryCard';
import { Badge } from '../components/ui/Badge';
import { Reveal } from '../components/motion/Reveal';
import { StaggerContainer, StaggerItem } from '../components/motion/StaggerContainer';
import { EDITORIAL_EASE, MOTION_DURATIONS } from '../lib/motion';

interface DiscoverPageProps {
  topics: Topic[];
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (e: React.MouseEvent, article: Article) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  topics,
  articles,
  onSelectArticle,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const shouldReduceMotion = useReducedMotion();

  const selectedTopic = topics.find((t) => t.slug === selectedTopicSlug);

  const filteredArticles = articles.filter((article) => {
    const matchesTopic =
      selectedTopicSlug === 'all' ||
      article.topicTag.toLowerCase().includes(selectedTopicSlug.toLowerCase()) ||
      article.category.toLowerCase().includes(selectedTopicSlug.toLowerCase());
    
    const matchesQuery =
      searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTopic && matchesQuery;
  });

  // Meaningful topic architectural schematic diagrams (Section 4.C)
  const renderTopicSchematic = (slug: string) => {
    switch (slug) {
      case 'interpretability':
        return (
          <svg className="w-16 h-16 text-[#7955D5]/70" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="12" width="48" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M16 20 L24 40 M32 20 L32 40 M48 20 L40 40" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="24" cy="44" r="4" fill="currentColor" />
            <circle cx="32" cy="44" r="4" fill="currentColor" />
            <circle cx="40" cy="44" r="4" fill="currentColor" />
          </svg>
        );
      case 'agentic-systems':
        return (
          <svg className="w-16 h-16 text-[#4775C9]/70" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="18" r="5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="44" r="5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="48" cy="44" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M28 21 L19 40 M36 21 L45 40 M21 44 L43 44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="32" cy="34" r="2" fill="currentColor" />
          </svg>
        );
      case 'perceptual-intelligence':
        return (
          <svg className="w-16 h-16 text-[#368A70]/70" viewBox="0 0 64 64" fill="none">
            <path d="M32 10 L52 22 L32 34 L12 22 Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 22 L12 42 L32 54 L52 42 L52 22" stroke="currentColor" strokeWidth="1.5" />
            <path d="M32 34 L32 54" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="32" cy="34" r="3" fill="currentColor" />
          </svg>
        );
      case 'governance-policy':
        return (
          <svg className="w-16 h-16 text-[#C58B35]/70" viewBox="0 0 64 64" fill="none">
            <path d="M32 10 L48 18 V32 C48 44 32 54 32 54 C32 54 16 44 16 32 V18 Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M26 32 L30 36 L38 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'inference-systems':
        return (
          <svg className="w-16 h-16 text-[#D9785D]/70" viewBox="0 0 64 64" fill="none">
            <rect x="12" y="16" width="18" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <rect x="34" y="16" width="18" height="32" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M18 24 H24 M18 32 H24 M40 24 H46" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case 'reasoning-models':
      default:
        return (
          <svg className="w-16 h-16 text-[#C58B35]/70" viewBox="0 0 64 64" fill="none">
            <path d="M32 14 V50 M20 26 L32 14 L44 26" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 42 H48" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="32" cy="50" r="3" fill="currentColor" />
          </svg>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <Reveal>
        <div className="max-w-3xl">
          <span className="type-meta text-accent-violet block uppercase mb-2">
            Research Taxonomy &amp; Axes
          </span>
          <h1 className="type-page-headline text-foundation-ink dark:text-dark-ink font-normal">
            Discover Inquiries &amp; Topics
          </h1>
          <p className="type-body text-foundation-secondary dark:text-dark-secondary mt-3 leading-relaxed">
            Navigate through our 6 core research axes. Every inquiry represents an active empirical thread led by resident investigators and open academic collaborators.
          </p>
        </div>
      </Reveal>

      {/* Search Bar with Focus Micro-Interactions */}
      <div className="relative max-w-2xl">
        <Search className="w-5 h-5 text-foundation-secondary absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter stories across topics, keywords, authors..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-foundation-border dark:border-dark-border bg-white dark:bg-dark-surface text-base text-foundation-ink dark:text-dark-ink placeholder:text-foundation-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent-violet transition-all shadow-editorial"
        />
      </div>

      {/* Carefully Composed Topic Layouts (Section 4.C) */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="type-meta text-foundation-secondary uppercase">
            Select Exploration Axis
          </h2>
          {selectedTopicSlug !== 'all' && (
            <button
              onClick={() => setSelectedTopicSlug('all')}
              className="text-xs text-accent-violet hover:underline font-mono cursor-pointer"
            >
              Reset to All Disciplines
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* All Disciplines Master Card */}
          <button
            onClick={() => setSelectedTopicSlug('all')}
            className={`p-6 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedTopicSlug === 'all'
                ? 'bg-foundation-ink text-foundation-paper dark:bg-white dark:text-foundation-ink border-foundation-ink dark:border-white shadow-md'
                : 'bg-white dark:bg-dark-surface text-foundation-ink dark:text-dark-ink border-foundation-border dark:border-dark-border hover:border-foundation-ink/30'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="type-meta opacity-80 uppercase">All Disciplines</span>
                <span className="type-meta px-2 py-0.5 rounded bg-white/20 dark:bg-black/10">
                  {articles.length} publications
                </span>
              </div>
              <h3 className="type-card-heading font-medium">
                Complete Editorial Archive
              </h3>
              <p className="mt-2 text-xs opacity-75 line-clamp-2 leading-relaxed">
                Cross-disciplinary investigations spanning interpretability, swarms, vision, and governance.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-mono">
              <span>Full Journal Scope</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Individual Semantic Topic Cards */}
          {topics.map((topic) => {
            const isSelected = selectedTopicSlug === topic.slug;
            const softSurfaces = {
              interpretability: 'hover:bg-accent-lavender/30',
              'agentic-systems': 'hover:bg-accent-softblue/30',
              'perceptual-intelligence': 'hover:bg-accent-mint/30',
              'governance-policy': 'hover:bg-accent-butter/30',
              'inference-systems': 'hover:bg-accent-peach/30',
              'reasoning-models': 'hover:bg-accent-butter/30',
            }[topic.slug] || '';

            return (
              <motion.button
                key={topic.id}
                onClick={() => setSelectedTopicSlug(topic.slug)}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                transition={{ duration: 0.2 }}
                className={`p-6 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-dark-surface border-accent-violet ring-2 ring-accent-violet shadow-md'
                    : `bg-white dark:bg-dark-surface border-foundation-border dark:border-dark-border ${softSurfaces}`
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge accent={topic.accentColor} size="xs">
                      {topic.name.split(' ')[0]}
                    </Badge>
                    <span className="type-meta text-foundation-secondary dark:text-dark-secondary">
                      {topic.count} items
                    </span>
                  </div>

                  <h3 className="type-card-heading text-foundation-ink dark:text-dark-ink font-medium">
                    {topic.name}
                  </h3>

                  <p className="mt-2 text-xs text-foundation-secondary dark:text-dark-secondary line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-foundation-border/60 dark:border-dark-border flex items-center justify-between">
                  {renderTopicSchematic(topic.slug)}
                  <span className="text-xs font-mono text-accent-violet flex items-center gap-1 group-hover:underline">
                    Inquire <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Topic Deep Dive Banner */}
      {selectedTopic && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-accent-violet/30 shadow-editorial flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="type-meta text-accent-violet uppercase">
                Active Research Focus
              </span>
              <Badge accent={selectedTopic.accentColor} size="xs">
                Filter Engaged
              </Badge>
            </div>
            <h2 className="type-section-heading text-foundation-ink dark:text-dark-ink">
              {selectedTopic.name}
            </h2>
            <p className="type-secondary text-xs sm:text-sm mt-1">
              {selectedTopic.description}
            </p>
          </div>

          <button
            onClick={() => setSelectedTopicSlug('all')}
            className="type-meta text-accent-violet hover:underline shrink-0"
          >
            Clear Topic Filter
          </button>
        </motion.div>
      )}

      {/* Filtered Stories List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between type-meta text-foundation-secondary dark:text-dark-secondary border-b border-foundation-border dark:border-dark-border pb-3">
          <span>Displaying {filteredArticles.length} curated publications</span>
          <span>Sort: Editorial Priority</span>
        </div>

        {filteredArticles.length > 0 ? (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article) => (
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
        ) : (
          <div className="p-16 text-center bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border">
            <Compass className="w-10 h-10 text-foundation-secondary mx-auto mb-3 opacity-60" />
            <h3 className="type-card-heading text-foundation-ink dark:text-dark-ink">
              No matching stories for this criteria
            </h3>
            <p className="type-secondary text-xs mt-2 max-w-sm mx-auto">
              Clear the search term or choose a different research topic above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
