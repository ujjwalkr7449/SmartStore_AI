import { useState, useRef } from 'react';
import { uploadInvoice } from '../services/aiService';

export default function OCRParser() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await uploadInvoice(file);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to parse invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-sm border border-slate-700 text-white">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        AI Invoice Parser
      </h2>
      <p className="text-sm text-slate-300 mb-4">Upload an invoice to automatically extract supplier details and line items.</p>
      
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])} 
          className="hidden" 
          accept="image/*,.pdf"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition-colors border border-slate-600 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {file ? file.name : 'Select File'}
        </button>
        <button 
          onClick={handleUpload} 
          disabled={!file || loading}
          className="w-full sm:w-auto px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 disabled:cursor-not-allowed rounded-xl font-medium transition-colors shadow-sm"
        >
          {loading ? 'Parsing...' : 'Extract Data'}
        </button>
      </div>
      
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      
      {result && (
        <div className="mt-6 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
          <h3 className="text-sm font-medium text-slate-200 mb-2">Extraction Results:</h3>
          <pre className="text-xs text-indigo-200 overflow-x-auto p-2 bg-slate-900 rounded-lg">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
