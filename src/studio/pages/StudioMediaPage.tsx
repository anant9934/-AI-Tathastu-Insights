import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  X, 
  Film, 
  FileText, 
  Music, 
  ExternalLink,
  Edit2
} from 'lucide-react';
import { MediaAssetItem } from '../../types/studio';
import { api } from '../../lib/api';

export const StudioMediaPage: React.FC = () => {
  const [media, setMedia] = useState<MediaAssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MediaAssetItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // New Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadFormat, setUploadFormat] = useState<'image' | 'video' | 'pdf' | 'documentary' | 'dialogue'>('image');
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await api.studio.media.list({
        format: filterFormat !== 'all' ? filterFormat : undefined,
        q: search || undefined,
      });
      setMedia(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [filterFormat]);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.studio.media.upload({
        title: uploadTitle,
        coverImageUrl: uploadUrl,
        format: uploadFormat,
        altText: uploadAlt,
        caption: uploadCaption,
        description: uploadCaption || uploadTitle,
        durationSeconds: 0,
        durationLabel: '',
        speaker: 'Staff',
        speakerRole: 'Author',
        isStreamAvailable: false,
      });
      setIsUploadOpen(false);
      setUploadTitle('');
      setUploadUrl('');
      setUploadAlt('');
      setUploadCaption('');
      fetchMedia();
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media asset?')) return;
    try {
      await api.studio.media.delete(id);
      if (selectedAsset?.id === id) setSelectedAsset(null);
      fetchMedia();
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  const handleUpdateMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    try {
      await api.studio.media.update(selectedAsset.id, {
        altText: selectedAsset.altText,
        caption: selectedAsset.caption,
        attribution: selectedAsset.attribution,
      });
      fetchMedia();
      alert('Metadata updated');
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Media Library & Assets
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Centralized media repository for high-resolution photography, diagrams, audio dialogues, and video masters.
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80">
        <div className="flex-1 relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchMedia()}
            placeholder="Search media by title or description..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none"
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 outline-none"
          >
            <option value="all">All Media Types</option>
            <option value="image">Images</option>
            <option value="documentary">Video Documentaries</option>
            <option value="dialogue">Audio Dialogues</option>
            <option value="pdf">PDF Documents</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-xs text-neutral-400 font-mono">
            Loading media assets...
          </div>
        ) : media.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-neutral-400">
            No media assets found.
          </div>
        ) : (
          media.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className={`rounded-xl border bg-white dark:bg-[#12161E] overflow-hidden cursor-pointer transition-all hover:shadow-md group flex flex-col ${
                selectedAsset?.id === asset.id
                  ? 'border-neutral-900 dark:border-white ring-1 ring-neutral-900 dark:ring-white'
                  : 'border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="h-36 bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden flex items-center justify-center">
                {asset.coverImageUrl ? (
                  <img
                    src={asset.coverImageUrl}
                    alt={asset.altText || asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-neutral-400" />
                )}
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-900/80 text-white backdrop-blur-xs">
                  {asset.format}
                </span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                    {asset.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {asset.caption || asset.description || 'No caption'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(asset.id, asset.coverImageUrl || asset.streamUrl || '');
                    }}
                    className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center space-x-1"
                  >
                    {copiedId === asset.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === asset.id ? 'Copied' : 'Copy URL'}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(asset.id);
                    }}
                    className="text-neutral-400 hover:text-rose-600 p-1 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected Asset Metadata Drawer / Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#12161E] rounded-xl max-w-lg w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                {selectedAsset.title}
              </h3>
              <button onClick={() => setSelectedAsset(null)} className="p-1 text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            {selectedAsset.coverImageUrl && (
              <img
                src={selectedAsset.coverImageUrl}
                alt={selectedAsset.altText || ''}
                className="w-full h-44 object-cover rounded-lg my-4 border border-neutral-200 dark:border-neutral-700"
              />
            )}
            <form onSubmit={handleUpdateMetadata} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Alt Text (Accessibility)</label>
                <input
                  type="text"
                  value={selectedAsset.altText || ''}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, altText: e.target.value })}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Caption</label>
                <input
                  type="text"
                  value={selectedAsset.caption || ''}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, caption: e.target.value })}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Attribution / Source</label>
                <input
                  type="text"
                  value={selectedAsset.attribution || ''}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, attribution: e.target.value })}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedAsset.id)}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Delete Asset
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md"
                >
                  Save Metadata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Media Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#12161E] rounded-xl max-w-md w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Register / Upload Media Asset</h3>
              <button onClick={() => setIsUploadOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Asset Title</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. MentorMaze Execution Pipeline Architecture"
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Media Format</label>
                <select
                  value={uploadFormat}
                  onChange={(e) => setUploadFormat(e.target.value as any)}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                >
                  <option value="image">Image / Diagram</option>
                  <option value="video">Video Stream</option>
                  <option value="documentary">Documentary Feature</option>
                  <option value="dialogue">Audio Dialogue</option>
                  <option value="pdf">PDF Attachment</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Direct Media URL</label>
                <input
                  type="text"
                  required
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /downloads/..."
                  className="w-full p-2 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Alt Text (Accessibility)</label>
                <input
                  type="text"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="Descriptive alt text for screen readers"
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Caption / Credits</label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Figure 1: Architectural description"
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button type="button" onClick={() => setIsUploadOpen(false)} className="px-3 py-1.5 text-xs text-neutral-500 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded">Register Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
