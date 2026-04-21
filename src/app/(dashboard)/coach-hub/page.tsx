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
  Target
} from "lucide-react";
import AttendanceTracker from "@/components/AttendanceTracker";

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
  const [activeSession, setActiveSession] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Coach Performance Hub</h1>
        <p className="page-subtitle">Welcome back, {coachData.name}. Track your impact and earnings.</p>
      </div>

      {/* Stats Grid */}
      <div className="kpi-grid">
        {coachData.stats.map((s, i) => (
          <div key={i} className={`kpi-card ${s.color}`}>
            <div className={`kpi-icon ${s.color}`}><s.icon size={20} /></div>
            <div className="kpi-value">{s.value}</div>
            <div className="kpi-label">{s.label}</div>
            <div className="kpi-subtext">Updated 2m ago</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Session List */}
        <div className="card glass-panel">
          <div className="section-header">
            <span className="section-title">👟 Today's Sessions</span>
            <span className="badge badge-pending">Active Shift</span>
          </div>

          <div className="flex flex-col gap-3">
            {coachData.upcomingSessions.map((session) => (
              <div 
                key={session.id}
                onClick={() => setActiveSession(session.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeSession === session.id 
                    ? "bg-indigo-500/10 border-indigo-500/40" 
                    : "bg-white/5 border-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{session.name}</span>
                  <span className="badge badge-pending text-[10px]">{session.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Target size={12} className="text-indigo-400" />
                  {session.venue}
                </div>
                {activeSession === session.id && (
                  <div className="mt-3 text-[10px] text-indigo-400 font-bold flex items-center gap-1">
                    ACTIVE SELECTION <ChevronRight size={10} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-violet-500/5 rounded-xl border border-violet-500/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-violet-500/20 p-1.5 rounded-lg text-violet-400">
                <DollarSign size={16} />
              </div>
              <span className="text-sm font-bold text-slate-200">Session Commission</span>
            </div>
            <p className="text-xs text-slate-400 leading-tight">
              You are earning <span className="text-white font-bold">15% commission</span> + 
              <span className="text-white font-bold"> AED 150 base</span> per session.
            </p>
          </div>
        </div>

        {/* Selected Session Attendance / Placeholder */}
        <div>
          {activeSession ? (
            <AttendanceTracker 
              sessionName={coachData.upcomingSessions.find(s => s.id === activeSession)?.name}
            />
          ) : (
            <div className="card glass-panel h-full flex flex-col items-center justify-center text-center p-12">
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

      {/* Persistence / Retention Teaser */}
      <div className="card glass-panel border-indigo-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
               <Users size={20} />
             </div>
             <div>
               <h4 className="text-sm font-bold text-white">Athlete Persistence Monitor</h4>
               <p className="text-xs text-slate-400">Track which athletes stay for 3+ months under your coaching.</p>
             </div>
          </div>
          <button className="btn btn-secondary btn-sm">View Cohorts</button>
        </div>
      </div>
    </div>
  );
}
