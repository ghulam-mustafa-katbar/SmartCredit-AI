'use client';
import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Info, CheckCircle2, ChevronDown, ChevronUp,
  ArrowRight, X, User, Mail, Phone, FileText, Banknote, Loader2,
  Clock, Shield, Percent, CalendarDays,
} from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const loanOffers = [
  {
    id: 1,
    type: 'Personal Loan',
    amount: '$5,000',
    amountRaw: 5000,
    term: '12 Months',
    apr: '8.5%',
    monthly: '$435',
    approval: 92,
    badge: 'Best Match',
    color: 'blue',
    description: 'Flexible personal loan to cover everyday needs, medical expenses, or home improvements.',
    highlights: ['No collateral required', 'Fixed monthly payments', 'Early repayment allowed'],
  },
  {
    id: 2,
    type: 'Auto Loan',
    amount: '$12,000',
    amountRaw: 12000,
    term: '36 Months',
    apr: '7.2%',
    monthly: '$372',
    approval: 85,
    badge: 'Lowest APR',
    color: 'emerald',
    description: 'Finance your next vehicle purchase with our lowest available APR across all loan products.',
    highlights: ['Lowest APR offer', 'Vehicle as collateral', 'Instant pre-approval'],
  },
];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  purpose: string;
  agreement: boolean;
}

interface Offer {
  id: number;
  type: string;
  amount: string;
  amountRaw: number;
  term: string;
  apr: string;
  monthly: string;
  approval: number;
  badge: string;
  color: string;
  description: string;
  highlights: string[];
}

export default function CustomerDashboard() {
  const [mounted, setMounted] = useState(false);
  const [expandedOffer, setExpandedOffer] = useState<number | null>(null);
  const [modalOffer, setModalOffer] = useState<Offer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [appId, setAppId] = useState('');
  const [form, setForm] = useState<FormState>({
    fullName: '', email: '', phone: '', purpose: '', agreement: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => setMounted(true), []);

  const score = 724;
  const maxScore = 850;
  const scoreData = [{ name: 'score', value: score, fill: '#3b82f6' }];

  /* ── Validation ── */
  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'A valid email is required';
    if (!form.phone.trim() || form.phone.length < 7) e.phone = 'A valid phone number is required';
    if (!form.purpose.trim()) e.purpose = 'Please describe your loan purpose';
    if (!form.agreement) e.agreement = 'You must agree to the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setAppId(`APP-${Math.floor(900 + Math.random() * 100)}`);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2200);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setModalOffer(null);
    setIsSuccess(false);
    setForm({ fullName: '', email: '', phone: '', purpose: '', agreement: false });
    setErrors({});
  };

  const openModal = (offer: Offer) => {
    setModalOffer(offer);
    setIsSuccess(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Dashboard</h1>
        <p className="text-slate-400">Your AI-driven alternative credit assessment.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <div className="flex items-center gap-1 text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
              <CheckCircle2 className="w-3 h-3" /> Updated Today
            </div>
          </div>
          <h2 className="text-lg font-medium text-slate-300 w-full text-left mb-4">Credit Score</h2>
          <div className="w-48 h-48 relative">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="80%" outerRadius="100%"
                  barSize={15}
                  data={scoreData}
                  startAngle={180}
                  endAngle={-180}
                >
                  <PolarAngleAxis type="number" domain={[0, maxScore]} angleAxisId={0} tick={false} />
                  <RadialBar background={{ fill: '#1e293b' }} cornerRadius={10} dataKey="value" />
                </RadialBarChart>
              </ResponsiveContainer>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black gradient-text">{score}</span>
              <span className="text-sm text-slate-400">/ {maxScore}</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-lg font-semibold text-emerald-400">Good Standing</div>
            <p className="text-sm text-slate-400 mt-1">You are in the top 30% of alternative profiles.</p>
          </div>
        </div>

        {/* Explainability (SHAP) Card */}
        <div className="md:col-span-2 glass-card p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-medium text-slate-300 mb-1 flex items-center gap-2">
                Why this score? <Info className="w-4 h-4 text-slate-500" />
              </h2>
              <p className="text-sm text-slate-400">Explainable AI (SHAP) factors affecting your rating.</p>
            </div>
          </div>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {[
              { factor: 'Utility Payment Consistency', impact: '+45 pts', positive: true, desc: 'No missed electricity bills in 12 months.' },
              { factor: 'Income Stability', impact: '+32 pts', positive: true, desc: 'Consistent monthly deposits identified.' },
              { factor: 'Recent High Expense', impact: '-15 pts', positive: false, desc: 'Large outflow detected last week.' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                <div className={`p-2 rounded-lg ${item.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {item.positive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-semibold">{item.factor}</span>
                    <span className={`font-bold ${item.positive ? 'text-emerald-400' : 'text-red-400'}`}>{item.impact}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Loan Offers Section ── */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          Loan Offers <span className="bg-blue-600 text-xs px-2 py-0.5 rounded-full">Pre-approved</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loanOffers.map((offer) => {
            const isExpanded = expandedOffer === offer.id;
            return (
              <div
                key={offer.id}
                className={`glass-card overflow-hidden transition-all duration-300 ${
                  isExpanded
                    ? 'border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.12)]'
                    : 'border-blue-500/20 hover:border-blue-500/40'
                }`}
              >
                {/* Card Header — always visible */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400 text-sm font-medium">{offer.type}</span>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      {offer.approval}% Approval
                    </span>
                  </div>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-3xl font-bold gradient-text">{offer.amount}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-300">
                    <div>Term: <span className="font-semibold text-white">{offer.term}</span></div>
                    <div>Est. APR: <span className="font-semibold text-white">{offer.apr}</span></div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800 flex justify-between items-center">
                    <button
                      id={`view-details-${offer.id}`}
                      onClick={() => setExpandedOffer(isExpanded ? null : offer.id)}
                      className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
                    >
                      {isExpanded ? (
                        <><ChevronUp className="w-4 h-4" /> Hide Details</>
                      ) : (
                        <><ChevronDown className="w-4 h-4" /> View Details</>
                      )}
                    </button>
                    <button
                      id={`apply-offer-${offer.id}`}
                      onClick={() => openModal(offer)}
                      className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(59,130,246,0.25)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    >
                      Apply Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expandable Details Panel */}
                {isExpanded && (
                  <div className="border-t border-slate-800 bg-slate-900/50 p-5 space-y-5 animate-in slide-in-from-top-2 duration-300">
                    {/* Description */}
                    <p className="text-sm text-slate-400 leading-relaxed">{offer.description}</p>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Banknote, label: 'Loan Amount', value: offer.amount, color: 'text-blue-400' },
                        { icon: CalendarDays, label: 'Repayment Term', value: offer.term, color: 'text-violet-400' },
                        { icon: Percent, label: 'Est. APR', value: offer.apr, color: 'text-amber-400' },
                        { icon: Clock, label: 'Monthly Payment', value: offer.monthly, color: 'text-emerald-400' },
                      ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`w-3.5 h-3.5 ${color}`} />
                            <span className="text-xs text-slate-500">{label}</span>
                          </div>
                          <div className={`text-base font-bold ${color}`}>{value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Approval Probability Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Approval Probability
                        </span>
                        <span className="font-bold text-emerald-400">{offer.approval}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                          style={{ width: `${offer.approval}%` }}
                        />
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" /> Key Benefits
                      </div>
                      <ul className="space-y-1.5">
                        {offer.highlights.map((h) => (
                          <li key={h} className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA inside panel */}
                    <button
                      onClick={() => openModal(offer)}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_28px_rgba(59,130,246,0.45)]"
                    >
                      Submit Application <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Application Modal ── */}
      {modalOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

          {/* Panel */}
          <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-[#0f172a]/95 backdrop-blur-sm border-b border-slate-800 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">Loan Application</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  {modalOffer.type} · {modalOffer.amount} · {modalOffer.apr} APR
                </p>
              </div>
              {!isSubmitting && (
                <button onClick={closeModal} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-6">
              {isSuccess ? (
                /* Success State */
                <div className="flex flex-col items-center text-center py-6 gap-5">
                  <div className="w-20 h-20 bg-emerald-500/15 rounded-full flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Your {modalOffer.type} application for {modalOffer.amount} has been received.
                      Our team will review it within <strong className="text-slate-200">24 hours</strong>.
                    </p>
                  </div>
                  <div className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4">
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Application Reference</div>
                    <div className="text-2xl font-mono font-bold text-blue-400">{appId}</div>
                    <div className="text-xs text-slate-500 mt-1">Save this ID to track your application status</div>
                  </div>
                  <div className="w-full grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: 'Loan Type', value: modalOffer.type },
                      { label: 'Amount', value: modalOffer.amount },
                      { label: 'Term', value: modalOffer.term },
                      { label: 'Monthly Payment', value: modalOffer.monthly },
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-left">
                        <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                        <div className="font-semibold text-slate-100">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={closeModal} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all">
                    Done
                  </button>
                </div>
              ) : (
                /* Form State */
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Offer Summary */}
                  <div className="flex gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                    <Banknote className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-slate-100">{modalOffer.type} — {modalOffer.amount}</p>
                      <p className="text-slate-400 mt-0.5">{modalOffer.term} · {modalOffer.apr} APR · {modalOffer.monthly}/mo</p>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" /> Full Name
                    </label>
                    <input
                      id="dash-full-name"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => { setForm({ ...form, fullName: e.target.value }); setErrors({ ...errors, fullName: '' }); }}
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
                      id="dash-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
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
                      id="dash-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }}
                      placeholder="+1 555 000 0000"
                      className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.phone ? 'border-red-500/60' : 'border-slate-700'}`}
                    />
                    {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                  </div>

                  {/* Purpose */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500" /> Loan Purpose
                    </label>
                    <textarea
                      id="dash-purpose"
                      value={form.purpose}
                      onChange={(e) => { setForm({ ...form, purpose: e.target.value }); setErrors({ ...errors, purpose: '' }); }}
                      placeholder="e.g. Home renovation, medical expenses, vehicle purchase..."
                      rows={3}
                      className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors ${errors.purpose ? 'border-red-500/60' : 'border-slate-700'}`}
                    />
                    {errors.purpose && <p className="text-xs text-red-400">{errors.purpose}</p>}
                  </div>

                  {/* Agreement */}
                  <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${errors.agreement ? 'border-red-500/40 bg-red-500/5' : 'border-slate-700 hover:bg-slate-800/30'}`}>
                    <input
                      id="dash-agreement"
                      type="checkbox"
                      checked={form.agreement}
                      onChange={(e) => { setForm({ ...form, agreement: e.target.checked }); setErrors({ ...errors, agreement: '' }); }}
                      className="mt-0.5 w-4 h-4 accent-blue-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-400 leading-relaxed">
                      I confirm the information is accurate and agree to the{' '}
                      <span className="text-blue-400 hover:underline cursor-pointer">Terms &amp; Conditions</span>{' '}
                      and <span className="text-blue-400 hover:underline cursor-pointer">Privacy Policy</span>.
                    </span>
                  </label>
                  {errors.agreement && <p className="text-xs text-red-400 -mt-3">{errors.agreement}</p>}

                  {/* Submit */}
                  <button
                    id="dash-submit-application"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing Application...</>
                    ) : (
                      <>Submit Application <ArrowRight className="w-4 h-4" /></>
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
