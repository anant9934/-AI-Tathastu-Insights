import { Router, Request, Response } from 'express';
import { repository } from '../db/repository';

export const publicRouter = Router();

function getParam(req: Request, key: string): string {
  const val = req.params[key];
  return Array.isArray(val) ? val[0] : (val as string) || '';
}

// Publicly accessible endpoints — strictly return ONLY published items!
// Private drafts, unapproved manuscripts, or admin records are never exposed here.

// 1. Homepage Configuration & Curation
publicRouter.get('/homepage', (req: Request, res: Response) => {
  const config = repository.getHomepageConfig();
  const featuredStory = config.featuredStoryId ? repository.getContentById(config.featuredStoryId) : undefined;
  const products = repository.listProducts(true);
  const research = repository.listResearchPapers(true);
  const engineering = repository.listEngineeringArticles(true);

  return res.json({
    config,
    featuredStory: featuredStory && featuredStory.status === 'published' ? featuredStory : null,
    products,
    research,
    engineering,
  });
});

// 2. Published Products
publicRouter.get('/products', (req: Request, res: Response) => {
  const products = repository.listProducts(true);
  return res.json(products);
});

publicRouter.get('/products/:slug', (req: Request, res: Response) => {
  const slug = getParam(req, 'slug');
  const product = repository.getProductBySlug(slug) || repository.getProductById(slug);
  if (!product || !product.isPublished) {
    return res.status(404).json({ error: 'NotFound', message: 'Product not found' });
  }
  return res.json(product);
});

// 3. Published Engineering Articles
publicRouter.get('/engineering', (req: Request, res: Response) => {
  const articles = repository.listEngineeringArticles(true);
  return res.json(articles);
});

// 4. Published Research Papers
publicRouter.get('/research', (req: Request, res: Response) => {
  const papers = repository.listResearchPapers(true);
  return res.json(papers);
});

// 5. Published Company Updates / Changelog
publicRouter.get('/updates', (req: Request, res: Response) => {
  const updates = repository.listUpdates(true);
  return res.json(updates);
});

// 6. Published Media Assets
publicRouter.get('/media', (req: Request, res: Response) => {
  const media = repository.listMediaAssets();
  return res.json(media);
});

// 7. Published Static Pages
publicRouter.get('/pages/:slug', (req: Request, res: Response) => {
  const slug = getParam(req, 'slug');
  const page = repository.getStaticPageBySlug(slug);
  if (!page || page.status !== 'published') {
    return res.status(404).json({ error: 'NotFound', message: 'Page not found' });
  }
  return res.json(page);
});

// 8. Navigation Menus
publicRouter.get('/navigation', (req: Request, res: Response) => {
  const menus = repository.listNavigationMenus();
  return res.json(menus);
});

// 9. Public Site Settings
publicRouter.get('/settings', (req: Request, res: Response) => {
  const settings = repository.getSiteSettings();
  return res.json({
    siteTitle: settings.siteTitle,
    siteDescription: settings.siteDescription,
    brandLogoUrl: settings.brandLogoUrl,
    faviconUrl: settings.faviconUrl,
    contactEmail: settings.contactEmail,
    socialLinks: settings.socialLinks,
    defaultSeo: settings.defaultSeo,
    footerConfig: settings.footerConfig,
  });
});

// 10. Published Content & Articles
publicRouter.get('/articles', (req: Request, res: Response) => {
  const { type, limit, offset } = req.query;
  const result = repository.listContent({
    status: 'published',
    type: type as string,
    limit: limit ? parseInt(limit as string, 10) : 50,
    offset: offset ? parseInt(offset as string, 10) : 0,
  });
  return res.json(result);
});

publicRouter.get('/articles/:idOrSlug', (req: Request, res: Response) => {
  const idOrSlug = getParam(req, 'idOrSlug');
  const item = repository.getContentById(idOrSlug) || repository.getContentBySlug(idOrSlug);
  if (!item || item.status !== 'published') {
    return res.status(404).json({ error: 'NotFound', message: 'Article not found' });
  }
  return res.json(item);
});
