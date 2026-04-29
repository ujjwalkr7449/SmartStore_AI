import { useEffect, useState } from 'react';
import { fetchPurchaseOrders, createPurchaseOrder, updatePurchaseOrderStatus } from '../services/poService';

export function usePurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setPurchaseOrders(await fetchPurchaseOrders());
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const add = async (payload) => {
    setLoading(true);
    setError('');
    try {
      await createPurchaseOrder(payload);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create purchase order');
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setLoading(true);
    setError('');
    try {
      await updatePurchaseOrderStatus(id, status);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update status');
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { purchaseOrders, loading, error, add, updateStatus, load };
}
