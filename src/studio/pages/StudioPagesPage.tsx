import React, { useState, useEffect } from 'react';
import { Compass, Plus, Edit3, Trash2, Eye, X, Save } from 'lucide-react';
import { StaticPageItem } from '../../types/studio';
import { api } from '../../lib/api';

export const StudioPagesPage: React.FC = () => {
  const [pages, setPages] = useState<StaticPageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<Partial<StaticPageItem> | null>(null);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const res = await api.studio.pages.list();
      setPages(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    try {
      await api.studio.pages.save(editingPage);
      setEditingPage(null);
      fetchPages();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this static page?')) return;
    try {
      await api.studio.pages.delete(slug);
      fetchPages();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Static Page Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage company narrative, Editorial Charter, Submission Guidelines, Contact, and statutory legal pages.
          </p>
        </div>
        <button
          onClick={() => setEditingPage({
            title: '',
            slug: '',
            template: 'default',
            content: '## New Page Title\n\nEnter static page body text...',
            status: 'published',
          })}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Page</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA] dark:bg-[#0E1116] text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              <th className="py-3 px-4">Title & Slug</th>
              <th className="py-3 px-4">Template</th>
              <th className="py-3 px-4">Excerpt / Summary</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Updated</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-400 font-mono text-xs">Loading static pages...</td>
              </tr>
            ) : pages.map((page) => (
              <tr key={page.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-semibold text-neutral-900 dark:text-white">{page.title}</div>
                  <div className="text-[11px] font-mono text-neutral-400">/{page.slug}</div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] capitalize text-neutral-600 dark:text-neutral-400">
                  {page.template.replace(/_/g, ' ')}
                </td>
                <td className="py-3 px-4 max-w-sm text-neutral-500 truncate">
                  {page.excerpt || page.content.slice(0, 100)}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                    {page.status}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-neutral-400">
                  {new Date(page.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => setEditingPage(page)}
                      className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(page.slug)}
                      className="p-1 rounded text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingPage && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#12161E] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {editingPage.id ? `Edit ${editingPage.title}` : 'Create Static Page'}
              </h3>
              <button onClick={() => setEditingPage(null)} className="p-1 text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Page Title</label>
                  <input
                    type="text"
                    required
                    value={editingPage.title || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={editingPage.slug || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                    className="w-full p-2 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Template</label>
                <select
                  value={editingPage.template || 'default'}
                  onChange={(e) => setEditingPage({ ...editingPage, template: e.target.value as any })}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                >
                  <option value="about">About Page</option>
                  <option value="editorial_charter">Editorial Charter</option>
                  <option value="contact">Contact Information</option>
                  <option value="submission_guidelines">Submission Guidelines</option>
                  <option value="legal">Legal / Privacy / Terms</option>
                  <option value="default">Standard Generic Page</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Page Markdown Content</label>
                <textarea
                  rows={10}
                  required
                  value={editingPage.content || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  className="w-full p-3 font-mono text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button type="button" onClick={() => setEditingPage(null)} className="px-3 py-1.5 text-xs text-neutral-500 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded">Save Page</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
