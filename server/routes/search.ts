import { Router, Request, Response } from 'express';
import { repository } from '../db/repository';
import { mockArticles, mockTopics, mockEcosystemProducts } from '../../src/lib/mockData';

export const searchRouter = Router();

// GET /api/search - Multi-index search excluding unpublished content
searchRouter.get('/', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();

  if (!query) {
    return res.json({
      query: '',
      totalMatches: 0,
      articles: mockArticles.slice(0, 3),
      researchPapers: Array.from(repository.researchPapers.values()).filter((p) => p.status === 'published').slice(0, 2),
      ecosystem: mockEcosystemProducts.slice(0, 2),
      topics: mockTopics.slice(0, 3),
    });
  }

  // 1. Search Published Articles only
  const matchingArticles = mockArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(query) ||
      a.subtitle.toLowerCase().includes(query) ||
      a.abstract.toLowerCase().includes(query) ||
      a.author.name.toLowerCase().includes(query) ||
      a.topicTag.toLowerCase().includes(query)
  );

  // 2. Search Published Research Papers only (strictly exclude drafts or unapproved manuscripts)
  const matchingPapers = Array.from(repository.researchPapers.values())
    .filter((p) => p.status === 'published')
    .filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.abstract.toLowerCase().includes(query) ||
        p.authors.some((a) => a.name.toLowerCase().includes(query)) ||
        (p.doi && p.doi.toLowerCase().includes(query))
    );

  // 3. Search Ecosystem Platforms
  const matchingProducts = mockEcosystemProducts.filter(
    (e) =>
      e.name.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query) ||
      e.tagline.toLowerCase().includes(query)
  );

  // 4. Search Topics
  const matchingTopics = mockTopics.filter(
    (t) =>
      t.name.toLowerCase().includes(query) ||
      (t.description && t.description.toLowerCase().includes(query)) ||
      t.slug.toLowerCase().includes(query)
  );

  const totalMatches =
    matchingArticles.length +
    matchingPapers.length +
    matchingProducts.length +
    matchingTopics.length;

  return res.json({
    query,
    totalMatches,
    articles: matchingArticles,
    researchPapers: matchingPapers,
    ecosystem: matchingProducts,
    topics: matchingTopics,
  });
});
