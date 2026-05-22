import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Award, Calendar, User, Hash, XCircle, CheckCircle } from 'lucide-react';
import { verifyCode } from '../services/api';

export default function VerifyInternship() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (clean.length !== 10) {
      setError('Please enter a valid 10-character code');
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await verifyCode(clean);
      if (res.success) setResult(res.data);
      else setError(res.message || 'Code not found');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setCode(''); setResult(null); setError(null); };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">Verify Center</p>
        <h1 className="text-3xl font-bold text-white">Verify Internship</h1>
        <p className="text-gray-500 text-sm mt-1">Enter a 10-character code to verify an intern's credential.</p>
      </div>

      {/* Input form */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 bg-white/5 border border-white/10">
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Verification Code</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setError(null); setResult(null); }}
                placeholder="AB12CD34EF"
                maxLength={10}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl text-white bg-black border border-white/10 placeholder-gray-700 font-mono text-lg tracking-widest focus:outline-none focus:ring-1 focus:ring-white/40"
              />
              {code && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">
                  {code.length}/10
                </div>
              )}
            </div>
            <button type="submit" disabled={loading || code.length !== 10}
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-black hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2 flex-shrink-0">
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Search className="w-4 h-4 text-black" />}
              {loading ? 'Checking...' : 'Verify'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Result / Error */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div key="err" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-2xl p-6 flex items-start gap-4 bg-red-500/10 border border-red-500/20">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/20 flex-shrink-0">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-red-300">Verification Failed</p>
              <p className="text-sm text-gray-400 mt-0.5">{error}</p>
              <button onClick={reset} className="text-xs text-white hover:underline mt-2 transition-colors">← Try again</button>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div key="res" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-2xl overflow-hidden bg-emerald-500/5 border border-emerald-500/20">
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between border-emerald-500/20 bg-emerald-500/10">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="font-bold text-white">Verified Credential</p>
                  <p className="text-xs text-emerald-400/70">Authentic &amp; Valid</p>
                </div>
              </div>
              <button onClick={reset}
                className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
                ← New search
              </button>
            </div>
            {/* Details */}
            <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: User, label: 'Intern Name', value: result.name },
                { icon: Award, label: 'Designation', value: result.designation },
                { icon: Calendar, label: 'Duration', value: result.duration },
                { icon: Hash, label: 'Verification Code', value: result.verificationCode, mono: true },
              ].map(({ icon: Icon, label, value, mono }) => (
                <div key={label}>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5">
                    <Icon className="w-3.5 h-3.5 text-white/60" />{label}
                  </p>
                  <p className={`text-lg font-bold text-white ${mono ? 'font-mono tracking-widest' : ''}`}>{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
