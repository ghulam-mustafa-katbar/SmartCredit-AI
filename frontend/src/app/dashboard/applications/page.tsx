'use client';
import { useState } from 'react';
import { FileText, Search, Filter, Clock, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';

const applications = [
  { id: 'APP-921', name: 'John Doe', type: 'Personal Loan', amount: '$5,000', date: '2026-06-20', status: 'Pending' },
  { id: 'APP-922', name: 'Sarah Smith', type: 'Auto Loan', amount: '$12,000', date: '2026-06-21', status: 'Under Review' },
  { id: 'APP-923', name: 'Ahmed Ali', type: 'Micro Finance', amount: '$2,000', date: '2026-06-21', status: 'Pending' },
  { id: 'APP-924', name: 'Maria Garcia', type: 'Personal Loan', amount: '$8,000', date: '2026-06-19', status: 'Approved' },
  { id: 'APP-925', name: 'Wei Zhang', type: 'Auto Loan', amount: '$15,000', date: '2026-06-18', status: 'Rejected' },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Under Review': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUS_ICON: Record<string, React.ElementType> = {
  Pending: Clock,
  'Under Review': FileText,
  Approved: CheckCircle2,
  Rejected: XCircle,
};

export default function OfficerApplicationsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const statuses = ['All', 'Pending', 'Under Review', 'Approved', 'Rejected'];

  const filtered = applications.filter((app) => {
    const matchSearch = app.name.toLowerCase().includes(search.toLowerCase()) || app.id.includes(search);
    const matchFilter = filter === 'All' || app.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Applications</h1>
        <p className="text-slate-400">Full history of all submitted loan applications.</p>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or App ID..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                filter === s
                  ? 'bg-blue-600 text-white border-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                {['App ID', 'Applicant', 'Loan Type', 'Amount', 'Date', 'Status'].map((h) => (
                  <th key={h} className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">No applications match your search.</td>
                </tr>
              ) : filtered.map((app) => {
                const StatusIcon = STATUS_ICON[app.status];
                return (
                  <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 text-sm font-mono text-slate-400">{app.id}</td>
                    <td className="p-4 text-sm font-medium">{app.name}</td>
                    <td className="p-4 text-sm text-slate-300">{app.type}</td>
                    <td className="p-4 text-sm font-bold text-blue-400">{app.amount}</td>
                    <td className="p-4 text-sm text-slate-400">{app.date}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[app.status]}`}>
                        <StatusIcon className="w-3 h-3" />
                        {app.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
