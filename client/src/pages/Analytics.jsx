import { motion } from 'framer-motion';
import { TrendingUp, Users, FileText, Award, ArrowUp, ArrowDown } from 'lucide-react';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const up = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const internData = [4, 7, 5, 9, 12, 8, 15, 11, 18, 14, 20, 17];
const codeData   = [2, 5, 3, 7, 10, 6, 12, 9, 15, 11, 17, 14];

// ─── Bar chart component ────────────────────────────────────────────────────
function BarChart({ data, color1, color2, label }) {
  const max = Math.max(...data);
  return (
    <div>
      <div className="flex items-end gap-1.5 h-36">
        {data.map((v, i) => (
          <motion.div key={i} className="flex-1 group"
            title={`${MONTHS[i]}: ${v}`}>
            <motion.div
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
              style={{ height: `${(v / max) * 100}%`, background: `linear-gradient(180deg, ${color1}, ${color2})`, originY: 1, minHeight: 4 }}
              className="w-full rounded-t-md group-hover:opacity-80 transition-opacity" />
          </motion.div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-2">
        {MONTHS.map(m => (
          <div key={m} className="flex-1 text-center text-[9px] text-gray-700">{m}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Donut chart (pure SVG) ──────────────────────────────────────────────────
function DonutChart({ segments }) {
  const total = segments.reduce((s, sg) => s + sg.value, 0);
  let offset = 0;
  const r = 36, cx = 44, cy = 44, circ = 2 * Math.PI * r;

  return (
    <svg width={88} height={88} className="rotate-[-90deg]">
      {segments.map((sg, i) => {
        const dash = (sg.value / total) * circ;
        const gap = circ - dash;
        const el = (
          <motion.circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={sg.color} strokeWidth={10}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${dash} ${gap}` }}
            transition={{ duration: 0.8, delay: i * 0.15 }} />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

const donutData = [
  { label: 'Frontend', value: 38, color: '#ef4444' },
  { label: 'Backend', value: 27, color: '#f97316' },
  { label: 'UI/UX', value: 20, color: '#a855f7' },
  { label: 'Data', value: 15, color: '#3b82f6' },
];

const kpis = [
  { label: 'Total Interns', value: '120', change: '+12%', up: true, icon: Users, color: '#ef4444' },
  { label: 'Codes Issued', value: '134', change: '+8%', up: true, icon: FileText, color: '#f97316' },
  { label: 'Verified Today', value: '23', change: '+5%', up: true, icon: Award, color: '#a855f7' },
  { label: 'Avg Duration', value: '4.2 mo', change: '-2%', up: false, icon: TrendingUp, color: '#3b82f6' },
];

export default function Analytics() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-500 mb-1">Admin Console</p>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Verification trends and intern statistics — 2024</p>
      </div>

      {/* KPI row */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div key={i} variants={up}
              className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg" style={{ background: `${k.color}18` }}>
                  <Icon className="w-4 h-4" style={{ color: k.color }} />
                </div>
                <span className={`text-xs font-bold flex items-center gap-0.5 ${k.up ? 'text-green-400' : 'text-red-400'}`}>
                  {k.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {k.change}
                </span>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{k.value}</p>
                <p className="text-xs text-gray-600 mt-0.5">{k.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart - interns */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-white">Intern Registrations</h3>
              <p className="text-xs text-gray-600 mt-0.5">Monthly trend</p>
            </div>
            <span className="text-xs text-red-400 font-bold bg-red-500/10 border border-red-500/15 px-2.5 py-1 rounded-full">2024</span>
          </div>
          <BarChart data={internData} color1="#ef4444" color2="#7f1d1d" />
        </motion.div>

        {/* Donut chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="font-bold text-white mb-1">By Designation</h3>
          <p className="text-xs text-gray-600 mb-5">Intern role breakdown</p>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <DonutChart segments={donutData} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">120</span>
                <span className="text-[10px] text-gray-600">total</span>
              </div>
            </div>
            <div className="w-full space-y-2">
              {donutData.map(d => (
                <div key={d.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-gray-400">{d.label}</span>
                  </div>
                  <span className="text-gray-300 font-semibold">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Second bar chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="rounded-2xl p-6"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-white">Verification Codes Issued</h3>
            <p className="text-xs text-gray-600 mt-0.5">Monthly codes generated</p>
          </div>
          <span className="text-xs text-orange-400 font-bold bg-orange-500/10 border border-orange-500/15 px-2.5 py-1 rounded-full">2024</span>
        </div>
        <BarChart data={codeData} color1="#f97316" color2="#7c2d12" />
      </motion.div>
    </div>
  );
}
