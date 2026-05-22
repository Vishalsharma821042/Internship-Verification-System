import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Award, Calendar, User, Hash, XCircle, CheckCircle } from 'lucide-react';
import { verifyCode } from '../services/api';
import MainLayout from '../layouts/MainLayout';

const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorJson, setErrorJson] = useState(null);

  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam && codeParam.length === 10) {
      setCode(codeParam.toUpperCase());
      performVerification(codeParam.toUpperCase());
    }
  }, [searchParams]);

  const performVerification = async (targetCode) => {
    setIsLoading(true);
    setResult(null);
    setErrorJson(null);

    try {
      const response = await verifyCode(targetCode);
      if (response.success) {
        setResult(response.data);
      } else {
        setErrorJson({
          success: false,
          message: response.message || 'Invalid Verification Code'
        });
      }
    } catch (err) {
      setErrorJson({
        success: false,
        message: 'Invalid Verification Code'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!code || code.length !== 10) {
      setErrorJson({
        success: false,
        message: 'Invalid Verification Code'
      });
      return;
    }
    performVerification(code.toUpperCase());
  };

  const reset = () => {
    setCode('');
    setResult(null);
    setErrorJson(null);
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto mt-12 px-4 w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">Credential Verification</h1>
          <p className="text-gray-500 text-sm">Validate the authenticity of internship credentials instantly.</p>
        </div>

        {/* Input Form */}
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <form onSubmit={handleVerify} className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Verification Code</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={code}
                  onChange={e => {
                    setCode(e.target.value.toUpperCase());
                    if (errorJson) setErrorJson(null);
                  }}
                  placeholder="Enter Code (e.g. AB12CD34EF)"
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl text-white bg-black border border-white/10 placeholder-gray-700 font-mono text-lg tracking-widest focus:outline-none focus:ring-1 focus:ring-white/40 uppercase"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || code.length !== 10}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-black hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <Search className="w-4 h-4 text-black" />}
                Verify
              </button>
            </div>
          </form>
        </div>

        {/* Result Area */}
        <AnimatePresence mode="wait">
          {errorJson && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl p-6 bg-white/5 border border-red-500/20"
            >
              <div className="flex items-center gap-3 mb-4 text-red-400">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Invalid Credential Format</span>
              </div>
              <pre className="p-4 rounded-xl bg-black border border-white/10 font-mono text-sm text-red-400 overflow-x-auto">
                {JSON.stringify(errorJson, null, 2)}
              </pre>
              <button onClick={reset} className="text-xs text-gray-400 hover:text-white hover:underline mt-4 block">
                ← Try another code
              </button>
            </motion.div>
          )}

          {isLoading && !errorJson && !result && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl p-6 bg-white/5 border border-white/10 space-y-4 animate-pulse"
            >
              <div className="h-6 bg-white/10 rounded w-1/3"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-white/10 rounded"></div>
                <div className="h-10 bg-white/10 rounded"></div>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden bg-emerald-500/5 border border-emerald-500/20"
            >
              <div className="px-6 py-4 border-b flex items-center justify-between border-emerald-500/20 bg-emerald-500/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white">Verified Credential</p>
                    <p className="text-xs text-emerald-400/70">Authentic &amp; Valid</p>
                  </div>
                </div>
                <button onClick={reset} className="text-xs text-gray-400 hover:text-white hover:underline">
                  ← New search
                </button>
              </div>

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
    </MainLayout>
  );
};

export default VerificationPage;
