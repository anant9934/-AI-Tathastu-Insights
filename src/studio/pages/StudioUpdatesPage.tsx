import React, { useState, useEffect } from 'react';
import { BellRing, Plus, Edit3, Trash2, X, Tag } from 'lucide-react';
import { UpdateItem } from '../../types/studio';
import { api } from '../../lib/api';

export const StudioUpdatesPage: React.FC = () => {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUpdate, setEditingUpdate] = useState<Partial<UpdateItem> | null>(null);

  const fetchUpdates = async () => {
    setIsLoading(true);
    try {
      const res = await api.studio.updates.list();
      setUpdates(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUpdate) return;
    try {
      if (editingUpdate.id && updates.some((u) => u.id === editingUpdate.id)) {
        await api.studio.updates.update(editingUpdate.id, editingUpdate);
      } else {
        await api.studio.updates.create(editingUpdate);
      }
      setEditingUpdate(null);
      fetchUpdates();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return;
    try {
      await api.studio.updates.delete(id);
      fetchUpdates();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Company Updates & Releases
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Publish milestone announcements, product releases, engineering progress, and protocol changelogs.
          </p>
        </div>
        <button
          onClick={() => setEditingUpdate({
            title: '',
            slug: '',
            summary: '',
            category: 'Product Release',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            authorName: 'Engineering Desk',
            status: 'published',
            content: [],
            tags: [],
          })}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Update</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA] dark:bg-[#0E1116] text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              <th className="py-3 px-4">Headline & Summary</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Product Tag</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-400 font-mono text-xs">Loading updates...</td>
              </tr>
            ) : updates.map((u) => (
              <tr key={u.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4 max-w-sm">
                  <div className="font-semibold text-neutral-900 dark:text-white truncate">{u.title}</div>
                  <div className="text-[11px] text-neutral-400 truncate mt-0.5">{u.summary}</div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    <span>{u.category}</span>
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-neutral-500 capitalize">
                  {u.productId || 'Company'}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">
                  {u.date}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                    {u.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => setEditingUpdate(u)}
                      className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
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

      {editingUpdate && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#12161E] rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {editingUpdate.id ? `Edit Update` : 'Create New Update'}
              </h3>
              <button onClick={() => setEditingUpdate(null)} className="p-1 text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs custom-scrollbar">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={editingUpdate.title || ''}
                  onChange={(e) => setEditingUpdate({ ...editingUpdate, title: e.target.value })}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Category</label>
                  <select
                    value={editingUpdate.category || 'Product Release'}
                    onChange={(e) => setEditingUpdate({ ...editingUpdate, category: e.target.value as any })}
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  >
                    <option value="Product Release">Product Release</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Research">Research</option>
                    <option value="Milestone">Milestone</option>
                    <option value="Company">Company</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Related Product</label>
                  <select
                    value={editingUpdate.productId || ''}
                    onChange={(e) => setEditingUpdate({ ...editingUpdate, productId: e.target.value || undefined })}
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  >
                    <option value="">Company Global</option>
                    <option value="mentormaze">MentorMaze</option>
                    <option value="collaborate">Collaborate</option>
                    <option value="avsar">Avsar</option>
                    <option value="iris">Iris</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Summary</label>
                <textarea
                  rows={2}
                  required
                  value={editingUpdate.summary || ''}
                  onChange={(e) => setEditingUpdate({ ...editingUpdate, summary: e.target.value })}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Detailed Technical Explanation</label>
                <textarea
                  rows={4}
                  value={editingUpdate.detailedExplanation || ''}
                  onChange={(e) => setEditingUpdate({ ...editingUpdate, detailedExplanation: e.target.value })}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button type="button" onClick={() => setEditingUpdate(null)} className="px-3 py-1.5 text-xs text-neutral-500 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded">Save Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
