import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar, NavTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { ResearchLibraryPage } from './pages/ResearchLibraryPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { EcosystemPage } from './pages/EcosystemPage';
import { MediaPage } from './pages/MediaPage';
import { EditorialStudioPage } from './pages/EditorialStudioPage';
import { AboutPage } from './pages/AboutPage';
import { EngineeringPage } from './pages/EngineeringPage';
import { UpdatesPage } from './pages/UpdatesPage';
import { SearchModal } from './components/ui/SearchModal';
import { ToastContainer, ToastMessage } from './components/motion/Toast';
import { 
  mockArticles, 
  mockResearchPapers, 
  mockEcosystemProducts, 
  mockMediaItems, 
  mockEditorialSubmissions, 
  mockTopics,
  mockEngineeringArticles,
  mockCompanyUpdates
} from './lib/mockData';
import { Article, ResearchPaper, EcosystemProduct } from './types';
import { EDITORIAL_EASE, MOTION_DURATIONS } from './lib/motion';
import { api } from './lib/api';
import { StudioApp } from './studio/StudioApp';
import { StudioTab } from './types/studio';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedEcosystemProduct, setSelectedEcosystemProduct] = useState<EcosystemProduct | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isStudioMode, setIsStudioMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#\/?/, '');
      return hash.startsWith('studio') || window.location.pathname.startsWith('/studio');
    }
    return false;
  });
  const [studioSubTab, setStudioSubTab] = useState<StudioTab>('dashboard');

  // Dynamic live-hydrated content state (defaults to verified mock datasets)
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [papers, setPapers] = useState<ResearchPaper[]>(mockResearchPapers);
  const [ecosystemProducts, setEcosystemProducts] = useState<EcosystemProduct[]>(mockEcosystemProducts);
  const [engineeringArticles, setEngineeringArticles] = useState(mockEngineeringArticles);
  const [companyUpdates, setCompanyUpdates] = useState(mockCompanyUpdates);
  const [mediaItems, setMediaItems] = useState(mockMediaItems);

  // Sync state with URL hash for deep-linking & browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('studio')) {
        setIsStudioMode(true);
        setSelectedArticle(null);
        const parts = hash.split('/');
        const sub = parts[1] as StudioTab;
        if (sub) setStudioSubTab(sub);
        return;
      }
      setIsStudioMode(false);

      const foundArticle = articles.find((a) => a.id === hash || a.slug === hash) || mockArticles.find((a) => a.id === hash || a.slug === hash);

      if (foundArticle) {
        setSelectedArticle(foundArticle);
      } else if (!hash) {
        setSelectedArticle(null);
        setCurrentTab('home');
      } else if (hash === 'perspectives') {
        setSelectedArticle(null);
        setCurrentTab('home');
        setTimeout(() => {
          document.getElementById('perspectives')?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else if (['home', 'articles', 'research', 'discover', 'perspectives', 'ecosystem', 'products', 'engineering', 'updates', 'media', 'editorial-studio', 'about'].includes(hash)) {
        setSelectedArticle(null);
        setCurrentTab((hash === 'products' ? 'products' : hash) as NavTab);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [articles]);

  // Live synchronization with public headless CMS endpoints
  useEffect(() => {
    let active = true;
    const loadPublishedData = async () => {
      try {
        const [pubArticles, pubPapers, pubProducts, pubEngineering, pubUpdates, pubMedia] = await Promise.allSettled([
          api.public.getArticles(),
          api.public.getResearch(),
          api.public.getProducts(),
          api.public.getEngineering(),
          api.public.getUpdates(),
          api.public.getMedia(),
        ]);

        if (!active) return;

        // 1. Articles hydration
        if (pubArticles.status === 'fulfilled' && pubArticles.value?.items && Array.isArray(pubArticles.value.items)) {
          const cmsArticles: Article[] = pubArticles.value.items.map((c: any) => {
            const existingMock = mockArticles.find((m) => m.id === c.id || m.slug === c.slug);
            if (existingMock) {
              return {
                ...existingMock,
                title: c.title || existingMock.title,
                subtitle: c.subtitle || existingMock.subtitle,
                abstract: c.abstract || existingMock.abstract,
                doi: c.doi || existingMock.doi,
              };
            }
            return {
              id: c.id,
              slug: c.slug || c.id,
              title: c.title,
              subtitle: c.subtitle || '',
              abstract: c.abstract || '',
              content: Array.isArray(c.blocks) ? c.blocks.map((b: any) => (typeof b.content === 'string' ? b.content : JSON.stringify(b.content))) : [c.abstract || ''],
              coverImage: c.coverImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
              author: {
                name: c.authorName || 'AI Tathastu Research Desk',
                role: 'Editorial Staff',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                bio: 'Research and engineering contributors at AI Tathastu Insights.',
              },
              publishedAt: c.publishedAt || new Date().toISOString(),
              readingTimeMinutes: c.readingTimeMinutes || 5,
              category: (c.category as any) || 'Frontier Systems',
              topicTag: c.tags?.[0] || 'RESEARCH',
              accentColor: 'indigo',
              doi: c.doi,
              tableOfContents: [],
            };
          });

          // Prepend new articles that are not in mockArticles
          const newOnly = cmsArticles.filter((ca) => !mockArticles.some((ma) => ma.id === ca.id));
          if (newOnly.length > 0) {
            setArticles([...newOnly, ...mockArticles]);
          }
        }

        // 2. Research Papers hydration
        if (pubPapers.status === 'fulfilled' && Array.isArray(pubPapers.value) && pubPapers.value.length > 0) {
          const cmsPapers: ResearchPaper[] = mockResearchPapers.map((existing) => {
            const found = pubPapers.value.find((p: any) => p.id === existing.id || p.slug === existing.id);
            if (found) {
              return {
                ...existing,
                title: found.title || existing.title,
                abstract: found.abstract || existing.abstract,
                doi: found.doi || existing.doi,
                downloadsCount: found.downloadCount ?? existing.downloadsCount,
              };
            }
            return existing;
          });
          setPapers(cmsPapers);
        }

        // 3. Products hydration
        if (pubProducts.status === 'fulfilled' && Array.isArray(pubProducts.value) && pubProducts.value.length > 0) {
          const mergedProducts = mockEcosystemProducts.map((baseProduct) => {
            const found = pubProducts.value.find((p: any) => p.id === baseProduct.id || p.slug === baseProduct.id);
            if (found) {
              return {
                ...baseProduct,
                name: found.name || baseProduct.name,
                tagline: found.tagline || baseProduct.tagline,
                status: found.status || baseProduct.status,
                version: found.version || baseProduct.version,
              };
            }
            return baseProduct;
          });
          setEcosystemProducts(mergedProducts);
        }

        // 4. Engineering Articles hydration
        if (pubEngineering.status === 'fulfilled' && Array.isArray(pubEngineering.value) && pubEngineering.value.length > 0) {
          setEngineeringArticles(pubEngineering.value);
        }

        // 5. Updates hydration
        if (pubUpdates.status === 'fulfilled' && Array.isArray(pubUpdates.value) && pubUpdates.value.length > 0) {
          setCompanyUpdates(pubUpdates.value);
        }

        // 6. Media Items hydration
        if (pubMedia.status === 'fulfilled' && Array.isArray(pubMedia.value) && pubMedia.value.length > 0) {
          setMediaItems(pubMedia.value);
        }
      } catch {
        // Fallbacks remain intact
      }
    };

    loadPublishedData();
    return () => {
      active = false;
    };
  }, [isStudioMode]);

  // Bookmarking state persisted in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tathastu-bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tathastu-bookmarks', JSON.stringify(bookmarkedIds));
    } catch {}
  }, [bookmarkedIds]);

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleBookmark = (e: React.MouseEvent | Article, articleArg?: Article) => {
    const article = articleArg || (e as Article);
    if ('stopPropagation' in e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    // Optimistic UI update + API persistence
    api.bookmarks.toggleBookmark(article.id).catch(() => {});
    setBookmarkedIds((prev) => {
      if (prev.includes(article.id)) {
        showToast('Story removed from bookmarks', article.title, 'info');
        return prev.filter((id) => id !== article.id);
      } else {
        showToast('Story saved to bookmarks', 'Available for offline reading.', 'success');
        return [...prev, article.id];
      }
    });
  };

  const handleNavigate = (tab: NavTab) => {
    setSelectedArticle(null);
    if (tab === 'perspectives') {
      setCurrentTab('home');
      window.location.hash = 'perspectives';
      setTimeout(() => {
        document.getElementById('perspectives')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }
    setCurrentTab(tab);
    window.location.hash = tab === 'home' ? '' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    window.location.hash = article.id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreEcosystem = (product: EcosystemProduct) => {
    setSelectedArticle(null);
    setSelectedEcosystemProduct(product);
    setCurrentTab('ecosystem');
    window.location.hash = 'ecosystem';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPaper = (paper: ResearchPaper) => {
    api.research.downloadPaper(paper.id).catch(() => {});
    showToast('Download Complete', `${paper.title.slice(0, 40)}... downloaded with verification signatures.`, 'success');
  };

  const handleCopyBibtex = (paper: ResearchPaper) => {
    showToast('BibTeX Copied', 'Citation reference placed in clipboard.', 'info');
  };

  // Determine which view to render
  const renderContent = () => {
    if (selectedArticle) {
      const related = articles.filter((a) => a.id !== selectedArticle.id);
      return (
        <ArticlePage
          article={selectedArticle}
          relatedArticles={related}
          onBack={() => setSelectedArticle(null)}
          onSelectArticle={handleSelectArticle}
          isBookmarked={bookmarkedIds.includes(selectedArticle.id)}
          onToggleBookmark={(art) => handleToggleBookmark(art)}
          onShowToast={showToast}
        />
      );
    }

    switch (currentTab) {
      case 'home':
      case 'articles':
        return (
          <HomePage
            articles={articles}
            papers={papers}
            ecosystemProducts={ecosystemProducts}
            onSelectArticle={handleSelectArticle}
            onNavigate={handleNavigate}
            onDownloadPaper={handleDownloadPaper}
            onCopyBibtex={handleCopyBibtex}
            onExploreEcosystem={handleExploreEcosystem}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        );

      case 'research':
        return (
          <ResearchLibraryPage
            papers={papers}
            onDownloadPaper={handleDownloadPaper}
            onCopyBibtex={handleCopyBibtex}
            onShowToast={showToast}
          />
        );

      case 'discover':
        return (
          <DiscoverPage
            topics={mockTopics}
            articles={articles}
            onSelectArticle={handleSelectArticle}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        );

      case 'ecosystem':
      case 'products':
        return (
          <EcosystemPage
            products={ecosystemProducts}
            selectedProduct={selectedEcosystemProduct}
            onSelectProduct={setSelectedEcosystemProduct}
            onShowToast={showToast}
          />
        );

      case 'engineering':
        return (
          <EngineeringPage
            articles={engineeringArticles}
            onShowToast={showToast}
          />
        );

      case 'updates':
        return (
          <UpdatesPage
            updates={companyUpdates}
            onNavigateProduct={(id) => {
              const p = ecosystemProducts.find((item) => item.id === id);
              if (p) handleExploreEcosystem(p);
            }}
            onShowToast={showToast}
          />
        );

      case 'media':
        return (
          <MediaPage
            mediaItems={mediaItems}
            onShowToast={showToast}
          />
        );

      case 'editorial-studio':
        return (
          <EditorialStudioPage
            submissions={mockEditorialSubmissions}
            onShowToast={showToast}
          />
        );

      case 'about':
        return <AboutPage />;

      default:
        return (
          <HomePage
            articles={articles}
            papers={papers}
            ecosystemProducts={ecosystemProducts}
            onSelectArticle={handleSelectArticle}
            onNavigate={handleNavigate}
            onDownloadPaper={handleDownloadPaper}
            onCopyBibtex={handleCopyBibtex}
            onExploreEcosystem={handleExploreEcosystem}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        );
    }
  };

  if (isStudioMode) {
    return (
      <StudioApp
        initialSubTab={studioSubTab}
        onBackToPublicSite={() => {
          setIsStudioMode(false);
          window.location.hash = '#home';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-canvas text-brand-charcoal dark:bg-dark-bg dark:text-dark-text transition-colors duration-250">
      {/* Top Navbar */}
      <Navbar
        currentTab={selectedArticle ? 'home' : currentTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Global Dark Editorial Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Universal Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={articles}
        papers={papers}
        ecosystemProducts={ecosystemProducts}
        mediaItems={mediaItems}
        onSelectArticle={handleSelectArticle}
        onSelectProduct={handleExploreEcosystem}
        onSelectMedia={(media) => {
          handleNavigate('media');
        }}
      />

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
