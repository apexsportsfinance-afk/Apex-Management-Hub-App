"use client";

import { Activity, AlertCircle, CheckCircle2, Clock, FileText, Heart, Plus, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";

const athletes = [
  { id: "A-001", name: "Emma Watson", medical: "Asthma (Inhaler kept on court)", waiver: "Signed", lastPulse: "88 bpm", waiverDate: "12/01/2026" },
  { id: "A-002", name: "Ryan Park", medical: "Nut Allergy (Epipen in bag)", waiver: "Expiring", lastPulse: "92 bpm", waiverDate: "05/05/2025" },
  { id: "A-003", name: "Lina Chen", medical: "No known conditions", waiver: "Signed", lastPulse: "76 bpm", waiverDate: "10/02/2026" },
  { id: "A-004", name: "Adam Smith", medical: "Recent Ankle Surgery", waiver: "Missing", lastPulse: "N/A", waiverDate: "-" },
];

export default function MedicalPulsePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAthletes = athletes.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.medical.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Heart size={20} />
            </div>
            Medical Pulse & Waivers
          </h1>
          <p className="page-subtitle mt-2">Critical health tracking and digital liability governance.</p>
        </div>
        <button className="btn btn-primary shadow-lg shadow-rose-500/20 flex items-center gap-2" style={{ background: "linear-gradient(to right, #f43f5e, #fb923c)", border: "none" }}>
          <Plus size={16} /> Update Policy
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card border-l-4" style={{ borderColor: "#10b981" }}>
          <div className="text-slate-400 text-sm font-bold mb-1">Signed Waivers</div>
          <div className="text-3xl font-black text-white">94%</div>
          <div className="text-xs text-slate-500 mt-1">Goal: 100% compliance</div>
        </div>
        <div className="card border-l-4" style={{ borderColor: "#f43f5e" }}>
          <div className="text-slate-400 text-sm font-bold mb-1">High Risk Alerts</div>
          <div className="text-3xl font-black text-white">12</div>
          <div className="text-xs text-rose-400 mt-1">Requires immediate coach brief</div>
        </div>
        <div className="card">
          <div className="text-slate-400 text-sm font-bold mb-1">Digital Forms Pending</div>
          <div className="text-3xl font-black text-white">8</div>
          <div className="text-xs text-slate-500 mt-1">Auto-reminders active</div>
        </div>
        <div className="card">
          <div className="text-slate-400 text-sm font-bold mb-1">Daily Pulse Syncs</div>
          <div className="text-3xl font-black text-white">45</div>
          <div className="text-xs text-emerald-400 mt-1 tracking-tight">Wearable integration active</div>
        </div>
      </div>

      <div className="card mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by athlete name or medical condition..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-rose-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary flex items-center gap-2">
            <FileText size={16} /> Bulk Export PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">
                <th className="p-4">Athlete</th>
                <th className="p-4">Medical Condition / Alert</th>
                <th className="p-4">Waiver Status</th>
                <th className="p-4">Live Pulse</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAthletes.map((athlete) => (
                <tr key={athlete.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-200">{athlete.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">ID: {athlete.id}</div>
                  </td>
                  <td className="p-4">
                    <div className={`flex items-center gap-2 text-sm ${athlete.medical !== 'No known conditions' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                      {athlete.medical !== 'No known conditions' && <AlertCircle size={14} />}
                      {athlete.medical}
                    </div>
                  </td>
                  <td className="p-4">
                    {athlete.waiver === 'Signed' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck size={12} /> {athlete.waiver} ({athlete.waiverDate})
                      </span>
                    )}
                    {athlete.waiver === 'Expiring' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock size={12} /> {athlete.waiver}
                      </span>
                    )}
                    {athlete.waiver === 'Missing' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <AlertCircle size={12} /> {athlete.waiver}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Activity size={14} className={athlete.lastPulse !== 'N/A' ? 'text-rose-500' : 'text-slate-600'} />
                      {athlete.lastPulse}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-700 transition-all uppercase">
                      Record Log
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-indigo-400" /> Automated Compliance Gate
          </h3>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            The system is currently configured to automatically **suspend class access** for athletes with unsigned waivers for more than 14 days. These athletes appear in red on all coach rosters.
          </p>
          <div className="flex items-center gap-4">
             <button className="btn btn-secondary text-xs">Edit Rules</button>
             <button className="btn btn-primary text-xs" style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.5)", color: "#818cf8" }}>View Suspended (4)</button>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-rose-500/10 to-transparent border-rose-500/20">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Activity size={18} className="text-rose-400" /> Wearable Sensor Integration
          </h3>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Connected to 45 active sensors (Apple Watch / Garmin). Real-time pulse monitoring alerts coaches if an athlete's heart rate exceeds safety thresholds based on age and sport intensity.
          </p>
          <div className="flex items-center gap-2 text-xs text-rose-300 font-bold uppercase tracking-widest">
            <CheckCircle2 size={14} /> Systems online
          </div>
        </div>
      </div>
    </>
  );
}
