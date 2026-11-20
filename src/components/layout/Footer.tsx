import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, ShieldCheck, BookOpen, ExternalLink } from 'lucide-react';
import { NavTab } from './Navbar';
import { AnimatedButton } from '../motion/AnimatedButton';

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid research institutional or personal email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="border-t border-foundation-charcoal/10 dark:border-dark-border bg-white dark:bg-dark-surface transition-colors mt-20">
      {/* Newsletter Dispatch Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-foundation-charcoal/10 dark:border-dark-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-[11px] font-mono uppercase tracking-widest text-accent-violet block mb-2">
              The Tathastu Dispatch
            </span>
            <h3 className="font-editorial-serif text-2xl sm:text-3xl text-foundation-charcoal dark:text-dark-text tracking-tight font-normal">
              Empirical breakthroughs and peer-reviewed dispatches, delivered fortnightly.
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-foundation-muted dark:text-dark-muted leading-relaxed">
              No generic hype or speculative summaries. Only verified research findings, open model checkpoints, and statutory policy analyses.
            </p>
          </div>

          <div className="lg:col-span-5">
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-foundation-charcoal/20 dark:border-dark-border bg-foundation-ivory dark:bg-dark-elevated text-sm text-foundation-charcoal dark:text-dark-text placeholder:text-foundation-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-violet transition-all"
                />
                <AnimatedButton
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={subscribed ? <Check className="w-4 h-4 text-green-400" /> : <ArrowRight className="w-4 h-4" />}
                >
                  {subscribed ? 'Subscribed' : 'Join'}
                </AnimatedButton>
              </div>
              {error && <p className="text-xs text-red-500 font-mono">{error}</p>}
              {subscribed && (
                <p className="text-xs text-green-600 dark:text-green-400 font-mono">
                  ✓ Dispatch confirmed. You will receive Volume 26 next Tuesday.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-foundation-charcoal text-white dark:bg-white dark:text-foundation-charcoal flex items-center justify-center font-editorial-serif font-bold text-sm">
              T
            </div>
            <span className="font-editorial-serif text-xl font-medium tracking-tight text-foundation-charcoal dark:text-dark-text">
              AI Tathastu Insights
            </span>
          </div>
          <p className="text-xs text-foundation-muted dark:text-dark-muted leading-relaxed max-w-sm">
            An open editorial publication and computational research journal committed to mechanistic clarity, Byzantine multi-agent safety, and grounded physical intelligence.
          </p>

          <div className="mt-5 flex items-center gap-2 text-[11px] font-mono text-foundation-muted dark:text-dark-muted">
            <ShieldCheck className="w-4 h-4 text-accent-violet" />
            <span>Open Access (CC BY-NC 4.0) • DOI Indexed</span>
          </div>
        </div>

        {/* Editorial Sections */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-foundation-charcoal dark:text-dark-text font-semibold mb-4">
            Sections
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => onNavigate('home')}
                className="text-foundation-muted hover:text-accent-violet dark:text-dark-muted transition-colors cursor-pointer"
              >
                Lead Investigations
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('research')}
                className="text-foundation-muted hover:text-accent-violet dark:text-dark-muted transition-colors cursor-pointer"
              >
                Preprints & Benchmarks
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('discover')}
                className="text-foundation-muted hover:text-accent-violet dark:text-dark-muted transition-colors cursor-pointer"
              >
                Topic Index
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('media')}
                className="text-foundation-muted hover:text-accent-violet dark:text-dark-muted transition-colors cursor-pointer"
              >
                Tathastu Dialogues
              </button>
            </li>
          </ul>
        </div>

        {/* Ecosystem Products */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-foundation-charcoal dark:text-dark-text font-semibold mb-4">
            Ecosystem
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => onNavigate('ecosystem')}
                className="text-foundation-muted hover:text-accent-violet dark:text-dark-muted transition-colors cursor-pointer"
              >
                MentorMaze (Guidance)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('ecosystem')}
                className="text-foundation-muted hover:text-accent-violet dark:text-dark-muted transition-colors cursor-pointer"
              >
                Collaborate (Lab Nodes)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('ecosystem')}
                className="text-foundation-muted hover:text-accent-violet dark:text-dark-muted transition-colors cursor-pointer"
              >
                Avsar (Grants & Talent)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('ecosystem')}
                className="text-foundation-muted hover:text-accent-violet dark:text-dark-muted transition-colors cursor-pointer"
              >
                Iris (Vision & Robotics)
              </button>
            </li>
          </ul>
        </div>

        {/* Governance & Operations */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-foundation-charcoal dark:text-dark-text font-semibold mb-4">
            Editorial
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => onNavigate('editorial-studio')}
                className="text-foundation-muted hover:text-accent-violet dark:text-dark-muted transition-colors cursor-pointer"
              >
                Editorial Studio
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="text-foundation-muted hover:text-accent-violet dark:text-dark-muted transition-colors cursor-pointer"
              >
                Peer Review Charter
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="text-foundation-muted hover:text-accent-violet dark:text-dark-muted transition-colors cursor-pointer"
              >
                Ethics & Conflict Policy
              </button>
            </li>
            <li>
              <a
                href="#archive"
                className="text-foundation-muted hover:text-accent-violet dark:text-dark-muted transition-colors"
              >
                Zenodo Archive Repository
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-foundation-charcoal/5 dark:border-dark-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-foundation-muted dark:text-dark-muted">
          <p>© 2026 AI Tathastu Insights. Published under CC BY-NC 4.0 International.</p>
          <div className="flex items-center gap-6">
            <span>Latency Target: &lt; 200ms</span>
            <span>Typography: Instrument Serif &amp; Geist</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
