"use client";

import React, { useState } from "react";
import { 
  Copy, 
  Plus, 
  Trash2, 
  Calendar, 
  Zap, 
  ArrowRight, 
  Save, 
  RefreshCcw,
  Clock,
  MapPin,
  User
} from "lucide-react";

interface TemplateSession {
  id: string;
  day: string;
  time: string;
  sport: string;
  coach: string;
  venue: string;
}

const mockVenues = ["Dubai Heights Academy", "Kent College", "Sunmarke School"];
const mockCoaches = ["Mike Torres", "Sarah Kim", "Anna Brown"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ScheduleTemplatesPage() {
  const [sessions, setSessions] = useState<TemplateSession[]>([
    { id: "1", day: "Monday", time: "16:00", sport: "Football", coach: "Mike Torres", venue: "Dubai Heights Academy" },
    { id: "2", day: "Wednesday", time: "17:00", sport: "Basketball", coach: "Sarah Kim", venue: "Kent College" },
  ]);

  const [termName, setTermName] = useState("Term 3 - Spring 2026");
  const [propagating, setPropagating] = useState(false);

  const addSession = () => {
    const newSession: TemplateSession = {
      id: Math.random().toString(36).substr(2, 9),
      day: "Monday",
      time: "16:00",
      sport: "New Sport",
      coach: mockCoaches[0],
      venue: mockVenues[0]
    };
    setSessions([...sessions, newSession]);
  };

  const removeSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const propagateTemplate = () => {
    setPropagating(true);
    // Simulate complex background propagation
    setTimeout(() => {
      setPropagating(false);
      alert(`Propagation Complete: 142 session instances created for ${termName} across 12 weeks.`);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Bulk Schedule Templates</h1>
          <p className="page-subtitle">Define a weekly rhythm once, apply it to the whole term.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm" onClick={() => window.location.href = "/schedule"}>
            View Active Calendar
          </button>
          <button 
            className="btn btn-primary btn-sm flex items-center gap-2"
            onClick={propagateTemplate}
            disabled={propagating}
          >
            {propagating ? <RefreshCcw size={14} className="animate-spin" /> : <Zap size={14} />}
            {propagating ? "Propagating..." : "One-Click Apply to Term"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Template Builder */}
        <div className="col-span-2 flex flex-col gap-4">
          <div className="card glass-panel">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Copy size={18} className="text-indigo-400" />
                Weekly Roster Template
              </h3>
              <button className="btn btn-primary btn-sm rounded-full" onClick={addSession}>
                <Plus size={14} /> Add Slot
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {sessions.map((session) => (
                <div key={session.id} className="group relative flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-500/30 transition-all">
                  <div className="flex-1 grid grid-cols-5 gap-3">
                    <select className="filter-select bg-slate-900 border-white/5 py-1.5 h-auto text-[12px]">
                      {days.map(d => <option key={d}>{d}</option>)}
                    </select>
                    <div className="flex items-center gap-1.5 px-2 bg-slate-900 rounded border border-white/5">
                      <Clock size={12} className="text-slate-500" />
                      <input type="time" className="bg-transparent border-none text-[12px] text-white outline-none w-full" defaultValue={session.time} />
                    </div>
                    <select className="filter-select bg-slate-900 border-white/5 py-1.5 h-auto text-[12px]">
                      {mockCoaches.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <select className="filter-select bg-slate-900 border-white/5 py-1.5 h-auto text-[12px]">
                      {mockVenues.map(v => <option key={v}>{v}</option>)}
                    </select>
                    <input type="text" placeholder="Sport Name" className="bg-slate-900 border border-white/5 rounded px-3 text-[12px] text-white outline-none" defaultValue={session.sport} />
                  </div>
                  <button onClick={() => removeSession(session.id)} className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="flex flex-col gap-4">
          <div className="card glass-panel border-amber-500/10">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Zap size={16} className="text-amber-400" />
              Propagation Logic
            </h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Target Term</label>
                <select className="filter-select w-full">
                  <option>Term 3 - Spring 2026</option>
                  <option>Term 4 - Summer Camp</option>
                  <option>Year 2026/27 - Term 1</option>
                </select>
              </div>

              <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                <div className="flex items-center gap-2 text-amber-200 font-bold text-xs mb-1">
                  <AlertTriangle size={14} /> Automation Warning
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Propagation will generate individual booking slots for every week in the term. 
                  Existing slots with the same coach/venue/time will be skipped to prevent double-booking.
                </p>
              </div>

              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Detected Term Length:</span>
                  <span className="text-white font-bold">12 Weeks</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Sessions Per Week:</span>
                  <span className="text-white font-bold">{sessions.length}</span>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-200">Total Propagation:</span>
                  <span className="font-extrabold text-indigo-400">{sessions.length * 12} instances</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-indigo-600/10 border-indigo-600/30 p-4">
            <h4 className="text-xs font-bold text-indigo-300 mb-2">Pro Tip</h4>
            <p className="text-[10px] text-indigo-200/60 leading-relaxed">
              Use "Templates" to save different weekday configurations (e.g. "Morning Camp vs Afternoon Academy") and switch between them instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertTriangle(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
