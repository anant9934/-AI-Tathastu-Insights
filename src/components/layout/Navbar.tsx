import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Moon, 
  Search, 
  Menu, 
  X, 
  ArrowUpRight, 
  ChevronDown, 
  Layers, 
  Code2, 
  FlaskConical, 
  Sparkles, 
  Clock, 
  Radio, 
  Compass, 
  ExternalLink,
  Shield,
  ArrowRight,
  Terminal,
  BookOpen
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { EDITORIAL_EASE } from '../../lib/motion';

export type NavTab = 
  | 'home' 
  | 'discover' 
  | 'products' 
  | 'research' 
  | 'engineering' 
  | 'updates' 
  | 'media' 
  | 'about' 
  | 'editorial-studio'
  | 'ecosystem'
  | 'articles'
  | 'perspectives';

interface NavbarProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>('products');
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const handleTabClick = (tab: NavTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleMouseEnter = (menuKey: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const isDarkCanvas = isScrolled || currentTab === 'home' || currentTab === 'products' || currentTab === 'ecosystem';

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080E17]/95 backdrop-blur-xl border-b border-white/10 text-white shadow-xl shadow-black/20 py-2.5'
          : isDarkCanvas
            ? 'bg-[#060B14]/80 backdrop-blur-lg border-b border-white/10 text-white py-3 sm:py-3.5'
            : 'bg-[#FAF9F6]/90 backdrop-blur-lg border-b border-brand-stone-dark/70 dark:bg-[#080E17]/90 dark:border-white/10 text-brand-charcoal dark:text-dark-text py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* =========================================================================
            1. BRAND LOGO WITH SIGNATURE APERTURE EMBLEM
            ========================================================================= */}
        <div 
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
        >
          {/* White Rounded-xl Container with Concentric Aperture Mark */}
          <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center p-1.5 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md shrink-0">
            <svg 
              className="w-5 h-5 text-[#080E17] transition-transform duration-500 group-hover:rotate-45" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="7.5" />
              <circle cx="12" cy="12" r="2.8" fill="currentColor" stroke="none" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className={`font-display text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap transition-colors ${
              isDarkCanvas ? 'text-white' : 'text-brand-charcoal dark:text-dark-text'
            }`}>
              AI Tathastu
            </span>
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-white/10 text-neutral-300 border border-white/15">
              Insights
            </span>
          </div>
        </div>

        {/* =========================================================================
            2. DESKTOP INTERACTIVE NAVIGATION WITH MEGA-MENU PREVIEWS
            ========================================================================= */}
        <nav className="hidden lg:flex items-center gap-1 relative">
          {/* TAB 1: PRODUCTS (with Dropdown Flyout) */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('products')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleTabClick('products')}
              className={`relative px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer rounded-xl flex items-center gap-1.5 ${
                currentTab === 'products' || currentTab === 'ecosystem'
                  ? 'text-white bg-white/10 font-semibold'
                  : isDarkCanvas
                    ? 'text-white/80 hover:text-white hover:bg-white/5'
                    : 'text-brand-muted hover:text-brand-charcoal hover:bg-black/5 dark:text-dark-muted dark:hover:text-white dark:hover:bg-white/5'
              }`}
            >
              <span>Products</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'products' ? 'rotate-180 text-white' : 'opacity-60'}`} />
            </button>

            {/* Products Mega-Menu Preview */}
            <AnimatePresence>
              {activeDropdown === 'products' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: EDITORIAL_EASE }}
                  className="absolute top-full left-0 mt-1.5 w-80 p-3 rounded-2xl bg-[#0D131D] border border-white/15 shadow-2xl z-50 text-white backdrop-blur-2xl"
                >
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 px-2 py-1 mb-1 font-semibold">
                    Core Ecosystem Platforms
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: 'mentormaze', name: 'MentorMaze', desc: 'Adaptive AI Mentorship & Socratic IDE', status: 'PROTOTYPE', statusColor: 'bg-lime-400/20 text-lime-300 border-lime-400/40' },
                      { id: 'collaborate', name: 'Collaborate', desc: 'Aegis-BFT Consensus for Multi-Agent Swarms', status: 'IN DEV', statusColor: 'bg-blue-400/20 text-blue-300 border-blue-400/40' },
                      { id: 'avsar', name: 'Avsar', desc: 'Research Grants & Fellowship Network', status: 'IN DEV', statusColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40' },
                      { id: 'iris', name: 'Iris', desc: 'Continuous Egocentric 3D Voxel Memory', status: 'IN DEV', statusColor: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40' },
                    ].map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleTabClick('products')}
                        className="p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group flex items-start justify-between gap-2"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white group-hover:text-lime-300 transition-colors">
                              {p.name}
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${p.statusColor}`}>
                              {p.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 line-clamp-1">
                            {p.desc}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10 px-2 flex justify-between items-center text-xs">
                    <span 
                      onClick={() => handleTabClick('products')}
                      className="text-accent-softblue hover:underline cursor-pointer font-medium flex items-center gap-1"
                    >
                      <span>Explore all 4 platforms</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* TAB 2: ENGINEERING (with Dropdown Flyout) */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('engineering')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleTabClick('engineering')}
              className={`relative px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer rounded-xl flex items-center gap-1.5 ${
                currentTab === 'engineering'
                  ? 'text-white bg-white/10 font-semibold'
                  : isDarkCanvas
                    ? 'text-white/80 hover:text-white hover:bg-white/5'
                    : 'text-brand-muted hover:text-brand-charcoal hover:bg-black/5 dark:text-dark-muted dark:hover:text-white dark:hover:bg-white/5'
              }`}
            >
              <span>Engineering</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'engineering' ? 'rotate-180 text-white' : 'opacity-60'}`} />
            </button>

            {/* Engineering Dropdown Preview */}
            <AnimatePresence>
              {activeDropdown === 'engineering' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: EDITORIAL_EASE }}
                  className="absolute top-full left-0 mt-1.5 w-76 p-3 rounded-2xl bg-[#0D131D] border border-white/15 shadow-2xl z-50 text-white backdrop-blur-2xl"
                >
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 px-2 py-1 mb-1 font-semibold">
                    Technical Architecture Notes
                  </div>
                  <div className="space-y-1">
                    <div 
                      onClick={() => handleTabClick('engineering')}
                      className="p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-white group-hover:text-accent-softblue">
                        <Terminal className="w-3.5 h-3.5 text-blue-400" />
                        <span>Aegis-BFT Consensus Daemon</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Sub-200ms Byzantine fault-tolerant linearizable state engine in Rust.
                      </p>
                    </div>

                    <div 
                      onClick={() => handleTabClick('engineering')}
                      className="p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-white group-hover:text-accent-softblue">
                        <Code2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>gVisor GPU Sandbox Execution</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Multi-tenant Triton/CUDA kernel boundary isolation & invariants.
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/10 px-2">
                    <span 
                      onClick={() => handleTabClick('engineering')}
                      className="text-xs text-accent-softblue hover:underline cursor-pointer font-medium flex items-center gap-1"
                    >
                      <span>Read all engineering breakdowns</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* TAB 3: RESEARCH (with Dropdown Flyout) */}
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('research')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleTabClick('research')}
              className={`relative px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer rounded-xl flex items-center gap-1.5 ${
                currentTab === 'research'
                  ? 'text-white bg-white/10 font-semibold'
                  : isDarkCanvas
                    ? 'text-white/80 hover:text-white hover:bg-white/5'
                    : 'text-brand-muted hover:text-brand-charcoal hover:bg-black/5 dark:text-dark-muted dark:hover:text-white dark:hover:bg-white/5'
              }`}
            >
              <span>Research</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'research' ? 'rotate-180 text-white' : 'opacity-60'}`} />
            </button>

            {/* Research Dropdown Preview */}
            <AnimatePresence>
              {activeDropdown === 'research' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: EDITORIAL_EASE }}
                  className="absolute top-full left-0 mt-1.5 w-80 p-3 rounded-2xl bg-[#0D131D] border border-white/15 shadow-2xl z-50 text-white backdrop-blur-2xl"
                >
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 px-2 py-1 mb-1 font-semibold">
                    Frontier Preprints & Experiments
                  </div>
                  <div className="space-y-1">
                    <div 
                      onClick={() => handleTabClick('research')}
                      className="p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-white group-hover:text-emerald-300">
                        <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Top-K Sparse Autoencoders</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Monosemantic feature purity vs dictionary expansion factors on Layer 28.
                      </p>
                    </div>

                    <div 
                      onClick={() => handleTabClick('research')}
                      className="p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-white group-hover:text-emerald-300">
                        <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                        <span>Iris 3D Spatial Occupancy HUD</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Egocentric 3D voxel tensor memory running at 88 FPS on Jetson AGX.
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/10 px-2">
                    <span 
                      onClick={() => handleTabClick('research')}
                      className="text-xs text-accent-softblue hover:underline cursor-pointer font-medium flex items-center gap-1"
                    >
                      <span>Explore research papers & BibTeX</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* TAB 4: UPDATES (with Live Journal Badge) */}
          <button
            onClick={() => handleTabClick('updates')}
            className={`relative px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer rounded-xl flex items-center gap-2 ${
              currentTab === 'updates'
                ? 'text-white bg-white/10 font-semibold'
                : isDarkCanvas
                  ? 'text-white/80 hover:text-white hover:bg-white/5'
                  : 'text-brand-muted hover:text-brand-charcoal hover:bg-black/5 dark:text-dark-muted dark:hover:text-white dark:hover:bg-white/5'
            }`}
          >
            <span>Updates</span>
            <span className="w-2 h-2 rounded-full bg-[#D9EF68] animate-pulse" title="Live Journal" />
          </button>

          {/* TAB 5: MEDIA */}
          <button
            onClick={() => handleTabClick('media')}
            className={`relative px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer rounded-xl ${
              currentTab === 'media'
                ? 'text-white bg-white/10 font-semibold'
                : isDarkCanvas
                  ? 'text-white/80 hover:text-white hover:bg-white/5'
                  : 'text-brand-muted hover:text-brand-charcoal hover:bg-black/5 dark:text-dark-muted dark:hover:text-white dark:hover:bg-white/5'
            }`}
          >
            <span>Media</span>
          </button>

          {/* TAB 6: ABOUT */}
          <button
            onClick={() => handleTabClick('about')}
            className={`relative px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer rounded-xl ${
              currentTab === 'about'
                ? 'text-white bg-white/10 font-semibold'
                : isDarkCanvas
                  ? 'text-white/80 hover:text-white hover:bg-white/5'
                  : 'text-brand-muted hover:text-brand-charcoal hover:bg-black/5 dark:text-dark-muted dark:hover:text-white dark:hover:bg-white/5'
            }`}
          >
            <span>About</span>
          </button>
        </nav>

        {/* =========================================================================
            3. RIGHT CONTROLS: SEARCH PILL, THEME, STUDIO ACCESS, EXPLORE CTA
            ========================================================================= */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Search Pill with ⌘K Badge */}
          <button
            onClick={onOpenSearch}
            className={`hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer border ${
              isDarkCanvas
                ? 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/15'
                : 'bg-black/5 hover:bg-black/10 text-brand-muted hover:text-brand-charcoal border-black/10 dark:bg-white/5 dark:border-white/15 dark:text-white/70'
            }`}
            aria-label="Search articles, papers, products, updates"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden md:inline font-sans">Search...</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-neutral-300 border border-white/15">
              ⌘K
            </kbd>
          </button>

          {/* Search Icon for Mobile */}
          <button
            onClick={onOpenSearch}
            className={`sm:hidden p-2 rounded-xl transition-colors cursor-pointer ${
              isDarkCanvas ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-brand-muted hover:text-brand-charcoal'
            }`}
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDarkCanvas
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : 'text-brand-muted hover:text-brand-charcoal hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/10'
            }`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300" />
            )}
          </button>

          {/* Editorial Studio Link (Discreet & Protected) */}
          <button
            onClick={() => handleTabClick('editorial-studio')}
            title="AI Tathastu Editorial Studio & Centralized CMS"
            className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono font-medium transition-colors cursor-pointer border ${
              isDarkCanvas
                ? 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border-white/15'
                : 'bg-black/5 hover:bg-black/10 text-neutral-600 hover:text-neutral-900 border-black/10 dark:bg-white/5 dark:border-white/15 dark:text-neutral-300'
            }`}
          >
            <Shield className="w-3 h-3 text-neutral-400" />
            <span>Studio</span>
          </button>

          {/* High-Contrast "Explore Products ↗" CTA Button */}
          <div className="hidden sm:block">
            <button
              onClick={() => handleTabClick('products')}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none bg-[#D9EF68] hover:bg-[#CEE854] active:bg-[#BFD843] text-[#080E17] shadow-sm hover:shadow-lime-500/20 group"
            >
              <span>Explore Products</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Drawer Hamburger Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              isDarkCanvas ? 'text-white hover:bg-white/10' : 'text-brand-charcoal dark:text-white hover:bg-black/5'
            }`}
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          4. MOBILE NAVIGATION DRAWER (MATTE DARK WITH TREE BRANCH LINES)
          ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: EDITORIAL_EASE }}
            className="lg:hidden bg-[#0D1219] border-b border-white/15 text-white overflow-hidden shadow-2xl"
          >
            <div className="p-4 sm:p-6 space-y-4 max-w-lg mx-auto">
              {/* Window Controls Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  AI Tathastu Navigation
                </span>
              </div>

              {/* Accordion Menu with Tree Lines */}
              <div className="space-y-2">
                {/* 1. Products Accordion */}
                <div className="space-y-1">
                  <button
                    onClick={() => setMobileExpandedGroup(mobileExpandedGroup === 'products' ? null : 'products')}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>Products & Systems</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileExpandedGroup === 'products' ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileExpandedGroup === 'products' && (
                    <div className="ml-5 pl-3.5 border-l border-neutral-700/70 space-y-1.5 py-1">
                      {[
                        { name: 'MentorMaze (AI Mentorship)', status: 'PROTOTYPE' },
                        { name: 'Collaborate (Agent Swarm Lab)', status: 'IN DEV' },
                        { name: 'Avsar (Grants Network)', status: 'IN DEV' },
                        { name: 'Iris (3D Spatial Vision)', status: 'IN DEV' },
                      ].map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleTabClick('products')}
                          className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-white/10 flex items-center justify-between"
                        >
                          <span>{item.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-neutral-400 font-semibold">
                            {item.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Engineering Direct Link */}
                <button
                  onClick={() => handleTabClick('engineering')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    <span>Engineering Dispatches</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {/* 3. Research Direct Link */}
                <button
                  onClick={() => handleTabClick('research')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <FlaskConical className="w-4 h-4 text-emerald-400" />
                    <span>Research Publications</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {/* 4. Updates Direct Link with Mint Badge */}
                <button
                  onClick={() => handleTabClick('updates')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <Clock className="w-4 h-4 text-[#D9EF68]" />
                    <span>Development Journal</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#7FE4C6] text-[#0A261C]">
                    Active
                  </span>
                </button>

                {/* 5. Media & About Links */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleTabClick('media')}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 text-center"
                  >
                    Media Stories
                  </button>
                  <button
                    onClick={() => handleTabClick('about')}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-neutral-300 text-center"
                  >
                    About Tathastu
                  </button>
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <button
                  onClick={() => handleTabClick('products')}
                  className="w-full py-2.5 rounded-full text-xs font-semibold bg-[#D9EF68] text-[#080E17] flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <span>Explore All Products</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleTabClick('editorial-studio')}
                  className="w-full py-2 rounded-full text-xs font-mono text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 flex items-center justify-center space-x-1.5 border border-white/10"
                >
                  <Shield className="w-3 h-3" />
                  <span>Access Editorial Studio (CMS)</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
