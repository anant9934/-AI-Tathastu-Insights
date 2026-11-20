export type StudioTab = 
  | 'dashboard' 
  | 'content' 
  | 'editor'
  | 'products' 
  | 'engineering' 
  | 'research' 
  | 'updates' 
  | 'media' 
  | 'homepage'
  | 'pages' 
  | 'navigation' 
  | 'newsletter' 
  | 'analytics' 
  | 'users' 
  | 'settings';

export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'editor' 
  | 'research_editor' 
  | 'author' 
  | 'media_manager' 
  | 'contributor';

export interface StudioUser {
  id: string;
  email: string;
  name: string;
  roleId: UserRole;
  affiliation?: string;
  isActive: boolean;
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
  type: 
    | 'paragraph' 
    | 'heading1' 
    | 'heading2' 
    | 'heading3' 
    | 'image' 
    | 'gallery' 
    | 'video' 
    | 'pullquote' 
    | 'callout' 
    | 'code' 
    | 'table' 
    | 'citation' 
    | 'doi' 
    | 'split_media';
  content: any;
  sortOrder: number;
}

export interface ContentItem {
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

export interface ContentVersion {
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

export interface ProductItem {
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
  status: 'Live Platform' | 'Beta Lab' | 'Prototype' | 'In Development' | 'Planned' | 'Discontinued';
  provenanceLabel: string;
  version: string;
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

export interface EngineeringItem {
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

export interface ResearchItem {
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

export interface UpdateItem {
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

export interface MediaAssetItem {
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

export interface StaticPageItem {
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

export interface NavigationMenu {
  id: 'main' | 'footer' | 'product';
  name: string;
  items: NavigationMenuItem[];
  updatedAt: string;
}

export interface HomepageConfig {
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

export interface SiteSettings {
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

export interface DashboardMetrics {
  metrics: {
    publishedArticles: number;
    drafts: number;
    inReview: number;
    scheduled: number;
    totalProducts: number;
    publishedUpdates: number;
    mediaAssets: number;
    subscriberCount: number;
  };
  workflowCounts: Record<string, number>;
  recentActivities: Array<{
    id: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    details?: any;
    createdAt: string;
  }>;
  upcomingScheduled: ContentItem[];
  draftsAwaitingAttention: ContentItem[];
  recentPublished: ContentItem[];
}
