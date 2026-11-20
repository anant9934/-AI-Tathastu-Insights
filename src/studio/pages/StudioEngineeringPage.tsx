import React, { useState, useEffect } from 'react';
import { Terminal, Plus, Edit3, Trash2, Code, ArrowUpRight, CheckCircle, X } from 'lucide-react';
import { EngineeringItem } from '../../types/studio';
import { api } from '../../lib/api';

export const StudioEngineeringPage: React.FC = () => {
  const [articles, setArticles] = useState<EngineeringItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Partial<EngineeringItem> | null>(null);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await api.studio.engineering.list();
      setArticles(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    try {
      if (editingArticle.id && articles.some((a) => a.id === editingArticle.id)) {
        await api.studio.engineering.update(editingArticle.id, editingArticle);
      } else {
        await api.studio.engineering.create(editingArticle);
      }
      setEditingArticle(null);
      fetchArticles();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this engineering note?')) return;
    try {
      await api.studio.engineering.delete(id);
      fetchArticles();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Engineering Deep-Dives & Architecture
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Publish verifiable system architectures, Triton/CUDA kernels, distributed protocols, and measured benchmarks.
          </p>
        </div>
        <button
          onClick={() => setEditingArticle({
            title: '',
            slug: '',
            subtitle: '',
            category: 'System Architecture',
            abstract: '',
            content: [],
            authorName: 'Vikram Sharma',
            tags: [],
            status: 'published',
            codeSnippets: [],
          })}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Architecture Note</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA] dark:bg-[#0E1116] text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              <th className="py-3 px-4">Title & Context</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4">Related Product</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-400 font-mono text-xs">Loading articles...</td>
              </tr>
            ) : articles.map((a) => (
              <tr key={a.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4 max-w-sm">
                  <div className="font-semibold text-neutral-900 dark:text-white truncate">{a.title}</div>
                  <div className="text-[11px] text-neutral-400 truncate mt-0.5">{a.abstract}</div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-neutral-600 dark:text-neutral-400">{a.category}</td>
                <td className="py-3 px-4 whitespace-nowrap text-neutral-800 dark:text-neutral-200">{a.authorName}</td>
                <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-neutral-500 uppercase">{a.relatedProductId || '—'}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                    a.status === 'published' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => setEditingArticle(a)}
                      className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
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

      {editingArticle && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#12161E] rounded-xl max-w-xl w-full max-h-[90vh] flex flex-col border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {editingArticle.id ? `Edit ${editingArticle.title}` : 'Create Engineering Architecture Note'}
              </h3>
              <button onClick={() => setEditingArticle(null)} className="p-1 text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs custom-scrollbar">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.slug || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    className="w-full p-2 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingArticle.category || 'System Architecture'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Abstract</label>
                <textarea
                  rows={3}
                  required
                  value={editingArticle.abstract || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, abstract: e.target.value })}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Problem & Technical Context</label>
                <textarea
                  rows={3}
                  value={editingArticle.problem || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, problem: e.target.value })}
                  placeholder="What failure mode or hardware bottleneck is addressed..."
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Implementation Details</label>
                <textarea
                  rows={3}
                  value={editingArticle.implementation || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, implementation: e.target.value })}
                  placeholder="Kernel optimizations, locks, communication patterns..."
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button type="button" onClick={() => setEditingArticle(null)} className="px-3 py-1.5 text-xs text-neutral-500 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded">Save Article</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
