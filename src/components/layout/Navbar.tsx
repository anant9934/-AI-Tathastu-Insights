import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Search, Menu, X, Sparkles, BookOpen, Layers, Newspaper, Video, PenTool } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { AnimatedButton } from '../motion/AnimatedButton';
import { EDITORIAL_EASE } from '../../lib/motion';

export type NavTab = 
  | 'home' 
  | 'articles' 
  | 'research' 
  | 'discover' 
  | 'ecosystem' 
  | 'media' 
  | 'editorial-studio' 
  | 'about';

interface NavbarProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavTab; label: string; icon?: React.ReactNode }[] = [
    { id: 'home', label: 'Journal' },
    { id: 'research', label: 'Research Library' },
    { id: 'discover', label: 'Topics' },
    { id: 'ecosystem', label: 'Ecosystem' },
    { id: 'media', label: 'Media' },
    { id: 'editorial-studio', label: 'Editorial Studio' },
    { id: 'about', label: 'Charter' },
  ];

  const handleTabClick = (tab: NavTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-foundation-ivory/90 dark:bg-dark-bg/90 border-b border-foundation-charcoal/10 dark:border-dark-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-xl bg-foundation-charcoal text-foundation-ivory dark:bg-white dark:text-foundation-charcoal flex items-center justify-center font-editorial-serif font-bold text-lg shadow-sm group-hover:rotate-6 transition-transform">
            T
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-editorial-serif text-xl sm:text-2xl font-semibold tracking-tight text-foundation-charcoal dark:text-dark-text">
                AI Tathastu
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded bg-accent-lavender text-accent-violet dark:bg-accent-violet/20 dark:text-accent-lavender">
                Insights
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links with Animated Underline */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id || (link.id === 'home' && currentTab === 'articles');
            return (
              <button
                key={link.id}
                onClick={() => handleTabClick(link.id)}
                className={`relative px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer rounded-lg ${
                  isActive
                    ? 'text-foundation-charcoal dark:text-dark-text'
                    : 'text-foundation-muted hover:text-foundation-charcoal dark:text-dark-muted dark:hover:text-dark-text'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent-violet rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-foundation-muted hover:text-foundation-charcoal dark:text-dark-muted dark:hover:text-dark-text rounded-xl hover:bg-foundation-charcoal/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Search articles and research"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle (Light default / Dark reading mode) */}
          <button
            onClick={toggleTheme}
            className="p-2 text-foundation-muted hover:text-foundation-charcoal dark:text-dark-muted dark:hover:text-dark-text rounded-xl hover:bg-foundation-charcoal/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} reading mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300" />
            )}
          </button>

          {/* Editorial Studio Quick Access Button */}
          <div className="hidden sm:block">
            <AnimatedButton
              size="sm"
              variant={currentTab === 'editorial-studio' ? 'secondary' : 'outline'}
              onClick={() => handleTabClick('editorial-studio')}
              icon={<PenTool className="w-3.5 h-3.5" />}
              iconPosition="left"
            >
              Submit Paper
            </AnimatedButton>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foundation-charcoal dark:text-dark-text rounded-xl hover:bg-foundation-charcoal/5 dark:hover:bg-white/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
            className="lg:hidden border-t border-foundation-charcoal/10 dark:border-dark-border bg-foundation-ivory dark:bg-dark-surface px-4 py-4 space-y-1"
          >
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabClick(link.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-accent-lavender text-accent-violet dark:bg-accent-violet/20 dark:text-accent-lavender'
                      : 'text-foundation-charcoal dark:text-dark-text hover:bg-foundation-charcoal/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-accent-violet" />}
                </button>
              );
            })}

            <div className="pt-3 border-t border-foundation-charcoal/10 dark:border-dark-border">
              <button
                onClick={() => handleTabClick('editorial-studio')}
                className="w-full py-2.5 px-4 text-center text-sm font-medium rounded-xl bg-foundation-charcoal text-white dark:bg-white dark:text-foundation-charcoal"
              >
                Editorial Studio & Submissions
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
