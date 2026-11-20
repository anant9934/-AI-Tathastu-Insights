import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useStudioAuth } from '../context/StudioAuthContext';

interface StudioLoginPageProps {
  onBackToPublicSite: () => void;
}

export const StudioLoginPage: React.FC<StudioLoginPageProps> = ({ onBackToPublicSite }) => {
  const { login, quickLogin, isLoading } = useStudioAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleQuickRole = async (role: 'super_admin' | 'editor' | 'research_editor' | 'author') => {
    setError(null);
    try {
      await quickLogin(role);
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    }
  };

  const isDemoEnabled =
    typeof import.meta !== 'undefined' &&
    import.meta.env?.VITE_ENABLE_DEMO_PERSONAS === 'true' &&
    import.meta.env?.MODE !== 'production';

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotNotice(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setForgotNotice(data.message || 'If an account exists, instructions have been sent.');
    } catch {
      setForgotNotice('Password reset request submitted. Check your security inbox.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8F9FA] dark:bg-[#0B0D11] p-4 text-[#121417] dark:text-[#EAEAEA] antialiased">
      {/* Return to Public Website */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <button
          onClick={onBackToPublicSite}
          className="flex items-center space-x-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </button>
        <span className="text-[10px] font-mono text-neutral-400">Restricted Editorial Access</span>
      </div>

      {/* Main Authentication Box */}
      <div className="w-full max-w-md bg-white dark:bg-[#12161E] rounded-2xl shadow-xl border border-neutral-200/80 dark:border-neutral-800 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-serif font-bold text-lg shadow-sm">
            T
          </div>
          <div>
            <h1 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
              AI Tathastu Studio
            </h1>
            <p className="text-xs text-neutral-500">
              Editorial CMS & Centralized Site Administration
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start space-x-2 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="editorial@tathastu-insights.org"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-xs rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying Session...' : 'Sign In to Editorial Studio'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Pre-sets — ONLY visible when VITE_ENABLE_DEMO_PERSONAS === 'true' and not in production */}
        {isDemoEnabled && (
          <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
            <p className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider mb-2.5 text-center">
              Authorized Demo Personas (Development Only)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickRole('super_admin')}
                className="p-2 text-left rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="font-semibold text-[11px] text-neutral-900 dark:text-white">Dr. Aravind Nair</div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">Super Admin</div>
              </button>
              <button
                onClick={() => handleQuickRole('editor')}
                className="p-2 text-left rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="font-semibold text-[11px] text-neutral-900 dark:text-white">Prof. Clara Zheng</div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">Editor</div>
              </button>
              <button
                onClick={() => handleQuickRole('research_editor')}
                className="p-2 text-left rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="font-semibold text-[11px] text-neutral-900 dark:text-white">Vikram Sharma</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Research Editor</div>
              </button>
              <button
                onClick={() => handleQuickRole('author')}
                className="p-2 text-left rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="font-semibold text-[11px] text-neutral-900 dark:text-white">Dr. Elena Rostova</div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">Author</div>
              </button>
            </div>
          </div>
        )}

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white dark:bg-[#12161E] rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl">
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                Password Reset Request
              </h2>
              <p className="text-xs text-neutral-500 mb-4">
                Enter your verified editorial work email to receive a cryptographically signed reset token.
              </p>
              {forgotNotice && (
                <div className="mb-4 p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs">
                  {forgotNotice}
                </div>
              )}
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="editorial@tathastu-insights.org"
                  className="w-full px-3 py-2 text-xs rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center space-x-2 text-[11px] text-neutral-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>End-to-end encrypted session with immutable audit trails.</span>
      </div>
    </div>
  );
};
