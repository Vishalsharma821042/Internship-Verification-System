import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, User, Shield, Bell, Moon, Monitor, Save, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings saved successfully');
    setTimeout(() => setSaved(false), 2000);
  };

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
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Settings</h1>
        <p className="text-gray-400">Manage your account and application preferences.</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Profile Section */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/5 rounded-xl border border-white/10">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Profile Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name || 'System Administrator'}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Email Address</label>
              <input
                type="email"
                defaultValue={user?.email || 'admin@test.com'}
                disabled
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Role</label>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                <Shield className="w-4 h-4 text-white/50" />
                <span className="text-white capitalize">{user?.role || 'admin'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/5 rounded-xl border border-white/10">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Email notifications for new verifications', defaultChecked: true },
              { label: 'SMS alerts for suspicious activity', defaultChecked: false },
              { label: 'Weekly summary reports', defaultChecked: true },
            ].map((item, idx) => (
              <label key={idx} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 cursor-pointer group">
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="w-5 h-5 rounded bg-black/40 border-white/20 text-white focus:ring-white/20 accent-white"
                />
              </label>
            ))}
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/5 rounded-xl border border-white/10">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Appearance</h2>
          </div>

          <div className="flex gap-4">
            {[
              { icon: Moon, label: 'Dark', active: true },
              { icon: Monitor, label: 'System', active: false },
            ].map((theme, idx) => {
              const Icon = theme.icon;
              return (
                <button
                  key={idx}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    theme.active
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {theme.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div variants={itemVariants} className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Settings;
