"use client";

import { useState } from "react";
import { 
  Upload, 
  FileText, 
  Table as TableIcon, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Database,
  Search,
  RefreshCw,
  X,
  LineChart,
  UserCheck,
  CreditCard
} from "lucide-react";
import { classifySheetHeaders, MigrationTarget } from "@/lib/migration/classifier";
import { parseSquadTimetable, ParsedSession } from "@/lib/migration/timetable-parser";
import { processRawTextWithAI, AIExtractedResult } from "@/lib/migration/ai-extractor";
import MappingInterface from "./MappingInterface";
import { Sparkles, Loader2, FileSearch } from "lucide-react";



export default function MigrationHub() {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [view, setView] = useState<'upload' | 'mapping'>('upload');
  const [activeSessions, setActiveSessions] = useState<ParsedSession[]>([]);
  const [files, setFiles] = useState<{ 
    name: string; 
    type: string; 
    target: MigrationTarget;
    confidence: number;
    status: 'ready' | 'processing' | 'done' 
  }[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      if (!data) return;

      // Dynamic import for xlsx to ensure build safety
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      // Extract Headers
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const headers = (json[0] as string[]) || [];

      const { target, confidence } = classifySheetHeaders(headers);
      
      // Auto-parse if it's a schedule
      if (target === 'schedule') {
         // In a real scenario, we would use sheet_to_csv and pass to our text parser
         const rawText = XLSX.utils.sheet_to_txt(sheet);
         setActiveSessions(parseSquadTimetable(rawText));
      }

      setFiles(prev => [...prev, { 
        name: file.name, 
        type: file.name.endsWith('.pdf') ? 'PDF' : 'Excel', 
        target,
        confidence,
        status: 'ready' 
      }]);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };


  if (view === 'mapping') {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Data Mapping</h1>
          <p className="text-slate-400 mt-1 font-medium italic">Resolving legacy data conflicts for **{activeSessions.length}** records</p>
        </div>
        <MappingInterface 
          sessions={activeSessions} 
          onCancel={() => setView('upload')}
          onConfirm={(final) => {
            console.log("Saving to DB:", final);
            setView('upload');
            // Show success toast logic would go here
          }}
        />
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Migration Hub</h1>
          <p className="text-slate-400 mt-1 font-medium italic">Transforming legacy Okra data into Apex High-Performance Models</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-all">
            <RefreshCw size={14} /> Clear Cache
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Zone */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative group border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all duration-500 ${
              dragActive 
                ? "border-indigo-500 bg-indigo-500/5 scale-[0.99] shadow-2xl shadow-indigo-500/10" 
                : "border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.02]"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload className="text-indigo-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Drop your legacy files here</h3>
            <p className="text-slate-400 text-center max-w-sm mb-6 leading-relaxed">
              Upload your **Okra Excel exports** or **PDF Timetables**. We'll automatically identify the content.
            </p>
            <div className="flex gap-4">
               <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl shadow-lg shadow-indigo-600/20 transition-all">
                 Browse Files
               </button>
            </div>
            
            {/* Glow Decorative */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-3xl" />
          </div>

          {/* Active Queue */}
          {files.length > 0 && (
            <div className="card border-white/5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Queue</h4>
                <span className="text-[10px] text-slate-600">{files.length} items detected</span>
              </div>
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${file.type === 'PDF' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {file.type === 'PDF' ? <FileSearch size={18} /> : <TableIcon size={18} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-200">{file.name}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                          file.target === 'payment' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          file.target === 'athlete' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                          file.target === 'schedule' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                          {file.target} DATA
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
                          {isProcessingAI ? (
                            <span className="flex items-center gap-1 text-indigo-400 animate-pulse">
                              <Loader2 size={10} className="animate-spin" /> AI SCANNING...
                            </span>
                          ) : (
                            <>
                              <Sparkles size={10} className="text-indigo-400" />
                              {file.confidence}% AI Confidence
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {file.type === 'PDF' && (
                      <button 
                        onClick={() => {
                          setIsProcessingAI(true);
                          setTimeout(() => setIsProcessingAI(false), 2000);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all hover:bg-slate-700"
                      >
                        AI Re-Scan
                      </button>
                    )}
                    <button 
                      onClick={() => setView('mapping')}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all group-hover:scale-105 active:scale-95"
                    >
                      Start Mapping <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar / Stats */}
        <div className="space-y-6">
          <div className="card border-white/5 bg-gradient-to-br from-slate-900 to-indigo-950/20">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-indigo-400" size={20} />
              <h4 className="text-sm font-black text-white uppercase tracking-widest">System Readiness</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-slate-400">Target DB</span>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">PostgreSQL</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-xs text-slate-400">Schema Sync</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">Healthy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">AI Extractor</span>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">v4.2 Active</span>
              </div>
            </div>
          </div>

          <div className="card bg-amber-500/5 border-amber-500/10">
            <div className="flex gap-3">
              <AlertCircle className="text-amber-500 shrink-0" size={18} />
              <div>
                <h5 className="text-[11px] font-black text-amber-500 uppercase tracking-widest mb-1">Pre-Migration Advice</h5>
                <p className="text-[11px] text-amber-500/70 leading-relaxed font-medium">
                  Ensure all Excel files have clear headers. PDF schedules should be high-resolution for optimal AI extraction.
                </p>
              </div>
            </div>
          </div>

          <div className="card border-indigo-500/20 bg-indigo-500/[0.02]">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Parsing History</h4>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-3 opacity-60">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5" />
                   <div>
                     <div className="text-[11px] text-slate-300 font-bold">nlcs_autumn_2020.xlsx</div>
                     <div className="text-[9px] text-slate-500">Imported 1,240 records • Apr 15</div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
