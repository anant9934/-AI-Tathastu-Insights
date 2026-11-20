import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, BookOpen, Scale, Award, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { mockAuthors } from '../lib/mockData';
import { Reveal } from '../components/motion/Reveal';
import { Badge } from '../components/ui/Badge';

export const AboutPage: React.FC = () => {
  const authorsList = Object.values(mockAuthors);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Charter Header */}
      <Reveal>
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge accent="violet" size="sm">
            The Tathastu Editorial Charter
          </Badge>
          <h1 className="font-editorial-serif text-4xl sm:text-6xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
            Independent Research Journalism &amp; Computational Rigour
          </h1>
          <p className="text-base sm:text-lg text-foundation-muted dark:text-dark-muted leading-relaxed">
            AI Tathastu Insights operates as an independent peer-reviewed publication dedicated to demystifying frontier machine learning systems through empirical proof, open weights, and uncompromising editorial integrity.
          </p>
        </div>
      </Reveal>

      {/* Core Principles Grid */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent-lavender text-accent-violet flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-editorial-serif text-2xl text-foundation-charcoal dark:text-dark-text">
              Zero Speculative Clichés
            </h3>
            <p className="text-xs sm:text-sm text-foundation-muted dark:text-dark-muted leading-relaxed">
              We prohibit vacuous promotional phrases. Every article documents measured empirical realities: exact parameter counts, dictionary expansion ratios, and latency budgets.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent-softblue text-[#205493] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-editorial-serif text-2xl text-foundation-charcoal dark:text-dark-text">
              Mandatory Code Audits
            </h3>
            <p className="text-xs sm:text-sm text-foundation-muted dark:text-dark-muted leading-relaxed">
              Theoretical proofs must be accompanied by Lean 4 formal specifications or verifiable PyTorch/CUDA implementations verified by independent reviewers.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent-mint text-[#166534] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-editorial-serif text-2xl text-foundation-charcoal dark:text-dark-text">
              Open Science &amp; CC BY
            </h3>
            <p className="text-xs sm:text-sm text-foundation-muted dark:text-dark-muted leading-relaxed">
              All journal articles and research papers are published under Creative Commons Attribution licenses with guaranteed DOI archiving via Zenodo.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Editorial Board Showcase */}
      <section className="space-y-8 pt-8 border-t border-foundation-charcoal/10 dark:border-dark-border">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent-violet block mb-1">
            Governance
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
            Resident Investigators &amp; Editorial Board
          </h2>
          <p className="text-xs sm:text-sm text-foundation-muted dark:text-dark-muted mt-2">
            The researchers and system architects guiding our publication inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {authorsList.map((author) => (
            <div
              key={author.id}
              className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial flex items-start gap-4"
            >
              <img
                src={author.avatar}
                alt={author.name}
                className="w-16 h-16 rounded-full object-cover border border-foundation-charcoal/10 shrink-0"
              />
              <div className="space-y-1">
                <h3 className="font-editorial-serif text-xl sm:text-2xl text-foundation-charcoal dark:text-dark-text">
                  {author.name}
                </h3>
                <p className="text-xs font-medium text-accent-violet dark:text-accent-lavender">
                  {author.role}
                </p>
                <p className="text-[11px] font-mono text-foundation-muted">
                  {author.affiliation}
                </p>
                <p className="text-xs text-foundation-charcoal/80 dark:text-dark-text/80 pt-2 leading-relaxed">
                  {author.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
