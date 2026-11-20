import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomePage } from '../pages/HomePage';
import { ArticlePage } from '../pages/ArticlePage';
import { ResearchLibraryPage } from '../pages/ResearchLibraryPage';
import { EcosystemPage } from '../pages/EcosystemPage';
import { EditorialStudioPage } from '../pages/EditorialStudioPage';
import { AboutPage } from '../pages/AboutPage';
import { 
  mockArticles, 
  mockResearchPapers, 
  mockEcosystemProducts, 
  mockEditorialSubmissions 
} from '../lib/mockData';

describe('Page Level Verification & User Workflows', () => {
  it('renders HomePage with hero headline reveal lines and lead investigation', () => {
    const handleSelectArticle = vi.fn();
    const handleNavigate = vi.fn();

    render(
      <HomePage
        articles={mockArticles}
        papers={mockResearchPapers}
        ecosystemProducts={mockEcosystemProducts}
        onSelectArticle={handleSelectArticle}
        onNavigate={handleNavigate}
        onDownloadPaper={vi.fn()}
        onCopyBibtex={vi.fn()}
        onExploreEcosystem={vi.fn()}
        bookmarkedIds={[]}
        onToggleBookmark={vi.fn()}
      />
    );

    expect(screen.getByText(/Empirical Investigations into/i)).toBeInTheDocument();
    expect(screen.getByText(/Frontier Intelligence &/i)).toBeInTheDocument();
    expect(screen.getByText(/Mechanistic Safety./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /read lead investigation/i })).toBeInTheDocument();
  });

  it('renders ArticlePage with table of contents, abstract, and references', () => {
    const article = mockArticles[0];
    const related = mockArticles.slice(1);

    render(
      <ArticlePage
        article={article}
        relatedArticles={related}
        onBack={vi.fn()}
        onSelectArticle={vi.fn()}
        isBookmarked={false}
        onToggleBookmark={vi.fn()}
        onShowToast={vi.fn()}
      />
    );

    expect(screen.getByText(article.title)).toBeInTheDocument();
    expect(screen.getByText(/Executive Abstract/i)).toBeInTheDocument();
    expect(screen.getByText(/References & Citations/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('filters papers in ResearchLibraryPage based on search query', () => {
    render(
      <ResearchLibraryPage
        papers={mockResearchPapers}
        onDownloadPaper={vi.fn()}
        onCopyBibtex={vi.fn()}
        onShowToast={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search across titles/i);
    fireEvent.change(searchInput, { target: { value: 'Byzantine' } });

    expect(screen.getByText(/Aegis-BFT: Sub-200ms Fault-Tolerant/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sparse Autoencoders at Residual Layer/i)).not.toBeInTheDocument();
  });

  it('renders EcosystemPage with MentorMaze, Collaborate, Avsar, and Iris tabs', () => {
    render(
      <EcosystemPage
        products={mockEcosystemProducts}
        onSelectProduct={vi.fn()}
        onShowToast={vi.fn()}
      />
    );

    expect(screen.getAllByText('MentorMaze').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Collaborate').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Avsar').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Iris').length).toBeGreaterThanOrEqual(1);
  });

  it('manages submission statuses and blocks in EditorialStudioPage', () => {
    const showToast = vi.fn();
    render(
      <EditorialStudioPage
        submissions={mockEditorialSubmissions}
        onShowToast={showToast}
      />
    );

    expect(screen.getByText(/AI Tathastu Editorial Studio/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deposit manuscript/i })).toBeInTheDocument();

    // Click on Draft Composition Lab tab
    const editorTab = screen.getByRole('button', { name: /draft composition lab/i });
    fireEvent.click(editorTab);

    // Click on Insert Artifact Block
    const insertBtn = screen.getByRole('button', { name: /insert artifact block/i });
    fireEvent.click(insertBtn);
    expect(showToast).toHaveBeenCalledWith('Block Inserted', expect.any(String), 'success');
  });

  it('renders AboutPage with editorial charter and board members', () => {
    render(<AboutPage />);
    expect(screen.getByText(/The Tathastu Editorial Charter/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr. Aravind Nair/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Preamble & Empirical Mandate/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /cite charter/i })).toBeInTheDocument();
  });
});
