'use client';
import { useState, useEffect } from 'react';
import { UserCircle, Mail, Phone, MapPin, Briefcase, Save, CheckCircle2, Edit2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Default values before user loads
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+1 (555) 012-3456', // Placeholder until API supports this
    city: 'New York', // Placeholder until API supports this
    employment: 'Full-time Employed', // Placeholder until API supports this
    income: '5000', // Placeholder until API supports this
  });

  // Sync state with auth context once user loads
  useEffect(() => {
    if (user) {
      const nameParts = (user.full_name || '').split(' ');
      setForm((prev) => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleSave = () => {
    // In a real app, you would make a PUT request to the backend to update user data here
    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const Field = ({
    label, icon: Icon, field, type = 'text',
  }: {
    label: string;
    icon: React.ElementType;
    field: keyof typeof form;
    type?: string;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-500" /> {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className="w-full bg-slate-900/50 border border-blue-500/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      ) : (
        <div className="w-full bg-slate-900/30 border border-slate-800 rounded-xl px-4 py-3 text-slate-200">
          {field === 'income' ? `$${Number(form[field]).toLocaleString()} / month` : form[field] || 'Not set'}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 max-w-2xl">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Profile</h1>
          <p className="text-slate-400">Manage your personal and financial details.</p>
        </div>
        {isSaved && (
          <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
            <CheckCircle2 className="w-4 h-4" /> Saved!
          </div>
        )}
      </header>

      {/* Avatar Card */}
      <div className="glass-card p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
          <UserCircle className="w-10 h-10 text-blue-400" />
        </div>
        <div>
          <div className="text-2xl font-bold">{form.firstName} {form.lastName}</div>
          <div className="text-slate-400 text-sm mt-1">{form.email}</div>
          <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {user?.role_id === 2 ? 'Officer Account' : 'Customer Account'}
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all"
        >
          <Edit2 className="w-4 h-4" />
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Form Fields */}
      <div className="glass-card p-6 space-y-6">
        <h2 className="text-lg font-semibold border-b border-slate-800 pb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="First Name" icon={UserCircle} field="firstName" />
          <Field label="Last Name" icon={UserCircle} field="lastName" />
          <Field label="Email Address" icon={Mail} field="email" type="email" />
          <Field label="Phone Number" icon={Phone} field="phone" />
          <Field label="City" icon={MapPin} field="city" />
          <Field label="Employment Status" icon={Briefcase} field="employment" />
        </div>
      </div>

      <div className="glass-card p-6 space-y-6">
        <h2 className="text-lg font-semibold border-b border-slate-800 pb-4">Financial Details</h2>
        <Field label="Monthly Income (USD)" icon={Briefcase} field="income" type="number" />
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 py-3 font-semibold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
