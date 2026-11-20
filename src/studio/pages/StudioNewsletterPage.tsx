import React, { useState, useEffect } from 'react';
import { Mail, Download, Search, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';

export const StudioNewsletterPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const res = await api.studio.newsletter.list();
      setSubscribers(res?.subscribers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase().trim()));

  const handleExport = () => {
    window.open(api.studio.newsletter.exportCsvUrl(), '_blank');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Newsletter Subscribers & Compliance
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit double opt-in subscriptions, verified consent timestamps, and export GDPR-compliant CSV dispatch lists.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Subscribers CSV</span>
        </button>
      </div>

      <div className="flex items-center justify-between p-3 bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscribers by email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none"
          />
        </div>
        <div className="text-xs font-mono text-neutral-500">
          Total Subscribers: <span className="font-bold text-neutral-900 dark:text-white">{subscribers.length}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA] dark:bg-[#0E1116] text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              <th className="py-3 px-4">Subscriber Email</th>
              <th className="py-3 px-4">Verification Status</th>
              <th className="py-3 px-4">Consent Recorded At</th>
              <th className="py-3 px-4">Unsubscribe State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-neutral-400 font-mono text-xs">Loading subscribers...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-neutral-400 text-xs">No matching subscribers found.</td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-neutral-900 dark:text-white font-medium">
                    {s.email}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {s.isConfirmed ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span>Confirmed Double Opt-In</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                        <span>Pending Confirmation</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-neutral-500">
                    {new Date(s.consentRecordedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {s.unsubscribedAt ? (
                      <span className="text-rose-600 dark:text-rose-400 font-mono text-[11px]">Unsubscribed</span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">Active</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
