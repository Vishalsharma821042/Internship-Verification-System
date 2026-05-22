import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/api';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HRDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalInterns: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(r => { if (r.success && r.stats) setStats(r.stats); })
      .catch((err) => {
        console.error('[HRDashboard] Failed to load stats:', err);
        // Stats stay at safe defaults — no disruptive toast
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome header */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">HR Console</p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, <span className="text-white">{user?.name || 'HR Manager'}</span></h1>
        <p className="text-gray-400 mt-1">Issue and manage intern verification credentials.</p>
      </div>

      {/* Stats and Info cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-28 rounded-2xl animate-pulse bg-white/5 border border-white/10" />
          <div className="h-28 rounded-2xl animate-pulse bg-white/5 border border-white/10" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Registered Interns</p>
              <p className="text-4xl font-bold text-white">{stats.totalInterns}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Access Role</p>
              <p className="text-xl font-bold text-white">HR Officer</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/hr/generate" className="rounded-2xl p-6 bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-[1.01] transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Generate Code</h3>
            <p className="text-sm text-gray-500 mt-1">Issue a secure 10-character alphanumeric verification credential for a new intern.</p>
          </div>
        </Link>

        <Link to="/hr/verify" className="rounded-2xl p-6 bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-[1.01] transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Verify Internship</h3>
            <p className="text-sm text-gray-500 mt-1">Look up and validate an existing internship verification code.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
