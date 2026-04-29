import { useEffect, useState } from 'react';
import { createSupplier, fetchSuppliers, updateSupplier, deleteSupplier } from '../services/supplierService';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setSuppliers(await fetchSuppliers());
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const add = async (payload) => {
    setLoading(true);
    setError('');
    try {
      await createSupplier(payload);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create supplier');
      setLoading(false);
    }
  };

  const update = async (id, payload) => {
    setLoading(true);
    setError('');
    try {
      await updateSupplier(id, payload);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update supplier');
      setLoading(false);
    }
  };

  const remove = async (id) => {
    setLoading(true);
    setError('');
    try {
      await deleteSupplier(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete supplier');
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { suppliers, loading, error, add, update, remove, load };
}
