import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  GraduationCap, 
  Users, 
  Award, 
  Eye, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  Cpu, 
  ShieldCheck,
  Terminal,
  Activity,
  AlertCircle,
  Clock,
  Calendar,
  Check,
  Code2,
  Workflow,
  HelpCircle,
  FileText,
  Compass,
  ArrowUpRight,
  LayoutGrid,
  List,
  BookOpen,
  Filter,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { EcosystemProduct } from '../types';
import { AnimatedButton } from '../components/motion/AnimatedButton';
import { Reveal } from '../components/motion/Reveal';
import { EDITORIAL_EASE } from '../lib/motion';

interface EcosystemPageProps {
  products: EcosystemProduct[];
  selectedProduct?: EcosystemProduct | null;
  onSelectProduct: (product: EcosystemProduct) => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

type CategoryFilter = 'All Products' | 'Education' | 'Infrastructure' | 'Research' | 'Platforms';
type SortOption = 'Featured' | 'Recently Updated' | 'Name';
type ViewMode = 'grid' | 'list';

export const EcosystemPage: React.FC<EcosystemPageProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<string>(selectedProduct ? selectedProduct.id : 'mentormaze');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All Products');
  const [sortBy, setSortBy] = useState<SortOption>('Featured');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSpecsDrawer, setShowSpecsDrawer] = useState<boolean>(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (selectedProduct) {
      setActiveTab(selectedProduct.id);
    }
  }, [selectedProduct]);

  // Current active product
  const currentProduct = useMemo(() => {
    return products.find((p) => p.id === activeTab) || products[0];
  }, [products, activeTab]);

  // Filtered & Sorted products for "All Platforms"
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (categoryFilter === 'Education') {
      result = result.filter(p => p.id === 'mentormaze' || p.badge.toLowerCase().includes('education'));
    } else if (categoryFilter === 'Infrastructure') {
      result = result.filter(p => p.id === 'collaborate' || p.badge.toLowerCase().includes('infrastructure'));
    } else if (categoryFilter === 'Research') {
      result = result.filter(p => p.id === 'iris' || p.id === 'collaborate' || p.badge.toLowerCase().includes('research'));
    } else if (categoryFilter === 'Platforms') {
      result = result.filter(p => p.id === 'avsar' || p.badge.toLowerCase().includes('platform') || p.badge.toLowerCase().includes('network'));
    }

    // Sort order
    if (sortBy === 'Name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Recently Updated') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [products, categoryFilter, sortBy]);

  const handleSelectProduct = (productId: string) => {
    setActiveTab(productId);
    const target = products.find(p => p.id === productId);
    if (target) {
      onSelectProduct(target);
    }
  };

  // Helper for Product Icon
  const getProductIcon = (id: string, className = "w-5 h-5") => {
    switch (id) {
      case 'mentormaze':
        return <GraduationCap className={className} />;
      case 'collaborate':
        return <Users className={className} />;
      case 'avsar':
        return <Award className={className} />;
      case 'iris':
        return <Eye className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  // Semantic Accent Colors & Styles
  const getProductColorStyles = (id: string) => {
    switch (id) {
      case 'mentormaze':
        return {
          iconColor: 'text-[#D9EF68]',
          iconBg: 'bg-[#D9EF68]/15 border-[#D9EF68]/30',
          activeBorder: 'border-[#D9EF68] ring-1 ring-[#D9EF68]/50 shadow-[0_0_25px_rgba(217,239,104,0.18)]',
          badgeStyle: 'bg-[#D9EF68]/20 text-[#D9EF68] border-[#D9EF68]/40',
          ambientGlow: 'from-violet-600/35 via-indigo-600/25 to-[#D9EF68]/20',
          metaColor: 'text-[#D9EF68]',
        };
      case 'collaborate':
        return {
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-500/15 border-blue-400/30',
          activeBorder: 'border-blue-400 ring-1 ring-blue-400/50 shadow-[0_0_25px_rgba(96,165,250,0.2)]',
          badgeStyle: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
          ambientGlow: 'from-blue-600/35 via-cyan-600/25 to-indigo-600/20',
          metaColor: 'text-blue-500',
        };
      case 'avsar':
        return {
          iconColor: 'text-amber-400',
          iconBg: 'bg-amber-500/15 border-amber-400/30',
          activeBorder: 'border-amber-400 ring-1 ring-amber-400/50 shadow-[0_0_25px_rgba(251,191,36,0.2)]',
          badgeStyle: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
          ambientGlow: 'from-amber-600/35 via-orange-600/25 to-red-600/20',
          metaColor: 'text-amber-500',
        };
      case 'iris':
        return {
          iconColor: 'text-emerald-400',
          iconBg: 'bg-emerald-500/15 border-emerald-400/30',
          activeBorder: 'border-emerald-400 ring-1 ring-emerald-400/50 shadow-[0_0_25px_rgba(52,211,153,0.2)]',
          badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
          ambientGlow: 'from-emerald-600/35 via-teal-600/25 to-cyan-600/20',
          metaColor: 'text-emerald-500',
        };
      default:
        return {
          iconColor: 'text-stone-300',
          iconBg: 'bg-white/10 border-white/20',
          activeBorder: 'border-white ring-1 ring-white/50 shadow-md',
          badgeStyle: 'bg-white/10 text-stone-300 border-white/20',
          ambientGlow: 'from-stone-600/20 via-stone-500/10 to-transparent',
          metaColor: 'text-stone-500',
        };
    }
  };

  // Actual UI Image mapping for each product
  const getProductPreviewImage = (id: string) => {
    switch (id) {
      case 'mentormaze':
        return '/media/cards/card-products.png';
      case 'collaborate':
        return '/media/products/collaborate/collaborate-live.png';
      case 'avsar':
        return '/media/products/avsar/avsar-live.png';
      case 'iris':
        return '/media/cards/card-research.png';
      default:
        return '/media/cards/card-products.png';
    }
  };

  const currentColorStyle = getProductColorStyles(currentProduct.id);

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#080E17] transition-colors duration-300">
      
      {/* =========================================================================
          SECTION B: CINEMATIC PRODUCTS HERO (Dark Midnight Navy #080E17 + Arc)
         ========================================================================= */}
      <section className="relative w-full bg-[#080E17] text-white overflow-hidden pt-12 pb-16 sm:pb-20 border-b border-white/10">
        
        {/* Subtle Atmospheric Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080E17] via-[#0B1320] to-[#080E17] pointer-events-none" />

        {/* Ambient Orange & Coral Corona Lighting (Top Right) */}
        <div className="absolute -top-24 right-0 w-[700px] h-[500px] bg-gradient-to-bl from-orange-500/20 via-amber-600/10 to-transparent blur-[130px] pointer-events-none -z-0" />

        {/* Architectural Glowing Horizon Arc SVG (Pixel-Matched to Reference) */}
        <div className="absolute right-0 top-0 w-full max-w-[950px] h-full pointer-events-none select-none -z-0 overflow-visible opacity-95">
          <svg
            className="w-full h-full"
            viewBox="0 0 950 480"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="productsHorizonGrad" x1="950" y1="40" x2="280" y2="480" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFA245" stopOpacity="0.95" />
                <stop offset="28%" stopColor="#FF7A1A" stopOpacity="0.85" />
                <stop offset="65%" stopColor="#E64A19" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#080E17" stopOpacity="0" />
              </linearGradient>
              <filter id="heroHorizonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="32" result="blur" />
              </filter>
              <filter id="heroHorizonCore" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="6" result="blur" />
              </filter>
            </defs>

            {/* Diffuse Outer Ambient Band */}
            <path
              d="M950 50 C800 100 620 230 480 370 C400 430 330 470 240 480"
              stroke="url(#productsHorizonGrad)"
              strokeWidth="75"
              strokeLinecap="round"
              filter="url(#heroHorizonGlow)"
              opacity="0.8"
            />

            {/* Luminous Razor-Sharp Curved Horizon Crescent */}
            <path
              d="M950 50 C800 100 620 230 480 370 C400 430 330 470 240 480"
              stroke="url(#productsHorizonGrad)"
              strokeWidth="15"
              strokeLinecap="round"
              filter="url(#heroHorizonCore)"
            />

            {/* High-intensity White-Gold Core Rim */}
            <path
              d="M950 50 C800 100 620 230 480 370"
              stroke="#FFE8A3"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.95"
            />

            {/* Silhouette Horizon Mask (Curve Below The Arc) */}
            <path
              d="M950 52 C800 102 620 232 480 372 C400 432 330 472 240 482 L950 482 Z"
              fill="#060A13"
              opacity="0.92"
            />
          </svg>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display">
                Products &amp; Systems
              </h1>
              <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl font-normal">
                We document what we build, why we build it, and how each system operates. Explore our four foundational platforms below.
              </p>
            </div>
          </Reveal>

          {/* =========================================================================
              SECTION C: FOUR PRODUCT SELECTORS (Horizontal Cards with Verified Status)
             ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {products.map((prod) => {
              const isActive = activeTab === prod.id;
              const colorStyle = getProductColorStyles(prod.id);
              
              return (
                <button
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod.id)}
                  className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[120px] ${
                    isActive
                      ? `bg-[#101A27]/95 border-2 ${colorStyle.activeBorder}`
                      : 'bg-[#0D1522]/65 hover:bg-[#121B29]/80 border border-white/10 hover:border-white/25 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`p-2.5 rounded-xl border ${colorStyle.iconBg}`}>
                      {getProductIcon(prod.id, `w-5 h-5 ${colorStyle.iconColor}`)}
                    </div>
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-md uppercase font-bold tracking-wider border ${
                      prod.status === 'Prototype'
                        ? 'bg-[#D9EF68]/20 text-[#D9EF68] border-[#D9EF68]/40'
                        : 'bg-white/5 text-stone-300 border-white/10'
                    }`}>
                      {prod.status === 'Prototype' ? 'PROTOTYPE' : 'IN DEVELOPMENT'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white tracking-tight">
                      {prod.name}
                    </h3>
                    <p className="text-xs font-mono text-stone-400 truncate mt-0.5">
                      {prod.badge}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          WARM PRODUCT DISCOVERY AREA (Off-White #FAF9F6 Surface)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        
        {/* =========================================================================
            SECTION D: PRODUCT DISCOVERY TOOLBAR (Categories, Sorting & View Toggle)
           ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(['All Products', 'Education', 'Infrastructure', 'Research', 'Platforms'] as CategoryFilter[]).map((cat) => {
              const isSelected = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#101A27] text-white dark:bg-white dark:text-[#080E17] shadow-xs font-semibold'
                      : 'bg-white dark:bg-[#121B28] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-50 dark:hover:bg-[#182333]'
                  }`}
                >
                  {cat === 'Education' && <GraduationCap className="w-3.5 h-3.5" />}
                  {cat === 'Infrastructure' && <Code2 className="w-3.5 h-3.5" />}
                  {cat === 'Research' && <FlaskConicalIcon className="w-3.5 h-3.5" />}
                  {cat === 'Platforms' && <Layers className="w-3.5 h-3.5" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Sort Dropdown & View Mode */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Sort Selector */}
            <div className="relative inline-flex items-center">
              <span className="text-xs text-stone-500 dark:text-stone-400 font-mono mr-2">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-white dark:bg-[#121B28] text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium px-3 py-1.5 pr-8 rounded-xl border border-stone-200 dark:border-stone-800 appearance-none cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-stone-400"
              >
                <option value="Featured">Featured</option>
                <option value="Recently Updated">Recently Updated</option>
                <option value="Name">Name</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 pointer-events-none" />
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-white dark:bg-[#121B28] border border-stone-200 dark:border-stone-800 shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                }`}
                aria-label="Grid layout view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                }`}
                aria-label="List layout view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION E: FEATURED PRODUCT DETAIL SHOWCASE (Large Asymmetrical Card)
           ========================================================================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
            className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#101824] border border-stone-200/90 dark:border-stone-800 shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
          >
            {/* Left Column: Product Information & CTAs */}
            <div className="w-full lg:w-[48%] space-y-4">
              {/* Category, Version & Status */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {currentProduct.badge.toUpperCase()}
                </span>
                <span className="text-stone-300 dark:text-stone-600">•</span>
                <span className="text-stone-500 dark:text-stone-400">
                  Version {currentProduct.version || 'Prototype v0.8'}
                </span>
                <span className="text-stone-300 dark:text-stone-600">•</span>
                <span className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {currentProduct.status || 'Prototype'}
                </span>
              </div>

              {/* Product Title */}
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 dark:text-white font-display">
                {currentProduct.name}
              </h2>

              {/* Product Subtitle / Tagline */}
              <p className="text-base sm:text-lg font-semibold text-stone-800 dark:text-stone-200 leading-snug">
                {currentProduct.tagline}
              </p>

              {/* Authentic Product Description */}
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed pt-1">
                {currentProduct.id === 'mentormaze'
                  ? 'MentorMaze is an intelligent academic guidance platform engineered to diagnose cognitive prerequisite lattices, personalize learning trajectories, and connect learners with the right mentors and opportunities.'
                  : currentProduct.overview || currentProduct.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={() => {
                    if (currentProduct.externalUrl) {
                      window.open(currentProduct.externalUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      onShowToast(`Explore ${currentProduct.name}`, `Navigating to ${currentProduct.name} development portal.`, 'info');
                    }
                  }}
                  className="bg-[#101A27] hover:bg-black text-white px-5 py-3 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all duration-150 hover:scale-[1.02] cursor-pointer"
                >
                  <span>Explore {currentProduct.name}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('deep-specifications-anchor');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                    onShowToast('Platform Documentation', `Displaying formal architecture specification for ${currentProduct.name}.`, 'info');
                  }}
                  className="bg-white hover:bg-stone-50 dark:bg-[#182332] dark:hover:bg-[#1f2d40] text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-700 px-5 py-3 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  <span>View Documentation</span>
                </button>
              </div>
            </div>

            {/* Right Column: Rich Product Interface Preview with Ambient Glow */}
            <div className="w-full lg:w-[52%] relative">
              {/* Colored Ambient Glow Behind Preview */}
              <div 
                className={`absolute -inset-4 bg-gradient-to-r ${currentColorStyle.ambientGlow} blur-2xl -z-10 rounded-3xl opacity-60 pointer-events-none`} 
              />

              {/* Mac/IDE Window Shell */}
              <div className="w-full rounded-2xl bg-[#0B101B] border border-white/10 shadow-2xl overflow-hidden">
                {/* Simulated Window Control Bar */}
                <div className="px-4 py-2.5 bg-[#090D17] border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                    <span className="ml-2 text-[11px] font-mono text-stone-400">
                      tathastu // {currentProduct.id} [Active Viewport]
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Platform Node</span>
                  </div>
                </div>

                {/* Actual Product Screenshot Image */}
                <div className="relative bg-[#080E17] overflow-hidden flex items-center justify-center">
                  <img
                    src={getProductPreviewImage(currentProduct.id)}
                    alt={`${currentProduct.name} application interface and user workflow`}
                    className="w-full h-auto object-cover max-h-[380px] select-none"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* =========================================================================
            SECTION F: ALL PLATFORMS (Responsive Product Grid / List)
           ========================================================================= */}
        <section className="pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white font-display">
              All Platforms
            </h2>
            <span className="text-xs font-mono text-stone-500 dark:text-stone-400 font-semibold">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'platform' : 'platforms'}
            </span>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredProducts.map((prod) => {
                const isActive = activeTab === prod.id;
                const colorStyle = getProductColorStyles(prod.id);
                return (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod.id)}
                    className={`p-5 rounded-2xl bg-white dark:bg-[#101824] border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                      isActive
                        ? 'border-stone-900 dark:border-white shadow-md ring-1 ring-stone-900 dark:ring-white'
                        : 'border-stone-200/90 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Top Row: Icon + Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className={`p-2.5 rounded-xl border ${colorStyle.iconBg}`}>
                          {getProductIcon(prod.id, `w-5 h-5 ${colorStyle.iconColor}`)}
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider border ${
                          prod.status === 'Prototype'
                            ? 'bg-[#D9EF68]/20 text-[#D9EF68] border-[#D9EF68]/40'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                        }`}>
                          {prod.status === 'Prototype' ? 'PROTOTYPE' : 'IN DEVELOPMENT'}
                        </span>
                      </div>

                      {/* Title & Category */}
                      <h3 className="font-bold text-base text-stone-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-xs font-mono text-stone-500 dark:text-stone-400 mt-0.5">
                        {prod.badge}
                      </p>

                      {/* Short Description */}
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-2.5 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-stone-800 dark:text-stone-200">
                      <span>{isActive ? 'Currently Featured' : 'Select Platform'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List Layout */
            <div className="space-y-4">
              {filteredProducts.map((prod) => {
                const isActive = activeTab === prod.id;
                const colorStyle = getProductColorStyles(prod.id);
                return (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod.id)}
                    className={`p-6 rounded-2xl bg-white dark:bg-[#101824] border transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 group ${
                      isActive
                        ? 'border-stone-900 dark:border-white shadow-md ring-1 ring-stone-900 dark:ring-white'
                        : 'border-stone-200/90 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl border shrink-0 ${colorStyle.iconBg}`}>
                        {getProductIcon(prod.id, `w-6 h-6 ${colorStyle.iconColor}`)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg text-stone-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {prod.name}
                          </h3>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider border ${
                            prod.status === 'Prototype'
                              ? 'bg-[#D9EF68]/20 text-[#D9EF68] border-[#D9EF68]/40'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                          }`}>
                            {prod.status === 'Prototype' ? 'PROTOTYPE' : 'IN DEVELOPMENT'}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-stone-500 dark:text-stone-400 mt-0.5">
                          {prod.badge} • Version {prod.version}
                        </p>
                        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 max-w-2xl leading-relaxed">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProduct(prod.id);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors flex items-center gap-1.5"
                      >
                        <span>Feature System</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION G: DEEP TECHNICAL SPECIFICATIONS & 15-SECTION BLUEPRINT
           ========================================================================= */}
        <section id="deep-specifications-anchor" className="pt-8 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent-blue font-semibold">
                Technical Specification
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mt-1">
                {currentProduct.name} Architectural Blueprint &amp; Formal Verification
              </h3>
            </div>
            <button
              onClick={() => setShowSpecsDrawer(!showSpecsDrawer)}
              className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {showSpecsDrawer ? 'Collapse Specifications' : 'Expand Specifications'}
            </button>
          </div>

          {showSpecsDrawer && (
            <div className="space-y-12">
              {/* Problem Statement & Why We Started */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101824] border border-stone-200/90 dark:border-stone-800 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" />
                    <span>The Industry Bottleneck We Solved</span>
                  </div>
                  <h4 className="text-lg font-bold text-stone-900 dark:text-white">
                    Problem Statement
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {currentProduct.problem || 'Standard market approaches suffer from opaque failure modes, lack of formal verification, and unacceptable latency barriers.'}
                  </p>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101824] border border-stone-200/90 dark:border-stone-800 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-accent-violet uppercase tracking-wider">
                    <Compass className="w-4 h-4" />
                    <span>Origin &amp; Conviction</span>
                  </div>
                  <h4 className="text-lg font-bold text-stone-900 dark:text-white">
                    Why We Started
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {currentProduct.whyWeStarted || 'We observed that theoretical breakthroughs in interpretability and consensus remained locked in academic PDFs instead of powering practical tools.'}
                  </p>
                </div>
              </div>

              {/* Research Foundations & Approach */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101824] border border-stone-200/90 dark:border-stone-800 space-y-6 shadow-xs">
                <div>
                  <span className="text-xs font-mono text-accent-violet uppercase tracking-wider font-semibold">
                    Theoretical Rigor
                  </span>
                  <h4 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
                    Research Foundations &amp; Architectural Approach
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-xs font-mono uppercase tracking-wider text-stone-800 dark:text-stone-200 font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-accent-blue" />
                      <span>Formal Research Basis</span>
                    </h5>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      {currentProduct.researchBasis}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-xs font-mono uppercase tracking-wider text-stone-800 dark:text-stone-200 font-semibold mb-2 flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-accent-mint" />
                      <span>Our Systematic Approach</span>
                    </h5>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      {currentProduct.ourApproach}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Pipeline (How It Works) */}
              {currentProduct.howItWorks && (
                <div>
                  <h4 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
                    How It Works
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {currentProduct.howItWorks.map((st) => (
                      <div key={st.step} className="p-5 rounded-2xl bg-white dark:bg-[#101824] border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col justify-between">
                        <div>
                          <span className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center font-mono font-bold text-xs mb-3">
                            0{st.step}
                          </span>
                          <h5 className="font-bold text-sm text-stone-900 dark:text-white mb-1.5">
                            {st.title}
                          </h5>
                          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                            {st.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Core Features */}
              {currentProduct.features && (
                <div>
                  <h4 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
                    Core Features &amp; Capabilities
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {currentProduct.features.map((feat, fIdx) => (
                      <div key={fIdx} className="p-5 rounded-2xl bg-white dark:bg-[#101824] border border-stone-200/90 dark:border-stone-800 shadow-xs flex flex-col justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold mb-2.5 inline-block">
                            {feat.tag || 'Core'}
                          </span>
                          <h5 className="font-bold text-sm text-stone-900 dark:text-white mb-1.5">
                            {feat.title}
                          </h5>
                          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                            {feat.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Architecture & Technology Stack */}
              {currentProduct.architecture && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101824] border border-stone-200/90 dark:border-stone-800 space-y-6 shadow-xs">
                  <div>
                    <span className="text-xs font-mono text-accent-violet uppercase tracking-wider font-semibold">
                      Engineering Architecture
                    </span>
                    <h4 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
                      System Topology &amp; Technology Stack
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2">
                      {currentProduct.architecture.overview}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 font-mono text-xs text-stone-800 dark:text-stone-200">
                    <span className="text-accent-violet font-semibold">Dataflow: </span>
                    {currentProduct.architecture.diagramDescription}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentProduct.architecture.layers.map((layer, lIdx) => (
                      <div key={lIdx} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800">
                        <span className="text-xs font-mono uppercase tracking-wider text-accent-violet font-semibold block mb-1">
                          {layer.layer}
                        </span>
                        <p className="text-xs text-stone-600 dark:text-stone-400 mb-2.5">
                          {layer.purpose}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {layer.components.map((comp) => (
                            <span key={comp} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-[#101824] border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentProduct.technologyStack && (
                    <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
                      <h5 className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3 font-semibold">
                        Core Technologies
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {currentProduct.technologyStack.map((tech, tIdx) => (
                          <div key={tIdx} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800">
                            <span className="text-xs font-mono text-accent-violet font-semibold block mb-1.5">
                              {tech.category}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {tech.technologies.map((item) => (
                                <span key={item} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-[#101824] border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Challenges & Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentProduct.engineeringChallenges && (
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#101824] border border-stone-200/90 dark:border-stone-800 space-y-4 shadow-xs">
                    <span className="text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider font-semibold">
                      Engineering Obstacles
                    </span>
                    <h4 className="text-lg font-bold text-stone-900 dark:text-white">
                      Challenges We Overcame
                    </h4>
                    <div className="space-y-3">
                      {currentProduct.engineeringChallenges.map((ch, cIdx) => (
                        <div key={cIdx} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 space-y-1">
                          <span className="text-xs font-semibold text-stone-900 dark:text-white block">
                            {ch.challenge}
                          </span>
                          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                            ↳ <span className="font-semibold text-stone-800 dark:text-stone-200">Resolution:</span> {ch.solution}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentProduct.developmentTimeline && (
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#101824] border border-stone-200/90 dark:border-stone-800 space-y-4 shadow-xs">
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold">
                      Development Journey
                    </span>
                    <h4 className="text-lg font-bold text-stone-900 dark:text-white">
                      Historical Milestones
                    </h4>
                    <div className="space-y-3 relative border-l-2 border-stone-200 dark:border-stone-700 ml-2 pl-4">
                      {currentProduct.developmentTimeline.map((tm, tIdx) => (
                        <div key={tIdx} className="relative">
                          <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold block">
                            {tm.date}
                          </span>
                          <h5 className="text-xs font-bold text-stone-900 dark:text-white">
                            {tm.milestone}
                          </h5>
                          <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5">
                            {tm.impact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

// Subtle helper icon for Research
const FlaskConicalIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
    <path d="M8.5 2h7" />
    <path d="M7 16h10" />
  </svg>
);
