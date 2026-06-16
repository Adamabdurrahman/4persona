import api from './api';

// ─── Public (no auth) ─────────────────────────────────────
export const getPublicVoucherInfo = async () => {
  const { data } = await api.get('/api/vouchers/public');
  return data;
};

// ─── User (requires auth) ─────────────────────────────────
export const getMyVoucher = async () => {
  const { data } = await api.get('/api/vouchers/my');
  return data;
};
