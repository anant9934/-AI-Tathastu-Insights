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
  Terminal
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
        return <GraduationCap className="w-5 h-5" />;
      case 'collaborate':
        return <Users className="w-5 h-5" />;
      case 'avsar':
        return <Award className="w-5 h-5" />;
      case 'iris':
        return <Eye className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <Reveal>
        <div className="max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-widest text-accent-violet block mb-2">
            Applied Infrastructure
          </span>
          <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
            The AI Tathastu Ecosystem
          </h1>
          <p className="mt-4 text-base sm:text-lg text-foundation-muted dark:text-dark-muted leading-relaxed">
            Four specialized platforms transforming theoretical breakthrough research into open community infrastructure—spanning personalized mentorship, collaborative peer synthesis, meritocratic grants, and embodied perception.
          </p>
        </div>
      </Reveal>

      {/* Product Selector Tabs (Phase 4.E item 5: Smooth navigation indicators) */}
      <div className="border-b border-foundation-charcoal/10 dark:border-dark-border">
        <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-px">
          {products.map((product) => {
            const isActive = activeTab === product.id;
            return (
              <button
                key={product.id}
                onClick={() => setActiveTab(product.id)}
                className={`relative pb-4 px-3 sm:px-5 flex items-center gap-2.5 text-sm sm:text-base font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-foundation-charcoal dark:text-dark-text'
                    : 'text-foundation-muted hover:text-foundation-charcoal dark:text-dark-muted dark:hover:text-dark-text'
                }`}
              >
                <span className={isActive ? 'text-accent-violet' : 'text-foundation-muted'}>
                  {getProductIcon(product.id)}
                </span>
                <span>{product.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="ecosystem-tab-active"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-accent-violet rounded-full"
                    transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Product Deep Dive View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProduct.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: MOTION_DURATIONS.cardTransition, ease: EDITORIAL_EASE }}
          className="space-y-12"
        >
          {/* Main Hero Card for Active Product */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <Badge accent={currentProduct.accentColor} size="sm">
                  {currentProduct.badge}
                </Badge>
                <span className="text-xs font-mono text-foundation-muted dark:text-dark-muted">
                  Open Source Platform
                </span>
              </div>

              <h2 className="font-editorial-serif text-3xl sm:text-5xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
                {currentProduct.name}
              </h2>

              <p className="text-lg font-medium text-accent-violet dark:text-accent-lavender">
                {currentProduct.tagline}
              </p>

              <p className="text-sm sm:text-base text-foundation-muted dark:text-dark-muted leading-relaxed">
                {currentProduct.fullOverview}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <AnimatedButton
                  variant="primary"
                  size="md"
                  onClick={() =>
                    onShowToast(
                      `Launched ${currentProduct.name} Sandbox`,
                      'Connecting to the Tathastu node cluster...',
                      'success'
                    )
                  }
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Launch {currentProduct.name} Node
                </AnimatedButton>

                <AnimatedButton
                  variant="outline"
                  size="md"
                  onClick={() =>
                    onShowToast(
                      'Documentation Downloaded',
                      `System architecture specs for ${currentProduct.name} saved.`,
                      'info'
                    )
                  }
                  icon={<Terminal className="w-3.5 h-3.5" />}
                  iconPosition="left"
                >
                  View API Specs
                </AnimatedButton>
              </div>
            </div>

            {/* Live Product Metrics Grid (Phase 4.E item 4) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {currentProduct.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-foundation-ivory dark:bg-dark-elevated border border-foundation-charcoal/5 dark:border-dark-border"
                >
                  <span className="text-xs font-mono text-foundation-muted dark:text-dark-muted block mb-1">
                    {stat.label}
                  </span>
                  <span className="text-2xl font-mono font-bold text-foundation-charcoal dark:text-dark-text">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Capabilities & Architecture Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentProduct.coreCapabilities.map((cap, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-lg bg-accent-lavender/40 dark:bg-accent-violet/20 text-accent-violet flex items-center justify-center font-mono text-xs font-bold">
                      0{index + 1}
                    </span>
                    {cap.metric && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-foundation-ivory dark:bg-dark-elevated text-foundation-charcoal dark:text-dark-text">
                        {cap.metric}
                      </span>
                    )}
                  </div>
                  <h3 className="font-editorial-serif text-2xl text-foundation-charcoal dark:text-dark-text tracking-tight font-medium">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-foundation-muted dark:text-dark-muted leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Architecture Checklist */}
          <div className="p-6 sm:p-8 rounded-2xl bg-foundation-ivory dark:bg-dark-elevated border border-foundation-charcoal/10 dark:border-dark-border">
            <h3 className="text-sm font-mono uppercase tracking-wider text-foundation-charcoal dark:text-dark-text font-semibold mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent-violet" />
              <span>Technical Architecture &amp; Integration Invariants</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentProduct.architecturePoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-foundation-charcoal/90 dark:text-dark-text/90">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Grid of All 4 Ecosystem Cards */}
      <section className="pt-12 border-t border-foundation-charcoal/10 dark:border-dark-border">
        <div className="mb-8">
          <h3 className="font-editorial-serif text-3xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
            Ecosystem Overview Matrix
          </h3>
          <p className="text-xs text-foundation-muted dark:text-dark-muted mt-1">
            Compare capabilities across the 4 foundational initiatives.
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
