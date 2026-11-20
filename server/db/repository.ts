import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { ProvenanceRecord, DoiService } from '../services/doiService';
import { AuditService } from '../services/auditService';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  roleId: 'super_admin' | 'admin' | 'editor' | 'research_editor' | 'author' | 'media_manager' | 'contributor';
  affiliation?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ManuscriptRecord {
  id: string; // 'sub-2026-***'
  title: string;
  authorName: string;
  authorEmail: string;
  authorAffiliation: string;
  categoryId: string;
  abstract: string;
  wordCount: number;
  manuscriptFileUrl?: string;
  status: 'draft' | 'submitted' | 'in_review' | 'revision_requested' | 'approved' | 'scheduled' | 'published' | 'rejected' | 'archived';
  assignedEditorId?: string;
  assignedEditorName?: string;
  reviewerScore?: number;
  reproducibilityAttestation: boolean;
  submittedAt: string;
  updatedAt: string;
}

export interface EditorialReviewRecord {
  id: string;
  submissionId: string;
  reviewerId: string;
  reviewerName: string;
  stage: 'initial_screening' | 'peer_review' | 'ethics_check' | 'editorial_decision';
  score: number;
  recommendation: 'accept' | 'minor_revisions' | 'major_revisions' | 'reject';
  commentsForAuthor: string;
  confidentialComments?: string;
  submittedAt: string;
}

export interface ResearchPaperRecord {
  id: string;
  title: string;
  slug: string;
  doi?: string;
  isDoiVerified: boolean;
  doiVerificationSource?: string;
  doiVerificationNotes?: string;
  publicationType: string;
  abstract: string;
  authors: Array<{ name: string; role?: string; affiliation?: string }>;
  categoryId: string;
  publicationDate: string;
  publisher: string;
  license: string;
  sourceProvenance: string;
  sourceVerificationStatus: 'verified' | 'needs_review' | 'demonstration' | 'rejected';
  canonicalSource?: string;
  pdfAssetUrl?: string;
  isDownloadAvailable: boolean;
  bibtex: string;
  datasetLinks?: Array<{ name: string; url: string; size?: string }>;
  methodology?: string;
  keyFindings?: string[];
  relatedProductIds?: string[];
  downloadCount: number;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkRecord {
  id: string;
  userId?: string;
  sessionId?: string;
  articleId: string;
  createdAt: string;
}

export interface SubscriberRecord {
  id: string;
  email: string;
  isConfirmed: boolean;
  confirmationToken: string;
  consentRecordedAt: string;
  unsubscribedAt?: string;
}

export interface MediaAssetRecord {
  id: string;
  title: string;
  originalFilename?: string;
  format: 'documentary' | 'dialogue' | 'lecture' | 'image' | 'video' | 'pdf' | 'audio';
  fileType?: string;
  fileSizeBytes?: number;
  width?: number;
  height?: number;
  durationSeconds: number;
  durationLabel: string;
  speaker: string;
  speakerRole: string;
  description: string;
  coverImageUrl: string;
  fileUrl?: string;
  streamUrl?: string;
  isStreamAvailable: boolean;
  transcriptText?: string;
  altText?: string;
  caption?: string;
  attribution?: string;
  uploaderId?: string;
  uploaderName?: string;
  createdAt: string;
}

export type ContentType = 
  | 'company_story' 
  | 'product_announcement' 
  | 'product_development_update' 
  | 'engineering_article' 
  | 'research_article' 
  | 'research_report' 
  | 'tutorial_guide' 
  | 'company_announcement' 
  | 'perspective_interview' 
  | 'case_study' 
  | 'media_publication' 
  | 'company_page';

export type ContentStatus = 
  | 'draft' 
  | 'in_review' 
  | 'revision_requested' 
  | 'approved' 
  | 'scheduled' 
  | 'published' 
  | 'rejected' 
  | 'archived' 
  | 'unpublished';

export interface ContentBlock {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'image' | 'gallery' | 'video' | 'pullquote' | 'callout' | 'code' | 'table' | 'citation' | 'doi' | 'split_media';
  content: any;
  sortOrder: number;
}

export interface ContentRecord {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  abstract: string;
  contentType: ContentType;
  category: string;
  status: ContentStatus;
  primaryAuthorId: string;
  authorName: string;
  relatedProductId?: string;
  coverImageUrl?: string;
  imageCaption?: string;
  pullQuoteText?: string;
  pullQuoteAttribution?: string;
  blocks: ContentBlock[];
  rawMarkdown?: string;
  readingTimeMinutes: number;
  wordCount: number;
  isFeatured: boolean;
  isEditorsChoice: boolean;
  scheduledAt?: string;
  publishedAt?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
    noIndex?: boolean;
  };
}

export interface ContentVersionRecord {
  id: string;
  contentId: string;
  versionNumber: number;
  title: string;
  subtitle?: string;
  abstract: string;
  blocks: ContentBlock[];
  rawMarkdown?: string;
  changelog: string;
  createdById: string;
  createdAt: string;
}

export interface ProductVersionRecord {
  version: string;
  data: Partial<ProductRecord>;
  savedAt: string;
  savedBy: string;
}

export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  logoUrl?: string;
  coverImageUrl?: string;
  screenshots: string[];
  accentColor: string;
  status: 'Live Platform' | 'Beta Lab' | 'Prototype' | 'In Development' | 'Active Development' | 'Planned' | 'Discontinued';
  provenanceLabel: string;
  version: string;
  editorialStatus?: 'draft' | 'in_review' | 'approved' | 'published' | 'archived';
  reviewNotes?: string;
  approvedBy?: string;
  versions?: ProductVersionRecord[];
  problemSolved: string;
  whyExists: string;
  targetAudience: string;
  proposedSolution: string;
  productValue: string;
  features: Array<{ title: string; description: string; tag?: string }>;
  technicalArchitecture: string;
  techStack: Array<{ category: string; technologies: string[] }>;
  docLinks: Array<{ label: string; url: string }>;
  websiteUrl?: string;
  githubUrl?: string;
  isFeatured: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EngineeringArticleRecord {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  abstract: string;
  content: string[];
  authorName: string;
  authorRole: string;
  authorAffiliation: string;
  authorAvatarUrl: string;
  readingTimeMinutes: number;
  coverImageUrl: string;
  tags: string[];
  problem?: string;
  technicalContext?: string;
  approach?: string;
  implementation?: string;
  challenges?: string;
  tradeOffs?: string;
  outcome?: string;
  systemArchitecture?: {
    topology: string;
    components: Array<{ name: string; role: string; latency?: string }>;
  };
  codeSnippets?: Array<{ title: string; language: string; code: string; explanation: string }>;
  benchmarks?: Array<{ metric: string; value: string; baseline: string; note?: string }>;
  relatedProductId?: string;
  relatedResearchId?: string;
  status: 'draft' | 'in_review' | 'published' | 'archived';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyUpdateRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  detailedExplanation?: string;
  category: 'Company' | 'Product Release' | 'Engineering' | 'Research' | 'Milestone';
  productId?: string;
  version?: string;
  date: string;
  authorName: string;
  coverImageUrl?: string;
  content: string[];
  tags: string[];
  relatedLinks?: Array<{ label: string; url: string }>;
  milestoneMetric?: { label: string; value: string };
  status: 'draft' | 'published' | 'archived';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaticPageRecord {
  id: string;
  slug: string;
  title: string;
  template: 'default' | 'about' | 'editorial_charter' | 'contact' | 'legal' | 'submission_guidelines';
  content: string;
  excerpt?: string;
  featuredImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  path: string;
  isExternal?: boolean;
  isDropdown?: boolean;
  children?: Array<{ id: string; label: string; path: string; isExternal?: boolean }>;
  order: number;
  isEnabled: boolean;
}

export interface NavigationMenuRecord {
  id: 'main' | 'footer' | 'product';
  name: string;
  items: NavigationMenuItem[];
  updatedAt: string;
}

export interface HomepageConfigRecord {
  id: 'default';
  heroHeadline: string;
  heroSubtitle: string;
  heroDescription: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  heroMediaUrl?: string;
  heroMediaType: 'image' | 'video';
  featuredStoryId: string;
  featuredProductIds: string[];
  featuredResearchIds: string[];
  featuredEngineeringIds: string[];
  featuredMediaIds: string[];
  sectionsConfig: Array<{ id: string; title: string; description: string; enabled: boolean; order: number }>;
  updatedAt: string;
}

export interface SiteSettingsRecord {
  id: 'default';
  siteTitle: string;
  siteDescription: string;
  brandLogoUrl?: string;
  faviconUrl?: string;
  contactEmail: string;
  socialLinks: Array<{ platform: string; url: string }>;
  defaultSeo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  footerConfig: {
    copyrightText: string;
    disclaimerText: string;
  };
  themeDefaults: {
    defaultTheme: 'system' | 'light' | 'dark';
  };
  updatedAt: string;
}

class MemoryStore {
  public users: Map<string, UserRecord> = new Map();
  public manuscripts: Map<string, ManuscriptRecord> = new Map();
  public reviews: Map<string, EditorialReviewRecord> = new Map();
  public researchPapers: Map<string, ResearchPaperRecord> = new Map();
  public bookmarks: Map<string, BookmarkRecord> = new Map();
  public subscribers: Map<string, SubscriberRecord> = new Map();
  public mediaAssets: Map<string, MediaAssetRecord> = new Map();
  public content: Map<string, ContentRecord> = new Map();
  public contentVersions: Map<string, ContentVersionRecord[]> = new Map(); // contentId -> versions
  public products: Map<string, ProductRecord> = new Map();
  public engineeringArticles: Map<string, EngineeringArticleRecord> = new Map();
  public companyUpdates: Map<string, CompanyUpdateRecord> = new Map();
  public staticPages: Map<string, StaticPageRecord> = new Map();
  public navigationMenus: Map<string, NavigationMenuRecord> = new Map();
  public homepageConfig: HomepageConfigRecord = {
    id: 'default',
    heroHeadline: 'Advancing Frontier AI Through Verifiable Research & Systems',
    heroSubtitle: 'The official publication, research archive, and engineering documentation of AI Tathastu.',
    heroDescription: 'AI Tathastu Insights publishes verified empirical investigations, system architectures, and peer-reviewed preprints across alignment, scalable inference, distributed agent consensus, and perceptual models.',
    primaryCtaText: 'Explore Systems',
    primaryCtaLink: '#products',
    secondaryCtaText: 'Read Research',
    secondaryCtaLink: '#research',
    heroMediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    heroMediaType: 'image',
    featuredStoryId: 'sparse-autoencoders-residual-stream',
    featuredProductIds: ['mentormaze', 'collaborate', 'avsar', 'iris'],
    featuredResearchIds: ['paper-sparse-autoencoders', 'paper-aegis-bft', 'paper-iris-voxel'],
    featuredEngineeringIds: ['eng-aegis-consensus', 'eng-triton-inference', 'eng-kv-quantization'],
    featuredMediaIds: ['media-doc-01', 'media-dialogue-14'],
    sectionsConfig: [
      { id: 'hero', title: 'Hero Story & Identity', description: 'Main hero narrative and primary interaction', enabled: true, order: 1 },
      { id: 'products', title: 'Ecosystem & Products', description: 'Verified products and active development platforms', enabled: true, order: 2 },
      { id: 'research', title: 'Research & Preprints', description: 'Empirical papers with DOI and verification stamps', enabled: true, order: 3 },
      { id: 'engineering', title: 'Engineering Deep-Dives', description: 'Systems architecture, kernel optimizations, and benchmarks', enabled: true, order: 4 },
      { id: 'media', title: 'Media & Dialogues', description: 'Lectures, architectural walkthroughs, and discussions', enabled: true, order: 5 },
      { id: 'updates', title: 'Changelog & Updates', description: 'Chronological releases and milestone logs', enabled: true, order: 6 },
      { id: 'newsletter', title: 'Newsletter & Subscriptions', description: 'Verified research dispatch signup', enabled: true, order: 7 },
    ],
    updatedAt: new Date().toISOString(),
  };
  public siteSettings: SiteSettingsRecord = {
    id: 'default',
    siteTitle: 'AI Tathastu Insights',
    siteDescription: 'The official publication, open research archive, and engineering documentation of AI Tathastu.',
    brandLogoUrl: '/logo.svg',
    faviconUrl: '/favicon.ico',
    contactEmail: 'editorial@tathastu-insights.org',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/anant9934/-AI-Tathastu-Insights' },
      { platform: 'Twitter', url: 'https://twitter.com/aitathastu' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/ai-tathastu' },
    ],
    defaultSeo: {
      metaTitle: 'AI Tathastu Insights — Frontier AI Research & Systems',
      metaDescription: 'Verified investigations, distributed systems architectures, and open preprints by AI Tathastu.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    },
    footerConfig: {
      copyrightText: '© 2026 AI Tathastu Insights. Published under CC BY-NC 4.0 Open Science Charter.',
      disclaimerText: 'Empirical verifiability policy enforced. Prototypes and roadmaps are explicitly identified.',
    },
    themeDefaults: {
      defaultTheme: 'system',
    },
    updatedAt: new Date().toISOString(),
  };

  public revokedTokens: Map<string, { tokenHash: string; userId?: string; expiresAt: string; revokedAt: string; reason?: string }> = new Map();
  public passwordResetTokens: Map<string, { tokenHash: string; userId: string; expiresAt: string; usedAt?: string; createdAt: string }> = new Map();

  private diskStoragePath = path.resolve(process.cwd(), 'server/data/cms_store.json');

  public persistToDisk(): void {
    try {
      const dir = path.dirname(this.diskStoragePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const snapshot = {
        users: Array.from(this.users.entries()),
        manuscripts: Array.from(this.manuscripts.entries()),
        reviews: Array.from(this.reviews.entries()),
        bookmarks: Array.from(this.bookmarks.entries()),
        content: Array.from(this.content.entries()),
        contentVersions: Array.from(this.contentVersions.entries()),
        products: Array.from(this.products.entries()),
        engineeringArticles: Array.from(this.engineeringArticles.entries()),
        companyUpdates: Array.from(this.companyUpdates.entries()),
        researchPapers: Array.from(this.researchPapers.entries()),
        mediaAssets: Array.from(this.mediaAssets.entries()),
        staticPages: Array.from(this.staticPages.entries()),
        navigationMenus: Array.from(this.navigationMenus.entries()),
        homepageConfig: this.homepageConfig,
        siteSettings: this.siteSettings,
        subscribers: Array.from(this.subscribers.entries()),
        revokedTokens: Array.from(this.revokedTokens.entries()),
        passwordResetTokens: Array.from(this.passwordResetTokens.entries()),
        persistedAt: new Date().toISOString(),
      };
      fs.writeFileSync(this.diskStoragePath, JSON.stringify(snapshot, null, 2), 'utf8');
    } catch (err: any) {
      console.warn('[Repository Persistence] Warning: failed to flush snapshot to disk:', err.message);
    }
  }

  public loadFromDisk(): boolean {
    try {
      if (fs.existsSync(this.diskStoragePath)) {
        const raw = fs.readFileSync(this.diskStoragePath, 'utf8');
        const state = JSON.parse(raw);
        if (state.users) this.users = new Map(state.users);
        if (state.manuscripts) this.manuscripts = new Map(state.manuscripts);
        if (state.reviews) this.reviews = new Map(state.reviews);
        if (state.bookmarks) this.bookmarks = new Map(state.bookmarks);
        if (state.content) this.content = new Map(state.content);
        if (state.contentVersions) this.contentVersions = new Map(state.contentVersions);
        if (state.products) this.products = new Map(state.products);
        if (state.engineeringArticles) this.engineeringArticles = new Map(state.engineeringArticles);
        if (state.companyUpdates) this.companyUpdates = new Map(state.companyUpdates);
        if (state.researchPapers) this.researchPapers = new Map(state.researchPapers);
        if (state.mediaAssets) this.mediaAssets = new Map(state.mediaAssets);
        if (state.staticPages) this.staticPages = new Map(state.staticPages);
        if (state.navigationMenus) this.navigationMenus = new Map(state.navigationMenus);
        if (state.homepageConfig) this.homepageConfig = state.homepageConfig;
        if (state.siteSettings) this.siteSettings = state.siteSettings;
        if (state.subscribers) this.subscribers = new Map(state.subscribers);
        if (state.revokedTokens) this.revokedTokens = new Map(state.revokedTokens);
        if (state.passwordResetTokens) this.passwordResetTokens = new Map(state.passwordResetTokens);

        // Ensure all 7 system roles exist even if loaded from older snapshot
        if (!this.users.has('usr-contrib-01')) {
          const salt = bcrypt.genSaltSync(12);
          this.users.set('usr-contrib-01', {
            id: 'usr-contrib-01',
            email: 'contributor@community.org',
            passwordHash: bcrypt.hashSync('TathastuContributor2026!', salt),
            name: 'Arun Kumar',
            roleId: 'contributor',
            affiliation: 'Independent Community Researcher',
            isActive: true,
            createdAt: '2026-03-10T00:00:00Z',
          });
        }

        // Upgrade legacy product placeholders to authentic assets
        const prodMediaMap: Record<string, { coverImageUrl: string; screenshots: string[]; websiteUrl: string }> = {
          mentormaze: {
            coverImageUrl: '/media/products/mentormaze/architecture-spec.svg',
            screenshots: ['/media/products/mentormaze/architecture-spec.svg'],
            websiteUrl: 'https://mentormaze.aitathastu.com',
          },
          collaborate: {
            coverImageUrl: '/media/products/collaborate/collaborate-live.png',
            screenshots: ['/media/products/collaborate/collaborate-live.png'],
            websiteUrl: 'https://collaborate.aitathastu.com',
          },
          avsar: {
            coverImageUrl: '/media/products/avsar/avsar-live.png',
            screenshots: ['/media/products/avsar/avsar-live.png'],
            websiteUrl: 'https://avsar.aitathastu.com',
          },
          iris: {
            coverImageUrl: '/media/products/iris/architecture-spec.svg',
            screenshots: ['/media/products/iris/architecture-spec.svg'],
            websiteUrl: 'https://aitathastu.info/products/iris',
          },
        };

        for (const [id, meta] of Object.entries(prodMediaMap)) {
          const prod = this.products.get(id);
          if (prod && (!prod.coverImageUrl || prod.coverImageUrl.includes('unsplash.com'))) {
            prod.coverImageUrl = meta.coverImageUrl;
            prod.screenshots = meta.screenshots;
            prod.websiteUrl = meta.websiteUrl;
            this.products.set(id, prod);
          }
        }

        return true;
      }
    } catch (err: any) {
      console.warn('[Repository Persistence] Error reading from disk, initializing defaults:', err.message);
    }
    return false;
  }

  constructor() {
    const loaded = this.loadFromDisk();
    if (!loaded) {
      this.seedDefaults();
      this.persistToDisk();
    }
  }

  private seedDefaults() {
    const salt = bcrypt.genSaltSync(12);
    const hash = (pwd: string) => bcrypt.hashSync(pwd, salt);

    // 1. Seed Users (All Roles)
    const defaultUsers: UserRecord[] = [
      {
        id: 'usr-admin-01',
        email: 'admin@tathastu-insights.org',
        passwordHash: hash('TathastuFrontierAdmin2026!'),
        name: 'Dr. Aravind Nair',
        roleId: 'super_admin',
        affiliation: 'Frontier Alignment Group, AI Tathastu',
        isActive: true,
        createdAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'usr-admin-ops',
        email: 'admin-desk@tathastu-insights.org',
        passwordHash: hash('TathastuAdminDesk2026!'),
        name: 'Siddharth Rao',
        roleId: 'admin',
        affiliation: 'Digital Operations Desk',
        isActive: true,
        createdAt: '2026-01-10T00:00:00Z',
      },
      {
        id: 'usr-editor-01',
        email: 'editor@tathastu-insights.org',
        passwordHash: hash('TathastuEditorialDesk2026!'),
        name: 'Prof. Clara Zheng',
        roleId: 'editor',
        affiliation: 'Editorial Review Board',
        isActive: true,
        createdAt: '2026-01-15T00:00:00Z',
      },
      {
        id: 'usr-reviewer-01',
        email: 'reviewer@tathastu-insights.org',
        passwordHash: hash('TathastuReviewer2026!'),
        name: 'Vikram Sharma',
        roleId: 'research_editor',
        affiliation: 'Distributed Swarm Consortium',
        isActive: true,
        createdAt: '2026-02-01T00:00:00Z',
      },
      {
        id: 'usr-media-01',
        email: 'media@tathastu-insights.org',
        passwordHash: hash('TathastuMediaManager2026!'),
        name: 'Maya Sen',
        roleId: 'media_manager',
        affiliation: 'Visual Communications & Media Lab',
        isActive: true,
        createdAt: '2026-02-15T00:00:00Z',
      },
      {
        id: 'usr-author-01',
        email: 'author@institution.edu',
        passwordHash: hash('TathastuAuthor2026!'),
        name: 'Dr. Elena Rostova',
        roleId: 'author',
        affiliation: 'Iris Vision Labs',
        isActive: true,
        createdAt: '2026-03-01T00:00:00Z',
      },
      {
        id: 'usr-contrib-01',
        email: 'contributor@community.org',
        passwordHash: hash('TathastuContributor2026!'),
        name: 'Arun Kumar',
        roleId: 'contributor',
        affiliation: 'Independent Community Researcher',
        isActive: true,
        createdAt: '2026-03-10T00:00:00Z',
      },
    ];

    for (const u of defaultUsers) {
      this.users.set(u.id, u);
    }

    // 2. Seed Manuscripts
    const defaultManuscripts: ManuscriptRecord[] = [
      {
        id: 'sub-2026-0842',
        title: 'Topological Features of Attention Heads in Formal Proof Search',
        authorName: 'Dr. Marcus Vance',
        authorEmail: 'm.vance@cambridge-ai.ac.uk',
        authorAffiliation: 'Cambridge Automated Reasoning Group',
        categoryId: 'Frontier Systems',
        abstract: 'Mapping attention weights into simplicial complexes during Lean 4 formal verification trajectories.',
        wordCount: 8400,
        status: 'in_review',
        assignedEditorId: 'usr-editor-01',
        assignedEditorName: 'Prof. Clara Zheng',
        reviewerScore: 8.7,
        reproducibilityAttestation: true,
        submittedAt: '2026-10-18',
        updatedAt: '2026-10-20',
      },
      {
        id: 'sub-2026-0839',
        title: 'Asymmetric Key-Value Quantization Under Extreme Sequence Lengths',
        authorName: 'Dr. Priya Desai',
        authorEmail: 'priya.desai@tathastu.org',
        authorAffiliation: 'Hardware Efficiency Laboratory',
        categoryId: 'Inference Systems',
        abstract: 'Dual-phase FP4 cache compression maintaining 99.2% perplexity bounds beyond 128k context windows.',
        wordCount: 6200,
        status: 'approved',
        assignedEditorId: 'usr-admin-01',
        assignedEditorName: 'Dr. Aravind Nair',
        reviewerScore: 9.3,
        reproducibilityAttestation: true,
        submittedAt: '2026-10-12',
        updatedAt: '2026-10-19',
      },
      {
        id: 'sub-2026-0831',
        title: 'Sub-Quadratic Latency in Byzantine Multi-Agent Swarms',
        authorName: 'Vikram Sharma',
        authorEmail: 'vikram@distributed-agents.net',
        authorAffiliation: 'Consensus Engineering Foundation',
        categoryId: 'Agentic Systems',
        abstract: 'Aegis-BFT consensus protocol verified across heterogeneous 64-node clusters.',
        wordCount: 7100,
        status: 'published',
        assignedEditorId: 'usr-admin-01',
        assignedEditorName: 'Dr. Aravind Nair',
        reviewerScore: 9.6,
        reproducibilityAttestation: true,
        submittedAt: '2026-09-28',
        updatedAt: '2026-10-08',
      },
      {
        id: 'sub-2026-0814',
        title: 'Continuous Egocentric Spatial Memory Grounding in Mixed Reality',
        authorName: 'Dr. Elena Rostova',
        authorEmail: 'elena@iris-labs.org',
        authorAffiliation: 'Iris Vision Labs',
        categoryId: 'Perceptual AI',
        abstract: 'Real-time voxel reconstruction at 80 FPS on edge hardware.',
        wordCount: 9100,
        status: 'revision_requested',
        assignedEditorId: 'usr-editor-01',
        assignedEditorName: 'Prof. Clara Zheng',
        reviewerScore: 7.2,
        reproducibilityAttestation: true,
        submittedAt: '2026-09-14',
        updatedAt: '2026-10-02',
      },
    ];

    for (const m of defaultManuscripts) {
      this.manuscripts.set(m.id, m);
    }

    // 3. Seed Research Papers
    const defaultPapers: ResearchPaperRecord[] = [
      {
        id: 'paper-sparse-autoencoders',
        title: 'Top-K Sparse Autoencoders at Residual Layer Boundaries',
        slug: 'sparse-autoencoders-residual-layer',
        doi: '10.5281/zenodo.1084291',
        isDoiVerified: false,
        doiVerificationSource: 'Demonstration / Prototype Metadata',
        doiVerificationNotes: 'Zenodo ID 1084291 was historically registered for external supply-chain research. Flagged as demonstrative prototype manuscript pending official open-archive minting.',
        publicationType: 'Preprint',
        abstract: 'By training top-k sparse autoencoders with 16 million latents on intermediate transformer activations, we identify interpretable monosemantic circuits without dead feature collapse.',
        authors: [
          { name: 'Dr. Aravind Nair', role: 'Principal Investigator', affiliation: 'Frontier Alignment Group' },
          { name: 'Dr. Priya Desai', role: 'Research Scientist', affiliation: 'AI Tathastu Labs' },
        ],
        categoryId: 'interpretability',
        publicationDate: 'October 2026',
        publisher: 'AI Tathastu Insights Open Science Archive (Demonstration)',
        license: 'CC BY-NC 4.0',
        sourceProvenance: 'demonstration_concept',
        sourceVerificationStatus: 'demonstration',
        canonicalSource: 'https://github.com/anant9934/-AI-Tathastu-Insights/tree/main/research',
        pdfAssetUrl: '/downloads/papers/paper-sparse-autoencoders.pdf',
        isDownloadAvailable: true,
        bibtex: `@article{nair2026sparse,\n  title={Top-K Sparse Autoencoders at Residual Layer Boundaries},\n  author={Nair, Aravind and Desai, Priya},\n  journal={AI Tathastu Insights (Demonstration Series)},\n  year={2026},\n  note={Demonstration Prototype Record}\n}`,
        downloadCount: 142,
        status: 'published',
        createdAt: '2026-10-14T00:00:00Z',
        updatedAt: '2026-10-14T00:00:00Z',
      },
      {
        id: 'paper-aegis-bft',
        title: 'Aegis-BFT: Sub-200ms Fault-Tolerant Byzantine Consensus for Heterogeneous Agent Swarms',
        slug: 'aegis-bft-byzantine-consensus',
        doi: '10.5281/zenodo.1084278',
        isDoiVerified: false,
        doiVerificationSource: 'Demonstration / Prototype Metadata',
        doiVerificationNotes: 'Synthetic DOI generated during layout development.',
        publicationType: 'Technical Report',
        abstract: 'Deterministic consensus protocol for autonomous agent networks operating under tight communication deadlines and adversarial tool actions.',
        authors: [
          { name: 'Vikram Sharma', role: 'Lead Architect', affiliation: 'Distributed Swarm Consortium' },
          { name: 'Marcus Vance', role: 'Senior Engineer', affiliation: 'Cambridge AI' },
        ],
        categoryId: 'agentic',
        publicationDate: 'October 2026',
        publisher: 'AI Tathastu Insights Technical Series',
        license: 'CC BY-NC 4.0',
        sourceProvenance: 'demonstration_concept',
        sourceVerificationStatus: 'demonstration',
        pdfAssetUrl: '/downloads/papers/paper-aegis-bft.pdf',
        isDownloadAvailable: true,
        bibtex: `@article{sharma2026aegis,\n  title={Aegis-BFT: Sub-200ms Fault-Tolerant Byzantine Consensus for Heterogeneous Agent Swarms},\n  author={Sharma, Vikram and Vance, Marcus},\n  journal={AI Tathastu Insights Technical Series},\n  year={2026}\n}`,
        downloadCount: 98,
        status: 'published',
        createdAt: '2026-10-08T00:00:00Z',
        updatedAt: '2026-10-08T00:00:00Z',
      },
      {
        id: 'paper-iris-voxel',
        title: 'Egocentric Voxel-Semantic Memory Buffers for Continuous Physical Affordance Tracking',
        slug: 'egocentric-voxel-memory',
        doi: '10.5281/zenodo.1084265',
        isDoiVerified: false,
        doiVerificationSource: 'Demonstration / Prototype Metadata',
        doiVerificationNotes: 'Synthetic DOI generated during layout development.',
        publicationType: 'Journal Article',
        abstract: 'Real-time 3D sensory spatial memory integration for mixed reality systems operating at edge latencies.',
        authors: [
          { name: 'Dr. Elena Rostova', role: 'Director', affiliation: 'Iris Vision Labs' },
          { name: 'Dr. Aravind Nair', role: 'Investigator', affiliation: 'AI Tathastu' },
        ],
        categoryId: 'perceptual',
        publicationDate: 'September 2026',
        publisher: 'AI Tathastu Insights',
        license: 'CC BY-NC 4.0',
        sourceProvenance: 'demonstration_concept',
        sourceVerificationStatus: 'demonstration',
        pdfAssetUrl: '/downloads/papers/paper-iris-voxel.pdf',
        isDownloadAvailable: true,
        bibtex: `@article{rostova2026iris,\n  title={Egocentric Voxel-Semantic Memory Buffers for Continuous Physical Affordance Tracking},\n  author={Rostova, Elena and Nair, Aravind},\n  journal={AI Tathastu Insights},\n  year={2026}\n}`,
        downloadCount: 76,
        status: 'published',
        createdAt: '2026-09-24T00:00:00Z',
        updatedAt: '2026-09-24T00:00:00Z',
      },
    ];

    for (const p of defaultPapers) {
      this.researchPapers.set(p.id, p);
    }

    // 4. Seed Media Assets (Authentic AI Tathastu Media & Architecture Assets)
    const defaultMedia: MediaAssetRecord[] = [
      {
        id: 'media-platform-01',
        title: 'AI Tathastu Platform Overview — Skills Graph & Research Copilot',
        format: 'image',
        fileType: 'image/png',
        fileSizeBytes: 1194216,
        width: 2938,
        height: 1772,
        durationSeconds: 0,
        durationLabel: 'High-Res Interface',
        speaker: 'AI Tathastu Core Platform Team',
        speakerRole: 'Engineering Division',
        description: 'Official production interface: Mapping individual engineering proficiency directly into research and career trajectories.',
        coverImageUrl: '/media/company/platform-overview.png',
        fileUrl: '/media/company/platform-overview.png',
        streamUrl: '',
        isStreamAvailable: false,
        altText: 'AI Tathastu production interface showing career copilot and skills graph',
        caption: 'Figure 1: AI Tathastu production skill lattice and opportunity discovery interface',
        attribution: 'AI Tathastu Platform (https://aitathastu.com)',
        uploaderName: 'Maya Sen',
        createdAt: '2026-10-10T00:00:00Z',
      },
      {
        id: 'media-collaborate-01',
        title: 'Collaborate Live Platform — Swarm Coordination & EORA AI Assistant',
        format: 'image',
        fileType: 'image/png',
        fileSizeBytes: 1784799,
        width: 2940,
        height: 1774,
        durationSeconds: 0,
        durationLabel: 'Live System Screen',
        speaker: 'Collaborate Systems Team',
        speakerRole: 'Distributed Infrastructure',
        description: 'Collaborate live application interface: Multi-agent coordination dashboard with integrated EORA conversational guide.',
        coverImageUrl: '/media/products/collaborate/collaborate-live.png',
        fileUrl: '/media/products/collaborate/collaborate-live.png',
        streamUrl: '',
        isStreamAvailable: false,
        altText: 'Collaborate production interface with researcher profile and EORA assistant',
        caption: 'Figure 2: Collaborate multi-agent workspace with EORA AI Guide assistance',
        attribution: 'AI Tathastu Collaborate (https://collaborate.aitathastu.com)',
        uploaderName: 'Maya Sen',
        createdAt: '2026-10-04T00:00:00Z',
      },
      {
        id: 'media-avsar-01',
        title: 'Avsar Live Platform — Fellowship Tracks & Compute Grants',
        format: 'image',
        fileType: 'image/png',
        fileSizeBytes: 1953237,
        width: 2930,
        height: 1776,
        durationSeconds: 0,
        durationLabel: 'Live Platform',
        speaker: 'Avsar Foundation Board',
        speakerRole: 'Open Science Initiatives',
        description: 'Avsar live platform interface: Direct opportunity discovery connecting preprints to compute grants.',
        coverImageUrl: '/media/products/avsar/avsar-live.png',
        fileUrl: '/media/products/avsar/avsar-live.png',
        streamUrl: '',
        isStreamAvailable: false,
        altText: 'Avsar landing interface with opportunity discovery cards',
        caption: 'Figure 3: Avsar opportunity tracks for independent researchers',
        attribution: 'AI Tathastu Avsar (https://avsar.aitathastu.com)',
        uploaderName: 'Maya Sen',
        createdAt: '2026-10-01T00:00:00Z',
      },
      {
        id: 'media-connect-01',
        title: 'Tathastu Meet / Connect — Low-Latency Research Rooms',
        format: 'image',
        fileType: 'image/png',
        fileSizeBytes: 465232,
        width: 2940,
        height: 1770,
        durationSeconds: 0,
        durationLabel: 'Live Conferencing',
        speaker: 'Connect Engineering Team',
        speakerRole: 'Real-Time Communications',
        description: 'Tathastu Meet production interface: Federated research conference rooms with adaptive audio/video.',
        coverImageUrl: '/media/products/connect/connect-live.png',
        fileUrl: '/media/products/connect/connect-live.png',
        streamUrl: '',
        isStreamAvailable: false,
        altText: 'Tathastu Meet conferencing interface with research room selector',
        caption: 'Figure 4: Tathastu Meet real-time collaborative workspace',
        attribution: 'AI Tathastu Connect (https://connect.aitathastu.com)',
        uploaderName: 'Maya Sen',
        createdAt: '2026-09-28T00:00:00Z',
      },
      {
        id: 'media-mentormaze-01',
        title: 'MentorMaze Architecture Specification — AST Analysis & gVisor Sandbox',
        format: 'pdf',
        fileType: 'image/svg+xml',
        fileSizeBytes: 84000,
        width: 1200,
        height: 675,
        durationSeconds: 0,
        durationLabel: 'Architectural Blueprint',
        speaker: 'Research Pedagogy Core',
        speakerRole: 'Kernel Architecture',
        description: 'Authentic architectural specification: Multi-turn Socratic AST parsing paired with isolated gVisor containers.',
        coverImageUrl: '/media/products/mentormaze/architecture-spec.svg',
        fileUrl: '/media/products/mentormaze/architecture-spec.svg',
        streamUrl: '',
        isStreamAvailable: false,
        altText: 'MentorMaze architectural diagram illustrating AST disassembly and container sandbox',
        caption: 'Figure 5: MentorMaze Socratic kernel debugger architecture [Prototype Spec]',
        attribution: 'AI Tathastu Research Labs (Specification Prototype)',
        uploaderName: 'Maya Sen',
        createdAt: '2026-09-20T00:00:00Z',
      },
      {
        id: 'media-iris-01',
        title: 'Iris Perception Specification — Continuous 3D Spatial Voxel Tensor',
        format: 'pdf',
        fileType: 'image/svg+xml',
        fileSizeBytes: 82000,
        width: 1200,
        height: 675,
        durationSeconds: 0,
        durationLabel: 'Robotics Blueprint',
        speaker: 'Perceptual AI Division',
        speakerRole: 'Embodied Vision',
        description: 'Iris perception architecture: Continuous 3D voxel occupancy tensor targeted for edge robotics execution.',
        coverImageUrl: '/media/products/iris/architecture-spec.svg',
        fileUrl: '/media/products/iris/architecture-spec.svg',
        streamUrl: '',
        isStreamAvailable: false,
        altText: 'Iris architectural diagram showing 3D voxel tensor buffer and NVIDIA Jetson pipeline',
        caption: 'Figure 6: Iris 3D spatial occupancy memory engine [Prototype Spec]',
        attribution: 'AI Tathastu Perception Core (Specification Prototype)',
        uploaderName: 'Maya Sen',
        createdAt: '2026-09-15T00:00:00Z',
      },
    ];

    for (const m of defaultMedia) {
      this.mediaAssets.set(m.id, m);
    }

    // 5. Seed Products (Verified Audit-aligned status)
    const defaultProducts: ProductRecord[] = [
      {
        id: 'mentormaze',
        slug: 'mentormaze',
        name: 'MentorMaze',
        tagline: 'Adaptive AI Mentorship & Academic Trajectory Synthesis',
        shortDescription: 'Adaptive scaffolding engine converting open-ended problem exploration into structured reasoning pathways with deterministic sandbox execution.',
        fullDescription: 'MentorMaze addresses the brittleness of autonomous code evaluation and multi-turn educational reasoning. By decomposing complex algorithmic challenges into directed acyclic dependency graphs, students and engineers receive targeted conceptual interventions without shortcutting problem discovery.',
        logoUrl: '/icons/mentormaze.svg',
        coverImageUrl: '/media/products/mentormaze/architecture-spec.svg',
        screenshots: [
          '/media/products/mentormaze/architecture-spec.svg',
        ],
        accentColor: 'blue',
        status: 'Prototype',
        provenanceLabel: 'Functional Demonstration',
        version: 'Prototype v0.8',
        problemSolved: 'Preventing hallucinated debugging advice and unbounded trial-and-error code execution in educational environments.',
        whyExists: 'Traditional coding tutors provide completed answers rather than leading learners to discover the invariant principles.',
        targetAudience: 'Software engineering academies, computer science university departments, and self-directed developers.',
        proposedSolution: 'Constraint-guided AST evaluation coupled with sandboxed execution checks to guide problem solving step-by-step.',
        productValue: '4.2x higher concept retention rates and zero unchecked hallucinated syntax errors.',
        features: [
          { title: 'Deterministic AST Scaffolding', description: 'Parses code attempts into syntax trees to identify conceptual gaps.', tag: 'Core Engine' },
          { title: 'Isolated Container Sandbox', description: 'Executes candidate submissions within memory-bounded environments.', tag: 'Infrastructure' },
          { title: 'Adaptive Interventions', description: 'Generates minimal Socratic hints instead of full code solutions.', tag: 'AI Reasoning' },
        ],
        technicalArchitecture: 'Containerized execution workers orchestrated via Redis message queues, communicating with a lightweight AST analyzer and model inference gateway.',
        techStack: [
          { category: 'Runtime', technologies: ['TypeScript', 'Node.js', 'Python 3.12'] },
          { category: 'Isolation', technologies: ['Docker', 'Linux cgroups'] },
          { category: 'Frontend', technologies: ['React 19', 'Tailwind CSS', 'Monaco Editor'] },
        ],
        docLinks: [
          { label: 'Architecture Overview', url: '#engineering' },
          { label: 'Sandbox Security Specifications', url: '#about' },
        ],
        websiteUrl: 'https://mentormaze.aitathastu.com',
        githubUrl: 'https://github.com/anant9934/-AI-Tathastu-Insights',
        isFeatured: true,
        displayOrder: 1,
        seoTitle: 'MentorMaze — Adaptive Code Scaffolding Engine',
        seoDescription: 'Deterministic AST evaluation and containerized execution tracing for algorithmic education.',
        isPublished: true,
        createdAt: '2026-03-01T00:00:00Z',
        updatedAt: '2026-10-15T00:00:00Z',
      },
      {
        id: 'collaborate',
        slug: 'collaborate',
        name: 'Collaborate',
        tagline: 'Distributed Peer Research & Multi-Agent Synthesis Node',
        shortDescription: 'Asynchronous multi-agent orchestration fabric ensuring deterministic agreement and conflict arbitration across distributed autonomous tools.',
        fullDescription: 'Collaborate coordinates swarms of heterogeneous AI agents operating concurrently across code repositories, database migrations, and production deployments. It guarantees serializable transaction semantics and prevents conflicting agent edits through sub-quadratic consensus protocols.',
        logoUrl: '/icons/collaborate.svg',
        coverImageUrl: '/media/products/collaborate/collaborate-live.png',
        screenshots: [
          '/media/products/collaborate/collaborate-live.png',
        ],
        accentColor: 'violet',
        status: 'In Development',
        provenanceLabel: 'In Development',
        version: 'Dev v0.9',
        problemSolved: 'Eliminating race conditions and divergent states when multiple agents write to shared file trees or state machines.',
        whyExists: 'Multi-agent frameworks degrade rapidly into deadlock or state corruption when agents act asynchronously without formal consensus.',
        targetAudience: 'Enterprise platform teams deploying automated code modification pipelines and autonomous microservices.',
        proposedSolution: 'Aegis-BFT consensus engine combined with a distributed vector clock for atomic agent commit transactions.',
        productValue: 'Guaranteed linearizability across concurrent agent operations with zero merge conflict rollbacks.',
        features: [
          { title: 'Aegis Consensus Engine', description: 'Fault-tolerant consensus protocol tuned for token-constrained agent networks.', tag: 'Protocol' },
          { title: 'Atomic Tool Isolation', description: 'Transactions are committed only after quorum verification passes.', tag: 'Security' },
          { title: 'Visual Swarm Topology', description: 'Live monitoring UI visualizing agent communication graphs and voting rounds.', tag: 'Observability' },
        ],
        technicalArchitecture: 'Rust-based consensus daemon connected over gRPC to lightweight agent worker nodes, with an append-only commit ledger.',
        techStack: [
          { category: 'Consensus Core', technologies: ['Rust', 'Tokio', 'gRPC', 'Protobuf'] },
          { category: 'Storage', technologies: ['RocksDB', 'SQLite'] },
          { category: 'Integration', technologies: ['TypeScript SDK', 'Python SDK'] },
        ],
        docLinks: [
          { label: 'Aegis-BFT Protocol Specification', url: '#research' },
        ],
        websiteUrl: 'https://collaborate.aitathastu.com',
        githubUrl: 'https://github.com/anant9934/-AI-Tathastu-Insights',
        isFeatured: true,
        displayOrder: 2,
        seoTitle: 'Collaborate — Byzantine Fault-Tolerant Multi-Agent Coordination',
        seoDescription: 'Asynchronous consensus engine for distributed autonomous AI agent networks.',
        isPublished: true,
        createdAt: '2026-04-10T00:00:00Z',
        updatedAt: '2026-10-18T00:00:00Z',
      },
      {
        id: 'avsar',
        slug: 'avsar',
        name: 'Avsar',
        tagline: 'Frontier AI Talent & Opportunity Discovery Engine',
        shortDescription: 'Verifiable evaluation platform executing frontier AI benchmark suites under strict hardware constraints with cryptographic audit proofs.',
        fullDescription: 'Avsar systematically verifies claims in machine learning literature by automatically provisioning isolated compute environments, pulling model weights, re-running test suites, and publishing verifiable provenance logs.',
        logoUrl: '/icons/avsar.svg',
        coverImageUrl: '/media/products/avsar/avsar-live.png',
        screenshots: [
          '/media/products/avsar/avsar-live.png',
        ],
        accentColor: 'green',
        status: 'In Development',
        provenanceLabel: 'In Development',
        version: 'Dev v0.7',
        problemSolved: 'The replication crisis in frontier AI research where published benchmark numbers cannot be verified independently.',
        whyExists: 'Benchmark inflation and cherry-picked prompt templates obscure true model capability metrics.',
        targetAudience: 'Research institutions, regulatory audit teams, and AI safety organizations.',
        proposedSolution: 'Automated containerized reproduction harnesses generating signed hardware telemetry and SHA-256 result hashes.',
        productValue: 'Unambiguous empirical reproducibility with open benchmark logs.',
        features: [
          { title: 'Automated Reproduction Pipeline', description: 'Re-runs benchmark scripts across fixed GPU thermal and batch constraints.', tag: 'Evaluation' },
          { title: 'Cryptographic Run Attestation', description: 'Generates SHA-256 hashes of test data, model weights, and outputs.', tag: 'Integrity' },
          { title: 'Open Benchmark Archive', description: 'Publicly browsable directory of verified empirical reproduction runs.', tag: 'Transparency' },
        ],
        technicalArchitecture: 'Slurm/Kubernetes job orchestrator spinning up ephemeral benchmark pods with read-only dataset volumes and GPU telemetry exporters.',
        techStack: [
          { category: 'Harness', technologies: ['Python', 'PyTorch', 'vLLM', 'Hugging Face'] },
          { category: 'Infra', technologies: ['Kubernetes', 'Prometheus', 'Grafana'] },
        ],
        docLinks: [
          { label: 'Evaluation Methodology', url: '#research' },
        ],
        websiteUrl: 'https://avsar.aitathastu.com',
        githubUrl: 'https://github.com/anant9934/-AI-Tathastu-Insights',
        isFeatured: true,
        displayOrder: 3,
        seoTitle: 'Avsar — Automated AI Benchmark Verification',
        seoDescription: 'Empirical reproduction platform for machine learning benchmarks and models.',
        isPublished: true,
        createdAt: '2026-05-15T00:00:00Z',
        updatedAt: '2026-10-20T00:00:00Z',
      },
      {
        id: 'iris',
        slug: 'iris',
        name: 'Iris',
        tagline: 'Continuous Spatial Intelligence & Multimodal Perceptual Systems',
        shortDescription: 'Perceptual AI system integrating live video streams into 3D voxel-semantic spatial memory buffers for real-time robotic and AR interaction.',
        fullDescription: 'Iris provides continuous spatial awareness for embodied robots and mixed reality headsets. It projects egocentric camera feeds into a dense 3D voxel representation augmented with semantic affordance embeddings at high frame rates.',
        logoUrl: '/icons/iris.svg',
        coverImageUrl: '/media/products/iris/architecture-spec.svg',
        screenshots: [
          '/media/products/iris/architecture-spec.svg',
        ],
        accentColor: 'indigo',
        status: 'In Development',
        provenanceLabel: 'In Development',
        version: 'Dev v0.6',
        problemSolved: 'Loss of spatial context in continuous video reasoning models due to flat frame-by-frame memory bottlenecks.',
        whyExists: 'Robots and mixed reality devices need continuous 3D object persistence even when objects leave the immediate camera frustum.',
        targetAudience: 'Robotics labs, AR/VR headset developers, and spatial computing researchers.',
        proposedSolution: 'Volumetric egocentric voxel buffer updated incrementally from monocular depth and segmentation heads.',
        productValue: 'Sub-20ms memory lookup latency with robust physical affordance tracking.',
        features: [
          { title: 'Volumetric Voxel Memory', description: 'Maintains 3D occupancy grids tagged with open-vocabulary semantic embeddings.', tag: '3D Perception' },
          { title: 'Affordance Projection', description: 'Calculates physical interaction points (grasping, avoidance) in real time.', tag: 'Embodiment' },
          { title: 'Edge Hardware Kernel', description: 'Optimized CUDA/TensorRT kernels running directly on mobile compute units.', tag: 'Edge AI' },
        ],
        technicalArchitecture: 'C++ / CUDA perception pipeline processing camera feeds into an octree spatial index with Python bindings for higher-level planners.',
        techStack: [
          { category: 'Perception Core', technologies: ['C++20', 'CUDA', 'TensorRT', 'OpenCV'] },
          { category: 'Sensory Fusion', technologies: ['VIO', 'Depth Estimation', 'CLIP Embeddings'] },
        ],
        docLinks: [
          { label: 'Spatial Memory Whitepaper', url: '#research' },
        ],
        websiteUrl: 'https://aitathastu.info/products/iris',
        githubUrl: 'https://github.com/anant9934/-AI-Tathastu-Insights',
        isFeatured: true,
        displayOrder: 4,
        seoTitle: 'Iris — Egocentric 3D Spatial Memory Engine',
        seoDescription: 'Real-time volumetric perception and affordance grounding for mixed reality and robotics.',
        isPublished: true,
        createdAt: '2026-06-01T00:00:00Z',
        updatedAt: '2026-10-22T00:00:00Z',
      },
    ];

    for (const p of defaultProducts) {
      this.products.set(p.id, p);
    }

    // 6. Seed Content across the 12 Content Types
    const defaultContentItems: ContentRecord[] = [
      {
        id: 'sparse-autoencoders-residual-stream',
        slug: 'sparse-autoencoders-residual-stream',
        title: 'Dissecting Residual Stream Dynamics with Scaled Sparse Autoencoders',
        subtitle: 'How 16-million feature dictionaries expose monosemantic circuits in 70B parameter frontier models.',
        abstract: 'Transformer representations are polysemantic—single activation vectors encode multiple unrelated concepts. By deploying top-k sparse autoencoders across intermediate residual layers, we isolate monosemantic features with 94.2% precision, providing empirical visibility into internal reasoning trajectories.',
        contentType: 'research_article',
        category: 'Interpretability',
        status: 'published',
        primaryAuthorId: 'usr-admin-01',
        authorName: 'Dr. Aravind Nair',
        coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
        imageCaption: 'High-dimensional projection of 16M feature activations clustered by semantic monosemanticity.',
        pullQuoteText: 'Superposition is not a failure of model capacity; it is an efficient compression regime that sparse autoencoders can systematically invert.',
        pullQuoteAttribution: 'Dr. Aravind Nair, Lead Investigator',
        blocks: [
          { id: 'b1', type: 'paragraph', sortOrder: 1, content: { text: 'Transformer representations are notoriously polysemantic. A single activation vector simultaneously represents mathematical concepts, syntactic grammatical markers, and emotional valence.' } },
          { id: 'b2', type: 'heading2', sortOrder: 2, content: { text: 'The Polysemantic Bottleneck' } },
          { id: 'b3', type: 'callout', sortOrder: 3, content: { variant: 'info', title: 'Core Empirical Finding', text: 'Expanding dictionary capacity to 32x d_model eliminates 88% of polysemantic interference without degrading downstream perplexity.' } },
          { id: 'b4', type: 'code', sortOrder: 4, content: { language: 'python', code: 'import torch\nimport triton\n\n# Top-k SAE Forward Kernel\n@triton.jit\ndef topk_sae_kernel(x_ptr, w_ptr, topk_idx_ptr, k: tl.constexpr): ...', explanation: 'Triton 3.0 JIT kernel implementing bounded Top-K latent selection.' } },
        ],
        rawMarkdown: '## The Polysemantic Bottleneck\n\nTransformer representations are notoriously polysemantic...',
        readingTimeMinutes: 11,
        wordCount: 2840,
        isFeatured: true,
        isEditorsChoice: true,
        publishedAt: '2026-10-14T10:00:00Z',
        createdById: 'usr-admin-01',
        createdAt: '2026-10-12T00:00:00Z',
        updatedAt: '2026-10-14T10:00:00Z',
        seo: {
          metaTitle: 'Dissecting Residual Stream Dynamics with Sparse Autoencoders',
          metaDescription: '16M feature dictionary reveals monosemantic transformer circuits.',
          noIndex: false,
        },
      },
      {
        id: 'collaborate-consensus-release',
        slug: 'collaborate-consensus-release',
        title: 'Collaborate v0.4: Sub-200ms Byzantine Consensus for Distributed Agent Swarms',
        subtitle: 'Announcing our open protocol release for atomic tool coordination across autonomous agents.',
        abstract: 'We are releasing Collaborate v0.4, introducing the Aegis-BFT consensus engine capable of coordinating 64 heterogeneous agents with verified linearizable transactions and zero state divergence.',
        contentType: 'product_announcement',
        category: 'Agentic Systems',
        status: 'published',
        primaryAuthorId: 'usr-reviewer-01',
        authorName: 'Vikram Sharma',
        relatedProductId: 'collaborate',
        coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
        blocks: [
          { id: 'b1', type: 'paragraph', sortOrder: 1, content: { text: 'As autonomous agents transition from single-prompt assistants to cooperating teams, multi-agent coordination becomes the fundamental bottleneck.' } },
          { id: 'b2', type: 'heading2', sortOrder: 2, content: { text: 'Key Architectural Breakthroughs in v0.4' } },
          { id: 'b3', type: 'callout', sortOrder: 3, content: { variant: 'key_takeaway', title: 'Zero Merge Conflicts', text: 'Transactions are committed only after quorum verification passes across designated leader nodes.' } },
        ],
        readingTimeMinutes: 7,
        wordCount: 1650,
        isFeatured: true,
        isEditorsChoice: false,
        publishedAt: '2026-10-18T14:00:00Z',
        createdById: 'usr-reviewer-01',
        createdAt: '2026-10-17T00:00:00Z',
        updatedAt: '2026-10-18T14:00:00Z',
      },
      {
        id: 'mentormaze-ast-scaffolding',
        slug: 'mentormaze-ast-scaffolding',
        title: 'Behind MentorMaze: Real-Time AST Evaluation & Pedagogical Interventions',
        subtitle: 'Why language models struggle with code tutoring and how structured AST parsing fixes it.',
        abstract: 'A deep architectural review of MentorMaze\'s AST parsing pipeline and how combining static analysis with small generative models creates deterministic learning pathways.',
        contentType: 'engineering_article',
        category: 'System Architecture',
        status: 'published',
        primaryAuthorId: 'usr-admin-01',
        authorName: 'Dr. Aravind Nair',
        relatedProductId: 'mentormaze',
        coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
        blocks: [
          { id: 'b1', type: 'paragraph', sortOrder: 1, content: { text: 'When students write incorrect code, traditional LLM tutors either hallucinate syntax or dump the complete solution. MentorMaze parses the student code AST to detect exact conceptual misconceptions.' } },
        ],
        readingTimeMinutes: 9,
        wordCount: 2100,
        isFeatured: false,
        isEditorsChoice: true,
        publishedAt: '2026-10-05T09:00:00Z',
        createdById: 'usr-admin-01',
        createdAt: '2026-10-03T00:00:00Z',
        updatedAt: '2026-10-05T09:00:00Z',
      },
      {
        id: 'frontier-governance-perspectives',
        slug: 'frontier-governance-perspectives',
        title: 'Statutory Verification Standards for Autonomous Systems Deployment',
        subtitle: 'Why auditability and cryptographic reproducibility must replace self-reported safety benchmarks.',
        abstract: 'An analytical perspective examining the statutory governance frameworks required for autonomous multi-agent systems operating in sensitive enterprise domains.',
        contentType: 'perspective_interview',
        category: 'Governance & Alignment',
        status: 'published',
        primaryAuthorId: 'usr-editor-01',
        authorName: 'Prof. Clara Zheng',
        coverImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
        blocks: [
          { id: 'b1', type: 'paragraph', sortOrder: 1, content: { text: 'Frontier AI safety cannot rely on self-reported evals. As system agency expands, statutory verification demands signed run logs and reproducible validation suites.' } },
        ],
        readingTimeMinutes: 8,
        wordCount: 1950,
        isFeatured: false,
        isEditorsChoice: false,
        publishedAt: '2026-09-30T11:00:00Z',
        createdById: 'usr-editor-01',
        createdAt: '2026-09-28T00:00:00Z',
        updatedAt: '2026-09-30T11:00:00Z',
      },
      {
        id: 'draft-quantization-investigation',
        slug: 'draft-quantization-investigation',
        title: 'Asymmetric 4-bit KV Cache Compression at 256K Context Boundaries',
        subtitle: 'Empirical perplexity analysis of non-uniform FP4 quantizers under sustained reasoning chains.',
        abstract: 'Evaluating memory bandwidth reductions using dual-codebook FP4 quantization without catastrophic attention drift.',
        contentType: 'research_report',
        category: 'Inference Systems',
        status: 'draft',
        primaryAuthorId: 'usr-admin-01',
        authorName: 'Dr. Aravind Nair',
        blocks: [
          { id: 'b1', type: 'paragraph', sortOrder: 1, content: { text: 'Draft investigation comparing FP4, INT4 and NF4 quantizers for extreme context inference.' } },
        ],
        readingTimeMinutes: 6,
        wordCount: 1250,
        isFeatured: false,
        isEditorsChoice: false,
        createdById: 'usr-admin-01',
        createdAt: '2026-11-01T00:00:00Z',
        updatedAt: '2026-11-05T00:00:00Z',
      },
      {
        id: 'scheduled-iris-edge-benchmarks',
        slug: 'scheduled-iris-edge-benchmarks',
        title: 'Iris 3D Spatial Memory: Edge Hardware Benchmarking on Jetson Orin',
        subtitle: 'Detailed frame-time measurements and voxel reconstruction latency profiles.',
        abstract: 'Independent latency validation of Iris 3D egocentric spatial memory engine on edge embedded GPUs.',
        contentType: 'product_development_update',
        category: 'Perceptual AI',
        status: 'scheduled',
        primaryAuthorId: 'usr-author-01',
        authorName: 'Dr. Elena Rostova',
        relatedProductId: 'iris',
        blocks: [
          { id: 'b1', type: 'paragraph', sortOrder: 1, content: { text: 'Edge benchmarking results across 5 indoor spatial navigation datasets.' } },
        ],
        readingTimeMinutes: 7,
        wordCount: 1720,
        isFeatured: false,
        isEditorsChoice: false,
        scheduledAt: '2026-11-25T15:00:00Z',
        createdById: 'usr-author-01',
        createdAt: '2026-11-02T00:00:00Z',
        updatedAt: '2026-11-08T00:00:00Z',
      },
    ];

    for (const c of defaultContentItems) {
      this.content.set(c.id, c);
      this.contentVersions.set(c.id, [
        {
          id: `v1-${c.id}`,
          contentId: c.id,
          versionNumber: 1,
          title: c.title,
          subtitle: c.subtitle,
          abstract: c.abstract,
          blocks: c.blocks,
          changelog: 'Initial version created in Editorial Studio',
          createdById: c.createdById,
          createdAt: c.createdAt,
        },
      ]);
    }

    // 7. Seed Engineering Articles
    const defaultEngineering: EngineeringArticleRecord[] = [
      {
        id: 'eng-aegis-consensus',
        slug: 'aegis-consensus-architecture',
        title: 'Designing Aegis-BFT: Sub-200ms Byzantine Consensus for Distributed Agent Swarms',
        subtitle: 'How we achieved deterministic tool execution across 64 heterogeneous nodes under network jitter.',
        category: 'Distributed Systems',
        abstract: 'When coordinating swarms of LLM agents acting upon shared codebases, standard Raft consensus fails under unpredictable LLM latency. We designed Aegis-BFT, an asynchronous consensus engine that decouples agent reasoning delays from transaction commit quorums.',
        content: [
          'The fundamental dilemma in multi-agent consensus is heterogeneous turn completion times.',
          'A single agent executing a complex AST rewrite may take 12 seconds, while an assertion checker finishes in 140ms.',
          'Aegis-BFT introduces optimistic execution pipelines with rollback checkpoints verified by independent verifier nodes.',
        ],
        authorName: 'Vikram Sharma',
        authorRole: 'Lead Systems Architect',
        authorAffiliation: 'Distributed Swarm Consortium',
        authorAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        readingTimeMinutes: 12,
        coverImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
        tags: ['Rust', 'Byzantine Fault Tolerance', 'Distributed Systems', 'Agent Swarms'],
        problem: 'Asynchronous tool actions causing state divergence and merge conflicts across parallel agents.',
        technicalContext: '64-node heterogeneous compute environment with variable network packet drops.',
        approach: 'Decoupled optimistic speculation with deterministic state commit checkpoints.',
        implementation: 'Implemented in Rust using Tokio async runtime, RocksDB persistence, and gRPC.',
        challenges: 'Managing vector clock drift and memory overhead during high-frequency micro-commits.',
        tradeOffs: 'Slightly higher commit log memory footprint in exchange for guaranteed linearizability.',
        outcome: 'Sub-200ms commit latency and zero state divergence over 10,000 simulated fault injections.',
        systemArchitecture: {
          topology: 'Mesh network with rotating leader quorums and independent verifier witnesses.',
          components: [
            { name: 'Consensus Daemon', role: 'State replication and voting engine', latency: '12ms' },
            { name: 'Agent Worker Proxy', role: 'Tool execution interceptor & sandbox', latency: '45ms' },
            { name: 'Commit Ledger', role: 'Append-only rocksdb transaction log', latency: '3ms' },
          ],
        },
        codeSnippets: [
          {
            title: 'Optimistic Quorum Check in Rust',
            language: 'rust',
            code: 'pub async fn verify_quorum(&self, proposal_id: &TxId) -> Result<CommitProof, ConsensusError> {\n    let votes = self.vote_accumulator.get_votes(proposal_id).await?;\n    if votes.len() >= self.threshold_2f_plus_1() {\n        Ok(self.build_proof(proposal_id, votes)?)\n    } else {\n        Err(ConsensusError::QuorumPending)\n    }\n}',
            explanation: 'Ensures 2f+1 Byzantine quorum threshold before writing to the local ledger.',
          },
        ],
        benchmarks: [
          { metric: 'Median Commit Latency', value: '184ms', baseline: '420ms (Standard PBFT)', note: 'Measured on 64 AWS c6i.2xlarge instances' },
          { metric: 'Throughput', value: '1,420 tx/s', baseline: '380 tx/s', note: 'Batch size = 32 actions' },
        ],
        relatedProductId: 'collaborate',
        relatedResearchId: 'paper-aegis-bft',
        status: 'published',
        publishedAt: '2026-10-10T12:00:00Z',
        createdAt: '2026-10-08T00:00:00Z',
        updatedAt: '2026-10-10T12:00:00Z',
      },
      {
        id: 'eng-triton-inference',
        slug: 'triton-kernel-interpretability',
        title: 'Writing Custom Triton Kernels for 16M Feature Sparse Autoencoders',
        subtitle: 'Overcoming memory bandwidth bottlenecks in extreme-width dictionary forward passes.',
        category: 'Kernel Engineering',
        abstract: 'Scaling sparse autoencoders to 16 million latents causes catastrophic memory stall if implemented naively in PyTorch. We wrote a fused Triton 3.0 JIT kernel that combines matrix multiplication with top-k selection directly in SRAM.',
        content: [
          'High expansion factors (32x to 128x d_model) place massive pressure on GPU High Bandwidth Memory (HBM).',
          'By loading weights directly into streaming multiprocessor registers and applying online top-k thresholding, we reduce global memory writes by 98.4%.',
        ],
        authorName: 'Marcus Vance',
        authorRole: 'Staff Systems Architect',
        authorAffiliation: 'Systems & Consensus Core, AI Tathastu',
        authorAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
        readingTimeMinutes: 10,
        coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
        tags: ['Triton', 'CUDA', 'GPU Kernels', 'Interpretability'],
        status: 'published',
        publishedAt: '2026-10-16T14:00:00Z',
        createdAt: '2026-10-15T00:00:00Z',
        updatedAt: '2026-10-16T14:00:00Z',
      },
    ];

    for (const e of defaultEngineering) {
      this.engineeringArticles.set(e.id, e);
    }

    // 8. Seed Company Updates / Changelog
    const defaultUpdates: CompanyUpdateRecord[] = [
      {
        id: 'update-2026-10-24',
        slug: 'update-collaborate-v04',
        title: 'Collaborate v0.4 Released with Aegis-BFT Consensus',
        summary: 'Major protocol upgrade adding sub-200ms consensus quorums, live swarm topology visualization, and TypeScript SDK.',
        detailedExplanation: 'This release marks the completion of Milestone 2 for the Collaborate multi-agent runtime. All agents now communicate over encrypted gRPC channels with verifiable commit receipts.',
        category: 'Product Release',
        productId: 'collaborate',
        version: '0.4.1',
        date: 'October 24, 2026',
        authorName: 'Vikram Sharma',
        coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
        content: [
          'Introduced Aegis-BFT consensus protocol verified across 64-node clusters.',
          'Added automatic rollback checkpoints for speculative tool actions.',
          'Released `@tathastu/collaborate-sdk` on npm.',
        ],
        tags: ['Collaborate', 'Release', 'Consensus', 'Agents'],
        relatedLinks: [
          { label: 'Engineering Deep-Dive', url: '#engineering' },
          { label: 'Whitepaper Preprint', url: '#research' },
        ],
        milestoneMetric: { label: 'Cluster Scale', value: '64 Heterogeneous Nodes' },
        status: 'published',
        publishedAt: '2026-10-24T12:00:00Z',
        createdAt: '2026-10-24T00:00:00Z',
        updatedAt: '2026-10-24T12:00:00Z',
      },
      {
        id: 'update-2026-10-15',
        slug: 'update-open-archive-doi',
        title: 'Open Science Archive Live with CrossRef DOI Verification',
        summary: 'All research papers and preprints published on AI Tathastu Insights now feature real-time DOI resolution and BibTeX exports.',
        detailedExplanation: 'We have updated our publication infrastructure to guarantee transparent provenance. Demonstrations and synthetic records are explicitly tagged to uphold publication ethics.',
        category: 'Milestone',
        date: 'October 15, 2026',
        authorName: 'Prof. Clara Zheng',
        coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
        content: [
          'Live verification integration with CrossRef and DataCite APIs.',
          'Provenances clearly categorized as Verified, Demonstration, or Needs Review.',
          'Automated BibTeX and citation snippet generators.',
        ],
        tags: ['Open Science', 'DOI', 'Ethics', 'Editorial'],
        milestoneMetric: { label: 'Audit Standard', value: 'Double-Blind Empirical Check' },
        status: 'published',
        publishedAt: '2026-10-15T10:00:00Z',
        createdAt: '2026-10-15T00:00:00Z',
        updatedAt: '2026-10-15T10:00:00Z',
      },
      {
        id: 'update-2026-10-01',
        slug: 'update-mentormaze-beta',
        title: 'MentorMaze Beta Lab Opens for Academic Partners',
        summary: 'First cohort of 5 computer science departments onboarded to the deterministic AST scaffolding environment.',
        category: 'Company',
        productId: 'mentormaze',
        version: '0.8.0',
        date: 'October 1, 2026',
        authorName: 'Dr. Aravind Nair',
        content: [
          'Deployed isolated execution sandboxes for Python and C++ assignments.',
          'Student code analyzed in real time with Socratic hints.',
        ],
        tags: ['MentorMaze', 'Education', 'Beta'],
        status: 'published',
        publishedAt: '2026-10-01T09:00:00Z',
        createdAt: '2026-10-01T00:00:00Z',
        updatedAt: '2026-10-01T09:00:00Z',
      },
    ];

    for (const u of defaultUpdates) {
      this.companyUpdates.set(u.id, u);
    }

    // 9. Seed Static Pages
    const defaultPages: StaticPageRecord[] = [
      {
        id: 'page-about',
        slug: 'about',
        title: 'About AI Tathastu Insights',
        template: 'about',
        excerpt: 'The official publication, research archive, and engineering documentation of AI Tathastu.',
        content: `## Who We Are\n\nAI Tathastu Insights is the official public publication and open research archive of AI Tathastu. We exist to make complex artificial intelligence architectures, empirical evaluations, systems engineering challenges, and safety invariants discoverable, understandable, and verifiable.\n\n### Our Core Mission\n\n1. **Empirical Verifiability**: We reject ungrounded benchmark inflation. Every research paper, performance statistic, and latency metric published on this platform must be backed by reproducible test harnesses or explicitly labeled as a prototype.\n2. **Open Science & Transparent Provenance**: We champion open inquiry, verified citations, open dataset availability, and clear distinction between working platforms and conceptual designs.\n3. **Engineering Depth**: We share real architecture lessons—trade-offs, kernel optimizations, deadlocks, and failure modes—so the engineering community learns alongside us.`,
        seoTitle: 'About AI Tathastu Insights — Mission, Principles & Team',
        seoDescription: 'Learn about AI Tathastu Insights, our empirical verification standards, and our open science publication philosophy.',
        status: 'published',
        publishedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-10-20T00:00:00Z',
      },
      {
        id: 'page-charter',
        slug: 'editorial-charter',
        title: 'Editorial Charter & Verification Standards',
        template: 'editorial_charter',
        excerpt: 'Our statutory commitment to factual integrity, honest prototype labeling, and double-blind peer review.',
        content: `## Editorial Charter\n\nThis Charter establishes the immutable principles governing all publications on AI Tathastu Insights:\n\n1. **No Fabricated Benchmarks**: Articles must not claim performance numbers without linking to verifiable test harnesses.\n2. **Transparent Prototype Disclosure**: Functional demonstrations, laboratory prototypes, and planned roadmap items must be visibly labeled as such.\n3. **Independent Review**: Submissions undergo multi-stage editorial review including reproducibility attestations and ethics screening.\n4. **No Advertising Or Sponsored Research**: Editorial selections are strictly based on scientific merit and systems engineering significance.`,
        seoTitle: 'Editorial Charter — AI Tathastu Insights',
        seoDescription: 'Our rigorous standards for empirical review, honest benchmark reporting, and open science transparency.',
        status: 'published',
        publishedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-10-20T00:00:00Z',
      },
      {
        id: 'page-contact',
        slug: 'contact',
        title: 'Contact & Editorial Inquiries',
        template: 'contact',
        excerpt: 'Direct channels for manuscript submission, research reproduction reports, and press inquiries.',
        content: `## Contact Our Team\n\nFor editorial inquiries, peer-review correspondence, and research reproduction claims:\n\n- **Editorial Desk**: \`editorial@tathastu-insights.org\`\n- **Research Review Board**: \`review@tathastu-insights.org\`\n- **Press & Media Inquiries**: \`press@tathastu.org\`\n- **Security & Vulnerability Disclosure**: \`security@tathastu.org\``,
        status: 'published',
        publishedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-10-20T00:00:00Z',
      },
      {
        id: 'page-privacy',
        slug: 'privacy',
        title: 'Privacy & Data Governance Policy',
        template: 'legal',
        excerpt: 'How we respect researcher anonymity, guest sessions, and newsletter subscriber data.',
        content: `## Privacy & Data Protection\n\nAI Tathastu Insights respects your privacy and complies with modern data governance standards. We do not sell user data, track visitors across third-party networks, or inject commercial trackers into our publication.`,
        status: 'published',
        publishedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-10-20T00:00:00Z',
      },
      {
        id: 'page-terms',
        slug: 'terms',
        title: 'Terms of Use & Open Science License',
        template: 'legal',
        excerpt: 'Usage terms, Creative Commons licensing, and citation attribution requirements.',
        content: `## Terms of Publication & Use\n\nAll editorial articles and research documentation published on AI Tathastu Insights are made available under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0) unless otherwise specified.`,
        status: 'published',
        publishedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-10-20T00:00:00Z',
      },
      {
        id: 'page-guidelines',
        slug: 'submission-guidelines',
        title: 'Author Submission & Reproducibility Guidelines',
        template: 'submission_guidelines',
        excerpt: 'Standard operating procedures for submitting manuscripts, datasets, and benchmark reproduction harnesses.',
        content: `## Submission Guidelines\n\nAuthors wishing to submit research or engineering deep-dives to AI Tathastu Insights must adhere to our Empirical Reproducibility Protocol:\n\n1. **Abstract**: Must clearly state the empirical claims, dataset size, and hardware environment.\n2. **Artifact Attestation**: Authors must attest that the results can be replicated with the provided artifacts.\n3. **Double-Blind Screening**: Submissions are anonymized during initial screening.`,
        status: 'published',
        publishedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-10-20T00:00:00Z',
      },
    ];

    for (const p of defaultPages) {
      this.staticPages.set(p.slug, p);
    }

    // 10. Seed Navigation Menus
    const defaultNavMenus: NavigationMenuRecord[] = [
      {
        id: 'main',
        name: 'Main Public Navigation',
        items: [
          { id: 'nav-home', label: 'Home', path: '#home', order: 1, isEnabled: true },
          { id: 'nav-products', label: 'Products', path: '#products', order: 2, isEnabled: true },
          { id: 'nav-research', label: 'Research', path: '#research', order: 3, isEnabled: true },
          { id: 'nav-eng', label: 'Engineering', path: '#engineering', order: 4, isEnabled: true },
          { id: 'nav-updates', label: 'Updates', path: '#updates', order: 5, isEnabled: true },
          { id: 'nav-media', label: 'Media', path: '#media', order: 6, isEnabled: true },
          { id: 'nav-about', label: 'About', path: '#about', order: 7, isEnabled: true },
        ],
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'footer',
        name: 'Footer Navigation',
        items: [
          { id: 'foot-products', label: 'Ecosystem & Products', path: '#products', order: 1, isEnabled: true },
          { id: 'foot-research', label: 'Research Archive', path: '#research', order: 2, isEnabled: true },
          { id: 'foot-charter', label: 'Editorial Charter', path: '#about', order: 3, isEnabled: true },
          { id: 'foot-studio', label: 'Editorial Studio', path: '#studio', order: 4, isEnabled: true },
        ],
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'product',
        name: 'Product Sub-Navigation',
        items: [
          { id: 'prod-mm', label: 'MentorMaze', path: '#products', order: 1, isEnabled: true },
          { id: 'prod-collab', label: 'Collaborate', path: '#products', order: 2, isEnabled: true },
          { id: 'prod-avsar', label: 'Avsar', path: '#products', order: 3, isEnabled: true },
          { id: 'prod-iris', label: 'Iris', path: '#products', order: 4, isEnabled: true },
        ],
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const nav of defaultNavMenus) {
      this.navigationMenus.set(nav.id, nav);
    }

    // 11. Seed Subscribers
    const defaultSubscribers: SubscriberRecord[] = [
      {
        id: 'sub-01',
        email: 'researcher@stanford.edu',
        isConfirmed: true,
        confirmationToken: 'conf-stanford-8821',
        consentRecordedAt: '2026-08-14T10:00:00Z',
      },
      {
        id: 'sub-02',
        email: 'systems.lead@deepmind.google.com',
        isConfirmed: true,
        confirmationToken: 'conf-dm-4491',
        consentRecordedAt: '2026-09-02T12:00:00Z',
      },
      {
        id: 'sub-03',
        email: 'safety-eval@cmu.edu',
        isConfirmed: true,
        confirmationToken: 'conf-cmu-1942',
        consentRecordedAt: '2026-10-01T15:30:00Z',
      },
      {
        id: 'sub-04',
        email: 'scholar@oxford.ac.uk',
        isConfirmed: false,
        confirmationToken: 'conf-ox-3312',
        consentRecordedAt: '2026-11-05T08:00:00Z',
      },
    ];

    for (const s of defaultSubscribers) {
      this.subscribers.set(s.id, s);
    }
  }

  // -------------------------------------------------------------
  // OPERATIONAL DASHBOARD METRICS (COMPUTED FROM ACTUAL DB QUERIES)
  // -------------------------------------------------------------
  public getDashboardMetrics() {
    const allContent = Array.from(this.content.values());
    const publishedArticles = allContent.filter((c) => c.status === 'published').length;
    const drafts = allContent.filter((c) => c.status === 'draft').length;
    const inReview = allContent.filter((c) => c.status === 'in_review').length + 
                     Array.from(this.manuscripts.values()).filter((m) => m.status === 'in_review').length;
    const scheduled = allContent.filter((c) => c.status === 'scheduled').length;
    const totalProducts = this.products.size;
    const publishedUpdates = Array.from(this.companyUpdates.values()).filter((u) => u.status === 'published').length;
    const mediaAssets = this.mediaAssets.size;
    const subscriberCount = Array.from(this.subscribers.values()).filter((s) => s.isConfirmed && !s.unsubscribedAt).length;

    // Workflow breakdown
    const workflowCounts = {
      draft: allContent.filter((c) => c.status === 'draft').length,
      in_review: allContent.filter((c) => c.status === 'in_review').length,
      revision_requested: allContent.filter((c) => c.status === 'revision_requested').length,
      approved: allContent.filter((c) => c.status === 'approved').length,
      scheduled: allContent.filter((c) => c.status === 'scheduled').length,
      published: allContent.filter((c) => c.status === 'published').length,
      archived: allContent.filter((c) => c.status === 'archived').length,
    };

    const recentActivities = AuditService.getRecentLogs(15);
    const upcomingScheduled = allContent.filter((c) => c.status === 'scheduled');
    const draftsAwaitingAttention = allContent.filter((c) => c.status === 'draft' || c.status === 'in_review');
    const recentPublished = allContent
      .filter((c) => c.status === 'published')
      .sort((a, b) => new Date(b.publishedAt || b.updatedAt).getTime() - new Date(a.publishedAt || a.updatedAt).getTime())
      .slice(0, 5);

    return {
      metrics: {
        publishedArticles,
        drafts,
        inReview,
        scheduled,
        totalProducts,
        publishedUpdates,
        mediaAssets,
        subscriberCount,
      },
      workflowCounts,
      recentActivities,
      upcomingScheduled,
      draftsAwaitingAttention,
      recentPublished,
    };
  }

  // -------------------------------------------------------------
  // UNIFIED CONTENT MANAGEMENT
  // -------------------------------------------------------------
  public listContent(params?: {
    type?: string;
    status?: string;
    productId?: string;
    authorId?: string;
    q?: string;
    limit?: number;
    offset?: number;
  }) {
    let list = Array.from(this.content.values());

    if (params?.type && params.type !== 'all') {
      list = list.filter((c) => c.contentType === params.type);
    }
    if (params?.status && params.status !== 'all') {
      list = list.filter((c) => c.status === params.status);
    }
    if (params?.productId && params.productId !== 'all') {
      list = list.filter((c) => c.relatedProductId === params.productId);
    }
    if (params?.authorId && params.authorId !== 'all') {
      list = list.filter((c) => c.primaryAuthorId === params.authorId);
    }
    if (params?.q) {
      const q = params.q.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.abstract.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          c.authorName.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const total = list.length;
    const offset = params?.offset || 0;
    const limit = params?.limit || 50;
    const items = list.slice(offset, offset + limit);

    return { total, items, offset, limit };
  }

  public getContentById(id: string): ContentRecord | undefined {
    return this.content.get(id);
  }

  public getContentBySlug(slug: string): ContentRecord | undefined {
    return Array.from(this.content.values()).find((c) => c.slug === slug);
  }

  public createContent(data: Partial<ContentRecord>, userId: string): ContentRecord {
    const id = data.id || `cnt-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const slug = data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || id;
    const now = new Date().toISOString();

    const record: ContentRecord = {
      id,
      slug,
      title: data.title || 'Untitled Article',
      subtitle: data.subtitle || '',
      abstract: data.abstract || '',
      contentType: data.contentType || 'company_story',
      category: data.category || 'Frontier Systems',
      status: data.status || 'draft',
      primaryAuthorId: data.primaryAuthorId || userId,
      authorName: data.authorName || 'Staff Contributor',
      relatedProductId: data.relatedProductId,
      coverImageUrl: data.coverImageUrl,
      imageCaption: data.imageCaption,
      pullQuoteText: data.pullQuoteText,
      pullQuoteAttribution: data.pullQuoteAttribution,
      blocks: data.blocks || [],
      rawMarkdown: data.rawMarkdown || '',
      readingTimeMinutes: data.readingTimeMinutes || Math.max(1, Math.round((data.wordCount || 800) / 220)),
      wordCount: data.wordCount || 500,
      isFeatured: !!data.isFeatured,
      isEditorsChoice: !!data.isEditorsChoice,
      scheduledAt: data.scheduledAt,
      publishedAt: data.status === 'published' ? now : undefined,
      createdById: userId,
      createdAt: now,
      updatedAt: now,
      seo: data.seo || {
        metaTitle: data.title,
        metaDescription: data.abstract?.slice(0, 160),
      },
    };

    this.content.set(id, record);

    // Save initial version
    const versionRecord: ContentVersionRecord = {
      id: `ver-${Date.now()}`,
      contentId: id,
      versionNumber: 1,
      title: record.title,
      subtitle: record.subtitle,
      abstract: record.abstract,
      blocks: record.blocks,
      rawMarkdown: record.rawMarkdown,
      changelog: 'Initial draft created in CMS',
      createdById: userId,
      createdAt: now,
    };
    this.contentVersions.set(id, [versionRecord]);
    this.persistToDisk();

    return record;
  }

  public updateContent(id: string, updates: Partial<ContentRecord>, userId: string, changelog?: string): ContentRecord {
    const existing = this.content.get(id);
    if (!existing) throw new Error(`Content with ID ${id} not found`);

    const now = new Date().toISOString();
    const updated: ContentRecord = {
      ...existing,
      ...updates,
      updatedAt: now,
    };

    if (updates.status === 'published' && !existing.publishedAt) {
      updated.publishedAt = now;
    }

    this.content.set(id, updated);

    // Add version snapshot
    const versions = this.contentVersions.get(id) || [];
    const newVersion: ContentVersionRecord = {
      id: `ver-${Date.now()}-${versions.length + 1}`,
      contentId: id,
      versionNumber: versions.length + 1,
      title: updated.title,
      subtitle: updated.subtitle,
      abstract: updated.abstract,
      blocks: updated.blocks,
      rawMarkdown: updated.rawMarkdown,
      changelog: changelog || 'Edited in Studio Content Editor',
      createdById: userId,
      createdAt: now,
    };
    versions.unshift(newVersion);
    this.contentVersions.set(id, versions);
    this.persistToDisk();

    return updated;
  }

  public updateContentStatus(id: string, status: ContentStatus, userId: string, notes?: string): ContentRecord {
    const existing = this.content.get(id);
    if (!existing) throw new Error(`Content with ID ${id} not found`);

    const now = new Date().toISOString();
    existing.status = status;
    existing.updatedAt = now;
    if (status === 'published' && !existing.publishedAt) {
      existing.publishedAt = now;
    }

    this.content.set(id, existing);
    this.persistToDisk();
    return existing;
  }

  public duplicateContent(id: string, userId: string): ContentRecord {
    const original = this.content.get(id);
    if (!original) throw new Error(`Content with ID ${id} not found`);

    const newId = `cnt-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const duplicate: ContentRecord = {
      ...original,
      id: newId,
      slug: newSlug,
      title: `${original.title} (Copy)`,
      status: 'draft',
      publishedAt: undefined,
      scheduledAt: undefined,
      createdById: userId,
      createdAt: now,
      updatedAt: now,
    };

    this.content.set(newId, duplicate);
    this.contentVersions.set(newId, [
      {
        id: `ver-${Date.now()}`,
        contentId: newId,
        versionNumber: 1,
        title: duplicate.title,
        subtitle: duplicate.subtitle,
        abstract: duplicate.abstract,
        blocks: duplicate.blocks,
        rawMarkdown: duplicate.rawMarkdown,
        changelog: `Duplicated from ${original.id}`,
        createdById: userId,
        createdAt: now,
      },
    ]);
    this.persistToDisk();

    return duplicate;
  }

  public deleteContent(id: string): boolean {
    const existed = this.content.delete(id);
    this.contentVersions.delete(id);
    if (existed) this.persistToDisk();
    return existed;
  }

  public getContentVersions(id: string): ContentVersionRecord[] {
    return this.contentVersions.get(id) || [];
  }

  public restoreContentVersion(contentId: string, versionId: string, userId: string): ContentRecord {
    const existing = this.content.get(contentId);
    if (!existing) throw new Error(`Content with ID ${contentId} not found`);

    const versions = this.contentVersions.get(contentId) || [];
    const targetVersion = versions.find((v) => v.id === versionId);
    if (!targetVersion) throw new Error(`Version ${versionId} not found for content ${contentId}`);

    const now = new Date().toISOString();
    const restored: ContentRecord = {
      ...existing,
      title: targetVersion.title,
      subtitle: targetVersion.subtitle,
      abstract: targetVersion.abstract,
      blocks: targetVersion.blocks,
      rawMarkdown: targetVersion.rawMarkdown,
      updatedAt: now,
    };

    this.content.set(contentId, restored);

    const newVersion: ContentVersionRecord = {
      id: `ver-${Date.now()}-${versions.length + 1}`,
      contentId,
      versionNumber: versions.length + 1,
      title: restored.title,
      subtitle: restored.subtitle,
      abstract: restored.abstract,
      blocks: restored.blocks,
      rawMarkdown: restored.rawMarkdown,
      changelog: `Restored from snapshot ${targetVersion.versionNumber}`,
      createdById: userId,
      createdAt: now,
    };
    versions.unshift(newVersion);
    this.contentVersions.set(contentId, versions);
    this.persistToDisk();

    return restored;
  }

  // -------------------------------------------------------------
  // PRODUCT MANAGEMENT
  // -------------------------------------------------------------
  public listProducts(filterPublished = false): ProductRecord[] {
    let list = Array.from(this.products.values());
    if (filterPublished) {
      list = list.filter((p) => p.isPublished);
    }
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public getProductById(id: string): ProductRecord | undefined {
    return this.products.get(id);
  }

  public getProductBySlug(slug: string): ProductRecord | undefined {
    return Array.from(this.products.values()).find((p) => p.slug === slug);
  }

  public createProduct(data: Partial<ProductRecord>, userId: string): ProductRecord {
    const id = data.id || data.slug || `prod-${Date.now()}`;
    const slug = data.slug || id;
    const now = new Date().toISOString();

    const record: ProductRecord = {
      id,
      slug,
      name: data.name || 'New Frontier Product',
      tagline: data.tagline || '',
      shortDescription: data.shortDescription || '',
      fullDescription: data.fullDescription || '',
      logoUrl: data.logoUrl,
      coverImageUrl: data.coverImageUrl,
      screenshots: data.screenshots || [],
      accentColor: data.accentColor || 'blue',
      status: data.status || 'Prototype',
      provenanceLabel: data.provenanceLabel || 'Functional Demonstration',
      version: data.version || '0.1.0',
      problemSolved: data.problemSolved || '',
      whyExists: data.whyExists || '',
      targetAudience: data.targetAudience || '',
      proposedSolution: data.proposedSolution || '',
      productValue: data.productValue || '',
      features: data.features || [],
      technicalArchitecture: data.technicalArchitecture || '',
      techStack: data.techStack || [],
      docLinks: data.docLinks || [],
      websiteUrl: data.websiteUrl,
      githubUrl: data.githubUrl,
      isFeatured: !!data.isFeatured,
      displayOrder: data.displayOrder ?? (this.products.size + 1),
      seoTitle: data.seoTitle || data.name,
      seoDescription: data.seoDescription || data.shortDescription,
      isPublished: data.isPublished !== undefined ? data.isPublished : false,
      editorialStatus: data.editorialStatus || (data.isPublished ? 'published' : 'draft'),
      reviewNotes: data.reviewNotes,
      approvedBy: data.approvedBy,
      versions: data.versions || [],
      createdAt: now,
      updatedAt: now,
    };

    this.products.set(id, record);
    this.persistToDisk();
    return record;
  }

  public updateProduct(id: string, updates: Partial<ProductRecord>, userId: string): ProductRecord {
    const existing = this.products.get(id);
    if (!existing) throw new Error(`Product with ID ${id} not found`);

    const now = new Date().toISOString();
    const versions = existing.versions ? [...existing.versions] : [];

    // Archive previous snapshot into version history
    versions.unshift({
      version: existing.version,
      data: {
        name: existing.name,
        shortDescription: existing.shortDescription,
        status: existing.status,
        version: existing.version,
        isPublished: existing.isPublished,
        editorialStatus: existing.editorialStatus,
        screenshots: [...existing.screenshots],
      },
      savedAt: existing.updatedAt || existing.createdAt,
      savedBy: userId,
    });

    const updated: ProductRecord = {
      ...existing,
      ...updates,
      versions,
      updatedAt: now,
    };

    this.products.set(id, updated);
    this.persistToDisk();
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const res = this.products.delete(id);
    if (res) this.persistToDisk();
    return res;
  }

  public reorderProducts(orderIds: string[]): ProductRecord[] {
    orderIds.forEach((id, index) => {
      const prod = this.products.get(id);
      if (prod) {
        prod.displayOrder = index + 1;
        prod.updatedAt = new Date().toISOString();
      }
    });
    this.persistToDisk();
    return this.listProducts();
  }

  // -------------------------------------------------------------
  // ENGINEERING ARTICLES MANAGEMENT
  // -------------------------------------------------------------
  public listEngineeringArticles(filterPublished = false): EngineeringArticleRecord[] {
    let list = Array.from(this.engineeringArticles.values());
    if (filterPublished) {
      list = list.filter((a) => a.status === 'published');
    }
    return list.sort((a, b) => new Date(b.publishedAt || b.updatedAt).getTime() - new Date(a.publishedAt || a.updatedAt).getTime());
  }

  public getEngineeringArticleById(id: string): EngineeringArticleRecord | undefined {
    return this.engineeringArticles.get(id);
  }

  public createEngineeringArticle(data: Partial<EngineeringArticleRecord>, userId: string): EngineeringArticleRecord {
    const id = data.id || `eng-${Date.now()}`;
    const slug = data.slug || id;
    const now = new Date().toISOString();

    const record: EngineeringArticleRecord = {
      id,
      slug,
      title: data.title || 'New Engineering Architecture Note',
      subtitle: data.subtitle || '',
      category: data.category || 'System Architecture',
      abstract: data.abstract || '',
      content: data.content || [],
      authorName: data.authorName || 'Staff Systems Engineer',
      authorRole: data.authorRole || 'Systems Architect',
      authorAffiliation: data.authorAffiliation || 'AI Tathastu Engineering Core',
      authorAvatarUrl: data.authorAvatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      readingTimeMinutes: data.readingTimeMinutes || 8,
      coverImageUrl: data.coverImageUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
      tags: data.tags || [],
      problem: data.problem,
      technicalContext: data.technicalContext,
      approach: data.approach,
      implementation: data.implementation,
      challenges: data.challenges,
      tradeOffs: data.tradeOffs,
      outcome: data.outcome,
      systemArchitecture: data.systemArchitecture,
      codeSnippets: data.codeSnippets || [],
      benchmarks: data.benchmarks || [],
      relatedProductId: data.relatedProductId,
      relatedResearchId: data.relatedResearchId,
      status: data.status || 'published',
      publishedAt: data.status === 'published' ? now : '',
      createdAt: now,
      updatedAt: now,
    };

    this.engineeringArticles.set(id, record);
    this.persistToDisk();
    return record;
  }

  public updateEngineeringArticle(id: string, updates: Partial<EngineeringArticleRecord>, userId: string): EngineeringArticleRecord {
    const existing = this.engineeringArticles.get(id);
    if (!existing) throw new Error(`Engineering article with ID ${id} not found`);

    const now = new Date().toISOString();
    const updated: EngineeringArticleRecord = {
      ...existing,
      ...updates,
      updatedAt: now,
    };
    if (updates.status === 'published' && !existing.publishedAt) {
      updated.publishedAt = now;
    }

    this.engineeringArticles.set(id, updated);
    this.persistToDisk();
    return updated;
  }

  public deleteEngineeringArticle(id: string): boolean {
    const res = this.engineeringArticles.delete(id);
    if (res) this.persistToDisk();
    return res;
  }

  // -------------------------------------------------------------
  // RESEARCH PAPERS MANAGEMENT
  // -------------------------------------------------------------
  public listResearchPapers(filterPublished = false): ResearchPaperRecord[] {
    let list = Array.from(this.researchPapers.values());
    if (filterPublished) {
      list = list.filter((p) => p.status === 'published');
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public getResearchPaperById(id: string): ResearchPaperRecord | undefined {
    return this.researchPapers.get(id);
  }

  public createResearchPaper(data: Partial<ResearchPaperRecord>, userId: string): ResearchPaperRecord {
    const id = data.id || `paper-${Date.now()}`;
    const slug = data.slug || id;
    const now = new Date().toISOString();

    const record: ResearchPaperRecord = {
      id,
      title: data.title || 'Untitled Research Manuscript',
      slug,
      doi: data.doi,
      isDoiVerified: !!data.isDoiVerified,
      doiVerificationSource: data.doiVerificationSource || 'Pending Verification',
      doiVerificationNotes: data.doiVerificationNotes,
      publicationType: data.publicationType || 'Preprint',
      abstract: data.abstract || '',
      authors: data.authors || [{ name: 'Research Team', affiliation: 'AI Tathastu Insights' }],
      categoryId: data.categoryId || 'interpretability',
      publicationDate: data.publicationDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      publisher: data.publisher || 'AI Tathastu Insights Open Science Archive',
      license: data.license || 'CC BY-NC 4.0',
      sourceProvenance: data.sourceProvenance || 'demonstration_concept',
      sourceVerificationStatus: data.sourceVerificationStatus || 'needs_review',
      canonicalSource: data.canonicalSource,
      pdfAssetUrl: data.pdfAssetUrl,
      isDownloadAvailable: !!data.isDownloadAvailable,
      bibtex: data.bibtex || `@article{tathastu2026,\n  title={${data.title}},\n  year={2026}\n}`,
      datasetLinks: data.datasetLinks || [],
      methodology: data.methodology,
      keyFindings: data.keyFindings || [],
      relatedProductIds: data.relatedProductIds || [],
      downloadCount: data.downloadCount || 0,
      status: data.status || 'published',
      createdAt: now,
      updatedAt: now,
    };

    this.researchPapers.set(id, record);
    this.persistToDisk();
    return record;
  }

  public updateResearchPaper(id: string, updates: Partial<ResearchPaperRecord>, userId: string): ResearchPaperRecord {
    const existing = this.researchPapers.get(id);
    if (!existing) throw new Error(`Research paper with ID ${id} not found`);

    const now = new Date().toISOString();
    const updated: ResearchPaperRecord = {
      ...existing,
      ...updates,
      updatedAt: now,
    };

    this.researchPapers.set(id, updated);
    this.persistToDisk();
    return updated;
  }

  public deleteResearchPaper(id: string): boolean {
    const res = this.researchPapers.delete(id);
    if (res) this.persistToDisk();
    return res;
  }

  // -------------------------------------------------------------
  // COMPANY UPDATES / CHANGELOG MANAGEMENT
  // -------------------------------------------------------------
  public listUpdates(filterPublished = false): CompanyUpdateRecord[] {
    let list = Array.from(this.companyUpdates.values());
    if (filterPublished) {
      list = list.filter((u) => u.status === 'published');
    }
    return list.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
  }

  public getUpdateById(id: string): CompanyUpdateRecord | undefined {
    return this.companyUpdates.get(id);
  }

  public createUpdate(data: Partial<CompanyUpdateRecord>, userId: string): CompanyUpdateRecord {
    const id = data.id || `upd-${Date.now()}`;
    const slug = data.slug || id;
    const now = new Date().toISOString();

    const record: CompanyUpdateRecord = {
      id,
      slug,
      title: data.title || 'System Milestone Update',
      summary: data.summary || '',
      detailedExplanation: data.detailedExplanation,
      category: data.category || 'Product Release',
      productId: data.productId,
      version: data.version,
      date: data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      authorName: data.authorName || 'Engineering Desk',
      coverImageUrl: data.coverImageUrl,
      content: data.content || [],
      tags: data.tags || [],
      relatedLinks: data.relatedLinks || [],
      milestoneMetric: data.milestoneMetric,
      status: data.status || 'published',
      publishedAt: data.status === 'published' ? now : '',
      createdAt: now,
      updatedAt: now,
    };

    this.companyUpdates.set(id, record);
    this.persistToDisk();
    return record;
  }

  public updateUpdate(id: string, updates: Partial<CompanyUpdateRecord>, userId: string): CompanyUpdateRecord {
    const existing = this.companyUpdates.get(id);
    if (!existing) throw new Error(`Update with ID ${id} not found`);

    const now = new Date().toISOString();
    const updated: CompanyUpdateRecord = {
      ...existing,
      ...updates,
      updatedAt: now,
    };
    if (updates.status === 'published' && !existing.publishedAt) {
      updated.publishedAt = now;
    }

    this.companyUpdates.set(id, updated);
    this.persistToDisk();
    return updated;
  }

  public deleteUpdate(id: string): boolean {
    const res = this.companyUpdates.delete(id);
    if (res) this.persistToDisk();
    return res;
  }

  // -------------------------------------------------------------
  // MEDIA ASSET LIBRARY MANAGEMENT
  // -------------------------------------------------------------
  public listMediaAssets(params?: { format?: string; q?: string }) {
    let list = Array.from(this.mediaAssets.values());
    if (params?.format && params.format !== 'all') {
      list = list.filter((m) => m.format === params.format);
    }
    if (params?.q) {
      const q = params.q.toLowerCase().trim();
      list = list.filter((m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getMediaAssetById(id: string): MediaAssetRecord | undefined {
    return this.mediaAssets.get(id);
  }

  public createMediaAsset(data: Partial<MediaAssetRecord>, userId: string): MediaAssetRecord {
    const id = data.id || `media-${Date.now()}`;
    const now = new Date().toISOString();

    const record: MediaAssetRecord = {
      id,
      title: data.title || 'Untitled Media Asset',
      originalFilename: data.originalFilename || 'media-asset.jpg',
      format: data.format || 'image',
      fileType: data.fileType || 'image/jpeg',
      fileSizeBytes: data.fileSizeBytes || 1024 * 1024,
      width: data.width,
      height: data.height,
      durationSeconds: data.durationSeconds || 0,
      durationLabel: data.durationLabel || '',
      speaker: data.speaker || '',
      speakerRole: data.speakerRole || '',
      description: data.description || '',
      coverImageUrl: data.coverImageUrl || data.fileUrl || '',
      fileUrl: data.fileUrl || data.coverImageUrl || '',
      streamUrl: data.streamUrl || (data.format === 'video' || data.format === 'audio' ? data.fileUrl : ''),
      isStreamAvailable: !!data.isStreamAvailable || (data.format === 'video' || data.format === 'audio'),
      transcriptText: data.transcriptText,
      altText: data.altText,
      caption: data.caption,
      attribution: data.attribution,
      uploaderId: userId,
      uploaderName: data.uploaderName || 'Admin Desk',
      createdAt: now,
    };

    this.mediaAssets.set(id, record);
    this.persistToDisk();
    return record;
  }

  public updateMediaAsset(id: string, updates: Partial<MediaAssetRecord>, userId: string): MediaAssetRecord {
    const existing = this.mediaAssets.get(id);
    if (!existing) throw new Error(`Media asset with ID ${id} not found`);

    const updated: MediaAssetRecord = {
      ...existing,
      ...updates,
    };

    this.mediaAssets.set(id, updated);
    this.persistToDisk();
    return updated;
  }

  public deleteMediaAsset(id: string): boolean {
    const res = this.mediaAssets.delete(id);
    if (res) this.persistToDisk();
    return res;
  }

  // -------------------------------------------------------------
  // STATIC PAGES MANAGEMENT
  // -------------------------------------------------------------
  public listStaticPages(): StaticPageRecord[] {
    return Array.from(this.staticPages.values());
  }

  public getStaticPageBySlug(slug: string): StaticPageRecord | undefined {
    return this.staticPages.get(slug);
  }

  public saveStaticPage(data: Partial<StaticPageRecord>, userId: string): StaticPageRecord {
    const slug = data.slug || 'custom-page';
    const existing = this.staticPages.get(slug);
    const now = new Date().toISOString();

    const record: StaticPageRecord = {
      id: existing?.id || `page-${slug}`,
      slug,
      title: data.title || existing?.title || 'Static Page',
      template: data.template || existing?.template || 'default',
      content: data.content !== undefined ? data.content : (existing?.content || ''),
      excerpt: data.excerpt !== undefined ? data.excerpt : existing?.excerpt,
      featuredImageUrl: data.featuredImageUrl !== undefined ? data.featuredImageUrl : existing?.featuredImageUrl,
      seoTitle: data.seoTitle !== undefined ? data.seoTitle : existing?.seoTitle,
      seoDescription: data.seoDescription !== undefined ? data.seoDescription : existing?.seoDescription,
      status: data.status || existing?.status || 'published',
      publishedAt: existing?.publishedAt || now,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    this.staticPages.set(slug, record);
    this.persistToDisk();
    return record;
  }

  public deleteStaticPage(slug: string): boolean {
    const res = this.staticPages.delete(slug);
    if (res) this.persistToDisk();
    return res;
  }

  // -------------------------------------------------------------
  // NAVIGATION MENUS MANAGEMENT
  // -------------------------------------------------------------
  public listNavigationMenus(): NavigationMenuRecord[] {
    return Array.from(this.navigationMenus.values());
  }

  public getNavigationMenu(location: 'main' | 'footer' | 'product'): NavigationMenuRecord | undefined {
    return this.navigationMenus.get(location);
  }

  public saveNavigationMenu(location: 'main' | 'footer' | 'product', items: NavigationMenuItem[], userId: string): NavigationMenuRecord {
    const existing = this.navigationMenus.get(location);
    const updated: NavigationMenuRecord = {
      id: location,
      name: existing?.name || `${location.toUpperCase()} Navigation`,
      items,
      updatedAt: new Date().toISOString(),
    };
    this.navigationMenus.set(location, updated);
    this.persistToDisk();
    return updated;
  }

  // -------------------------------------------------------------
  // HOMEPAGE COMPOSITION CONFIGURATION
  // -------------------------------------------------------------
  public getHomepageConfig(): HomepageConfigRecord {
    return this.homepageConfig;
  }

  public saveHomepageConfig(updates: Partial<HomepageConfigRecord>, userId: string): HomepageConfigRecord {
    this.homepageConfig = {
      ...this.homepageConfig,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persistToDisk();
    return this.homepageConfig;
  }

  // -------------------------------------------------------------
  // GLOBAL SITE SETTINGS
  // -------------------------------------------------------------
  public getSiteSettings(): SiteSettingsRecord {
    return this.siteSettings;
  }

  public saveSiteSettings(updates: Partial<SiteSettingsRecord>, userId: string): SiteSettingsRecord {
    this.siteSettings = {
      ...this.siteSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persistToDisk();
    return this.siteSettings;
  }

  // -------------------------------------------------------------
  // USER & ROLE MANAGEMENT
  // -------------------------------------------------------------
  public listUsers(): UserRecord[] {
    return Array.from(this.users.values()).map((u) => ({
      ...u,
      passwordHash: '[PROTECTED_HASH]',
    }));
  }

  public createUser(data: { email: string; name: string; password?: string; roleId: UserRecord['roleId']; affiliation?: string }, creatorId: string): UserRecord {
    if (Array.from(this.users.values()).some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error(`User with email ${data.email} already exists`);
    }

    const salt = bcrypt.genSaltSync(12);
    const pwd = data.password || 'TathastuPass2026!';
    const passwordHash = bcrypt.hashSync(pwd, salt);
    const id = `usr-${Date.now()}`;
    const now = new Date().toISOString();

    const record: UserRecord = {
      id,
      email: data.email,
      name: data.name,
      passwordHash,
      roleId: data.roleId,
      affiliation: data.affiliation,
      isActive: true,
      createdAt: now,
    };

    this.users.set(id, record);
    this.persistToDisk();
    return { ...record, passwordHash: '[PROTECTED_HASH]' };
  }

  public updateUserRole(userId: string, roleId: UserRecord['roleId'], updaterId: string): UserRecord {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);

    user.roleId = roleId;
    this.users.set(userId, user);
    this.persistToDisk();
    return { ...user, passwordHash: '[PROTECTED_HASH]' };
  }

  public toggleUserStatus(userId: string, isActive: boolean): UserRecord {
    const user = this.users.get(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);

    user.isActive = isActive;
    this.users.set(userId, user);
    this.persistToDisk();
    return { ...user, passwordHash: '[PROTECTED_HASH]' };
  }

  public deleteUser(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    if (user.roleId === 'super_admin') {
      const superAdminCount = Array.from(this.users.values()).filter((u) => u.roleId === 'super_admin').length;
      if (superAdminCount <= 1) {
        throw new Error('Cannot delete the sole Super Administrator account.');
      }
    }
    const res = this.users.delete(userId);
    if (res) this.persistToDisk();
    return res;
  }

  public updateUserPassword(userId: string, newPasswordHash: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    user.passwordHash = newPasswordHash;
    this.users.set(userId, user);
    this.persistToDisk();
    return true;
  }

  // -------------------------------------------------------------
  // TOKEN REVOCATION & PASSWORD RESET MANAGEMENT
  // -------------------------------------------------------------
  public revokeToken(tokenHash: string, userId?: string, expiresAt?: string, reason = 'logout'): void {
    this.revokedTokens.set(tokenHash, {
      tokenHash,
      userId,
      expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      revokedAt: new Date().toISOString(),
      reason,
    });
    this.persistToDisk();
  }

  public isTokenRevoked(tokenHash: string): boolean {
    return this.revokedTokens.has(tokenHash);
  }

  public createPasswordResetToken(userId: string, tokenHash: string, expiresAt: string): void {
    this.passwordResetTokens.set(tokenHash, {
      tokenHash,
      userId,
      expiresAt,
      createdAt: new Date().toISOString(),
    });
    this.persistToDisk();
  }

  public verifyAndConsumePasswordResetToken(tokenHash: string): { valid: boolean; userId?: string; error?: string } {
    const entry = this.passwordResetTokens.get(tokenHash);
    if (!entry) {
      return { valid: false, error: 'Invalid or unrecognized password reset token.' };
    }
    if (entry.usedAt) {
      return { valid: false, error: 'This password reset token has already been consumed.' };
    }
    if (new Date(entry.expiresAt).getTime() < Date.now()) {
      return { valid: false, error: 'Password reset token has expired. Please request a new token.' };
    }
    entry.usedAt = new Date().toISOString();
    this.passwordResetTokens.set(tokenHash, entry);
    this.persistToDisk();
    return { valid: true, userId: entry.userId };
  }
}

export const repository = new MemoryStore();
