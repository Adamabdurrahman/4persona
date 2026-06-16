import { useEffect } from 'react';
import api from '../services/api';

const PING_KEY = '4persona_visitor_pinged';
const PING_TTL_MS = 24 * 60 * 60 * 1000; // 24 jam (1 hari)

/**
 * useVisitorPing — POST /api/metrics/ping sekali per 24 jam per device (Unique Visitor)
 * Fire-and-forget, error diabaikan
 */
export function useVisitorPing() {
  useEffect(() => {
    try {
      const lastPing = localStorage.getItem(PING_KEY);
      const now = Date.now();

      if (lastPing && now - parseInt(lastPing, 10) < PING_TTL_MS) return;

      api.post('/api/metrics/ping')
        .then(() => localStorage.setItem(PING_KEY, String(now)))
        .catch(() => {});
    } catch {}
  }, []);
}
