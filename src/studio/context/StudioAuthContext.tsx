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

const DEMO_CREDENTIALS: Record<string, { email: string; pass: string }> = {
  super_admin: {
    email: 'admin@tathastu-insights.org',
    pass: 'TathastuFrontierAdmin2026!',
  },
  editor: {
    email: 'editor@tathastu-insights.org',
    pass: 'TathastuEditorialDesk2026!',
  },
  research_editor: {
    email: 'reviewer@tathastu-insights.org',
    pass: 'TathastuReviewer2026!',
  },
  author: {
    email: 'author@institution.edu',
    pass: 'TathastuAuthor2026!',
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
