import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  GraduationCap, 
  Users, 
  Award, 
  Eye, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  Cpu, 
  ShieldCheck,
  Terminal,
  ArrowDownRight,
  GitBranch,
  Activity,
  AlertCircle
} from 'lucide-react';
import { EcosystemProduct } from '../types';
import { EcosystemCard } from '../components/cards/EcosystemCard';
import { Badge } from '../components/ui/Badge';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { Reveal } from '../components/motion/Reveal';
import { EDITORIAL_EASE, MOTION_DURATIONS } from '../lib/motion';

interface EcosystemPageProps {
  products: EcosystemProduct[];
  selectedProduct?: EcosystemProduct | null;
  onSelectProduct: (product: EcosystemProduct) => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const EcosystemPage: React.FC<EcosystemPageProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedProduct ? selectedProduct.id : 'mentormaze');
  const shouldReduceMotion = useReducedMotion();

  const currentProduct = products.find((p) => p.id === activeTab) || products[0];

  const getProductIcon = (id: string) => {
    switch (id) {
      case 'mentormaze':
        return <GraduationCap className="w-5 h-5 text-accent-violet" />;
      case 'collaborate':
        return <Users className="w-5 h-5 text-accent-blue" />;
      case 'avsar':
        return <Award className="w-5 h-5 text-accent-terracotta" />;
      case 'iris':
        return <Eye className="w-5 h-5 text-accent-mint" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  // Structured problem statements addressed by each platform (Section 4.D)
  const productProblemStatements: Record<string, { problem: string; resolution: string }> = {
    mentormaze: {
      problem: 'Advanced ML research literature has steep prerequisite lattices; traditional textbooks lag 3 years behind frontier preprints, leaving students stranded on complex formal proofs.',
      resolution: 'Synthesizes individualized Socratic learning graphs that diagnose missing prerequisites across tensor calculus, CUDA kernels, and mechanistic interpretability.'
    },
    collaborate: {
      problem: 'Distributed research teams and multi-agent synthesis loops suffer from non-deterministic reasoning drift, Byzantine node hallucinations, and unverified data leaks.',
      resolution: 'Deploys the Aegis-BFT consensus protocol to coordinate heterogeneous agents under sub-200ms turn latencies with cryptographic assertion hashes.'
    },
    avsar: {
      problem: 'Traditional university credentialing filters out talented non-traditional developers and self-directed researchers in emerging economies despite significant open-source contributions.',
      resolution: 'Calculates objective proof-of-contribution scores based on verified GitHub commits, reproducible arXiv code harnesses, and automated benchmark milestones.'
    },
    iris: {
      problem: 'Standard vision-language-action foundation models are frame-ephemeral; the moment an object leaves optical sensor view, spatial state and physical affordances are forgotten.',
      resolution: 'Maintains an egocentric 3D voxel-semantic neural memory that retains spatial permanence across 24 hours of occlusion and camera movement at 60 FPS.'
    }
  };

  const activeProblem = productProblemStatements[currentProduct.id] || productProblemStatements.mentormaze;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <Reveal>
        <div className="max-w-3xl">
          <span className="type-meta text-accent-violet block uppercase mb-2">
            Applied Systems Infrastructure
          </span>
          <h1 className="type-page-headline text-foundation-ink dark:text-dark-ink font-normal">
            The AI Tathastu Ecosystem
          </h1>
          <p className="type-body text-foundation-secondary dark:text-dark-secondary mt-3 leading-relaxed">
            Four specialized platforms transforming theoretical breakthrough research into open community infrastructure—spanning personalized mentorship, collaborative peer synthesis, meritocratic grants, and embodied perception.
          </p>
        </div>
      </Reveal>

      {/* Interactive Platform Relationship Architecture Diagram (Section 4.D) */}
      <Reveal>
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="type-meta text-foundation-secondary uppercase">
                Interconnected Research Lifecycle
              </span>
              <h3 className="type-card-heading text-foundation-ink dark:text-dark-ink font-medium mt-1">
                How AI Tathastu Platforms Interlock
              </h3>
            </div>
            <span className="type-meta px-2.5 py-1 rounded bg-foundation-paper dark:bg-dark-elevated text-foundation-secondary">
              Synchronized Node Mesh
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1: MentorMaze */}
            <div 
              onClick={() => setActiveTab('mentormaze')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeTab === 'mentormaze'
                  ? 'bg-accent-lavender/40 border-accent-violet dark:bg-accent-violet/20'
                  : 'bg-foundation-paper dark:bg-dark-elevated border-foundation-border/70 dark:border-dark-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-accent-violet text-white text-[11px] font-mono flex items-center justify-center font-bold">1</span>
                <span className="text-[11px] font-mono text-accent-violet font-semibold">TALENT ACCELERATION</span>
              </div>
              <h4 className="text-sm font-semibold text-foundation-ink dark:text-dark-ink">MentorMaze</h4>
              <p className="text-xs text-foundation-secondary mt-1">Identifies prerequisite gaps &amp; trains researchers.</p>
            </div>

            {/* Step 2: Avsar */}
            <div 
              onClick={() => setActiveTab('avsar')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeTab === 'avsar'
                  ? 'bg-accent-peach/50 border-accent-terracotta dark:bg-accent-terracotta/20'
                  : 'bg-foundation-paper dark:bg-dark-elevated border-foundation-border/70 dark:border-dark-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-accent-terracotta text-white text-[11px] font-mono flex items-center justify-center font-bold">2</span>
                <span className="text-[11px] font-mono text-accent-terracotta font-semibold">GRANTS &amp; FELLOWSHIPS</span>
              </div>
              <h4 className="text-sm font-semibold text-foundation-ink dark:text-dark-ink">Avsar</h4>
              <p className="text-xs text-foundation-secondary mt-1">Verifies code contributions &amp; funds research fellows.</p>
            </div>

            {/* Step 3: Collaborate */}
            <div 
              onClick={() => setActiveTab('collaborate')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeTab === 'collaborate'
                  ? 'bg-accent-softblue/50 border-accent-blue dark:bg-accent-blue/20'
                  : 'bg-foundation-paper dark:bg-dark-elevated border-foundation-border/70 dark:border-dark-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-accent-blue text-white text-[11px] font-mono flex items-center justify-center font-bold">3</span>
                <span className="text-[11px] font-mono text-accent-blue font-semibold">MULTI-AGENT LAB</span>
              </div>
              <h4 className="text-sm font-semibold text-foundation-ink dark:text-dark-ink">Collaborate</h4>
              <p className="text-xs text-foundation-secondary mt-1">Coordinates distributed agent swarms &amp; peer review.</p>
            </div>

            {/* Step 4: Iris */}
            <div 
              onClick={() => setActiveTab('iris')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeTab === 'iris'
                  ? 'bg-accent-softmint/50 border-accent-mint dark:bg-accent-mint/20'
                  : 'bg-foundation-paper dark:bg-dark-elevated border-foundation-border/70 dark:border-dark-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-accent-mint text-white text-[11px] font-mono flex items-center justify-center font-bold">4</span>
                <span className="text-[11px] font-mono text-accent-mint font-semibold">EMBODIED DEPLOYMENT</span>
              </div>
              <h4 className="text-sm font-semibold text-foundation-ink dark:text-dark-ink">Iris</h4>
              <p className="text-xs text-foundation-secondary mt-1">Grounds perception into persistent 3D spatial vision.</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Product Selector Tabs */}
      <div className="border-b border-foundation-border dark:border-dark-border">
        <div className="flex gap-2 sm:gap-6 overflow-x-auto pb-px">
          {products.map((product) => {
            const isActive = activeTab === product.id;
            return (
              <button
                key={product.id}
                onClick={() => setActiveTab(product.id)}
                className={`relative pb-4 px-3 sm:px-4 flex items-center gap-2.5 text-sm sm:text-base font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-foundation-ink dark:text-dark-ink'
                    : 'text-foundation-secondary hover:text-foundation-ink dark:hover:text-dark-ink'
                }`}
              >
                <span>{getProductIcon(product.id)}</span>
                <span>{product.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="ecosystem-tab-active-line"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-accent-violet rounded-full"
                    transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Product Deep Dive View with Distinct Identity */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProduct.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: MOTION_DURATIONS.cardTransition, ease: EDITORIAL_EASE }}
          className="space-y-10"
        >
          {/* Main Hero Card for Active Product */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <Badge accent={currentProduct.accentColor} size="sm">
                  {currentProduct.badge}
                </Badge>
                <span className="type-meta text-foundation-secondary">
                  Open Source Platform Node
                </span>
              </div>

              <h2 className="type-page-headline text-foundation-ink dark:text-dark-ink font-normal">
                {currentProduct.name}
              </h2>

              <p className="text-base sm:text-lg font-medium text-accent-violet dark:text-accent-lavender">
                {currentProduct.tagline}
              </p>

              <p className="type-body text-foundation-secondary dark:text-dark-secondary leading-relaxed">
                {currentProduct.fullOverview}
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <AnimatedButton
                  variant="primary"
                  size="md"
                  onClick={() =>
                    onShowToast(
                      `Connected to ${currentProduct.name}`,
                      'Live cluster node initialized with verified checkpoints.',
                      'success'
                    )
                  }
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Launch {currentProduct.name} Sandbox
                </AnimatedButton>

                <AnimatedButton
                  variant="outline"
                  size="md"
                  onClick={() =>
                    onShowToast(
                      'API Specifications',
                      `Downloaded technical interface docs for ${currentProduct.name}.`,
                      'info'
                    )
                  }
                  icon={<Terminal className="w-3.5 h-3.5" />}
                  iconPosition="left"
                >
                  View Architecture API
                </AnimatedButton>
              </div>
            </div>

            {/* Live Product Telemetry Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {currentProduct.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border/60 dark:border-dark-border"
                >
                  <span className="type-meta text-foundation-secondary block mb-1">
                    {stat.label}
                  </span>
                  <span className="text-2xl font-mono font-bold text-foundation-ink dark:text-dark-ink">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Problem vs Resolution Architecture Box (Section 4.D) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border dark:border-dark-border space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-red-600 dark:text-red-400 uppercase">
                <AlertCircle className="w-4 h-4" />
                <span>The Research Bottleneck It Solves</span>
              </div>
              <p className="type-body text-xs sm:text-sm text-foundation-ink/90 dark:text-dark-ink/90 leading-relaxed">
                {activeProblem.problem}
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-dark-surface border border-accent-violet/30 shadow-editorial space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-accent-violet uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>The Architectural Resolution</span>
              </div>
              <p className="type-body text-xs sm:text-sm text-foundation-ink/90 dark:text-dark-ink/90 leading-relaxed">
                {activeProblem.resolution}
              </p>
            </div>
          </div>

          {/* Core Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentProduct.coreCapabilities.map((cap, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-lg bg-accent-lavender text-accent-violet dark:bg-accent-violet/20 flex items-center justify-center font-mono text-xs font-bold">
                      0{index + 1}
                    </span>
                    {cap.metric && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-foundation-paper dark:bg-dark-elevated text-foundation-ink dark:text-dark-ink">
                        {cap.metric}
                      </span>
                    )}
                  </div>
                  <h3 className="type-card-heading text-foundation-ink dark:text-dark-ink font-medium">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-foundation-secondary dark:text-dark-secondary leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Architectural Invariants Checklist */}
          <div className="p-6 sm:p-8 rounded-2xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border dark:border-dark-border">
            <h3 className="type-meta text-foundation-ink dark:text-dark-ink font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent-violet" />
              <span>Technical Invariants &amp; Interface Standards</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentProduct.architecturePoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-foundation-ink/90 dark:text-dark-ink/90 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Grid of All 4 Ecosystem Cards */}
      <section className="pt-10 border-t border-foundation-border dark:border-dark-border">
        <div className="mb-8">
          <h3 className="type-section-heading text-foundation-ink dark:text-dark-ink font-normal">
            Ecosystem Platform Matrix
          </h3>
          <p className="type-secondary text-xs mt-1">
            Compare capabilities and access endpoints across the four foundational systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <EcosystemCard
              key={prod.id}
              product={prod}
              onExplore={(p) => setActiveTab(p.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
