"use client";

import { Plus, Edit2, Check, X, DollarSign, Percent } from "lucide-react";
import { useState } from "react";

const initialCoaches = [
  { id: 1, name: "Mike Torres", email: "mike@apex.com", specialty: "Tennis", status: "active", athletes: 22, salary: 150, commission: 15 },
  { id: 2, name: "Sarah Kim", email: "sarah@apex.com", specialty: "Swimming", status: "active", athletes: 18, salary: 200, commission: 10 },
  { id: 3, name: "Anna Brown", email: "anna@apex.com", specialty: "Athletics", status: "active", athletes: 14, salary: 180, commission: 12 },
  { id: 4, name: "John Parker", email: "john@apex.com", specialty: "Fitness", status: "inactive", athletes: 4, salary: 150, commission: 15 },
];

export default function CoachesPage() {
  const [coaches, setCoaches] = useState(initialCoaches);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ salary: 0, commission: 0 });

  const startEdit = (c: any) => {
    setEditingId(c.id);
    setEditValues({ salary: c.salary, commission: c.commission });
  };

  const saveEdit = (id: number) => {
    setCoaches(coaches.map(c => c.id === id ? { ...c, ...editValues } : c));
    setEditingId(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title text-white">Coaches</h1>
          <p className="page-subtitle text-slate-400">{coaches.length} coaches registered</p>
        </div>
        <button className="btn btn-primary btn-sm bg-indigo-600 hover:bg-indigo-500 text-white border-none flex items-center gap-2">
           <Plus size={13} /> Add Coach
        </button>
      </div>
      <div className="card bg-slate-900 border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">#</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Name</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Specialty</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Athletes</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Payroll (Base / Comm)</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {coaches.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 text-[11px] font-bold text-slate-600">{c.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg border border-white/10">{c.name.charAt(0)}</div>
                      <span className="text-sm font-bold text-slate-200">{c.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-400 font-medium">{c.email}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
                      {c.specialty}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-black text-indigo-400">{c.athletes}</span>
                  </td>
                  <td className="p-4">
                    {editingId === c.id ? (
                      <div className="flex items-center gap-2 scale-95 origin-left transition-all">
                        <div className="relative">
                          <DollarSign size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input 
                            type="number"
                            value={editValues.salary}
                            onChange={e => setEditValues({ ...editValues, salary: Number(e.target.value) })}
                            className="bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-xs font-black text-white w-20 focus:border-indigo-500 outline-none transition-all"
                          />
                        </div>
                        <div className="relative">
                          <Percent size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input 
                            type="number"
                            value={editValues.commission}
                            onChange={e => setEditValues({ ...editValues, commission: Number(e.target.value) })}
                            className="bg-white/5 border border-white/10 rounded-lg py-1 pl-6 pr-2 text-xs font-black text-white w-16 focus:border-indigo-500 outline-none transition-all"
                          />
                        </div>
                        <button onClick={() => saveEdit(c.id)} className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-90">
                           <Check size={14} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-lg shadow-lg shadow-rose-500/20 transition-all active:scale-90">
                           <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between group/cell max-w-[180px]">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-white uppercase tracking-tight italic">AED {c.salary} BASE</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">{c.commission}% COMMISSION</span>
                        </div>
                        <button 
                          onClick={() => startEdit(c)}
                          className="p-2 opacity-0 group-hover:opacity-100 group-hover/cell:bg-white/10 text-slate-500 hover:text-indigo-400 rounded-lg transition-all"
                        >
                           <Edit2 size={12} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${c.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${c.status === "active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
