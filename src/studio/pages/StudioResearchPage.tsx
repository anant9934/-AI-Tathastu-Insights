import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit3, Trash2, CheckCircle2, ShieldCheck, ExternalLink, RefreshCw, X, Download } from 'lucide-react';
import { ResearchItem } from '../../types/studio';
import { api } from '../../lib/api';

export const StudioResearchPage: React.FC = () => {
  const [papers, setPapers] = useState<ResearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [editingPaper, setEditingPaper] = useState<Partial<ResearchItem> | null>(null);

  const fetchPapers = async () => {
    setIsLoading(true);
    try {
      const res = await api.studio.research.list();
      setPapers(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleVerifyDoi = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await api.studio.research.verifyDoi(id);
      fetchPapers();
      alert(`DOI Verification: ${res.verificationResult.isVerified ? 'VERIFIED' : 'DEMONSTRATION RECORD'}\nSource: ${res.verificationResult.source}`);
    } catch (err: any) {
      alert(`Verification failed: ${err.message}`);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPaper) return;
    try {
      if (editingPaper.id && papers.some((p) => p.id === editingPaper.id)) {
        await api.studio.research.update(editingPaper.id, editingPaper);
      } else {
        await api.studio.research.create(editingPaper);
      }
      setEditingPaper(null);
      fetchPapers();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this research paper?')) return;
    try {
      await api.studio.research.delete(id);
      fetchPapers();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Research Papers & Open Archive
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage peer-reviewed preprints, live CrossRef DOI resolutions, BibTeX exports, and verifiable provenance disclosures.
          </p>
        </div>
        <button
          onClick={() => setEditingPaper({
            title: '',
            slug: '',
            doi: '',
            publicationType: 'Preprint',
            abstract: '',
            authors: [{ name: 'Dr. Aravind Nair', affiliation: 'Frontier Alignment Group' }],
            categoryId: 'interpretability',
            publisher: 'AI Tathastu Insights Open Science Archive',
            license: 'CC BY-NC 4.0',
            sourceVerificationStatus: 'needs_review',
            isDownloadAvailable: true,
            status: 'published',
            bibtex: '',
          })}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Research Paper</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA] dark:bg-[#0E1116] text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              <th className="py-3 px-4">Title & Authors</th>
              <th className="py-3 px-4">DOI & Verification</th>
              <th className="py-3 px-4">Provenance</th>
              <th className="py-3 px-4">Downloads</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-neutral-400 font-mono text-xs">Loading research archive...</td>
              </tr>
            ) : papers.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4 max-w-sm">
                  <div className="font-semibold text-neutral-900 dark:text-white truncate">{p.title}</div>
                  <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {p.authors.map((a) => a.name).join(', ')} • {p.publicationDate}
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {p.doi ? (
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] text-neutral-600 dark:text-neutral-300">{p.doi}</span>
                      <button
                        onClick={() => handleVerifyDoi(p.id)}
                        disabled={verifyingId === p.id}
                        title="Run Live CrossRef/DataCite Verification"
                        className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                      >
                        <RefreshCw className={`w-3 h-3 ${verifyingId === p.id ? 'animate-spin text-blue-500' : ''}`} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-neutral-400 font-mono">No DOI assigned</span>
                  )}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                    p.sourceVerificationStatus === 'verified'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                      : p.sourceVerificationStatus === 'demonstration'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                      : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
                  }`}>
                    {p.sourceVerificationStatus === 'verified' ? 'Verified Minted' : p.sourceVerificationStatus === 'demonstration' ? 'Prototype Record' : 'Needs Review'}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                  {p.downloadCount}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => setEditingPaper(p)}
                      title="Edit Paper"
                      className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      title="Delete Paper"
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

      {editingPaper && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#12161E] rounded-xl max-w-xl w-full max-h-[90vh] flex flex-col border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {editingPaper.id ? `Edit ${editingPaper.title}` : 'Register Research Paper'}
              </h3>
              <button onClick={() => setEditingPaper(null)} className="p-1 text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs custom-scrollbar">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Paper Title</label>
                <input
                  type="text"
                  required
                  value={editingPaper.title || ''}
                  onChange={(e) => setEditingPaper({ ...editingPaper, title: e.target.value })}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">DOI Identifier</label>
                  <input
                    type="text"
                    value={editingPaper.doi || ''}
                    onChange={(e) => setEditingPaper({ ...editingPaper, doi: e.target.value })}
                    placeholder="10.5281/zenodo..."
                    className="w-full p-2 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Provenance Status</label>
                  <select
                    value={editingPaper.sourceVerificationStatus || 'demonstration'}
                    onChange={(e) => setEditingPaper({ ...editingPaper, sourceVerificationStatus: e.target.value as any })}
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  >
                    <option value="verified">Verified CrossRef / DataCite</option>
                    <option value="demonstration">Demonstration / Prototype Metadata</option>
                    <option value="needs_review">Needs Review</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Abstract</label>
                <textarea
                  rows={4}
                  required
                  value={editingPaper.abstract || ''}
                  onChange={(e) => setEditingPaper({ ...editingPaper, abstract: e.target.value })}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">BibTeX Citation Record</label>
                <textarea
                  rows={4}
                  value={editingPaper.bibtex || ''}
                  onChange={(e) => setEditingPaper({ ...editingPaper, bibtex: e.target.value })}
                  className="w-full p-2 font-mono text-[11px] rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button type="button" onClick={() => setEditingPaper(null)} className="px-3 py-1.5 text-xs text-neutral-500 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded">Save Paper</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
