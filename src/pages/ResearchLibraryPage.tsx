import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Search, Filter, Sparkles, BookOpen, Download, Database, Check, SlidersHorizontal, X } from 'lucide-react';
import { ResearchPaper } from '../types';
import { ResearchCard } from '../components/cards/ResearchCard';
import { AnimatedChart } from '../components/motion/AnimatedChart';
import { Reveal } from '../components/motion/Reveal';
import { Badge } from '../components/ui/Badge';
import { AnimatedCounter } from '../components/motion/AnimatedCounter';
import { EDITORIAL_EASE, MOTION_DURATIONS } from '../lib/motion';

interface ResearchLibraryPageProps {
  papers: ResearchPaper[];
  onDownloadPaper: (paper: ResearchPaper) => void;
  onCopyBibtex: (paper: ResearchPaper) => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const ResearchLibraryPage: React.FC<ResearchLibraryPageProps> = ({
  papers,
  onDownloadPaper,
  onCopyBibtex,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTopic, setActiveTopic] = useState<string>('All');
  const shouldReduceMotion = useReducedMotion();

  const categories = ['All', 'Peer-Reviewed', 'Benchmark', 'Technical Report', 'Policy Brief'];
  const topics = ['All', 'Mechanistic Interpretability', 'Agentic Systems', 'Perceptual Intelligence', 'Governance & Safety', 'Inference Systems'];

  // Benchmark chart data for the library overview
  const benchmarkOverviewData = {
    title: 'Consensus Latency vs Agent Fleet Size (Aegis vs Vanilla LLM Voting)',
    subtitle: 'Milliseconds to deterministic Byzantine agreement (sub-200ms target).',
    xAxisLabel: 'Swarm Nodes',
    yAxisLabel: 'Latency in Milliseconds (p99)',
    points: [
      { label: '8 Nodes', value: 48, baseline: 110 },
      { label: '16 Nodes', value: 72, baseline: 245 },
      { label: '32 Nodes', value: 112, baseline: 490 },
      { label: '64 Nodes', value: 178, baseline: 890 },
    ],
  };

  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const matchesCategory = selectedCategory === 'All' || paper.category === selectedCategory;
      const matchesTopic = activeTopic === 'All' || paper.topic === activeTopic;
      const matchesQuery =
        searchQuery.trim() === '' ||
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesTopic && matchesQuery;
    });
  }, [papers, selectedCategory, activeTopic, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header and Mission */}
      <Reveal>
        <div className="max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-accent-violet block mb-2">
            Open Access Computational Science
          </span>
          <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
            Research Library &amp; Preprints
          </h1>
          <p className="mt-4 text-base sm:text-lg text-foundation-muted dark:text-dark-muted leading-relaxed">
            All manuscripts, benchmark evaluations, and synthetic theorem suites published by AI Tathastu Insights are deposited with permanent DOI identifiers, open weights, and reproducible evaluation harnesses.
          </p>
        </div>

        {/* Real-time Metric Counters (Phase 4.C Item 4) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-foundation-charcoal/10 dark:border-dark-border">
          <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-foundation-charcoal/10 dark:border-dark-border">
            <span className="text-2xl sm:text-3xl font-mono font-semibold text-foundation-charcoal dark:text-dark-text block">
              <AnimatedCounter to={papers.length} />
            </span>
            <span className="text-xs text-foundation-muted dark:text-dark-muted font-editorial-sans">
              Archived Manuscripts
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-foundation-charcoal/10 dark:border-dark-border">
            <span className="text-2xl sm:text-3xl font-mono font-semibold text-accent-violet block">
              <AnimatedCounter to={99.4} decimals={1} suffix="%" />
            </span>
            <span className="text-xs text-foundation-muted dark:text-dark-muted font-editorial-sans">
              Replication Rate
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-foundation-charcoal/10 dark:border-dark-border">
            <span className="text-2xl sm:text-3xl font-mono font-semibold text-foundation-charcoal dark:text-dark-text block">
              <AnimatedCounter to={22380} />
            </span>
            <span className="text-xs text-foundation-muted dark:text-dark-muted font-editorial-sans">
              Total PDF Reads
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-foundation-charcoal/10 dark:border-dark-border">
            <span className="text-2xl sm:text-3xl font-mono font-semibold text-green-600 dark:text-green-400 block">
              100%
            </span>
            <span className="text-xs text-foundation-muted dark:text-dark-muted font-editorial-sans">
              CC BY-NC 4.0 Open
            </span>
          </div>
        </div>
      </Reveal>

      {/* Featured Data Visualization (Phase 4.C item 4: Chart and data visualisation reveal) */}
      <Reveal>
        <div className="my-8">
          <AnimatedChart data={benchmarkOverviewData} type="bar" />
        </div>
      </Reveal>

      {/* Search and Category Filter Bar */}
      <div className="sticky top-20 z-30 bg-foundation-ivory/95 dark:bg-dark-bg/95 backdrop-blur-md p-4 rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-foundation-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across titles, abstracts, authors, and arXiv IDs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-foundation-charcoal/20 dark:border-dark-border bg-white dark:bg-dark-surface text-sm text-foundation-charcoal dark:text-dark-text placeholder:text-foundation-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-violet transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foundation-muted hover:text-foundation-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills (Phase 4.C item 1: Smooth category and filter transitions) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-foundation-charcoal text-white dark:bg-white dark:text-foundation-charcoal shadow-sm'
                      : 'bg-white dark:bg-dark-surface text-foundation-muted hover:text-foundation-charcoal border border-foundation-charcoal/10 dark:border-dark-border'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono pt-1 border-t border-foundation-charcoal/5 dark:border-dark-border">
          <span className="text-foundation-muted dark:text-dark-muted shrink-0 text-[11px]">
            Topic Focus:
          </span>
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTopic(t)}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTopic === t
                  ? 'bg-accent-lavender text-accent-violet dark:bg-accent-violet/20 font-semibold'
                  : 'text-foundation-muted hover:text-foundation-charcoal dark:hover:text-dark-text'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Indicators (Phase 4.C item 6) */}
      {(selectedCategory !== 'All' || activeTopic !== 'All' || searchQuery !== '') && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-foundation-muted font-mono">Active Filters:</span>
          {selectedCategory !== 'All' && (
            <Badge accent="violet" size="sm">
              Category: {selectedCategory}
            </Badge>
          )}
          {activeTopic !== 'All' && (
            <Badge accent="softblue" size="sm">
              Topic: {activeTopic}
            </Badge>
          )}
          {searchQuery && (
            <Badge accent="neutral" size="sm">
              Query: "{searchQuery}"
            </Badge>
          )}
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveTopic('All');
              setSearchQuery('');
            }}
            className="text-xs text-red-500 hover:underline font-mono ml-2 cursor-pointer"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Results List without layout shifts (Phase 4.C item 2) */}
      <div className="space-y-6">
        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredPapers.map((paper) => (
              <ResearchCard
                key={paper.id}
                paper={paper}
                onDownload={onDownloadPaper}
                onCopyBibtex={onCopyBibtex}
              />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border">
            <BookOpen className="w-10 h-10 text-foundation-muted mx-auto mb-3 opacity-60" />
            <h3 className="font-editorial-serif text-2xl text-foundation-charcoal dark:text-dark-text">
              No matching research manuscripts found
            </h3>
            <p className="text-xs text-foundation-muted dark:text-dark-muted mt-2 max-w-sm mx-auto leading-relaxed">
              Try adjusting your topic tags, keywords, or reset filters to view all archived papers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
