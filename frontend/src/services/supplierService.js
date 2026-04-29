import apiClient from './apiClient';

export const fetchSuppliers = async () => {
  const { data } = await apiClient.get('/suppliers/');
  return data;
};

export const createSupplier = async (payload) => {
  const { data } = await apiClient.post('/suppliers/', payload);
  return data;
};

export const updateSupplier = async (id, payload) => {
  const { data } = await apiClient.put(`/suppliers/${id}`, payload);
  return data;
};

export const deleteSupplier = async (id) => {
  const { data } = await apiClient.delete(`/suppliers/${id}`);
  return data;
};
