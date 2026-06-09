import axios from 'axios';

/**
 * Axios instance terpusat dengan base URL dari env
 * Semua API calls menggunakan instance ini
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: Tambahkan JWT token ke setiap request ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('4persona_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor: Handle 401 (token expired) ────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid — bersihkan localStorage
      localStorage.removeItem('4persona_token');
      localStorage.removeItem('4persona_user');
      // Redirect ke login jika bukan di halaman auth
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
