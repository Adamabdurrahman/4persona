import api from './api';

export const submitTest = async (payload) => {
  const { data } = await api.post('/api/tests/submit', payload);
  return data;
};

export const getReport = async (token) => {
  const { data } = await api.get(`/api/tests/report/${token}`);
  return data;
};

export const getHistory = async () => {
  const { data } = await api.get('/api/tests/history');
  return data;
};

export const submitFeedback = async (testId, rating, text) => {
  const { data } = await api.post(`/api/tests/${testId}/feedback`, { rating, text });
  return data;
};
