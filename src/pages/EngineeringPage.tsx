import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight, 
  Activity, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  Share2
} from 'lucide-react';
import { EngineeringArticle } from '../types';
import { Reveal } from '../components/motion/Reveal';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { Badge } from '../components/ui/Badge';
import { EDITORIAL_EASE } from '../lib/motion';

interface EngineeringPageProps {
  articles: EngineeringArticle[];
  onShowToast?: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
}

export const EngineeringPage: React.FC<EngineeringPageProps> = ({
  articles,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedSnippetTitle, setCopiedSnippetTitle] = useState<string | null>(null);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  const categories = [
    'All',
    'Distributed Systems',
    'Kernel Engineering',
    'Security & Invariants',
    'System Architecture',
  ];

  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  const handleCopyCode = (snippet: { title: string; code: string }) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedSnippetTitle(snippet.title);
    onShowToast?.('Code Copied', `${snippet.title} copied to clipboard.`, 'success');
    setTimeout(() => setCopiedSnippetTitle(null), 3000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header Banner */}
      <Reveal>
        <div className="border-b border-brand-stone-dark/80 dark:border-dark-border pb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-blue font-semibold">
              Systems &amp; Architecture
            </span>
            <span className="text-brand-muted dark:text-dark-muted">•</span>
            <span className="text-xs font-mono text-brand-muted dark:text-dark-muted">
              Engineering Notes
            </span>
          </div>
          <h1 className="type-hero text-brand-charcoal dark:text-dark-text tracking-tight font-semibold">
            How we built it.
          </h1>
          <p className="mt-4 text-base sm:text-xl text-brand-muted dark:text-dark-muted max-w-3xl leading-relaxed">
            Direct technical documentation of the kernels, distributed consensus protocols, and hardware bottlenecks behind AI Tathastu products.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-brand-stone-dark/80 dark:border-dark-border">
            <div className="p-4 rounded-xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial">
              <span className="text-xs font-mono text-brand-muted dark:text-dark-muted block">Consensus Latency</span>
              <span className="text-2xl font-mono font-semibold text-brand-charcoal dark:text-dark-text mt-1 block">142ms</span>
              <span className="text-[11px] text-accent-blue font-mono mt-0.5 block">Sub-200ms bound</span>
            </div>
            <div className="p-4 rounded-xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial">
              <span className="text-xs font-mono text-brand-muted dark:text-dark-muted block">Triton Memory Saturation</span>
              <span className="text-2xl font-mono font-semibold text-brand-charcoal dark:text-dark-text mt-1 block">94.2%</span>
              <span className="text-[11px] text-accent-blue font-mono mt-0.5 block">NVIDIA H100 SXM5</span>
            </div>
            <div className="p-4 rounded-xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial">
              <span className="text-xs font-mono text-brand-muted dark:text-dark-muted block">ZK Verification Check</span>
              <span className="text-2xl font-mono font-semibold text-brand-charcoal dark:text-dark-text mt-1 block">3.4ms</span>
              <span className="text-[11px] text-accent-sage font-mono mt-0.5 block">Statutory circuit proof</span>
            </div>
            <div className="p-4 rounded-xl bg-brand-surface dark:bg-dark-surface border border-brand-stone-dark/80 dark:border-dark-border shadow-editorial">
              <span className="text-xs font-mono text-brand-muted dark:text-dark-muted block">Byzantine Rejection</span>
              <span className="text-2xl font-mono font-semibold text-brand-charcoal dark:text-dark-text mt-1 block">100%</span>
              <span className="text-[11px] text-accent-terracotta font-mono mt-0.5 block">Zero state drift</span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-foundation-ink text-white dark:bg-white dark:text-foundation-ink shadow-sm'
                : 'bg-white dark:bg-dark-surface text-foundation-secondary dark:text-dark-muted border border-foundation-border dark:border-dark-border hover:border-foundation-ink dark:hover:border-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Engineering Articles Feed */}
      <div className="space-y-12">
        {filteredArticles.map((article, idx) => {
          const isExpanded = expandedArticleId === article.id;
          return (
            <Reveal key={article.id} delay={idx * 0.1}>
              <article className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial hover:shadow-editorial-hover transition-all">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono uppercase font-semibold bg-surface-lavender text-accent-violet dark:bg-accent-violet/20">
                      {article.category}
                    </span>
                    <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.publishedAt}
                    </span>
                    <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readingTimeMinutes} min read
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-foundation-paper dark:bg-dark-elevated text-foundation-secondary dark:text-dark-muted border border-foundation-border dark:border-dark-border"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h2 className="type-section-heading text-foundation-ink dark:text-dark-text font-normal mb-2">
                  {article.title}
                </h2>
                <p className="text-sm sm:text-base text-foundation-secondary dark:text-dark-muted leading-relaxed max-w-4xl mb-6">
                  {article.subtitle}
                </p>

                {/* Abstract Callout */}
                <div className="p-5 rounded-2xl bg-foundation-paper dark:bg-dark-elevated border-l-4 border-accent-violet mb-8">
                  <span className="text-xs font-mono uppercase tracking-wider text-accent-violet font-semibold block mb-1">
                    Engineering Abstract
                  </span>
                  <p className="text-xs sm:text-sm text-foundation-ink dark:text-dark-text leading-relaxed">
                    {article.abstract}
                  </p>
                </div>

                {/* System Architecture Block */}
                {article.systemArchitecture && (
                  <div className="mb-8 p-6 rounded-2xl border border-foundation-border dark:border-dark-border bg-foundation-paper/50 dark:bg-dark-elevated/50">
                    <div className="flex items-center gap-2 mb-4">
                      <Layers className="w-4 h-4 text-accent-violet" />
                      <h3 className="text-xs font-mono uppercase tracking-wider text-foundation-ink dark:text-dark-text font-semibold">
                        Topology: {article.systemArchitecture.topology}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {article.systemArchitecture.components.map((comp, cIdx) => (
                        <div key={cIdx} className="p-3.5 rounded-xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border">
                          <span className="block text-xs font-mono font-semibold text-foundation-ink dark:text-dark-text">
                            {comp.name}
                          </span>
                          <span className="block text-[11px] text-foundation-secondary dark:text-dark-muted mt-1 leading-snug">
                            {comp.role}
                          </span>
                          {comp.latency && (
                            <span className="inline-block mt-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent-violet/10 text-accent-violet font-semibold">
                              Latency: {comp.latency}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Snippet with Copy Button */}
                {article.codeSnippets && article.codeSnippets.map((snippet, sIdx) => (
                  <div key={sIdx} className="mb-8 rounded-2xl overflow-hidden border border-foundation-border dark:border-dark-border bg-[#1E1E1E] text-white">
                    <div className="px-4 py-2.5 bg-[#141414] border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                        <Terminal className="w-3.5 h-3.5 text-accent-mint" />
                        <span>{snippet.title}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(snippet)}
                        className="flex items-center gap-1 text-[11px] font-mono text-white/70 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        {copiedSnippetTitle === snippet.title ? (
                          <>
                            <Check className="w-3 h-3 text-green-400" />
                            <span className="text-green-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-white/90">
                      <code>{snippet.code}</code>
                    </pre>
                    <div className="p-3 bg-[#181818] border-t border-white/5 text-[11px] text-white/60 font-mono">
                      ↳ {snippet.explanation}
                    </div>
                  </div>
                ))}

                {/* Verified Benchmarks Grid */}
                {article.benchmarks && (
                  <div className="mb-8">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-foundation-secondary dark:text-dark-muted mb-3 font-semibold">
                      Empirical Performance Invariants
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {article.benchmarks.map((bench, bIdx) => (
                        <div key={bIdx} className="p-4 rounded-xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border dark:border-dark-border">
                          <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted block">
                            {bench.metric}
                          </span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl font-mono font-semibold text-foundation-ink dark:text-dark-text">
                              {bench.value}
                            </span>
                            <span className="text-xs font-mono text-foundation-secondary line-through">
                              {bench.baseline}
                            </span>
                          </div>
                          {bench.note && (
                            <span className="text-[11px] text-foundation-secondary dark:text-dark-muted block mt-2 leading-tight">
                              {bench.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expandable Article Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                    className="border-t border-foundation-border dark:border-dark-border pt-6 mt-6 space-y-4"
                  >
                    {article.content.map((paragraph, pIdx) => (
                      <p key={pIdx} className="type-body text-foundation-ink dark:text-dark-text leading-relaxed text-sm sm:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                )}

                {/* Card Footer */}
                <div className="mt-8 pt-6 border-t border-foundation-border dark:border-dark-border flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {article.author?.avatar && (
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-9 h-9 rounded-full object-cover border border-foundation-border"
                      />
                    )}
                    <div>
                      <span className="block text-xs font-semibold text-foundation-ink dark:text-dark-text">
                        {article.author?.name || 'AI Tathastu Engineering'}
                      </span>
                      <span className="block text-[11px] font-mono text-foundation-secondary dark:text-dark-muted">
                        {article.author?.affiliation || 'Systems Core'}
                      </span>
                    </div>
                  </div>

                  <AnimatedButton
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                    icon={isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  >
                    {isExpanded ? 'Collapse Deep Dive' : 'Read Architecture Deep Dive'}
                  </AnimatedButton>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};
