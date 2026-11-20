import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, RefreshCw, Shield, Globe, Mail } from 'lucide-react';
import { SiteSettings } from '../../types/studio';
import { api } from '../../lib/api';

export const StudioSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [health, setHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const [settingsRes, healthRes] = await Promise.all([
        api.studio.settings.get(),
        api.system.getHealth(),
      ]);
      setSettings(settingsRes);
      setHealth(healthRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    try {
      await api.studio.settings.update(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center h-64 text-xs font-mono text-neutral-400">
        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
        <span>Loading global site settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Global Website & System Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure site identity, default SEO schemas, footer disclaimers, and inspect server-side security status.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-1.5 px-4 py-1.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-xs"
        >
          {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaving ? 'Saving...' : savedSuccess ? 'Saved' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. Identity & Branding */}
        <div className="p-6 bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
            Brand Identity & Public Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Website Title</label>
              <input
                type="text"
                required
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Official Contact Email</label>
              <input
                type="email"
                required
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Site Description</label>
            <textarea
              rows={2}
              required
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Brand Logo Path</label>
              <input
                type="text"
                value={settings.brandLogoUrl || ''}
                onChange={(e) => setSettings({ ...settings, brandLogoUrl: e.target.value })}
                className="w-full p-2 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Favicon Path</label>
              <input
                type="text"
                value={settings.faviconUrl || ''}
                onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                className="w-full p-2 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Footer Disclaimers */}
        <div className="p-6 bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800">
            Footer Configuration & Disclaimers
          </h2>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Copyright Notice</label>
            <input
              type="text"
              value={settings.footerConfig?.copyrightText || ''}
              onChange={(e) => setSettings({
                ...settings,
                footerConfig: { ...settings.footerConfig, copyrightText: e.target.value },
              })}
              className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Statutory Verification Notice</label>
            <input
              type="text"
              value={settings.footerConfig?.disclaimerText || ''}
              onChange={(e) => setSettings({
                ...settings,
                footerConfig: { ...settings.footerConfig, disclaimerText: e.target.value },
              })}
              className="w-full p-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 outline-none"
            />
          </div>
        </div>

        {/* 3. System Diagnostic & Security Invariants */}
        {health && (
          <div className="p-6 bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-900 dark:text-white pb-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span>Server-Side Security Invariants</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">Enforced</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">RBAC Invariant</span>
                <span className="font-bold text-neutral-900 dark:text-white">{health.security?.rbacEnforced ? 'ACTIVE' : 'OFFLINE'}</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Rate Limiting</span>
                <span className="font-bold text-neutral-900 dark:text-white">{health.security?.rateLimitingActive ? 'ACTIVE' : 'OFFLINE'}</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">DOI Verification</span>
                <span className="font-bold text-neutral-900 dark:text-white">{health.security?.doiVerificationEnforced ? 'ENFORCED' : 'OFFLINE'}</span>
              </div>
              <div className="p-2.5 rounded bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block">Audit Logging</span>
                <span className="font-bold text-neutral-900 dark:text-white">{health.security?.auditLoggingEnabled ? 'ENABLED' : 'OFFLINE'}</span>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
