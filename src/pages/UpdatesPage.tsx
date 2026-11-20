import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  Sparkles, 
  Tag, 
  Calendar, 
  ArrowRight, 
  ExternalLink, 
  Layers, 
  GraduationCap, 
  Users, 
  Award, 
  Eye, 
  CheckCircle2,
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Code2,
  BookOpen,
  FlaskConical,
  Building2,
  Cpu,
  ShieldCheck,
  ArrowUpRight,
  X,
  Mail,
  Loader2,
  Check,
  Terminal,
  FileCode,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { CompanyUpdate } from '../types';
import { Reveal } from '../components/motion/Reveal';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { EDITORIAL_EASE } from '../lib/motion';
import { api } from '../lib/api';

interface UpdatesPageProps {
  updates: CompanyUpdate[];
  onNavigateProduct?: (productId: string) => void;
  onShowToast?: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
  onNavigateTab?: (tab: string) => void;
}

type CategoryFilter = 'All Updates' | 'Products' | 'Engineering' | 'Research' | 'Experiments' | 'Company';
type ProductFilter = 'All Platforms' | 'mentormaze' | 'collaborate' | 'avsar' | 'iris';
type SortOrder = 'newest' | 'oldest';

export const UpdatesPage: React.FC<UpdatesPageProps> = ({
  updates,
  onNavigateProduct,
  onShowToast,
  onNavigateTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All Updates');
  const [selectedProduct, setSelectedProduct] = useState<ProductFilter>('All Platforms');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [activeModalUpdate, setActiveModalUpdate] = useState<CompanyUpdate | null>(null);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const shouldReduceMotion = useReducedMotion();

  // Find Featured Update (Priority: marked isFeatured, or first MentorMaze/Collaborate release)
  const featuredUpdate = useMemo(() => {
    return updates.find(u => u.isFeatured) || updates[0];
  }, [updates]);

  // Filter & Sort updates
  const filteredUpdates = useMemo(() => {
    let list = [...updates];

    // Category filter
    if (selectedCategory !== 'All Updates') {
      if (selectedCategory === 'Products') {
        list = list.filter(u => u.category === 'Product Release' || u.productId !== undefined);
      } else if (selectedCategory === 'Company') {
        list = list.filter(u => u.category === 'Company' || u.category === 'Milestone');
      } else {
        list = list.filter(u => u.category === selectedCategory);
      }
    }

    // Product filter
    if (selectedProduct !== 'All Platforms') {
      list = list.filter(u => u.productId === selectedProduct);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(u => 
        u.title.toLowerCase().includes(q) ||
        u.summary.toLowerCase().includes(q) ||
        (u.problem && u.problem.toLowerCase().includes(q)) ||
        (u.tags && u.tags.some(t => t.toLowerCase().includes(q))) ||
        (u.productId && u.productId.toLowerCase().includes(q))
      );
    }

    // Sort order
    list.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [updates, selectedCategory, selectedProduct, searchQuery, sortOrder]);

  // Group filtered updates by Month/Year for the Timeline
  const groupedTimeline = useMemo(() => {
    const groups: { [key: string]: CompanyUpdate[] } = {};
    filteredUpdates.forEach(update => {
      const dateObj = new Date(update.date);
      const monthYear = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recent Updates';
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(update);
    });
    return groups;
  }, [filteredUpdates]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please provide a valid research email address.');
      return;
    }

    try {
      setNewsletterStatus('loading');
      const res = await api.newsletter.subscribe(newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterMessage(res.message || 'Confirmation link dispatched to your inbox.');
      if (onShowToast) {
        onShowToast('Subscription Confirmed', 'You are now registered for AI Tathastu peer dispatches.', 'success');
      }
      setNewsletterEmail('');
    } catch (err: any) {
      setNewsletterStatus('error');
      setNewsletterMessage(err.message || 'Failed to register subscription. Please retry.');
    }
  };

  const getProductColorStyles = (productId?: string) => {
    switch (productId) {
      case 'mentormaze':
        return {
          icon: <GraduationCap className="w-4 h-4 text-[#D9EF68]" />,
          text: 'text-[#D9EF68]',
          bg: 'bg-[#D9EF68]/15 border-[#D9EF68]/30',
          badge: 'bg-[#D9EF68]/20 text-[#D9EF68] border-[#D9EF68]/40',
          dot: 'bg-[#D9EF68]',
          glow: 'from-violet-600/30 to-[#D9EF68]/20',
          label: 'MentorMaze',
        };
      case 'collaborate':
        return {
          icon: <Users className="w-4 h-4 text-blue-400" />,
          text: 'text-blue-400',
          bg: 'bg-blue-500/15 border-blue-400/30',
          badge: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
          dot: 'bg-blue-400',
          glow: 'from-blue-600/30 to-indigo-600/20',
          label: 'Collaborate',
        };
      case 'avsar':
        return {
          icon: <Award className="w-4 h-4 text-amber-400" />,
          text: 'text-amber-400',
          bg: 'bg-amber-500/15 border-amber-400/30',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
          dot: 'bg-amber-400',
          glow: 'from-amber-600/30 to-orange-600/20',
          label: 'Avsar',
        };
      case 'iris':
        return {
          icon: <Eye className="w-4 h-4 text-emerald-400" />,
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/15 border-emerald-400/30',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
          dot: 'bg-emerald-400',
          glow: 'from-emerald-600/30 to-teal-600/20',
          label: 'Iris',
        };
      default:
        return {
          icon: <Layers className="w-4 h-4 text-stone-400" />,
          text: 'text-stone-400',
          bg: 'bg-stone-500/15 border-stone-400/30',
          badge: 'bg-stone-500/15 text-stone-300 border-stone-400/30',
          dot: 'bg-stone-400',
          glow: 'from-stone-600/20 to-transparent',
          label: 'AI Tathastu',
        };
    }
  };

  const getProductPreviewImage = (productId?: string) => {
    switch (productId) {
      case 'mentormaze':
        return '/media/cards/card-products.png';
      case 'collaborate':
        return '/media/products/collaborate/collaborate-live.png';
      case 'avsar':
        return '/media/products/avsar/avsar-live.png';
      case 'iris':
        return '/media/cards/card-research.png';
      default:
        return '/media/hero/cinematic-hero-bg.jpg';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F4] dark:bg-[#080E17] text-[#151A20] dark:text-[#F8FAFC] transition-colors duration-300">
      
      {/* =========================================================================
          SECTION A: PAGE HEADER
         ========================================================================= */}
      <section className="border-b border-[#DDE2DF] dark:border-white/10 bg-white/70 dark:bg-[#0B121F]/80 backdrop-blur-md pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-3xl">
                {/* Eyebrow & Status */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-accent-blue font-semibold">
                    UPDATES • What's new.
                  </span>
                  <span className="text-stone-300 dark:text-stone-600">•</span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Development Journal</span>
                  </div>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 dark:text-white font-display">
                  What's changing at AI Tathastu.
                </h1>

                {/* Supporting Description */}
                <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                  Product releases, engineering progress, research and the work happening across our ecosystem.
                </p>
              </div>

              {/* Latest Publication Date & Quick Metrics */}
              <div className="p-4 rounded-2xl bg-[#F5F6F4] dark:bg-[#121B28] border border-[#DDE2DF] dark:border-stone-800 shrink-0 space-y-1.5">
                <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider block font-semibold">
                  Latest Dispatch
                </span>
                <span className="text-sm font-mono font-bold text-stone-900 dark:text-white block">
                  November 20, 2026
                </span>
                <span className="text-[11px] font-mono text-accent-blue block">
                  {updates.length} Published Updates • 4 Platforms
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

        {/* =========================================================================
            SECTION B: FEATURED UPDATE (Cinematic Image-Led Dark Surface)
           ========================================================================= */}
        {featuredUpdate && (
          <Reveal>
            <div className="relative rounded-3xl bg-[#080E17] text-white border border-white/10 shadow-xl overflow-hidden p-6 sm:p-10">
              {/* Luminous Orange/Violet Horizon Ambient Background */}
              <div className="absolute top-0 right-0 w-[550px] h-[400px] bg-gradient-to-bl from-orange-500/15 via-violet-600/15 to-transparent blur-[120px] pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Left Narrative Column */}
                <div className="w-full lg:w-[50%] space-y-4">
                  {/* Eyebrow & Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-md uppercase font-bold tracking-wider bg-white/10 text-[#D9EF68] border border-[#D9EF68]/40">
                      FEATURED UPDATE
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-stone-300 font-semibold">
                      {featuredUpdate.category}
                    </span>
                    {featuredUpdate.version && (
                      <>
                        <span className="text-white/40">•</span>
                        <span className="text-stone-300">
                          {featuredUpdate.version}
                        </span>
                      </>
                    )}
                    <span className="text-white/40">•</span>
                    <span className="text-stone-400">
                      {featuredUpdate.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-display leading-tight">
                    {featuredUpdate.title}
                  </h2>

                  {/* Author Attribution */}
                  <div className="flex items-center gap-2.5 pt-1">
                    {featuredUpdate.author?.avatar && (
                      <img
                        src={featuredUpdate.author.avatar}
                        alt={featuredUpdate.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-white/20"
                      />
                    )}
                    <span className="text-xs font-mono text-stone-300">
                      By <strong className="text-white">{featuredUpdate.author?.name || 'Tathastu Core Team'}</strong> ({featuredUpdate.author?.role || 'Systems Lead'})
                    </span>
                  </div>

                  {/* Editorial Narrative Grid (Problem → Change → Outcome) */}
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {featuredUpdate.problem && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[#E98770] font-mono font-bold block mb-1">↳ The Bottleneck</span>
                        <p className="text-stone-300 leading-snug line-clamp-2">{featuredUpdate.problem}</p>
                      </div>
                    )}
                    {featuredUpdate.outcome && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[#D9EF68] font-mono font-bold block mb-1">↳ Verified Outcome</span>
                        <p className="text-stone-300 leading-snug line-clamp-2">{featuredUpdate.outcome}</p>
                      </div>
                    )}
                  </div>

                  {/* Primary & Secondary Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <button
                      onClick={() => setActiveModalUpdate(featuredUpdate)}
                      className="bg-[#D9EF68] hover:bg-[#c9df58] text-[#080E17] px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
                    >
                      <span>Read Complete Update</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {featuredUpdate.productId && onNavigateProduct && (
                      <button
                        onClick={() => onNavigateProduct(featuredUpdate.productId!)}
                        className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-5 py-3 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>Explore Product Details</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Right UI Preview Frame */}
                <div className="w-full lg:w-[50%] relative">
                  <div className="w-full rounded-2xl bg-[#090D17] border border-white/15 shadow-2xl overflow-hidden group">
                    <div className="px-4 py-2.5 bg-[#0A0F1A] border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                        <span className="ml-2 text-[11px] font-mono text-stone-400">
                          tathastu // {featuredUpdate.productId || 'journal'} [Artifact View]
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {featuredUpdate.milestoneMetric ? `${featuredUpdate.milestoneMetric.label}: ${featuredUpdate.milestoneMetric.value}` : 'Verified Dispatch'}
                      </span>
                    </div>

                    <div className="relative bg-[#080E17] overflow-hidden flex items-center justify-center">
                      <img
                        src={getProductPreviewImage(featuredUpdate.productId)}
                        alt={featuredUpdate.title}
                        className="w-full h-auto object-cover max-h-[340px] select-none group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* =========================================================================
            SECTION C: UPDATE FILTERS & TOOLBAR
           ========================================================================= */}
        <section className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#101824] border border-[#DDE2DF] dark:border-stone-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {(['All Updates', 'Products', 'Engineering', 'Research', 'Experiments', 'Company'] as CategoryFilter[]).map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#151A20] text-white dark:bg-white dark:text-[#151A20] font-semibold shadow-xs'
                        : 'bg-stone-100/80 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {cat === 'Products' && <Layers className="w-3.5 h-3.5" />}
                    {cat === 'Engineering' && <Code2 className="w-3.5 h-3.5" />}
                    {cat === 'Research' && <FlaskConical className="w-3.5 h-3.5" />}
                    {cat === 'Experiments' && <Cpu className="w-3.5 h-3.5" />}
                    {cat === 'Company' && <Building2 className="w-3.5 h-3.5" />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Product Filter, Search, Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Product Selector Filter */}
              <div className="relative inline-flex items-center">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value as ProductFilter)}
                  className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium px-3 py-1.5 pr-8 rounded-xl border border-stone-200 dark:border-stone-700 appearance-none cursor-pointer focus:outline-hidden"
                >
                  <option value="All Platforms">All Platforms</option>
                  <option value="mentormaze">MentorMaze</option>
                  <option value="collaborate">Collaborate</option>
                  <option value="avsar">Avsar</option>
                  <option value="iris">Iris</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 pointer-events-none" />
              </div>

              {/* Sort Order */}
              <div className="relative inline-flex items-center">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium px-3 py-1.5 pr-8 rounded-xl border border-stone-200 dark:border-stone-700 appearance-none cursor-pointer focus:outline-hidden"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 pointer-events-none" />
              </div>

              {/* Search Bar */}
              <div className="relative flex items-center min-w-[200px] sm:min-w-[240px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search updates..."
                  className="w-full pl-9 pr-8 py-1.5 rounded-xl text-xs sm:text-sm bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-hidden focus:ring-1 focus:ring-accent-blue"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 p-0.5 rounded-full text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filter Clear Bar (if active) */}
          {(selectedCategory !== 'All Updates' || selectedProduct !== 'All Platforms' || searchQuery) && (
            <div className="flex items-center justify-between text-xs font-mono px-2 text-stone-500 dark:text-stone-400">
              <span>Showing {filteredUpdates.length} of {updates.length} updates</span>
              <button
                onClick={() => {
                  setSelectedCategory('All Updates');
                  setSelectedProduct('All Platforms');
                  setSearchQuery('');
                }}
                className="text-accent-blue hover:underline cursor-pointer flex items-center gap-1"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION D: DEVELOPMENT TIMELINE (Main Experience)
           ========================================================================= */}
        <section className="space-y-12">
          {Object.keys(groupedTimeline).length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#101824] border border-[#DDE2DF] dark:border-stone-800">
              <Search className="w-8 h-8 text-stone-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">No updates match your filter</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Try resetting your search query or switching to 'All Updates' to view the full changelog.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All Updates');
                  setSelectedProduct('All Platforms');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white dark:bg-white dark:text-black cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            Object.entries(groupedTimeline).map(([monthYear, monthUpdates]) => (
              <div key={monthYear} className="space-y-6">
                {/* Month/Year Group Header */}
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
                  <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-stone-900 dark:text-white">
                    {monthYear}
                  </h3>
                  <span className="text-xs font-mono text-stone-400">
                    ({monthUpdates.length} {monthUpdates.length === 1 ? 'entry' : 'entries'})
                  </span>
                  <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800 ml-2" />
                </div>

                {/* Timeline Line & Cards */}
                <div className="relative border-l-2 border-stone-200 dark:border-stone-800 ml-3.5 sm:ml-5 pl-6 sm:pl-10 space-y-8">
                  {monthUpdates.map((update, idx) => {
                    const colorStyle = getProductColorStyles(update.productId);

                    return (
                      <Reveal key={update.id} delay={idx * 0.05}>
                        <div className="relative group">
                          {/* Colored Timeline Node Indicator */}
                          <div className={`absolute -left-[31px] sm:-left-[47px] top-6 w-4 h-4 rounded-full bg-white dark:bg-[#080E17] border-2 ${colorStyle.text.replace('text-', 'border-')} flex items-center justify-center group-hover:scale-125 transition-transform shadow-xs`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${colorStyle.dot}`} />
                          </div>

                          {/* Card Content (Varied Layouts based on updateType) */}
                          <div 
                            onClick={() => setActiveModalUpdate(update)}
                            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101824] border border-[#DDE2DF] dark:border-stone-800 shadow-xs hover:shadow-md hover:border-stone-400 dark:hover:border-stone-600 transition-all cursor-pointer space-y-4"
                          >
                            {/* Card Top: Badges, Date, Version */}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase font-bold tracking-wider flex items-center gap-1.5 border ${colorStyle.badge}`}>
                                  {colorStyle.icon}
                                  <span>{update.category}</span>
                                </span>

                                {update.productId && (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 font-semibold">
                                    {colorStyle.label}
                                  </span>
                                )}

                                {update.version && (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800">
                                    {update.version}
                                  </span>
                                )}
                              </div>

                              <span className="text-xs font-mono text-stone-500 dark:text-stone-400 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {update.date}
                              </span>
                            </div>

                            {/* Title & Summary */}
                            <div>
                              <h4 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white group-hover:text-accent-blue transition-colors leading-snug">
                                {update.title}
                              </h4>
                              <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                                {update.summary}
                              </p>
                            </div>

                            {/* Narrative Columns: Problem & Outcome Highlights */}
                            {(update.problem || update.outcome) && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                                {update.problem && (
                                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800">
                                    <span className="text-red-600 dark:text-red-400 font-mono font-semibold block mb-0.5">
                                      Problem Addressed:
                                    </span>
                                    <p className="text-stone-700 dark:text-stone-300 line-clamp-2 leading-relaxed">
                                      {update.problem}
                                    </p>
                                  </div>
                                )}
                                {update.outcome && (
                                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800">
                                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold block mb-0.5">
                                      Verified Outcome:
                                    </span>
                                    <p className="text-stone-700 dark:text-stone-300 line-clamp-2 leading-relaxed">
                                      {update.outcome}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Embedded Code Snippet (For Technical Entries) */}
                            {update.codeSnippet && (
                              <div className="rounded-xl bg-[#090D17] border border-stone-800 overflow-hidden text-xs">
                                <div className="px-3.5 py-1.5 bg-[#0D1524] border-b border-stone-800/80 flex items-center justify-between text-stone-400 font-mono text-[11px]">
                                  <div className="flex items-center gap-1.5">
                                    <Terminal className="w-3.5 h-3.5 text-accent-blue" />
                                    <span>{update.codeSnippet.title}</span>
                                  </div>
                                  <span className="uppercase text-[10px] text-stone-500 font-bold">{update.codeSnippet.language}</span>
                                </div>
                                <pre className="p-3.5 text-stone-300 font-mono overflow-x-auto text-[11px] leading-relaxed">
                                  <code>{update.codeSnippet.code}</code>
                                </pre>
                              </div>
                            )}

                            {/* Card Footer: Author + Metric + Read More */}
                            <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center gap-2.5">
                                {update.author?.avatar && (
                                  <img
                                    src={update.author.avatar}
                                    alt={update.author.name}
                                    className="w-7 h-7 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                                  />
                                )}
                                <div>
                                  <span className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                                    {update.author?.name || 'Tathastu Core Team'}
                                  </span>
                                  <span className="block text-[10px] font-mono text-stone-500 dark:text-stone-400">
                                    {update.author?.affiliation || 'AI Tathastu'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {update.milestoneMetric && (
                                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                                    {update.milestoneMetric.label}: <strong className="text-stone-900 dark:text-white">{update.milestoneMetric.value}</strong>
                                  </span>
                                )}

                                <span className="text-xs font-bold text-accent-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                  <span>Read complete log</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>

        {/* =========================================================================
            SECTION E: PRODUCT DEVELOPMENT UPDATES (Ecosystem Platforms Status)
           ========================================================================= */}
        <section className="pt-8 border-t border-[#DDE2DF] dark:border-stone-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent-blue font-semibold">
                Ecosystem Progress
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-stone-900 dark:text-white mt-1">
                Product Development Status
              </h3>
            </div>
            <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
              Verified live development logs across our 4 foundational platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                id: 'mentormaze',
                name: 'MentorMaze',
                status: 'PROTOTYPE',
                badgeStyle: 'bg-[#D9EF68]/20 text-[#D9EF68] border-[#D9EF68]/40',
                latest: 'MentorMaze 3.2: Speculative Socratic Reasoning (240ms latency)',
                features: ['Socratic Proof Debugger', 'Interactive CUDA Sandbox', 'Spaced Repetition'],
                image: '/media/cards/card-products.png',
                icon: <GraduationCap className="w-5 h-5 text-[#D9EF68]" />
              },
              {
                id: 'collaborate',
                name: 'Collaborate',
                status: 'IN DEVELOPMENT',
                badgeStyle: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
                latest: 'Collaborate 2.4: Aegis-BFT Byzantine consensus daemon deployed',
                features: ['2f + 1 Quorum Signatures', 'Live CRDT Notebooks', 'Reproducible Capsules'],
                image: '/media/products/collaborate/collaborate-live.png',
                icon: <Users className="w-5 h-5 text-blue-400" />
              },
              {
                id: 'avsar',
                name: 'Avsar',
                status: 'IN DEVELOPMENT',
                badgeStyle: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
                latest: '$2.4M non-dilutive research micro-grants seeded to 120 fellows',
                features: ['Proof-of-Contribution Scoring', '72-Hour Disbursals', 'Global Talent Registry'],
                image: '/media/products/avsar/avsar-live.png',
                icon: <Award className="w-5 h-5 text-amber-400" />
              },
              {
                id: 'iris',
                name: 'Iris',
                status: 'IN DEVELOPMENT',
                badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
                latest: 'Iris 2.1: Continuous 3D egocentric voxel memory at 88 FPS',
                features: ['Continuous Voxel Tensor', 'Affordance Projection', 'Edge Jetson Kernel'],
                image: '/media/cards/card-research.png',
                icon: <Eye className="w-5 h-5 text-emerald-400" />
              }
            ].map((prod) => (
              <div
                key={prod.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#101824] border border-[#DDE2DF] dark:border-stone-800 shadow-xs flex flex-col justify-between group hover:border-stone-400 transition-all"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                      {prod.icon}
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider border ${prod.badgeStyle}`}>
                      {prod.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-stone-900 dark:text-white group-hover:text-accent-blue transition-colors">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-snug">
                    {prod.latest}
                  </p>

                  {/* Feature Pills */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {prod.features.map(f => (
                      <span key={f} className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={() => {
                      if (onNavigateProduct) onNavigateProduct(prod.id);
                    }}
                    className="text-xs font-semibold text-stone-900 dark:text-white hover:text-accent-blue flex items-center justify-between w-full cursor-pointer"
                  >
                    <span>View Platform Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION F: ENGINEERING & RESEARCH HIGHLIGHTS
           ========================================================================= */}
        <section className="pt-8 border-t border-[#DDE2DF] dark:border-stone-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent-blue font-semibold">
                Technical Highlights
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-stone-900 dark:text-white mt-1">
                Engineering &amp; Research Dispatches
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateTab && onNavigateTab('engineering')}
                className="text-xs font-semibold text-accent-blue hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore Engineering</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-stone-300 dark:text-stone-700">•</span>
              <button
                onClick={() => onNavigateTab && onNavigateTab('research')}
                className="text-xs font-semibold text-accent-blue hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore Research</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#101824] border border-[#DDE2DF] dark:border-stone-800 shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold text-accent-blue uppercase tracking-wider">
                Distributed Consensus
              </span>
              <h4 className="font-bold text-base text-stone-900 dark:text-white">
                Aegis-BFT Protocol Specification
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Asynchronous Byzantine consensus engine bounding turn-taking latencies to under 200ms across 64 heterogeneous research agents.
              </p>
              <div className="pt-2 text-xs font-mono text-stone-500">
                Verified Invariant: Linearizable Commits
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#101824] border border-[#DDE2DF] dark:border-stone-800 shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold text-accent-violet uppercase tracking-wider">
                Mechanistic Interpretability
              </span>
              <h4 className="font-bold text-base text-stone-900 dark:text-white">
                Residual Stream Monosemantic Dictionaries
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                65,536-feature Top-K Sparse Autoencoders profiling circuit activations in 70B parameter open weights with zero perplexity drift.
              </p>
              <div className="pt-2 text-xs font-mono text-stone-500">
                Metric: 0.0024 nats Reconstruction Loss
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#101824] border border-[#DDE2DF] dark:border-stone-800 shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold text-accent-mint uppercase tracking-wider">
                Embodied Perception
              </span>
              <h4 className="font-bold text-base text-stone-900 dark:text-white">
                Continuous 3D Spatial Voxel Permanence
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Persistent volumetric occupancy grids running at 88 FPS on embedded NVIDIA Jetson Orin silicon for robotic affordance grounding.
              </p>
              <div className="pt-2 text-xs font-mono text-stone-500">
                Throughput: 88 FPS @ 4.2W Power
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION G: WHAT'S NEXT (Public Plans & Transparency Roadmap)
           ========================================================================= */}
        <section className="pt-8 border-t border-[#DDE2DF] dark:border-stone-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent-blue font-semibold">
                Transparent Roadmap
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-stone-900 dark:text-white mt-1">
                What's Next
              </h3>
            </div>
            <p className="text-xs font-mono text-stone-500 dark:text-stone-400">
              Public milestones scheduled by authorized editors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                milestone: 'Lean 4 Formal Proof DAG Integration',
                product: 'MentorMaze',
                phase: 'Phase 1',
                target: 'Q4 2026',
                status: 'Planned',
                statusBadge: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
                desc: 'Embedding interactive Lean 4 verification kernels directly into the pedagogical scaffolding loop.'
              },
              {
                milestone: 'Federated Campus GPU Compute Nodes',
                product: 'Collaborate',
                phase: 'Phase 2',
                target: 'Q1 2027',
                status: 'In Development',
                statusBadge: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
                desc: 'Allowing university labs to pool idle H100/L4 instances into a secure Aegis peer consensus swarm.'
              },
              {
                milestone: 'Dynamic Tactile Affordance Projection',
                product: 'Iris',
                phase: 'Phase 3',
                target: 'Q2 2027',
                status: 'Under Evaluation',
                statusBadge: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700',
                desc: 'Extending 3D spatial occupancy memory with real-time robotic hand grasping affordances.'
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-[#101824] border border-[#DDE2DF] dark:border-stone-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-accent-blue font-semibold">
                    {plan.product} • {plan.target}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider border ${plan.statusBadge}`}>
                    {plan.status}
                  </span>
                </div>
                <h4 className="font-bold text-base text-stone-900 dark:text-white">
                  {plan.milestone}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {plan.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION H: NEWSLETTER ("Stay close to the work.")
           ========================================================================= */}
        <section className="relative rounded-3xl bg-[#080E17] text-white border border-white/10 p-8 sm:p-12 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-[500px] h-[350px] bg-gradient-to-bl from-orange-500/15 via-teal-500/10 to-transparent blur-[110px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D9EF68] font-bold">
              PEER RESEARCH DISPATCH
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white">
              Stay close to the work.
            </h3>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              Get occasional updates about products, engineering and research from AI Tathastu.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="pt-2 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your research email"
                disabled={newsletterStatus === 'loading'}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-stone-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9EF68]"
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="px-6 py-3 rounded-xl bg-[#D9EF68] hover:bg-[#c9df58] text-[#080E17] font-bold text-sm transition-transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                {newsletterStatus === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {newsletterStatus === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{newsletterMessage}</span>
              </div>
            )}

            {newsletterStatus === 'error' && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <X className="w-4 h-4 shrink-0" />
                <span>{newsletterMessage}</span>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* =========================================================================
          SECTION I: COMPREHENSIVE UPDATE DETAIL MODAL / DRAWER
         ========================================================================= */}
      <AnimatePresence>
        {activeModalUpdate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalUpdate(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
              className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#101824] border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header Bar */}
              <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400">
                  <span className="uppercase font-bold text-accent-blue">{activeModalUpdate.category}</span>
                  <span>•</span>
                  <span>{activeModalUpdate.date}</span>
                </div>
                <button
                  onClick={() => setActiveModalUpdate(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white font-display">
                    {activeModalUpdate.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-3">
                    {activeModalUpdate.author?.avatar && (
                      <img
                        src={activeModalUpdate.author.avatar}
                        alt={activeModalUpdate.author.name}
                        className="w-8 h-8 rounded-full object-cover border border-stone-200"
                      />
                    )}
                    <div>
                      <span className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                        {activeModalUpdate.author?.name || 'Tathastu Core Team'}
                      </span>
                      <span className="block text-[11px] font-mono text-stone-500">
                        {activeModalUpdate.author?.affiliation || 'AI Tathastu'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hero Preview Image if Available */}
                {activeModalUpdate.coverImage && (
                  <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-[#090D17]">
                    <img
                      src={activeModalUpdate.coverImage}
                      alt={activeModalUpdate.title}
                      className="w-full h-auto max-h-[300px] object-cover"
                    />
                  </div>
                )}

                {/* Narrative Sections */}
                <div className="space-y-4 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {activeModalUpdate.problem && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-1">
                      <strong className="text-xs font-mono uppercase tracking-wider text-red-600 dark:text-red-400 block">
                        Why did we make this change? (Problem)
                      </strong>
                      <p>{activeModalUpdate.problem}</p>
                    </div>
                  )}

                  {activeModalUpdate.workUndertaken && (
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1">
                      <strong className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                        How was it implemented? (Engineering Exploration)
                      </strong>
                      <p>{activeModalUpdate.workUndertaken}</p>
                    </div>
                  )}

                  {activeModalUpdate.outcome && (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                      <strong className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                        Outcome &amp; Verified Invariants
                      </strong>
                      <p>{activeModalUpdate.outcome}</p>
                    </div>
                  )}

                  {activeModalUpdate.whatsNext && (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-1">
                      <strong className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                        What's Next?
                      </strong>
                      <p>{activeModalUpdate.whatsNext}</p>
                    </div>
                  )}

                  {/* Body Paragraphs */}
                  <div className="space-y-3 pt-2">
                    {activeModalUpdate.content.map((paragraph, pIdx) => (
                      <p key={pIdx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Code Snippet if Present */}
                  {activeModalUpdate.codeSnippet && (
                    <div className="pt-2">
                      <div className="rounded-xl bg-[#090D17] border border-stone-800 overflow-hidden text-xs">
                        <div className="px-3.5 py-1.5 bg-[#0D1524] border-b border-stone-800 text-stone-400 font-mono text-[11px] flex justify-between">
                          <span>{activeModalUpdate.codeSnippet.title}</span>
                          <span className="uppercase">{activeModalUpdate.codeSnippet.language}</span>
                        </div>
                        <pre className="p-4 text-stone-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
                          <code>{activeModalUpdate.codeSnippet.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Related Links */}
                  {activeModalUpdate.relatedLinks && (
                    <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                        Related Documentation &amp; Artifacts
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeModalUpdate.relatedLinks.map((link, lIdx) => (
                          <a
                            key={lIdx}
                            href={link.url}
                            className="text-xs font-mono text-accent-blue hover:underline flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800"
                          >
                            <span>{link.label}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
