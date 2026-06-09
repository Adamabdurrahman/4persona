import api from './api';

export const getPublicMetrics = async () => {
  const { data } = await api.get('/api/metrics/public');
  return data;
};
