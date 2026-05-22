import { useState, useEffect } from 'react';
import { getAllInterns } from '../services/api';
import { motion } from 'framer-motion';
import { Award, Search, Download, Loader2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const up = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Certificates() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllInterns()
      .then(r => { if (r.success) setInterns(r.data || []); })
      .catch(() => toast.error('Failed to load certificates'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = interns.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.designation?.toLowerCase().includes(search.toLowerCase()) ||
    i.verificationCode?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (code, name) => {
    window.open(`http://localhost:5000/api/intern/pdf/${code}`, '_blank');
    toast.success(`Downloading certificate for ${name}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-500 mb-1">HR Portal</p>
          <h1 className="text-3xl font-bold text-white">Certificates</h1>
          <p className="text-gray-500 text-sm mt-1">Download intern verification certificates as PDF</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl self-start sm:self-auto"
          style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <Award className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-blue-400 font-semibold">{interns.length} certificates</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or code..."
          className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }} />
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((intern, i) => (
            <motion.div key={intern._id || i} variants={up}
              className="rounded-2xl p-5 flex flex-col gap-4 group hover:scale-[1.02] transition-transform"
              style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.12)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.12)'}>
              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-800 to-blue-950 flex items-center justify-center text-blue-300 text-base font-bold border border-blue-700/30 flex-shrink-0">
                  {intern.name?.[0] || '?'}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{intern.name}</p>
                  <p className="text-xs text-gray-500 truncate">{intern.designation}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Duration</span>
                  <span className="text-gray-300 font-medium">{intern.duration}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Code</span>
                  <code className="font-mono text-blue-300">{intern.verificationCode}</code>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Issued</span>
                  <span className="text-gray-500">{new Date(intern.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {/* Download btn */}
              <button onClick={() => handleDownload(intern.verificationCode, intern.name)}
                className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-80"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}>
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-20 text-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <FileText className="w-12 h-12 text-gray-800 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            {search ? 'No certificates match your search' : 'No certificates yet'}
          </p>
          <p className="text-gray-700 text-sm mt-1">
            {!search && 'Generate verification codes to create certificates.'}
          </p>
        </div>
      )}
    </div>
  );
}
