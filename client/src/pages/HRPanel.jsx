import { useState, useRef } from 'react';
import { generateCode, bulkUploadCSV } from '../services/api';
import { Loader2, UserPlus, Briefcase, Clock, Copy, Check, UploadCloud, FileDown, X, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { QRCodeSVG } from 'qrcode.react';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  designation: z.string().min(2, 'Designation is required'),
  duration: z.string().min(1, 'Duration is required'),
});

const HRPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [copied, setCopied] = useState(false);

  // ─── Bulk upload state ─────────────────────────────────────────────────────
  const [csvFile, setCsvFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  });

  // ─── Single code generation ────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setIsLoading(true);
    setGeneratedCode(null);

    try {
      const response = await generateCode(data);
      if (response.success) {
        setGeneratedCode(response.verificationCode);
        toast.success('Certificate generated successfully');
        reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadPDF = () => {
    if (generatedCode) {
      window.open(`http://localhost:5000/api/intern/pdf/${generatedCode}`, '_blank');
    }
  };

  // ─── Bulk upload handlers ──────────────────────────────────────────────────
  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
    const isCSV = validTypes.includes(file.type) || file.name.endsWith('.csv');

    if (!isCSV) {
      toast.error('Please select a CSV file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }

    setCsvFile(file);
    setUploadResult(null);
    setUploadProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleCSVUpload = async () => {
    if (!csvFile) return toast.error('Please select a CSV file first');

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      const result = await bulkUploadCSV(csvFile, (progress) => {
        setUploadProgress(progress);
      });

      setUploadResult(result);
      toast.success(result.message || `Uploaded ${result.uploaded} intern(s)`);
      setCsvFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      const msg = error.response?.data?.message || 'Bulk upload failed';
      toast.error(msg);
      setUploadResult({
        success: false,
        message: msg,
        uploaded: 0,
        failed: 0
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const clearFile = () => {
    setCsvFile(null);
    setUploadResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const csvContent = 'name,designation,duration\nRahul Sharma,Frontend Intern,3 Months\nAmit Kumar,Backend Intern,6 Months\nPriya Singh,UI/UX Intern,4 Months';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'intern_template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-500 mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-white">Bulk Upload</h1>
        <p className="text-gray-500 text-sm mt-1">Upload CSV files to register multiple interns at once.</p>
      </div>
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ─── Left Column: Single Generation ──────────────────────────────── */}
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Issue Credential</h1>
            <p className="text-gray-400">Generate a secure code for a new intern.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
              <div>
                <label className="text-sm font-semibold text-gray-400 flex items-center mb-1"><UserPlus className="w-4 h-4 mr-2" /> Full Name</label>
                <input {...register('name')} placeholder="e.g. Jane Doe" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-400 flex items-center mb-1"><Briefcase className="w-4 h-4 mr-2" /> Designation</label>
                <input {...register('designation')} placeholder="e.g. Senior Frontend Intern" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" />
                {errors.designation && <p className="text-red-400 text-xs mt-1">{errors.designation.message}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-400 flex items-center mb-1"><Clock className="w-4 h-4 mr-2" /> Duration</label>
                <input {...register('duration')} placeholder="e.g. 6 Months" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all" />
                {errors.duration && <p className="text-red-400 text-xs mt-1">{errors.duration.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {isLoading ? 'Generating...' : 'Generate Secure Code'}
              </button>
            </form>
          </motion.div>
        </div>

        {/* ─── Right Column: Bulk Upload + Generated Code ──────────────────── */}
        <div className="space-y-8">
          {/* Bulk Upload Section */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold tracking-tight">Bulk Upload</h2>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                CSV Template
              </button>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`glass-card p-6 rounded-2xl border-2 border-dashed transition-all duration-200 ${
                isDragOver
                  ? 'border-white/40 bg-white/5'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {!csvFile ? (
                <div className="text-center">
                  <UploadCloud className={`w-10 h-10 mx-auto mb-3 transition-colors ${isDragOver ? 'text-white' : 'text-gray-400'}`} />
                  <p className="text-sm text-gray-300 mb-1">
                    {isDragOver ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">or click to browse (max 5MB)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                    id="csv-file-input"
                  />
                  <label
                    htmlFor="csv-file-input"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg font-medium transition-colors cursor-pointer text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Browse Files
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected file info */}
                  <div className="flex items-center justify-between bg-black/30 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-sm text-white font-medium truncate max-w-[200px]">{csvFile.name}</p>
                        <p className="text-xs text-gray-500">{(csvFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button onClick={clearFile} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-white rounded-full"
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 text-center">{uploadProgress}% uploaded</p>
                    </div>
                  )}

                  {/* Upload button */}
                  <button
                    onClick={handleCSVUpload}
                    disabled={isUploading}
                    className="bg-white text-black px-6 py-2.5 rounded-xl font-bold transition-all w-full flex items-center justify-center disabled:opacity-50 hover:bg-gray-200"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                    {isUploading ? 'Processing...' : 'Upload & Process'}
                  </button>
                </div>
              )}
            </div>

            {/* Upload result */}
            <AnimatePresence>
              {uploadResult && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 p-4 rounded-xl border ${
                    uploadResult.success
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <p className={`text-sm font-medium ${uploadResult.success ? 'text-green-400' : 'text-red-400'}`}>
                    {uploadResult.success ? '✅' : '❌'} {uploadResult.message}
                  </p>
                  {uploadResult.success && (
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      <span>Uploaded: <span className="text-white font-bold">{uploadResult.uploaded}</span></span>
                      {uploadResult.failed > 0 && (
                        <span>Failed: <span className="text-red-400 font-bold">{uploadResult.failed}</span></span>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Generated Code Result */}
          <AnimatePresence>
            {generatedCode && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl">
                  <p className="text-sm text-green-400 font-medium mb-4 flex items-center"><Check className="w-4 h-4 mr-2" /> Generated Successfully</p>
                  
                  <div className="bg-black/60 rounded-xl p-4 flex items-center justify-between mb-4">
                    <code className="text-2xl font-mono text-white">{generatedCode}</code>
                    <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-lg">
                      {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>

                  <div className="flex gap-4 mb-4 justify-center bg-white p-4 rounded-xl">
                    <QRCodeSVG value={`http://localhost:5173/verification?code=${generatedCode}`} size={120} />
                  </div>

                  <button onClick={downloadPDF} className="w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center">
                    <FileDown className="w-4 h-4 mr-2" /> Download Certificate PDF
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default HRPanel;
