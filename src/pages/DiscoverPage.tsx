import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Search, Compass, BookOpen, ArrowRight, Tag, Sparkles } from 'lucide-react';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <Reveal>
        <div className="max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-accent-violet block mb-2">
            Editorial Taxonomy
          </span>
          <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
            Discover Inquiries &amp; Topics
          </h1>
          <p className="mt-4 text-base sm:text-lg text-foundation-muted dark:text-dark-muted leading-relaxed">
            Navigate through our 6 core research axes. Every inquiry represents an active empirical thread led by our resident investigators and open academic collaborators.
          </p>
        </div>
      </Reveal>

      {/* 1. Search focus transitions & Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="w-5 h-5 text-foundation-muted absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter stories across topics, keywords, authors..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-foundation-charcoal/20 dark:border-dark-border bg-white dark:bg-dark-surface text-base text-foundation-charcoal dark:text-dark-text placeholder:text-foundation-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-violet focus:border-transparent transition-all shadow-sm"
        />
      </div>

      {/* 2. Topic Cards Grid with Active Category Selection Animation */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-mono uppercase tracking-wider text-foundation-muted dark:text-dark-muted">
            Select Exploration Axis
          </h2>
          {selectedTopicSlug !== 'all' && (
            <button
              onClick={() => setSelectedTopicSlug('all')}
              className="text-xs text-accent-violet hover:underline font-mono cursor-pointer"
            >
              View All Topics
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedTopicSlug('all')}
            className={`p-6 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedTopicSlug === 'all'
                ? 'bg-foundation-charcoal text-white dark:bg-white dark:text-foundation-charcoal border-foundation-charcoal dark:border-white shadow-md'
                : 'bg-white dark:bg-dark-surface text-foundation-charcoal dark:text-dark-text border-foundation-charcoal/10 dark:border-dark-border hover:border-foundation-charcoal/30'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono opacity-80 uppercase">All Disciplines</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/20 dark:bg-black/10">
                {articles.length} stories
              </span>
            </div>
            <h3 className="font-editorial-serif text-2xl font-medium tracking-tight">
              Complete Editorial Archive
            </h3>
            <p className="mt-2 text-xs opacity-75 line-clamp-2">
              Cross-disciplinary investigations spanning interpretability, swarms, vision, and governance.
            </p>
          </button>

          {topics.map((topic) => {
            const isSelected = selectedTopicSlug === topic.slug;
            return (
              <motion.button
                key={topic.id}
                onClick={() => setSelectedTopicSlug(topic.slug)}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                transition={{ duration: 0.2 }}
                className={`p-6 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-accent-lavender text-accent-violet dark:bg-accent-violet/20 dark:text-accent-lavender border-accent-violet shadow-sm'
                    : 'bg-white dark:bg-dark-surface text-foundation-charcoal dark:text-dark-text border-foundation-charcoal/10 dark:border-dark-border hover:border-foundation-charcoal/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge accent={topic.accentColor} size="xs">
                    {topic.name.split(' ')[0]}
                  </Badge>
                  <span className="text-xs font-mono text-foundation-muted dark:text-dark-muted">
                    {topic.count} items
                  </span>
                </div>
                <h3 className="font-editorial-serif text-2xl font-medium tracking-tight">
                  {topic.name}
                </h3>
                <p className="mt-2 text-xs text-foundation-muted dark:text-dark-muted line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Topic Banner & Active Category Indicator */}
      {selectedTopic && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-accent-lavender/30 dark:bg-accent-violet/10 border border-accent-violet/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-accent-violet uppercase tracking-wider">
                Active Focus Area
              </span>
              <Badge accent={selectedTopic.accentColor} size="xs">
                Filter Engaged
              </Badge>
            </div>
            <h2 className="font-editorial-serif text-2xl text-foundation-charcoal dark:text-dark-text">
              {selectedTopic.name}
            </h2>
            <p className="text-xs text-foundation-muted dark:text-dark-muted mt-1">
              {selectedTopic.description}
            </p>
          </div>

          <button
            onClick={() => setSelectedTopicSlug('all')}
            className="text-xs font-mono text-accent-violet hover:underline shrink-0"
          >
            Clear Topic Filter
          </button>
        </motion.div>
      )}

      {/* 4. Story-card entrance & Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-foundation-muted dark:text-dark-muted border-b border-foundation-charcoal/10 dark:border-dark-border pb-3">
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
          <div className="p-16 text-center bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border">
            <Compass className="w-10 h-10 text-foundation-muted mx-auto mb-3 opacity-60" />
            <h3 className="font-editorial-serif text-2xl text-foundation-charcoal dark:text-dark-text">
              No matching stories for this criteria
            </h3>
            <p className="text-xs text-foundation-muted dark:text-dark-muted mt-2 max-w-sm mx-auto">
              Clear the search term or choose a different research topic above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
