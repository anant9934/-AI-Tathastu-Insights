import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  CheckCircle, 
  Clock, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Code, 
  Quote, 
  AlertCircle, 
  BookOpen, 
  Image as ImageIcon, 
  FileText, 
  Calendar,
  Share2,
  History,
  Sliders,
  Copy,
  Check
} from 'lucide-react';
import { ContentItem, ContentBlock, ContentType, ContentStatus, ContentVersion } from '../../types/studio';
import { api } from '../../lib/api';

interface StudioEditorPageProps {
  contentId?: string;
  onBack: () => void;
  onPublished?: () => void;
}

export const StudioEditorPage: React.FC<StudioEditorPageProps> = ({
  contentId,
  onBack,
  onPublished,
}) => {
  const [item, setItem] = useState<Partial<ContentItem>>({
    title: 'Untitled Frontier Article',
    subtitle: '',
    abstract: '',
    contentType: 'company_story',
    category: 'Frontier Systems',
    status: 'draft',
    authorName: 'Dr. Aravind Nair',
    blocks: [
      { id: 'b1', type: 'paragraph', sortOrder: 1, content: { text: 'Start writing your research investigation or architecture note here...' } }
    ],
    seo: {
      metaTitle: '',
      metaDescription: '',
      noIndex: false,
    },
  });

  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [activeSidePanel, setActiveSidePanel] = useState<'metadata' | 'seo' | 'history'>('metadata');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [changelogNote, setChangelogNote] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Load existing content if contentId provided
  useEffect(() => {
    if (contentId) {
      api.studio.content.get(contentId).then((res) => {
        if (res?.item) {
          setItem(res.item);
          setVersions(res.versions || []);
        }
      }).catch((err) => {
        console.error('Failed to load item', err);
      });
    }
  }, [contentId]);

  // Compute live reading time and word count
  const allText = [
    item.title || '',
    item.abstract || '',
    ...(item.blocks || []).map((b) => (typeof b.content?.text === 'string' ? b.content.text : '')),
  ].join(' ');
  const wordCount = allText.trim() ? allText.trim().split(/\s+/).length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 220));

  // Save handler
  const handleSave = async (statusOverride?: ContentStatus) => {
    setSaveStatus('saving');
    try {
      const payload: Partial<ContentItem> = {
        ...item,
        wordCount,
        readingTimeMinutes,
        status: statusOverride || item.status || 'draft',
      };

      if (item.id) {
        const updated = await api.studio.content.update(item.id, payload, changelogNote || 'Saved in editor');
        setItem(updated);
        // Refresh versions
        const verRes = await api.studio.content.get(item.id);
        if (verRes?.versions) setVersions(verRes.versions);
      } else {
        const created = await api.studio.content.create(payload);
        setItem(created);
      }
      setChangelogNote('');
      setSaveStatus('saved');
      if (statusOverride === 'published' && onPublished) {
        onPublished();
      }
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
      setSaveStatus('unsaved');
    }
  };

  // Block management
  const addBlock = (type: ContentBlock['type']) => {
    const newId = `b-${Date.now()}`;
    let defaultContent: any = { text: '' };

    if (type === 'callout') {
      defaultContent = { variant: 'info', title: 'Key Takeaway', text: 'Important empirical observation.' };
    } else if (type === 'code') {
      defaultContent = { language: 'python', code: '# Enter runnable code or kernel snippet\ndef verify_invariants():\n    pass', explanation: 'Execution verification kernel' };
    } else if (type === 'image') {
      defaultContent = { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200', caption: 'Figure 1: Architectural topology' };
    } else if (type === 'citation') {
      defaultContent = { citationText: 'Vaswani et al., Attention Is All You Need, NeurIPS 2017.', doi: '10.48550/arXiv.1706.03762' };
    } else if (type === 'pullquote') {
      defaultContent = { text: 'Quote statement reflecting empirical finding.', attribution: 'Lead Investigator' };
    }

    const newBlock: ContentBlock = {
      id: newId,
      type,
      sortOrder: (item.blocks?.length || 0) + 1,
      content: defaultContent,
    };

    setItem((prev) => ({
      ...prev,
      blocks: [...(prev.blocks || []), newBlock],
    }));
    setSaveStatus('unsaved');
  };

  const updateBlockContent = (id: string, newContent: any) => {
    setItem((prev) => ({
      ...prev,
      blocks: (prev.blocks || []).map((b) => (b.id === id ? { ...b, content: { ...b.content, ...newContent } } : b)),
    }));
    setSaveStatus('unsaved');
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const blocks = [...(item.blocks || [])];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= blocks.length) return;

    const temp = blocks[index];
    blocks[index] = blocks[target];
    blocks[target] = temp;

    // Recalculate sortOrder
    blocks.forEach((b, idx) => {
      b.sortOrder = idx + 1;
    });

    setItem((prev) => ({ ...prev, blocks }));
    setSaveStatus('unsaved');
  };

  const deleteBlock = (id: string) => {
    setItem((prev) => ({
      ...prev,
      blocks: (prev.blocks || []).filter((b) => b.id !== id),
    }));
    setSaveStatus('unsaved');
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const restoreVersion = (v: ContentVersion) => {
    if (!confirm(`Restore Version ${v.versionNumber}? Unsaved changes in active editor will be replaced.`)) return;
    setItem((prev) => ({
      ...prev,
      title: v.title,
      subtitle: v.subtitle,
      abstract: v.abstract,
      blocks: v.blocks,
    }));
    setSaveStatus('unsaved');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-6 md:-m-8 bg-[#FAFAFA] dark:bg-[#0B0D11] text-[#121417] dark:text-[#EAEAEA]">
      {/* 1. TOP EDITOR CONTROL STRIP */}
      <div className="h-14 px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0E1116] flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Content Library</span>
          </button>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <span className="text-xs font-mono text-neutral-400">
            {saveStatus === 'saving' ? 'Saving changes...' : saveStatus === 'saved' ? 'All changes saved' : 'Unsaved changes'}
          </span>
        </div>

        {/* Center Toggle: Edit vs Preview */}
        <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-medium">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'editor' ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'preview' ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Right Publishing Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSave('draft')}
            className="px-3 py-1.5 rounded-md text-xs font-medium border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="px-3 py-1.5 rounded-md text-xs font-medium border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center space-x-1"
          >
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>Schedule</span>
          </button>
          <button
            onClick={() => handleSave('published')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-colors flex items-center space-x-1 shadow-xs"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Publish Now</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN SPLIT WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Writing / Preview Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6">
            {activeTab === 'editor' ? (
              <>
                {/* Document Title Header */}
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => {
                    setItem((prev) => ({ ...prev, title: e.target.value }));
                    setSaveStatus('unsaved');
                  }}
                  placeholder="Enter publication title..."
                  className="w-full text-2xl lg:text-3xl font-bold font-serif bg-transparent outline-none placeholder-neutral-300 dark:placeholder-neutral-700 text-neutral-900 dark:text-white tracking-tight leading-snug"
                />

                {/* Subtitle */}
                <input
                  type="text"
                  value={item.subtitle || ''}
                  onChange={(e) => {
                    setItem((prev) => ({ ...prev, subtitle: e.target.value }));
                    setSaveStatus('unsaved');
                  }}
                  placeholder="Supporting subtitle or core finding summary..."
                  className="w-full text-base bg-transparent outline-none placeholder-neutral-300 dark:placeholder-neutral-700 text-neutral-600 dark:text-neutral-400"
                />

                {/* Abstract Box */}
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12161E]">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 font-semibold">
                    Executive Abstract & Empirical Invariant Summary
                  </label>
                  <textarea
                    rows={3}
                    value={item.abstract || ''}
                    onChange={(e) => {
                      setItem((prev) => ({ ...prev, abstract: e.target.value }));
                      setSaveStatus('unsaved');
                    }}
                    placeholder="Concise overview of empirical evidence, methodology, and verified outcomes..."
                    className="w-full text-xs bg-transparent outline-none text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 resize-none leading-relaxed"
                  />
                </div>

                {/* Blocks Workspace */}
                <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  {(item.blocks || []).map((b, index) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl bg-white dark:bg-[#12161E] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs relative group"
                    >
                      {/* Block Controls Header */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100 dark:border-neutral-800/60 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                        <span className="font-semibold text-neutral-600 dark:text-neutral-400">
                          {b.type.toUpperCase()} BLOCK #{index + 1}
                        </span>
                        <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => moveBlock(index, 'up')}
                            disabled={index === 0}
                            title="Move Block Up"
                            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveBlock(index, 'down')}
                            disabled={index === (item.blocks?.length || 0) - 1}
                            title="Move Block Down"
                            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteBlock(b.id)}
                            title="Remove Block"
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Block Content Editor */}
                      {b.type === 'paragraph' && (
                        <textarea
                          rows={4}
                          value={b.content?.text || ''}
                          onChange={(e) => updateBlockContent(b.id, { text: e.target.value })}
                          placeholder="Write paragraph copy..."
                          className="w-full text-xs leading-relaxed bg-transparent outline-none resize-none text-neutral-800 dark:text-neutral-200"
                        />
                      )}

                      {(b.type === 'heading1' || b.type === 'heading2' || b.type === 'heading3') && (
                        <input
                          type="text"
                          value={b.content?.text || ''}
                          onChange={(e) => updateBlockContent(b.id, { text: e.target.value })}
                          placeholder={`Enter ${b.type} heading...`}
                          className={`w-full font-serif font-bold bg-transparent outline-none text-neutral-900 dark:text-white ${
                            b.type === 'heading1' ? 'text-xl' : b.type === 'heading2' ? 'text-lg' : 'text-base'
                          }`}
                        />
                      )}

                      {b.type === 'callout' && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={b.content?.title || ''}
                              onChange={(e) => updateBlockContent(b.id, { title: e.target.value })}
                              placeholder="Callout Header"
                              className="text-xs font-bold font-mono bg-transparent outline-none text-neutral-900 dark:text-white flex-1"
                            />
                            <select
                              value={b.content?.variant || 'info'}
                              onChange={(e) => updateBlockContent(b.id, { variant: e.target.value })}
                              className="text-[10px] font-mono px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                            >
                              <option value="info">Information Box</option>
                              <option value="warning">Warning / Risk</option>
                              <option value="key_takeaway">Key Takeaway</option>
                            </select>
                          </div>
                          <textarea
                            rows={2}
                            value={b.content?.text || ''}
                            onChange={(e) => updateBlockContent(b.id, { text: e.target.value })}
                            placeholder="Callout description..."
                            className="w-full text-xs bg-transparent outline-none text-neutral-700 dark:text-neutral-300 resize-none"
                          />
                        </div>
                      )}

                      {b.type === 'code' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={b.content?.language || 'python'}
                              onChange={(e) => updateBlockContent(b.id, { language: e.target.value })}
                              placeholder="Language (e.g. python, rust, cuda)"
                              className="text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded outline-none w-36"
                            />
                            <input
                              type="text"
                              value={b.content?.explanation || ''}
                              onChange={(e) => updateBlockContent(b.id, { explanation: e.target.value })}
                              placeholder="Explanation caption"
                              className="text-xs bg-transparent outline-none text-neutral-500 text-right flex-1 ml-4"
                            />
                          </div>
                          <textarea
                            rows={6}
                            value={b.content?.code || ''}
                            onChange={(e) => updateBlockContent(b.id, { code: e.target.value })}
                            placeholder="Paste verifiable code..."
                            className="w-full p-3 font-mono text-xs bg-[#0F1117] text-emerald-400 rounded-lg outline-none resize-none leading-relaxed"
                          />
                        </div>
                      )}

                      {b.type === 'image' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={b.content?.url || ''}
                            onChange={(e) => updateBlockContent(b.id, { url: e.target.value })}
                            placeholder="Image URL..."
                            className="w-full text-xs font-mono p-2 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                          />
                          <input
                            type="text"
                            value={b.content?.caption || ''}
                            onChange={(e) => updateBlockContent(b.id, { caption: e.target.value })}
                            placeholder="Figure caption and attribution..."
                            className="w-full text-xs text-neutral-500 bg-transparent outline-none"
                          />
                          {b.content?.url && (
                            <img
                              src={b.content.url}
                              alt="Block preview"
                              className="h-32 w-full object-cover rounded-lg border border-neutral-200 dark:border-neutral-800"
                            />
                          )}
                        </div>
                      )}

                      {b.type === 'pullquote' && (
                        <div className="space-y-2 pl-3 border-l-2 border-neutral-900 dark:border-white">
                          <textarea
                            rows={2}
                            value={b.content?.text || ''}
                            onChange={(e) => updateBlockContent(b.id, { text: e.target.value })}
                            placeholder="Pullquote text..."
                            className="w-full font-serif italic text-sm bg-transparent outline-none resize-none text-neutral-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={b.content?.attribution || ''}
                            onChange={(e) => updateBlockContent(b.id, { attribution: e.target.value })}
                            placeholder="Quote attribution (e.g. Lead Researcher)"
                            className="w-full text-xs text-neutral-500 bg-transparent outline-none"
                          />
                        </div>
                      )}

                      {b.type === 'citation' && (
                        <div className="space-y-2 p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg">
                          <textarea
                            rows={2}
                            value={b.content?.citationText || ''}
                            onChange={(e) => updateBlockContent(b.id, { citationText: e.target.value })}
                            placeholder="Formal citation string..."
                            className="w-full text-xs bg-transparent outline-none resize-none"
                          />
                          <input
                            type="text"
                            value={b.content?.doi || ''}
                            onChange={(e) => updateBlockContent(b.id, { doi: e.target.value })}
                            placeholder="Canonical DOI (e.g. 10.5281/zenodo.1084291)"
                            className="w-full font-mono text-[11px] text-neutral-500 bg-transparent outline-none"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Block Toolbar */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                    Add Content Block
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => addBlock('paragraph')}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center space-x-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Paragraph</span>
                    </button>
                    <button
                      onClick={() => addBlock('heading2')}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center space-x-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Heading</span>
                    </button>
                    <button
                      onClick={() => addBlock('callout')}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center space-x-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                      <span>Callout</span>
                    </button>
                    <button
                      onClick={() => addBlock('code')}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center space-x-1.5"
                    >
                      <Code className="w-3.5 h-3.5 text-amber-500" />
                      <span>Code Block</span>
                    </button>
                    <button
                      onClick={() => addBlock('image')}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center space-x-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-cyan-500" />
                      <span>Image</span>
                    </button>
                    <button
                      onClick={() => addBlock('pullquote')}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center space-x-1.5"
                    >
                      <Quote className="w-3.5 h-3.5 text-purple-500" />
                      <span>Pull Quote</span>
                    </button>
                    <button
                      onClick={() => addBlock('citation')}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center space-x-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Citation</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Public Preview Simulation */
              <div className="bg-white dark:bg-[#12161E] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm space-y-6">
                <div className="space-y-3 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center space-x-2 text-xs text-neutral-400 font-mono">
                    <span className="uppercase">{item.contentType?.replace(/_/g, ' ')}</span>
                    <span>•</span>
                    <span>{readingTimeMinutes} min read</span>
                    <span>•</span>
                    <span>By {item.authorName}</span>
                  </div>
                  <h1 className="text-3xl font-serif font-bold text-neutral-900 dark:text-white leading-tight">
                    {item.title}
                  </h1>
                  {item.subtitle && (
                    <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {item.abstract && (
                  <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold block mb-1">Abstract</span>
                    {item.abstract}
                  </div>
                )}

                <div className="space-y-6 text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  {(item.blocks || []).map((b) => (
                    <div key={b.id}>
                      {b.type === 'paragraph' && <p>{b.content?.text}</p>}
                      {b.type === 'heading2' && <h2 className="text-xl font-bold font-serif text-neutral-900 dark:text-white pt-2">{b.content?.text}</h2>}
                      {b.type === 'heading3' && <h3 className="text-lg font-bold font-serif text-neutral-900 dark:text-white pt-2">{b.content?.text}</h3>}
                      {b.type === 'callout' && (
                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
                          <strong className="block font-semibold mb-0.5">{b.content?.title}</strong>
                          {b.content?.text}
                        </div>
                      )}
                      {b.type === 'code' && (
                        <div className="rounded-lg overflow-hidden border border-neutral-800 bg-[#0F1117] p-3 text-xs font-mono text-emerald-400">
                          <pre>{b.content?.code}</pre>
                        </div>
                      )}
                      {b.type === 'image' && (
                        <figure className="space-y-1">
                          <img src={b.content?.url} alt={b.content?.caption} className="rounded-lg w-full max-h-80 object-cover" />
                          <figcaption className="text-[11px] text-neutral-400 text-center">{b.content?.caption}</figcaption>
                        </figure>
                      )}
                      {b.type === 'pullquote' && (
                        <blockquote className="pl-4 border-l-2 border-neutral-900 dark:border-white font-serif italic text-base text-neutral-900 dark:text-white">
                          "{b.content?.text}"
                          <footer className="text-xs font-sans not-italic text-neutral-400 mt-1">— {b.content?.attribution}</footer>
                        </blockquote>
                      )}
                      {b.type === 'citation' && (
                        <div className="text-xs p-3 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-neutral-600 dark:text-neutral-400">
                          {b.content?.citationText} (DOI: {b.content?.doi})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Inspector & Settings Sidebar */}
        <aside className="w-80 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0E1116] flex flex-col flex-shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs font-medium">
            <button
              onClick={() => setActiveSidePanel('metadata')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeSidePanel === 'metadata'
                  ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Metadata
            </button>
            <button
              onClick={() => setActiveSidePanel('seo')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeSidePanel === 'seo'
                  ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              SEO & Social
            </button>
            <button
              onClick={() => setActiveSidePanel('history')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeSidePanel === 'history'
                  ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Versions ({versions.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
            {activeSidePanel === 'metadata' && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Content Type
                  </label>
                  <select
                    value={item.contentType || 'company_story'}
                    onChange={(e) => {
                      setItem((prev) => ({ ...prev, contentType: e.target.value as ContentType }));
                      setSaveStatus('unsaved');
                    }}
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  >
                    <option value="company_story">Company Story</option>
                    <option value="product_announcement">Product Announcement</option>
                    <option value="product_development_update">Product Dev Update</option>
                    <option value="engineering_article">Engineering Article</option>
                    <option value="research_article">Research Article</option>
                    <option value="research_report">Research Report</option>
                    <option value="tutorial_guide">Tutorial / Guide</option>
                    <option value="company_announcement">Company Announcement</option>
                    <option value="perspective_interview">Perspective / Interview</option>
                    <option value="case_study">Case Study</option>
                    <option value="media_publication">Media Publication</option>
                    <option value="company_page">Company Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Editorial Category
                  </label>
                  <input
                    type="text"
                    value={item.category || ''}
                    onChange={(e) => {
                      setItem((prev) => ({ ...prev, category: e.target.value }));
                      setSaveStatus('unsaved');
                    }}
                    placeholder="e.g. Interpretability, Agentic Systems"
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={item.slug || ''}
                    onChange={(e) => {
                      setItem((prev) => ({ ...prev, slug: e.target.value }));
                      setSaveStatus('unsaved');
                    }}
                    placeholder="custom-article-slug"
                    className="w-full p-2 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Primary Author
                  </label>
                  <input
                    type="text"
                    value={item.authorName || ''}
                    onChange={(e) => {
                      setItem((prev) => ({ ...prev, authorName: e.target.value }));
                      setSaveStatus('unsaved');
                    }}
                    placeholder="Author name"
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Related Product
                  </label>
                  <select
                    value={item.relatedProductId || ''}
                    onChange={(e) => {
                      setItem((prev) => ({ ...prev, relatedProductId: e.target.value || undefined }));
                      setSaveStatus('unsaved');
                    }}
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  >
                    <option value="">None / Independent</option>
                    <option value="mentormaze">MentorMaze</option>
                    <option value="collaborate">Collaborate</option>
                    <option value="avsar">Avsar</option>
                    <option value="iris">Iris</option>
                  </select>
                </div>

                {/* Feature Toggles */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!item.isFeatured}
                      onChange={(e) => {
                        setItem((prev) => ({ ...prev, isFeatured: e.target.checked }));
                        setSaveStatus('unsaved');
                      }}
                      className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                    />
                    <span className="text-xs">Feature on Homepage</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!item.isEditorsChoice}
                      onChange={(e) => {
                        setItem((prev) => ({ ...prev, isEditorsChoice: e.target.checked }));
                        setSaveStatus('unsaved');
                      }}
                      className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                    />
                    <span className="text-xs">Editor's Choice Badge</span>
                  </label>
                </div>

                {/* Live Stats */}
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg space-y-1 font-mono text-[11px] text-neutral-500">
                  <div>Word Count: <span className="font-bold text-neutral-900 dark:text-white">{wordCount}</span></div>
                  <div>Est. Reading Time: <span className="font-bold text-neutral-900 dark:text-white">{readingTimeMinutes} min</span></div>
                  <div>Blocks in Document: <span className="font-bold text-neutral-900 dark:text-white">{item.blocks?.length || 0}</span></div>
                </div>
              </>
            )}

            {activeSidePanel === 'seo' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={item.seo?.metaTitle || ''}
                    onChange={(e) => {
                      setItem((prev) => ({ ...prev, seo: { ...prev.seo, metaTitle: e.target.value } }));
                      setSaveStatus('unsaved');
                    }}
                    placeholder="Search engine title..."
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={item.seo?.metaDescription || ''}
                    onChange={(e) => {
                      setItem((prev) => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }));
                      setSaveStatus('unsaved');
                    }}
                    placeholder="SERP preview snippet (150-160 chars)..."
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Open Graph Social Image URL
                  </label>
                  <input
                    type="text"
                    value={item.seo?.ogImage || item.coverImageUrl || ''}
                    onChange={(e) => {
                      setItem((prev) => ({ ...prev, seo: { ...prev.seo, ogImage: e.target.value } }));
                      setSaveStatus('unsaved');
                    }}
                    placeholder="https://..."
                    className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none font-mono"
                  />
                </div>

                <label className="flex items-center space-x-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={!!item.seo?.noIndex}
                    onChange={(e) => {
                      setItem((prev) => ({ ...prev, seo: { ...prev.seo, noIndex: e.target.checked } }));
                      setSaveStatus('unsaved');
                    }}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <span className="text-xs">No-Index (Exclude from Search Engines)</span>
                </label>
              </div>
            )}

            {activeSidePanel === 'history' && (
              <div className="space-y-3">
                <p className="text-[11px] text-neutral-400">
                  Every publish and manual save creates an immutable version snapshot.
                </p>
                {versions.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="font-bold text-neutral-900 dark:text-white">v{v.versionNumber}</span>
                      <span className="text-neutral-400">{new Date(v.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">
                      {v.changelog || 'Automated snapshot'}
                    </p>
                    <button
                      onClick={() => restoreVersion(v)}
                      className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline pt-1 block"
                    >
                      Restore this version
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Schedule Publication Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#12161E] rounded-xl max-w-sm w-full p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Schedule Publication
            </h3>
            <p className="text-xs text-neutral-500 mt-1 mb-4">
              Select date and time for automated public release.
            </p>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="px-3 py-1.5 text-xs text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setItem((prev) => ({ ...prev, scheduledAt: scheduledDate, status: 'scheduled' }));
                  handleSave('scheduled');
                  setIsScheduleModalOpen(false);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
