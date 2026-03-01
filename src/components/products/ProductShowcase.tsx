import React, { useState } from 'react';
import { 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  GitBranch, 
  Box, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Eye,
  Activity
} from 'lucide-react';
import { 
  MentorMazeConsole, 
  CollaborateConsole, 
  AvsarConsole, 
  IrisConsole 
} from './ProductConsoles';
import { EcosystemProduct } from '../../types';
import { NavTab } from '../layout/Navbar';
import { AnimatedButton } from '../motion/AnimatedButton';
import { Reveal } from '../motion/Reveal';

interface ProductShowcaseProps {
  products: EcosystemProduct[];
  onExplore: (product: EcosystemProduct) => void;
  onNavigate: (tab: NavTab) => void;
}

export const ProductHeroStage: React.FC<{
  onExploreProduct: (productId: string) => void;
}> = ({ onExploreProduct }) => {
  const [selectedSystem, setSelectedSystem] = useState<'collaborate' | 'mentormaze' | 'avsar' | 'iris'>('collaborate');

  const systems = [
    {
      id: 'collaborate',
      tag: '01 / Distributed Systems',
      name: 'Collaborate',
      headline: 'Multi-Agent Consensus Runtime [Prototype]',
      problem: 'Autonomous agents fail from uncoordinated state drift across concurrent tool calls. Collaborate proposes Aegis-BFT Byzantine consensus in Rust.',
      stack: 'Rust Spec • Aegis-BFT • eBPF • 64-Node Mesh Sim',
      invariant: 'Target Quorum Bound: < 200ms (Design Spec)',
    },
    {
      id: 'mentormaze',
      tag: '02 / Research Pedagogy',
      name: 'MentorMaze',
      headline: 'Socratic Prerequisite & Kernel Debugger [Prototype]',
      problem: 'Advanced ML literature has steep mathematical lattices. Students get stuck on CUDA memory strides and GPU concurrency without Socratic feedback.',
      stack: 'Python 3.12 • Triton 3.0 • gVisor • Neo4j DAG',
      invariant: 'Socratic Kernel Feedback (Interactive Prototype)',
    },
    {
      id: 'avsar',
      tag: '03 / Research Infrastructure',
      name: 'Avsar',
      headline: 'Automated Compute Grant Engine [Prototype]',
      problem: 'Academic grant committees take 9 months to evaluate proposals. Avsar evaluates benchmark reproductions automatically in hours and grants compute credits.',
      stack: 'PyTorch • Automated Harness • Cloud GPU Clusters',
      invariant: 'Automated Audit Verification < 24h (Target)',
    },
    {
      id: 'iris',
      tag: '04 / Embodied Robotics',
      name: 'Iris',
      headline: 'Real-Time 3D Spatial Occupancy System [Prototype]',
      problem: '2D vision models forget physical objects the moment they are occluded. Iris maintains an egocentric 3D voxel tensor memory targeting real-time edge robotics.',
      stack: 'CUDA 12 • 3D Voxel Tensor • Jetson Orin AGX (Target)',
      invariant: 'Target: 80+ FPS on Edge Silicon (Design Goal)',
    },
  ];

  const currentSystem = systems.find((s) => s.id === selectedSystem) || systems[0];

  return (
    <div className="w-full bg-brand-surface dark:bg-dark-surface rounded-3xl border border-brand-stone-dark/80 dark:border-dark-border p-6 sm:p-8 lg:p-10 shadow-editorial">
      {/* System Selection Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pb-6 mb-8 border-b border-brand-stone-dark/60 dark:border-dark-border">
        {systems.map((sys) => {
          const isSelected = selectedSystem === sys.id;
          return (
            <button
              key={sys.id}
              onClick={() => setSelectedSystem(sys.id as any)}
              className={`p-3.5 rounded-xl text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal shadow-sm'
                  : 'bg-brand-stone/60 dark:bg-dark-elevated text-brand-muted hover:text-brand-charcoal dark:hover:text-white'
              }`}
            >
              <span className="block text-[11px] font-mono opacity-60 mb-1">{sys.tag}</span>
              <span className="block text-sm font-semibold truncate">{sys.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Split Console & Editorial Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Verified Technical Dossier */}
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-brand-muted dark:text-dark-muted">
            <span className="w-2 h-2 rounded-full bg-accent-blue" />
            <span>{currentSystem.tag}</span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-brand-charcoal dark:text-dark-text tracking-tight">
              {currentSystem.name}
            </h3>
            <p className="text-sm font-mono text-accent-blue dark:text-accent-softblue mt-1">
              {currentSystem.headline}
            </p>
          </div>

          <div className="space-y-3 text-sm text-brand-muted dark:text-dark-muted leading-relaxed">
            <p className="font-normal">
              {currentSystem.problem}
            </p>
          </div>

          <div className="pt-4 border-t border-brand-stone-dark/60 dark:border-dark-border space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-brand-muted dark:text-dark-muted">
              <span>Architecture Stack:</span>
              <span className="text-brand-charcoal dark:text-white font-medium">{currentSystem.stack}</span>
            </div>
            <div className="flex items-center justify-between text-brand-muted dark:text-dark-muted">
              <span>Specification Target:</span>
              <span className="text-accent-blue dark:text-accent-softblue font-semibold">{currentSystem.invariant}</span>
            </div>
          </div>

          <div className="pt-3">
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={() => onExploreProduct(currentSystem.id)}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Examine full architecture specifications
            </AnimatedButton>
          </div>
        </div>

        {/* Right: Authentic Live System Console */}
        <div className="lg:col-span-7">
          {selectedSystem === 'collaborate' && <CollaborateConsole />}
          {selectedSystem === 'mentormaze' && <MentorMazeConsole />}
          {selectedSystem === 'avsar' && <AvsarConsole />}
          {selectedSystem === 'iris' && <IrisConsole />}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   ARCHITECTURAL PRODUCT LEDGER (SECTION 4 REPLACEMENT)
   Replaces the 4 generic rounded cards with distinct, deep-dive chapters
   ========================================================================= */
export const ProductLedger: React.FC<ProductShowcaseProps> = ({
  products,
  onExplore,
  onNavigate,
}) => {
  const getProductConsole = (id: string) => {
    switch (id) {
      case 'mentormaze':
        return <MentorMazeConsole />;
      case 'collaborate':
        return <CollaborateConsole />;
      case 'avsar':
        return <AvsarConsole />;
      case 'iris':
        return <IrisConsole />;
      default:
        return <CollaborateConsole />;
    }
  };

  const getSystemMetadata = (id: string) => {
    switch (id) {
      case 'mentormaze':
        return {
          systemId: 'SYS_01 // MENTORMAZE',
          category: 'Cognitive Research Pedagogy',
          focus: 'Adaptive Prerequisite Diagnosis & Socratic Kernel Debugging [Interactive UI Prototype]',
          barrier: 'Advanced machine learning preprints move faster than university curricula. Independent students face steep prerequisite lattices in formal tensor math and CUDA GPU concurrency, hitting roadblocks without continuous Socratic debugging.',
          solution: 'MentorMaze treats learning as interactive system debugging. The interactive prototype designs a learning interface for intentionally broken Triton CUDA kernels and formal Lean 4 lemmas, while modeling how an isolated gVisor sandbox can profile memory strides and verify mathematical invariants.',
          highlights: [
            'Interactive Triton/CUDA kernel debugger interface (UI Prototype)',
            'Automated prerequisite DAG mapping concept across ML literature',
            'Planned cycle-accurate memory profiler in isolated gVisor containers',
            'Socratic guidance interface resolving compiler error cascades'
          ]
        };
      case 'collaborate':
        return {
          systemId: 'SYS_02 // COLLABORATE',
          category: 'Distributed Agent Systems',
          focus: 'Aegis-BFT Consensus Engine for Multi-Agent Swarms [Architecture Prototype]',
          barrier: 'Autonomous agents fail not on single turns, but on uncoordinated state drift across concurrent tool calls. When multiple agents generate code and run benchmarks concurrently, race conditions corrupt shared Git branches and research conclusions.',
          solution: 'Collaborate explores Aegis-BFT, an asynchronous Byzantine consensus protocol in Rust. Under the protocol specification, every proposed code patch, benchmark assert, and environment update must reach quorum before being linearized to the master ledger.',
          highlights: [
            'Asynchronous 2f + 1 Byzantine consensus protocol specification',
            'Target quorum commitment bound < 200ms across 64 nodes (Design Goal)',
            'Cryptographic Ed25519 signature verification model on state transitions',
            'Proposed eBPF syscall auditing architecture to prevent state drift'
          ]
        };
      case 'avsar':
        return {
          systemId: 'SYS_03 // AVSAR',
          category: 'Open Research Infrastructure',
          focus: 'Automated Preprint Benchmark Reproduction & Compute Micro-Grants [Pipeline Prototype]',
          barrier: 'Traditional research grants are monopolized by legacy institutional committees requiring 9-month proposal cycles. Independent open-source contributors who actually reproduce and verify frontier papers lack access to high-end compute clusters.',
          solution: 'Avsar explores connecting compute grants directly to automated benchmark reproduction. The proposed pipeline aims to evaluate candidate preprint reproductions automatically on cloud GPU clusters and grant compute credits directly.',
          highlights: [
            'Automated reproduction pipeline specification for arXiv preprints',
            'Target containerized execution architecture on cloud GPU clusters (H100)',
            'Direct tokenized compute micro-grant allocation model',
            'Proposed public cryptographic audit trail for reproducibility verification'
          ]
        };
      case 'iris':
        return {
          systemId: 'SYS_04 // IRIS',
          category: 'Embodied Perception & Robotics',
          focus: 'Continuous Egocentric 3D Voxel Memory for Edge Hardware [Sensory HUD Prototype]',
          barrier: 'Standard 2D vision models process disconnected video frames, immediately forgetting physical objects when occluded. Real-world robotics requires persistent 3D spatial permanence that continues to track objects when out of line-of-sight.',
          solution: 'Iris constructs a continuous 3D spatial occupancy grid maintained directly in an egocentric voxel memory tensor. Designed to target 80+ FPS on embedded silicon (Jetson Orin AGX), the architecture enables robot manipulators to reach behind visual barriers with verified spatial permanence.',
          highlights: [
            'Continuous 3D voxel occupancy tensor memory model',
            'Target throughput: 80+ FPS on embedded silicon (Jetson Orin AGX)',
            'True object permanence tracking concept across total pixel occlusion',
            'Sub-15ms edge sensor-to-action latency design bound'
          ]
        };
      default:
        return {
          systemId: 'SYS_00 // SYSTEM',
          category: 'Systems',
          focus: 'Applied Systems Architecture',
          barrier: 'Engineering bottlenecks in artificial intelligence.',
          solution: 'Open verifiable systems software.',
          highlights: []
        };
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {products.map((product, index) => {
        const meta = getSystemMetadata(product.id);
        const isReversed = index % 2 === 1;

        return (
          <Reveal key={product.id}>
            <div className="border-t border-brand-stone-dark/80 dark:border-dark-border pt-12 sm:pt-16">
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                isReversed ? 'lg:flex-row-reverse' : ''
              }`}>
                {/* Product Console / UI Viewport */}
                <div className={`lg:col-span-7 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  {getProductConsole(product.id)}
                </div>

                {/* Verified Technical Narrative */}
                <div className={`lg:col-span-5 space-y-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-semibold text-accent-blue dark:text-accent-softblue block">
                      {meta.systemId}
                    </span>
                    <h3 className="type-section-heading text-brand-charcoal dark:text-dark-text font-semibold">
                      {product.name}
                    </h3>
                    <p className="text-xs font-mono text-brand-muted dark:text-dark-muted">
                      {meta.focus}
                    </p>
                  </div>

                  {/* Plainspoken Problem & Solution */}
                  <div className="space-y-4 text-sm sm:text-base text-brand-muted dark:text-dark-muted leading-relaxed">
                    <div>
                      <strong className="text-brand-charcoal dark:text-white font-medium block text-xs font-mono uppercase tracking-wider mb-1">
                        The Technical Barrier:
                      </strong>
                      <p className="text-xs sm:text-sm font-normal">
                        {meta.barrier}
                      </p>
                    </div>

                    <div>
                      <strong className="text-brand-charcoal dark:text-white font-medium block text-xs font-mono uppercase tracking-wider mb-1">
                        Our Architecture &amp; Development:
                      </strong>
                      <p className="text-xs sm:text-sm font-normal">
                        {meta.solution}
                      </p>
                    </div>
                  </div>

                  {/* Concrete Capabilities Checklist */}
                  <div className="space-y-2 pt-2 border-t border-brand-stone-dark/60 dark:border-dark-border">
                    {meta.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2.5 text-xs text-brand-charcoal dark:text-dark-text">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-blue dark:text-accent-softblue shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center gap-3">
                    <AnimatedButton
                      variant="primary"
                      size="sm"
                      onClick={() => onExplore(product)}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Examine {product.name} specs
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
};
