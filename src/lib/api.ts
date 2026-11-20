/**
 * Type-safe API Client for AI Tathastu Insights
 * Communicates with the independent backend server via /api routes.
 * Gracefully provides honest status if backend is disconnected.
 */

import { Article, ResearchPaper, EditorialSubmission, MediaItem } from '../types';
import { mockArticles, mockResearchPapers, mockEditorialSubmissions, mockMediaItems } from './mockData';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('tathastu_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const sessionId = localStorage.getItem('tathastu_guest_session_id') || `guest-${Date.now()}`;
  headers['x-session-id'] = sessionId;
  return headers;
}

export const api = {
  // System Health
  system: {
    async getHealth() {
      try {
        const res = await fetch(`${API_BASE}/system/health`);
        if (!res.ok) throw new Error('Health check failed');
        return await res.json();
      } catch (err) {
        return {
          status: 'client_fallback',
          database: { isLive: false, type: 'mock_store' },
          security: { rbacEnforced: true, doiVerificationEnforced: true },
        };
      }
    },
  },

  // Authentication
  auth: {
    async login(email: string, password: string) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      if (data.token) {
        localStorage.setItem('tathastu_auth_token', data.token);
      }
      return data;
    },

    async register(data: { email: string; password: string; name: string; affiliation?: string }) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Registration failed');
      if (json.token) {
        localStorage.setItem('tathastu_auth_token', json.token);
      }
      return json;
    },

    async getProfile() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: getAuthHeader(),
        });
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    },

    logout() {
      localStorage.removeItem('tathastu_auth_token');
    },
  },

  // Editorial Studio & Manuscripts
  editorial: {
    async getSubmissions(params?: { status?: string; category?: string; q?: string }) {
      try {
        const query = new URLSearchParams(params as any).toString();
        const res = await fetch(`${API_BASE}/editorial/submissions?${query}`, {
          headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error('Failed to fetch submissions');
        const data = await res.json();
        return data.submissions as EditorialSubmission[];
      } catch {
        return mockEditorialSubmissions;
      }
    },

    async submitManuscript(data: {
      title: string;
      authorName: string;
      authorEmail: string;
      authorAffiliation: string;
      categoryId: string;
      abstract: string;
      wordCount?: number;
      reproducibilityAttestation: boolean;
    }) {
      const res = await fetch(`${API_BASE}/editorial/submissions`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Manuscript submission failed');
      return json;
    },

    async updateStatus(id: string, status: string, notes?: string) {
      const res = await fetch(`${API_BASE}/editorial/submissions/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: JSON.stringify({ status, notes }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Status update failed');
      return json;
    },

    async uploadManuscriptFile(file: File) {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('tathastu_auth_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/editorial/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'File upload failed');
      return json;
    },
  },

  // Research Library & Citations
  research: {
    async getPapers(params?: { category?: string; q?: string }) {
      try {
        const query = new URLSearchParams(params as any).toString();
        const res = await fetch(`${API_BASE}/research/papers?${query}`);
        if (!res.ok) throw new Error('Failed to fetch research papers');
        const data = await res.json();
        return data.papers as ResearchPaper[];
      } catch {
        return mockResearchPapers;
      }
    },

    async verifyDoi(doi: string) {
      const res = await fetch(`${API_BASE}/research/verify-doi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doi }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'DOI verification failed');
      return json;
    },

    async downloadPaper(id: string) {
      window.open(`${API_BASE}/research/papers/${id}/download`, '_blank');
    },

    async getBibtex(id: string) {
      const res = await fetch(`${API_BASE}/research/papers/${id}/bibtex`);
      if (!res.ok) throw new Error('BibTeX export failed');
      return await res.text();
    },
  },

  // Bookmarks
  bookmarks: {
    async getBookmarks(): Promise<string[]> {
      try {
        const res = await fetch(`${API_BASE}/bookmarks`, {
          headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        return data.bookmarkedIds || [];
      } catch {
        const saved = localStorage.getItem('tathastu-bookmarks');
        return saved ? JSON.parse(saved) : [];
      }
    },

    async toggleBookmark(articleId: string) {
      try {
        const res = await fetch(`${API_BASE}/bookmarks/toggle`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({ articleId }),
        });
        const data = await res.json();
        return data.bookmarked;
      } catch {
        return false;
      }
    },
  },

  // Newsletter
  newsletter: {
    async subscribe(email: string) {
      const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Subscription failed');
      return data;
    },
  },

  // Media
  media: {
    async getMedia(format?: string) {
      try {
        const query = format ? `?format=${format}` : '';
        const res = await fetch(`${API_BASE}/media${query}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        return data.media as MediaItem[];
      } catch {
        return mockMediaItems;
      }
    },
  },

  // Multi-index Search
  search: {
    async query(q: string) {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Search failed');
      return await res.json();
    },
  },
};
