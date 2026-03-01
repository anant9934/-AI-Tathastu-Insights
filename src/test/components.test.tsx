import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { Badge } from '../components/ui/Badge';
import { StoryCard } from '../components/cards/StoryCard';
import { ResearchCard } from '../components/cards/ResearchCard';
import { AnimatedChart } from '../components/motion/AnimatedChart';
import { MotionModal } from '../components/motion/MotionModal';
import { mockArticles, mockResearchPapers } from '../lib/mockData';

describe('Reusable Motion & UI Components', () => {
  it('renders AnimatedButton with custom variants and fires click events', () => {
    const handleClick = vi.fn();
    render(
      <AnimatedButton variant="primary" size="md" onClick={handleClick}>
        Test Action
      </AnimatedButton>
    );

    const button = screen.getByRole('button', { name: /test action/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders Badge with correct accent styling', () => {
    render(<Badge accent="violet">Interpretability</Badge>);
    expect(screen.getByText('Interpretability')).toBeInTheDocument();
  });

  it('renders StoryCard and handles article selection and bookmarking', () => {
    const handleSelect = vi.fn();
    const handleBookmark = vi.fn();
    const article = mockArticles[0];

    render(
      <StoryCard
        article={article}
        onSelect={handleSelect}
        onBookmark={handleBookmark}
        isBookmarked={false}
      />
    );

    expect(screen.getByText(article.title)).toBeInTheDocument();
    expect(screen.getByText(article.author.name)).toBeInTheDocument();

    const bookmarkBtn = screen.getByLabelText(/bookmark/i);
    fireEvent.click(bookmarkBtn);
    expect(handleBookmark).toHaveBeenCalled();
  });

  it('renders ResearchCard with DOI, authors, and download button', () => {
    const handleDownload = vi.fn();
    const handleCopyBibtex = vi.fn();
    const paper = mockResearchPapers[0];

    render(
      <ResearchCard
        paper={paper}
        onDownload={handleDownload}
        onCopyBibtex={handleCopyBibtex}
      />
    );

    expect(screen.getByText(paper.title)).toBeInTheDocument();
    expect(screen.getByText(paper.doi)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument();
  });

  it('renders AnimatedChart with title, subtitle, and legend data points', () => {
    const chartData = {
      title: 'Monosemantic Feature Purity',
      subtitle: 'Percentage of interpretable features',
      points: [
        { label: '8x', value: 74.8, baseline: 42.0 },
        { label: '16x', value: 86.2, baseline: 42.0 },
      ],
    };

    render(<AnimatedChart data={chartData} type="bar" />);
    expect(screen.getByText('Monosemantic Feature Purity')).toBeInTheDocument();
    expect(screen.getByText('8x')).toBeInTheDocument();
    expect(screen.getByText('16x')).toBeInTheDocument();
  });

  it('renders MotionModal when isOpen is true and closes on close button click', () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <MotionModal isOpen={false} onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </MotionModal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();

    rerender(
      <MotionModal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </MotionModal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();

    const closeBtn = screen.getByLabelText(/close modal/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
