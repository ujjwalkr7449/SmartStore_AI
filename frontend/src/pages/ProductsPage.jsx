import { useState } from 'react';
import ApiState from '../components/ApiState';
import Layout from '../components/Layout';
import ProductForm from '../components/ProductForm';
import { useProducts } from '../hooks/useProducts';
import { forecastProduct } from '../services/productService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProductsPage() {
  const { products, loading, error, add } = useProducts();
  const [forecasts, setForecasts] = useState({});
  const [forecastingId, setForecastingId] = useState(null);

  const handleForecast = async (id) => {
    setForecastingId(id);
    try {
      const data = await forecastProduct(id);
      setForecasts(prev => ({ ...prev, [id]: data }));
    } catch (err) {
      console.error('Failed to forecast', err);
    } finally {
      setForecastingId(null);
    }
  };

  const generateChartData = (avg) => {
    return [
      { name: 'Week 1', demand: Math.round(avg * 0.8) },
      { name: 'Week 2', demand: Math.round(avg * 1.1) },
      { name: 'Week 3', demand: Math.round(avg * 0.9) },
      { name: 'Week 4', demand: Math.round(avg * 1.2) },
      { name: 'Forecast W5', demand: Math.round(avg) },
      { name: 'Forecast W6', demand: Math.round(avg * 1.05) }
    ];
  };

  return (
    <Layout>
      <div className="space-y-4">
        <ProductForm onSubmit={add} />
        <ApiState loading={loading} error={error}>
          <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">SKU</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Threshold</th>
                  <th className="p-4 font-medium text-right">Forecast</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{item.name}</td>
                    <td className="p-4 text-gray-600">{item.sku}</td>
                    <td className="p-4 text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.stock <= item.threshold ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">${item.price}</td>
                    <td className="p-4 text-gray-600">{item.threshold}</td>
                    <td className="p-4 text-right">
                      {forecasts[item.id] ? (
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-xs text-indigo-700 font-medium bg-indigo-50 px-2 py-1 rounded-lg inline-block">
                            Avg Demand: {forecasts[item.id].moving_average_demand.toFixed(1)} | Rec. Restock: {forecasts[item.id].recommended_restock_quantity}
                          </div>
                          <div className="h-24 w-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={generateChartData(forecasts[item.id].moving_average_demand)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" hide />
                                <YAxis hide />
                                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                                <Line type="monotone" dataKey="demand" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleForecast(item.id)}
                          disabled={forecastingId === item.id}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {forecastingId === item.id ? 'Loading...' : 'Get Forecast'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">No products found. Add one above.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ApiState>
      </div>
    </Layout>
  );
}
