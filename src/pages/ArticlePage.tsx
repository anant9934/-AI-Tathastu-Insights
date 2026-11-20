import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Clock, 
  Check, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  ExternalLink,
  Quote
} from 'lucide-react';
import { Article } from '../types';
import { ReadingProgress } from '../components/motion/ReadingProgress';
import { AnimatedChart } from '../components/motion/AnimatedChart';
import { Reveal } from '../components/motion/Reveal';
import { Badge } from '../components/ui/Badge';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { StoryCard } from '../components/cards/StoryCard';
import { EDITORIAL_EASE, MOTION_DURATIONS } from '../lib/motion';
import { formatDate } from '../lib/utils';

interface ArticlePageProps {
  article: Article;
  relatedArticles: Article[];
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: Article) => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const ArticlePage: React.FC<ArticlePageProps> = ({
  article,
  relatedArticles,
  onBack,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
  onShowToast,
}) => {
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Scroll active table-of-contents detection
  useEffect(() => {
    const handleScroll = () => {
      const headings = article.tableOfContents.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + 160;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading && heading.offsetTop <= scrollPos) {
          setActiveHeadingId(article.tableOfContents[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    onShowToast('Article link copied to clipboard', 'Share this empirical report with collaborators.', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleBookmarkClick = () => {
    onToggleBookmark(article);
    if (!isBookmarked) {
      onShowToast('Saved to reading list', 'Available offline and in your personal library.', 'info');
    } else {
      onShowToast('Removed from reading list', undefined, 'info');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 90,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    }
  };

  return (
    <article className="min-h-screen pb-24">
      {/* 1. Reading progress bar fixed below navigation */}
      <ReadingProgress />

      {/* Top back navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-foundation-secondary hover:text-brand-editorial-violet dark:text-dark-muted dark:hover:text-dark-text transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal Overview
        </button>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge accent={article.accentColor} size="sm">
            {article.category}
          </Badge>
          <Badge accent="neutral" size="sm">
            {article.topicTag}
          </Badge>
          {article.doi && (
            <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted sm:ml-auto block sm:inline">
              DOI: {article.doi}
            </span>
          )}
        </div>

        <h1 className="font-editorial-serif type-article-title text-foundation-ink dark:text-dark-text leading-[1.14] tracking-tight font-normal break-words">
          {article.title}
        </h1>

        <p className="mt-6 type-secondary text-foundation-secondary dark:text-dark-muted leading-relaxed font-editorial-sans">
          {article.subtitle}
        </p>

        {/* Metadata bar with author and actions */}
        <div className="mt-8 pt-6 border-t border-foundation-border dark:border-dark-border flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-foundation-border"
            />
            <div>
              <p className="text-sm font-semibold text-foundation-ink dark:text-dark-text">
                {article.author.name}
              </p>
              <p className="text-xs text-foundation-secondary dark:text-dark-muted">
                {article.author.role} • {article.author.affiliation}
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-foundation-secondary dark:text-dark-muted mt-1">
                <span>{formatDate(article.publishedAt)}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readingTimeMinutes} min read
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons: Bookmark and Share */}
          <div className="flex items-center gap-2">
            <AnimatedButton
              variant={isBookmarked ? 'secondary' : 'outline'}
              size="sm"
              onClick={handleBookmarkClick}
              icon={<Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />}
            >
              {isBookmarked ? 'Bookmarked' : 'Save'}
            </AnimatedButton>

            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={handleShare}
              icon={copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
            >
              {copiedLink ? 'Link Copied' : 'Share'}
            </AnimatedButton>
          </div>
        </div>
      </header>

      {/* 3. Article Image reveal when entering viewport */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <Reveal>
          <div className="rounded-3xl overflow-hidden border border-foundation-border dark:border-dark-border shadow-xl aspect-[16/9]">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
          {article.imageCaption && (
            <p className="text-xs text-foundation-secondary dark:text-dark-muted mt-3 text-center italic font-mono">
              Figure 1.0 — {article.imageCaption}
            </p>
          )}
        </Reveal>
      </div>

      {/* Article Body: Two-column layout with sticky TOC */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* 2. Active Table-of-Contents Indicator */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-sm">
              <span className="text-[11px] font-mono uppercase tracking-widest text-foundation-secondary dark:text-dark-muted block mb-4">
                Contents
              </span>
              <nav className="space-y-2">
                {article.tableOfContents.map((item) => {
                  const isActive = activeHeadingId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left text-xs transition-colors py-1 pl-2 border-l-2 cursor-pointer ${
                        isActive
                          ? 'border-brand-editorial-violet text-brand-editorial-violet font-semibold dark:text-accent-lavender'
                          : 'border-transparent text-foundation-secondary hover:text-foundation-ink dark:hover:text-dark-text'
                      }`}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-foundation-border dark:border-dark-border">
                <span className="text-[11px] font-mono text-foundation-secondary dark:text-dark-muted block mb-2">
                  Dataset Status
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Weights Replicated
                </span>
              </div>
            </div>
          </aside>

          {/* Core Content */}
          <main className="lg:col-span-8 space-y-12">
            {/* Abstract Callout */}
            <div className="p-6 sm:p-8 rounded-2xl bg-foundation-paper dark:bg-dark-elevated border-l-4 border-brand-editorial-violet border border-foundation-border shadow-xs">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-editorial-violet font-semibold block mb-2">
                Executive Abstract
              </span>
              <p className="text-sm sm:text-base text-foundation-ink dark:text-dark-text leading-relaxed italic">
                {article.abstract}
              </p>
            </div>

            {/* Paragraphs with Section Headings */}
            {article.content.map((paragraph, index) => {
              const tocItem = article.tableOfContents[index];
              return (
                <div key={index} className="space-y-4">
                  {tocItem && (
                    <h2
                      id={tocItem.id}
                      className="font-editorial-serif type-section-heading text-foundation-ink dark:text-dark-text tracking-tight font-medium pt-6"
                    >
                      {tocItem.title}
                    </h2>
                  )}
                  <p className="type-body text-foundation-ink/90 dark:text-dark-text/90 leading-[1.8] font-editorial-sans">
                    {paragraph}
                  </p>
                </div>
              );
            })}

            {/* 4. Subtle Pull-Quote Entrance */}
            {article.pullQuote && (
              <Reveal>
                <figure className="my-10 p-8 sm:p-10 rounded-2xl bg-surface-lavender/40 dark:bg-brand-editorial-violet/10 border border-brand-editorial-violet/20 relative">
                  <Quote className="w-10 h-10 text-brand-editorial-violet/30 absolute top-4 left-4 -z-0" />
                  <blockquote className="font-editorial-serif text-xl sm:text-2xl text-foundation-ink dark:text-dark-text leading-snug relative z-10 italic">
                    "{article.pullQuote.text}"
                  </blockquote>
                  <figcaption className="mt-4 text-xs font-mono text-brand-editorial-violet dark:text-accent-lavender">
                    — {article.pullQuote.attribution}
                  </figcaption>
                </figure>
              </Reveal>
            )}

            {/* 5. Chart Animation when Visible */}
            {article.chartData && (
              <Reveal>
                <div className="my-10">
                  <AnimatedChart data={article.chartData} type="bar" />
                </div>
              </Reveal>
            )}

            {/* Citations and Reference Suite */}
            <div className="pt-10 border-t border-foundation-border dark:border-dark-border">
              <h3 className="font-editorial-serif text-2xl text-foundation-ink dark:text-dark-text mb-4">
                References &amp; Citations
              </h3>
              <ul className="space-y-3">
                {article.citations.map((cite) => (
                  <li
                    key={cite.id}
                    className="text-xs text-foundation-secondary dark:text-dark-muted leading-relaxed font-mono pl-4 border-l-2 border-foundation-border dark:border-dark-border"
                  >
                    <span>{cite.citation}</span>
                    {cite.doi && (
                      <span className="block text-[11px] text-brand-editorial-violet mt-0.5">
                        DOI: {cite.doi}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </main>
        </div>
      </div>

      {/* 6. Related Story Hover Interactions */}
      {relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-foundation-border dark:border-dark-border">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-editorial-serif type-section-heading text-foundation-ink dark:text-dark-text tracking-tight font-normal">
              Related Research &amp; Inquiries
            </h3>
            <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted">
              Peer-reviewed series
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.slice(0, 3).map((item) => (
              <StoryCard
                key={item.id}
                article={item}
                onSelect={onSelectArticle}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
