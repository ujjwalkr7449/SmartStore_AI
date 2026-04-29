import apiClient from './apiClient';

export const fetchPurchaseOrders = async () => {
  const { data } = await apiClient.get('/purchase-orders');
  return data;
};

export const createPurchaseOrder = async (payload) => {
  const { data } = await apiClient.post('/purchase-orders', payload);
  return data;
};

export const updatePurchaseOrderStatus = async (id, status) => {
  const { data } = await apiClient.patch(`/purchase-orders/${id}/status`, { status });
  return data;
};
