import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { ProvenanceRecord, DoiService } from '../services/doiService';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  roleId: 'super_admin' | 'editor' | 'research_editor' | 'author' | 'contributor';
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
  pdfAssetUrl?: string;
  isDownloadAvailable: boolean;
  bibtex: string;
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
  format: 'documentary' | 'dialogue' | 'lecture';
  durationSeconds: number;
  durationLabel: string;
  speaker: string;
  speakerRole: string;
  description: string;
  coverImageUrl: string;
  streamUrl?: string;
  isStreamAvailable: boolean;
  transcriptText?: string;
}

class MemoryStore {
  public users: Map<string, UserRecord> = new Map();
  public manuscripts: Map<string, ManuscriptRecord> = new Map();
  public reviews: Map<string, EditorialReviewRecord> = new Map();
  public researchPapers: Map<string, ResearchPaperRecord> = new Map();
  public bookmarks: Map<string, BookmarkRecord> = new Map();
  public subscribers: Map<string, SubscriberRecord> = new Map();
  public mediaAssets: Map<string, MediaAssetRecord> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // 1. Seed initial users with bcrypt hashes
    const salt = bcrypt.genSaltSync(10);
    const hash = (pwd: string) => bcrypt.hashSync(pwd, salt);

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
        id: 'usr-author-01',
        email: 'author@institution.edu',
        passwordHash: hash('TathastuAuthor2026!'),
        name: 'Dr. Elena Rostova',
        roleId: 'author',
        affiliation: 'Iris Vision Labs',
        isActive: true,
        createdAt: '2026-03-01T00:00:00Z',
      },
    ];

    for (const u of defaultUsers) {
      this.users.set(u.id, u);
    }

    // 2. Seed initial manuscripts with distinct editorial states
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

    // 3. Seed Research Papers with explicit Provenance & Verification Disclosures
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

    // 4. Seed Media with honest stream availability flags
    const defaultMedia: MediaAssetRecord[] = [
      {
        id: 'media-doc-01',
        title: 'The Architecture of Monosemanticity: A 4K Visual Walkthrough',
        format: 'documentary',
        durationSeconds: 1472,
        durationLabel: '24:32',
        speaker: 'Dr. Aravind Nair',
        speakerRole: 'Principal Investigator',
        description: 'Cinematic visual exploration inside the residual streams of foundation models, featuring volumetric activations and mathematical circuit mappings.',
        coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
        streamUrl: '',
        isStreamAvailable: false, // Honestly marked as unavailable/scheduled master stream
        transcriptText: 'Introduction: When inspecting deep representations, superposition represents a fundamental barrier...',
      },
      {
        id: 'media-dialogue-14',
        title: 'Tathastu Dialogues #14: The Geometry of Latency in Agent Swarms',
        format: 'dialogue',
        durationSeconds: 2912,
        durationLabel: '48:32',
        speaker: 'Vikram Sharma & Dr. Marcus Vance',
        speakerRole: 'Systems Architects',
        description: 'Technical conversation dissecting why multi-agent frameworks fail under token budgets, Byzantine consensus dynamics, and asynchronous arbitration.',
        coverImageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
        streamUrl: '',
        isStreamAvailable: false,
        transcriptText: 'Host: Welcome to Tathastu Dialogues. Today we examine tail latency in agent swarms...',
      },
    ];

    for (const m of defaultMedia) {
      this.mediaAssets.set(m.id, m);
    }
  }
}

export const repository = new MemoryStore();
