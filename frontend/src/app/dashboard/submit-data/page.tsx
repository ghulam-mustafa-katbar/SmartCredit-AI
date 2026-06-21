'use client';
import Link from 'next/link';
import { UploadCloud, ArrowRight, ShieldCheck, CheckCircle2, FileText, X } from 'lucide-react';
import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface UploadedFile {
  file: File;
  preview: string | null;
}

export default function SubmitDataPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [smsText, setSmsText] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE_MB = 5;
  const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    setUploadError('');
    const newFiles: UploadedFile[] = [];
    Array.from(files).forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError(`"${file.name}" is not supported. Use PDF, JPG, PNG, or WEBP.`);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds the 5MB limit.`);
        return;
      }
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      newFiles.push({ file, preview });
    });
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const updated = [...prev];
      if (updated[index].preview) URL.revokeObjectURL(updated[index].preview!);
      updated.splice(index, 1);
      return updated;
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="glass-card p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Profile Submitted!</h2>
          <p className="text-slate-400 mb-8">
            Our AI is analyzing your data. Your credit score will be updated shortly.
          </p>
          <Link
            href="/dashboard/customer"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-3 font-semibold flex items-center justify-center gap-2 transition-all"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Submit Financial Data</h1>
        <p className="text-slate-400">Provide alternative data to build your SmartCredit Score.</p>
      </header>

      {/* Step Progress */}
      <div className="flex gap-4">
        {[1, 2].map((s) => (
          <div key={s} className="flex-1 flex flex-col gap-2">
            <div className={`h-2 rounded-full transition-all duration-500 ${step >= s ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
            <span className={`text-xs font-medium ${step >= s ? 'text-blue-400' : 'text-slate-500'}`}>
              {s === 1 ? 'Personal Details' : 'Financial Data'}
            </span>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 md:p-8">
        <form
          onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit}
          className="space-y-6"
        >
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Employment Status</label>
                  <select className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                    <option>Full-time Employed</option>
                    <option>Part-time</option>
                    <option>Self-Employed / Freelance</option>
                    <option>Unemployed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Monthly Income (Est.)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Primary Source of Income</label>
                <input
                  type="text"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Upwork, Uber, Local Business"
                />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-100 text-sm">Secure &amp; Private</h4>
                  <p className="text-xs text-blue-200/70 mt-1 leading-relaxed">
                    Your data is encrypted and only used to generate your credit score. We do not sell your personal information.
                  </p>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300">Upload Utility Bills (PDF / Image)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  multiple
                  className="hidden"
                  onChange={handleFileInputChange}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                      : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/30'
                  }`}
                >
                  <UploadCloud className={`w-10 h-10 mb-4 transition-colors ${isDragging ? 'text-blue-400' : 'text-slate-500'}`} />
                  <p className="font-medium text-slate-300 mb-1">
                    {isDragging ? 'Drop your files here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-slate-500">PDF, JPG, PNG, WEBP — Max 5MB per file</p>
                </div>

                {uploadError && (
                  <div className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    <X className="w-4 h-4 shrink-0 mt-0.5" /> {uploadError}
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {uploadedFiles.map((uf, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3">
                        {uf.preview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={uf.preview} alt={uf.file.name} className="w-10 h-10 object-cover rounded-lg" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-blue-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{uf.file.name}</p>
                          <p className="text-xs text-slate-500">{formatSize(uf.file.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SMS Logs */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Paste SMS Transaction Logs <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <p className="text-xs text-slate-400">Our AI can extract transaction patterns from your bank SMS alerts.</p>
                <textarea
                  className="w-full h-36 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="e.g. Your account has been credited with PKR 25,000..."
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                />
                <p className="text-xs text-slate-500 text-right">{smsText.length} characters</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 flex justify-between">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Back
              </button>
            ) : <div></div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 py-3 font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : step === 1 ? (
                <>Next Step <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Submit Profile <CheckCircle2 className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
