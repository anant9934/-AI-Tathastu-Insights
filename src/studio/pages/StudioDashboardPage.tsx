import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Layers, 
  Terminal, 
  BookOpen, 
  BellRing, 
  Image as ImageIcon, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowUpRight, 
  TrendingUp, 
  RefreshCw 
} from 'lucide-react';
import { DashboardMetrics, StudioTab } from '../../types/studio';
import { api } from '../../lib/api';

interface StudioDashboardPageProps {
  onNavigateTab: (tab: StudioTab) => void;
  onOpenEditor: (contentId?: string) => void;
}

export const StudioDashboardPage: React.FC<StudioDashboardPageProps> = ({
  onNavigateTab,
  onOpenEditor,
}) => {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await api.studio.dashboard.getMetrics();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2 text-xs text-neutral-400 font-mono">
          <RefreshCw className="w-4 h-4 animate-spin text-neutral-600 dark:text-neutral-300" />
          <span>Hydrating operational database queries...</span>
        </div>
      </div>
    );
  }

  const { metrics, workflowCounts, recentActivities, upcomingScheduled, draftsAwaitingAttention, recentPublished } = data;

  const cards = [
    { label: 'Published Articles', value: metrics.publishedArticles, icon: FileText, tab: 'content' as StudioTab, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Drafts in Progress', value: metrics.drafts, icon: Clock, tab: 'content' as StudioTab, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Awaiting Peer Review', value: metrics.inReview, icon: AlertCircle, tab: 'content' as StudioTab, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Scheduled Content', value: metrics.scheduled, icon: CheckCircle2, tab: 'content' as StudioTab, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Active Products', value: metrics.totalProducts, icon: Layers, tab: 'products' as StudioTab, color: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Published Updates', value: metrics.publishedUpdates, icon: BellRing, tab: 'updates' as StudioTab, color: 'text-rose-600 dark:text-rose-400' },
    { label: 'Media Assets', value: metrics.mediaAssets, icon: ImageIcon, tab: 'media' as StudioTab, color: 'text-cyan-600 dark:text-cyan-400' },
    { label: 'Confirmed Subscribers', value: metrics.subscriberCount, icon: Mail, tab: 'newsletter' as StudioTab, color: 'text-teal-600 dark:text-teal-400' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Contextual Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Editorial Operations Dashboard
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time telemetry and editorial pipeline state computed directly from the repository ledger.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onOpenEditor()}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Article</span>
          </button>
          <button
            onClick={fetchMetrics}
            title="Refresh database metrics"
            className="p-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. High-Density Operational Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <button
              key={i}
              onClick={() => onNavigateTab(c.tab)}
              className="text-left p-4 rounded-xl bg-white dark:bg-[#12161E] border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-xs group"
            >
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                  {c.label}
                </span>
                <Icon className={`w-4 h-4 ${c.color}`} />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
                  {c.value}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Editorial Lifecycle Pipeline Stage Breakdown */}
      <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5">
        <h2 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider font-mono mb-3">
          Publication Lifecycle Distribution
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {[
            { label: 'Draft', count: workflowCounts.draft || 0, color: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300' },
            { label: 'In Review', count: workflowCounts.in_review || 0, color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' },
            { label: 'Revision', count: workflowCounts.revision_requested || 0, color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400' },
            { label: 'Approved', count: workflowCounts.approved || 0, color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' },
            { label: 'Scheduled', count: workflowCounts.scheduled || 0, color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400' },
            { label: 'Published', count: workflowCounts.published || 0, color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' },
            { label: 'Archived', count: workflowCounts.archived || 0, color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
          ].map((s, idx) => (
            <div key={idx} className={`p-2.5 rounded-lg border border-neutral-200/50 dark:border-neutral-800 ${s.color}`}>
              <div className="text-[10px] font-mono uppercase tracking-wider">{s.label}</div>
              <div className="text-lg font-bold font-mono mt-0.5">{s.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Operational Feeds & Action Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Content & Drafts Awaiting Attention */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drafts Awaiting Attention */}
          <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                Drafts Awaiting Attention ({draftsAwaitingAttention.length})
              </h2>
              <button
                onClick={() => onNavigateTab('content')}
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {draftsAwaitingAttention.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center">No pending drafts requiring attention.</p>
            ) : (
              <div className="space-y-2">
                {draftsAwaitingAttention.slice(0, 4).map((d) => (
                  <div
                    key={d.id}
                    onClick={() => onOpenEditor(d.id)}
                    className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-4">
                      <h3 className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        {d.title}
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                        By {d.authorName} • {d.contentType.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 flex-shrink-0">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Published Content */}
          <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                Recently Published Content
              </h2>
              <button
                onClick={() => onNavigateTab('content')}
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center space-x-1"
              >
                <span>Browse content</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {recentPublished.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onOpenEditor(p.id)}
                  className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="min-w-0 pr-4">
                    <h3 className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                      {p.category} • {p.readingTimeMinutes} min read
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex-shrink-0">
                    Live
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Quick Actions & Live Audit Trail */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5">
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider font-mono mb-3">
              Editorial Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenEditor()}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-500 mb-1" />
                <div className="text-xs font-medium text-neutral-900 dark:text-white">Create Article</div>
                <div className="text-[10px] text-neutral-400">Rich text editor</div>
              </button>
              <button
                onClick={() => onNavigateTab('products')}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <Layers className="w-4 h-4 text-violet-500 mb-1" />
                <div className="text-xs font-medium text-neutral-900 dark:text-white">Add Product</div>
                <div className="text-[10px] text-neutral-400">Ecosystem card</div>
              </button>
              <button
                onClick={() => onNavigateTab('updates')}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <BellRing className="w-4 h-4 text-rose-500 mb-1" />
                <div className="text-xs font-medium text-neutral-900 dark:text-white">Post Update</div>
                <div className="text-[10px] text-neutral-400">Release changelog</div>
              </button>
              <button
                onClick={() => onNavigateTab('research')}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-emerald-500 mb-1" />
                <div className="text-xs font-medium text-neutral-900 dark:text-white">Add Research</div>
                <div className="text-[10px] text-neutral-400">DOI preprint</div>
              </button>
              <button
                onClick={() => onNavigateTab('media')}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-cyan-500 mb-1" />
                <div className="text-xs font-medium text-neutral-900 dark:text-white">Upload Media</div>
                <div className="text-[10px] text-neutral-400">Asset library</div>
              </button>
              <button
                onClick={() => onNavigateTab('pages')}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <Plus className="w-4 h-4 text-neutral-500 mb-1" />
                <div className="text-xs font-medium text-neutral-900 dark:text-white">Create Page</div>
                <div className="text-[10px] text-neutral-400">Static template</div>
              </button>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 p-5">
            <h2 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider font-mono mb-3">
              Live Audit Trail
            </h2>
            <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
              {recentActivities.map((act) => (
                <div key={act.id} className="text-xs pb-2 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{act.action}</span>
                    <span>{new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 truncate">
                    {act.resourceType}: {act.resourceId || 'system'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
