import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  ShieldCheck, 
  BookOpen, 
  Scale, 
  HeartHandshake, 
  FileText, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  Hash, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { mockAuthors } from '../lib/mockData';
import { Reveal } from '../components/motion/Reveal';
import { Badge } from '../components/ui/Badge';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { EDITORIAL_EASE } from '../lib/motion';

interface CharterArticle {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  accent: 'violet' | 'blue' | 'mint' | 'ochre' | 'terracotta';
  paragraphs: {
    sectionNum: string;
    heading: string;
    text: string;
  }[];
  statutoryRule?: string;
}

const CHARTER_ARTICLES: CharterArticle[] = [
  {
    id: 'preamble',
    number: 'Article I',
    title: 'Preamble & Empirical Mandate',
    subtitle: 'Constitutional purpose, domain boundary, and computational scope of AI Tathastu Insights.',
    badge: 'Constitutional Scope',
    accent: 'violet',
    paragraphs: [
      {
        sectionNum: '§ 1.1',
        heading: 'Publication Purpose & Epistemic Duty',
        text: 'AI Tathastu Insights is constituted as an autonomous, non-commercial research journal and editorial publication. Its sovereign mission is to rigorously interrogate frontier artificial intelligence architectures, multi-agent coordination protocols, and mechanistic neural systems through reproducible empirical proof rather than speculative promotion.'
      },
      {
        sectionNum: '§ 1.2',
        heading: 'Proscription of Speculative & Promotional Prose',
        text: 'All published manuscripts, monographs, and investigative dispatches must remain devoid of unsubstantiated industry superlative tropes (e.g., "revolutionary breakthroughs", "endless potential"). Every affirmative assertion regarding capability, latency, or alignment must cite deterministic experimental verification.'
      }
    ],
    statutoryRule: 'Requirement: Every descriptive claim regarding model behavior must correlate with an observable tensor activation or logged metric.'
  },
  {
    id: 'verifiability',
    number: 'Article II',
    title: 'Empirical Verifiability & Replication Mandate',
    subtitle: 'Standards for independent artifact reproduction, deterministic seeding, and hardware transparency.',
    badge: 'Audit Protocol',
    accent: 'blue',
    paragraphs: [
      {
        sectionNum: '§ 2.1',
        heading: 'Mandatory Reproducibility Artifacts',
        text: 'No theoretical claim, convergence proof, or performance benchmark shall receive editorial clearance without an accompanying publicly accessible repository containing clean, documented training/eval code, model hyperparameter configurations, and exact random seed matrices.'
      },
      {
        sectionNum: '§ 2.2',
        heading: 'Hardware & Energy Footprint Disclosure',
        text: 'All benchmark evaluations must explicitly specify accelerator configurations (e.g., NVIDIA H100 SXM5 / TPU v5p clusters), driver and CUDA runtime revisions, FP8/BF16 numerical precision regimes, and aggregate thermal/power telemetry recorded during trial runs.'
      }
    ],
    statutoryRule: 'Audit Gate: The Tathastu Replication Node independently executes all test suites before final manuscript acceptance.'
  },
  {
    id: 'open-weights',
    number: 'Article III',
    title: 'Open Weights & Knowledge Commons',
    subtitle: 'Licensing framework under Creative Commons and permanent archival preservation.',
    badge: 'CC BY-NC 4.0',
    accent: 'mint',
    paragraphs: [
      {
        sectionNum: '§ 3.1',
        heading: 'Universal Open Access & Zenodo Archival',
        text: 'All primary research papers and investigative reports are distributed freely under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) license. Digital Object Identifiers (DOIs) are minted through the Zenodo/CERN academic infrastructure to guarantee perpetual access.'
      },
      {
        sectionNum: '§ 3.2',
        heading: 'Weights & Checkpoint Distribution',
        text: 'Sparse autoencoder checkpoints, distilled adapter matrices, and synthetic benchmark suites authored in conjunction with Tathastu investigations are deposited on open hubs with cryptographic SHA-256 validation sums.'
      }
    ],
    statutoryRule: 'Perpetuity Guarantee: Content remains unrestricted by paywalls, private subscriptions, or programmatic pay-per-read gates.'
  },
  {
    id: 'peer-review',
    number: 'Article IV',
    title: 'Byzantine Multi-Agent Peer Review',
    subtitle: 'Decoupled double-blind peer scrutiny augmented by deterministic adversary models.',
    badge: 'Peer Review',
    accent: 'ochre',
    paragraphs: [
      {
        sectionNum: '§ 4.1',
        heading: 'Double-Blind Specialized Review Panels',
        text: 'Submissions undergo evaluation by at least two independent domain referees possessing verifiable publication records in the respective discipline (Mechanistic Interpretability, Byzantine Distributed Systems, or Formal Verification).'
      },
      {
        sectionNum: '§ 4.2',
        heading: 'Algorithmic Stress & Adversarial Probing',
        text: 'In addition to human specialist appraisal, all computational scripts undergo automated invariant fuzzing and adversarial prompt injection testing via the Tathastu Continuous Review Pipeline to detect edge failures or hallucinated claims.'
      }
    ],
    statutoryRule: 'Resolution Metric: Disagreements between referees trigger a joint open rebuttal colloquium rather than silent editorial rejection.'
  },
  {
    id: 'governance',
    number: 'Article V',
    title: 'Institutional Independence & Non-Commercial Governance',
    subtitle: 'Fiduciary separation from venture capital, commercial sponsors, and corporate influence.',
    badge: 'Conflict Policy',
    accent: 'terracotta',
    paragraphs: [
      {
        sectionNum: '§ 5.1',
        heading: 'Complete Commercial Disentanglement',
        text: 'AI Tathastu Insights operates without display advertising, paid product placements, sponsored technical advertorials, or equity subsidies from commercial frontier model vendors. Editorial judgment is strictly firewalled from external philanthropic benefactors.'
      },
      {
        sectionNum: '§ 5.2',
        heading: 'Mandatory Conflict of Interest Declarations',
        text: 'All contributing authors and resident fellows must publish a complete five-year disclosure covering corporate research grants, stock options, compute credits, and advisory positions alongside every submission.'
      }
    ],
    statutoryRule: 'Ethical Firewall: Violations of financial disclosure result in an immediate three-year publication moratorium.'
  },
  {
    id: 'corrections',
    number: 'Article VI',
    title: 'Errata, Retraction & Dynamic Correction',
    subtitle: 'Public, version-controlled audit trail for post-publication amendments.',
    badge: 'Version Integrity',
    accent: 'violet',
    paragraphs: [
      {
        sectionNum: '§ 6.1',
        heading: 'Continuous Git-Tracked Errata',
        text: 'Every published article links directly to its public revision commit log. Minor typographic or grammatical clarifications are appended as non-breaking commits, whereas empirical calculation corrections require an explicit addendum signed by the lead author.'
      },
      {
        sectionNum: '§ 6.2',
        heading: 'Transparent Retraction Protocol',
        text: 'If an experimental finding proves non-replicable after independent reproduction attempts, the manuscript is formally superseded by a Retraction Monograph detailing the exact root cause of divergence.'
      }
    ],
    statutoryRule: 'Provenance Standard: Retracted manuscripts remain indexed with prominent watermarks to preserve scientific history.'
  }
];

export const AboutPage: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('preamble');
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();
  const authorsList = Object.values(mockAuthors);

  // Active section tracking via intersection / scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = CHARTER_ARTICLES.length - 1; i >= 0; i--) {
        const article = CHARTER_ARTICLES[i];
        const el = document.getElementById(article.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(article.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToArticle = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
      setActiveSectionId(id);
    }
  };

  const handleCopyCitation = () => {
    const citation = `@misc{tathastu_charter_2026,
  title = {The Tathastu Editorial & Research Publication Charter: Empirical Invariants, Double-Blind Auditing & Computational Reproducibility},
  author = {Editorial Board of AI Tathastu Insights},
  howpublished = {AI Tathastu Institutional Publication Archive},
  year = {2026},
  url = {https://insights.tathastu.ai/charter},
  note = {Canonical Governance Document — Official DOI Registration Pending Open Archive Deposit}
}`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const handleDownloadCharter = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header Banner */}
      <header className="border-b border-foundation-border dark:border-dark-border bg-white dark:bg-dark-surface/40 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge accent="violet" size="sm">
                Institutional Charter
              </Badge>
              <Badge accent="neutral" size="sm">
                Governance V3.2 • Ratified 2026
              </Badge>
              <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted ml-auto hidden sm:inline">
                Canonical URI: insights.tathastu.ai/charter (DOI Minting Pending)
              </span>
            </div>

            <h1 className="font-editorial-serif type-hero text-foundation-ink dark:text-dark-text tracking-tight font-normal">
              The Tathastu Editorial Charter
            </h1>

            <p className="type-secondary text-foundation-secondary dark:text-dark-muted leading-relaxed max-w-2xl">
              Constitutional foundations governing computational integrity, independent peer review, open artifact distribution, and conflict-of-interest prohibitions.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <AnimatedButton
                variant="primary"
                size="sm"
                onClick={handleDownloadCharter}
                icon={downloadSuccess ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Download className="w-3.5 h-3.5" />}
              >
                {downloadSuccess ? 'Downloaded Official Charter' : 'Download Charter PDF'}
              </AnimatedButton>

              <AnimatedButton
                variant="outline"
                size="sm"
                onClick={handleCopyCitation}
                icon={copiedCitation ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedCitation ? 'BibTeX Copied' : 'Cite Charter (BibTeX)'}
              </AnimatedButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Sticky Index & Governance Telemetry */}
          <aside className="lg:col-span-4 hidden lg:block sticky top-24 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-foundation-border dark:border-dark-border pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-foundation-secondary dark:text-dark-muted font-medium">
                  Charter Articles
                </span>
                <span className="text-[11px] font-mono text-brand-editorial-violet font-semibold">
                  6 Articles
                </span>
              </div>

              <nav className="space-y-1">
                {CHARTER_ARTICLES.map((article) => {
                  const isActive = activeSectionId === article.id;
                  return (
                    <button
                      key={article.id}
                      onClick={() => scrollToArticle(article.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-surface-lavender text-brand-editorial-violet font-semibold shadow-xs dark:bg-brand-editorial-violet/20 dark:text-accent-lavender'
                          : 'text-foundation-secondary hover:text-foundation-ink hover:bg-foundation-ink/5 dark:text-dark-muted dark:hover:text-dark-text'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] opacity-70">{article.number}</span>
                        <span className="truncate">{article.title.replace(/Article [I|V|X]+ — /, '')}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-editorial-violet" />}
                    </button>
                  );
                })}
              </nav>

              {/* Cryptographic Registry Seal */}
              <div className="pt-4 border-t border-foundation-border dark:border-dark-border space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-foundation-secondary dark:text-dark-muted block">
                  Cryptographic Verification
                </span>
                <div className="p-3 rounded-xl bg-foundation-paper dark:bg-dark-elevated border border-foundation-border dark:border-dark-border font-mono text-[10px] text-foundation-secondary dark:text-dark-muted space-y-1">
                  <div className="flex justify-between">
                    <span>Algorithm:</span>
                    <span className="text-foundation-ink dark:text-dark-text">SHA-256</span>
                  </div>
                  <div className="truncate text-brand-editorial-violet">
                    7f8a91c2b54de80...9f31b2
                  </div>
                  <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium pt-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Perpetual Anchor Confirmed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statutory Legal Statement */}
            <div className="p-5 rounded-2xl bg-surface-lavender/50 dark:bg-brand-editorial-violet/10 border border-brand-editorial-violet/20 text-xs text-foundation-ink dark:text-dark-text space-y-2">
              <div className="flex items-center gap-2 font-semibold text-brand-editorial-violet">
                <Scale className="w-4 h-4" />
                <span>Statutory Authority</span>
              </div>
              <p className="text-[11px] text-foundation-secondary dark:text-dark-muted leading-relaxed">
                Ratified by the Tathastu Academic Standards Committee under the International Open Science Accord of 2025.
              </p>
            </div>
          </aside>

          {/* Right Column: Full Charter Articles & Board Showcase */}
          <main className="lg:col-span-8 space-y-16">
            
            {/* The 6 Numbered Articles */}
            <div className="space-y-14">
              {CHARTER_ARTICLES.map((article, index) => (
                <section
                  key={article.id}
                  id={article.id}
                  className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-dark-surface border border-foundation-border dark:border-dark-border shadow-sm space-y-6 scroll-mt-28"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foundation-border dark:border-dark-border pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono uppercase tracking-widest text-brand-editorial-violet font-semibold">
                        {article.number}
                      </span>
                      <span className="text-foundation-secondary/40">•</span>
                      <Badge accent={article.accent} size="sm">
                        {article.badge}
                      </Badge>
                    </div>
                    <span className="text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                      Clause 0{index + 1}.0
                    </span>
                  </div>

                  <div>
                    <h2 className="font-editorial-serif type-section-heading text-foundation-ink dark:text-dark-text tracking-tight font-medium">
                      {article.title}
                    </h2>
                    <p className="mt-2 text-sm text-foundation-secondary dark:text-dark-muted font-editorial-sans">
                      {article.subtitle}
                    </p>
                  </div>

                  <div className="space-y-6 pt-2">
                    {article.paragraphs.map((p, pIndex) => (
                      <div key={pIndex} className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-xs font-semibold text-brand-editorial-violet shrink-0">
                            {p.sectionNum}
                          </span>
                          <h3 className="font-editorial-serif text-lg text-foundation-ink dark:text-dark-text font-medium">
                            {p.heading}
                          </h3>
                        </div>
                        <p className="type-body text-foundation-secondary dark:text-dark-muted pl-6 leading-relaxed">
                          {p.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {article.statutoryRule && (
                    <div className="mt-4 p-4 rounded-xl bg-foundation-paper dark:bg-dark-elevated border-l-3 border-brand-editorial-violet text-xs font-mono text-foundation-ink dark:text-dark-text flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-brand-editorial-violet shrink-0 mt-0.5" />
                      <span>{article.statutoryRule}</span>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Editorial Board & Oversight Council */}
            <section className="pt-8 border-t border-foundation-border dark:border-dark-border space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-editorial-violet block mb-1 font-medium">
                  Governance & Oversight
                </span>
                <h2 className="font-editorial-serif type-section-heading text-foundation-ink dark:text-dark-text tracking-tight font-normal">
                  Resident Investigators &amp; Editorial Board
                </h2>
                <p className="type-secondary text-foundation-secondary dark:text-dark-muted mt-2">
                  The principal research domains maintaining editorial independence. Resident researcher profiles represent illustrative editorial personas created for design and workflow evaluation ahead of accredited board ratification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {authorsList.map((author) => (
                  <div
                    key={author.id}
                    className="p-6 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border shadow-sm flex items-start gap-4 hover:border-brand-editorial-violet/30 transition-colors"
                  >
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-14 h-14 rounded-full object-cover border border-foundation-border shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-editorial-serif text-xl text-foundation-ink dark:text-dark-text truncate">
                          {author.name}
                        </h3>
                        {author.isDemonstrationPersona && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium border border-amber-300/40 shrink-0">
                            Demonstration Persona
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-brand-editorial-violet dark:text-accent-lavender truncate">
                        {author.role}
                      </p>
                      <p className="text-[11px] font-mono text-foundation-secondary dark:text-dark-muted truncate">
                        {author.affiliation}
                      </p>
                      <p className="text-xs text-foundation-secondary dark:text-dark-muted pt-2 leading-relaxed">
                        {author.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Ratification Signatures Block */}
            <section className="p-8 sm:p-10 rounded-3xl bg-foundation-paper dark:bg-dark-surface border border-foundation-border dark:border-dark-border space-y-6">
              <div className="border-b border-foundation-border dark:border-dark-border pb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-foundation-secondary dark:text-dark-muted block mb-1">
                  Certification
                </span>
                <h3 className="font-editorial-serif text-2xl text-foundation-ink dark:text-dark-text">
                  Ratification &amp; Statutory Seal
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono text-foundation-secondary dark:text-dark-muted">
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase text-foundation-secondary/70">Ratified By</span>
                  <span className="text-foundation-ink dark:text-dark-text font-medium block">Tathastu Standards Board</span>
                  <span className="text-[11px]">Unanimous Vote (7-0)</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase text-foundation-secondary/70">Effective Date</span>
                  <span className="text-foundation-ink dark:text-dark-text font-medium block">January 15, 2026</span>
                  <span className="text-[11px]">Valid Through 2029 Review</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] uppercase text-foundation-secondary/70">Deposit Hash</span>
                  <span className="text-foundation-ink dark:text-dark-text font-medium block truncate">SHA-256 / Zenodo</span>
                  <span className="text-[11px] text-green-600 dark:text-green-400">Digitally Sealed</span>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};
