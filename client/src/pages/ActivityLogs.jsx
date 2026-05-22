import { motion } from 'framer-motion';
import { ScrollText, LogIn, Upload, Key, Trash2, Settings, User } from 'lucide-react';

const ICON_MAP = { login: LogIn, upload: Upload, code: Key, delete: Trash2, settings: Settings, user: User };
const COLOR_MAP = {
  login: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  upload: { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)' },
  code: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
  delete: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  settings: { color: '#a855f7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)' },
  user: { color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)' },
};

const LOGS = [
  { id: 1, type: 'login', actor: 'admin@test.com', action: 'Admin login successful', time: '2 min ago', meta: 'IP: 192.168.1.1' },
  { id: 2, type: 'upload', actor: 'hr@test.com', action: 'Bulk CSV uploaded: 18 interns', time: '14 min ago', meta: '18 records imported' },
  { id: 3, type: 'code', actor: 'hr@test.com', action: 'Verification code generated', time: '28 min ago', meta: 'Code: AB12CD34EF' },
  { id: 4, type: 'login', actor: 'hr@test.com', action: 'HR login successful', time: '1 hr ago', meta: 'IP: 192.168.1.5' },
  { id: 5, type: 'code', actor: 'hr@test.com', action: 'Verification code generated', time: '2 hr ago', meta: 'Code: XY98ZW12QR' },
  { id: 6, type: 'delete', actor: 'admin@test.com', action: 'Intern record deleted', time: '3 hr ago', meta: 'Intern: Rahul Sharma' },
  { id: 7, type: 'upload', actor: 'admin@test.com', action: 'Bulk CSV uploaded: 5 interns', time: '5 hr ago', meta: '5 records imported' },
  { id: 8, type: 'user', actor: 'admin@test.com', action: 'New HR user created', time: '6 hr ago', meta: 'sarah@company.com' },
  { id: 9, type: 'settings', actor: 'admin@test.com', action: 'System settings updated', time: 'Yesterday', meta: 'JWT secret rotated' },
  { id: 10, type: 'login', actor: 'admin@test.com', action: 'Admin login successful', time: 'Yesterday', meta: 'IP: 192.168.1.1' },
  { id: 11, type: 'code', actor: 'hr@test.com', action: 'Verification code generated', time: '2 days ago', meta: 'Code: MN34OP56RS' },
  { id: 12, type: 'upload', actor: 'admin@test.com', action: 'Bulk CSV uploaded: 30 interns', time: '3 days ago', meta: '30 records imported' },
];

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } };

export default function ActivityLogs() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-500 mb-1">Audit Trail</p>
          <h1 className="text-3xl font-bold text-white">Activity Logs</h1>
          <p className="text-gray-500 text-sm mt-1">All system actions, logins, and events</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl self-start sm:self-auto"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-400 font-semibold">{LOGS.length} events</span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Login', 'Upload', 'Code', 'Delete', 'Settings'].map(f => (
          <button key={f}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${f === 'All' ? 'bg-red-500/15 text-red-400 border border-red-500/25' : 'text-gray-600 border border-white/5 hover:text-gray-300 hover:border-white/10'}`}
            style={{ background: f === 'All' ? undefined : 'rgba(255,255,255,0.02)' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-red-400" />
          <h3 className="font-bold text-white">Recent Events</h3>
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="divide-y divide-white/5">
          {LOGS.map((log) => {
            const Icon = ICON_MAP[log.type] || ScrollText;
            const c = COLOR_MAP[log.type] || COLOR_MAP.code;
            return (
              <motion.div key={log.id} variants={item}
                className="flex items-start gap-4 px-6 py-4 group transition-colors"
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {/* Icon */}
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                  <Icon className="w-4 h-4" style={{ color: c.color }} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200">{log.action}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                    <span className="text-xs text-gray-600">{log.actor}</span>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs text-gray-700 font-mono">{log.meta}</span>
                  </div>
                </div>

                {/* Time */}
                <span className="text-xs text-gray-700 flex-shrink-0 mt-0.5">{log.time}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
