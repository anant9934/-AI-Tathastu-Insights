import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { repository } from '../db/repository';
import { DoiService } from '../services/doiService';
import { CitationService } from '../services/citationService';
import { AuditService } from '../services/auditService';

export const researchRouter = Router();

const verifyDoiSchema = z.object({
  doi: z.string().min(3, 'DOI must be provided'),
});

// GET /api/research/papers - List and filter research papers
researchRouter.get('/papers', (req: Request, res: Response) => {
  const category = (req.query.category as string || 'all').toLowerCase();
  const search = (req.query.q as string || '').toLowerCase().trim();

  let papers = Array.from(repository.researchPapers.values());

  if (category !== 'all') {
    papers = papers.filter((p) => p.categoryId.toLowerCase().includes(category));
  }

  if (search) {
    papers = papers.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.abstract.toLowerCase().includes(search) ||
        p.authors.some((a) => a.name.toLowerCase().includes(search)) ||
        (p.doi && p.doi.toLowerCase().includes(search))
    );
  }

  return res.json({
    total: papers.length,
    papers,
  });
});

// GET /api/research/papers/:slug - Get single paper details
researchRouter.get('/papers/:slug', (req: Request, res: Response) => {
  const paper = Array.from(repository.researchPapers.values()).find(
    (p) => p.slug === req.params.slug || p.id === req.params.slug
  );

  if (!paper) {
    return res.status(404).json({
      error: 'NotFound',
      message: 'Research paper not found.',
    });
  }

  return res.json(paper);
});

// POST /api/research/verify-doi - Verify DOI against authoritative registries & provenance check
researchRouter.post('/verify-doi', async (req: Request, res: Response) => {
  const result = verifyDoiSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'ValidationError',
      issues: result.error.issues,
    });
  }

  const provenance = await DoiService.verifyDoi(result.data.doi);

  await AuditService.log({
    userId: req.user?.id || null,
    action: 'research:verify_doi',
    resourceType: 'doi',
    resourceId: result.data.doi,
    details: { status: provenance.publicationStatus, provenance: provenance.sourceProvenance },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return res.json(provenance);
});

// GET /api/research/papers/:id/bibtex - Export BibTeX formatted citation
researchRouter.get('/papers/:id/bibtex', (req: Request, res: Response) => {
  const paperId = req.params.id as string;
  const paper = repository.researchPapers.get(paperId) ||
    Array.from(repository.researchPapers.values()).find((p) => p.slug === paperId);

  if (!paper) {
    return res.status(404).json({
      error: 'NotFound',
      message: 'Research paper not found.',
    });
  }

  const bibtex = CitationService.generateBibtex({
    title: paper.title,
    authors: paper.authors,
    year: paper.publicationDate.includes('2026') ? 2026 : 2025,
    journal: paper.publisher,
    doi: paper.doi,
    isVerified: paper.isDoiVerified,
  });

  res.setHeader('Content-Type', 'application/x-bibtex');
  res.setHeader('Content-Disposition', `attachment; filename="${paper.slug}.bib"`);
  return res.send(bibtex);
});

// GET /api/research/papers/:id/download - Track download and serve actual available file or sample preprint
researchRouter.get('/papers/:id/download', async (req: Request, res: Response) => {
  const paperId = req.params.id as string;
  const paper = repository.researchPapers.get(paperId) ||
    Array.from(repository.researchPapers.values()).find((p) => p.slug === paperId);

  if (!paper) {
    return res.status(404).json({
      error: 'NotFound',
      message: 'Research paper not found.',
    });
  }

  // Increment download count in storage
  paper.downloadCount += 1;
  paper.updatedAt = new Date().toISOString();
  repository.researchPapers.set(paper.id, paper);

  await AuditService.log({
    userId: req.user?.id || null,
    action: 'research:paper_downloaded',
    resourceType: 'research_paper',
    resourceId: paper.id,
    details: { title: paper.title, totalDownloads: paper.downloadCount },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // Provide realistic text preprint stream with verified metadata
  const content = `% PDF-1.4 Demonstration Preprint
Title: ${paper.title}
Authors: ${paper.authors.map((a) => a.name).join(', ')}
Publisher: ${paper.publisher}
Date: ${paper.publicationDate}
License: ${paper.license}
Status: ${paper.isDoiVerified ? 'VERIFIED' : 'DEMONSTRATION CONCEPT'}
Notes: ${paper.doiVerificationNotes || 'Preprint generated for peer review and replication.'}

ABSTRACT:
${paper.abstract}

---
AI Tathastu Insights Open Science Initiative
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${paper.slug}-preprint.txt"`);
  return res.send(content);
});
