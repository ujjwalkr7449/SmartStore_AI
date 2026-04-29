import apiClient from './apiClient';

export const fetchDashboardSummary = async () => {
  const { data } = await apiClient.get('/dashboard/summary');
  return data;
};
