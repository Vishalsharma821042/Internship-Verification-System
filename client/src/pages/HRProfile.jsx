import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Edit3, Save, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const HRProfile = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success('Profile updated');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">Account</p>
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-gray-400 mt-1">Manage your HR account details.</p>
      </div>

      {/* Avatar card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-5 p-6 rounded-2xl"
        style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
          {(user?.name || user?.email || 'H').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xl font-bold text-white">{user?.name || 'HR Manager'}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">HR Manager</span>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-6 space-y-5"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-blue-400" /> Profile Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5" /> Full Name
            </label>
            <input
              type="text"
              defaultValue={user?.name || 'HR Manager'}
              className="w-full text-sm px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <input
              type="email"
              defaultValue={user?.email}
              disabled
              className="w-full text-sm px-4 py-3 rounded-xl text-gray-500 cursor-not-allowed"
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" /> Role
            </label>
            <div className="px-4 py-3 rounded-xl text-sm text-blue-400 font-medium"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
              HR Manager (read-only)
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </motion.div>
    </div>
  );
};

export default HRProfile;
