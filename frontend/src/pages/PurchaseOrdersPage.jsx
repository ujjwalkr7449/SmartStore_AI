import { useState } from 'react';
import Layout from '../components/Layout';
import ApiState from '../components/ApiState';
import OCRParser from '../components/OCRParser';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import { useSuppliers } from '../hooks/useSuppliers';
import { useProducts } from '../hooks/useProducts';

export default function PurchaseOrdersPage() {
  const { purchaseOrders, loading, error, updateStatus, add } = usePurchaseOrders();
  const { suppliers } = useSuppliers();
  const { products } = useProducts();
  
  const [form, setForm] = useState({ supplier_id: '', product_id: '', quantity: 1, unit_price: 0 });

  const handleOCRConfirm = (extractedData) => {
    const matchedSupplier = suppliers?.find(s => s.name.toLowerCase().includes(extractedData.supplier?.toLowerCase())) || suppliers?.[0];
    const matchedProduct = products?.find(p => extractedData.items?.[0]?.name?.toLowerCase().includes(p.name.toLowerCase())) || products?.[0];
    
    if (matchedSupplier && matchedProduct) {
      setForm({
        supplier_id: matchedSupplier.id,
        product_id: matchedProduct.id,
        quantity: extractedData.items?.[0]?.quantity || 1,
        unit_price: extractedData.items?.[0]?.unit_price || 0
      });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.supplier_id || !form.product_id) return;
    await add({
      supplier_id: parseInt(form.supplier_id),
      items: [{
        product_id: parseInt(form.product_id),
        quantity: parseInt(form.quantity),
        unit_price: parseFloat(form.unit_price)
      }]
    });
    setForm({ supplier_id: '', product_id: '', quantity: 1, unit_price: 0 });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Sent': return 'bg-blue-100 text-blue-700';
      case 'Acknowledged': return 'bg-yellow-100 text-yellow-700';
      case 'Received': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getNextStatus = (current) => {
    switch (current) {
      case 'Draft': return 'Sent';
      case 'Sent': return 'Acknowledged';
      case 'Acknowledged': return 'Received';
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <OCRParser onConfirm={handleOCRConfirm} />

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Purchase Order
          </h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <select required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={form.supplier_id} onChange={e => setForm(f => ({ ...f, supplier_id: e.target.value }))}>
                <option value="">Select Supplier</option>
                {suppliers?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select required className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))}>
                <option value="">Select Product</option>
                {products?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input required type="number" min="1" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($)</label>
              <input required type="number" step="0.01" min="0" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={form.unit_price} onChange={e => setForm(f => ({ ...f, unit_price: e.target.value }))} />
            </div>
            <div className="md:col-span-4 pt-2">
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-50">
                Submit Order
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Purchase Orders
          </h2>
          
          <ApiState loading={loading} error={error}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-medium">PO ID</th>
                    <th className="px-6 py-3 font-medium">Supplier ID</th>
                    <th className="px-6 py-3 font-medium">Total Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {purchaseOrders.map(po => {
                    const nextStatus = getNextStatus(po.status);
                    return (
                      <tr key={po.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">#{po.id}</td>
                        <td className="px-6 py-4 text-gray-600">{po.supplier_id}</td>
                        <td className="px-6 py-4 text-gray-600">${po.total_amount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(po.status)}`}>
                            {po.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {nextStatus && (
                            <button 
                              onClick={() => updateStatus(po.id, nextStatus)} 
                              className="text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Mark as {nextStatus}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {purchaseOrders.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No purchase orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ApiState>
        </div>
      </div>
    </Layout>
  );
}
