import apiClient from './apiClient';

export const fetchAutomationLogs = async () => {
  const { data } = await apiClient.get('/automation/logs');
  return data;
};

export const triggerAutomation = async () => {
  const { data } = await apiClient.post('/automation/trigger');
  return data;
};
