import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight, BookOpen, FileText, Layers, Video, X } from 'lucide-react';
import { Article, ResearchPaper, EcosystemProduct, MediaItem } from '../../types';
import { MotionModal } from '../motion/MotionModal';
import { Badge } from './Badge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  papers: ResearchPaper[];
  ecosystemProducts: EcosystemProduct[];
  mediaItems: MediaItem[];
  onSelectArticle: (article: Article) => void;
  onSelectProduct: (product: EcosystemProduct) => void;
  onSelectMedia: (media: MediaItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  papers,
  ecosystemProducts,
  mediaItems,
  onSelectArticle,
  onSelectProduct,
  onSelectMedia,
}) => {
  const [query, setQuery] = useState('');

  // Global Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle if needed
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const trimmed = query.trim().toLowerCase();

  const matchingArticles = trimmed
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(trimmed) ||
          a.subtitle.toLowerCase().includes(trimmed) ||
          a.author.name.toLowerCase().includes(trimmed) ||
          a.topicTag.toLowerCase().includes(trimmed)
      )
    : articles.slice(0, 3);

  const matchingPapers = trimmed
    ? papers.filter(
        (p) =>
          p.title.toLowerCase().includes(trimmed) ||
          p.abstract.toLowerCase().includes(trimmed) ||
          p.topic.toLowerCase().includes(trimmed)
      )
    : papers.slice(0, 2);

  const matchingProducts = trimmed
    ? ecosystemProducts.filter(
        (e) =>
          e.name.toLowerCase().includes(trimmed) ||
          e.description.toLowerCase().includes(trimmed)
      )
    : [];

  return (
    <MotionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Universal Index Search"
      subtitle="Search across articles, preprints, media transcripts, and ecosystem platforms"
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-foundation-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type keywords, DOI, author name, or research topics..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-foundation-charcoal/20 dark:border-dark-border bg-white dark:bg-dark-elevated text-sm text-foundation-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-violet"
          />
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto space-y-4 pr-1">
          {/* Articles Section */}
          {matchingArticles.length > 0 && (
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-foundation-muted dark:text-dark-muted block mb-2">
                Journal Articles ({matchingArticles.length})
              </span>
              <div className="space-y-2">
                {matchingArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-foundation-ivory dark:bg-dark-elevated hover:bg-accent-lavender/30 dark:hover:bg-accent-violet/10 border border-foundation-charcoal/5 dark:border-dark-border transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge accent={art.accentColor} size="xs">
                          {art.category}
                        </Badge>
                        <span className="text-[11px] font-mono text-foundation-muted">
                          {art.author.name}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-medium text-foundation-charcoal dark:text-dark-text truncate group-hover:text-accent-violet transition-colors">
                        {art.title}
                      </h4>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-foundation-muted group-hover:text-accent-violet group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Research Preprints Section */}
          {matchingPapers.length > 0 && (
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-foundation-muted dark:text-dark-muted block mb-2">
                Research Preprints ({matchingPapers.length})
              </span>
              <div className="space-y-2">
                {matchingPapers.map((paper) => (
                  <div
                    key={paper.id}
                    onClick={() => {
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-foundation-ivory dark:bg-dark-elevated hover:bg-accent-lavender/30 dark:hover:bg-accent-violet/10 border border-foundation-charcoal/5 dark:border-dark-border transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge accent="softblue" size="xs">
                          {paper.category}
                        </Badge>
                        <span className="text-[11px] font-mono text-foundation-muted">
                          {paper.doi}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-medium text-foundation-charcoal dark:text-dark-text truncate group-hover:text-accent-violet transition-colors">
                        {paper.title}
                      </h4>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-foundation-muted group-hover:text-accent-violet shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ecosystem Match */}
          {matchingProducts.length > 0 && (
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-foundation-muted dark:text-dark-muted block mb-2">
                Ecosystem Platforms
              </span>
              <div className="space-y-2">
                {matchingProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-foundation-ivory dark:bg-dark-elevated hover:bg-accent-lavender/30 dark:hover:bg-accent-violet/10 border border-foundation-charcoal/5 dark:border-dark-border transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-semibold text-accent-violet block">
                        {prod.name} — {prod.badge}
                      </span>
                      <p className="text-xs text-foundation-muted truncate max-w-md">
                        {prod.tagline}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-foundation-muted group-hover:text-accent-violet shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {trimmed && matchingArticles.length === 0 && matchingPapers.length === 0 && matchingProducts.length === 0 && (
            <p className="text-xs text-center text-foundation-muted py-6 font-mono">
              No matching articles or research records found for "{query}".
            </p>
          )}
        </div>
      </div>
    </MotionModal>
  );
};
