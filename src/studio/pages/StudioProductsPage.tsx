import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  CheckCircle, 
  X,
  AlertCircle
} from 'lucide-react';
import { ProductItem } from '../../types/studio';
import { api } from '../../lib/api';

export const StudioProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.studio.products.list();
      setProducts(res || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      if (editingProduct.id && products.some((p) => p.id === editingProduct.id)) {
        await api.studio.products.update(editingProduct.id, editingProduct);
      } else {
        await api.studio.products.create(editingProduct);
      }
      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.studio.products.delete(id);
      fetchProducts();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= products.length) return;

    const reordered = [...products];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;

    const ids = reordered.map((p) => p.id);
    try {
      const updated = await api.studio.products.reorder(ids);
      setProducts(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: ProductItem['status']) => {
    switch (status) {
      case 'Live Platform':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">Live Platform</span>;
      case 'Beta Lab':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">Beta Lab</span>;
      case 'Prototype':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">Prototype</span>;
      case 'In Development':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40">In Development</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Ecosystem Product Administration
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage public products, verifiable architectures, tech stacks, and prototype status labels without source code changes.
          </p>
        </div>
        <button
          onClick={() => setEditingProduct({
            name: '',
            slug: '',
            tagline: '',
            shortDescription: '',
            fullDescription: '',
            status: 'Prototype',
            provenanceLabel: 'Functional Demonstration',
            accentColor: 'blue',
            isPublished: true,
            features: [],
            techStack: [],
            docLinks: [],
            screenshots: [],
          })}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA] dark:bg-[#0E1116] text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              <th className="py-3 px-4 w-12 text-center">Order</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Tagline & Architecture</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Provenance</th>
              <th className="py-3 px-4">Public Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-neutral-400 font-mono text-xs">
                  Loading product records...
                </td>
              </tr>
            ) : products.map((p, index) => (
              <tr key={p.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4 text-center font-mono text-neutral-400">
                  <div className="flex flex-col items-center space-y-0.5">
                    <button
                      onClick={() => handleReorder(index, 'up')}
                      disabled={index === 0}
                      className="p-0.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-20"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">{index + 1}</span>
                    <button
                      onClick={() => handleReorder(index, 'down')}
                      disabled={index === products.length - 1}
                      className="p-0.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-20"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="font-semibold text-neutral-900 dark:text-white flex items-center space-x-2">
                    <span>{p.name}</span>
                    {p.isFeatured && (
                      <span className="text-[10px] font-mono px-1 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-neutral-400">/{p.slug}</div>
                </td>
                <td className="py-3 px-4 max-w-md">
                  <p className="text-neutral-700 dark:text-neutral-300 truncate">{p.tagline}</p>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">{p.shortDescription}</p>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {getStatusBadge(p.status)}
                </td>
                <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-neutral-500">
                  {p.provenanceLabel}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                    p.isPublished
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                      : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700'
                  }`}>
                    {p.isPublished ? 'Public' : 'Hidden'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => setEditingProduct(p)}
                      title="Edit Product"
                      className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      title="Delete Product"
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

      {/* Product Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#12161E] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {editingProduct.id ? `Edit ${editingProduct.name}` : 'Register New Ecosystem Product'}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Slug / Identifier</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.slug || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    className="w-full p-2 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={editingProduct.tagline || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  placeholder="One sentence architectural summary..."
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Full Architectural Overview</label>
                <textarea
                  rows={4}
                  value={editingProduct.fullDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fullDescription: e.target.value })}
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Operational Status</label>
                  <select
                    value={editingProduct.status || 'Prototype'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  >
                    <option value="Live Platform">Live Platform</option>
                    <option value="Beta Lab">Beta Lab</option>
                    <option value="Prototype">Prototype</option>
                    <option value="In Development">In Development</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Audit Provenance Label</label>
                  <select
                    value={editingProduct.provenanceLabel || 'Functional Demonstration'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, provenanceLabel: e.target.value })}
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  >
                    <option value="Live Implementation">Live Implementation</option>
                    <option value="Functional Demonstration">Functional Demonstration</option>
                    <option value="In Development">In Development</option>
                    <option value="Planned Roadmap">Planned Roadmap</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={editingProduct.coverImageUrl || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, coverImageUrl: e.target.value })}
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Accent Theme</label>
                  <select
                    value={editingProduct.accentColor || 'blue'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, accentColor: e.target.value })}
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  >
                    <option value="blue">Blue</option>
                    <option value="violet">Violet</option>
                    <option value="green">Green</option>
                    <option value="indigo">Indigo</option>
                    <option value="amber">Amber</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Technical Architecture Summary</label>
                <textarea
                  rows={2}
                  value={editingProduct.technicalArchitecture || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, technicalArchitecture: e.target.value })}
                  placeholder="Daemon topology, communication protocol, hardware constraints..."
                  className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none"
                />
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPublished !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isPublished: e.target.checked })}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <span>Published on Public Website</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingProduct.isFeatured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-100"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
