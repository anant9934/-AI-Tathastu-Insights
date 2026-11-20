import { Article, ResearchPaper, EcosystemProduct, MediaItem, EditorialSubmission, Topic, Author, PerspectiveItem, EngineeringArticle, CompanyUpdate } from '../types';

export const mockAuthors: Record<string, Author> = {
  aravind: {
    id: 'aravind-nair',
    name: 'Dr. Aravind Nair',
    role: 'Principal Research Scientist (Demonstration Persona)',
    affiliation: 'Frontier Alignment Group, AI Tathastu',
    bio: 'Researches mechanistic interpretability, residual stream geometry, and automated circuit discovery. [Demonstration Contributor Persona — Created for Journal Prototype Testing].',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    articlesCount: 14,
    papersCount: 9,
    isDemonstrationPersona: true,
  },
  elena: {
    id: 'elena-rostova',
    name: 'Dr. Elena Rostova',
    role: 'Director of Perceptual AI (Demonstration Persona)',
    affiliation: 'Iris Vision & Multimodal Labs',
    bio: 'Specializes in spatial memory grounding, multimodal contrastive representations, and low-latency embodied sensory fusion. [Demonstration Contributor Persona — Created for Journal Prototype Testing].',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    articlesCount: 11,
    papersCount: 16,
    isDemonstrationPersona: true,
  },
  vikram: {
    id: 'vikram-sharma',
    name: 'Vikram Sharma',
    role: 'Lead Systems Architect (Demonstration Persona)',
    affiliation: 'Distributed Swarm Consortium',
    bio: 'Investigates Byzantine fault tolerance in heterogeneous agent swarms, token-efficient consensus protocols, and asynchronous tool arbitration. [Demonstration Contributor Persona — Created for Journal Prototype Testing].',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    articlesCount: 8,
    papersCount: 6,
    isDemonstrationPersona: true,
  },
  clara: {
    id: 'clara-zheng',
    name: 'Prof. Clara Zheng',
    role: 'Fellow in Computational Governance (Demonstration Persona)',
    affiliation: 'Global AI Safety Institute & Tathastu Policy Unit',
    bio: 'Focuses on statutory verification standards for frontier model deployment, automated red-teaming liability, and open-weights risk assessment. [Demonstration Contributor Persona — Created for Journal Prototype Testing].',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    articlesCount: 12,
    papersCount: 14,
    isDemonstrationPersona: true,
  },
  marcus: {
    id: 'marcus-vance',
    name: 'Marcus Vance',
    role: 'Staff Systems Architect (Demonstration Persona)',
    affiliation: 'Systems & Consensus Core, AI Tathastu',
    bio: 'Designs low-latency distributed consensus engines, GPU kernels in Triton/CUDA, and Byzantine fault-tolerant multi-agent runtime environments.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    articlesCount: 9,
    papersCount: 7,
    isDemonstrationPersona: true,
  }
};

export const mockArticles: Article[] = [
  {
    id: 'sparse-autoencoders-residual-stream',
    slug: 'sparse-autoencoders-residual-stream',
    title: 'Dissecting Residual Stream Dynamics with Scaled Sparse Autoencoders',
    subtitle: 'How 16-million feature dictionaries expose monosemantic circuits in 70B parameter frontier models.',
    abstract: 'Transformer representations are notoriously polysemantic—single activation vectors encode multiple unrelated concepts. By deploying top-k sparse autoencoders across intermediate residual layers, we isolate monosemantic features with 94.2% precision, providing empirical visibility into internal reasoning trajectories before token generation.',
    publishedAt: '2026-10-14',
    readingTimeMinutes: 11,
    category: 'Interpretability',
    publicationType: 'Investigation',
    topicTag: 'Mechanistic Circuits',
    accentColor: 'violet',
    doi: '10.5281/zenodo.1084291',
    isFeatured: true,
    isEditorsChoice: true,
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration lead investigation modeling Top-K SAE residual interpretability. Published with illustrative persona Dr. Aravind Nair for prototype verification.',
    author: mockAuthors.aravind,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'High-dimensional projection of 16M feature activations clustered by semantic monosemanticity.',
    pullQuote: {
      text: 'Superposition is not a failure of model capacity; it is an efficient compression regime that sparse autoencoders can systematically invert.',
      attribution: 'Dr. Aravind Nair, Lead Investigator'
    },
    tableOfContents: [
      { id: 'the-polysemantic-bottleneck', title: 'The Polysemantic Bottleneck', level: 2 },
      { id: 'sparse-dictionary-architecture', title: 'Top-K Dictionary Architecture', level: 2 },
      { id: 'empirical-results-at-scale', title: 'Empirical Results Across 32 Layers', level: 2 },
      { id: 'counterfactual-steering', title: 'Steering Latents Without Fine-Tuning', level: 2 },
      { id: 'reproducibility-and-code', title: 'Verification and Open Weights', level: 2 }
    ],
    chartData: {
      title: 'Monosemantic Feature Purity vs Dictionary Expansion Factor',
      subtitle: 'Percentage of interpretable monosemantic features identified across 4 distinct evaluation suites.',
      xAxisLabel: 'Expansion Ratio (k / d_model)',
      yAxisLabel: 'Monosemantic Precision (%)',
      points: [
        { label: '4x', value: 61.4, baseline: 42.0 },
        { label: '8x', value: 74.8, baseline: 42.0 },
        { label: '16x', value: 86.2, baseline: 42.0 },
        { label: '32x', value: 92.1, baseline: 42.0 },
        { label: '64x', value: 94.2, baseline: 42.0 }
      ]
    },
    content: [
      'For over half a decade, deep transformer representations have remained largely uninterpretable at the single-neuron level. The phenomenon of superposition—wherein an n-dimensional vector space represents far more than n distinct features by allowing linear combinations to overlap—has prevented precise safety auditing.',
      'Our team deployed an ultra-large-scale top-k Sparse Autoencoder (SAE) training run targeting the residual stream of 70-billion-parameter open foundation models. By penalizing reconstruction error while constraining the active feature count to k=64 out of 16,777,216 latent dictionary vectors, we observed an abrupt phase transition in feature clarity.',
      'Unlike previous l1-regularized autoencoders that suffered from severe feature shrinkage and dead latents, the top-k activation threshold preserves gradient magnitude throughout the training trajectory. Crucially, when inspecting activations during multi-step mathematical reasoning, specific latents activate exclusively for operational invariants: such as tracking bracket depth in symbolic expressions or detecting arithmetic sign inversions.',
      'Beyond passive monitoring, these decomposed circuits permit bidirectional steering. By clamping the amplitude of a discovered "sycophancy counter-evidence" latent vector during inference, we reduced ungrounded model agreement with user falsehoods from 38.6% to 4.1% without degrading general MMLU performance.',
      'All SAE weights, dictionary checkpoints, and interactive browser explorers have been deposited in the Tathastu Open Archive under the Apache 2.0 license to foster third-party empirical validation.'
    ],
    citations: [
      { id: 'c1', citation: 'Anthropic MechInterp Team. (2024). Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet.', doi: '10.5281/zenodo.108221' },
      { id: 'c2', citation: 'Nair, A., & Gupta, R. (2026). Top-K Activation Sparsity in Residual Dictionary Decomposition. AI Tathastu Insights, 4(2), 112–129.', doi: '10.5281/zenodo.1084291' },
      { id: 'c3', citation: 'Bricken, T., et al. (2023). Towards Monosemanticity: Analyzing Superposition with Dictionary Learning. Transformer Circuits Thread.' }
    ]
  },
  {
    id: 'latency-bounded-swarm-consensus',
    slug: 'latency-bounded-swarm-consensus',
    title: 'Latency-Bounded Consensus in Heterogeneous Agent Swarms',
    subtitle: 'Protocol design for multi-agent synthesis under sub-200ms communication constraints.',
    abstract: 'Autonomous agent swarms fail in mission-critical environments when consensus rounds suffer from unbounded tail latencies. We propose Aegis-BFT, a token-efficient Byzantine agreement protocol that guarantees deterministic convergence across 64 specialized agents within a strict 180ms budget.',
    publishedAt: '2026-10-08',
    readingTimeMinutes: 8,
    category: 'Frontier Systems',
    publicationType: 'Research Paper',
    topicTag: 'Agentic Systems',
    accentColor: 'blue',
    doi: '10.5281/zenodo.1084278',
    isFeatured: true,
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration investigation modeling multi-agent Byzantine consensus (Aegis-BFT) under synthetic latencies.',
    author: mockAuthors.vikram,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Directed acyclic graph of agent deliberation rounds with verified checkpoint states.',
    pullQuote: {
      text: 'Adding more agents without deterministic arbitration increases entropy, not intelligence. Swarm stability requires bounded communication budgets.',
      attribution: 'Vikram Sharma, Systems Architect'
    },
    tableOfContents: [
      { id: 'the-tail-latency-hazard', title: 'The Tail Latency Hazard in Agent Swarms', level: 2 },
      { id: 'aegis-protocol-design', title: 'Aegis Protocol Architecture', level: 2 },
      { id: 'benchmarks-under-fault-injection', title: 'Fault Injection Benchmarks', level: 2 },
      { id: 'deployment-in-collaborate', title: 'Integration with Tathastu Collaborate', level: 2 }
    ],
    chartData: {
      title: 'Consensus Latency vs Agent Group Size (p99)',
      subtitle: 'Comparison between Standard LLM Voting vs Aegis-BFT Token-Bounded Protocol.',
      xAxisLabel: 'Active Agents in Swarm',
      yAxisLabel: 'Latency in Milliseconds (p99)',
      points: [
        { label: '8 Agents', value: 48, baseline: 110 },
        { label: '16 Agents', value: 72, baseline: 245 },
        { label: '32 Agents', value: 112, baseline: 490 },
        { label: '64 Agents', value: 178, baseline: 890 }
      ]
    },
    content: [
      'When autonomous agents collaborate on complex reasoning workflows—such as automated code refactoring, scientific hypothesis generation, or security triage—they frequently default to unweighted majority voting. In practice, this leads to token exhaustion and volatile failure modes when adversarial or hallucinatory agents stall the quorum.',
      'Aegis-BFT addresses this bottleneck by replacing free-form conversational debates with structured cryptographic consensus. Each agent produces a cryptographic proof-of-verification hash alongside its reasoning step, reducing communication overhead from multi-thousand-token transcripts to a compact 128-byte assertion state.',
      'In empirical tests across 10,000 multi-stage programming tasks, Aegis-BFT sustained 99.4% task completion while reducing median latency by 4.2x compared to baseline recursive deliberation loops.',
      'This consensus engine now powers the collaborative arbitration layer in AI Tathastu Collaborate, coordinating parallel peer-review nodes and data pipelines without human supervision.'
    ],
    citations: [
      { id: 'c1', citation: 'Sharma, V. (2026). Deterministic Convergence Protocols for Heterogeneous Language Agents. Systems for Frontier AI, Vol. 2.' }
    ]
  },
  {
    id: 'multimodal-grounding-iris-spatial-memory',
    slug: 'multimodal-grounding-iris-spatial-memory',
    title: 'Continuous Spatial Memory in Embodied Vision Models',
    subtitle: 'How persistent world-state representations resolve temporal occlusion in robotics and physical AI.',
    abstract: 'Standard vision-language models operate on momentary camera frames, forgetting physical scene dynamics the moment an object leaves the field of view. We introduce Iris Temporal Grounding, a 3D persistent voxel-semantic memory layer that maintains continuous spatial object persistence with zero hallucination drift.',
    publishedAt: '2026-09-28',
    readingTimeMinutes: 10,
    category: 'Cognitive Architectures',
    publicationType: 'Technical Report',
    topicTag: 'Perceptual Intelligence',
    accentColor: 'mint',
    doi: '10.5281/zenodo.1084265',
    isEditorsChoice: true,
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration investigation on continuous 3D spatial voxel memory in Iris robotics.',
    author: mockAuthors.elena,
    coverImage: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Persistent 3D point cloud augmented with real-time semantic affordance heatmaps.',
    pullQuote: {
      text: 'Vision is not static frame classification; it is the continuous updating of an internal physical world model over time.',
      attribution: 'Dr. Elena Rostova'
    },
    tableOfContents: [
      { id: 'the-ephemeral-vision-problem', title: 'The Ephemeral Vision Problem', level: 2 },
      { id: 'neural-radiance-voxel-memory', title: 'Persistent Voxel-Semantic Memory', level: 2 },
      { id: 'occlusion-robustness-tests', title: 'Dynamic Occlusion Robustness', level: 2 },
      { id: 'real-world-robotics-results', title: 'Physical Deployment Benchmarks', level: 2 }
    ],
    chartData: {
      title: 'Object Re-Identification Success Under 10s Occlusion',
      subtitle: 'Tracking accuracy across 500 physical manipulation trials.',
      xAxisLabel: 'Occlusion Duration',
      yAxisLabel: 'Re-Identification Accuracy (%)',
      points: [
        { label: '2s', value: 98.4, baseline: 76.0 },
        { label: '4s', value: 96.1, baseline: 58.2 },
        { label: '6s', value: 93.8, baseline: 41.5 },
        { label: '8s', value: 91.2, baseline: 29.0 },
        { label: '10s', value: 89.6, baseline: 18.4 }
      ]
    },
    content: [
      'Physical intelligence demands more than classifying what is currently visible in an optical sensor stream. When a robot reaches behind a container or when an autonomous drone navigates past an obstacle, it must retain an accurate belief about occluded geometry, object affordances, and material characteristics.',
      'We engineered Iris Spatial Grounding as an asynchronous perceptual sub-layer. As optical frames arrive at 60 FPS, high-frequency visual features are continually projected into an egocentric 3D coordinate space. When objects disappear behind barriers, their state remains anchored in the latent spatial volume with calculated uncertainty bounds.',
      'Across complex warehouse manipulation environments, this persistent voxel substrate eliminated 84% of task aborts caused by visual field loss, establishing a new state of the art for embodied navigation without requiring expensive LiDAR equipment.'
    ],
    citations: [
      { id: 'c1', citation: 'Rostova, E. (2026). Continuous 3D Spatial Representation for Vision-Language-Action Models. Journal of Embodied Perceptual Systems.' }
    ]
  },
  {
    id: 'formal-statutory-verification-frontier-ai',
    slug: 'formal-statutory-verification-frontier-ai',
    title: 'Statutory Verification Standards for Frontier AI Governance',
    subtitle: 'Replacing self-reported vendor disclosures with provable automated compliance benchmarks.',
    abstract: 'Self-regulatory AI commitments have proven insufficient for high-assurance public deployments. This policy review establishes an actionable framework for automated, third-party algorithmic verification based on cryptographic execution traces, deterministic red-team suites, and legally binding liability covenants.',
    publishedAt: '2026-09-19',
    readingTimeMinutes: 9,
    category: 'Policy & Governance',
    publicationType: 'Perspective Essay',
    topicTag: 'AI Governance',
    accentColor: 'ochre',
    doi: '10.5281/zenodo.1084251',
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration policy essay modeling statutory verification sandboxes for foundation models.',
    author: mockAuthors.clara,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Multi-jurisdictional compliance topology comparing EU, US, and Asian regulatory standards.',
    tableOfContents: [
      { id: 'the-limits-of-self-reporting', title: 'The Limits of Self-Reported Audits', level: 2 },
      { id: 'cryptographic-execution-traces', title: 'Cryptographic Execution Verification', level: 2 },
      { id: 'liability-allocation-models', title: 'Algorithmic Liability Allocation', level: 2 },
      { id: 'recommended-statutory-clauses', title: 'Actionable Legislative Language', level: 2 }
    ],
    content: [
      'Regulatory compliance in artificial intelligence has historically relied on static transparency reports authored by model developers themselves. These documents frequently lack reproducible test harnesses, omit edge-case failure frequencies, and fail to provide legal certitude for affected public institutions.',
      'Our legal and technical working group drafted an operational standard for "Statutory Verification Modules"—air-gapped evaluation sandboxes that execute standardized adversarial suites against target model weights under zero-knowledge guarantees.',
      'By translating broad legal mandates (such as non-discrimination, safety thresholds, and critical infrastructure guardrails) into deterministic mathematical assertions, regulatory agencies can verify compliance without requiring exposure of confidential model weights or training datasets.'
    ],
    citations: [
      { id: 'c1', citation: 'Zheng, C. (2026). Cryptographic Verification in International AI Safety Treaties. Cambridge Law & Technology Review.' }
    ]
  },
  {
    id: 'kv-cache-compression-1bit-quantization',
    slug: 'kv-cache-compression-1bit-quantization',
    title: 'Extreme KV Cache Compression in Million-Token Context Windows',
    subtitle: 'Sub-4-bit attention key-value quantization without degradation of needle-in-a-haystack recall.',
    abstract: 'Serving 1M+ token context windows is fundamentally constrained by GPU high-bandwidth memory (HBM) capacity. We demonstrate a dual-phase asymmetric quantization scheme that compresses KV cache footprints by 78% while retaining 99.8% precision across extended retrieval benchmarks.',
    publishedAt: '2026-09-02',
    readingTimeMinutes: 7,
    category: 'Frontier Systems',
    publicationType: 'Research Paper',
    topicTag: 'Inference Systems',
    accentColor: 'terracotta',
    doi: '10.5281/zenodo.1084239',
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration investigation on dual-phase asymmetric quantization for KV cache.',
    author: mockAuthors.aravind,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
    tableOfContents: [
      { id: 'the-memory-wall', title: 'The HBM Memory Wall in Long Context', level: 2 },
      { id: 'asymmetric-quantization', title: 'Asymmetric 2-Bit Key / 4-Bit Value Quantization', level: 2 },
      { id: 'retrieval-needle-benchmarks', title: 'Needle-in-a-Haystack Benchmarks', level: 2 }
    ],
    content: [
      'As foundation model sequence lengths expand from 32,000 to over one million tokens, memory bandwidth rather than compute throughput becomes the principal cost driver in production inference engines.',
      'Our experimental data reveals that attention keys and values exhibit fundamentally divergent outlier distributions. While key matrices require high directional fidelity to maintain accurate dot-product query alignment, value matrices are surprisingly resilient to non-linear 2-bit clustering.',
      'By implementing kernel-fused asymmetric dequantization on modern tensor accelerators, we achieved a 3.8x reduction in required server memory per concurrent user session, slashing operational inference costs without sacrificing complex contextual reasoning.'
    ],
    citations: [
      { id: 'c1', citation: 'Nair, A., & Systems Lab. (2026). Asymmetric Matrix Decomposition for High-Throughput Inference. AI Tathastu Insights.' }
    ]
  },
  {
    id: 'cognitive-architectures-synthetic-curricula',
    slug: 'cognitive-architectures-synthetic-curricula',
    title: 'Dynamic Synthetic Curricula for Mathematical Generalization',
    subtitle: 'Automated problem generators that target model blind spots during post-training reasoning alignment.',
    abstract: 'Static benchmark datasets become contaminated within months of public release. We introduce Crucible, an active curriculum engine that analyzes reasoning failures and programmatically synthesizes novel mathematical theorems to reinforce verified proof capabilities.',
    publishedAt: '2026-08-18',
    readingTimeMinutes: 8,
    category: 'Cognitive Architectures',
    topicTag: 'Reasoning Models',
    accentColor: 'butter',
    doi: '10.5281/zenodo.1084210',
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration investigation on dynamic synthetic curricula and formal proof generation.',
    author: mockAuthors.vikram,
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200',
    tableOfContents: [
      { id: 'benchmark-saturation', title: 'The Benchmark Saturation Dilemma', level: 2 },
      { id: 'crucible-generator-loop', title: 'The Crucible Generator Loop', level: 2 },
      { id: 'formal-lean-verification', title: 'Formal Verification with Lean 4', level: 2 }
    ],
    content: [
      'Modern reasoning models frequently memorize intermediate reasoning steps rather than synthesizing generalized proof heuristics. When tested against novel formal problems, performance degrades precipitously.',
      'Crucible circumvents this flaw by pairing an adversarial generator with a formal proof assistant (Lean 4). The generator crafts non-trivial geometric and number-theoretic lemmas, while the formal kernel ensures every problem and candidate solution is logically sound.',
      'Models fine-tuned on this self-generating mathematical curriculum improved their Olympiad-level problem resolution score from 41.2% to 68.7% without human data labeling.'
    ],
    citations: [
      { id: 'c1', citation: 'Sharma, V., & Tathastu Cognitive Group. (2026). Generative Theorem Proving in Formal Environments.' }
    ]
  }
];

export const mockResearchPapers: ResearchPaper[] = [
  {
    id: 'paper-sae-residual-2026',
    title: 'Top-K Sparse Autoencoders at Residual Layer Boundaries: Isolation of Monosemantic Reasoning Circuits',
    abstract: 'We introduce an empirical methodology for deconstructing high-dimensional residual representations across 70B parameter models. By training 16M latent dictionaries with top-k activation constraints, we identify isolated circuits responsible for symbolic consistency, multi-hop deduction, and safety boundary adherence.',
    authors: ['Dr. Aravind Nair', 'Dr. Priya Desai', 'Karan Mehta', 'Vikram Sharma'],
    primaryAuthorAffiliation: 'AI Tathastu Frontier Alignment Unit',
    publishedAt: '2026-10-12',
    category: 'Peer-Reviewed',
    topic: 'Mechanistic Interpretability',
    accentColor: 'violet',
    doi: '10.5281/zenodo.1084291',
    arxivId: 'arXiv:2610.14920',
    citationCount: 42,
    downloadsCount: 3840,
    pdfFileSize: '4.8 MB',
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration preprint modeling Anthropic Top-K SAE findings. Identifier 10.5281/zenodo.1084291 is reserved for prototype demonstration and does not map to a live Tathastu Zenodo deposit.',
    keyFindings: [
      'Discovered 14,200+ confirmed monosemantic reasoning circuits across layers 18–32.',
      'Achieved 94.2% precision on the Benchmark of Interpretable Latents (BIL-26).',
      'Demonstrated bidirectional latent steering that suppresses sycophancy by 89%.'
    ],
    benchmarkMetric: {
      name: 'BIL-26 Interpretability Score',
      value: '94.2%',
      comparisonToSota: '+18.4% over L1-regularized baseline'
    },
    bibtex: `@article{nair2026sparse,\n  title={Top-K Sparse Autoencoders at Residual Layer Boundaries},\n  author={Nair, Aravind and Desai, Priya and Mehta, Karan and Sharma, Vikram},\n  journal={AI Tathastu Insights},\n  volume={4},\n  number={2},\n  pages={112--129},\n  year={2026},\n  publisher={Tathastu Open Science Foundation},\n  doi={10.5281/zenodo.1084291}\n}`
  },
  {
    id: 'paper-aegis-swarm-2026',
    title: 'Aegis-BFT: Sub-200ms Fault-Tolerant Byzantine Consensus for Heterogeneous Agent Swarms',
    abstract: 'Autonomous agent swarms executing multi-stage tool calls fail unpredictably under latency variance and non-deterministic agent responses. We present Aegis-BFT, a compact cryptographic agreement layer ensuring bounded turn latencies and deterministic state commitment across distributed agent networks.',
    authors: ['Vikram Sharma', 'Dr. Marcus Vance', 'Sarah Jenkins'],
    primaryAuthorAffiliation: 'Distributed Swarm Consortium',
    publishedAt: '2026-09-30',
    category: 'Technical Report',
    topic: 'Agentic Systems',
    accentColor: 'blue',
    doi: '10.5281/zenodo.1084278',
    arxivId: 'arXiv:2609.18341',
    citationCount: 29,
    downloadsCount: 2910,
    pdfFileSize: '3.2 MB',
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration technical report for distributed multi-agent consensus prototyping.',
    keyFindings: [
      'Bounded p99 consensus latency to 178ms across 64 concurrently debating agents.',
      'Tolerated up to 33% adversarial or hallucinating nodes without consensus breach.',
      'Reduced token exchange volume by 76% via cryptographic assertion hashing.'
    ],
    benchmarkMetric: {
      name: 'P99 Latency at 64 Nodes',
      value: '178 ms',
      comparisonToSota: '4.2x faster than Recursive Deliberation'
    },
    bibtex: `@article{sharma2026aegis,\n  title={Aegis-BFT: Sub-200ms Fault-Tolerant Byzantine Consensus for Heterogeneous Agent Swarms},\n  author={Sharma, Vikram and Vance, Marcus and Jenkins, Sarah},\n  journal={AI Tathastu Insights Technical Series},\n  year={2026},\n  doi={10.5281/zenodo.1084278}\n}`
  },
  {
    id: 'paper-iris-spatial-memory-2026',
    title: 'Egocentric Voxel-Semantic Memory Buffers for Continuous Physical Affordance Tracking',
    abstract: 'We address temporal blindness in multimodal vision architectures. By dynamically updating an egocentric 3D voxel representation, the Iris perceptual engine retains accurate physical object tracking across prolonged optical occlusion and variable lighting conditions.',
    authors: ['Dr. Elena Rostova', 'Chen Wei', 'Dr. Aravind Nair'],
    primaryAuthorAffiliation: 'Iris Vision & Multimodal Labs',
    publishedAt: '2026-09-15',
    category: 'Peer-Reviewed',
    topic: 'Perceptual Intelligence',
    accentColor: 'mint',
    doi: '10.5281/zenodo.1084265',
    arxivId: 'arXiv:2609.11209',
    citationCount: 38,
    downloadsCount: 4120,
    pdfFileSize: '6.4 MB',
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration preprint for Iris continuous spatial memory systems.',
    keyFindings: [
      'Maintained 89.6% tracking precision after 10 seconds of complete physical occlusion.',
      'Direct integration with robotic end-effector controllers at 60 Hz control loop.',
      'Zero catastrophic forgetting of background spatial coordinates during camera panning.'
    ],
    benchmarkMetric: {
      name: '10s Occlusion Re-ID Accuracy',
      value: '89.6%',
      comparisonToSota: '+71.2% over standard frame-based VLM'
    },
    bibtex: `@article{rostova2026iris,\n  title={Egocentric Voxel-Semantic Memory Buffers for Continuous Physical Affordance Tracking},\n  author={Rostova, Elena and Wei, Chen and Nair, Aravind},\n  journal={AI Tathastu Insights},\n  volume={4},\n  number={1},\n  pages={45--63},\n  year={2026},\n  doi={10.5281/zenodo.1084265}\n}`
  },
  {
    id: 'paper-statutory-standards-2026',
    title: 'Statutory Verification Sandboxes: A Blueprint for Enforceable Frontier Model Safety Treaties',
    abstract: 'This paper details technical specifications for air-gapped regulatory sandboxes that audit foundation model safety boundaries using automated adversarial harnesses and zero-knowledge verification proofs.',
    authors: ['Prof. Clara Zheng', 'Julian Thorne, JD', 'Dr. Aravind Nair'],
    primaryAuthorAffiliation: 'Tathastu Policy & Governance Unit',
    publishedAt: '2026-08-25',
    category: 'Policy Brief',
    topic: 'Governance & Safety',
    accentColor: 'ochre',
    doi: '10.5281/zenodo.1084251',
    arxivId: 'arXiv:2608.19012',
    citationCount: 67,
    downloadsCount: 5200,
    pdfFileSize: '2.1 MB',
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration policy brief modeling international verification sandbox covenants.',
    keyFindings: [
      'Codified 240 deterministic assertions covering safety, privacy, and systemic risk.',
      'Designed zero-knowledge proof protocols protecting intellectual property during audits.',
      'Adopted as an evaluation guideline across 3 sovereign testing facilities.'
    ],
    bibtex: `@article{zheng2026statutory,\n  title={Statutory Verification Sandboxes for Frontier AI Governance},\n  author={Zheng, Clara and Thorne, Julian and Nair, Aravind},\n  journal={AI Tathastu Policy Reports},\n  year={2026},\n  doi={10.5281/zenodo.1084251}\n}`
  },
  {
    id: 'paper-kv-quantization-2026',
    title: 'Dual-Phase Asymmetric Quantization of Key-Value Cache in Ultra-Long Sequences',
    abstract: 'We demonstrate that attention keys and values exhibit asymmetrical sensitivity to numeric precision in attention blocks. Asymmetric 2-bit key / 4-bit value quantization reduces HBM footprint by 78% with zero degradation in multi-document retrieval tasks up to 1.2M tokens.',
    authors: ['Dr. Aravind Nair', 'Dr. Marcus Vance', 'Karan Mehta'],
    primaryAuthorAffiliation: 'Frontier Systems Architecture Lab',
    publishedAt: '2026-08-04',
    category: 'Benchmark',
    topic: 'Inference Systems',
    accentColor: 'terracotta',
    doi: '10.5281/zenodo.1084239',
    arxivId: 'arXiv:2608.09314',
    citationCount: 53,
    downloadsCount: 6310,
    pdfFileSize: '3.9 MB',
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration benchmark report for inference memory optimization.',
    keyFindings: [
      '78% reduction in KV cache memory footprint across 1M token contexts.',
      'Sub-1.2ms latency overhead per decoding step on tensor accelerators.',
      'Validated on 100-needle retrieval stress benchmarks with 99.8% precision.'
    ],
    benchmarkMetric: {
      name: 'Memory Reduction Factor',
      value: '3.8x',
      comparisonToSota: 'Sub-4-bit without perplexity penalty'
    },
    bibtex: `@article{nair2026asymmetric,\n  title={Dual-Phase Asymmetric Quantization of Key-Value Cache},\n  author={Nair, Aravind and Vance, Marcus and Mehta, Karan},\n  journal={AI Tathastu Insights},\n  year={2026},\n  doi={10.5281/zenodo.1084239}\n}`
  }
];

export const mockEcosystemProducts: EcosystemProduct[] = [
  {
    id: 'mentormaze',
    name: 'MentorMaze',
    tagline: 'Adaptive AI Mentorship & Academic Trajectory Synthesis',
    description: 'An intelligent academic navigation system that personalizes learning trajectories, detects conceptual gaps in research methodologies, and connects student researchers with frontier mentors.',
    fullOverview: 'MentorMaze bridges the gap between ambitious university researchers and frontier laboratory practices. Rather than serving generic answers, MentorMaze diagnoses the cognitive prerequisites of advanced mathematical and engineering domains, constructing tailored project roadmaps, code-level debugging exercises, and literature digestion workflows.',
    accentColor: 'violet',
    badge: 'Education & Mentorship',
    status: 'Prototype',
    version: 'Prototype v0.8',
    coverImage: '/media/products/mentormaze/architecture-spec.svg',
    
    // 15-Section Specification
    overview: 'MentorMaze is an intelligent academic guidance platform engineered to diagnose cognitive prerequisite lattices and guide aspiring artificial intelligence researchers from fundamental linear algebra to frontier mechanistic interpretability.',
    problem: 'Advanced ML research literature has steep prerequisite lattices; traditional university textbooks lag 3 years behind frontier preprints, leaving students stranded on complex formal proofs, CUDA kernel optimizations, and empirical circuit discovery.',
    whyWeStarted: 'We observed brilliant undergraduate engineers and self-directed researchers hitting insurmountable cognitive plateaus when attempting to reproduce 70B parameter models. MentorMaze was built to provide the personalized Socratic guidance of a tenure-track advisor at scale.',
    researchBasis: 'Grounded in Cognitive Diagnostic Modeling (CDM) and topological knowledge graph extraction from over 120,000 computer science preprints indexed in the Tathastu Research Graph.',
    ourApproach: 'Instead of passive video lectures, MentorMaze treats research education as interactive debugging: students resolve intentionally corrupted gradient descent loops, formal Lean 4 lemmas, and sparse autoencoder loss spikes.',
    howItWorks: [
      { step: 1, title: 'Prerequisite Graph Diagnosis', description: 'Evaluates the learner against 420 prerequisite concepts spanning abstract algebra, GPU hardware concurrency, and transformer mechanics.' },
      { step: 2, title: 'Synthesized Trajectory Generation', description: 'Generates a personalized pedagogical path dynamically updated after every problem set.' },
      { step: 3, title: 'Interactive Sandbox Verification', description: 'Compiles student PyTorch and Triton code against automated test matrices on cloud GPUs.' },
      { step: 4, title: 'Faculty & Fellowship Matching', description: 'Unlocks direct lab introductions and Avsar micro-grants upon mastering advanced milestone nodes.' }
    ],
    features: [
      { title: 'Socratic Proof Debugger', description: 'Guides learners through step-by-step mathematical derivations without revealing final answers.', tag: 'Core AI' },
      { title: 'Interactive CUDA Playground', description: 'Browser-based execution environment providing cycle-accurate GPU profiler feedback.', tag: 'Systems' },
      { title: 'Citation Deep-Linking', description: 'Direct annotations linking every exercise back to primary Zenodo and arXiv research papers.', tag: 'Research' },
      { title: 'Adaptive Spaced Repetition', description: 'Algorithmic reinforcement schedules to ensure permanent retention of mathematical invariants.', tag: 'Pedagogy' }
    ],
    architecture: {
      overview: 'Microservices architecture with real-time graph traversal, sandboxed execution worker nodes, and WebSockets state streaming.',
      diagramDescription: 'Browser Client ↔ API Gateway ↔ Neo4j Prerequisite Graph ↔ Sandboxed GPU Worker Pool (CUDA 12.4 / PyTorch 2.4).',
      layers: [
        { layer: 'Presentation Layer', components: ['React 19', 'Tailwind CSS', 'Monaco Code Editor'], purpose: 'Responsive coding interface' },
        { layer: 'Diagnostic Engine', components: ['FastAPI', 'Neo4j Graph Database', 'Socratic Agent'], purpose: 'Prerequisite modeling' },
        { layer: 'Execution Cluster', components: ['Docker', 'gVisor Sandboxing', 'NVIDIA L4 Instances'], purpose: 'Secure GPU code verification' }
      ]
    },
    technologyStack: [
      { category: 'Frontend', technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
      { category: 'Backend & Diagnostics', technologies: ['FastAPI', 'Python 3.12', 'Neo4j Graph DB', 'PostgreSQL'] },
      { category: 'Execution Sandbox', technologies: ['Docker', 'gVisor', 'CUDA 12.4', 'Triton'] }
    ],
    engineeringChallenges: [
      { challenge: 'Cycle-accurate grading of student CUDA kernels without risking host server security.', solution: 'Isolated gVisor containers with strict GPU memory caps and eBPF syscall filtering.' },
      { challenge: 'Maintaining low-latency Socratic conversational turn intervals under 350ms.', solution: 'Speculative draft generation with fine-tuned 8B parameter mentor models running on local vLLM nodes.' }
    ],
    developmentTimeline: [
      { date: 'Q1 2025', milestone: 'Alpha Prototype', impact: 'Tested with 250 university students across 4 institutions.' },
      { date: 'Q3 2025', milestone: 'Interactive GPU Sandboxing', impact: 'Automated CUDA grading rolled out to 3,000 active learners.' },
      { date: 'Q2 2026', milestone: 'Version 3.0 Socratic Engine', impact: 'Achieved 91.4% curriculum completion rate across 14,200 students.' }
    ],
    benefits: [
      { audience: 'Students & Self-Learners', benefit: 'Accelerates path to frontier ML publication from 24 months to 6 months.' },
      { audience: 'Academic Labs', benefit: 'Reduces faculty onboarding overhead by delivering pre-trained apprentice researchers.' },
      { audience: 'Open Source Community', benefit: 'Increases the global pool of engineers capable of auditing large model safety.' }
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'Lean 4 Formal Proof Integration', target: 'Q4 2026', status: 'in_progress' },
      { phase: 'Phase 2', title: 'Federated Campus Compute Nodes', target: 'Q1 2027', status: 'planned' },
      { phase: 'Phase 3', title: 'Multi-lingual Mathematical Reasoning', target: 'Q2 2027', status: 'planned' }
    ],
    relatedStoryIds: ['sparse-autoencoders-residual-stream'],
    relatedMediaIds: ['documentary-residual-stream'],

    stats: [
      { label: 'Kernel Compiler', value: 'Triton / CUDA 12 (Target)' },
      { label: 'Sandbox Isolation', value: 'gVisor Container (Planned)' },
      { label: 'Memory Guard', value: 'eBPF Filter (Planned)' },
      { label: 'Pedagogy Engine', value: 'Socratic Proof DAG' }
    ],
    coreCapabilities: [
      {
        title: 'Diagnostic Knowledge Graphing',
        description: 'Maps the individual researcher understanding against prerequisite lattices in abstract algebra, transformer mechanics, and statistical learning theory.',
        metric: '98.2% Gap Precision'
      },
      {
        title: 'Verifiable Coding Exercises',
        description: 'Integrates sandboxed coding environments that grade custom CUDA kernels, PyTorch implementations, and formal Lean proofs in real-time.',
        metric: 'Real-time Execution'
      },
      {
        title: 'Frontier Lab Apprenticeships',
        description: 'Matches students who complete advanced milestones directly with senior research mentors at leading academic and industry labs.',
        metric: '1:1 Expert Guidance'
      }
    ],
    architecturePoints: [
      'Knowledge space state tracked in a neo4j graph topology.',
      'Socratic dialogue agent powered by pedagogical prompt orchestration.',
      'Direct integration with Tathastu Research Library citation graph.'
    ]
  },
  {
    id: 'collaborate',
    name: 'Collaborate',
    tagline: 'Distributed Peer Research & Multi-Agent Synthesis Node',
    description: 'A shared computational workspace where multidisciplinary research teams and specialized AI agents jointly execute hypotheses, synthesize papers, and conduct formal peer review.',
    fullOverview: 'Scientific discoveries increasingly occur at the boundary between disciplines. Tathastu Collaborate provides a reproducible laboratory notebook where human scientists orchestrate swarms of specialized literature-review, code-generation, and statistical-verification agents under rigorous cryptographic audit trails.',
    accentColor: 'blue',
    badge: 'Research Lab Infrastructure',
    status: 'In Development',
    version: 'Dev v0.9',
    coverImage: '/media/products/collaborate/collaborate-live.png',

    overview: 'Collaborate is an open multi-agent research laboratory environment combining real-time CRDT text collaboration, deterministic Docker capsules, and Aegis-BFT Byzantine consensus.',
    problem: 'Scientific teams lose 40% of their operational bandwidth to uncoordinated multi-agent hallucination drift, broken dependency environments, and disorganized preprint drafting.',
    whyWeStarted: 'Modern frontier research requires running dozens of agentic experiments in parallel. We built Collaborate so that research findings are reproducible from day one.',
    researchBasis: 'Built on the Aegis-BFT consensus protocol published in the Tathastu Technical Series, bounding turn-taking latencies to under 200ms.',
    ourApproach: 'Every experiment, script run, and data table is treated as an immutable cryptographic commit tied to an execution container.',
    howItWorks: [
      { step: 1, title: 'Hypothesis Initialization', description: 'Lead investigator defines the experimental hypothesis and constraint bounds.' },
      { step: 2, title: 'Multi-Agent Fanout', description: 'Specialized agents execute literature search, baseline benchmarking, and statistical verification in parallel.' },
      { step: 3, title: 'Byzantine Verification', description: 'Independent auditor agents verify code outputs against ground-truth datasets.' },
      { step: 4, title: 'Manuscript Synthesis', description: 'Compiles findings into camera-ready LaTeX documents with interactive citation verification.' }
    ],
    features: [
      { title: 'Aegis Swarm Consensus', description: 'Deterministic agreement protocol ensuring agents never hallucinate conflicting findings.', tag: 'Consensus' },
      { title: 'Reproducible Capsules', description: 'One-click snapshotting of datasets, environment variables, and random seeds.', tag: 'Infrastructure' },
      { title: 'Double-Blind Review Stage', description: 'Integrated manuscript submission directly connected to Editorial Studio.', tag: 'Peer Review' },
      { title: 'Live CRDT Notebooks', description: 'Concurrent multi-user editing with mathematical typography and inline Python cells.', tag: 'Editor' }
    ],
    architecture: {
      overview: 'Decentralized node topology with WebRTC peer connections, Redis cluster for state syncing, and Kubernetes runner pods.',
      diagramDescription: 'Browser Clients ↔ Y.js CRDT Gateway ↔ Aegis Consensus Engine ↔ Kubernetes Execution Pods.',
      layers: [
        { layer: 'Collaboration Layer', components: ['Y.js', 'WebSockets', 'TipTap Editor'], purpose: 'Zero-latency multi-user authoring' },
        { layer: 'Consensus Layer', components: ['Aegis-BFT Daemon', 'Rust', 'gRPC'], purpose: 'Agent turn arbitration' },
        { layer: 'Compute Cluster', components: ['Kubernetes', 'KServe', 'S3 Object Storage'], purpose: 'Sandboxed code execution' }
      ]
    },
    technologyStack: [
      { category: 'Real-time Sync', technologies: ['Y.js', 'WebSockets', 'Redis', 'Node.js'] },
      { category: 'Consensus Engine', technologies: ['Rust', 'Tokio', 'gRPC', 'Cryptographic Hashes'] },
      { category: 'Execution', technologies: ['Kubernetes', 'Docker', 'Python 3.12', 'Ray'] }
    ],
    engineeringChallenges: [
      { challenge: 'Preventing cascading hallucination when 16 agents debate simultaneously.', solution: 'Token-bounded assertion hashing requiring cryptographic signatures on experimental claims.' },
      { challenge: 'Real-time collaborative editing of 200-page research manuscripts with zero merge conflicts.', solution: 'Optimized Y.js state vector synchronization over binary WebSockets.' }
    ],
    developmentTimeline: [
      { date: 'Q2 2025', milestone: 'v1.0 Launch', impact: 'Deployed across 8 pilot labs.' },
      { date: 'Q4 2025', milestone: 'Aegis-BFT Protocol Integration', impact: 'Reduced p99 multi-agent consensus latency to 178ms.' },
      { date: 'Q3 2026', milestone: 'Version 2.4 Enterprise Release', impact: 'Surpassed 3,800 completed research laboratory sessions.' }
    ],
    benefits: [
      { audience: 'Research Labs', benefit: 'Accelerates peer-reviewed preprint drafting turnaround by 65%.' },
      { audience: 'Independent Scientists', benefit: 'Provides institutional-grade compute orchestration without dedicated DevOps teams.' },
      { audience: 'Journal Reviewers', benefit: 'Enables 100% deterministic reproduction of submitted paper results.' }
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'Interactive Plotly Data Weaving', target: 'Q4 2026', status: 'in_progress' },
      { phase: 'Phase 2', title: 'Decentralized IPFS Storage Mirrors', target: 'Q1 2027', status: 'planned' },
      { phase: 'Phase 3', title: 'Automated Refutation Collation', target: 'Q2 2027', status: 'planned' }
    ],
    relatedStoryIds: ['latency-bounded-swarm-consensus'],
    relatedMediaIds: ['podcast-tathastu-dialogues-ep14'],

    stats: [
      { label: 'Consensus Protocol', value: 'Aegis-BFT (Rust Spec)' },
      { label: 'Network Topology', value: '64 Heterogeneous Nodes (Sim)' },
      { label: 'Quorum Threshold', value: '2f + 1 Signatures' },
      { label: 'State Invariant', value: 'Linearizable Commits (Target)' }
    ],
    coreCapabilities: [
      {
        title: 'Aegis Swarm Arbitration',
        description: 'Coordinates specialized research sub-agents (Literature Scout, Statistical Auditor, LaTeX Formatter) with guaranteed sub-200ms consensus.',
        metric: 'Zero Deadlocks'
      },
      {
        title: 'Reproducible Execution Capsules',
        description: 'Every experiment, data pull, and chart generation is containerized with deterministic seed states and environment fingerprints.',
        metric: '100% Deterministic'
      },
      {
        title: 'Structured Peer Review Protocol',
        description: 'Automated double-blind submission workflow with pre-execution safety scans and statistical hypothesis re-testing.',
        metric: 'Automated Sanity Scans'
      }
    ],
    architecturePoints: [
      'Distributed CRDT state synchronization across global research teams.',
      'Zero-knowledge proof verification of sensitive dataset compliance.',
      'Direct one-click publication to AI Tathastu Insights editorial stream.'
    ]
  },
  {
    id: 'avsar',
    name: 'Avsar',
    tagline: 'Frontier AI Talent & Opportunity Discovery Engine',
    description: 'A meritocratic matchmaking engine that connects emerging research talent, technical founders, and research grants based on verified open-source contributions and publications.',
    fullOverview: 'Traditional academic credentialing filters out non-traditional builders and researchers in emerging economies. Avsar inverts this paradigm: by evaluating verified GitHub commits, arXiv preprints, benchmark submissions, and reproducible code reviews, Avsar automatically pairs talent with frontier funding and research fellowships.',
    accentColor: 'terracotta',
    badge: 'Grants & Fellowship Network',
    status: 'In Development',
    version: 'Dev v0.7',
    coverImage: '/media/products/avsar/avsar-live.png',

    overview: 'Avsar is an algorithmic fellowship and micro-grant discovery engine that evaluates technical merit from verified code artifacts rather than institutional prestige.',
    problem: 'Over 80% of promising AI talent in emerging economies is excluded from frontier research grants due to geographical friction, opaque application processes, and legacy pedigree filters.',
    whyWeStarted: 'Breakthrough contributions in open-source AI increasingly originate from independent researchers outside elite Western universities. Avsar was founded to fund talent on merit alone.',
    researchBasis: 'Grounded in algorithmic contribution analysis and automated test coverage verification.',
    ourApproach: 'We analyze code quality, commit consistency, algorithmic test suites, and benchmark submissions to calculate an objective Proof-of-Contribution score.',
    howItWorks: [
      { step: 1, title: 'Repository Ingestion', description: 'Applicant submits their GitHub profile and reproduction repositories.' },
      { step: 2, title: 'Algorithmic Evaluation', description: 'Automated analyzers grade code maintainability, test depth, and theoretical difficulty.' },
      { step: 3, title: 'Peer Fellowship Committee', description: 'Unanimous blind review by the Tathastu Foundation Academic Board.' },
      { step: 4, title: '72-Hour Grant Disbursal', description: 'Compute vouchers and non-dilutive research stipends wired within 3 business days.' }
    ],
    features: [
      { title: 'Proof-of-Contribution Scoring', description: 'Automated code auditing evaluating algorithmic complexity and reproducibility.', tag: 'Auditing' },
      { title: 'Micro-Grant Rails', description: 'Rapid compute voucher and stipend disbursal with zero bureaucratic paperwork.', tag: 'Funding' },
      { title: 'Global Talent Registry', description: 'Searchable directory of verified builders accessible to partner AI safety labs.', tag: 'Network' },
      { title: 'Milestone Disbursal Escrow', description: 'Funding released in stages upon verifiable code checkpoint delivery.', tag: 'Governance' }
    ],
    architecture: {
      overview: 'Serverless event-driven architecture with GitHub API webhooks, static code analyzers, and automated escrow smart contracts.',
      diagramDescription: 'GitHub Webhooks ↔ Event Bridge ↔ AST Analyzer ↔ Merit Scoring Service ↔ Escrow Disbursal Rail.',
      layers: [
        { layer: 'Ingestion Layer', components: ['GitHub GraphQL API', 'arXiv Crawler', 'Webhook Ingestion'], purpose: 'Raw artifact intake' },
        { layer: 'Analysis Engine', components: ['Tree-sitter AST Parser', 'pytest Runners', 'Complexity Analyzer'], purpose: 'Objective code audit' },
        { layer: 'Financial Rails', components: ['Stripe Treasury', 'AWS Cloud Credits API', 'Escrow Ledger'], purpose: 'Automated grant routing' }
      ]
    },
    technologyStack: [
      { category: 'Data Ingestion', technologies: ['Node.js', 'GraphQL', 'PostgreSQL', 'Redis'] },
      { category: 'Code Analysis', technologies: ['Python 3.12', 'Tree-sitter', 'Bandit Security', 'Docker'] },
      { category: 'Disbursal', technologies: ['Stripe Treasury', 'AWS Credit API', 'Audit Logs'] }
    ],
    engineeringChallenges: [
      { challenge: 'Detecting synthetic or plagiarized commits submitted for grant eligibility.', solution: 'Semantic AST differential hashing and Git author commit frequency anomaly detection.' },
      { challenge: 'Ensuring global compliance for instant non-dilutive research disbursements across 42 nations.', solution: 'Automated KYC/AML verification integrated with Stripe Treasury and institutional wires.' }
    ],
    developmentTimeline: [
      { date: 'Q3 2025', milestone: 'Avsar Pilot Program', impact: 'Disbursed $350k to 45 independent fellows.' },
      { date: 'Q1 2026', milestone: 'Automated Code Scorer v2', impact: 'Reduced grant evaluation cycle from 6 weeks to 72 hours.' },
      { date: 'Q3 2026', milestone: '$2.4M Milestone Reached', impact: 'Funded 320+ research fellows across 42 countries.' }
    ],
    benefits: [
      { audience: 'Independent Researchers', benefit: 'Receive non-dilutive capital and compute without giving up intellectual property.' },
      { audience: 'Grant Foundations', benefit: 'Maximizes dollar efficiency by allocating capital based on verified code output.' },
      { audience: 'Global South Builders', benefit: 'Bypasses legacy geographical barriers to access frontier research opportunities.' }
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'Direct GPU Cluster Provisioning', target: 'Q4 2026', status: 'in_progress' },
      { phase: 'Phase 2', title: 'Open Source Maintainer Endowment', target: 'Q1 2027', status: 'planned' },
      { phase: 'Phase 3', title: 'Decentralized Sovereign DAO Governance', target: 'Q3 2027', status: 'planned' }
    ],
    relatedStoryIds: ['formal-statutory-verification-frontier-ai'],
    relatedMediaIds: ['lecture-spatial-vision-iris'],

    stats: [
      { label: 'Evaluation Cluster', value: 'Cloud GPU Allocations' },
      { label: 'Target Preprints', value: 'arXiv Open Index' },
      { label: 'Verification Turnaround', value: '< 24h Target' },
      { label: 'Audit Trail', value: 'Public Reproduction Ledger' }
    ],
    coreCapabilities: [
      {
        title: 'Algorithmic Contribution Verification',
        description: 'Evaluates candidate code repositories for algorithmic rigor, test coverage, and theoretical depth rather than superficial vanity metrics.',
        metric: 'Objective Merit Scoring'
      },
      {
        title: 'Micro-Grant Allocation System',
        description: 'Disburses compute credits and experimental seed capital to promising projects within 72 hours of peer-verified review.',
        metric: '< 72h Disbursal'
      },
      {
        title: 'Fellowship Pipeline',
        description: 'Direct recruitment pipelines to participating AI labs, university institutes, and frontier safety organizations.',
        metric: 'Direct Lab Entry'
      }
    ],
    architecturePoints: [
      'Proof-of-Contribution smart contract verification.',
      'Integration with MentorMaze for skill acceleration and certification.',
      'Transparent funding review board with public oversight logs.'
    ]
  },
  {
    id: 'iris',
    name: 'Iris',
    tagline: 'Continuous Spatial Intelligence & Multimodal Perceptual Systems',
    description: 'An advanced perceptual intelligence foundation model engineered for spatial memory, physical scene understanding, and real-time embodied robotics grounding.',
    fullOverview: 'Iris solves the temporal and spatial disconnect inherent to conventional multimodal models. Built on 3D voxel-semantic neural memories, Iris maintains a continuous spatial understanding of the physical environment, enabling assistive technology, automated inspection, and embodied robotic manipulation.',
    accentColor: 'mint',
    badge: 'Perceptual Intelligence',
    status: 'In Development',
    version: 'Dev v0.6',
    coverImage: '/media/products/iris/architecture-spec.svg',

    overview: 'Iris is an embodied perceptual intelligence foundation model providing continuous 3D spatial voxel memory and real-time physical affordance grounding at 60 FPS.',
    problem: 'Standard Vision-Language Models (VLMs) process disconnected 2D video frames. The moment an object leaves sensor field-of-view, all spatial permanence and geometric affordances are lost.',
    whyWeStarted: 'Real-world physical agency requires spatial permanence. We built Iris so robots and spatial vision systems can navigate, remember occluded objects, and interact safely with dynamic human spaces.',
    researchBasis: 'Based on egocentric neural radiance fields and persistent 3D voxel-semantic buffers published in AI Tathastu Insights Volume 4.',
    ourApproach: 'As RGB-D and event camera streams arrive, Iris continuously projects neural features into a dynamic 3D voxel coordinate space with explicit uncertainty bounds.',
    howItWorks: [
      { step: 1, title: 'Multi-Modal Stream Capture', description: 'Synchronizes RGB, depth, and IMU sensor streams at 60 FPS.' },
      { step: 2, title: 'Voxel Feature Projection', description: 'Projects high-dimensional semantic representations into continuous 3D world space.' },
      { step: 3, title: 'Occlusion-Resistant Memory', description: 'Maintains object permanence even when objects are obscured or cameras pan away.' },
      { step: 4, title: 'Affordance Synthesis', description: 'Generates sub-15ms collision-free trajectory vectors for robotic actuators.' }
    ],
    features: [
      { title: 'Egocentric Voxel Memory', description: 'Dense 3D representation retaining spatial permanence over 24-hour periods.', tag: 'Vision 3D' },
      { title: 'Real-Time ROS 2 Integration', description: 'Native C++ and Python bindings for direct robot operating system control.', tag: 'Robotics' },
      { title: 'Sub-15ms Trajectory Planner', description: 'Generates obstacle-free robotic arm grasping paths in dynamic environments.', tag: 'Control' },
      { title: 'Zero-Shot Object Re-ID', description: 'Re-identifies previously seen physical objects under severe lighting changes.', tag: 'Perception' }
    ],
    architecture: {
      overview: 'Hybrid edge-cloud architecture with TensorRT-optimized local perception models and cloud-backed long-term world memory synchronization.',
      diagramDescription: 'Optical Sensors ↔ Jetson Orin Edge Node (Iris Kernel 60 FPS) ↔ ROS 2 Bridge ↔ Long-Term Memory Cloud Hub.',
      layers: [
        { layer: 'Sensor Ingestion Layer', components: ['RealSense SDK', 'V4L2 Drivers', 'IMU Kalman Filter'], purpose: 'Low-latency sensor fusion' },
        { layer: 'Spatial Neural Memory', components: ['TensorRT', 'CUDA 12.4', 'Sparse 3D ConvNet'], purpose: 'Voxel grid maintenance' },
        { layer: 'Action Generation', components: ['ROS 2 Humble', 'MoveIt 2', 'Control Loop'], purpose: 'Actuator vector dispatch' }
      ]
    },
    technologyStack: [
      { category: 'Edge Runtime', technologies: ['NVIDIA Jetson Orin', 'CUDA', 'TensorRT 10', 'C++20'] },
      { category: 'Robotics Middleware', technologies: ['ROS 2 Humble', 'DDS', 'MoveIt 2', 'Zenoh'] },
      { category: 'Neural Architecture', technologies: ['PyTorch 2.4', 'TorchScript', 'ONNX Runtime', 'FlashAttention'] }
    ],
    engineeringChallenges: [
      { challenge: 'Maintaining 60 FPS voxel projection on power-constrained 35W embedded edge hardware.', solution: 'Custom FP8 quantized tensor kernels fusing depth reprojection with spatial attention.' },
      { challenge: 'Eliminating coordinate drift during aggressive camera rotations.', solution: 'Visual-inertial odometry tightly coupled with high-confidence semantic anchor landmarks.' }
    ],
    developmentTimeline: [
      { date: 'Q4 2024', milestone: 'Voxel Memory Proof of Concept', impact: 'Demonstrated 10-second occlusion tracking in simulated laboratory.' },
      { date: 'Q2 2025', milestone: 'Version 1.0 Embedded Release', impact: 'Deployed to 200 physical robotic arms in pilot manufacturing plants.' },
      { date: 'Q3 2026', milestone: 'Version 2.1 Spatial Intelligence', impact: 'Scaled to 1,200+ hardware deployments operating at 60 FPS.' }
    ],
    benefits: [
      { audience: 'Robotics Engineers', benefit: 'Replaces brittle custom vision pipelines with a unified spatial memory API.' },
      { audience: 'Industrial Automation', benefit: 'Reduces robot stoppage and occlusion errors by over 84% in dynamic facilities.' },
      { audience: 'Assistive Tech Developers', benefit: 'Enables wearable egocentric navigation for visually impaired individuals.' }
    ],
    roadmap: [
      { phase: 'Phase 1', title: 'Cross-Embodiment Sensor Calibration', target: 'Q4 2026', status: 'in_progress' },
      { phase: 'Phase 2', title: 'Multi-Robot Collaborative Voxel Mesh', target: 'Q1 2027', status: 'planned' },
      { phase: 'Phase 3', title: 'Open Edge Checkpoints on Hugging Face', target: 'Q2 2027', status: 'planned' }
    ],
    relatedStoryIds: ['multimodal-grounding-iris-spatial-memory'],
    relatedMediaIds: ['lecture-spatial-vision-iris'],

    stats: [
      { label: 'Perception Model', value: '3D Voxel Occupancy (Model)' },
      { label: 'Target Silicon', value: 'Jetson Orin AGX (Planned)' },
      { label: 'Throughput Target', value: '80+ FPS Design Target' },
      { label: 'Memory Persistence', value: 'Egocentric Tensor' }
    ],
    coreCapabilities: [
      {
        title: '3D Egocentric Persistent Memory',
        description: 'Builds a dense voxel-semantic map that persists even when optical sensors are temporarily occluded or turned away.',
        metric: 'Sub-centimeter Drift'
      },
      {
        title: 'Real-time Affordance Synthesis',
        description: 'Generates actionable grasp and collision-avoidance vectors for robotic manipulators with sub-15ms latency.',
        metric: '12ms Latency'
      },
      {
        title: 'Cross-Modal Sensory Fusion',
        description: 'Combines RGB vision, thermal imaging, and event-camera streams into a unified high-temporal-resolution latent representation.',
        metric: 'Heterogeneous Inputs'
      }
    ],
    architecturePoints: [
      'Hardware-accelerated CUDA kernel bindings for embedded Jetson and tensor edge nodes.',
      'Temporal transformer backbone with sparse attention over spatial anchor points.',
      'Continuous streaming API designed for robotics operating systems (ROS 2).'
    ]
  }
];

export const mockMediaItems: MediaItem[] = [
  {
    id: 'documentary-residual-stream',
    title: 'Inside the Residual Stream: Visualizing Monosemantic Circuits',
    description: 'A 24-minute deep-dive documentary exploring how sparse autoencoders disassemble the inner representation layers of 70B parameter frontier models.',
    format: 'documentary',
    duration: '24:18',
    speaker: 'Dr. Aravind Nair & The MechInterp Lab',
    speakerRole: 'Principal Investigators',
    publishedAt: '2026-10-20',
    coverImage: '/media/company/platform-overview.png',
    category: 'Interpretability',
    videoUrl: '/media/documentary-residual-stream'
  },
  {
    id: 'podcast-tathastu-dialogues-ep14',
    title: 'Tathastu Dialogues #14: The Geometry of Latency in Agent Swarms',
    description: 'Vikram Sharma sits down with distributed systems engineers to discuss why unstructured agent discussions fail and how Byzantine consensus changes multi-agent reliability.',
    format: 'dialogue',
    duration: '48:32',
    speaker: 'Vikram Sharma with Prof. Marcus Vance',
    speakerRole: 'Distributed Systems Series',
    publishedAt: '2026-10-15',
    coverImage: '/media/products/collaborate/collaborate-live.png',
    audioDurationSeconds: 2912,
    category: 'Systems'
  },
  {
    id: 'lecture-spatial-vision-iris',
    title: 'Technical Lecture: Beyond Static Frames — Spatial Voxel Memory in Iris',
    description: 'Dr. Elena Rostova presents mathematical proofs and live robotic demos showing continuous object permanence in complex occluded scenes.',
    format: 'lecture',
    duration: '38:45',
    speaker: 'Dr. Elena Rostova',
    speakerRole: 'Director of Perceptual AI',
    publishedAt: '2026-09-25',
    coverImage: '/media/products/iris/architecture-spec.svg',
    category: 'Perception'
  },
  {
    id: 'documentary-frontier-governance',
    title: 'Air-Gapped Audits: The Mechanics of International AI Treaties',
    description: 'Investigating how cryptographic zero-knowledge proofs enable sovereign nations to verify model safety covenants without leaking proprietary model weights.',
    format: 'documentary',
    duration: '29:50',
    speaker: 'Prof. Clara Zheng',
    speakerRole: 'Fellow in Computational Governance',
    publishedAt: '2026-09-12',
    coverImage: '/media/products/avsar/avsar-live.png',
    category: 'Governance'
  }
];

export const mockEditorialSubmissions: EditorialSubmission[] = [
  {
    id: 'sub-2026-094',
    title: 'Provable Bounds on Hallucination Decay via Graph-Constrained Retrieval',
    authorName: 'Dr. Neha Kulkarni',
    authorAffiliation: 'Center for Algorithmic Verification',
    category: 'Frontier Systems',
    status: 'in_review',
    submittedAt: '2026-11-18',
    wordCount: 5420,
    reviewerScore: 8.9,
    assignedEditor: 'Dr. Aravind Nair',
    abstract: 'Proves a deterministic upper bound on retrieval-augmented hallucination rates when context documents are constrained to acyclic causal citation dependencies.'
  },
  {
    id: 'sub-2026-093',
    title: 'Thermodynamic Cost of Long-Context Inference in Optical Interconnects',
    authorName: 'Karan Mehta',
    authorAffiliation: 'Photonics & Systems Lab',
    category: 'Inference Systems',
    status: 'revisions_requested',
    submittedAt: '2026-11-16',
    wordCount: 4890,
    reviewerScore: 7.4,
    assignedEditor: 'Vikram Sharma',
    abstract: 'An empirical analysis of photonic switching efficiency across 10-megawatt compute clusters running 10M token context workloads.'
  },
  {
    id: 'sub-2026-091',
    title: 'Safety Invariants in Self-Correcting Code Generation Networks',
    authorName: 'Dr. Alistair Finch',
    authorAffiliation: 'Imperial Institute of AI Safety',
    category: 'Safety & Ethics',
    status: 'accepted',
    submittedAt: '2026-11-10',
    wordCount: 6200,
    reviewerScore: 9.3,
    assignedEditor: 'Prof. Clara Zheng',
    abstract: 'Formal methods applied to multi-turn compiler feedback loops to ensure generated software adheres to non-bypassable memory safety policies.'
  },
  {
    id: 'sub-2026-088',
    title: 'Continuous Voxel-Semantic Alignment in Low-Light Autonomous Drone Swarms',
    authorName: 'Chen Wei & Dr. Elena Rostova',
    authorAffiliation: 'Iris Multimodal Labs',
    category: 'Cognitive Architectures',
    status: 'scheduled',
    submittedAt: '2026-11-04',
    wordCount: 5100,
    reviewerScore: 9.5,
    assignedEditor: 'Dr. Elena Rostova',
    abstract: 'Field deployment results of Iris spatial memory under complete optical degradation during emergency search-and-rescue operations.'
  }
];

export const mockTopics: Topic[] = [
  {
    id: 'interpretability',
    slug: 'interpretability',
    name: 'Mechanistic Interpretability',
    description: 'Reverse-engineering weights, activations, and residual streams into human-understandable circuits.',
    accentColor: 'violet',
    count: 28,
  },
  {
    id: 'agentic-systems',
    slug: 'agentic-systems',
    name: 'Agentic Systems & Swarms',
    description: 'Decentralized multi-agent consensus, asynchronous tool orchestration, and Byzantine fault tolerance.',
    accentColor: 'blue',
    count: 34,
  },
  {
    id: 'perceptual-intelligence',
    slug: 'perceptual-intelligence',
    name: 'Perceptual Intelligence',
    description: 'Spatial 3D memory, continuous world representations, and embodied sensory fusion in Iris.',
    accentColor: 'mint',
    count: 22,
  },
  {
    id: 'governance-policy',
    slug: 'governance-policy',
    name: 'Statutory AI Governance',
    description: 'Air-gapped verification sandboxes, automated statutory audits, and international treaty standards.',
    accentColor: 'ochre',
    count: 19,
  },
  {
    id: 'inference-systems',
    slug: 'inference-systems',
    name: 'Inference Architectures',
    description: 'KV cache quantization, memory wall solutions, and high-throughput speculative decoding.',
    accentColor: 'terracotta',
    count: 26,
  },
  {
    id: 'reasoning-models',
    slug: 'reasoning-models',
    name: 'Reasoning & Formal Proofs',
    description: 'Neuro-symbolic integration, automated Lean 4 theorem proving, and dynamic synthetic curricula.',
    accentColor: 'ochre',
    count: 24,
  }
];

export const mockPerspectives: PerspectiveItem[] = [
  {
    id: 'persp-01',
    title: 'Why Statutory Verification Sandboxes Must Precede Frontier Weight Releases',
    subtitle: 'Relying on post-hoc corporate safety cards without reproducible air-gapped evaluation environments creates dangerous regulatory asymmetry.',
    author: mockAuthors.clara,
    category: 'AI Governance',
    publishedAt: '2026-10-18',
    format: 'Researcher Essay',
    pullQuote: 'Voluntary safety commitments without independent air-gapped code harnesses are merely public relations. Verification requires statutory sandboxes.',
    accentColor: 'ochre',
    readingTimeMinutes: 7,
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration editorial essay authored by illustrative persona Prof. Clara Zheng.',
  },
  {
    id: 'persp-02',
    title: 'The Embodied Bottleneck: Why Language Models Cannot Ground Spatial Physics',
    subtitle: 'Without continuous egocentric voxel buffers, language models merely hallucinate geometric affordances rather than comprehending 3D physical constraints.',
    author: mockAuthors.elena,
    category: 'Perceptual Intelligence',
    publishedAt: '2026-10-10',
    format: 'Expert Opinion',
    pullQuote: 'Token sequences do not encode volumetric physics. Intelligence that interacts with the real world requires continuous sensory geometry.',
    accentColor: 'mint',
    readingTimeMinutes: 9,
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration expert opinion authored by illustrative persona Dr. Elena Rostova.',
  },
  {
    id: 'persp-03',
    title: 'Debate: Is Superposition a Structural Flaw or an Optimal Compression Regime?',
    subtitle: 'A technical exchange between mechanistic circuit investigators on whether future architectures should enforce monosemanticity at training time.',
    author: mockAuthors.aravind,
    category: 'Mechanistic Interpretability',
    publishedAt: '2026-09-29',
    format: 'Editorial Debate',
    pullQuote: 'Superposition is an inevitable consequence of parameter efficiency. Our goal should not be to banish it, but to systematically invert it.',
    accentColor: 'violet',
    readingTimeMinutes: 12,
    verificationStatus: 'demonstration_concept',
    provenanceNote: 'Demonstration debate dialogue authored by illustrative persona Dr. Aravind Nair.',
  },
];

// ============================================================================
// ENGINEERING ARTICLES (Master UI/UX Specification - Section 5 & 7)
// ============================================================================

export const mockEngineeringArticles: EngineeringArticle[] = [
  {
    id: 'eng-01',
    slug: 'aegis-bft-distributed-consensus',
    title: 'Aegis-BFT: Sub-200ms Byzantine Consensus for Swarms of Heterogeneous Agents',
    subtitle: 'How we engineered a deterministic turn arbitration engine in Rust to bound multi-agent state drift without stalling inference pipelines.',
    category: 'Distributed Systems',
    abstract: 'Autonomous agent swarms fail in production not from single-step reasoning errors, but from state drift and Byzantine race conditions across concurrent tool calls. Aegis-BFT is our open consensus engine that provides linearizable state transitions across up to 64 heterogeneous LLM workers under 200 milliseconds.',
    author: mockAuthors.marcus,
    publishedAt: '2026-11-14',
    readingTimeMinutes: 14,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200',
    tags: ['Rust', 'Distributed Systems', 'Consensus', 'Multi-Agent', 'Byzantine Fault Tolerance'],
    systemArchitecture: {
      topology: 'Decentralized Gossip Mesh with Leaderless Quorum Epochs',
      components: [
        { name: 'Aegis Core Daemon', role: 'Rust Tokio async consensus loop enforcing 2f+1 quorum', latency: '12ms' },
        { name: 'CRDT Memory Broker', role: 'Y.js-compatible binary state difference distributor', latency: '24ms' },
        { name: 'Kernel Sandbox Enclave', role: 'gRPC-gated Docker / Firecracker execution capsule', latency: '85ms' },
        { name: 'Audit Proof Ledger', role: 'SHA-256 Merkle root verification before commit broadcast', latency: '18ms' }
      ]
    },
    codeSnippets: [
      {
        title: 'aegis_consensus.rs — Quorum State Commit Invariant',
        language: 'rust',
        code: `pub async fn verify_and_commit_turn(
    &self,
    proposal: &AgentTurnProposal,
    peer_signatures: &[AgentSignature],
) -> Result<TurnCommitReceipt, ConsensusError> {
    // Enforce 2f + 1 quorum requirement
    let required_quorum = (2 * self.byzantine_threshold) + 1;
    let valid_count = self.verify_cryptographic_signatures(proposal, peer_signatures)?;

    if valid_count < required_quorum {
        return Err(ConsensusError::QuorumDeficit {
            required: required_quorum,
            observed: valid_count,
        });
    }

    // Atomic linearizable epoch increment
    let receipt = self.state_ledger.atomic_append(proposal).await?;
    self.broadcast_gossip_commit(&receipt).await?;
    Ok(receipt)
}`,
        explanation: 'Enforces statutory quorum before any tool action is applied to the global shared agent memory, preventing cascading hallucinations.'
      }
    ],
    benchmarks: [
      { metric: '99th Percentile Consensus Latency', value: '142ms', baseline: '1,840ms (Raft vanilla)', note: 'Measured with 32 agents on c6i.4xlarge AWS instances' },
      { metric: 'Byzantine Injection Rejection Rate', value: '100%', baseline: '64.2%', note: 'Tested against adversarial prompt injection injecting malicious tool state' },
      { metric: 'Throughput Under Full Contention', value: '1,480 ops/sec', baseline: '180 ops/sec', note: 'Linearizable CRDT write operations across 64 node clusters' }
    ],
    content: [
      'Multi-agent orchestration frameworks frequently assume that individual agents act honestly and consistently. In high-stakes applications—such as automated code synthesis, peer review orchestration, or robotic navigation—this assumption breaks down catastrophically.',
      'When dozens of autonomous agents query APIs, execute code cells, and propose hypotheses simultaneously, concurrent race conditions induce state divergence. An agent acting on stale memory invalidates downstream planning.',
      'Aegis-BFT addresses this fundamental bottleneck by treating every agent as an untrusted peer in a Byzantine consensus network. By deploying lightweight Rust daemons that arbitrate turn proposals via deterministic Merkle hashes, we reduce synchronization overhead from seconds to sub-200 milliseconds.'
    ]
  },
  {
    id: 'eng-02',
    slug: 'triton-top-k-sae-kernels',
    title: 'Triton Top-K SAE Kernels: Inverting Residual Stream Polysemanticity at Scale',
    subtitle: 'Achieving 94.2% H100 memory bandwidth saturation with fused custom CUDA/Triton kernels for 262k dictionary expansion.',
    category: 'Kernel Engineering',
    abstract: 'Mechanistic interpretability requires sparse autoencoders (SAEs) with dictionaries expanding 64x to 256x the model dimension. PyTorch native implementations choke on memory bandwidth during top-K thresholding. We detail our Triton kernel architecture that fuses dictionary projection and top-K activation into a single streaming pass.',
    author: mockAuthors.aravind,
    publishedAt: '2026-11-06',
    readingTimeMinutes: 11,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
    tags: ['Triton', 'CUDA', 'GPU Kernels', 'Sparse Autoencoders', 'Memory Bandwidth'],
    systemArchitecture: {
      topology: 'Fused SRAM Streaming Pipeline on NVIDIA Hopper (H100)',
      components: [
        { name: 'Streaming Encoder Kernel', role: 'Fused GEMM + Top-K selection in shared memory', latency: '0.42ms' },
        { name: 'Sparse Accumulator Buffer', role: 'Bitmask-compressed active feature index registry', latency: '0.12ms' },
        { name: 'Decoder Backpropagation', role: 'Sparsity-aware gradient dispatcher without dense unroll', latency: '0.88ms' }
      ]
    },
    codeSnippets: [
      {
        title: 'fused_topk_sae.py — Triton Fused Encoder Kernel',
        language: 'python',
        code: `@triton.jit
def _fused_sae_encoder_kernel(
    x_ptr, w_enc_ptr, bias_ptr, out_idx_ptr, out_val_ptr,
    stride_xm, stride_xk, stride_wnd, stride_wnf,
    BLOCK_M: tl.constexpr, BLOCK_N: tl.constexpr, K: tl.constexpr
):
    pid_m = tl.program_id(0)
    # Stream activations directly into SRAM shared cache
    x_offsets = pid_m * BLOCK_M + tl.arange(0, BLOCK_M)
    # Compute projection dot product in registers
    acc = tl.zeros((BLOCK_M, BLOCK_N), dtype=tl.float32)
    # Fused in-register Top-K bitonic sort without global memory spill
    topk_vals, topk_indices = tl.extra.cuda.topk(acc, k=K, dim=-1)
    tl.store(out_val_ptr + x_offsets, topk_vals)
    tl.store(out_idx_ptr + x_offsets, topk_indices)`,
        explanation: 'Fusing the projection and Top-K filter avoids round-trips to HBM, boosting arithmetic intensity by 4.8x compared to native PyTorch.'
      }
    ],
    benchmarks: [
      { metric: 'H100 Memory Bandwidth Utilization', value: '94.2%', baseline: '38.6% (Torch compile)', note: 'Measured via NVIDIA Nsight Compute profiling on 262k expansion' },
      { metric: 'Forward Pass Latency (Layer 28, 70B)', value: '1.42ms', baseline: '6.85ms', note: 'Batch size 32, sequence length 2048' },
      { metric: 'Host-to-Device Memory Overhead', value: '0 bytes', baseline: '1.2 GB/layer', note: 'All intermediate activations discarded post-Top-K' }
    ],
    content: [
      'Sparse Autoencoders have emerged as the most rigorous lens for reverse-engineering the residual streams of frontier transformer models. However, scaling dictionary sizes from 16,000 to 262,144 features creates an acute memory bandwidth bottleneck on modern accelerator hardware.',
      'Under standard frameworks, the linear projection generates tens of gigabytes of intermediate activation tensors that immediately get thresholded away. This stalls tensor cores as memory busses saturate.',
      'Our custom Triton kernel architecture solves this by computing the projection directly into register files, executing top-K thresholding in shared memory, and writing only non-zero coordinates back to HBM.'
    ]
  },
  {
    id: 'eng-03',
    slug: 'zero-knowledge-foundation-auditing',
    title: 'Cryptographic Circuit Attestation: Zero-Knowledge Verification for Autonomous Models',
    subtitle: 'Verifying that safety ablation circuits were executed without exposing private model weights or training datasets.',
    category: 'Security & Invariants',
    abstract: 'Regulatory compliance for frontier models typically forces a terrible tradeoff: either proprietary weights must be leaked to statutory bodies, or audits must rely on unverified self-attestation. We introduce cryptographic circuit attestation using recursive zk-SNARKs to prove circuit inactivation on private weights.',
    author: mockAuthors.clara,
    publishedAt: '2026-10-24',
    readingTimeMinutes: 16,
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    tags: ['Cryptography', 'Zero Knowledge', 'zk-SNARKs', 'AI Safety', 'Auditing'],
    systemArchitecture: {
      topology: 'Halo2 Recursive Proof Pipeline with KZG Commitments',
      components: [
        { name: 'Circuit Arithmeticizer', role: 'Compiles residual circuit ablations into R1CS polynomial constraints', latency: '4.2s' },
        { name: 'Halo2 Prover Engine', role: 'Generates zero-knowledge proof of execution without disclosing weights', latency: '12.8s' },
        { name: 'Statutory Verifier Gate', role: 'Sub-5ms on-chain or CLI proof checker for regulatory auditors', latency: '3.4ms' }
      ]
    },
    codeSnippets: [
      {
        title: 'circuit_attestation.zk — Halo2 Circuit Invariant Gate',
        language: 'rust',
        code: `fn synthesize_ablation_proof<F: PrimeField>(
    &self,
    config: &CircuitConfig,
    mut layouter: impl Layouter<F>,
) -> Result<(), Error> {
    layouter.assign_region(
        || "safety_circuit_ablation_gate",
        |mut region| {
            // Verify that ablation weight vector W_ablate zeroes dangerous heads
            config.q_ablate.enable(&mut region, 0)?;
            let weight_commitment = region.assign_advice(|| "weight_hash", config.adv[0], 0)?;
            let residual_norm = region.assign_advice(|| "residual_norm", config.adv[1], 0)?;
            // Constraint: residual projection on dangerous vector <= epsilon
            region.constrain_equal(residual_norm.cell(), config.zero_witness.cell())?;
            Ok(())
        },
    )
}`,
        explanation: 'Enables an external statutory auditor to mathematically verify that dangerous hazardous-knowledge circuits were rendered inactive during inference.'
      }
    ],
    benchmarks: [
      { metric: 'Proof Verification Duration', value: '3.4ms', baseline: '45,000ms (Full model re-run)', note: 'Instantaneous statutory certification on standard consumer laptop' },
      { metric: 'Proof Size', value: '840 bytes', baseline: '140 GB (Weight disclosure)', note: 'Cryptographically succinct KZG proof polynomial' },
      { metric: 'False Positive Invariance Rate', value: '0.00%', baseline: '12.4% (Blackbox redteaming)', note: 'Formal mathematical guarantee backed by elliptic curve discrete log hardness' }
    ],
    content: [
      'As artificial intelligence systems are deployed into critical national infrastructure, external auditors require mathematical proof that safety guarantees hold in practice.',
      'Blackbox redteaming is inherently stochastic and incomplete. A model that refuses a dangerous query 99 times out of 100 may still capitulate on adversarial phrasing.',
      'By formulating mechanistic circuit ablation as a zero-knowledge proof, AI Tathastu provides an air-gapped method for statutory bodies to confirm safety compliance without accessing proprietary model weights.'
    ]
  }
];

// ============================================================================
// COMPANY UPDATES & CHANGELOG (Master UI/UX Specification - Section 6 & 8)
// ============================================================================

export const mockCompanyUpdates: CompanyUpdate[] = [
  {
    id: 'upd-01',
    slug: 'mentormaze-v3-2-speculative-socratic',
    title: 'MentorMaze 3.2: Speculative Socratic Reasoning & 48% Lower Latency',
    summary: 'MentorMaze 3.2 introduces speculative Socratic decoding, reducing dialogue turnaround to 240ms while maintaining pedagogical scaffolding invariants.',
    category: 'Product Release',
    productId: 'mentormaze',
    version: 'v3.2.0',
    date: '2026-11-18',
    author: mockAuthors.marcus,
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
    tags: ['MentorMaze', 'Product Release', 'Socratic AI', 'Latency', 'Speculative Decoding'],
    milestoneMetric: { label: 'Active Students Mentored', value: '14,200+' },
    relatedLinks: [
      { label: 'Explore MentorMaze Product Details', url: '#/products' },
      { label: 'Read Technical Benchmark', url: '#/engineering' }
    ],
    content: [
      'Today we are shipping MentorMaze 3.2 to over 14,000 active students and academic researchers across 40 institutions.',
      'The primary technical upgrade in 3.2 is our speculative Socratic engine. Traditional dialogue tutors hesitate for 1.8 to 2.4 seconds while computing curriculum paths. By running a draft pedagogical model alongside our 70B reasoning backend, turnaround time drops to 240 milliseconds.',
      'Importantly, the system preserves our anti-hallucination guardrail: it will never give direct code solutions to coursework problems, guiding students through first-principles Socratic questioning instead.'
    ]
  },
  {
    id: 'upd-02',
    slug: 'iris-v2-1-spatial-voxel-engine',
    title: 'Iris 2.1: Continuous Egocentric 3D Voxel Memory at 88 FPS on Edge Silicon',
    summary: 'Iris 2.1 brings real-time 3D spatial voxel occupancy grids to edge hardware, allowing autonomous robots to track occluded objects with zero drift.',
    category: 'Product Release',
    productId: 'iris',
    version: 'v2.1.0',
    date: '2026-11-12',
    author: mockAuthors.elena,
    coverImage: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=1200',
    tags: ['Iris', 'Spatial Intelligence', 'Edge AI', 'Computer Vision', 'Robotics'],
    milestoneMetric: { label: 'Perceptual Throughput', value: '88 FPS' },
    relatedLinks: [
      { label: 'Iris Technical Specification', url: '#/products' }
    ],
    content: [
      'Iris 2.1 is now generally available for partner robotics labs and perceptual intelligence researchers.',
      'This release introduces our continuous egocentric voxel buffer. Previous computer vision backends forgot object coordinates the moment an object moved behind an occlusion. Iris maintains a 4D volumetric tensor memory in edge SRAM, guaranteeing persistence even in unstructured physical environments.',
      'Benchmarked on standard NVIDIA Jetson Orin modules, Iris 2.1 delivers 88 frames per second at 4.2W power consumption.'
    ]
  },
  {
    id: 'upd-03',
    slug: 'collaborate-v2-4-byzantine-swarms',
    title: 'Collaborate 2.4: Aegis-BFT Consensus Ships to 3,800+ Research Labs',
    summary: 'Collaborate 2.4 embeds our Aegis Byzantine consensus daemon directly into collaborative notebooks, preventing conflicting multi-agent tool execution.',
    category: 'Product Release',
    productId: 'collaborate',
    version: 'v2.4.1',
    date: '2026-11-04',
    author: mockAuthors.marcus,
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
    tags: ['Collaborate', 'Multi-Agent', 'Byzantine Consensus', 'Reproducible Science'],
    milestoneMetric: { label: 'Active Lab Clusters', value: '3,800+' },
    relatedLinks: [
      { label: 'Read Aegis-BFT Engineering Deep Dive', url: '#/engineering' }
    ],
    content: [
      'Collaborate 2.4 brings distributed consensus to multi-agent scientific discovery.',
      'Scientific research teams orchestrating autonomous literature-review and code-synthesis agents frequently encounter race conditions. Collaborate 2.4 arbitrates agent actions through linearizable quorum commits, guaranteeing that code notebooks remain perfectly reproducible across turns.'
    ]
  },
  {
    id: 'upd-04',
    slug: 'avsar-2-4m-peer-grants-seeded',
    title: 'AI Tathastu Seeds $2.4M in Peer Research Grants via Avsar Foundation Network',
    summary: 'Avsar reaches a milestone of $2.4M in non-dilutive research micro-grants distributed across 120 independent open-source AI safety contributors.',
    category: 'Milestone',
    productId: 'avsar',
    date: '2026-10-28',
    author: mockAuthors.clara,
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
    tags: ['Avsar', 'Grants', 'Open Source', 'Fellowship', 'Non-Dilutive'],
    milestoneMetric: { label: 'Grants Seeded', value: '$2.4M+' },
    relatedLinks: [
      { label: 'Avsar Grant Opportunities', url: '#/products' }
    ],
    content: [
      'We are proud to announce that the Avsar grant registry has distributed over $2.4 million in equity-free, non-dilutive funding to 120 independent researchers across 22 countries.',
      'Unlike traditional bureaucratic grant applications that take 9 months to evaluate, Avsar uses an algorithmic peer-attestation protocol that disburses micro-grants within 72 hours of open-source benchmark reproduction.'
    ]
  },
  {
    id: 'upd-05',
    slug: 'architectural-invariant-4-0-sandboxes',
    title: 'Architectural Invariant 4.0: Mandatory Statutory Sandboxes for Autonomous Weights',
    summary: 'AI Tathastu updates its internal engineering standards, requiring cryptographic proof-of-sandboxing for any weights exceeding 10^24 FLOP training thresholds.',
    category: 'Engineering',
    date: '2026-10-19',
    author: mockAuthors.clara,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    tags: ['Safety Invariants', 'Governance', 'FLOP Thresholds', 'Sandboxing'],
    milestoneMetric: { label: 'Safety Threshold', value: '10^24 FLOPs' },
    relatedLinks: [
      { label: 'Read Zero-Knowledge Audit Architecture', url: '#/engineering' },
      { label: 'Review Editorial Charter', url: '#/about' }
    ],
    content: [
      'As frontier compute clusters surpass critical training thresholds, self-reported evaluation cards are insufficient to guarantee catastrophic safety invariants.',
      'Under Tathastu Architectural Invariant 4.0, all our internal model checkpoints must execute within air-gapped statutory sandboxes with formal circuit attestation before any public release or API endpoint activation.'
    ]
  },
  {
    id: 'upd-06',
    slug: 'ai-tathastu-master-design-specification-1-0',
    title: 'AI Tathastu Publishes Master Design Specification 1.0 for Open Publication',
    summary: 'Announcing the unified design language and architectural experience specification powering the next generation of Tathastu digital publications.',
    category: 'Company',
    date: '2026-11-20',
    author: mockAuthors.aravind,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200',
    tags: ['Design System', 'Typography', 'Company Vision', 'Fraunces', 'Inter'],
    milestoneMetric: { label: 'Specification Version', value: 'v1.0' },
    relatedLinks: [
      { label: 'Explore Publication Ecosystem', url: '#/discover' }
    ],
    content: [
      'Today we are inaugurating the Master UI/UX Design Specification 1.0 for AI Tathastu.',
      'Our mission is to build what comes next and document how it works with unprecedented transparency. By marrying the intellectual depth of academic research with the readability of modern engineering publications, we provide the global community with a reliable, open window into our work.'
    ]
  }
];

