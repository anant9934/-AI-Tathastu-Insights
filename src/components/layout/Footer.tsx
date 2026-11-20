import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { NavTab } from './Navbar';
import { AnimatedButton } from '../motion/AnimatedButton';

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
  hideNewsletter?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, hideNewsletter = false }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
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
    <footer className="border-t border-brand-stone-dark/80 dark:border-dark-border bg-brand-surface dark:bg-dark-surface transition-colors mt-20">
      {/* Newsletter Dispatch Banner (Conditional: hidden on Homepage which has its own section) */}
      {!hideNewsletter && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-b border-brand-stone-dark/80 dark:border-dark-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-[11px] font-mono uppercase tracking-widest text-brand-muted block mb-2 font-medium">
                Stay Updated
              </span>
              <h3 className="text-2xl sm:text-3xl text-brand-charcoal dark:text-dark-text tracking-tight font-semibold">
                Follow what we're building and what we're learning.
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-brand-muted dark:text-dark-muted leading-relaxed">
                Direct updates on new product releases, engineering write-ups, and the research behind our systems. No marketing noise.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-brand-stone-dark dark:border-dark-border bg-brand-canvas dark:bg-dark-elevated text-sm text-brand-charcoal dark:text-dark-text placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all"
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
                    ✓ You're signed up. We'll send updates as new milestones land.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="col-span-1 sm:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-brand-charcoal text-white dark:bg-white dark:text-brand-charcoal flex items-center justify-center font-bold text-sm">
              T
            </div>
            <span className="text-lg font-semibold tracking-tight text-brand-charcoal dark:text-dark-text">
              AI Tathastu Insights
            </span>
          </div>
          <p className="text-xs text-brand-muted dark:text-dark-muted leading-relaxed max-w-sm">
            The official public knowledge and storytelling platform of AI Tathastu. Documenting what we build, why we build it, and how our products, research, and engineering work.
          </p>
        </div>

        {/* Products Column */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-brand-charcoal dark:text-dark-text font-semibold mb-4">
            Products
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => onNavigate('products')}
                className="text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text transition-colors cursor-pointer"
              >
                MentorMaze (AI Mentorship)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('products')}
                className="text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text transition-colors cursor-pointer"
              >
                Collaborate (Agent Lab)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('products')}
                className="text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text transition-colors cursor-pointer"
              >
                Avsar (Grants &amp; Talent)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('products')}
                className="text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text transition-colors cursor-pointer"
              >
                Iris (Spatial Vision)
              </button>
            </li>
          </ul>
        </div>

        {/* Engineering & Stories Column */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-brand-charcoal dark:text-dark-text font-semibold mb-4">
            Engineering &amp; Work
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => onNavigate('engineering')}
                className="text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text transition-colors cursor-pointer"
              >
                How We Built It
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('research')}
                className="text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text transition-colors cursor-pointer"
              >
                Research &amp; Experiments
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('updates')}
                className="text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text transition-colors cursor-pointer"
              >
                What's New (Changelog)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('media')}
                className="text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text transition-colors cursor-pointer"
              >
                Media &amp; Visual Stories
              </button>
            </li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-brand-charcoal dark:text-dark-text font-semibold mb-4">
            Company &amp; Governance
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text transition-colors cursor-pointer"
              >
                Why We Founded AI Tathastu
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text transition-colors cursor-pointer"
              >
                Our Team &amp; Principles
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text transition-colors cursor-pointer"
              >
                Long-Term Vision
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  window.location.hash = '#studio';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text transition-colors cursor-pointer flex items-center space-x-1.5 pt-1 text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                <span>Editorial Studio</span>
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                  CMS
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-stone-dark/80 dark:border-dark-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted dark:text-dark-muted text-center sm:text-left">
          <p>© 2026 AI Tathastu. Openly documenting what we build and why.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 font-mono text-[11px]">
            <span>San Francisco &amp; Global Labs</span>
            <span>Open Research &amp; Engineering</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
