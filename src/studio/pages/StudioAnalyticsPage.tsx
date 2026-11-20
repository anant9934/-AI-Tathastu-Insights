import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Bookmark, Users, FileText, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

export const StudioAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await api.studio.analytics.get();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-xs font-mono text-neutral-400">
        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
        <span>Computing real database aggregate statistics...</span>
      </div>
    );
  }

  const { metrics, topDownloadedPapers, contentDistribution } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Platform Telemetry & Publication Analytics
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Real database metrics aggregated across downloads, bookmarks, subscriptions, and publication distribution.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#12161E] border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-medium text-neutral-500">Research Downloads</span>
            <Download className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
            {metrics.totalDownloads}
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">Verified PDF downloads</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#12161E] border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-medium text-neutral-500">Total Bookmarks</span>
            <Bookmark className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
            {metrics.totalBookmarks}
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">Reader saved investigations</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#12161E] border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-medium text-neutral-500">Active Subscribers</span>
            <Users className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
            {metrics.confirmedSubscribers}
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">Double opt-in verified</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#12161E] border border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-medium text-neutral-500">Published Content</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
            {metrics.publishedContentTotal}
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">Live articles & stories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Downloaded Papers */}
        <div className="p-5 bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <h2 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider font-mono mb-4">
            Top Downloaded Research Preprints
          </h2>
          <div className="space-y-3">
            {topDownloadedPapers.map((paper: any, idx: number) => (
              <div key={paper.id} className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div className="min-w-0 pr-3">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                    {idx + 1}. {paper.title}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-400 mt-0.5 truncate">
                    DOI: {paper.doi || 'None'}
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  {paper.downloadCount} dl
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Type Distribution */}
        <div className="p-5 bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
          <h2 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider font-mono mb-4">
            Content Category Breakdown
          </h2>
          <div className="space-y-2">
            {Object.entries(contentDistribution).map(([type, count]: [string, any]) => (
              <div key={type} className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0">
                <span className="text-neutral-600 dark:text-neutral-400 capitalize">{type.replace(/_/g, ' ')}</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
