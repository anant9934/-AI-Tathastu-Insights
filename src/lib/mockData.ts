import { Article, ResearchPaper, EcosystemProduct, MediaItem, EditorialSubmission, Topic, Author } from '../types';

export const mockAuthors: Record<string, Author> = {
  aravind: {
    id: 'aravind-nair',
    name: 'Dr. Aravind Nair',
    role: 'Principal Research Scientist',
    affiliation: 'Frontier Alignment Group, AI Tathastu',
    bio: 'Researches mechanistic interpretability, residual stream geometry, and automated circuit discovery in dense transformer models.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    articlesCount: 14,
    papersCount: 9,
  },
  elena: {
    id: 'elena-rostova',
    name: 'Dr. Elena Rostova',
    role: 'Director of Perceptual AI',
    affiliation: 'Iris Vision & Multimodal Labs',
    bio: 'Specializes in spatial memory grounding, multimodal contrastive representations, and low-latency embodied sensory fusion.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    articlesCount: 11,
    papersCount: 16,
  },
  vikram: {
    id: 'vikram-sharma',
    name: 'Vikram Sharma',
    role: 'Lead Systems Architect',
    affiliation: 'Distributed Swarm Consortium',
    bio: 'Investigates Byzantine fault tolerance in heterogeneous agent swarms, token-efficient consensus protocols, and asynchronous tool arbitration.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    articlesCount: 8,
    papersCount: 6,
  },
  clara: {
    id: 'clara-zheng',
    name: 'Prof. Clara Zheng',
    role: 'Fellow in Computational Governance',
    affiliation: 'Global AI Safety Institute & Tathastu Policy Unit',
    bio: 'Focuses on statutory verification standards for frontier model deployment, automated red-teaming liability, and open-weights risk assessment.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    articlesCount: 12,
    papersCount: 14,
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
    stats: [
      { label: 'Active Students Mentored', value: '14,200+' },
      { label: 'Research Projects Launched', value: '890+' },
      { label: 'Curriculum Mastery Rate', value: '91.4%' },
      { label: 'University Partnerships', value: '48' }
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
    stats: [
      { label: 'Collaborative Lab Sessions', value: '3,800+' },
      { label: 'Synthesized Experiments', value: '18,500' },
      { label: 'Peer Review Turnaround', value: '48 Hours' },
      { label: 'Code Reproducibility Rate', value: '99.2%' }
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
    stats: [
      { label: 'Research Grants Awarded', value: '$2.4M+' },
      { label: 'Fellows Placed', value: '320+' },
      { label: 'Countries Represented', value: '42' },
      { label: 'Sponsoring Institutions', value: '64' }
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
    stats: [
      { label: 'Framerate Inference', value: '60 FPS' },
      { label: 'Spatial Memory Retention', value: '24 Hours' },
      { label: 'Zero-Shot Affordance Precision', value: '92.6%' },
      { label: 'Hardware Deployments', value: '1,200+' }
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
    coverImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800',
    category: 'Interpretability',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800',
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
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
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
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
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
