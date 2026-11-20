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

  // Studio CMS Backend APIs (Private Editorial Workspace)
  studio: {
    dashboard: {
      async getMetrics() {
        const res = await fetch(`${API_BASE}/studio/dashboard`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to load dashboard metrics');
        return await res.json();
      },
    },

    content: {
      async list(params?: { type?: string; status?: string; productId?: string; authorId?: string; q?: string; limit?: number; offset?: number }) {
        const query = new URLSearchParams(params as any).toString();
        const res = await fetch(`${API_BASE}/studio/content?${query}`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to list content');
        return await res.json();
      },
      async get(id: string) {
        const res = await fetch(`${API_BASE}/studio/content/${id}`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to get content item');
        return await res.json();
      },
      async create(data: any) {
        const res = await fetch(`${API_BASE}/studio/content`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to create content');
        return json;
      },
      async update(id: string, data: any, changelog?: string) {
        const res = await fetch(`${API_BASE}/studio/content/${id}`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify({ ...data, changelog }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to update content');
        return json;
      },
      async updateStatus(id: string, status: string, notes?: string) {
        const res = await fetch(`${API_BASE}/studio/content/${id}/status`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({ status, notes }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to update status');
        return json;
      },
      async duplicate(id: string) {
        const res = await fetch(`${API_BASE}/studio/content/${id}/duplicate`, {
          method: 'POST',
          headers: getAuthHeader(),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to duplicate content');
        return json;
      },
      async delete(id: string) {
        const res = await fetch(`${API_BASE}/studio/content/${id}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to delete content');
        return json;
      },
    },

    products: {
      async list() {
        const res = await fetch(`${API_BASE}/studio/products`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to list products');
        return await res.json();
      },
      async get(id: string) {
        const res = await fetch(`${API_BASE}/studio/products/${id}`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to get product');
        return await res.json();
      },
      async create(data: any) {
        const res = await fetch(`${API_BASE}/studio/products`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to create product');
        return json;
      },
      async update(id: string, data: any) {
        const res = await fetch(`${API_BASE}/studio/products/${id}`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to update product');
        return json;
      },
      async reorder(orderIds: string[]) {
        const res = await fetch(`${API_BASE}/studio/products/reorder`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({ orderIds }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to reorder products');
        return json;
      },
      async delete(id: string) {
        const res = await fetch(`${API_BASE}/studio/products/${id}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to delete product');
        return json;
      },
    },

    engineering: {
      async list() {
        const res = await fetch(`${API_BASE}/studio/engineering`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to list engineering articles');
        return await res.json();
      },
      async create(data: any) {
        const res = await fetch(`${API_BASE}/studio/engineering`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to create engineering article');
        return json;
      },
      async update(id: string, data: any) {
        const res = await fetch(`${API_BASE}/studio/engineering/${id}`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to update engineering article');
        return json;
      },
      async delete(id: string) {
        const res = await fetch(`${API_BASE}/studio/engineering/${id}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to delete engineering article');
        return json;
      },
    },

    research: {
      async list() {
        const res = await fetch(`${API_BASE}/studio/research`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to list research papers');
        return await res.json();
      },
      async create(data: any) {
        const res = await fetch(`${API_BASE}/studio/research`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to create research paper');
        return json;
      },
      async update(id: string, data: any) {
        const res = await fetch(`${API_BASE}/studio/research/${id}`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to update research paper');
        return json;
      },
      async verifyDoi(id: string) {
        const res = await fetch(`${API_BASE}/studio/research/${id}/verify-doi`, {
          method: 'POST',
          headers: getAuthHeader(),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to verify DOI');
        return json;
      },
      async delete(id: string) {
        const res = await fetch(`${API_BASE}/studio/research/${id}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to delete research paper');
        return json;
      },
    },

    updates: {
      async list() {
        const res = await fetch(`${API_BASE}/studio/updates`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to list updates');
        return await res.json();
      },
      async create(data: any) {
        const res = await fetch(`${API_BASE}/studio/updates`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to create update');
        return json;
      },
      async update(id: string, data: any) {
        const res = await fetch(`${API_BASE}/studio/updates/${id}`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to update update');
        return json;
      },
      async delete(id: string) {
        const res = await fetch(`${API_BASE}/studio/updates/${id}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to delete update');
        return json;
      },
    },

    media: {
      async list(params?: { format?: string; q?: string }) {
        const query = new URLSearchParams(params as any).toString();
        const res = await fetch(`${API_BASE}/studio/media?${query}`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to list media');
        return await res.json();
      },
      async upload(data: any) {
        const res = await fetch(`${API_BASE}/studio/media`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to upload media');
        return json;
      },
      async update(id: string, data: any) {
        const res = await fetch(`${API_BASE}/studio/media/${id}`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to update media');
        return json;
      },
      async delete(id: string) {
        const res = await fetch(`${API_BASE}/studio/media/${id}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to delete media');
        return json;
      },
    },

    pages: {
      async list() {
        const res = await fetch(`${API_BASE}/studio/pages`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to list pages');
        return await res.json();
      },
      async get(slug: string) {
        const res = await fetch(`${API_BASE}/studio/pages/${slug}`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to get page');
        return await res.json();
      },
      async save(data: any) {
        const res = await fetch(`${API_BASE}/studio/pages`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to save page');
        return json;
      },
      async delete(slug: string) {
        const res = await fetch(`${API_BASE}/studio/pages/${slug}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to delete page');
        return json;
      },
    },

    navigation: {
      async get() {
        const res = await fetch(`${API_BASE}/studio/navigation`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to get navigation');
        return await res.json();
      },
      async update(location: 'main' | 'footer' | 'product', items: any[]) {
        const res = await fetch(`${API_BASE}/studio/navigation/${location}`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify({ items }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to update navigation');
        return json;
      },
    },

    homepage: {
      async get() {
        const res = await fetch(`${API_BASE}/studio/homepage`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to get homepage config');
        return await res.json();
      },
      async update(data: any) {
        const res = await fetch(`${API_BASE}/studio/homepage`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to update homepage config');
        return json;
      },
    },

    newsletter: {
      async list() {
        const res = await fetch(`${API_BASE}/studio/newsletter`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to list newsletter subscribers');
        return await res.json();
      },
      exportCsvUrl() {
        return `${API_BASE}/studio/newsletter/export`;
      },
    },

    analytics: {
      async get() {
        const res = await fetch(`${API_BASE}/studio/analytics`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to get analytics');
        return await res.json();
      },
    },

    users: {
      async list() {
        const res = await fetch(`${API_BASE}/studio/users`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to list users');
        return await res.json();
      },
      async create(data: any) {
        const res = await fetch(`${API_BASE}/studio/users`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to create user');
        return json;
      },
      async updateRole(id: string, roleId: string) {
        const res = await fetch(`${API_BASE}/studio/users/${id}/role`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify({ roleId }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to update user role');
        return json;
      },
      async delete(id: string) {
        const res = await fetch(`${API_BASE}/studio/users/${id}`, {
          method: 'DELETE',
          headers: getAuthHeader(),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to delete user');
        return json;
      },
    },

    settings: {
      async get() {
        const res = await fetch(`${API_BASE}/studio/settings`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to get settings');
        return await res.json();
      },
      async update(data: any) {
        const res = await fetch(`${API_BASE}/studio/settings`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Failed to update settings');
        return json;
      },
    },

    audit: {
      async list(limit = 100) {
        const res = await fetch(`${API_BASE}/studio/audit?limit=${limit}`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error('Failed to get audit trail');
        return await res.json();
      },
    },
  },

  // Public Synchronization Endpoints
  public: {
    async getHomepage() {
      try {
        const res = await fetch(`${API_BASE}/public/homepage`);
        if (!res.ok) throw new Error();
        return await res.json();
      } catch {
        return null;
      }
    },
    async getProducts() {
      try {
        const res = await fetch(`${API_BASE}/public/products`);
        if (!res.ok) throw new Error();
        return await res.json();
      } catch {
        return null;
      }
    },
    async getEngineering() {
      try {
        const res = await fetch(`${API_BASE}/public/engineering`);
        if (!res.ok) throw new Error();
        return await res.json();
      } catch {
        return null;
      }
    },
    async getResearch() {
      try {
        const res = await fetch(`${API_BASE}/public/research`);
        if (!res.ok) throw new Error();
        return await res.json();
      } catch {
        return null;
      }
    },
    async getUpdates() {
      try {
        const res = await fetch(`${API_BASE}/public/updates`);
        if (!res.ok) throw new Error();
        return await res.json();
      } catch {
        return null;
      }
    },
    async getMedia() {
      try {
        const res = await fetch(`${API_BASE}/public/media`);
        if (!res.ok) throw new Error();
        return await res.json();
      } catch {
        return null;
      }
    },
    async getPage(slug: string) {
      try {
        const res = await fetch(`${API_BASE}/public/pages/${slug}`);
        if (!res.ok) throw new Error();
        return await res.json();
      } catch {
        return null;
      }
    },
    async getNavigation() {
      try {
        const res = await fetch(`${API_BASE}/public/navigation`);
        if (!res.ok) throw new Error();
        return await res.json();
      } catch {
        return null;
      }
    },
    async getSettings() {
      try {
        const res = await fetch(`${API_BASE}/public/settings`);
        if (!res.ok) throw new Error();
        return await res.json();
      } catch {
        return null;
      }
    },
    async getArticles(params?: { type?: string; limit?: number; offset?: number }) {
      try {
        const query = new URLSearchParams(params as any).toString();
        const res = await fetch(`${API_BASE}/public/articles?${query}`);
        if (!res.ok) throw new Error();
        return await res.json();
      } catch {
        return null;
      }
    },
  },
};
