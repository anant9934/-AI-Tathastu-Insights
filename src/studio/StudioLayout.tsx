import React, { useState, useEffect } from 'react';
import { 
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
  ShieldAlert,
  X,
  Clock,
  CheckCircle2,
  AlertCircle
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

interface NavItem {
  id: StudioTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'products', label: 'Products', icon: Layers },
  { id: 'engineering', label: 'Engineering', icon: Terminal },
  { id: 'research', label: 'Research', icon: BookOpen },
  { id: 'updates', label: 'Updates', icon: BellRing },
  { id: 'media', label: 'Media Library', icon: ImageIcon },
  { id: 'homepage', label: 'Homepage Builder', icon: Sparkles },
  { id: 'pages', label: 'Static Pages', icon: Compass },
  { id: 'navigation', label: 'Navigation', icon: MenuIcon },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'users', label: 'Users & RBAC', icon: Users, roles: ['super_admin', 'admin'] },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const StudioLayout: React.FC<StudioLayoutProps> = ({
  currentTab,
  onSelectTab,
  onOpenEditor,
  onOpenPublicSite,
  children,
}) => {
  const { user, logout } = useStudioAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
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

  return (
    <div className="flex h-screen bg-[#FDFDFD] dark:bg-[#0B0D11] text-[#121417] dark:text-[#EAEAEA] font-sans overflow-hidden antialiased">
      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR (Linear/Stripe Precision) */}
      {/* ------------------------------------------------------------- */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-[#E5E7EB] dark:border-[#1F242C] bg-[#FAFAFA] dark:bg-[#0E1116]">
        {/* Workspace Brand / Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#1F242C]">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-brand-charcoal to-brand-slate text-white dark:from-white dark:to-neutral-300 dark:text-neutral-900 flex items-center justify-center font-serif font-bold text-xs tracking-tight shadow-sm">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs tracking-tight text-neutral-900 dark:text-white leading-none">
                AI Tathastu Studio
              </span>
              <span className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase mt-0.5">
                Editorial CMS
              </span>
            </div>
          </div>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
            v4.2 Live
          </span>
        </div>

        {/* Navigation Item List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5 custom-scrollbar">
          <div className="px-2 pb-1.5 pt-1 text-[10px] font-mono tracking-wider uppercase text-neutral-400 font-semibold">
            Platform Modules
          </div>

          {NAV_ITEMS.map((item) => {
            if (item.roles && user && !item.roles.includes(user.roleId) && user.roleId !== 'super_admin') {
              return null;
            }

            const isActive = currentTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white dark:text-neutral-900' : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Logout Strip */}
        <div className="p-2.5 border-t border-[#E5E7EB] dark:border-[#1F242C] bg-[#F7F7F8] dark:bg-[#0B0D11]">
          <div className="flex items-center justify-between p-2 rounded-md bg-white dark:bg-[#12161E] border border-neutral-200/70 dark:border-neutral-800 shadow-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-medium text-neutral-700 dark:text-neutral-200 uppercase font-mono">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-neutral-900 dark:text-white truncate leading-tight">
                  {user?.name || 'Authorized Staff'}
                </p>
                <p className="text-[10px] text-neutral-400 truncate">
                  {roleLabels[user?.roleId || ''] || user?.roleId || 'Staff'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out of Studio"
              className="p-1 rounded text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN APPLICATION WORKSPACE */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 px-6 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#1F242C] bg-white/80 dark:bg-[#0E1116]/80 backdrop-blur-md z-10">
          {/* Search Trigger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 bg-neutral-100 dark:bg-neutral-800/60 rounded-md border border-neutral-200 dark:border-neutral-700/60 transition-colors w-64 justify-between"
            >
              <span className="flex items-center space-x-2">
                <Search className="w-3.5 h-3.5" />
                <span>Search CMS records...</span>
              </span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-neutral-700 text-neutral-500 shadow-xs border border-neutral-200 dark:border-neutral-600">
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
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Create</span>
              </button>

              {isQuickCreateOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setIsQuickCreateOpen(false);
                      if (onOpenEditor) onOpenEditor();
                      else onSelectTab('editor');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 flex items-center space-x-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>New Article Draft</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickCreateOpen(false);
                      onSelectTab('products');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 flex items-center space-x-2"
                  >
                    <Layers className="w-3.5 h-3.5 text-violet-500" />
                    <span>Register New Product</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickCreateOpen(false);
                      onSelectTab('engineering');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 flex items-center space-x-2"
                  >
                    <Terminal className="w-3.5 h-3.5 text-amber-500" />
                    <span>Add Engineering Note</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickCreateOpen(false);
                      onSelectTab('research');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 flex items-center space-x-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Register Research Paper</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickCreateOpen(false);
                      onSelectTab('updates');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 flex items-center space-x-2"
                  >
                    <BellRing className="w-3.5 h-3.5 text-rose-500" />
                    <span>Post Milestone Update</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
              >
                <BellRing className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-neutral-900" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#151921] border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-2xl p-3 z-30">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-white">
                      Recent Activity & Audits
                    </span>
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-neutral-400 py-3 text-center">No recent audit events.</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="text-xs p-2 rounded bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800/80">
                          <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500">
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">{n.action}</span>
                            <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 truncate">
                            {n.resourceType}: {n.resourceId || 'system'}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* View Live Public Site */}
            <button
              onClick={onOpenPublicSite}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-md text-xs font-medium transition-colors border border-neutral-200 dark:border-neutral-700"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FAFAFA] dark:bg-[#0B0D11] custom-scrollbar">
          {children}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. UNIVERSAL SEARCH COMMAND PALETTE (CMD+K) */}
      {/* ------------------------------------------------------------- */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-start justify-center pt-24 z-50 p-4">
          <div className="w-full max-w-xl bg-white dark:bg-[#12161E] rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center space-x-2">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Jump to content, products, research, settings..."
                autoFocus
                className="w-full text-sm bg-transparent outline-none text-neutral-900 dark:text-white placeholder-neutral-400"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 max-h-80 overflow-y-auto space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Navigation Shortcuts
              </div>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-200"
                  >
                    <span className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 text-neutral-400" />
                      <span>{item.label}</span>
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">Go to tab</span>
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
