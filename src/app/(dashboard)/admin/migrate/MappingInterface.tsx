"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Database,
  ArrowLeft,
  ChevronDown,
  Trash2,
  Save,
  UserCheck,
  Building2,
  Clock,
  Loader2
} from "lucide-react";
import { ParsedSession } from "@/lib/migration/timetable-parser";
import { processMigrationBatch } from "@/app/actions/migration";


interface Props {
  sessions: ParsedSession[];
  onCancel: () => void;
  onConfirm: (finalData: any[]) => void;
}

export default function MappingInterface({ sessions, onCancel, onConfirm }: Props) {
  const [data, setData] = useState<ParsedSession[]>(sessions);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Mocked Existing Records for Mapping
  const existingCoaches = ["Mike Torres", "Sarah Kim", "Anna Brown", "John Parker", "Ash", "Kyle", "Medhat", "Michelle"];
  const existingVenues = ["DHA", "NLCS", "HIS", "HSC"];

  const updateCell = (index: number, field: keyof ParsedSession, value: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    setData(updated);
  };

  const removeRow = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const handleFinalize = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const result = await processMigrationBatch('schedule', data);
      if (result.success) {
        setSaveStatus({ type: 'success', msg: `Successfully synced ${result.count} records to database.` });
        setTimeout(() => onConfirm(data), 2000);
      }
    } catch (error) {
      setSaveStatus({ type: 'error', msg: 'Database synchronization failed. Check logs.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={onCancel} 
          disabled={isSaving}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest disabled:opacity-50"
        >
          <ArrowLeft size={14} /> Back to Upload
        </button>
        <div className="flex gap-3">
          <button 
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all disabled:opacity-50"
          >
             Reset Changes
          </button>
          <button 
            onClick={handleFinalize}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95 disabled:bg-slate-800 disabled:text-slate-500"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Synthesizing...
              </>
            ) : (
              <>
                <Save size={14} /> Finalize Import ({data.length} Sessions)
              </>
            )}
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
          saveStatus.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
           {saveStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
           <span className="text-xs font-bold uppercase tracking-tight">{saveStatus.msg}</span>
        </div>
      )}


      <div className="card overflow-hidden border-white/5 bg-slate-900/50 p-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <div>
             <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
               <Database size={16} className="text-indigo-400" />
               Raw Data Reconciliation
             </h3>
             <p className="text-[10px] text-slate-500 mt-1 font-bold italic">Review and map legacy strings to active system entities</p>
           </div>
           <div className="flex gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-black uppercase">
                <CheckCircle2 size={10} /> {data.length} Validated
             </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-white/[0.02]">
                 <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 w-12">#</th>
                 <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Squad Level</th>
                 <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5"><UserCheck size={10} className="inline mr-1" /> Coach Mapping</th>
                 <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5"><Building2 size={10} className="inline mr-1" /> Venue Mapping</th>
                 <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5"><Clock size={10} className="inline mr-1" /> Time Block</th>
                 <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
               {data.map((item, idx) => (
                 <tr key={idx} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="p-4 text-[10px] font-bold text-slate-600">{idx + 1}</td>
                    <td className="p-4">
                      <input 
                        value={item.level} 
                        onChange={(e) => updateCell(idx, 'level', e.target.value)}
                        className="bg-transparent border-none text-xs font-bold text-slate-200 w-full focus:outline-none focus:text-indigo-400 transition-colors"
                      />
                    </td>
                    <td className="p-4">
                      <div className="relative group/select">
                        <select 
                          value={item.coach}
                          onChange={(e) => updateCell(idx, 'coach', e.target.value)}
                          className="bg-white/5 border border-white/10 text-xs font-bold text-white py-1 px-3 pr-8 rounded-lg appearance-none w-full hover:border-indigo-500/50 transition-all outline-none"
                        >
                          {existingCoaches.map(c => <option key={c} value={c}>{c}</option>)}
                          {!existingCoaches.includes(item.coach) && <option value={item.coach}>{item.coach} (New)</option>}
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="relative group/select">
                        <select 
                          value={item.venue}
                          onChange={(e) => updateCell(idx, 'venue', e.target.value)}
                          className="bg-white/5 border border-white/10 text-xs font-bold text-white py-1 px-3 pr-8 rounded-lg appearance-none w-full hover:border-indigo-500/50 transition-all outline-none"
                        >
                          {existingVenues.map(v => <option key={v} value={v}>{v}</option>)}
                          {!existingVenues.includes(item.venue) && <option value={item.venue}>{item.venue} (New)</option>}
                        </select>
                        <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" />
                      </div>
                    </td>
                    <td className="p-4">
                       <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-indigo-400 monospace bg-indigo-400/5 px-2 py-0.5 rounded border border-indigo-400/10 italic">
                           {item.startTime} - {item.endTime}
                         </span>
                       </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => removeRow(idx)}
                        className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-6 bg-indigo-600/5 border border-indigo-600/10 rounded-3xl flex items-center justify-between">
         <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400">
               <AlertCircle size={20} />
            </div>
            <div>
               <h4 className="text-sm font-bold text-white">Review Summary</h4>
               <p className="text-xs text-slate-400 font-medium italic">We detected **{data.length}** valid session blocks. Make sure to map all "New" items to existing profiles where possible.</p>
            </div>
         </div>
         <button className="text-indigo-400 text-xs font-black uppercase tracking-widest hover:underline">
            Download Conflict Report
         </button>
      </div>
    </div>
  );
}
