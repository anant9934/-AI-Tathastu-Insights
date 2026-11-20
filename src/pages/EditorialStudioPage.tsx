import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  PenTool, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  SlidersHorizontal, 
  Plus, 
  Save, 
  Sparkles, 
  Eye, 
  ShieldAlert, 
  Users, 
  BarChart3,
  Check,
  ChevronRight,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EditorialSubmission } from '../types';
import { AnimatedCounter } from '../components/motion/AnimatedCounter';
import { AnimatedChart } from '../components/motion/AnimatedChart';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { MotionModal } from '../components/motion/MotionModal';
import { Badge } from '../components/ui/Badge';
import { Reveal } from '../components/motion/Reveal';
import { EDITORIAL_EASE, MOTION_DURATIONS } from '../lib/motion';

interface EditorialStudioPageProps {
  submissions: EditorialSubmission[];
  onShowToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const EditorialStudioPage: React.FC<EditorialStudioPageProps> = ({
  submissions: initialSubmissions,
  onShowToast,
}) => {
  const [submissions, setSubmissions] = useState<EditorialSubmission[]>(initialSubmissions);
  const [activeTab, setActiveTab] = useState<'queue' | 'editor' | 'reviewers' | 'guidelines'>('queue');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [autosaveSeconds, setAutosaveSeconds] = useState(3);
  const shouldReduceMotion = useReducedMotion();

  // Draft Editor State
  const [draftTitle, setDraftTitle] = useState('Topological Features of Attention Heads in Formal Proof Search');
  const [draftCategory, setDraftCategory] = useState('Frontier Systems');
  const [draftContent, setDraftContent] = useState(
    'We observe that attention heads in foundation models trained on Lean 4 mathematical corpora exhibit distinct topological persistence characteristics during backtrack search. By mapping attention weights into simplicial complexes, we prove that formal reasoning success correlates with the emergence of low-dimensional Betti numbers across residual layers 12 through 24.'
  );
  const [contentBlocks, setContentBlocks] = useState<string[]>([
    'Figure 1: Persistent homology barcodes across 500 proof generation trials.',
    'Hypothesis 1: Circuit pruning preserves 98.4% of theorem validation accuracy.',
  ]);

  // Form submission state for modal
  const [modalTitle, setModalTitle] = useState('');
  const [modalAuthor, setModalAuthor] = useState('');
  const [modalAffiliation, setModalAffiliation] = useState('');
  const [modalCategory, setModalCategory] = useState('Frontier Systems');
  const [modalAbstract, setModalAbstract] = useState('');

  // Autosave simulation timer (Phase 4.G item 5: Autosave status transitions)
  useEffect(() => {
    const timer = setInterval(() => {
      setAutosaveSeconds((prev) => (prev > 1 ? prev - 1 : 12));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const wordCount = draftContent.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadTime = Math.ceil(wordCount / 200);

  const handleCreateSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle || !modalAuthor) {
      onShowToast('Validation Error', 'Please complete title and author details.', 'info');
      return;
    }

    const newSub: EditorialSubmission = {
      id: `sub-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: modalTitle,
      authorName: modalAuthor,
      authorAffiliation: modalAffiliation || 'Independent Laboratory',
      category: modalCategory,
      status: 'in_review',
      submittedAt: new Date().toISOString().split('T')[0],
      wordCount: 4200,
      reviewerScore: 8.5,
      assignedEditor: 'Dr. Aravind Nair',
      abstract: modalAbstract || 'Manuscript submitted for double-blind verification.',
    };

    setSubmissions([newSub, ...submissions]);
    setIsSubmitModalOpen(false);

    // Confetti celebration (Phase 4.G item 8: Clear loading and success feedback)
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#8055D9', '#DCEBFA', '#DDF1E7', '#22231F'],
    });

    onShowToast('Manuscript Deposited', `Assigned ID ${newSub.id}. Entered peer review pipeline.`, 'success');

    // Reset modal form
    setModalTitle('');
    setModalAuthor('');
    setModalAffiliation('');
    setModalAbstract('');
  };

  const handleUpdateStatus = (id: string, newStatus: EditorialSubmission['status']) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
    );
    onShowToast('Editorial State Updated', `Submission ${id} marked as ${newStatus}.`, 'info');
  };

  // Add a content block to the editor (Phase 4.G item 4: Content block feedback)
  const handleAddBlock = () => {
    const blockTypes = [
      'Empirical Lemma: Gradient norm bounded by epsilon = 0.04 across all attention heads.',
      'Table 2.1: Ablation benchmark across 64-GPU distributed cluster.',
      'Code Verification: Lean 4 formal specification passed in 140ms.',
    ];
    const randomBlock = blockTypes[Math.floor(Math.random() * blockTypes.length)];
    setContentBlocks([...contentBlocks, randomBlock]);
    onShowToast('Block Inserted', 'Added structural research artifact to draft.', 'success');
  };

  // Chart data for Editorial Review Turnaround
  const reviewPerformanceChart = {
    title: 'Editorial Peer-Review Latency (Days to First Decision)',
    subtitle: 'Strict double-blind computational review vs conventional academic journals.',
    xAxisLabel: 'Journal Volume',
    yAxisLabel: 'Turnaround Days',
    points: [
      { label: 'Vol 1 (2024)', value: 14.2, baseline: 84.0 },
      { label: 'Vol 2 (2025)', value: 11.5, baseline: 84.0 },
      { label: 'Vol 3 (2025)', value: 7.8, baseline: 84.0 },
      { label: 'Vol 4 (2026)', value: 4.6, baseline: 84.0 },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Studio Header */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-foundation-charcoal/10 dark:border-dark-border pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-accent-violet">
                Publisher Console
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Editorial Board Active
              </span>
            </div>
            <h1 className="font-editorial-serif text-4xl sm:text-5xl lg:text-6xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
              Editorial Studio
            </h1>
            <p className="mt-2 text-sm sm:text-base text-foundation-muted dark:text-dark-muted max-w-2xl leading-relaxed">
              Manage the peer review pipeline, verify computational reproducibility of submissions, and compose verified frontier dispatches.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AnimatedButton
              variant="primary"
              size="md"
              onClick={() => setIsSubmitModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Deposit New Manuscript
            </AnimatedButton>
          </div>
        </div>

        {/* 2. Dashboard Number Count-Up On First View (Phase 4.G item 2) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="p-5 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial">
            <span className="text-xs font-mono text-foundation-muted dark:text-dark-muted block mb-1">
              Active Pipeline
            </span>
            <span className="text-3xl font-mono font-bold text-foundation-charcoal dark:text-dark-text block">
              <AnimatedCounter to={submissions.length} />
            </span>
            <span className="text-[11px] text-foundation-muted mt-1 block">
              4 under peer audit
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial">
            <span className="text-xs font-mono text-foundation-muted dark:text-dark-muted block mb-1">
              Acceptance Rate
            </span>
            <span className="text-3xl font-mono font-bold text-accent-violet block">
              <AnimatedCounter to={18.4} decimals={1} suffix="%" />
            </span>
            <span className="text-[11px] text-foundation-muted mt-1 block">
              Strict empirical threshold
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial">
            <span className="text-xs font-mono text-foundation-muted dark:text-dark-muted block mb-1">
              Active Reviewers
            </span>
            <span className="text-3xl font-mono font-bold text-foundation-charcoal dark:text-dark-text block">
              <AnimatedCounter to={42} />
            </span>
            <span className="text-[11px] text-foundation-muted mt-1 block">
              Global research fellows
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial">
            <span className="text-xs font-mono text-foundation-muted dark:text-dark-muted block mb-1">
              Median Decision
            </span>
            <span className="text-3xl font-mono font-bold text-green-600 dark:text-green-400 block">
              4.6d
            </span>
            <span className="text-[11px] text-foundation-muted mt-1 block">
              Sub-7 day target met
            </span>
          </div>
        </div>
      </Reveal>

      {/* 1. Sidebar / Tab Active Indicator Transition (Phase 4.G item 1) */}
      <div className="border-b border-foundation-charcoal/10 dark:border-dark-border">
        <div className="flex gap-4 sm:gap-8 overflow-x-auto">
          {[
            { id: 'queue', label: 'Peer Review Pipeline', count: submissions.length },
            { id: 'editor', label: 'Draft Composition Lab', count: 1 },
            { id: 'reviewers', label: 'Auditing Metrics & Latency' },
            { id: 'guidelines', label: 'Editorial Charter & Invariants' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative pb-4 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'text-foundation-charcoal dark:text-dark-text'
                    : 'text-foundation-muted hover:text-foundation-charcoal dark:text-dark-muted'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                    isActive ? 'bg-accent-violet text-white' : 'bg-foundation-charcoal/10 text-foundation-muted'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="editorial-studio-active-tab"
                    className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-accent-violet rounded-full"
                    transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT: SUBMISSIONS QUEUE & STATUS TRANSITIONS (Phase 4.G item 6) */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-foundation-muted dark:text-dark-muted">
            <span>Manuscripts submitted for Volume 4 consideration</span>
            <span>Double-blind review protocol</span>
          </div>

          <div className="space-y-4">
            {submissions.map((sub) => {
              const statusColors: Record<string, string> = {
                in_review: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-700',
                revisions_requested: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/40 dark:text-orange-200 dark:border-orange-700',
                accepted: 'bg-green-100 text-green-900 border-green-300 dark:bg-green-950/40 dark:text-green-200 dark:border-green-700',
                scheduled: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-700',
                draft: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300',
              };

              return (
                <motion.div
                  key={sub.id}
                  layout
                  className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-foundation-muted dark:text-dark-muted">
                        {sub.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${statusColors[sub.status] || ''}`}>
                        {sub.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs font-mono text-foundation-muted">
                        {sub.category}
                      </span>
                    </div>

                    <h3 className="font-editorial-serif text-2xl text-foundation-charcoal dark:text-dark-text tracking-tight font-medium">
                      {sub.title}
                    </h3>

                    <p className="text-xs text-foundation-muted dark:text-dark-muted">
                      Submitted by <strong className="text-foundation-charcoal dark:text-dark-text">{sub.authorName}</strong> ({sub.authorAffiliation}) • Assigned Editor: {sub.assignedEditor}
                    </p>

                    <p className="text-xs text-foundation-charcoal/80 dark:text-dark-text/80 line-clamp-2 italic">
                      "{sub.abstract}"
                    </p>
                  </div>

                  {/* Workflow Action Controls */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                    <div className="text-xs font-mono text-right text-foundation-muted mb-1">
                      Score: <strong className="text-accent-violet">{sub.reviewerScore}/10</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {sub.status !== 'accepted' && (
                        <button
                          onClick={() => handleUpdateStatus(sub.id, 'accepted')}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800 transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                      )}

                      {sub.status !== 'revisions_requested' && (
                        <button
                          onClick={() => handleUpdateStatus(sub.id, 'revisions_requested')}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800 transition-colors cursor-pointer"
                        >
                          Request Revision
                        </button>
                      )}

                      {sub.status === 'accepted' && (
                        <button
                          onClick={() => handleUpdateStatus(sub.id, 'scheduled')}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-violet text-white hover:bg-opacity-90 transition-colors cursor-pointer"
                        >
                          Schedule Release
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DRAFT COMPOSITION LAB (Phase 4.G items 4 & 5) */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial space-y-4">
              {/* Title Input */}
              <div>
                <label className="text-xs font-mono text-foundation-muted uppercase tracking-wider block mb-1">
                  Manuscript Title
                </label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full font-editorial-serif text-2xl sm:text-3xl text-foundation-charcoal dark:text-dark-text bg-transparent border-b border-foundation-charcoal/20 dark:border-dark-border focus:outline-none focus:border-accent-violet py-2"
                />
              </div>

              {/* Textarea */}
              <div>
                <label className="text-xs font-mono text-foundation-muted uppercase tracking-wider block mb-1">
                  Lead Empirical Text
                </label>
                <textarea
                  rows={6}
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  className="w-full text-base text-foundation-charcoal dark:text-dark-text bg-foundation-ivory dark:bg-dark-elevated rounded-xl p-4 border border-foundation-charcoal/10 dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-accent-violet font-editorial-sans leading-relaxed"
                />
              </div>

              {/* Dynamic Content Blocks (Phase 4.G item 4) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-foundation-muted uppercase">
                    Integrated Research Artifacts ({contentBlocks.length})
                  </span>
                  <button
                    onClick={handleAddBlock}
                    className="text-xs text-accent-violet hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" /> Insert Artifact Block
                  </button>
                </div>

                {contentBlocks.map((block, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3.5 rounded-xl bg-accent-lavender/40 dark:bg-accent-violet/10 border border-accent-violet/20 text-xs font-mono text-foundation-charcoal dark:text-dark-text flex items-center justify-between"
                  >
                    <span>{block}</span>
                    <span className="text-[10px] text-accent-violet font-bold">VERIFIED</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Editor Sidebar with Autosave Status (Phase 4.G item 5) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-foundation-muted">
                  Document Health
                </span>
                {/* 5. Autosave status indicator with pulsing transition */}
                <div className="flex items-center gap-1.5 text-xs font-mono text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Autosaved {autosaveSeconds}s ago</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-foundation-charcoal/5 dark:border-dark-border">
                <div className="p-3 rounded-xl bg-foundation-ivory dark:bg-dark-elevated">
                  <span className="text-xs font-mono text-foundation-muted block">Words</span>
                  <span className="text-xl font-mono font-bold text-foundation-charcoal dark:text-dark-text">
                    {wordCount}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-foundation-ivory dark:bg-dark-elevated">
                  <span className="text-xs font-mono text-foundation-muted block">Read Time</span>
                  <span className="text-xl font-mono font-bold text-foundation-charcoal dark:text-dark-text">
                    ~{estimatedReadTime} min
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <AnimatedButton
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => onShowToast('Draft Saved to Repository', 'All checkpoint weights verified.', 'success')}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Draft Revision
                </AnimatedButton>

                <AnimatedButton
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={() => onShowToast('Compliance Check Passed', 'Zero forbidden AI clichés detected in manuscript.', 'success')}
                  icon={<FileCheck className="w-4 h-4" />}
                >
                  Audit Style Standards
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: REVIEWERS & LATENCY BENCHMARK (Phase 4.G item 3) */}
      {activeTab === 'reviewers' && (
        <div className="space-y-8">
          <AnimatedChart data={reviewPerformanceChart} type="bar" />

          <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial">
            <h3 className="font-editorial-serif text-2xl text-foundation-charcoal dark:text-dark-text mb-2">
              Resident Editorial Committee
            </h3>
            <p className="text-xs text-foundation-muted dark:text-dark-muted mb-6 leading-relaxed">
              Every submitted manuscript is audited by two blind reviewers with domain credentials in mechanistic interpretability, formal verification, or policy law.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-foundation-ivory dark:bg-dark-elevated border border-foundation-charcoal/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-lavender text-accent-violet flex items-center justify-center font-bold font-mono">
                  AN
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foundation-charcoal dark:text-dark-text">
                    Dr. Aravind Nair
                  </h4>
                  <p className="text-xs text-foundation-muted">
                    Lead, Mechanistic Interpretability &amp; SAE Dictionary Auditing
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-foundation-ivory dark:bg-dark-elevated border border-foundation-charcoal/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-softblue text-[#205493] flex items-center justify-center font-bold font-mono">
                  VS
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foundation-charcoal dark:text-dark-text">
                    Vikram Sharma
                  </h4>
                  <p className="text-xs text-foundation-muted">
                    Lead, Distributed Multi-Agent Consensus &amp; Aegis Protocols
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: EDITORIAL CHARTER */}
      {activeTab === 'guidelines' && (
        <div className="p-8 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial space-y-6">
          <h2 className="font-editorial-serif text-3xl text-foundation-charcoal dark:text-dark-text">
            Editorial Integrity &amp; Verification Rules
          </h2>
          <div className="space-y-4 text-sm text-foundation-charcoal/90 dark:text-dark-text/90 leading-relaxed">
            <p>
              1. <strong>Strict Empirical Assertion:</strong> Manuscripts must disclose full hyperparameters, random seeds, hardware specifications, and raw loss curves. Unreproducible claims are rejected without appeal.
            </p>
            <p>
              2. <strong>No Speculative Clichés:</strong> Text containing empty promotional phrasing ("unlock the future", "endless possibilities") is filtered by automated pre-screening hooks prior to human review.
            </p>
            <p>
              3. <strong>Open Weights &amp; Checkpoints:</strong> All published SAE dictionaries, consensus hashes, and benchmark harnesses must be deposited under an open source license (Apache 2.0 or CC BY 4.0).
            </p>
          </div>
        </div>
      )}

      {/* 7. Modal Entrance and Exit for Manuscript Submission (Phase 4.G item 7) */}
      <MotionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Deposit Manuscript for Review"
        subtitle="Double-blind evaluation for AI Tathastu Insights Volume 4."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmission} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-mono text-foundation-muted uppercase block mb-1">
              Title of Manuscript
            </label>
            <input
              type="text"
              required
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              placeholder="e.g. Asymmetric KV Cache Quantization under 1M Context"
              className="w-full px-3.5 py-2.5 rounded-xl border border-foundation-charcoal/20 dark:border-dark-border bg-white dark:bg-dark-elevated text-sm text-foundation-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-violet"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-foundation-muted uppercase block mb-1">
                Author Name
              </label>
              <input
                type="text"
                required
                value={modalAuthor}
                onChange={(e) => setModalAuthor(e.target.value)}
                placeholder="Dr. Jordan Blake"
                className="w-full px-3.5 py-2.5 rounded-xl border border-foundation-charcoal/20 dark:border-dark-border bg-white dark:bg-dark-elevated text-sm text-foundation-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-violet"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-foundation-muted uppercase block mb-1">
                Institution
              </label>
              <input
                type="text"
                value={modalAffiliation}
                onChange={(e) => setModalAffiliation(e.target.value)}
                placeholder="Frontier Alignment Lab"
                className="w-full px-3.5 py-2.5 rounded-xl border border-foundation-charcoal/20 dark:border-dark-border bg-white dark:bg-dark-elevated text-sm text-foundation-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-violet"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-foundation-muted uppercase block mb-1">
              Primary Research Axis
            </label>
            <select
              value={modalCategory}
              onChange={(e) => setModalCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-foundation-charcoal/20 dark:border-dark-border bg-white dark:bg-dark-elevated text-sm text-foundation-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-violet"
            >
              <option value="Frontier Systems">Frontier Systems</option>
              <option value="Interpretability">Mechanistic Interpretability</option>
              <option value="Safety & Ethics">Safety &amp; Verification</option>
              <option value="Cognitive Architectures">Cognitive &amp; Vision</option>
              <option value="Policy & Governance">Statutory Governance</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-foundation-muted uppercase block mb-1">
              Abstract (Max 200 words)
            </label>
            <textarea
              rows={3}
              value={modalAbstract}
              onChange={(e) => setModalAbstract(e.target.value)}
              placeholder="State the core hypothesis, empirical dataset, and key finding..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-foundation-charcoal/20 dark:border-dark-border bg-white dark:bg-dark-elevated text-sm text-foundation-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-violet"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-foundation-charcoal/10 dark:border-dark-border">
            <AnimatedButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              type="submit"
              variant="primary"
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Submit to Pipeline
            </AnimatedButton>
          </div>
        </form>
      </MotionModal>
    </div>
  );
};
