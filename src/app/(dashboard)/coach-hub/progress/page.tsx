"use client";

import { CheckCircle2, History, MessageSquare, Plus, Star } from "lucide-react";
import { useState } from "react";

const mockAthletes = [
  { id: "A-001", name: "Emma Watson", sport: "Swimming", level: "Intermediate" },
  { id: "A-002", name: "Ryan Park", sport: "Tennis", level: "Advanced" },
  { id: "A-003", name: "Lina Chen", sport: "Football", level: "Beginner" },
];

const mockHistory = [
  { id: 1, week: "Week 3 (Term 2)", score: 4, notes: "Improved kick technique, needs to practice breathing rhythm.", submittedAt: "14/04/26" },
  { id: 2, week: "Week 2 (Term 2)", score: 4, notes: "Good energy, struggling slightly with butterfly stroke.", submittedAt: "07/04/26" },
  { id: 3, week: "Week 1 (Term 2)", score: 5, notes: "Strong start to the term, great attendance.", submittedAt: "30/03/26" },
];

export default function WeeklyProgressPage() {
  const [selectedAthlete, setSelectedAthlete] = useState(mockAthletes[0].id);
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const athlete = mockAthletes.find(a => a.id === selectedAthlete);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setScore(0);
      setNotes("");
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Weekly Progress Logs</h1>
          <p className="page-subtitle">Track athlete development to power the AI Monthly Reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Logging Form */}
        <div className="card lg:col-span-2">
          <div className="section-header">
            <span className="section-title text-indigo-400">
              <Plus size={16} /> New Weekly Entry
            </span>
          </div>

          <div className="mb-6">
            <label className="filter-label block mb-2">Select Athlete</label>
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              value={selectedAthlete}
              onChange={(e) => setSelectedAthlete(e.target.value)}
            >
              {mockAthletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.sport})</option>)}
            </select>
          </div>

          <div className="mb-6">
            <label className="filter-label block mb-2">Weekly Performance Score (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setScore(num)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
                    score === num 
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-110' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-amber-500/50 hover:text-amber-500'
                  }`}
                >
                  {num} <Star size={12} className={`ml-1 ${score === num ? 'fill-white' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="filter-label block mb-2">
              Coach Notes (Bullet Points)
              <span className="text-xs text-slate-500 ml-2 font-normal">Will be processed by the AI Progress Engine</span>
            </label>
            <textarea 
              rows={4}
              placeholder="- Mastered backhand return\n- Needs to improve footwork\n- Very enthusiastic"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono text-sm leading-relaxed"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || score === 0 || !notes}
              className="btn btn-primary py-3 px-8 text-sm disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Progress Log"}
            </button>
            {isSuccess && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold animate-in fade-in zoom-in slide-in-from-left-4">
                <CheckCircle2 size={16} /> Log recorded!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: History */}
        <div className="card bg-slate-900/50">
          <div className="section-header">
            <span className="section-title text-slate-400 flex items-center gap-2">
              <History size={16} /> Log History for {athlete?.name.split(" ")[0]}
            </span>
          </div>
          
          <div className="space-y-4">
            {mockHistory.map(entry => (
              <div key={entry.id} className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-slate-200 text-sm">{entry.week}</div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < entry.score ? "text-amber-500 fill-amber-500" : "text-slate-600"} />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-slate-400 leading-relaxed bg-slate-900/50 p-2 rounded relative">
                  <MessageSquare size={12} className="absolute top-2.5 left-2 text-slate-500" />
                  <span className="pl-5 block">{entry.notes}</span>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-bold tracking-wider mt-2 uppercase">
                  Logged: {entry.submittedAt}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <div className="text-2xl font-black text-white mb-1">
              3<span className="text-slate-500 font-normal text-sm"> / 4</span>
            </div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Logs this month</div>
            <div className="mt-3 text-xs text-indigo-400 leading-tight">
              1 more log needed before AI Monthly Report generation triggers.
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
