import { useState } from 'react';
import { generateCode } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Briefcase, Clock, Copy, Check, Loader2, QrCode, RotateCcw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  designation: z.string().min(2, 'Designation is required'),
  duration: z.string().min(1, 'Duration is required'),
});

const GenerateCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setGeneratedCode(null);
    try {
      const res = await generateCode(data);
      if (res.success) {
        setGeneratedCode(res.verificationCode);
        toast.success('Verification code generated!');
        reset();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">HR Panel</p>
        <h1 className="text-3xl font-bold text-white">Generate Credential</h1>
        <p className="text-gray-400 mt-1">Issue a secure verification code for a new intern.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="rounded-2xl p-7 space-y-5 bg-white/5 border border-white/10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {[
              { key: 'name', label: 'Full Name', icon: UserPlus, placeholder: 'e.g. Jane Doe' },
              { key: 'designation', label: 'Designation', icon: Briefcase, placeholder: 'e.g. Frontend Intern' },
              { key: 'duration', label: 'Duration', icon: Clock, placeholder: 'e.g. 6 Months' },
            ].map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key}>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <Icon className="w-3.5 h-3.5 text-white/60" /> {label}
                </label>
                <input
                  {...register(key)}
                  placeholder={placeholder}
                  className="w-full text-sm px-4 py-3 rounded-xl bg-black border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white/40 transition-all"
                />
                {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key].message}</p>}
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-white text-black hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <UserPlus className="w-4 h-4 text-black" />}
              {isLoading ? 'Generating...' : 'Generate Secure Code'}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="flex items-center justify-center">
          <AnimatePresence mode="wait">
            {generatedCode ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="w-full rounded-2xl p-6 space-y-4 bg-emerald-500/10 border border-emerald-500/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-sm font-semibold text-emerald-400">Generated Successfully</p>
                  </div>
                  <button onClick={() => setGeneratedCode(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <RotateCcw className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-black border border-white/10">
                  <code className="text-3xl font-mono font-bold text-white tracking-widest">{generatedCode}</code>
                  <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                    {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>

                <div className="flex justify-center bg-white rounded-xl p-4">
                  <QRCodeSVG value={`http://localhost:5173/verification?code=${generatedCode}`} size={130} />
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white/5 border border-white/10">
                  <QrCode className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-gray-500 font-medium">QR code will appear here</p>
                <p className="text-gray-600 text-sm mt-1">Fill out the form to generate</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GenerateCode;
