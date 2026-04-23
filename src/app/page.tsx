"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  UserRound, 
  Award, 
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";

export default function GatewayPage() {
  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-black text-2xl italic tracking-tighter">A</div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Apex Sports Hub</h1>
          </div>
          <p className="text-slate-400 text-lg font-medium max-w-lg mx-auto leading-relaxed">
            Welcome to the command center. Select your gateway to manage your sports journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Admin Portal Card */}
          <Link href="/crm/family" className="group relative">
            <div className="h-full p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                <LayoutDashboard size={32} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 italic">Management</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                Full access to CRM, finances, scheduling, and ROI metrics.
              </p>
              <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                 Control Center <ChevronRight size={14} />
              </div>
            </div>
          </Link>

          {/* Coach Hub Card */}
          <Link href="/coach-hub" className="group relative">
            <div className="h-full p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 italic">Coach Portal</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                Manage your team, track attendance, and log progress.
              </p>
              <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                 Performance Ops <ChevronRight size={14} />
              </div>
            </div>
          </Link>

          {/* Parent Portal Card */}
          <Link href="/moments" className="group relative">
            <div className="h-full p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500 backdrop-blur-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2 italic">Parent Portal</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                View child moments, competition status, and billing.
              </p>
              <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-rose-400 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                 Family View <ChevronRight size={14} />
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">System Operational v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
