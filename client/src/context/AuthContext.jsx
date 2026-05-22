import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// ─── Helper: read user from localStorage synchronously ───────────────────────
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('userInfo');
    if (raw) return JSON.parse(raw);
  } catch { /* corrupted data */ }
  return null;
};

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage SYNCHRONOUSLY (no flash of unauthenticated)
  const [user, setUser] = useState(() => {
    const stored = getStoredUser();
    if (stored) {
      console.log('[AuthContext] Initialized from localStorage:', stored.email);
    }
    return stored;
  });
  const [loading, setLoading] = useState(false);

  // ─── Login ───────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    console.log('[AuthContext] Attempting login for:', email);

    const response = await api.post('/auth/login', { email, password });
    const data = response.data;

    console.log('[AuthContext] Login response:', data);

    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    // Build user data object with token
    const userData = {
      _id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      token: data.token,
    };

    // Persist to localStorage FIRST (so ProtectedRoute can read it synchronously)
    localStorage.setItem('userInfo', JSON.stringify(userData));
    // Then update React state
    setUser(userData);

    console.log('[AuthContext] ✅ Login successful, user stored:', userData.email);
    return userData;
  }, []);

  // ─── Logout ──────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    console.log('[AuthContext] Logging out');
    setUser(null);
    localStorage.removeItem('userInfo');
  }, []);

  // ─── Auth check helper ─────────────────────────────────────────────────
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
