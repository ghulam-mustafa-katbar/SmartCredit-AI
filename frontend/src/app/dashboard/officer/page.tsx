'use client';
import { Search, Filter, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';
import { useState } from 'react';

export default function OfficerDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const applications = [
    { id: 'APP-921', name: 'John Doe', risk: 'Low', score: 724, status: 'Pending', date: '2026-06-20' },
    { id: 'APP-922', name: 'Sarah Smith', risk: 'High', score: 512, status: 'Review', date: '2026-06-21' },
    { id: 'APP-923', name: 'Ahmed Ali', risk: 'Medium', score: 645, status: 'Pending', date: '2026-06-21' },
    { id: 'APP-924', name: 'Maria Garcia', risk: 'Low', score: 780, status: 'Approved', date: '2026-06-19' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Applications Overview</h1>
          <p className="text-slate-400">Review and manage alternative credit assessments.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search applications..." 
              className="pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applications', value: '1,284', color: 'text-blue-400' },
          { label: 'Pending Review', value: '42', color: 'text-amber-400' },
          { label: 'Approved (30d)', value: '856', color: 'text-emerald-400' },
          { label: 'Rejected (30d)', value: '124', color: 'text-red-400' },
        ].map((stat, idx) => (
          <div key={idx} className="glass-card p-5">
            <div className="text-sm font-medium text-slate-400 mb-1">{stat.label}</div>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                <th className="p-4 font-medium text-sm text-slate-300">App ID</th>
                <th className="p-4 font-medium text-sm text-slate-300">Applicant</th>
                <th className="p-4 font-medium text-sm text-slate-300">AI Score</th>
                <th className="p-4 font-medium text-sm text-slate-300">Risk Level</th>
                <th className="p-4 font-medium text-sm text-slate-300">Date</th>
                <th className="p-4 font-medium text-sm text-slate-300">Status</th>
                <th className="p-4 font-medium text-sm text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-sm font-mono text-slate-400">{app.id}</td>
                  <td className="p-4 text-sm font-medium">{app.name}</td>
                  <td className="p-4 text-sm font-bold text-blue-400">{app.score}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      app.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      app.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {app.risk === 'High' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {app.risk} Risk
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-400">{app.date}</td>
                  <td className="p-4 text-sm">{app.status}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors tooltip-trigger" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-emerald-400 hover:text-white hover:bg-emerald-600 rounded-lg transition-colors" title="Approve">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors" title="Reject">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
