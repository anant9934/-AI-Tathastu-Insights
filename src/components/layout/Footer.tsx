import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  ArrowRight, 
  Check, 
  Mail, 
  Loader2, 
  Layers, 
  GitBranch, 
  Zap, 
  Box, 
  Code, 
  FlaskConical, 
  Package, 
  Film, 
  Users, 
  Compass, 
  Infinity as InfinityIcon, 
  FileText, 
  MapPin, 
  BookOpen,
  Rss
} from 'lucide-react';
import { NavTab } from './Navbar';
import { api } from '../../lib/api';

// Pixel-perfect SVG Brand Icons for GitHub, X, YouTube, LinkedIn
const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8m1.39 9.74v-8.37H5.07v8.37h2.78z" />
  </svg>
);

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
  hideNewsletter?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, hideNewsletter = false }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'already' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [cmsSettings, setCmsSettings] = useState<any>(null);
  const prefersReducedMotion = useReducedMotion();

  // Load CMS Footer Settings if published
  useEffect(() => {
    let mounted = true;
    api.public.getSettings().then((settings) => {
      if (mounted && settings) {
        setCmsSettings(settings);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setSubmitStatus('error');
      setFeedbackMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setFeedbackMessage('');

    try {
      const res = await api.newsletter.subscribe(email.trim());
      if (res && res.status === 'already_subscribed') {
        setSubmitStatus('already');
        setFeedbackMessage('You are already registered for our peer dispatch updates.');
      } else {
        setSubmitStatus('success');
        setFeedbackMessage('Subscription confirmed. We have dispatched a confirmation note.');
        setEmail('');
      }
    } catch (err: any) {
      setSubmitStatus('error');
      setFeedbackMessage(err.message || 'Unable to complete subscription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="relative w-full bg-[#080E17] text-white border-t border-white/[0.08] overflow-hidden select-text"
      role="contentinfo"
      aria-label="Site Footer"
    >
      {/* =========================================================================
          ATMOSPHERIC AURORA LIGHTING & SUBTLE AMBIENT SWEEP (TOP-RIGHT)
          ========================================================================= */}
      <div 
        className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden select-none" 
        aria-hidden="true"
      >
        {/* Soft atmospheric blue-teal background radial diffusion */}
        <div 
          className="absolute -top-24 right-0 w-[550px] sm:w-[750px] h-[360px] rounded-full blur-3xl opacity-35"
          style={{
            background: 'radial-gradient(circle, rgba(14, 116, 144, 0.4) 0%, rgba(8, 14, 23, 0) 70%)',
          }}
        />

        {/* Luminous Orange-Amber to Cyan-Teal Curved Aurora Arc (Mockup Match) */}
        <svg 
          className="absolute -top-12 -right-8 w-[500px] sm:w-[720px] lg:w-[860px] h-[340px] opacity-90 transform translate-x-4 sm:translate-x-0" 
          viewBox="0 0 860 340" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="auroraBeamGrad" x1="860" y1="0" x2="260" y2="340" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF4A1C" stopOpacity="0.95" />
              <stop offset="22%" stopColor="#FF7728" stopOpacity="0.85" />
              <stop offset="48%" stopColor="#2DD4BF" stopOpacity="0.65" />
              <stop offset="78%" stopColor="#38BDF8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#080E17" stopOpacity="0" />
            </linearGradient>

            <filter id="auroraDeepGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="38" result="blur" />
            </filter>
            
            <filter id="auroraCoreGlow" x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="12" result="blur" />
            </filter>
          </defs>

          {/* Diffuse Outer Ambient Band */}
          <path
            d="M860 0 C700 35 530 120 420 220 C340 290 280 330 200 340"
            stroke="url(#auroraBeamGrad)"
            strokeWidth="110"
            strokeLinecap="round"
            filter="url(#auroraDeepGlow)"
          />

          {/* Luminous Mid-Intensity Aurora Beam */}
          <path
            d="M860 0 C720 30 560 110 450 200 C370 270 300 310 240 330"
            stroke="url(#auroraBeamGrad)"
            strokeWidth="36"
            strokeLinecap="round"
            filter="url(#auroraCoreGlow)"
            opacity="0.95"
          />

          {/* High-Contrast Sharp Coral-Amber Rim */}
          <path
            d="M860 0 C740 25 600 90 490 170"
            stroke="#FFA066"
            strokeWidth="10"
            strokeLinecap="round"
            filter="url(#auroraCoreGlow)"
            opacity="0.9"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* =========================================================================
            AREA A — NEWSLETTER FEATURE (TOP SECTION)
            ========================================================================= */}
        {!hideNewsletter && (
          <div className="pt-14 sm:pt-16 pb-12 sm:pb-14 border-b border-white/[0.08]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Heading & Description */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[#D9EF68] rounded-full inline-block" />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                    STAY UPDATED
                  </span>
                </div>
                
                <h3 className="font-display text-2xl sm:text-3xl md:text-[34px] font-semibold text-white tracking-tight leading-snug">
                  Get updates as we ship new products and research.
                </h3>
                
                <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed max-w-xl">
                  Product releases, engineering write-ups, research results, and important updates. No spam.
                </p>
              </div>

              {/* Right Column: Interactive Subscription Form */}
              <div className="lg:col-span-5 lg:pl-4">
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    {/* Transparent Dark Input Surface */}
                    <div className="relative flex-1">
                      <Mail 
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" 
                        aria-hidden="true" 
                      />
                      <input
                        id="footer-newsletter-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (submitStatus !== 'idle') setSubmitStatus('idle');
                        }}
                        placeholder="Enter your email"
                        aria-label="Institutional or research email address"
                        disabled={isSubmitting}
                        className="w-full pl-11 pr-4 py-3 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/35 focus:ring-1 focus:ring-white/20 transition-all font-sans"
                      />
                    </div>

                    {/* Signature Lime Subscribe Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-xl sm:rounded-2xl bg-[#D9EF68] hover:bg-[#CEE854] active:bg-[#BFD843] text-[#080E17] font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lime-500/20 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed select-none flex-shrink-0"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Subscribing...</span>
                        </>
                      ) : submitStatus === 'success' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-800" />
                          <span>Subscribed</span>
                        </>
                      ) : (
                        <>
                          <span>Subscribe</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Accessible Submission Feedback State */}
                  {submitStatus === 'error' && (
                    <motion.p 
                      initial={{ opacity: 0, y: -4 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-mono text-rose-400 pl-1"
                      role="alert"
                    >
                      ✕ {feedbackMessage}
                    </motion.p>
                  )}
                  {submitStatus === 'already' && (
                    <motion.p 
                      initial={{ opacity: 0, y: -4 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-mono text-amber-300 pl-1"
                      role="status"
                    >
                      ℹ {feedbackMessage}
                    </motion.p>
                  )}
                  {submitStatus === 'success' && (
                    <motion.p 
                      initial={{ opacity: 0, y: -4 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-mono text-emerald-300 pl-1"
                      role="status"
                    >
                      ✓ {feedbackMessage}
                    </motion.p>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            AREA B — MAIN FOUR-COLUMN FOOTER CONTENT
            ========================================================================= */}
        <div className="py-14 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1 — Brand (lg:col-span-4) */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-white/20 flex items-center justify-center font-bold text-white text-sm shadow-inner font-mono">
                T
              </div>
              <span className="font-display text-base font-semibold tracking-tight text-white">
                {cmsSettings?.siteTitle || 'AI Tathastu Insights'}
              </span>
            </div>

            <p className="text-xs sm:text-[13px] text-neutral-400 font-sans leading-relaxed max-w-sm">
              The official public knowledge and storytelling platform of AI Tathastu. Documenting what we build, why we build it, and how our products, research, and engineering work.
            </p>

            {/* Social Outlined Icon Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <a
                href={cmsSettings?.socialLinks?.find((s: any) => s.platform === 'GitHub')?.url || 'https://github.com/ai-tathastu'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AI Tathastu GitHub Repositories"
                className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/30 hover:bg-white/[0.08] flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <GithubIcon className="w-4 h-4" />
              </a>

              <a
                href={cmsSettings?.socialLinks?.find((s: any) => s.platform === 'Twitter' || s.platform === 'X')?.url || 'https://x.com/ai_tathastu'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AI Tathastu on X"
                className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/30 hover:bg-white/[0.08] flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <XIcon className="w-3.5 h-3.5" />
              </a>

              <a
                href={cmsSettings?.socialLinks?.find((s: any) => s.platform === 'YouTube')?.url || 'https://youtube.com/@aitathastu'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AI Tathastu YouTube Channel"
                className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/30 hover:bg-white/[0.08] flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>

              <a
                href={cmsSettings?.socialLinks?.find((s: any) => s.platform === 'LinkedIn')?.url || 'https://linkedin.com/company/ai-tathastu'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AI Tathastu LinkedIn Company Page"
                className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/30 hover:bg-white/[0.08] flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>

              <a
                href="/api/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AI Tathastu RSS Feed"
                className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/30 hover:bg-white/[0.08] flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <Rss className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2 — Products (lg:col-span-2.5) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
              PRODUCTS
            </h4>
            
            <ul className="space-y-3 text-xs sm:text-[13px] font-sans">
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="group flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer text-left w-full"
                >
                  <Layers className="w-4 h-4 text-[#A855F7] flex-shrink-0 transition-transform group-hover:scale-110" />
                  <span className="group-hover:translate-x-0.5 transition-transform">MentorMaze (AI Mentorship)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="group flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer text-left w-full"
                >
                  <GitBranch className="w-4 h-4 text-[#3B82F6] flex-shrink-0 transition-transform group-hover:scale-110" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Collaborate (Agent Lab)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="group flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer text-left w-full"
                >
                  <Zap className="w-4 h-4 text-[#10B981] flex-shrink-0 transition-transform group-hover:scale-110" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Avsar (Grants &amp; Talent)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="group flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer text-left w-full"
                >
                  <Box className="w-4 h-4 text-[#F97316] flex-shrink-0 transition-transform group-hover:scale-110" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Iris (Spatial Vision)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 — Engineering & Work (lg:col-span-2.5) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
              ENGINEERING &amp; WORK
            </h4>

            <ul className="space-y-3 text-xs sm:text-[13px] font-sans">
              <li>
                <button
                  onClick={() => onNavigate('engineering')}
                  className="group flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer text-left w-full"
                >
                  <Code className="w-4 h-4 text-neutral-400 group-hover:text-white flex-shrink-0 transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">How We Built It</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('research')}
                  className="group flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer text-left w-full"
                >
                  <FlaskConical className="w-4 h-4 text-neutral-400 group-hover:text-white flex-shrink-0 transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Research &amp; Experiments</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('updates')}
                  className="group flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer text-left w-full"
                >
                  <Package className="w-4 h-4 text-neutral-400 group-hover:text-white flex-shrink-0 transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">What's New (Changelog)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('media')}
                  className="group flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer text-left w-full"
                >
                  <Film className="w-4 h-4 text-neutral-400 group-hover:text-white flex-shrink-0 transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Media &amp; Visual Stories</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4 — Company & Governance (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
              COMPANY &amp; GOVERNANCE
            </h4>

            <ul className="space-y-3 text-xs sm:text-[13px] font-sans">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="group flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer text-left w-full"
                >
                  <Users className="w-4 h-4 text-neutral-400 group-hover:text-white flex-shrink-0 transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Why We Founded AI Tathastu</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="group flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer text-left w-full"
                >
                  <Compass className="w-4 h-4 text-neutral-400 group-hover:text-white flex-shrink-0 transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Our Team &amp; Principles</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="group flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors cursor-pointer text-left w-full"
                >
                  <InfinityIcon className="w-4 h-4 text-neutral-400 group-hover:text-white flex-shrink-0 transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Long-Term Vision</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    window.location.hash = '#studio';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group flex items-center gap-2 text-neutral-400 hover:text-white transition-colors cursor-pointer text-left w-full pt-1"
                >
                  <FileText className="w-4 h-4 text-neutral-400 group-hover:text-white flex-shrink-0 transition-colors" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Editorial Studio</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/20 bg-white/5 text-neutral-300 ml-1">
                    CMS
                  </span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* =========================================================================
            AREA C — BOTTOM COPYRIGHT BAR
            ========================================================================= */}
        <div className="py-6 sm:py-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-neutral-400">
          {/* Dynamic Copyright Notice */}
          <div className="text-center md:text-left">
            <p>
              {cmsSettings?.footerConfig?.copyrightText || `© ${currentYear} AI Tathastu. Openly documenting what we build and why.`}
            </p>
          </div>

          {/* Location & Open Research Badges (Mockup Exact Match) */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
              <span>San Francisco &amp; Global Labs</span>
            </span>

            <span className="text-white/20 select-none" aria-hidden="true">|</span>

            <span className="flex items-center gap-1.5 text-neutral-300">
              <BookOpen className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />
              <span>Open Research &amp; Engineering</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
