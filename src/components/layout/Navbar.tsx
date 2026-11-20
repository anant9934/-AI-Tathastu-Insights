import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Search, Menu, X, ArrowUpRight } from 'lucide-react';
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: NavTab; label: string }[] = [
    { id: 'products', label: 'Products' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'research', label: 'Research' },
    { id: 'updates', label: 'Updates' },
    { id: 'media', label: 'Media' },
    { id: 'about', label: 'About' },
  ];

  const handleTabClick = (tab: NavTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  const isOverHero = currentTab === 'home' && !isScrolled;

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
        isOverHero
          ? 'bg-[#060B14]/75 backdrop-blur-md border-b border-white/10 text-white'
          : 'backdrop-blur-md bg-brand-canvas/90 dark:bg-dark-bg/90 border-b border-brand-stone-dark/80 dark:border-dark-border text-brand-charcoal dark:text-dark-text'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div 
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm tracking-tighter shrink-0 transition-transform group-hover:scale-105 font-mono ${
              isOverHero
                ? 'bg-neutral-900 border border-white/20 text-white shadow-sm'
                : 'bg-brand-charcoal text-brand-canvas dark:bg-white dark:text-brand-charcoal shadow-sm'
            }`}
          >
            T
          </div>
          <div className="flex items-center gap-2">
            <span 
              className={`font-semibold text-lg sm:text-xl tracking-tight whitespace-nowrap font-display ${
                isOverHero ? 'text-white' : 'text-brand-charcoal dark:text-dark-text'
              }`}
            >
              AI Tathastu
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id || (link.id === 'products' && currentTab === 'ecosystem');
            return (
              <button
                key={link.id}
                onClick={() => handleTabClick(link.id)}
                className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer rounded-lg ${
                  isOverHero
                    ? isActive 
                      ? 'text-white font-semibold' 
                      : 'text-white/80 hover:text-white'
                    : isActive
                      ? 'text-brand-charcoal dark:text-dark-text font-semibold'
                      : 'text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full ${
                      isOverHero ? 'bg-white' : 'bg-brand-charcoal dark:bg-white'
                    }`}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isOverHero
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : 'text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text hover:bg-brand-stone dark:hover:bg-dark-elevated'
            }`}
            aria-label="Search articles, products, and notes"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isOverHero
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : 'text-brand-muted hover:text-brand-charcoal dark:text-dark-muted dark:hover:text-dark-text hover:bg-brand-stone dark:hover:bg-dark-elevated'
            }`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} reading mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300" />
            )}
          </button>

          {/* Direct CTA Button (Mockup match: "Explore products ↗" with pill outline) */}
          <div className="hidden sm:block">
            <button
              onClick={() => handleTabClick('products')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none ${
                isOverHero
                  ? 'bg-white/[0.08] hover:bg-white/20 border border-white/30 text-white shadow-sm'
                  : 'bg-brand-charcoal text-white hover:bg-brand-charcoal/90 dark:bg-white dark:text-brand-charcoal shadow-xs'
              }`}
            >
              <span>Explore products</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg ${
              isOverHero
                ? 'text-white hover:bg-white/10'
                : 'text-brand-charcoal dark:text-dark-text hover:bg-brand-stone dark:hover:bg-dark-elevated'
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: EDITORIAL_EASE }}
            className={`lg:hidden border-b px-4 pt-3 pb-6 space-y-1 ${
              isOverHero
                ? 'bg-[#080E17]/95 border-white/10 text-white'
                : 'bg-brand-canvas dark:bg-dark-bg border-brand-stone-dark dark:border-dark-border'
            }`}
          >
            {navLinks.map((link) => {
              const isActive = currentTab === link.id || (link.id === 'products' && currentTab === 'ecosystem');
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabClick(link.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    isActive
                      ? isOverHero
                        ? 'bg-white/15 text-white font-semibold'
                        : 'bg-brand-stone text-brand-charcoal dark:bg-dark-elevated dark:text-dark-text font-semibold'
                      : isOverHero
                        ? 'text-white/80 hover:text-white hover:bg-white/10'
                        : 'text-brand-muted hover:text-brand-charcoal hover:bg-brand-stone/60 dark:text-dark-muted dark:hover:text-dark-text'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
