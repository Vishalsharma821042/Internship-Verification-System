import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../services/api';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalInterns: 0, recentCodes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(r => { if (r.success && r.stats) setStats(r.stats); })
      .catch((err) => {
        console.error('[AdminDashboard] Failed to load stats:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold tracking-tight text-white">System Overview</h1>
        <p className="text-gray-500 mt-1 text-sm">Welcome back, <span className="text-white">{user?.name || 'Admin'}</span></p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-28 rounded-2xl animate-pulse bg-white/5 border border-white/10" />
          <div className="h-28 rounded-2xl animate-pulse bg-white/5 border border-white/10" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Interns Count</p>
              <p className="text-4xl font-bold text-white">{stats.totalInterns}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">System Uptime Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xl font-bold text-white">Online & Healthy</span>
              </div>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity / Overview */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10 space-y-4">
        <div>
          <h3 className="font-bold text-white text-lg">System Status</h3>
          <p className="text-xs text-gray-500">The internship verification platform is operational and running under secure MVC constraints.</p>
        </div>
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <span className="text-xs text-gray-400">Total verification records synchronized: <strong>{stats.totalInterns} entries</strong></span>
        </div>
      </div>
    </div>
  );
}
