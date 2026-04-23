"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Target,
  Brain,
  Sparkles
} from "lucide-react";
import AttendanceTracker from "@/components/AttendanceTracker";
import AISessionPlanner from "@/components/AISessionPlanner";

const coachData = {
  name: "Coach Mike Torres",
  stats: [
    { label: "Total Sessions", value: "42", icon: Calendar, color: "indigo" },
    { label: "Avg. Attendance", value: "94%", icon: Users, color: "violet" },
    { label: "Est. Earnings", value: "AED 12,450", icon: DollarSign, color: "amber" },
    { label: "Target ROI", value: "+8%", icon: TrendingUp, color: "rose" },
  ],
  upcomingSessions: [
    { id: 1, name: "U12 Football - Advanced", time: "16:00 - 17:30", venue: "Dubai Heights Academy", status: "pending" },
    { id: 2, name: "U9 Football - Junior", time: "18:00 - 19:00", venue: "Dubai Heights Academy", status: "pending" },
  ]
};

export default function CoachHubPage() {
  const [activeTab, setActiveTab] = useState("sessions");
  const [activeSession, setActiveSession] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-black text-white tracking-tight">Coach High-Performance Hub</h1>
          <p className="page-subtitle text-slate-400">Welcome back, {coachData.name}. Empowering athlete growth.</p>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 overflow-x-auto whitespace-nowrap scrollbar-hide">
           {['Sessions', 'Registers', 'Progress', 'Timetable', 'AI Planner'].map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.toLowerCase().replace(' ', '') ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {coachData.stats.map((s, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group">
            <div className={`absolute bottom-0 right-0 p-1 opacity-10 text-${s.color}-500 transform translate-x-2 translate-y-2`}>
              <s.icon size={64} />
            </div>
            <div className={`w-8 h-8 rounded-lg bg-${s.color}-500/20 flex items-center justify-center text-${s.color}-400 mb-3`}>
               <s.icon size={16} />
            </div>
            <div className="text-xl font-black text-white">{s.value}</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      {activeTab === 'sessions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Today's Sessions</span>
              <span className="badge badge-pending">Active Shift</span>
            </div>

            <div className="flex flex-col gap-3">
              {coachData.upcomingSessions.map((session) => (
                <div 
                  key={session.id}
                  onClick={() => setActiveSession(session.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    activeSession === session.id 
                      ? "bg-indigo-500/10 border-indigo-500/40 translate-x-1" 
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{session.name}</span>
                    <span className="text-[10px] font-black text-indigo-400">{session.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                    <Target size={12} className="text-indigo-500" />
                    {session.venue}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-violet-500/5 rounded-2xl border border-violet-500/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-violet-500/20 p-2 rounded-lg text-violet-400">
                  <DollarSign size={16} />
                </div>
                <span className="text-xs font-black text-slate-200 uppercase tracking-widest">Session Commission</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                You are earning <span className="text-white font-bold">15% commission</span> + 
                <span className="text-white font-bold"> AED 150 base</span> per session.
              </p>
            </div>
          </div>

          {/* Selected Session Attendance / Placeholder */}
          <div className="lg:col-span-2">
            {activeSession ? (
              <AttendanceTracker 
                sessionName={coachData.upcomingSessions.find(s => s.id === activeSession)?.name}
              />
            ) : (
              <div className="h-full min-h-[400px] rounded-3xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-slate-500">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-white font-bold">Ready to Start?</h4>
                <p className="text-sm text-slate-400 mt-1 max-w-[200px]">
                  Select a session from the list to begin marking attendance.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'registers' && (
        <div className="rounded-3xl bg-white/5 border border-white/5 p-8">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white italic tracking-tighter">TEAM REGISTERS</h3>
              <button className="px-4 py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase text-white shadow-lg shadow-indigo-500/20">Download All</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Elite Swim Team A', 'Development Squad 02', 'Private Coaching - Sarah W.'].map((group, i) => (
                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                         <Users size={24} />
                      </div>
                      <div>
                         <div className="font-bold text-white text-base">{group}</div>
                         <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">12 Athletes Assigned</div>
                      </div>
                   </div>
                   <ChevronRight size={18} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="rounded-3xl bg-white/5 border border-white/5 p-8">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <TrendingUp size={20} />
                 </div>
                 <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Weekly Progress Logs</h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                 <AlertTriangle size={12} /> 4 Pending
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "John Doe", sport: "Swimming", lastUpdate: "7 days ago", status: "Due" },
                { name: "Alice Smith", sport: "Swimming", lastUpdate: "1 day ago", status: "Done" },
                { name: "Emma Watson", sport: "Swimming", lastUpdate: "8 days ago", status: "Due" }
              ].map((athlete, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4 hover:border-indigo-500/20 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-2 border-white/5 bg-slate-800 flex items-center justify-center text-indigo-400 font-black text-lg">{athlete.name[0]}</div>
                      <div>
                         <div className="text-white font-bold">{athlete.name}</div>
                         <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{athlete.sport}</div>
                      </div>
                   </div>
                   <div className="text-[10px] text-slate-500 font-medium">Last updated: <span className="text-slate-300">{athlete.lastUpdate}</span></div>
                   <button className={`w-full py-3 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${athlete.status === 'Due' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-emerald-500/10 text-emerald-400 cursor-default'}`}>
                      {athlete.status === 'Due' ? 'Enter Weekly Log' : 'Log Verified'}
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="rounded-3xl bg-white/5 border border-white/5 p-8">
           <h3 className="text-xl font-black text-white mb-8 italic tracking-tighter uppercase">Coach Schedule</h3>
           <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                <div key={day} className="flex flex-col gap-2">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center py-2 bg-white/5 rounded-lg border border-white/5">{day}</div>
                   <div className="flex-1 min-h-[150px] bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center group hover:bg-white/[0.07] transition-all">
                      <div className="text-[8px] text-slate-700 font-black uppercase rotate-90 group-hover:text-indigo-500 transition-colors tracking-[4px]">REST DAY</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'aiplanner' && (
        <AISessionPlanner />
      )}
    </div>
  );
}
