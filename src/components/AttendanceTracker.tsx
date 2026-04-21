"use client";

import React, { useState } from "react";
import { Check, X, Clock, User, ChevronRight, Save } from "lucide-react";

interface AthleteAttendance {
  id: number;
  name: string;
  status: "present" | "absent" | "excused" | "pending";
}

const mockAthletes: AthleteAttendance[] = [
  { id: 1, name: "Emma Wilson", status: "pending" },
  { id: 2, name: "James Lee", status: "pending" },
  { id: 3, name: "Priya Patel", status: "pending" },
  { id: 4, name: "Carlos Ruiz", status: "pending" },
  { id: 5, name: "Sophie Hart", status: "pending" },
];

export default function AttendanceTracker({ 
  sessionName = "U12 Football - Advanced",
  venue = "Dubai Heights Academy"
}) {
  const [list, setList] = useState<AthleteAttendance[]>(mockAthletes);
  const [saving, setSaving] = useState(false);

  const toggleStatus = (id: number, status: AthleteAttendance["status"]) => {
    setList(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const saveAttendance = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert("Attendance saved successfully and synchronized with Payroll Engine.");
    }, 1000);
  };

  const presentCount = list.filter(a => a.status === "present").length;

  return (
    <div className="card glass-panel max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{sessionName}</h3>
          <p className="text-xs text-slate-400">{venue} · Today</p>
        </div>
        <div className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold">
          {presentCount} / {list.length} Present
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {list.map((athlete) => (
          <div 
            key={athlete.id} 
            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
              athlete.status === "present" ? "bg-green-500/10 border-green-500/30" : 
              athlete.status === "absent" ? "bg-rose-500/10 border-rose-500/30" :
              "bg-slate-800/40 border-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="avatar w-8 h-8 text-xs">{athlete.name.charAt(0)}</div>
              <span className="text-sm font-medium text-slate-200">{athlete.name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => toggleStatus(athlete.id, "absent")}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  athlete.status === "absent" ? "bg-rose-500 text-white" : "bg-slate-700/50 text-slate-400 hover:bg-rose-500/20"
                }`}
              >
                <X size={14} />
              </button>
              <button 
                onClick={() => toggleStatus(athlete.id, "present")}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  athlete.status === "present" ? "bg-green-500 text-white" : "bg-slate-700/50 text-slate-400 hover:bg-green-500/20"
                }`}
              >
                <Check size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={saveAttendance}
        disabled={saving}
        className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
      >
        {saving ? "Synchronizing..." : (
          <>
            <Save size={18} />
            Complete Attendance
          </>
        )}
      </button>

      <div className="mt-4 p-2 bg-amber-500/10 border border-amber-500/20 rounded text-[10px] text-amber-200/70 text-center uppercase tracking-tighter">
        ⚠️ Note: Unmarked athletes will be flagged in the Accountability Auditor.
      </div>
    </div>
  );
}
