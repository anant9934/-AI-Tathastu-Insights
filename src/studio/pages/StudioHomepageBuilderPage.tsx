import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Eye, ArrowUp, ArrowDown, Check, RefreshCw } from 'lucide-react';
import { HomepageConfig } from '../../types/studio';
import { api } from '../../lib/api';

export const StudioHomepageBuilderPage: React.FC = () => {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await api.studio.homepage.get();
      setConfig(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setIsSaving(true);
    try {
      await api.studio.homepage.update(config);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSection = (id: string) => {
    if (!config) return;
    setConfig({
      ...config,
      sectionsConfig: config.sectionsConfig.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!config) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= config.sectionsConfig.length) return;

    const arr = [...config.sectionsConfig];
    const temp = arr[index];
    arr[index] = arr[target];
    arr[target] = temp;

    arr.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setConfig({ ...config, sectionsConfig: arr });
  };

  if (isLoading || !config) {
    return (
      <div className="flex items-center justify-center h-64 text-xs font-mono text-neutral-400">
        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
        <span>Loading homepage composition...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Homepage Composition Builder
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure the public hero narrative, featured story, highlighted products, and section sequence without code changes.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-1.5 px-4 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
        >
          {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaving ? 'Saving...' : savedSuccess ? 'Published to Public Site' : 'Save Composition'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Hero Narrative Composer */}
        <div className="p-6 bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4 text-xs">
          <div className="flex items-center space-x-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 dark:text-white">
              Hero Section Narrative & Media
            </h2>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Main Hero Headline
            </label>
            <input
              type="text"
              required
              value={config.heroHeadline}
              onChange={(e) => setConfig({ ...config, heroHeadline: e.target.value })}
              className="w-full p-2.5 text-sm font-serif font-bold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Hero Subtitle
            </label>
            <input
              type="text"
              required
              value={config.heroSubtitle}
              onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
              className="w-full p-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Supporting Editorial Description
            </label>
            <textarea
              rows={3}
              required
              value={config.heroDescription}
              onChange={(e) => setConfig({ ...config, heroDescription: e.target.value })}
              className="w-full p-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Primary CTA Button</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={config.primaryCtaText}
                  onChange={(e) => setConfig({ ...config, primaryCtaText: e.target.value })}
                  placeholder="Label"
                  className="p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
                <input
                  type="text"
                  value={config.primaryCtaLink}
                  onChange={(e) => setConfig({ ...config, primaryCtaLink: e.target.value })}
                  placeholder="#target"
                  className="p-2 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Secondary CTA Button</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={config.secondaryCtaText}
                  onChange={(e) => setConfig({ ...config, secondaryCtaText: e.target.value })}
                  placeholder="Label"
                  className="p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
                <input
                  type="text"
                  value={config.secondaryCtaLink}
                  onChange={(e) => setConfig({ ...config, secondaryCtaLink: e.target.value })}
                  placeholder="#target"
                  className="p-2 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Hero Backdrop Media URL</label>
            <input
              type="text"
              value={config.heroMediaUrl || ''}
              onChange={(e) => setConfig({ ...config, heroMediaUrl: e.target.value })}
              className="w-full p-2 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
            />
          </div>
        </div>

        {/* 2. Supported Sections Sequence & Visibility */}
        <div className="p-6 bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
          <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 dark:text-white">
              Homepage Section Sequence & Visibility
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Reorder or toggle public homepage sections while strictly preserving the approved design system and responsive rules.
            </p>
          </div>

          <div className="space-y-2">
            {config.sectionsConfig.map((sec, index) => (
              <div
                key={sec.id}
                className="p-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-center space-y-0.5 text-neutral-400">
                    <button
                      type="button"
                      onClick={() => handleMoveSection(index, 'up')}
                      disabled={index === 0}
                      className="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-20"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSection(index, 'down')}
                      disabled={index === config.sectionsConfig.length - 1}
                      className="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-20"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">{sec.title}</h3>
                    <p className="text-[11px] text-neutral-400">{sec.description}</p>
                  </div>
                </div>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sec.enabled}
                    onChange={() => handleToggleSection(sec.id)}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <span className="text-xs text-neutral-700 dark:text-neutral-300">
                    {sec.enabled ? 'Visible' : 'Hidden'}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
