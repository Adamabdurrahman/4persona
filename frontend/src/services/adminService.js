import api from './api';

export const getAdminStats = async () => {
  const { data } = await api.get('/api/admin/stats');
  return data;
};

export const getAdminTemplates = async () => {
  const { data } = await api.get('/api/admin/templates');
  return data;
};

export const updateAdminTemplate = async (id, payload) => {
  const { data } = await api.put(`/api/admin/templates/${id}`, payload);
  return data;
};

export const getAdminResults = async (page = 1) => {
  const { data } = await api.get(`/api/admin/results?page=${page}`);
  return data;
};

export const updateAdminSales = async (count) => {
  const { data } = await api.patch('/api/admin/sales', { count });
  return data;
};

export const getAdminQuestions = async (element) => {
  const params = element ? `?element=${element}` : '';
  const { data } = await api.get(`/api/questions${params}`);
  return data;
};

export const createAdminQuestion = async (payload) => {
  const { data } = await api.post('/api/questions', payload);
  return data;
};

export const updateAdminQuestion = async (id, payload) => {
  const { data } = await api.put(`/api/questions/${id}`, payload);
  return data;
};

export const deleteAdminQuestion = async (id) => {
  const { data } = await api.delete(`/api/questions/${id}`);
  return data;
};

export const toggleAdminQuestion = async (id) => {
  const { data } = await api.patch(`/api/questions/${id}/toggle`);
  return data;
};
