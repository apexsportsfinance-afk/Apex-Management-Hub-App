"use client";

import React, { useState } from "react";
import { Sparkles, Play, RefreshCcw, Save, Target, Zap, ChevronRight, Brain } from "lucide-react";

const mockDrills = [
  { id: 1, title: "High-Intensity Interval Laps", duration: "15 min", difficulty: "High", goal: "Stamina Expansion" },
  { id: 2, title: "Butterfly Stroke Synchronization", duration: "20 min", difficulty: "Medium", goal: "Technical Precision" },
  { id: 3, title: "Explosive Takeoff Drills", duration: "10 min", difficulty: "Elite", goal: "Reaction Speed" },
];

export default function AISessionPlanner() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [drills, setDrills] = useState(mockDrills);

  const generateDrills = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setDrills([...drills, { 
        id: Date.now(), 
        title: "Dynamic Core Stability", 
        duration: "12 min", 
        difficulty: "Medium", 
        goal: "Streamline Posture" 
      }]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search / Context Bar */}
      <div className="p-6 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500 rounded-lg text-white">
              <Brain size={20} />
            </div>
            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">AI Drilling Engine</h3>
          </div>
          <p className="text-sm text-indigo-200/60 max-w-md">
            Analyzing current athlete cohorts and historical progress to suggest the optimal training sequence.
          </p>
        </div>
        <button 
          onClick={generateDrills}
          disabled={isGenerating}
          className="relative z-10 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-black rounded-2xl flex items-center gap-3 shadow-xl shadow-indigo-500/20 transition-all active:scale-95 group"
        >
          {isGenerating ? <RefreshCcw className="animate-spin" /> : <Sparkles className="group-hover:rotate-12 transition-transform" />}
          {isGenerating ? "OPTIMIZING..." : "GENERATE AI PLAN"}
        </button>
        
        {/* Abstract BG Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Suggested Drills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">Core Sequence</span>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{drills.length} Drills Suggested</span>
          </div>
          
          <div className="flex flex-col gap-3">
            {drills.map((drill, i) => (
              <div key={drill.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 font-black text-lg">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{drill.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-slate-500 uppercase">{drill.duration}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span className={`text-[10px] font-black uppercase ${drill.difficulty === 'High' ? 'text-rose-400' : drill.difficulty === 'Elite' ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {drill.difficulty} INTENSITY
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all">
                     <Play size={14} fill="currentColor" />
                  </button>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] rounded-lg border border-white/5">
                   <Target size={12} className="text-indigo-500" />
                   <span className="text-[10px] font-medium text-slate-400 tracking-tight">Main Objective: <span className="text-slate-200">{drill.goal}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="space-y-6">
          <div className="card p-8 bg-slate-900 border-indigo-500/20 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <Zap size={20} className="text-amber-400 fill-current" />
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Growth Opportunity</h4>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              Based on last week's logs, <span className="text-white font-bold">40% of the U12 cohort</span> are struggling with transition timing. This session focuses on <span className="text-indigo-400 font-bold italic">Explosive Agility</span> to bridge that gap.
            </p>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
               <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Target size={24} />
               </div>
               <div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Projected Mastery</div>
                  <div className="text-lg font-black text-white">+14.2%</div>
               </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px]" />
          </div>

          <div className="card p-6 border-slate-800">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-xs font-black text-slate-500 uppercase tracking-[2px]">Cohort Readiness</h3>
               <span className="badge badge-paid">92% Ready</span>
             </div>
             <div className="space-y-4">
                {[
                  { label: "Technical Form", value: 78, color: "indigo" },
                  { label: "Stamina Reserve", value: 64, color: "rose" },
                  { label: "Focus & Discipline", value: 89, color: "emerald" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400">{stat.label}</span>
                      <span className="text-[10px] font-black text-white">{stat.value}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-${stat.color}-500 rounded-full`} style={{ width: `${stat.value}%` }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <button className="w-full py-4 bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2">
             <Save size={14} /> Save Session Template
          </button>
        </div>
      </div>
    </div>
  );
}
