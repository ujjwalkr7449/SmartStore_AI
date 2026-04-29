import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { fetchDashboardSummary } from '../services/dashboardService';
import { fetchAutomationLogs, triggerAutomation } from '../services/automationService';
import ApiState from '../components/ApiState';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [triggering, setTriggering] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchDashboardSummary(), fetchAutomationLogs()])
      .then(([summaryData, logsData]) => {
        setSummary(summaryData);
        setLogs(logsData);
      })
      .catch(err => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTrigger = async () => {
    setTriggering(true);
    try {
      await triggerAutomation();
      loadData();
    } catch (err) {
      alert("Failed to trigger automation.");
    } finally {
      setTriggering(false);
    }
  };

  return (
    <Layout>
      <ApiState loading={loading} error={error}>
        {summary && (
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Total Products</h2>
              <p className="text-3xl font-bold text-gray-900">{summary.total_products}</p>
            </article>
            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Low Stock Alerts</h2>
              <p className="text-3xl font-bold text-red-600">{summary.low_stock_products}</p>
            </article>
            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Active Suppliers</h2>
              <p className="text-3xl font-bold text-gray-900">{summary.total_suppliers}</p>
            </article>
            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Purchase Orders</h2>
              <p className="text-3xl font-bold text-indigo-600">{summary.total_pos}</p>
            </article>
          </section>
        )}

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Automation & Schedulers
            </h2>
            <button 
              onClick={handleTrigger} 
              disabled={triggering}
              className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium text-sm rounded-xl transition-colors disabled:opacity-50"
            >
              {triggering ? 'Running...' : 'Run Stock Check Now'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-medium">Timestamp</th>
                  <th className="px-6 py-3 font-medium">Job Name</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-600">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{log.job_name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{log.message}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No automation logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </ApiState>
    </Layout>
  );
}
