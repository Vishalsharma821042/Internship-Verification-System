import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Power, UserCog, X, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const up = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

// Demo HR users (in real app, fetch from /api/admin/hr-users)
const DEMO_HRS = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'hr', active: true, interns: 12, joined: '2024-01-15' },
  { id: 2, name: 'Michael Chen', email: 'michael@company.com', role: 'hr', active: true, interns: 8, joined: '2024-02-20' },
  { id: 3, name: 'Priya Sharma', email: 'priya@company.com', role: 'hr', active: false, interns: 5, joined: '2024-03-10' },
  { id: 4, name: 'James Wilson', email: 'james@company.com', role: 'hr', active: true, interns: 19, joined: '2024-01-05' },
  { id: 5, name: 'Ananya Patel', email: 'ananya@company.com', role: 'hr', active: true, interns: 3, joined: '2024-04-18' },
];

function AddHRModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('All fields required');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API
    onAdd({ id: Date.now(), ...form, role: 'hr', active: true, interns: 0, joined: new Date().toISOString().split('T')[0] });
    toast.success(`HR user ${form.name} created`);
    setLoading(false);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: '#141418', border: '1px solid rgba(239,68,68,0.2)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Add HR User</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Doe' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'jane@company.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder}
                value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full text-sm px-4 py-3 rounded-xl text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500/40"
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.07)' }} />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#fff' }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? 'Creating...' : 'Create HR Account'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function HRManagement() {
  const [hrs, setHrs] = useState(DEMO_HRS);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = hrs.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => {
    setHrs(p => p.map(h => h.id === id ? { ...h, active: !h.active } : h));
    const hr = hrs.find(h => h.id === id);
    toast.success(`${hr.name} ${hr.active ? 'deactivated' : 'activated'}`);
  };

  const remove = (id) => {
    const hr = hrs.find(h => h.id === id);
    setHrs(p => p.filter(h => h.id !== id));
    toast.success(`${hr.name} removed`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-500 mb-1">Administration</p>
          <h1 className="text-3xl font-bold text-white">HR Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage HR accounts and permissions</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm self-start sm:self-auto"
          style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#fff' }}>
          <Plus className="w-4 h-4" /> Add HR User
        </button>
      </div>

      {/* Stats row */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total HR Users', value: hrs.length },
          { label: 'Active', value: hrs.filter(h => h.active).length },
          { label: 'Inactive', value: hrs.filter(h => !h.active).length },
          { label: 'Total Interns', value: hrs.reduce((s, h) => s + h.interns, 0) },
        ].map((s, i) => (
          <motion.div key={i} variants={up} className="rounded-xl px-4 py-4 text-center"
            style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b border-white/5">
          <h3 className="font-bold text-white flex-1 flex items-center gap-2">
            <UserCog className="w-4 h-4 text-red-400" /> HR Users
          </h3>
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search HR users..."
              className="w-full text-sm pl-9 pr-4 py-2 rounded-xl text-white placeholder-gray-700 focus:outline-none"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.07)' }} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['HR User', 'Email', 'Interns', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((hr, i) => (
                <motion.tr key={hr.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="group transition-colors"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-900 to-red-950 flex items-center justify-center text-red-300 text-xs font-bold border border-red-900/30">
                        {hr.name[0]}
                      </div>
                      <span className="font-medium text-gray-200">{hr.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{hr.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-400"
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      {hr.interns}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">{hr.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${hr.active ? 'text-green-400 bg-green-500/10 border border-green-500/20' : 'text-gray-500 bg-white/5 border border-white/10'}`}>
                      {hr.active ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggle(hr.id)} title={hr.active ? 'Deactivate' : 'Activate'}
                        className={`p-1.5 rounded-lg transition-colors ${hr.active ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-500 hover:bg-white/10'}`}>
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toast('Edit coming soon')} title="Edit"
                        className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(hr.id)} title="Delete"
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && <AddHRModal onClose={() => setShowModal(false)} onAdd={h => setHrs(p => [...p, h])} />}
      </AnimatePresence>
    </div>
  );
}
