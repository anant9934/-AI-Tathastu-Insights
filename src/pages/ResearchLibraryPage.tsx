import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Search, Filter, Sparkles, BookOpen, Download, Database, Check, SlidersHorizontal, X, BarChart2 } from 'lucide-react';
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
  const [activeBenchmark, setActiveBenchmark] = useState<'latency' | 'interpretability'>('latency');
  const shouldReduceMotion = useReducedMotion();

  const categories = ['All', 'Peer-Reviewed', 'Benchmark', 'Technical Report', 'Policy Brief'];
  const topics = ['All', 'Mechanistic Interpretability', 'Agentic Systems', 'Perceptual Intelligence', 'Governance & Safety', 'Inference Systems'];

  // Two high-fidelity empirical benchmarks (Section 4.B)
  const benchmarkDatasets = {
    latency: {
      title: 'Consensus Latency vs Agent Fleet Size (p99)',
      subtitle: 'Comparison between Aegis-BFT token-bounded protocol vs Vanilla LLM multi-turn debate.',
      xAxisLabel: 'Swarm Nodes (Active Debaters)',
      yAxisLabel: 'Latency in Milliseconds (p99)',
      primaryDatasetLabel: 'Aegis-BFT Protocol',
      baselineDatasetLabel: 'Recursive LLM Voting',
      unit: 'ms',
      points: [
        { label: '8 Nodes', value: 48, baseline: 110 },
        { label: '16 Nodes', value: 72, baseline: 245 },
        { label: '32 Nodes', value: 112, baseline: 490 },
        { label: '64 Nodes', value: 178, baseline: 890 },
      ],
    },
    interpretability: {
      title: 'Monosemantic Feature Purity vs Latent Dictionary Size',
      subtitle: 'Percentage of isolated monosemantic circuits identified across 70B parameter models.',
      xAxisLabel: 'Dictionary Expansion (k / d_model)',
      yAxisLabel: 'Monosemantic Precision Rate (%)',
      primaryDatasetLabel: 'Top-K Sparse Autoencoder',
      baselineDatasetLabel: 'L1-Regularized Baseline',
      unit: '%',
      points: [
        { label: '4x Expansion', value: 61.4, baseline: 42.0 },
        { label: '8x Expansion', value: 74.8, baseline: 42.0 },
        { label: '16x Expansion', value: 86.2, baseline: 42.0 },
        { label: '32x Expansion', value: 92.1, baseline: 42.0 },
        { label: '64x Expansion', value: 94.2, baseline: 42.0 },
      ],
    },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header and Telemetry */}
      <Reveal>
        <div className="max-w-3xl">
          <span className="type-meta text-accent-violet block uppercase mb-2">
            Open Access Computational Archive
          </span>
          <h1 className="type-page-headline text-foundation-ink dark:text-dark-ink font-normal">
            Research Library &amp; Preprints
          </h1>
          <p className="type-body text-foundation-secondary dark:text-dark-secondary mt-3 leading-relaxed">
            All manuscripts, benchmark evaluations, and synthetic theorem suites published by AI Tathastu Insights are deposited with permanent DOI identifiers, open weights, and reproducible evaluation harnesses.
          </p>
        </div>

        {/* Operational Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-foundation-border dark:border-dark-border">
          <div className="p-5 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
            <span className="type-meta text-foundation-secondary dark:text-dark-secondary block mb-1">
              Archived Manuscripts
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-foundation-ink dark:text-dark-ink block">
              <AnimatedCounter to={papers.length} />
            </span>
            <span className="text-[11px] font-mono text-foundation-secondary mt-1 block">
              All with verified code
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
            <span className="type-meta text-foundation-secondary dark:text-dark-secondary block mb-1">
              Replication Rate
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-accent-violet block">
              <AnimatedCounter to={99.4} decimals={1} suffix="%" />
            </span>
            <span className="text-[11px] font-mono text-foundation-secondary mt-1 block">
              Double-blind verified
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
            <span className="type-meta text-foundation-secondary dark:text-dark-secondary block mb-1">
              Total PDF Reads
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-foundation-ink dark:text-dark-ink block">
              <AnimatedCounter to={22380} />
            </span>
            <span className="text-[11px] font-mono text-foundation-secondary mt-1 block">
              Across 48 institutions
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
            <span className="type-meta text-foundation-secondary dark:text-dark-secondary block mb-1">
              Licensing Standard
            </span>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-accent-mint block">
              CC BY 4.0
            </span>
            <span className="text-[11px] font-mono text-foundation-secondary mt-1 block">
              Zero paywalls or fees
            </span>
          </div>
        </div>
      </Reveal>

      {/* Interactive Research Benchmark Data Visualisation (Section 4.B) */}
      <Reveal>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="type-meta text-foundation-secondary uppercase">
              Benchmark Observatory
            </span>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-foundation-paper dark:bg-dark-surface border border-foundation-border dark:border-dark-border">
              <button
                onClick={() => setActiveBenchmark('latency')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activeBenchmark === 'latency'
                    ? 'bg-white dark:bg-dark-elevated text-foundation-ink dark:text-dark-ink shadow-sm'
                    : 'text-foundation-secondary hover:text-foundation-ink'
                }`}
              >
                Swarm Latency (ms)
              </button>
              <button
                onClick={() => setActiveBenchmark('interpretability')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activeBenchmark === 'interpretability'
                    ? 'bg-white dark:bg-dark-elevated text-foundation-ink dark:text-dark-ink shadow-sm'
                    : 'text-foundation-secondary hover:text-foundation-ink'
                }`}
              >
                Circuit Monosemanticity (%)
              </button>
            </div>
          </div>

          <AnimatedChart data={benchmarkDatasets[activeBenchmark]} type="bar" />
        </div>
      </Reveal>

      {/* Sticky Search & Multi-layer Filter Navigation */}
      <div className="sticky top-20 z-30 bg-foundation-paper/95 dark:bg-dark-bg/95 backdrop-blur-md p-4 rounded-2xl border border-foundation-border dark:border-dark-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Real-time Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-foundation-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across titles, abstracts, authors, and arXiv IDs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-foundation-border dark:border-dark-border bg-white dark:bg-dark-surface text-sm text-foundation-ink dark:text-dark-ink placeholder:text-foundation-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent-violet transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foundation-secondary hover:text-foundation-ink"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills with Semantic Tokens */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-foundation-ink text-foundation-paper dark:bg-white dark:text-foundation-ink shadow-sm'
                      : 'bg-white dark:bg-dark-surface text-foundation-secondary hover:text-foundation-ink border border-foundation-border dark:border-dark-border'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic Focus Filter Row */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono pt-1 border-t border-foundation-border/60 dark:border-dark-border">
          <span className="text-foundation-secondary dark:text-dark-secondary shrink-0 text-[11px]">
            Topic Focus:
          </span>
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTopic(t)}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTopic === t
                  ? 'bg-accent-lavender text-accent-violet dark:bg-accent-violet/20 font-semibold'
                  : 'text-foundation-secondary hover:text-foundation-ink dark:hover:text-dark-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(selectedCategory !== 'All' || activeTopic !== 'All' || searchQuery !== '') && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-foundation-secondary font-mono">Active Filters:</span>
          {selectedCategory !== 'All' && (
            <Badge accent="violet" size="sm">
              Category: {selectedCategory}
            </Badge>
          )}
          {activeTopic !== 'All' && (
            <Badge accent="blue" size="sm">
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

      {/* Filtered Papers List with Zero Layout Shift */}
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
          <div className="p-16 text-center bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border">
            <BookOpen className="w-10 h-10 text-foundation-secondary mx-auto mb-3 opacity-60" />
            <h3 className="type-card-heading text-foundation-ink dark:text-dark-ink font-medium">
              No matching research manuscripts found
            </h3>
            <p className="type-secondary text-xs mt-2 max-w-sm mx-auto leading-relaxed">
              Try adjusting your topic tags, keywords, or reset filters to view all archived papers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
