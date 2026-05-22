import { useState, useEffect } from 'react';
import { getAllInterns, deleteIntern } from '../services/api';
import { Users, Search, ShieldAlert, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const InternsList = () => {
  const [interns, setInterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInterns = async () => {
    try {
      const response = await getAllInterns();
      if (response.success) {
        setInterns(response.data || []);
      }
    } catch (error) {
      console.error('[InternsList] Failed to load:', error);
      toast.error('Failed to load interns list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this intern record?')) {
      return;
    }
    try {
      const res = await deleteIntern(id);
      if (res.success) {
        toast.success('Intern record deleted successfully');
        setInterns(prev => prev.filter(item => item._id !== id));
      } else {
        toast.error(res.message || 'Failed to delete intern');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete intern record');
    }
  };

  const filtered = interns.filter(intern =>
    intern.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.verificationCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Interns List</h1>
          <p className="text-gray-400">All registered interns and their verification codes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm">
            <span className="text-gray-400">Total: </span>
            <span className="text-white font-bold">{interns.length}</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Search by name, designation, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-white/30" />
        </div>
      ) : filtered.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl overflow-hidden border border-white/10"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((intern, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    key={intern._id || idx}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-5 text-sm text-gray-500">{idx + 1}</td>
                    <td className="p-5">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-sm font-bold mr-3 border border-white/10">
                          {intern.name?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                          {intern.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-sm text-gray-400">{intern.designation}</td>
                    <td className="p-5 text-sm text-gray-400">{intern.duration}</td>
                    <td className="p-5">
                      <span className="font-mono text-xs bg-black/50 border border-white/10 px-3 py-1.5 rounded-lg text-gray-300">
                        {intern.verificationCode}
                      </span>
                    </td>
                    <td className="p-5 text-sm text-gray-500">
                      {new Date(intern.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => handleDelete(intern._id)}
                        className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-3xl p-16 text-center border border-white/10"
        >
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Users className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-xl font-medium text-gray-300">No interns found</p>
            <p className="text-sm mt-2 text-gray-500 max-w-md">
              {searchTerm
                ? 'No results match your search. Try different keywords.'
                : 'Generate verification codes from the HR Panel to see interns listed here.'}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InternsList;
