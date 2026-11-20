import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Download, FileText, Check, ExternalLink, Quote, Sparkles } from 'lucide-react';
import { ResearchPaper } from '../../types';
import { Badge } from '../ui/Badge';
import { AnimatedButton } from '../motion/AnimatedButton';
import { EDITORIAL_EASE, MOTION_DURATIONS } from '../../lib/motion';
import { formatDate } from '../../lib/utils';

interface ResearchCardProps {
  paper: ResearchPaper;
  onDownload: (paper: ResearchPaper) => void;
  onCopyBibtex: (paper: ResearchPaper) => void;
  onViewPaper?: (paper: ResearchPaper) => void;
}

export const ResearchCard: React.FC<ResearchCardProps> = ({
  paper,
  onDownload,
  onCopyBibtex,
  onViewPaper,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      onDownload(paper);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }, 850);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(paper.bibtex);
    setCopiedBibtex(true);
    onCopyBibtex(paper);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  return (
    <motion.article
      whileHover={shouldReduceMotion ? {} : { y: -3 }}
      transition={{ duration: MOTION_DURATIONS.cardTransition, ease: EDITORIAL_EASE }}
      className="p-6 sm:p-8 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial hover:shadow-editorial-hover transition-shadow flex flex-col justify-between"
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Badge accent={paper.accentColor} size="sm">
              {paper.category}
            </Badge>
            <Badge accent="neutral" size="sm">
              {paper.topic}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-foundation-muted dark:text-dark-muted">
            <span>{paper.doi}</span>
            <span>•</span>
            <span>{formatDate(paper.publishedAt)}</span>
          </div>
        </div>

        <h3
          onClick={() => onViewPaper && onViewPaper(paper)}
          className={`font-editorial-serif text-2xl sm:text-3xl leading-snug text-foundation-charcoal dark:text-dark-text tracking-tight font-normal ${
            onViewPaper ? 'cursor-pointer hover:text-accent-violet transition-colors' : ''
          }`}
        >
          {paper.title}
        </h3>

        <p className="mt-2 text-xs font-medium text-foundation-muted dark:text-dark-muted">
          By {paper.authors.join(', ')} •{' '}
          <span className="italic">{paper.primaryAuthorAffiliation}</span>
        </p>

        <p className="mt-4 text-sm text-foundation-charcoal/80 dark:text-dark-text/80 leading-relaxed line-clamp-3">
          {paper.abstract}
        </p>

        {paper.keyFindings && paper.keyFindings.length > 0 && (
          <div className="mt-5 p-3.5 rounded-xl bg-foundation-ivory dark:bg-dark-elevated border border-foundation-charcoal/5 dark:border-dark-border">
            <div className="flex items-center gap-1.5 text-xs font-medium text-accent-violet dark:text-accent-lavender mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Empirical Findings</span>
            </div>
            <ul className="space-y-1.5">
              {paper.keyFindings.slice(0, 2).map((finding, idx) => (
                <li
                  key={idx}
                  className="text-xs text-foundation-charcoal/90 dark:text-dark-text/90 flex items-start gap-2 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-violet shrink-0 mt-1.5" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {paper.benchmarkMetric && (
          <div className="mt-4 flex items-center justify-between text-xs font-mono px-3.5 py-2 rounded-lg bg-accent-lavender/40 dark:bg-accent-violet/10 text-accent-violet dark:text-accent-lavender">
            <span>{paper.benchmarkMetric.name}: <strong>{paper.benchmarkMetric.value}</strong></span>
            <span className="text-[11px] opacity-80">{paper.benchmarkMetric.comparisonToSota}</span>
          </div>
        )}
      </div>

      <div className="pt-6 mt-6 border-t border-foundation-charcoal/5 dark:border-dark-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs font-mono text-foundation-muted dark:text-dark-muted">
          <span>{paper.citationCount} Citations</span>
          <span>•</span>
          <span>{paper.downloadsCount.toLocaleString()} Reads</span>
          <span>•</span>
          <span>{paper.pdfFileSize}</span>
        </div>

        <div className="flex items-center gap-2">
          <AnimatedButton
            variant="outline"
            size="sm"
            onClick={handleCopy}
            icon={copiedBibtex ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Quote className="w-3.5 h-3.5" />}
          >
            {copiedBibtex ? 'BibTeX Copied' : 'Cite'}
          </AnimatedButton>

          <AnimatedButton
            variant={downloadSuccess ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleDownload}
            loading={downloading}
            icon={
              downloadSuccess ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )
            }
          >
            {downloadSuccess ? 'Downloaded' : 'Download PDF'}
          </AnimatedButton>
        </div>
      </div>
    </motion.article>
  );
};
