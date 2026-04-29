import Layout from '../components/Layout';
import ApiState from '../components/ApiState';
import OCRParser from '../components/OCRParser';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';

export default function PurchaseOrdersPage() {
  const { purchaseOrders, loading, error, updateStatus } = usePurchaseOrders();

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
        <OCRParser />

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
