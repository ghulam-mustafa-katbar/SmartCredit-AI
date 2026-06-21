import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>

      {/* Navbar */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-10 px-8">
        <div className="text-2xl font-extrabold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/50">
            S
          </div>
          SmartCredit AI
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-6 py-2 rounded-full font-medium hover:bg-white/5 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 rounded-full font-medium bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/30"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="z-10 flex flex-col items-center text-center px-4 max-w-4xl mt-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Alternative Credit Assessment Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Unlock Credit with <br />
          <span className="gradient-text">Explainable AI</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
          Empowering the unbanked through alternative data. We analyze your SMS transactions, bills, and financial behavior to give you the credit score you deserve.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/register"
            className="px-8 py-4 rounded-full font-semibold text-lg bg-blue-600 hover:bg-blue-500 transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(59,130,246,0.4)] text-center"
          >
            Check Your Eligibility
          </Link>
          <Link
            href="/dashboard/officer"
            className="px-8 py-4 rounded-full font-semibold text-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-all text-center"
          >
            For Loan Officers
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-5xl">
          {[
            { title: "Fair Scoring", desc: "Our ML engine evaluates alternative data beyond traditional credit history.", href: "/register" },
            { title: "Transparent AI", desc: "SHAP-powered explanations tell you exactly why you got your score.", href: "/dashboard/customer" },
            { title: "Instant Decisions", desc: "Real-time loan probability and personalized installment plans.", href: "/register" },
          ].map((feature, idx) => (
            <Link key={idx} href={feature.href} className="glass-card p-6 text-left hover:-translate-y-2 transition-transform duration-300 block">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full blur-[2px]"></div>
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
