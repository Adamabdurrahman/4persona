import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, logout as logoutService, getStoredToken, getStoredUser, clearAuth } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true saat pertama load

  // ── Inisialisasi: baca token dari localStorage saat app start ──
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // Ada token → verifikasi ke backend
      try {
        const userData = await getMe();
        setUser(userData);
      } catch {
        // Token invalid atau expired → bersihkan
        clearAuth();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ── Login: simpan user state setelah login berhasil ─────────
  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  // ── Logout ───────────────────────────────────────────────────
  const logout = useCallback(() => {
    logoutService();
    setUser(null);
  }, []);

  // ── Refresh user dari backend (setelah update profil, dll) ──
  const refreshUser = useCallback(async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch {
      logout();
    }
  }, [logout]);

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.isAdmin === true,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook: useAuth ─────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus digunakan di dalam <AuthProvider>');
  }
  return ctx;
}

export default AuthContext;
