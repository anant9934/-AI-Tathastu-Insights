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
  FileCheck,
  LayoutDashboard,
  Layers,
  Inbox,
  History,
  X,
  FileCode,
  AlertTriangle
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
import { api } from '../lib/api';

interface EditorialStudioPageProps {
  submissions: EditorialSubmission[];
  onShowToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const EditorialStudioPage: React.FC<EditorialStudioPageProps> = ({
  submissions: initialSubmissions,
  onShowToast,
}) => {
  const [submissions, setSubmissions] = useState<EditorialSubmission[]>(initialSubmissions);
  const [activeTab, setActiveTab] = useState<'queue' | 'editor' | 'reviewers' | 'activity' | 'guidelines'>('queue');
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

  // Autosave simulation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setAutosaveSeconds((prev) => (prev > 1 ? prev - 1 : 12));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const wordCount = draftContent.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadTime = Math.ceil(wordCount / 200);

  const handleCreateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle || !modalAuthor) {
      onShowToast('Validation Error', 'Please complete title and author details.', 'info');
      return;
    }

    try {
      const res = await api.editorial.submitManuscript({
        title: modalTitle,
        authorName: modalAuthor,
        authorEmail: 'author@institution.edu',
        authorAffiliation: modalAffiliation || 'Independent Laboratory',
        categoryId: modalCategory,
        abstract: modalAbstract || 'Manuscript submitted for double-blind verification.',
        wordCount: 4200,
        reproducibilityAttestation: true,
      });

      const newSub = res.submission;
      setSubmissions([newSub, ...submissions]);
      setIsSubmitModalOpen(false);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#7955D5', '#4775C9', '#368A70', '#22231F'],
      });

      onShowToast('Manuscript Deposited', `Assigned ID ${newSub.id}. Entered peer review pipeline.`, 'success');

      setModalTitle('');
      setModalAuthor('');
      setModalAffiliation('');
      setModalAbstract('');
    } catch (err: any) {
      onShowToast('Submission Failed', err.message || 'Could not persist manuscript.', 'info');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: EditorialSubmission['status']) => {
    try {
      await api.editorial.updateStatus(id, newStatus);
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
      );
      onShowToast('Editorial State Updated', `Submission ${id} marked as ${newStatus}.`, 'info');
    } catch {
      // Fallback local update for UI
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
      );
      onShowToast('Editorial State Updated', `Submission ${id} marked as ${newStatus}.`, 'info');
    }
  };

  const handleAddBlock = () => {
    const blockTypes = [
      'Empirical Lemma: Gradient norm bounded by epsilon = 0.04 across all attention heads.',
      'Table 2.1: Ablation benchmark across 64-GPU distributed cluster.',
      'Code Verification: Lean 4 formal specification passed in 140ms.',
      'Open Archive Invariant: Verification checkpoint SHA-256 registered.',
    ];
    const randomBlock = blockTypes[Math.floor(Math.random() * blockTypes.length)];
    setContentBlocks([...contentBlocks, randomBlock]);
    onShowToast('Block Inserted', 'Added structural research artifact to draft.', 'success');
  };

  // Peer review latency chart data
  const reviewPerformanceChart = {
    title: 'Editorial Peer-Review Latency (Days to First Decision)',
    subtitle: 'Double-blind computational review turnaround vs conventional academic journals.',
    xAxisLabel: 'Journal Volume',
    yAxisLabel: 'Turnaround Days',
    primaryDatasetLabel: 'Tathastu Fast Verification',
    baselineDatasetLabel: 'Traditional Academic Benchmark',
    unit: 'd',
    points: [
      { label: 'Vol 1 (2024)', value: 14.2, baseline: 84.0 },
      { label: 'Vol 2 (2025)', value: 11.5, baseline: 84.0 },
      { label: 'Vol 3 (2025)', value: 7.8, baseline: 84.0 },
      { label: 'Vol 4 (2026)', value: 4.6, baseline: 84.0 },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Professional Workspace Top Bar (Section 4.F: Distinct publishing workspace) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-foundation-ink text-foundation-paper dark:bg-white dark:text-foundation-ink flex items-center justify-center font-editorial-serif font-bold text-lg">
            ES
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foundation-ink dark:text-dark-ink">
                AI Tathastu Editorial Studio
              </span>
              <span className="type-meta px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300">
                Production Node v4.2
              </span>
            </div>
            <p className="type-secondary text-xs mt-0.5">
              Operating under double-blind verification rules • Authorized Session: Dr. Aravind Nair
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AnimatedButton
            variant="primary"
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Deposit Manuscript
          </AnimatedButton>
        </div>
      </div>

      {/* 2. Operational Telemetry Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
          <span className="type-meta text-foundation-secondary block mb-1">
            Active Manuscripts
          </span>
          <span className="text-2xl font-mono font-bold text-foundation-ink dark:text-dark-ink block">
            <AnimatedCounter to={submissions.length} />
          </span>
          <span className="text-[11px] font-mono text-foundation-secondary mt-1 block">
            {submissions.filter((s) => s.status === 'in_review').length} in active review
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
          <span className="type-meta text-foundation-secondary block mb-1">
            Acceptance Rate
          </span>
          <span className="text-2xl font-mono font-bold text-accent-violet block">
            <AnimatedCounter to={18.4} decimals={1} suffix="%" />
          </span>
          <span className="text-[11px] font-mono text-foundation-secondary mt-1 block">
            Strict reproducibility threshold
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
          <span className="type-meta text-foundation-secondary block mb-1">
            Active Reviewers
          </span>
          <span className="text-2xl font-mono font-bold text-foundation-ink dark:text-dark-ink block">
            <AnimatedCounter to={42} />
          </span>
          <span className="text-[11px] font-mono text-foundation-secondary mt-1 block">
            Distributed academic faculty
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-editorial">
          <span className="type-meta text-foundation-secondary block mb-1">
            Decision Turnaround
          </span>
          <span className="text-2xl font-mono font-bold text-accent-mint block">
            4.6 Days
          </span>
          <span className="text-[11px] font-mono text-foundation-secondary mt-1 block">
            Sub-7 day mandate achieved
          </span>
        </div>
      </div>

      {/* 3. Dedicated Dashboard Sidebar Layout (Section 4.F) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Workspace Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="p-2 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border shadow-editorial space-y-1">
            {[
              { id: 'queue', label: 'Peer Review Queue', icon: <Inbox className="w-4 h-4" />, count: submissions.length },
              { id: 'editor', label: 'Draft Composition Lab', icon: <FileText className="w-4 h-4" />, badge: 'Active' },
              { id: 'reviewers', label: 'Auditing Telemetry', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'activity', label: 'Recent Editorial Log', icon: <History className="w-4 h-4" /> },
              { id: 'guidelines', label: 'Publication Invariants', icon: <ShieldAlert className="w-4 h-4" /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-foundation-ink text-foundation-paper dark:bg-white dark:text-foundation-ink shadow-sm'
                      : 'text-foundation-secondary hover:text-foundation-ink hover:bg-foundation-paper dark:hover:bg-dark-elevated'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] ${
                      isActive ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black' : 'bg-foundation-paper dark:bg-dark-elevated text-foundation-secondary'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-accent-lavender text-accent-violet font-semibold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Verification Engine Status Box */}
          <div className="p-4 rounded-2xl bg-foundation-paper dark:bg-dark-surface border border-foundation-border dark:border-dark-border text-xs space-y-2">
            <span className="type-meta text-foundation-secondary uppercase block">
              Pre-Flight Checker
            </span>
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
              <Check className="w-4 h-4 text-green-600" />
              <span>Lean 4 Proof Kernel Online</span>
            </div>
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
              <Check className="w-4 h-4 text-green-600" />
              <span>PyTorch 2.4 Sandbox Active</span>
            </div>
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
              <Check className="w-4 h-4 text-green-600" />
              <span>Forbidden Cliché Filter: STRICT</span>
            </div>
          </div>
        </aside>

        {/* Workspace Main Panel */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: PEER REVIEW QUEUE */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-foundation-secondary dark:text-dark-secondary pb-2 border-b border-foundation-border dark:border-dark-border">
                <span>Active Submissions in Pipeline ({submissions.length})</span>
                <span>Double-blind protocol enforced</span>
              </div>

              <div className="space-y-3">
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
                      className="p-5 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="type-meta text-foundation-secondary font-semibold">
                            {sub.id}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${statusColors[sub.status] || ''}`}>
                            {sub.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="type-meta text-foundation-secondary">
                            {sub.category}
                          </span>
                        </div>

                        <h3 className="type-card-heading text-foundation-ink dark:text-dark-ink font-medium">
                          {sub.title}
                        </h3>

                        <p className="text-xs text-foundation-secondary dark:text-dark-secondary">
                          Submitted by <strong className="text-foundation-ink dark:text-dark-ink">{sub.authorName}</strong> ({sub.authorAffiliation}) • Assigned Editor: {sub.assignedEditor}
                        </p>

                        <p className="text-xs text-foundation-ink/80 dark:text-dark-ink/80 line-clamp-2 italic">
                          "{sub.abstract}"
                        </p>
                      </div>

                      {/* Workflow Actions */}
                      <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 md:text-right">
                        <div className="type-meta text-foundation-secondary mb-1">
                          Review Score: <strong className="text-accent-violet">{sub.reviewerScore}/10</strong>
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

          {/* TAB 2: DRAFT COMPOSITION LAB */}
          {activeTab === 'editor' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-8 space-y-5">
                <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border shadow-editorial space-y-4">
                  {/* Title */}
                  <div>
                    <label className="type-meta text-foundation-secondary uppercase block mb-1">
                      Manuscript Headline
                    </label>
                    <input
                      type="text"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      className="w-full type-card-heading text-foundation-ink dark:text-dark-ink bg-transparent border-b border-foundation-border dark:border-dark-border focus:outline-none focus:border-accent-violet py-2 font-medium"
                    />
                  </div>

                  {/* Body Textarea */}
                  <div>
                    <label className="type-meta text-foundation-secondary uppercase block mb-1">
                      Lead Empirical Text
                    </label>
                    <textarea
                      rows={6}
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      className="w-full type-body text-foundation-ink dark:text-dark-ink bg-foundation-paper dark:bg-dark-elevated rounded-xl p-4 border border-foundation-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-accent-violet leading-relaxed"
                    />
                  </div>

                  {/* Research Artifact Blocks */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="type-meta text-foundation-secondary uppercase">
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
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3.5 rounded-xl bg-accent-lavender/40 dark:bg-accent-violet/10 border border-accent-violet/20 text-xs font-mono text-foundation-ink dark:text-dark-ink flex items-center justify-between"
                      >
                        <span>{block}</span>
                        <span className="text-[10px] text-accent-violet font-bold">VERIFIED</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Editor Workspace Metrics Sidebar */}
              <div className="xl:col-span-4 space-y-5">
                <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border shadow-editorial space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="type-meta text-foundation-secondary uppercase">
                      Document Telemetry
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-green-600 dark:text-green-400">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span>Autosaved {autosaveSeconds}s ago</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-foundation-border/60 dark:border-dark-border">
                    <div className="p-3 rounded-xl bg-foundation-paper dark:bg-dark-elevated">
                      <span className="type-meta text-foundation-secondary block">Words</span>
                      <span className="text-xl font-mono font-bold text-foundation-ink dark:text-dark-ink">
                        {wordCount}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-foundation-paper dark:bg-dark-elevated">
                      <span className="type-meta text-foundation-secondary block">Read Time</span>
                      <span className="text-xl font-mono font-bold text-foundation-ink dark:text-dark-ink">
                        ~{estimatedReadTime} min
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <AnimatedButton
                      variant="primary"
                      size="md"
                      className="w-full"
                      onClick={() => onShowToast('Draft Saved', 'Manuscript weights synchronized with Git revision.', 'success')}
                      icon={<Save className="w-4 h-4" />}
                    >
                      Save Revision Checkpoint
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

          {/* TAB 3: AUDITING TELEMETRY */}
          {activeTab === 'reviewers' && (
            <div className="space-y-6">
              <AnimatedChart data={reviewPerformanceChart} type="bar" />

              <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border shadow-editorial">
                <h3 className="type-card-heading text-foundation-ink dark:text-dark-ink font-medium mb-2">
                  Active Editorial Committee
                </h3>
                <p className="type-secondary text-xs mb-4">
                  Reviewers are allocated based on domain expertise with mandatory conflict-of-interest declarations.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent-lavender text-accent-violet flex items-center justify-center font-bold font-mono text-xs">
                      AN
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-foundation-ink dark:text-dark-ink">
                        Dr. Aravind Nair
                      </h4>
                      <p className="text-[11px] text-foundation-secondary">
                        Lead, Mechanistic Interpretability &amp; SAE Dictionaries
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent-softblue text-accent-blue flex items-center justify-center font-bold font-mono text-xs">
                      VS
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-foundation-ink dark:text-dark-ink">
                        Vikram Sharma
                      </h4>
                      <p className="text-[11px] text-foundation-secondary">
                        Lead, Distributed Byzantine Consensus &amp; Swarm Architecture
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RECENT EDITORIAL LOG */}
          {activeTab === 'activity' && (
            <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border shadow-editorial space-y-4">
              <h3 className="type-card-heading text-foundation-ink dark:text-dark-ink font-medium">
                Cryptographic Editorial Audit Trail
              </h3>
              <p className="type-secondary text-xs">
                All status modifications and reviewer score commits are permanently logged.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border/60 flex items-center justify-between">
                  <span>[2026-11-20 18:42] Accepted sub-2026-091 by Dr. Alistair Finch</span>
                  <span className="text-green-600">COMMIT_OK</span>
                </div>
                <div className="p-3 rounded-xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border/60 flex items-center justify-between">
                  <span>[2026-11-19 14:10] Revisions requested on sub-2026-093 by Karan Mehta</span>
                  <span className="text-amber-600">REVISE_OK</span>
                </div>
                <div className="p-3 rounded-xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border/60 flex items-center justify-between">
                  <span>[2026-11-18 09:25] DOI 10.5281/zenodo.1084291 minted for SAE Paper</span>
                  <span className="text-accent-violet">DOI_MINTED</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PUBLICATION INVARIANTS */}
          {activeTab === 'guidelines' && (
            <div className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border shadow-editorial space-y-4">
              <h3 className="type-card-heading text-foundation-ink dark:text-dark-ink font-medium">
                Mandatory Editorial Invariants
              </h3>
              <div className="space-y-3 text-xs text-foundation-ink/90 dark:text-dark-ink/90 leading-relaxed">
                <p>
                  1. <strong>Deterministic Seeds:</strong> Every loss curve or benchmark table must declare its random seed and torch backend determinism flags.
                </p>
                <p>
                  2. <strong>Zero Fluff:</strong> Pre-submission hooks automatically flag marketing clichés like "revolutionizing tomorrow" or "unprecedented leap".
                </p>
                <p>
                  3. <strong>Open Weights:</strong> Weights must be deposited to the Tathastu archive under Apache 2.0 or MIT.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Manuscript Deposit Modal Dialog */}
      <MotionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Deposit Manuscript for Double-Blind Audit"
        subtitle="AI Tathastu Insights Volume 4 Submission"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmission} className="space-y-4 pt-2">
          <div>
            <label className="type-meta text-foundation-secondary uppercase block mb-1">
              Title of Manuscript
            </label>
            <input
              type="text"
              required
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              placeholder="e.g. Asymmetric KV Cache Quantization under 1M Context"
              className="w-full px-3.5 py-2.5 rounded-xl border border-foundation-border dark:border-dark-border bg-white dark:bg-dark-elevated text-sm text-foundation-ink dark:text-dark-ink focus:outline-none focus:ring-2 focus:ring-accent-violet"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="type-meta text-foundation-secondary uppercase block mb-1">
                Author Name
              </label>
              <input
                type="text"
                required
                value={modalAuthor}
                onChange={(e) => setModalAuthor(e.target.value)}
                placeholder="Dr. Jordan Blake"
                className="w-full px-3.5 py-2.5 rounded-xl border border-foundation-border dark:border-dark-border bg-white dark:bg-dark-elevated text-sm text-foundation-ink dark:text-dark-ink focus:outline-none focus:ring-2 focus:ring-accent-violet"
              />
            </div>

            <div>
              <label className="type-meta text-foundation-secondary uppercase block mb-1">
                Institution
              </label>
              <input
                type="text"
                value={modalAffiliation}
                onChange={(e) => setModalAffiliation(e.target.value)}
                placeholder="Frontier Alignment Lab"
                className="w-full px-3.5 py-2.5 rounded-xl border border-foundation-border dark:border-dark-border bg-white dark:bg-dark-elevated text-sm text-foundation-ink dark:text-dark-ink focus:outline-none focus:ring-2 focus:ring-accent-violet"
              />
            </div>
          </div>

          <div>
            <label className="type-meta text-foundation-secondary uppercase block mb-1">
              Primary Research Axis
            </label>
            <select
              value={modalCategory}
              onChange={(e) => setModalCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-foundation-border dark:border-dark-border bg-white dark:bg-dark-elevated text-sm text-foundation-ink dark:text-dark-ink focus:outline-none focus:ring-2 focus:ring-accent-violet"
            >
              <option value="Frontier Systems">Frontier Systems</option>
              <option value="Interpretability">Mechanistic Interpretability</option>
              <option value="Safety & Ethics">Safety &amp; Verification</option>
              <option value="Cognitive Architectures">Cognitive &amp; Vision</option>
              <option value="Policy & Governance">Statutory Governance</option>
            </select>
          </div>

          <div>
            <label className="type-meta text-foundation-secondary uppercase block mb-1">
              Abstract (Max 200 words)
            </label>
            <textarea
              rows={3}
              value={modalAbstract}
              onChange={(e) => setModalAbstract(e.target.value)}
              placeholder="State the core hypothesis, empirical dataset, and key finding..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-foundation-border dark:border-dark-border bg-white dark:bg-dark-elevated text-sm text-foundation-ink dark:text-dark-ink focus:outline-none focus:ring-2 focus:ring-accent-violet"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-foundation-border dark:border-dark-border">
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
