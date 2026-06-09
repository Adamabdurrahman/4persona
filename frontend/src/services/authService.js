import api from './api';

const AUTH_TOKEN_KEY = '4persona_token';
const AUTH_USER_KEY = '4persona_user';

// ── Helpers ──────────────────────────────────────────────────
export const saveAuth = (token, user) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ── API Calls ─────────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
export const register = async ({ name, email, password }) => {
  const { data } = await api.post('/api/auth/register', { name, email, password });
  saveAuth(data.token, data.user);
  return data;
};

/**
 * POST /api/auth/login
 */
export const login = async ({ email, password }) => {
  const { data } = await api.post('/api/auth/login', { email, password });
  saveAuth(data.token, data.user);
  return data;
};

/**
 * GET /api/auth/me — Ambil profil user yang sedang login
 */
export const getMe = async () => {
  const { data } = await api.get('/api/auth/me');
  return data;
};

/**
 * Login dengan Google — redirect browser ke backend OAuth
 */
export const loginWithGoogle = () => {
  window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/google`;
};

/**
 * Logout
 */
export const logout = () => {
  clearAuth();
};
