'use client';
import { useState } from 'react';
import { CheckCircle2, TrendingDown, Star, Clock, ArrowRight, X, User, Mail, Phone, FileText, Banknote, Loader2 } from 'lucide-react';

const offers = [
  {
    id: 1,
    type: 'Personal Loan',
    amount: '$5,000',
    term: '12 Months',
    apr: '8.5%',
    monthly: '$435',
    approval: 92,
    badge: 'Best Match',
    color: 'blue',
  },
  {
    id: 2,
    type: 'Auto Loan',
    amount: '$12,000',
    term: '36 Months',
    apr: '7.2%',
    monthly: '$372',
    approval: 85,
    badge: 'Lowest APR',
    color: 'emerald',
  },
  {
    id: 3,
    type: 'Micro Finance',
    amount: '$2,000',
    term: '6 Months',
    apr: '11.0%',
    monthly: '$342',
    approval: 97,
    badge: 'Fastest Approval',
    color: 'violet',
  },
];

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  purpose: string;
  agreement: boolean;
}

interface SelectedOffer {
  id: number;
  type: string;
  amount: string;
  term: string;
  apr: string;
  monthly: string;
  approval: number;
  badge: string;
  color: string;
}

export default function LoanOffersPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [appId, setAppId] = useState('');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    purpose: '',
    agreement: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const selectedOffer: SelectedOffer | undefined = offers.find((o) => o.id === selected);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'A valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 7)
      newErrors.phone = 'A valid phone number is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Please describe your loan purpose';
    if (!formData.agreement) newErrors.agreement = 'You must agree to the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const id = `APP-${Math.floor(900 + Math.random() * 100)}`;
      setAppId(id);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2200);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setShowModal(false);
    setIsSuccess(false);
    setFormData({ fullName: '', email: '', phone: '', purpose: '', agreement: false });
    setErrors({});
  };

  const handleOpenModal = () => {
    if (!selected) return;
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Loan Offers</h1>
        <p className="text-slate-400">Pre-approved offers tailored to your alternative credit profile.</p>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Offers Available', value: '3', icon: Star, color: 'text-blue-400' },
          { label: 'Best APR', value: '7.2%', icon: TrendingDown, color: 'text-emerald-400' },
          { label: 'Max Approval Chance', value: '97%', icon: CheckCircle2, color: 'text-violet-400' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-800">
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">{stat.label}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Offer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            onClick={() => setSelected(selected === offer.id ? null : offer.id)}
            className={`glass-card p-6 cursor-pointer transition-all duration-300 relative group ${
              selected === offer.id
                ? 'border-blue-500/60 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                : 'hover:border-slate-600 hover:-translate-y-1'
            }`}
          >
            {/* Badge */}
            <div className={`absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full ${
              offer.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              offer.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              'bg-violet-500/20 text-violet-400 border border-violet-500/30'
            }`}>
              {offer.badge}
            </div>

            {/* Selected checkmark */}
            {selected === offer.id && (
              <div className="absolute top-4 left-4 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            )}

            <div className="text-sm text-slate-400 mb-3 mt-1">{offer.type}</div>
            <div className="text-4xl font-black mb-1 gradient-text">{offer.amount}</div>
            <div className="text-xs text-slate-500 mb-5">Loan Amount</div>

            <div className="space-y-2 mb-5">
              {[
                { label: 'Term', value: offer.term },
                { label: 'Est. APR', value: offer.apr },
                { label: 'Monthly Payment', value: offer.monthly },
              ].map((row, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-400">{row.label}</span>
                  <span className="font-semibold text-slate-100">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Approval Bar */}
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Approval Probability</span>
                <span className="font-bold text-emerald-400">{offer.approval}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${offer.approval}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setSelected(selected === offer.id ? null : offer.id); }}
              className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                selected === offer.id
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {selected === offer.id ? 'Selected ✓' : 'Select Offer'}
              {selected !== offer.id && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      {/* Selected Offer CTA */}
      {selected && (
        <div className="glass-card p-6 border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="font-semibold">Ready to Apply?</div>
              <div className="text-sm text-slate-400">
                You selected the <span className="text-blue-400 font-medium">{selectedOffer?.type}</span> — {selectedOffer?.amount} at {selectedOffer?.apr} APR.
                Your application will be reviewed within 24 hours.
              </div>
            </div>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 py-3 font-semibold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] whitespace-nowrap hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-[1.02] active:scale-95"
          >
            Submit Application <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Panel */}
          <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0f172a]/95 backdrop-blur-sm border-b border-slate-800 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">Loan Application</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  {selectedOffer?.type} · {selectedOffer?.amount} · {selectedOffer?.apr} APR
                </p>
              </div>
              {!isSubmitting && (
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {isSuccess ? (
                /* ── Success State ── */
                <div className="flex flex-col items-center text-center py-6 gap-5">
                  <div className="w-20 h-20 bg-emerald-500/15 rounded-full flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Your {selectedOffer?.type} application for {selectedOffer?.amount} has been received.
                      Our team will review it within <strong className="text-slate-200">24 hours</strong>.
                    </p>
                  </div>

                  {/* Reference Box */}
                  <div className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Application Reference</div>
                    <div className="text-2xl font-mono font-bold text-blue-400">{appId}</div>
                    <div className="text-xs text-slate-500 mt-1">Save this ID to track your application status</div>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: 'Loan Type', value: selectedOffer?.type },
                      { label: 'Amount', value: selectedOffer?.amount },
                      { label: 'Term', value: selectedOffer?.term },
                      { label: 'Monthly Payment', value: selectedOffer?.monthly },
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-left">
                        <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                        <div className="font-semibold text-slate-100">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* ── Form State ── */
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Selected Offer Summary */}
                  <div className="flex gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                    <Banknote className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-slate-100">{selectedOffer?.type} — {selectedOffer?.amount}</p>
                      <p className="text-slate-400 mt-0.5">
                        {selectedOffer?.term} · {selectedOffer?.apr} APR · {selectedOffer?.monthly}/mo
                      </p>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" /> Full Name
                    </label>
                    <input
                      id="app-full-name"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => { setFormData({ ...formData, fullName: e.target.value }); setErrors({ ...errors, fullName: '' }); }}
                      placeholder="e.g. John Doe"
                      className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.fullName ? 'border-red-500/60' : 'border-slate-700'}`}
                    />
                    {errors.fullName && <p className="text-xs text-red-400">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" /> Email Address
                    </label>
                    <input
                      id="app-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                      placeholder="you@example.com"
                      className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.email ? 'border-red-500/60' : 'border-slate-700'}`}
                    />
                    {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" /> Phone Number
                    </label>
                    <input
                      id="app-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }}
                      placeholder="+1 555 000 0000"
                      className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.phone ? 'border-red-500/60' : 'border-slate-700'}`}
                    />
                    {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                  </div>

                  {/* Loan Purpose */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" /> Loan Purpose
                    </label>
                    <textarea
                      id="app-purpose"
                      value={formData.purpose}
                      onChange={(e) => { setFormData({ ...formData, purpose: e.target.value }); setErrors({ ...errors, purpose: '' }); }}
                      placeholder="e.g. Home renovation, medical expenses, starting a small business..."
                      rows={3}
                      className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors ${errors.purpose ? 'border-red-500/60' : 'border-slate-700'}`}
                    />
                    {errors.purpose && <p className="text-xs text-red-400">{errors.purpose}</p>}
                  </div>

                  {/* Agreement */}
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${errors.agreement ? 'border-red-500/40 bg-red-500/5' : 'border-slate-700 hover:bg-slate-800/30'}`}>
                    <input
                      id="app-agreement"
                      type="checkbox"
                      checked={formData.agreement}
                      onChange={(e) => { setFormData({ ...formData, agreement: e.target.checked }); setErrors({ ...errors, agreement: undefined }); }}
                      className="mt-0.5 w-4 h-4 accent-blue-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-400 leading-relaxed">
                      I confirm that the information provided is accurate and I agree to the{' '}
                      <span className="text-blue-400 hover:underline cursor-pointer">Terms & Conditions</span>{' '}
                      and{' '}
                      <span className="text-blue-400 hover:underline cursor-pointer">Privacy Policy</span>.
                    </span>
                  </label>
                  {errors.agreement && <p className="text-xs text-red-400 -mt-3">You must agree to the terms to proceed</p>}

                  {/* Submit Button */}
                  <button
                    id="submit-application-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing Application...
                      </>
                    ) : (
                      <>
                        Submit Application <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
