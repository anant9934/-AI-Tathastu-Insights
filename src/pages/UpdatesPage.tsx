import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Tag, 
  Calendar, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  GraduationCap, 
  Users, 
  Award, 
  Eye, 
  CheckCircle2,
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CompanyUpdate } from '../types';
import { Reveal } from '../components/motion/Reveal';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { Badge } from '../components/ui/Badge';
import { EDITORIAL_EASE } from '../lib/motion';

interface UpdatesPageProps {
  updates: CompanyUpdate[];
  onNavigateProduct?: (productId: string) => void;
  onShowToast?: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
}

export const UpdatesPage: React.FC<UpdatesPageProps> = ({
  updates,
  onNavigateProduct,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedUpdateId, setExpandedUpdateId] = useState<string | null>(null);

  const categories = [
    'All',
    'Product Release',
    'Engineering',
    'Milestone',
    'Company',
  ];

  const filteredUpdates = selectedCategory === 'All'
    ? updates
    : updates.filter((u) => u.category === selectedCategory);

  const getProductIcon = (productId?: string) => {
    switch (productId) {
      case 'mentormaze':
        return <GraduationCap className="w-4 h-4 text-accent-violet" />;
      case 'collaborate':
        return <Users className="w-4 h-4 text-accent-blue" />;
      case 'avsar':
        return <Award className="w-4 h-4 text-accent-terracotta" />;
      case 'iris':
        return <Eye className="w-4 h-4 text-accent-mint" />;
      default:
        return <Layers className="w-4 h-4 text-foundation-secondary" />;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <Reveal>
        <div className="border-b border-brand-stone-dark/80 dark:border-dark-border pb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-blue font-semibold">
              Changelog &amp; Newsroom
            </span>
            <span className="text-brand-muted dark:text-dark-muted">•</span>
            <span className="text-xs font-mono text-brand-muted dark:text-dark-muted">
              Live Progress
            </span>
          </div>
          <h1 className="type-hero text-brand-charcoal dark:text-dark-text tracking-tight font-semibold">
            What's new.
          </h1>
          <p className="mt-4 text-base sm:text-xl text-brand-muted dark:text-dark-muted max-w-3xl leading-relaxed">
            A chronological ledger of product rollouts, architectural notes, and milestone releases across AI Tathastu.
          </p>
        </div>
      </Reveal>

      {/* Filter Tabs */}
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

      {/* Timeline Feed */}
      <div className="relative border-l-2 border-foundation-border dark:border-dark-border ml-3 sm:ml-6 pl-6 sm:pl-10 space-y-12">
        {filteredUpdates.map((update, idx) => {
          const isExpanded = expandedUpdateId === update.id;
          return (
            <Reveal key={update.id} delay={idx * 0.08}>
              <div className="relative group">
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-6 w-4 h-4 rounded-full bg-white dark:bg-dark-surface border-2 border-accent-violet flex items-center justify-center group-hover:scale-125 transition-transform">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-violet" />
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial hover:shadow-editorial-hover transition-all">
                  {/* Category, Version, and Date Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-mono uppercase font-semibold bg-surface-lavender text-accent-violet dark:bg-accent-violet/20 flex items-center gap-1.5">
                        {getProductIcon(update.productId)}
                        {update.category}
                      </span>
                      {update.version && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-foundation-paper dark:bg-dark-elevated text-foundation-ink dark:text-dark-text border border-foundation-border dark:border-dark-border font-semibold">
                          {update.version}
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {update.date}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <h2 className="type-section-heading text-foundation-ink dark:text-dark-text font-normal mb-3">
                    {update.title}
                  </h2>
                  <p className="text-sm sm:text-base text-foundation-secondary dark:text-dark-muted leading-relaxed mb-6">
                    {update.summary}
                  </p>

                  {/* Milestone Metric Callout */}
                  {update.milestoneMetric && (
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border dark:border-dark-border mb-6">
                      <TrendingUp className="w-4 h-4 text-accent-mint" />
                      <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                        {update.milestoneMetric.label}:
                      </span>
                      <span className="text-sm font-mono font-semibold text-foundation-ink dark:text-dark-text">
                        {update.milestoneMetric.value}
                      </span>
                    </div>
                  )}

                  {/* Expanded Body Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                      className="border-t border-foundation-border dark:border-dark-border pt-6 mb-6 space-y-3"
                    >
                      {update.content.map((p, pIdx) => (
                        <p key={pIdx} className="type-body text-foundation-ink dark:text-dark-text leading-relaxed text-sm">
                          {p}
                        </p>
                      ))}
                      {update.relatedLinks && (
                        <div className="pt-4 flex flex-wrap gap-3">
                          {update.relatedLinks.map((link, lIdx) => (
                            <a
                              key={lIdx}
                              href={link.url}
                              className="text-xs font-mono text-accent-violet hover:underline flex items-center gap-1"
                            >
                              {link.label} <ArrowRight className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Footer & Toggle */}
                  <div className="pt-4 border-t border-foundation-border dark:border-dark-border flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {update.author?.avatar && (
                        <img
                          src={update.author.avatar}
                          alt={update.author.name}
                          className="w-8 h-8 rounded-full object-cover border border-foundation-border"
                        />
                      )}
                      <div>
                        <span className="block text-xs font-semibold text-foundation-ink dark:text-dark-text">
                          {update.author?.name || 'Tathastu Core Team'}
                        </span>
                        <span className="block text-[11px] font-mono text-foundation-secondary dark:text-dark-muted">
                          {update.author?.affiliation || 'AI Tathastu'}
                        </span>
                      </div>
                    </div>

                    <AnimatedButton
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedUpdateId(isExpanded ? null : update.id)}
                      icon={isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    >
                      {isExpanded ? 'Less Details' : 'Full Release Notes'}
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};
