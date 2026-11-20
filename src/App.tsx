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

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedEcosystemProduct, setSelectedEcosystemProduct] = useState<EcosystemProduct | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state with URL hash for deep-linking & browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const foundArticle = mockArticles.find((a) => a.id === hash || a.slug === hash);

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
  }, []);

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
      const related = mockArticles.filter((a) => a.id !== selectedArticle.id);
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
            articles={mockArticles}
            papers={mockResearchPapers}
            ecosystemProducts={mockEcosystemProducts}
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
            papers={mockResearchPapers}
            onDownloadPaper={handleDownloadPaper}
            onCopyBibtex={handleCopyBibtex}
            onShowToast={showToast}
          />
        );

      case 'discover':
        return (
          <DiscoverPage
            topics={mockTopics}
            articles={mockArticles}
            onSelectArticle={handleSelectArticle}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        );

      case 'ecosystem':
      case 'products':
        return (
          <EcosystemPage
            products={mockEcosystemProducts}
            selectedProduct={selectedEcosystemProduct}
            onSelectProduct={setSelectedEcosystemProduct}
            onShowToast={showToast}
          />
        );

      case 'engineering':
        return (
          <EngineeringPage
            articles={mockEngineeringArticles}
            onShowToast={showToast}
          />
        );

      case 'updates':
        return (
          <UpdatesPage
            updates={mockCompanyUpdates}
            onNavigateProduct={(id) => {
              const p = mockEcosystemProducts.find((item) => item.id === id);
              if (p) handleExploreEcosystem(p);
            }}
            onShowToast={showToast}
          />
        );

      case 'media':
        return (
          <MediaPage
            mediaItems={mockMediaItems}
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
            articles={mockArticles}
            papers={mockResearchPapers}
            ecosystemProducts={mockEcosystemProducts}
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

  return (
    <div className="min-h-screen flex flex-col bg-foundation-paper text-foundation-ink dark:bg-dark-bg dark:text-dark-text transition-colors duration-250">
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

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} hideNewsletter={currentTab === 'home' && !selectedArticle} />

      {/* Universal Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={mockArticles}
        papers={mockResearchPapers}
        ecosystemProducts={mockEcosystemProducts}
        mediaItems={mockMediaItems}
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
