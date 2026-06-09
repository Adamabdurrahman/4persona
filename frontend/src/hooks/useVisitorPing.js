import { useEffect } from 'react';

const PING_KEY = '4persona_visitor_pinged';
const PING_TTL_MS = 30 * 60 * 1000; // 30 menit

/**
 * useVisitorPing — POST /api/metrics/ping sekali per 30-menit sesi
 * Fire-and-forget, error diabaikan
 */
export function useVisitorPing() {
  useEffect(() => {
    try {
      const lastPing = sessionStorage.getItem(PING_KEY);
      const now = Date.now();

      if (lastPing && now - parseInt(lastPing, 10) < PING_TTL_MS) return;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      fetch(`${apiUrl}/metrics/ping`, { method: 'POST' })
        .then(() => sessionStorage.setItem(PING_KEY, String(now)))
        .catch(() => {});
    } catch {}
  }, []);
}
