import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest, registerRequest } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { validateEmail } from '../utils/validators';

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('admin@smartstore.ai');
  const [password, setPassword] = useState('password');
  const [fullName, setFullName] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    if (!isLoginMode && !fullName) {
      setError('Full name is required for registration');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (isLoginMode) {
        const tokens = await loginRequest({ email, password });
        setSession({ accessToken: tokens.access_token, user: { email } });
        navigate('/');
      } else {
        await registerRequest({ email, password, full_name: fullName });
        const tokens = await loginRequest({ email, password });
        setSession({ accessToken: tokens.access_token, user: { email } });
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.detail || (isLoginMode ? 'Login failed. Please check your credentials.' : 'Registration failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg transform rotate-3">
            <svg className="w-8 h-8 text-white -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">SmartStore AI</h1>
          <p className="text-sm text-gray-500 mt-2">
            {isLoginMode ? 'Sign in to your intelligent dashboard' : 'Create your intelligent dashboard account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50/80 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="John Doe" 
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@smartstore.ai" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>

          <button 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLoginMode ? 'Authenticating...' : 'Registering...'}
              </>
            ) : (isLoginMode ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            {isLoginMode ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
