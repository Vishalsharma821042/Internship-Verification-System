import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // ─── If already logged in, redirect away from login page ─────────────────
  useEffect(() => {
    if (user) {
      console.log('[Login] User already authenticated, redirecting...', user.email);
      const target = user.role === 'admin' ? '/admin/dashboard' : '/hr/dashboard';
      navigate(target, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    console.log('[Login] Submitting:', { email, password: '***' });

    try {
      const userData = await login(email, password);
      console.log('[Login] ✅ Success! User:', userData.email, 'Role:', userData.role);
      toast.success(`Welcome back, ${userData.name || userData.email}!`);

      // Navigate immediately — ProtectedRoute has localStorage fallback
      const target = userData.role === 'admin' ? '/admin/dashboard' : '/hr/dashboard';
      navigate(target, { replace: true });
    } catch (err) {
      console.error('[Login] ❌ Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render login form if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-4 border border-white/10">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">System Access</h1>
          <p className="text-gray-400 mt-2">Login to manage verifications</p>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Email Address</label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="admin@test.com"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 flex justify-between">
                Password
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Forgot?</a>
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center mt-6"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500 border-t border-white/10 pt-6">
            <p>Admin: admin@test.com / password123</p>
            <p className="mt-1">HR: hr@test.com / password123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
