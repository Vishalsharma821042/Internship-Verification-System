import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { Users, FileText, Activity, Search, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Overview = () => {
  const [stats, setStats] = useState({ totalInterns: 0, recentCodes: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response.success) {
          setStats({
            totalInterns: response.stats?.totalInterns || 0,
            recentCodes: response.recentCodes || []
          });
        }
      } catch (error) {
        console.error('[Overview] Failed to load stats:', error);
        // Stats stay at safe defaults — no disruptive toast
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const filteredInterns = (stats.recentCodes || []).filter(intern => 
    intern.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    intern.verificationCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">System Overview</h1>
        <p className="text-gray-400">Manage and monitor internship verifications.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass rounded-3xl p-6 h-32 animate-pulse flex flex-col justify-between">
              <div className="w-24 h-4 bg-white/10 rounded"></div>
              <div className="w-16 h-8 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all">
              <div className="absolute -right-6 -top-6 text-white/5 group-hover:text-white/10 transition-colors transform group-hover:scale-110 duration-500">
                <Users className="w-40 h-40" />
              </div>
              <div className="relative z-10">
                <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Total Interns</p>
                <h2 className="text-5xl font-bold text-white">{stats.totalInterns}</h2>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all">
              <div className="absolute -right-6 -top-6 text-white/5 group-hover:text-white/10 transition-colors transform group-hover:scale-110 duration-500">
                <FileText className="w-40 h-40" />
              </div>
              <div className="relative z-10">
                <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Recent Issuances</p>
                <h2 className="text-5xl font-bold text-white">{(stats.recentCodes || []).length}</h2>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all">
              <div className="absolute -right-6 -top-6 text-white/5 group-hover:text-white/10 transition-colors transform group-hover:scale-110 duration-500">
                <Activity className="w-40 h-40" />
              </div>
              <div className="relative z-10">
                <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">System Status</p>
                <div className="flex items-center mt-3 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl inline-flex">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-3 animate-pulse"></div>
                  <h2 className="text-lg font-medium text-green-400">Operational</h2>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-3xl overflow-hidden border border-white/10"
          >
            <div className="p-6 md:p-8 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5">
              <h3 className="text-xl font-bold text-white">Recent Credentials</h3>
              <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  placeholder="Search by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all hover:bg-black/60"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Intern Details</th>
                    <th className="p-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="p-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Security Code</th>
                    <th className="p-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Issued</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInterns.length > 0 ? (
                    filteredInterns.map((intern, idx) => (
                      <motion.tr 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={intern._id || idx} 
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="p-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold mr-4 border border-white/10">
                              {intern.name?.charAt(0) || '?'}
                            </div>
                            <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{intern.name}</span>
                          </div>
                        </td>
                        <td className="p-6 text-sm text-gray-400">{intern.designation}</td>
                        <td className="p-6">
                          <span className="font-mono text-xs bg-black/50 border border-white/10 px-3 py-1.5 rounded-lg text-gray-300">
                            {intern.verificationCode}
                          </span>
                        </td>
                        <td className="p-6 text-sm text-gray-500">
                          {new Date(intern.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                          <p className="text-lg font-medium">No credentials found</p>
                          <p className="text-sm mt-1">Generate codes from the HR Panel to see them here.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Overview;
