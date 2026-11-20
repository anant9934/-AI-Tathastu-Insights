export type AccentColor = 
  | 'violet' 
  | 'blue' 
  | 'mint' 
  | 'terracotta' 
  | 'ochre' 
  | 'lavender' 
  | 'softblue' 
  | 'sage' 
  | 'peach' 
  | 'coral' 
  | 'butter';

export interface Author {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  bio: string;
  avatar: string;
  articlesCount: number;
  papersCount: number;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  baseline?: number;
  annotation?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  abstract: string;
  content: string[];
  pullQuote?: {
    text: string;
    attribution: string;
  };
  coverImage: string;
  imageCaption?: string;
  author: Author;
  publishedAt: string;
  readingTimeMinutes: number;
  category: 'Frontier Systems' | 'Interpretability' | 'Safety & Ethics' | 'Cognitive Architectures' | 'Policy & Governance';
  publicationType?: 'Investigation' | 'Research Paper' | 'Perspective Essay' | 'Technical Report';
  topicTag: string;
  accentColor: AccentColor;
  doi?: string;
  isFeatured?: boolean;
  isEditorsChoice?: boolean;
  tableOfContents: TableOfContentsItem[];
  chartData?: {
    title: string;
    subtitle: string;
    xAxisLabel: string;
    yAxisLabel: string;
    points: ChartDataPoint[];
  };
  citations: {
    id: string;
    citation: string;
    doi?: string;
  }[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  primaryAuthorAffiliation: string;
  publishedAt: string;
  category: 'Benchmark' | 'Preprint' | 'Peer-Reviewed' | 'Technical Report' | 'Policy Brief';
  topic: string;
  accentColor: AccentColor;
  doi: string;
  arxivId: string;
  citationCount: number;
  downloadsCount: number;
  pdfFileSize: string;
  bibtex: string;
  keyFindings: string[];
  benchmarkMetric?: {
    name: string;
    value: string;
    comparisonToSota: string;
  };
}

export interface EcosystemProduct {
  id: 'mentormaze' | 'collaborate' | 'avsar' | 'iris';
  name: string;
  tagline: string;
  description: string;
  fullOverview: string;
  accentColor: AccentColor;
  badge: string;
  coreCapabilities: {
    title: string;
    description: string;
    metric?: string;
  }[];
  architecturePoints: string[];
  externalUrl?: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  format: 'documentary' | 'dialogue' | 'lecture';
  duration: string;
  speaker: string;
  speakerRole: string;
  publishedAt: string;
  coverImage: string;
  videoUrl?: string;
  audioDurationSeconds?: number;
  category: string;
}

export interface EditorialSubmission {
  id: string;
  title: string;
  authorName: string;
  authorAffiliation: string;
  category: string;
  status: 'in_review' | 'revisions_requested' | 'accepted' | 'scheduled' | 'draft';
  submittedAt: string;
  wordCount: number;
  reviewerScore: number; // e.g. 8.8 / 10
  assignedEditor: string;
  abstract: string;
}

export interface Topic {
  id: string;
  slug: string;
  name: string;
  description: string;
  accentColor: AccentColor;
  count: number;
}

export interface PerspectiveItem {
  id: string;
  title: string;
  subtitle: string;
  author: Author;
  category: string;
  publishedAt: string;
  format: 'Researcher Essay' | 'Editorial Debate' | 'Expert Opinion' | 'Guest Commentary';
  pullQuote: string;
  accentColor: AccentColor;
  readingTimeMinutes: number;
}
