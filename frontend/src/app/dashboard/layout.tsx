'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, UserCircle, LogOut, FileUp } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOfficer = pathname.includes('/officer');

  const navLinks = isOfficer 
    ? [
        { name: 'Overview', href: '/dashboard/officer', icon: LayoutDashboard },
        { name: 'Applications', href: '/dashboard/applications', icon: FileText },
        { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
      ]
    : [
        { name: 'My Dashboard', href: '/dashboard/customer', icon: LayoutDashboard },
        { name: 'Submit Data', href: '/dashboard/submit-data', icon: FileUp },
        { name: 'Loan Offers', href: '/dashboard/loan-offers', icon: FileText },
        { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
      ];

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-[#0f172a]/80 backdrop-blur-md flex flex-col z-20">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tighter">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/50">
              S
            </div>
            SmartCredit
          </Link>
          <div className="mt-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
            {isOfficer ? 'Officer Portal' : 'Customer Portal'}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="p-8 max-w-7xl mx-auto z-10 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
