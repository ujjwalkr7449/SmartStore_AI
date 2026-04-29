import apiClient from './apiClient';

export const sendChat = (payload) => apiClient.post('/ai/chat', payload).then((r) => r.data);

export const uploadInvoice = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post('/ai/invoice/parse', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
