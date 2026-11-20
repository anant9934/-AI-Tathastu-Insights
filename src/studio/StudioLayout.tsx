import React, { useState, useEffect } from 'react';
import { 
  Home,
  LayoutDashboard, 
  FileText, 
  Layers, 
  Terminal, 
  BookOpen, 
  BellRing, 
  Image as ImageIcon, 
  Sparkles, 
  Compass, 
  Menu as MenuIcon, 
  Mail, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Search, 
  Plus, 
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CalendarCheck,
  Percent,
  PieChart,
  Globe,
  ArrowUpRight,
  X
} from 'lucide-react';
import { StudioTab, UserRole } from '../types/studio';
import { useStudioAuth } from './context/StudioAuthContext';
import { api } from '../lib/api';

interface StudioLayoutProps {
  currentTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  onOpenEditor?: (articleId?: string) => void;
  onOpenPublicSite: () => void;
  children: React.ReactNode;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({
  currentTab,
  onSelectTab,
  onOpenEditor,
  onOpenPublicSite,
  children,
}) => {
  const { user, logout } = useStudioAuth();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('studio_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['income', 'posts']));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);

  // Toggle Collapse and persist
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('studio_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  const toggleGroup = (groupId: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    api.studio.audit.list(8).then((res) => {
      if (res?.logs) setNotifications(res.logs);
    }).catch(() => {});
  }, [currentTab]);

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Administrator',
    editor: 'Editor',
    research_editor: 'Research Editor',
    author: 'Author',
    media_manager: 'Media Manager',
    contributor: 'Contributor',
  };

  // Determine active group states
  const isPostsActive = currentTab === 'content' || currentTab === 'editor';
  const isIncomeActive = currentTab === 'products' || currentTab === 'engineering' || currentTab === 'research' || currentTab === 'analytics';
  const isAudienceActive = currentTab === 'newsletter' || currentTab === 'users';
  const isPromoteActive = currentTab === 'homepage' || currentTab === 'pages' || currentTab === 'navigation';

  return (
    <div className="flex h-screen bg-[#0F1216] text-[#EAEAEA] font-sans overflow-hidden antialiased select-text">
      {/* ------------------------------------------------------------- */}
      {/* 1. COLLAPSIBLE MATTE DARK SIDEBAR NAVIGATION (MOCKUP MATCH)   */}
      {/* ------------------------------------------------------------- */}
      <aside 
        className={`relative flex-shrink-0 flex flex-col justify-between bg-[#15181C] border-r border-[#22272E] transition-all duration-300 ease-in-out z-20 ${
          isCollapsed ? 'w-[76px]' : 'w-[250px]'
        }`}
      >
        {/* Floating Circular Toggle Button */}
        <button
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'}
          className="absolute -right-3 top-8 z-30 w-6 h-6 rounded-full bg-[#242830] hover:bg-[#303640] text-neutral-300 hover:text-white flex items-center justify-center border border-[#353C46] shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-95"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Top Header: Window Dots & Aperture Logo */}
        <div className="p-4 pb-2">
          {/* macOS Window Controls */}
          <div className={`flex items-center space-x-1.5 mb-5 ${isCollapsed ? 'justify-center' : 'px-1'}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-xs inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-xs inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-xs inline-block" />
          </div>

          {/* Aperture / Bullseye Logo Emblem */}
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-1'}`}>
            <div 
              onClick={() => onSelectTab('dashboard')}
              title="AI Tathastu Studio Dashboard"
              className="w-11 h-11 bg-white rounded-2xl shadow-sm flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform shrink-0"
            >
              {/* Distinctive Geometric Aperture Emblem */}
              <svg 
                className="w-6 h-6 text-[#15181C] group-hover:rotate-12 transition-transform duration-300" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="7.5" />
                <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
              </svg>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-xs text-white tracking-tight leading-snug truncate">
                  AI Tathastu
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 truncate">
                  Studio CMS
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation Item List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 custom-scrollbar">
          {/* 1. DASHBOARD */}
          <button
            onClick={() => onSelectTab('dashboard')}
            title={isCollapsed ? 'Dashboard' : undefined}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
              currentTab === 'dashboard'
                ? 'bg-[#272B30] text-white shadow-xs font-semibold'
                : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]'
            } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
          >
            <div className="flex items-center space-x-3">
              <Home className={`w-4 h-4 shrink-0 ${currentTab === 'dashboard' ? 'text-white' : 'text-[#8F95B2] group-hover:text-white'}`} />
              {!isCollapsed && <span>Dashboard</span>}
            </div>

            {/* Collapsed Tooltip */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#272B30] text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                Dashboard
              </div>
            )}
          </button>

          {/* 2. AUDIENCE (Expandable Accordion) */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (isCollapsed) {
                  onSelectTab('newsletter');
                } else {
                  toggleGroup('audience');
                }
              }}
              title={isCollapsed ? 'Audience (Subscribers & Users)' : undefined}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                isAudienceActive && !expandedGroups.has('audience')
                  ? 'bg-[#272B30] text-white'
                  : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]'
              } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            >
              <div className="flex items-center space-x-3">
                <Users className={`w-4 h-4 shrink-0 ${isAudienceActive ? 'text-white' : 'text-[#8F95B2] group-hover:text-white'}`} />
                {!isCollapsed && <span>Audience</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown 
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                    expandedGroups.has('audience') ? 'rotate-180' : ''
                  }`} 
                />
              )}

              {/* Collapsed Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#272B30] text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Audience (Subscribers & Users)
                </div>
              )}
            </button>

            {/* Tree Branch Lines (Expanded Mode Only) */}
            {!isCollapsed && expandedGroups.has('audience') && (
              <div className="ml-5 pl-3.5 border-l border-neutral-700/60 space-y-1 py-1">
                <button
                  onClick={() => onSelectTab('newsletter')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    currentTab === 'newsletter'
                      ? 'bg-[#272B30] text-white font-medium'
                      : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]/60'
                  }`}
                >
                  <span>Subscribers</span>
                  {currentTab === 'newsletter' && <ChevronRight className="w-3 h-3 text-neutral-400" />}
                </button>
                {(!user || user.roleId === 'super_admin' || user.roleId === 'admin') && (
                  <button
                    onClick={() => onSelectTab('users')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      currentTab === 'users'
                        ? 'bg-[#272B30] text-white font-medium'
                        : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]/60'
                    }`}
                  >
                    <span>Staff & Roles</span>
                    {currentTab === 'users' && <ChevronRight className="w-3 h-3 text-neutral-400" />}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3. POSTS (Articles with Mint Badge 8) */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (isCollapsed) {
                  onSelectTab('content');
                } else {
                  toggleGroup('posts');
                }
              }}
              title={isCollapsed ? 'Posts (8 Published)' : undefined}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                isPostsActive && !expandedGroups.has('posts')
                  ? 'bg-[#272B30] text-white'
                  : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]'
              } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            >
              <div className="flex items-center space-x-3">
                <FileText className={`w-4 h-4 shrink-0 ${isPostsActive ? 'text-white' : 'text-[#8F95B2] group-hover:text-white'}`} />
                {!isCollapsed && <span>Posts</span>}
              </div>

              {!isCollapsed ? (
                <div className="flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#7FE4C6] text-[#0A261C]">
                    8
                  </span>
                </div>
              ) : (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7FE4C6]" />
              )}

              {/* Collapsed Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#272B30] text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Posts (8 Articles)
                </div>
              )}
            </button>

            {/* Tree Branch Lines (Expanded Mode Only) */}
            {!isCollapsed && expandedGroups.has('posts') && (
              <div className="ml-5 pl-3.5 border-l border-neutral-700/60 space-y-1 py-1">
                <button
                  onClick={() => onSelectTab('content')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    currentTab === 'content'
                      ? 'bg-[#272B30] text-white font-medium'
                      : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]/60'
                  }`}
                >
                  <span>All Articles</span>
                  {currentTab === 'content' && <ChevronRight className="w-3 h-3 text-neutral-400" />}
                </button>
                <button
                  onClick={() => {
                    if (onOpenEditor) onOpenEditor();
                    else onSelectTab('editor');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    currentTab === 'editor'
                      ? 'bg-[#272B30] text-white font-medium'
                      : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]/60'
                  }`}
                >
                  <span>Article Editor</span>
                  {currentTab === 'editor' && <ChevronRight className="w-3 h-3 text-neutral-400" />}
                </button>
              </div>
            )}
          </div>

          {/* 4. SCHEDULES (Updates with Action Button & Peach Badge 3) */}
          <div className="relative group">
            <button
              onClick={() => onSelectTab('updates')}
              title={isCollapsed ? 'Schedules (3 Scheduled Milestones)' : undefined}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                currentTab === 'updates'
                  ? 'bg-[#272B30] text-white'
                  : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]'
              } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            >
              <div className="flex items-center space-x-3">
                <CalendarCheck className={`w-4 h-4 shrink-0 ${currentTab === 'updates' ? 'text-white' : 'text-[#8F95B2] group-hover:text-white'}`} />
                {!isCollapsed && <span>Schedules</span>}
              </div>

              {!isCollapsed ? (
                <div className="flex items-center space-x-1.5">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTab('updates');
                    }}
                    title="Add Scheduled Update"
                    className="w-5 h-5 rounded-full bg-[#20242A] hover:bg-[#303640] text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#FFBA92] text-[#3D1407]">
                    3
                  </span>
                </div>
              ) : (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FFBA92]" />
              )}
            </button>

            {/* Collapsed Tooltip */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#272B30] text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                Schedules (3 Updates)
              </div>
            )}
          </div>

          {/* 5. INCOME / SYSTEMS (Active Tree Line with Indented Branches) */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (isCollapsed) {
                  onSelectTab('products');
                } else {
                  toggleGroup('income');
                }
              }}
              title={isCollapsed ? 'Systems & Income' : undefined}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                isIncomeActive || expandedGroups.has('income')
                  ? 'bg-[#272B30] text-white shadow-xs'
                  : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]'
              } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            >
              <div className="flex items-center space-x-3">
                <PieChart className="w-4 h-4 shrink-0 text-white" />
                {!isCollapsed && <span>Income</span>}
              </div>

              {!isCollapsed && (
                <ChevronDown 
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                    expandedGroups.has('income') ? 'rotate-180' : ''
                  }`} 
                />
              )}

              {/* Collapsed Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#272B30] text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Income & Systems (Products, Eng, Research)
                </div>
              )}
            </button>

            {/* Authentic Tree Line Hierarchy (Direct Mockup Match) */}
            {!isCollapsed && expandedGroups.has('income') && (
              <div className="ml-5 pl-3.5 border-l border-neutral-700/60 space-y-1 py-1">
                {/* Branch 1: Earnings (Products) */}
                <button
                  onClick={() => onSelectTab('products')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    currentTab === 'products'
                      ? 'bg-[#272B30] text-white font-medium'
                      : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]/60'
                  }`}
                >
                  <span>Earnings</span>
                  {currentTab === 'products' && <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
                </button>

                {/* Branch 2: Refunds (Engineering Notes — Featured in Reference) */}
                <button
                  onClick={() => onSelectTab('engineering')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    currentTab === 'engineering'
                      ? 'bg-[#272B30] text-white font-medium'
                      : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]/60'
                  }`}
                >
                  <span className={currentTab === 'engineering' ? 'text-white' : ''}>Refunds</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {/* Branch 3: Declines (Research Papers) */}
                <button
                  onClick={() => onSelectTab('research')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    currentTab === 'research'
                      ? 'bg-[#272B30] text-white font-medium'
                      : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]/60'
                  }`}
                >
                  <span>Declines</span>
                  {currentTab === 'research' && <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
                </button>

                {/* Branch 4: Payouts (Analytics & Metrics) */}
                <button
                  onClick={() => onSelectTab('analytics')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    currentTab === 'analytics'
                      ? 'bg-[#272B30] text-white font-medium'
                      : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]/60'
                  }`}
                >
                  <span>Payouts</span>
                  {currentTab === 'analytics' && <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />}
                </button>
              </div>
            )}
          </div>

          {/* 6. PROMOTE & PAGES (Expandable Accordion) */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (isCollapsed) {
                  onSelectTab('homepage');
                } else {
                  toggleGroup('promote');
                }
              }}
              title={isCollapsed ? 'Promote & Site Pages' : undefined}
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                isPromoteActive && !expandedGroups.has('promote')
                  ? 'bg-[#272B30] text-white'
                  : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]'
              } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            >
              <div className="flex items-center space-x-3">
                <Percent className={`w-4 h-4 shrink-0 ${isPromoteActive ? 'text-white' : 'text-[#8F95B2] group-hover:text-white'}`} />
                {!isCollapsed && <span>Promote</span>}
              </div>

              {!isCollapsed && (
                <ChevronDown 
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                    expandedGroups.has('promote') ? 'rotate-180' : ''
                  }`} 
                />
              )}

              {/* Collapsed Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#272B30] text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Promote & Site Pages
                </div>
              )}
            </button>

            {/* Tree Branch Lines */}
            {!isCollapsed && expandedGroups.has('promote') && (
              <div className="ml-5 pl-3.5 border-l border-neutral-700/60 space-y-1 py-1">
                <button
                  onClick={() => onSelectTab('homepage')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    currentTab === 'homepage'
                      ? 'bg-[#272B30] text-white font-medium'
                      : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]/60'
                  }`}
                >
                  <span>Homepage Builder</span>
                  {currentTab === 'homepage' && <ChevronRight className="w-3 h-3 text-neutral-400" />}
                </button>
                <button
                  onClick={() => onSelectTab('pages')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    currentTab === 'pages'
                      ? 'bg-[#272B30] text-white font-medium'
                      : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]/60'
                  }`}
                >
                  <span>Static Pages</span>
                  {currentTab === 'pages' && <ChevronRight className="w-3 h-3 text-neutral-400" />}
                </button>
                <button
                  onClick={() => onSelectTab('navigation')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    currentTab === 'navigation'
                      ? 'bg-[#272B30] text-white font-medium'
                      : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]/60'
                  }`}
                >
                  <span>Navigation Menus</span>
                  {currentTab === 'navigation' && <ChevronRight className="w-3 h-3 text-neutral-400" />}
                </button>
              </div>
            )}
          </div>

          {/* 7. MEDIA LIBRARY */}
          <button
            onClick={() => onSelectTab('media')}
            title={isCollapsed ? 'Media Library' : undefined}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
              currentTab === 'media'
                ? 'bg-[#272B30] text-white'
                : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]'
            } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
          >
            <div className="flex items-center space-x-3">
              <ImageIcon className={`w-4 h-4 shrink-0 ${currentTab === 'media' ? 'text-white' : 'text-[#8F95B2] group-hover:text-white'}`} />
              {!isCollapsed && <span>Media Library</span>}
            </div>

            {/* Collapsed Tooltip */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#272B30] text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                Media Library
              </div>
            )}
          </button>

          {/* 8. SETTINGS */}
          <button
            onClick={() => onSelectTab('settings')}
            title={isCollapsed ? 'System Settings' : undefined}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
              currentTab === 'settings'
                ? 'bg-[#272B30] text-white'
                : 'text-[#8F95B2] hover:text-white hover:bg-[#1E2227]'
            } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
          >
            <div className="flex items-center space-x-3">
              <Settings className={`w-4 h-4 shrink-0 ${currentTab === 'settings' ? 'text-white' : 'text-[#8F95B2] group-hover:text-white'}`} />
              {!isCollapsed && <span>Settings</span>}
            </div>

            {/* Collapsed Tooltip */}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#272B30] text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                System Settings
              </div>
            )}
          </button>
        </div>

        {/* Bottom Footer Section: Profile & "Visit site" Pill */}
        <div className="p-3 border-t border-[#22272E] bg-[#121417]/80 space-y-2.5">
          {/* Authenticated User Micro-Card */}
          {!isCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#1C1F24] border border-[#2B3038]/60">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-semibold text-white uppercase font-mono shrink-0">
                  {user?.name?.[0] || 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate leading-tight">
                    {user?.name || 'Administrator'}
                  </p>
                  <p className="text-[10px] text-neutral-400 truncate">
                    {roleLabels[user?.roleId || ''] || user?.roleId || 'Staff'}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign Out of Studio"
                className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={logout}
                title="Sign Out"
                className="w-8 h-8 rounded-full bg-[#1C1F24] flex items-center justify-center text-neutral-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Floating / Pinned "Visit site" Pill Button (Direct Mockup Match) */}
          <button
            onClick={onOpenPublicSite}
            title="Visit public website (aitathastu.info)"
            className={`w-full py-2.5 rounded-full text-xs font-medium transition-all shadow-md flex items-center group cursor-pointer ${
              isCollapsed
                ? 'justify-center bg-[#242830] hover:bg-[#303640] text-neutral-200'
                : 'justify-center space-x-2 bg-[#242830] hover:bg-[#2E343E] text-neutral-200 hover:text-white border border-[#343B45]/70'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors shrink-0" />
            {!isCollapsed && <span>Visit site</span>}
            {!isCollapsed && <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN APPLICATION WORKSPACE & HEADER                        */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0F1216]">
        {/* Sleek Top Header Bar */}
        <header className="h-14 px-6 flex items-center justify-between border-b border-[#22272E] bg-[#15181C]/90 backdrop-blur-md z-10">
          {/* Search Trigger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 bg-[#1D2127] rounded-xl border border-[#2B303A] transition-colors w-64 justify-between shadow-xs"
            >
              <span className="flex items-center space-x-2">
                <Search className="w-3.5 h-3.5 text-neutral-400" />
                <span>Search CMS records...</span>
              </span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2A2F38] text-neutral-400 border border-[#3A414D]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center space-x-3">
            {/* Quick Create Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white text-neutral-900 rounded-xl text-xs font-semibold hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Create</span>
              </button>

              {isQuickCreateOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-[#1A1E24] border border-[#2B303A] rounded-xl shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setIsQuickCreateOpen(false);
                      if (onOpenEditor) onOpenEditor();
                      else onSelectTab('editor');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-neutral-200 hover:bg-[#252B34] flex items-center space-x-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>New Article Draft</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickCreateOpen(false);
                      onSelectTab('products');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-neutral-200 hover:bg-[#252B34] flex items-center space-x-2"
                  >
                    <Layers className="w-3.5 h-3.5 text-violet-400" />
                    <span>Register New Product</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickCreateOpen(false);
                      onSelectTab('engineering');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-neutral-200 hover:bg-[#252B34] flex items-center space-x-2"
                  >
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add Engineering Note</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickCreateOpen(false);
                      onSelectTab('research');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-neutral-200 hover:bg-[#252B34] flex items-center space-x-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Register Research Paper</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickCreateOpen(false);
                      onSelectTab('updates');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-neutral-200 hover:bg-[#252B34] flex items-center space-x-2"
                  >
                    <BellRing className="w-3.5 h-3.5 text-rose-400" />
                    <span>Post Milestone Update</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-[#1D2127] transition-colors relative"
              >
                <BellRing className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#15181C]" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#1A1E24] border border-[#2B303A] rounded-xl shadow-2xl p-3 z-30">
                  <div className="flex items-center justify-between pb-2 border-b border-[#2B303A]">
                    <span className="text-xs font-semibold text-white">
                      Recent Activity & Audits
                    </span>
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-neutral-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-neutral-400 py-3 text-center">No recent audit events.</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="text-xs p-2 rounded-lg bg-[#222730] border border-[#2E3542]">
                          <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400">
                            <span className="font-semibold text-neutral-200">{n.action}</span>
                            <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-[11px] text-neutral-300 mt-0.5 truncate">
                            {n.resourceType}: {n.resourceId || 'system'}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* View Live Public Site Header Button */}
            <button
              onClick={onOpenPublicSite}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1D2127] hover:bg-[#252B33] text-neutral-200 rounded-xl text-xs font-medium transition-colors border border-[#2B303A]"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0F1216] custom-scrollbar">
          {children}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. UNIVERSAL SEARCH COMMAND PALETTE (CMD+K)                   */}
      {/* ------------------------------------------------------------- */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-24 z-50 p-4">
          <div className="w-full max-w-xl bg-[#1A1E24] rounded-2xl shadow-2xl border border-[#2B303A] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 border-b border-[#2B303A] flex items-center space-x-2">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Jump to content, products, engineering, research, settings..."
                autoFocus
                className="w-full text-sm bg-transparent outline-none text-white placeholder-neutral-400"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 max-h-80 overflow-y-auto space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Navigation Shortcuts
              </div>
              {[
                { id: 'dashboard' as StudioTab, label: 'Dashboard', icon: Home },
                { id: 'content' as StudioTab, label: 'Posts & Articles', icon: FileText },
                { id: 'products' as StudioTab, label: 'Earnings & Products', icon: Layers },
                { id: 'engineering' as StudioTab, label: 'Refunds & Engineering', icon: Terminal },
                { id: 'research' as StudioTab, label: 'Declines & Research', icon: BookOpen },
                { id: 'updates' as StudioTab, label: 'Schedules & Updates', icon: CalendarCheck },
                { id: 'media' as StudioTab, label: 'Media Library', icon: ImageIcon },
                { id: 'homepage' as StudioTab, label: 'Promote: Homepage Builder', icon: Sparkles },
                { id: 'pages' as StudioTab, label: 'Promote: Static Pages', icon: Compass },
                { id: 'navigation' as StudioTab, label: 'Promote: Navigation Menus', icon: MenuIcon },
                { id: 'newsletter' as StudioTab, label: 'Audience: Subscribers', icon: Mail },
                { id: 'analytics' as StudioTab, label: 'Payouts: Analytics', icon: BarChart3 },
                { id: 'users' as StudioTab, label: 'Audience: Staff & Roles', icon: Users },
                { id: 'settings' as StudioTab, label: 'System Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#252B34] text-xs text-neutral-300 hover:text-white"
                  >
                    <span className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 text-neutral-400" />
                      <span>{item.label}</span>
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">Open module</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
