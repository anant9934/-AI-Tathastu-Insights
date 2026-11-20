import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudioUser, UserRole } from '../../types/studio';
import { api } from '../../lib/api';

interface StudioAuthContextType {
  user: StudioUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  quickLogin: (role: 'super_admin' | 'editor' | 'research_editor' | 'author') => Promise<void>;
  logout: () => void;
}

const StudioAuthContext = createContext<StudioAuthContextType | undefined>(undefined);

interface DemoAccount {
  id: string;
  email: string;
  pass: string;
  name: string;
  roleId: UserRole;
  affiliation: string;
}

export const DEMO_CREDENTIALS: Record<string, DemoAccount> = {
  super_admin: {
    id: 'usr-admin-01',
    email: 'admin@tathastu-insights.org',
    pass: 'TathastuFrontierAdmin2026!',
    name: 'Dr. Aravind Nair',
    roleId: 'super_admin',
    affiliation: 'Frontier Alignment Group, AI Tathastu',
  },
  admin: {
    id: 'usr-admin-ops',
    email: 'admin-desk@tathastu-insights.org',
    pass: 'TathastuAdminDesk2026!',
    name: 'Siddharth Rao',
    roleId: 'admin',
    affiliation: 'Digital Operations Desk',
  },
  editor: {
    id: 'usr-editor-01',
    email: 'editor@tathastu-insights.org',
    pass: 'TathastuEditorialDesk2026!',
    name: 'Prof. Clara Zheng',
    roleId: 'editor',
    affiliation: 'Editorial Review Board',
  },
  research_editor: {
    id: 'usr-reviewer-01',
    email: 'reviewer@tathastu-insights.org',
    pass: 'TathastuReviewer2026!',
    name: 'Vikram Sharma',
    roleId: 'research_editor',
    affiliation: 'Distributed Swarm Consortium',
  },
  media_manager: {
    id: 'usr-media-01',
    email: 'media@tathastu-insights.org',
    pass: 'TathastuMediaManager2026!',
    name: 'Maya Sen',
    roleId: 'media_manager',
    affiliation: 'Visual Communications & Media Lab',
  },
  author: {
    id: 'usr-author-01',
    email: 'author@institution.edu',
    pass: 'TathastuAuthor2026!',
    name: 'Dr. Elena Rostova',
    roleId: 'author',
    affiliation: 'Iris Vision Labs',
  },
  contributor: {
    id: 'usr-contrib-01',
    email: 'contributor@community.org',
    pass: 'TathastuContributor2026!',
    name: 'Arun Kumar',
    roleId: 'contributor',
    affiliation: 'Independent Community Researcher',
  },
};

export const StudioAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tathastu_auth_token'));
  const [user, setUser] = useState<StudioUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('tathastu_auth_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await api.auth.getProfile();
        if (profile?.user) {
          setUser(profile.user);
        } else {
          // Token invalid or expired
          localStorage.removeItem('tathastu_auth_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        // Fallback for demo when backend is in sandbox or offline
        const parsed = decodeJwt(storedToken);
        if (parsed) {
          setUser({
            id: parsed.id || 'usr-local',
            email: parsed.email || 'user@tathastu.org',
            name: parsed.name || 'Editorial Staff',
            roleId: (parsed.roleId as UserRole) || 'super_admin',
            isActive: true,
            createdAt: new Date().toISOString(),
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, password);
      if (res.token) {
        setToken(res.token);
        setUser(res.user);
      }
    } catch (err: any) {
      // In development / demo mode, if the standalone backend server is not running,
      // allow instant client fallback for registered personas.
      const matched = Object.values(DEMO_CREDENTIALS).find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          (!password || u.pass === password.trim())
      );

      if (matched && typeof import.meta !== 'undefined' && import.meta.env?.MODE !== 'production') {
        const payload = {
          id: matched.id,
          email: matched.email,
          name: matched.name,
          roleId: matched.roleId,
          affiliation: matched.affiliation,
          exp: Math.floor(Date.now() / 1000) + 7 * 86400,
        };
        const clientToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(payload))}.dev_signature`;
        localStorage.setItem('tathastu_auth_token', clientToken);
        setToken(clientToken);
        setUser({
          id: matched.id,
          email: matched.email,
          name: matched.name,
          roleId: matched.roleId,
          affiliation: matched.affiliation,
          isActive: true,
          createdAt: new Date().toISOString(),
        });
        return;
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (role: 'super_admin' | 'editor' | 'research_editor' | 'author') => {
    const creds = DEMO_CREDENTIALS[role];
    if (creds) {
      await login(creds.email, creds.pass);
    }
  };

  const logout = () => {
    api.auth.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <StudioAuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        quickLogin,
        logout,
      }}
    >
      {children}
    </StudioAuthContext.Provider>
  );
};

export const useStudioAuth = (): StudioAuthContextType => {
  const context = useContext(StudioAuthContext);
  if (!context) {
    throw new Error('useStudioAuth must be used within a StudioAuthProvider');
  }
  return context;
};

function decodeJwt(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = atob(parts[1]);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}
