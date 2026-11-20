import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomePage } from '../pages/HomePage';
import { ArticlePage } from '../pages/ArticlePage';
import { ResearchLibraryPage } from '../pages/ResearchLibraryPage';
import { DiscoverPage } from '../pages/DiscoverPage';
import { EcosystemPage } from '../pages/EcosystemPage';
import { MediaPage } from '../pages/MediaPage';
import { EditorialStudioPage } from '../pages/EditorialStudioPage';
import { AboutPage } from '../pages/AboutPage';
import { EngineeringPage } from '../pages/EngineeringPage';
import { UpdatesPage } from '../pages/UpdatesPage';
import { SearchModal } from '../components/ui/SearchModal';
import { 
  mockArticles, 
  mockResearchPapers, 
  mockEcosystemProducts, 
  mockEditorialSubmissions,
  mockMediaItems,
  mockTopics,
  mockEngineeringArticles,
  mockCompanyUpdates
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

    expect(screen.getByText(/We build open systems for research, distributed intelligence/i)).toBeInTheDocument();
    expect(screen.getByText(/The problems we're tackling\./i)).toBeInTheDocument();
    expect(screen.getByText(/Software engineered around real technical barriers\./i)).toBeInTheDocument();
    expect(screen.getByText(/How we built it\./i)).toBeInTheDocument();
    expect(screen.getByText(/Research & experiments\./i)).toBeInTheDocument();
    expect(screen.getByText(/What's new\./i)).toBeInTheDocument();
    expect(screen.getByText(/Media & discussions\./i)).toBeInTheDocument();
    expect(screen.getByText(/Technology should be explained, not obscured\./i)).toBeInTheDocument();
    expect(screen.getByText(/Read our story and principles/i)).toBeInTheDocument();
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

  it('renders AboutPage with company story and principles', () => {
    render(<AboutPage />);
    expect(screen.getByText(/Why we founded AI Tathastu\./i)).toBeInTheDocument();
    expect(screen.getByText(/The principles that guide our work\./i)).toBeInTheDocument();
    expect(screen.getByText(/Dr. Aravind Nair/i)).toBeInTheDocument();
    expect(screen.getByText(/Our engineering & research team\./i)).toBeInTheDocument();
  });

  it('renders DiscoverPage and filters articles by topic tag', () => {
    const handleSelect = vi.fn();
    render(
      <DiscoverPage
        topics={mockTopics}
        articles={mockArticles}
        onSelectArticle={handleSelect}
        bookmarkedIds={[]}
        onToggleBookmark={vi.fn()}
      />
    );

    expect(screen.getByText(/Discover Inquiries & Topics/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Mechanistic Interpretability/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders MediaPage with broadcasts and handles playback', () => {
    const showToast = vi.fn();
    render(
      <MediaPage
        mediaItems={mockMediaItems}
        onShowToast={showToast}
      />
    );

    expect(screen.getByText(/Visual & Audio Stories/i)).toBeInTheDocument();
    expect(screen.getByText(/Watch 24-Min Film/i)).toBeInTheDocument();
  });

  it('handles search queries and article selection in SearchModal', () => {
    const handleSelectArticle = vi.fn();
    const handleClose = vi.fn();

    render(
      <SearchModal
        isOpen={true}
        onClose={handleClose}
        articles={mockArticles}
        papers={mockResearchPapers}
        ecosystemProducts={mockEcosystemProducts}
        mediaItems={mockMediaItems}
        onSelectArticle={handleSelectArticle}
        onSelectProduct={vi.fn()}
        onSelectMedia={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/type keywords, doi/i);
    fireEvent.change(input, { target: { value: 'Residual Stream' } });

    const match = screen.getByText(/Dissecting Residual Stream Dynamics with Scaled Sparse Autoencoders/i);
    expect(match).toBeInTheDocument();
    fireEvent.click(match);

    expect(handleSelectArticle).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders EngineeringPage with architecture topology and code snippet copy', () => {
    const showToast = vi.fn();
    render(
      <EngineeringPage
        articles={mockEngineeringArticles}
        onShowToast={showToast}
      />
    );

    expect(screen.getByText(/How we built it\./i)).toBeInTheDocument();
    expect(screen.getByText(/Aegis-BFT: Sub-200ms Byzantine Consensus/i)).toBeInTheDocument();
    expect(screen.getByText(/Triton Top-K SAE Kernels/i)).toBeInTheDocument();
  });

  it('renders UpdatesPage with chronological changelog and category filter', () => {
    render(
      <UpdatesPage
        updates={mockCompanyUpdates}
        onNavigateProduct={vi.fn()}
        onShowToast={vi.fn()}
      />
    );

    expect(screen.getByText(/What's new\./i)).toBeInTheDocument();
    expect(screen.getByText(/MentorMaze 3.2: Speculative Socratic Reasoning/i)).toBeInTheDocument();
    expect(screen.getByText(/Iris 2.1: Continuous Egocentric 3D Voxel Memory/i)).toBeInTheDocument();
  });
});
