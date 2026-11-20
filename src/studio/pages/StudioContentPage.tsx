import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit3, 
  Copy, 
  Eye, 
  CheckCircle, 
  Archive, 
  Trash2, 
  ArrowUpDown, 
  RefreshCw,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { ContentItem, ContentType, ContentStatus } from '../../types/studio';
import { api } from '../../lib/api';

interface StudioContentPageProps {
  onOpenEditor: (contentId?: string) => void;
}

const CONTENT_TYPES: { id: ContentType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Content Types' },
  { id: 'company_story', label: 'Company Stories' },
  { id: 'product_announcement', label: 'Product Announcements' },
  { id: 'product_development_update', label: 'Product Dev Updates' },
  { id: 'engineering_article', label: 'Engineering Articles' },
  { id: 'research_article', label: 'Research Articles' },
  { id: 'research_report', label: 'Research Reports' },
  { id: 'tutorial_guide', label: 'Tutorials & Guides' },
  { id: 'company_announcement', label: 'Company Announcements' },
  { id: 'perspective_interview', label: 'Perspectives & Interviews' },
  { id: 'case_study', label: 'Case Studies' },
  { id: 'media_publication', label: 'Media Publications' },
  { id: 'company_page', label: 'Company Pages' },
];

const STATUS_FILTERS: { id: ContentStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All Statuses' },
  { id: 'draft', label: 'Draft' },
  { id: 'in_review', label: 'In Review' },
  { id: 'approved', label: 'Approved' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'published', label: 'Published' },
  { id: 'archived', label: 'Archived' },
];

export const StudioContentPage: React.FC<StudioContentPageProps> = ({ onOpenEditor }) => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & State
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const res = await api.studio.content.list({
        q: search || undefined,
        type: selectedType !== 'all' ? selectedType : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      });
      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Failed to fetch content', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [selectedType, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContent();
  };

  const handleDuplicate = async (id: string) => {
    try {
      await api.studio.content.duplicate(id);
      fetchContent();
    } catch (err) {
      alert('Failed to duplicate content');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.studio.content.updateStatus(id, newStatus);
      fetchContent();
    } catch (err) {
      alert('Status update failed');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.studio.content.delete(id);
      setDeleteConfirmId(null);
      fetchContent();
    } catch (err) {
      alert('Deletion failed');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(items.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleBulkStatus = async (status: string) => {
    for (const id of selectedIds) {
      await api.studio.content.updateStatus(id, status).catch(() => {});
    }
    setSelectedIds([]);
    fetchContent();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) return;
    for (const id of selectedIds) {
      await api.studio.content.delete(id).catch(() => {});
    }
    setSelectedIds([]);
    fetchContent();
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'published':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">Published</span>;
      case 'approved':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">Approved</span>;
      case 'in_review':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">In Review</span>;
      case 'scheduled':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40">Scheduled</span>;
      case 'archived':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">Archived</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">Draft</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Unified Content Manager
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Create, audit, and orchestrate all 12 publication types across AI Tathastu Insights.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onOpenEditor()}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Content</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, abstract, slug, or author..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {/* Content Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 outline-none"
          >
            {CONTENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 outline-none"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          <button
            onClick={fetchContent}
            title="Refresh"
            className="p-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bulk Action Strip */}
      {selectedIds.length > 0 && (
        <div className="p-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg flex items-center justify-between text-xs animate-in fade-in duration-100">
          <span className="font-mono">{selectedIds.length} items selected</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkStatus('published')}
              className="px-2 py-1 rounded bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium hover:opacity-90"
            >
              Publish Selected
            </button>
            <button
              onClick={() => handleBulkStatus('archived')}
              className="px-2 py-1 rounded bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-medium hover:opacity-90"
            >
              Archive
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-2 py-1 rounded bg-rose-600 text-white text-xs font-medium hover:bg-rose-700"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA] dark:bg-[#0E1116] text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                <th className="py-3 px-4 w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === items.length}
                    onChange={handleSelectAll}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                </th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400 font-mono text-xs">
                    Loading content records...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400 text-xs">
                    No content entries match your filter criteria.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleToggleSelect(item.id)}
                        className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                      />
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-semibold text-neutral-900 dark:text-white truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                        /{item.slug} {item.isFeatured && <span className="text-purple-600 dark:text-purple-400 font-medium font-mono ml-1">• Featured</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 capitalize whitespace-nowrap">
                      {item.contentType.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                      {item.authorName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-500 whitespace-nowrap capitalize">
                      {item.relatedProductId || '—'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-400 whitespace-nowrap">
                      {new Date(item.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onOpenEditor(item.id)}
                          title="Edit in Rich Editor"
                          className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(item.id)}
                          title="Duplicate Content"
                          className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {item.status === 'published' ? (
                          <button
                            onClick={() => handleStatusChange(item.id, 'draft')}
                            title="Unpublish to Draft"
                            className="p-1 rounded text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(item.id, 'published')}
                            title="Publish Immediately"
                            className="p-1 rounded text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          title="Delete Content"
                          className="p-1 rounded text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 font-mono">
          <span>Showing {items.length} of {total} records</span>
          <span>Server-Side Dynamic Filter</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#12161E] rounded-xl max-w-sm w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Confirm Content Deletion
            </h3>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              This action permanently removes the selected content record and all associated version snapshots from the database.
            </p>
            <div className="mt-5 flex items-center justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
