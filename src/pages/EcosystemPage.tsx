import React, { useState, useEffect } from 'react';
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
  Activity,
  AlertCircle,
  Clock,
  Calendar,
  Check,
  Code2,
  Workflow,
  HelpCircle,
  FileText,
  Compass,
  ArrowUpRight
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

  useEffect(() => {
    if (selectedProduct) {
      setActiveTab(selectedProduct.id);
    }
  }, [selectedProduct]);

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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header Banner */}
      <Reveal>
        <div className="border-b border-brand-stone-dark/80 dark:border-dark-border pb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-accent-blue font-semibold">
              Our Products
            </span>
            <span className="text-brand-muted dark:text-dark-muted">•</span>
            <span className="text-xs font-mono text-brand-muted dark:text-dark-muted">
              Live Software &amp; Tools
            </span>
          </div>
          <h1 className="type-hero text-brand-charcoal dark:text-dark-text tracking-tight font-semibold">
            Products &amp; Systems
          </h1>
          <p className="mt-4 text-base sm:text-xl text-brand-muted dark:text-dark-muted max-w-3xl leading-relaxed">
            We document what we build, why we build it, and how each system operates. Explore our four foundational platforms below.
          </p>

          {/* Product Selector Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {products.map((prod) => {
              const isActive = activeTab === prod.id;
              return (
                <button
                  key={prod.id}
                  onClick={() => {
                    setActiveTab(prod.id);
                    onSelectProduct(prod);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-white dark:bg-dark-surface border-foundation-ink dark:border-white shadow-md ring-1 ring-foundation-ink dark:ring-white'
                      : 'bg-foundation-paper dark:bg-dark-elevated border-foundation-border dark:border-dark-border hover:border-foundation-ink/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="p-2 rounded-xl bg-foundation-paper dark:bg-dark-surface border border-foundation-border dark:border-dark-border">
                      {getProductIcon(prod.id)}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold bg-foundation-paper dark:bg-dark-surface text-foundation-secondary dark:text-dark-muted border border-foundation-border dark:border-dark-border">
                      {prod.status || 'Active'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foundation-ink dark:text-dark-text">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] font-mono text-foundation-secondary dark:text-dark-muted truncate mt-0.5">
                      {prod.badge}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* 15-Section Comprehensive Product Deep Dive */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProduct.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
          className="space-y-16"
        >
          {/* SECTION 1: Product Overview & Hero */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md text-xs font-mono uppercase font-semibold bg-surface-lavender text-accent-violet dark:bg-accent-violet/20">
                  {currentProduct.badge}
                </span>
                <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                  Version {currentProduct.version || 'v2.0'}
                </span>
                <span className="text-xs font-mono text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {currentProduct.status || 'Live Platform'}
                </span>
              </div>
              <AnimatedButton
                variant="primary"
                size="sm"
                onClick={() => onShowToast('Documentation Access', `Opening full technical spec for ${currentProduct.name}.`, 'info')}
                icon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Access Platform Documentation
              </AnimatedButton>
            </div>

            <h2 className="type-hero text-foundation-ink dark:text-dark-text font-normal mb-3">
              {currentProduct.name}
            </h2>
            <p className="text-lg sm:text-xl font-medium text-foundation-ink/90 dark:text-dark-text/90 mb-4 leading-snug">
              {currentProduct.tagline}
            </p>
            <p className="type-body text-foundation-secondary dark:text-dark-muted max-w-4xl text-base sm:text-lg leading-relaxed">
              {currentProduct.overview || currentProduct.fullOverview || currentProduct.description}
            </p>

            {/* Architectural Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-brand-stone-dark/60 dark:border-dark-border">
              {currentProduct.stats.map((st, sIdx) => (
                <div key={sIdx} className="p-4 rounded-xl bg-brand-stone/60 dark:bg-dark-elevated border border-brand-stone-dark/60 dark:border-dark-border">
                  <span className="text-xs font-mono text-brand-muted dark:text-dark-muted block">{st.label}</span>
                  <span className="text-sm sm:text-base font-mono font-semibold text-brand-charcoal dark:text-white mt-1 block">{st.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2 & 3: Problem Statement & Why We Started */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border dark:border-dark-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>The Industry Bottleneck We Solved</span>
              </div>
              <h3 className="type-card-heading text-foundation-ink dark:text-dark-text font-medium">
                Problem Statement
              </h3>
              <p className="type-body text-xs sm:text-sm text-foundation-secondary dark:text-dark-muted leading-relaxed">
                {currentProduct.problem || 'Standard market approaches suffer from opaque failure modes, lack of formal verification, and unacceptable latency barriers.'}
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-surface border border-accent-violet/30 dark:border-accent-violet/30 shadow-editorial space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-accent-violet uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Origin &amp; Conviction</span>
              </div>
              <h3 className="type-card-heading text-foundation-ink dark:text-dark-text font-medium">
                Why We Started
              </h3>
              <p className="type-body text-xs sm:text-sm text-foundation-secondary dark:text-dark-muted leading-relaxed">
                {currentProduct.whyWeStarted || 'We observed that theoretical breakthroughs in interpretability and consensus remained locked in academic PDFs instead of powering practical tools.'}
              </p>
            </div>
          </div>

          {/* SECTION 4 & 5: Research Foundations & Our Approach */}
          <div className="p-8 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial space-y-6">
            <div className="border-b border-foundation-border dark:border-dark-border pb-4">
              <span className="type-meta text-accent-violet uppercase tracking-wider font-semibold">
                Theoretical Rigor
              </span>
              <h3 className="type-section-heading text-foundation-ink dark:text-dark-text font-normal mt-1">
                Research Foundations &amp; Architectural Approach
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-foundation-ink dark:text-dark-text font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent-blue" />
                  <span>Formal Research Basis</span>
                </h4>
                <p className="text-xs sm:text-sm text-foundation-secondary dark:text-dark-muted leading-relaxed">
                  {currentProduct.researchBasis || 'Directly derived from peer-reviewed residual stream circuit analysis and verified consensus proofs.'}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-foundation-ink dark:text-dark-text font-semibold mb-2 flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-accent-mint" />
                  <span>Our Systematic Approach</span>
                </h4>
                <p className="text-xs sm:text-sm text-foundation-secondary dark:text-dark-muted leading-relaxed">
                  {currentProduct.ourApproach || 'We enforce stateless functional kernels with deterministic state transition proofs across every user turn.'}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 6: How It Works (Step by Step Pipeline) */}
          {currentProduct.howItWorks && (
            <div>
              <div className="mb-6">
                <span className="type-meta text-accent-violet uppercase tracking-wider font-semibold">
                  Execution Pipeline
                </span>
                <h3 className="type-section-heading text-foundation-ink dark:text-dark-text font-normal mt-1">
                  How It Works
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentProduct.howItWorks.map((st) => (
                  <div key={st.step} className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial flex flex-col justify-between">
                    <div>
                      <span className="w-8 h-8 rounded-xl bg-surface-lavender text-accent-violet dark:bg-accent-violet/20 flex items-center justify-center font-mono font-bold text-xs mb-4">
                        0{st.step}
                      </span>
                      <h4 className="font-semibold text-sm text-foundation-ink dark:text-dark-text mb-2">
                        {st.title}
                      </h4>
                      <p className="text-xs text-foundation-secondary dark:text-dark-muted leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: Core Features & Capabilities */}
          {currentProduct.features && (
            <div>
              <div className="mb-6">
                <span className="type-meta text-accent-violet uppercase tracking-wider font-semibold">
                  Platform Capabilities
                </span>
                <h3 className="type-section-heading text-foundation-ink dark:text-dark-text font-normal mt-1">
                  Core Features
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentProduct.features.map((feat, fIdx) => (
                  <div key={fIdx} className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial flex flex-col justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-softblue text-accent-blue dark:bg-accent-blue/20 font-semibold mb-3 inline-block">
                        {feat.tag}
                      </span>
                      <h4 className="font-semibold text-sm text-foundation-ink dark:text-dark-text mb-2">
                        {feat.title}
                      </h4>
                      <p className="text-xs text-foundation-secondary dark:text-dark-muted leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8 & 9: Architecture & Technology Stack */}
          {currentProduct.architecture && (
            <div className="p-8 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial space-y-8">
              <div>
                <span className="type-meta text-accent-violet uppercase tracking-wider font-semibold">
                  Engineering Blueprint
                </span>
                <h3 className="type-section-heading text-foundation-ink dark:text-dark-text font-normal mt-1">
                  System Architecture &amp; Technology Stack
                </h3>
                <p className="text-xs sm:text-sm text-foundation-secondary dark:text-dark-muted mt-2">
                  {currentProduct.architecture.overview}
                </p>
              </div>

              {/* Topology Summary */}
              <div className="p-4 rounded-xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border dark:border-dark-border font-mono text-xs text-foundation-ink dark:text-dark-text">
                <span className="text-accent-violet font-semibold">Dataflow: </span>
                {currentProduct.architecture.diagramDescription}
              </div>

              {/* Architecture Layers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentProduct.architecture.layers.map((layer, lIdx) => (
                  <div key={lIdx} className="p-5 rounded-2xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border dark:border-dark-border">
                    <span className="text-xs font-mono uppercase tracking-wider text-accent-violet font-semibold block mb-1">
                      {layer.layer}
                    </span>
                    <p className="text-xs text-foundation-secondary dark:text-dark-muted mb-3 leading-snug">
                      {layer.purpose}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {layer.components.map((comp) => (
                        <span key={comp} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border text-foundation-ink dark:text-dark-text">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Technology Stack Tags */}
              {currentProduct.technologyStack && (
                <div className="pt-6 border-t border-foundation-border dark:border-dark-border">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-foundation-secondary dark:text-dark-muted mb-4 font-semibold">
                    Core Technologies
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {currentProduct.technologyStack.map((tech, tIdx) => (
                      <div key={tIdx} className="p-4 rounded-xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border dark:border-dark-border">
                        <span className="text-xs font-mono text-accent-violet font-semibold block mb-2">
                          {tech.category}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {tech.technologies.map((item) => (
                            <span key={item} className="px-2 py-0.5 rounded text-[11px] font-mono bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border text-foundation-ink dark:text-dark-text">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 10 & 11: Challenges & Development Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentProduct.engineeringChallenges && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial space-y-4">
                <span className="type-meta text-accent-terracotta uppercase tracking-wider font-semibold">
                  Engineering Obstacles
                </span>
                <h3 className="type-card-heading text-foundation-ink dark:text-dark-text font-normal">
                  Challenges We Overcame
                </h3>
                <div className="space-y-4">
                  {currentProduct.engineeringChallenges.map((ch, cIdx) => (
                    <div key={cIdx} className="p-4 rounded-xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border dark:border-dark-border space-y-1">
                      <span className="text-xs font-semibold text-foundation-ink dark:text-dark-text block">
                        {ch.challenge}
                      </span>
                      <p className="text-xs text-foundation-secondary dark:text-dark-muted leading-relaxed">
                        ↳ <span className="text-foundation-ink dark:text-dark-text font-medium">Resolution:</span> {ch.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentProduct.developmentTimeline && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial space-y-4">
                <span className="type-meta text-accent-mint uppercase tracking-wider font-semibold">
                  Development Journey
                </span>
                <h3 className="type-card-heading text-foundation-ink dark:text-dark-text font-normal">
                  Historical Milestones
                </h3>
                <div className="space-y-3 relative border-l-2 border-foundation-border dark:border-dark-border ml-3 pl-4">
                  {currentProduct.developmentTimeline.map((tm, tIdx) => (
                    <div key={tIdx} className="relative">
                      <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-accent-mint" />
                      <span className="text-[11px] font-mono text-accent-mint font-semibold block">
                        {tm.date}
                      </span>
                      <h4 className="text-xs font-semibold text-foundation-ink dark:text-dark-text">
                        {tm.milestone}
                      </h4>
                      <p className="text-[11px] text-foundation-secondary dark:text-dark-muted mt-0.5">
                        {tm.impact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 12 & 13: Benefits & Future Roadmap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentProduct.benefits && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial space-y-4">
                <span className="type-meta text-accent-blue uppercase tracking-wider font-semibold">
                  Quantitative Impact
                </span>
                <h3 className="type-card-heading text-foundation-ink dark:text-dark-text font-normal">
                  Verified Benefits
                </h3>
                <div className="space-y-3">
                  {currentProduct.benefits.map((ben, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-3 p-3.5 rounded-xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border dark:border-dark-border">
                      <CheckCircle2 className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-foundation-ink dark:text-dark-text block">
                          {ben.benefit}
                        </span>
                        <span className="text-[11px] font-mono text-accent-blue mt-0.5 block">
                          Audience: {ben.audience}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentProduct.roadmap && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial space-y-4">
                <span className="type-meta text-accent-violet uppercase tracking-wider font-semibold">
                  Forward Trajectory
                </span>
                <h3 className="type-card-heading text-foundation-ink dark:text-dark-text font-normal">
                  Future Roadmap
                </h3>
                <div className="space-y-3">
                  {currentProduct.roadmap.map((rd, rIdx) => (
                    <div key={rIdx} className="p-3.5 rounded-xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border dark:border-dark-border">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-foundation-ink dark:text-dark-text">
                          {rd.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-lavender text-accent-violet dark:bg-accent-violet/20 font-semibold">
                          {rd.target}
                        </span>
                      </div>
                      <span className="text-[11px] text-foundation-secondary dark:text-dark-muted block">
                        Phase: {rd.phase} • Status: {rd.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Grid of All 4 Ecosystem Cards Matrix */}
      <section className="pt-10 border-t border-foundation-border dark:border-dark-border">
        <div className="mb-8">
          <h3 className="type-section-heading text-foundation-ink dark:text-dark-text font-normal">
            Ecosystem Platform Matrix
          </h3>
          <p className="type-secondary text-xs sm:text-sm mt-1">
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
