"use client";

import { BrainCircuit, CheckCircle2, FileText, Send, Sparkles, UserCircle } from "lucide-react";
import { useState } from "react";

const athletes = [
  { id: "A-001", name: "Emma Watson", sport: "Swimming", level: "Intermediate", coach: "Anna Brown" },
  { id: "A-002", name: "Ryan Park", sport: "Tennis", level: "Advanced", coach: "Mike Torres" },
  { id: "A-003", name: "Lina Chen", sport: "Football", level: "Beginner", coach: "John Parker" },
];

export default function AIProgressEnginePage() {
  const [selectedAthlete, setSelectedAthlete] = useState(athletes[0].id);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const athlete = athletes.find(a => a.id === selectedAthlete);

  const handleGenerate = () => {
    if (!prompt || !athlete) return;
    setIsGenerating(true);
    setIsSent(false);

    setTimeout(() => {
      setIsGenerating(false);
      
      const lowerPrompt = prompt.toLowerCase();
      const needsHelp = lowerPrompt.includes("improvement") || lowerPrompt.includes("bad") || lowerPrompt.includes("needs") || lowerPrompt.includes("struggle") || lowerPrompt.includes("tired");
      
      // Clean up the prompt to insert as a natural list or sentence if needed, though we will just synthesize it
      const rawPoints = prompt.split('\\n').map(p => p.replace(/^-/, '').trim()).filter(Boolean);
      const pointsFormatted = rawPoints.length > 1 
        ? "Specifically, we noted: \\n• " + rawPoints.join("\\n• ") 
        : rawPoints[0] ? "Specifically: " + rawPoints[0] : "";

      let draft = "";

      if (needsHelp) {
        draft = `Dear ${athlete.name.split(" ")[1]} Family,

I hope this finds you well. I wanted to share a quick update on ${athlete.name.split(" ")[0]}'s progress in ${athlete.sport} this term.

${athlete.name.split(" ")[0]} has been attending sessions consistently, but there are a few areas we are actively working on to help them reach the next level. ${pointsFormatted}

We will be placing extra emphasis on these fundamental areas during the upcoming sessions to build their confidence. With a little extra practice, I know we will see great improvement.

Thank you for your ongoing partnership. 

Warm regards,
Coach ${athlete.coach}
Apex Sports Management`;

      } else {
        draft = `Dear ${athlete.name.split(" ")[1]} Family,

I'm thrilled to share an update on ${athlete.name.split(" ")[0]}'s progress in ${athlete.sport} this term. 

Over the last few weeks, ${athlete.name.split(" ")[0]} has shown tremendous dedication and skill development. ${pointsFormatted}

They consistently bring great energy to the sessions and are quickly mastering the ${athlete.level.toLowerCase()} techniques. Next term, we'll focus on advancing these skills to further elevate their performance.

Thank you for your ongoing support. We love having ${athlete.name.split(" ")[0]} at Apex Sports!

Warm regards,
Coach ${athlete.coach}
Apex Sports Management`;
      }

      setGeneratedReport(draft);
    }, 2500);
  };

  const handleSend = () => {
    setIsSent(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/20">
              <BrainCircuit size={20} />
            </div>
            AI Progress Engine
          </h1>
          <p className="page-subtitle mt-2">Transform raw coach notes into beautiful parent updates instantly</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Input Form */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Coach Input</span>
          </div>
          
          <div className="mb-4">
            <label className="filter-label block mb-2">Select Athlete</label>
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              value={selectedAthlete}
              onChange={(e) => setSelectedAthlete(e.target.value)}
            >
              {athletes.map(a => <option key={a.id} value={a.id}>{a.name} ({a.sport})</option>)}
            </select>
          </div>

          {athlete && (
            <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 mb-6">
              <div className="w-12 h-12 bg-slate-700 text-slate-300 rounded-full flex items-center justify-center font-bold text-xl">
                {athlete.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-white leading-tight">{athlete.name}</div>
                <div className="text-sm text-slate-400 mt-1">{athlete.level} • {athlete.sport}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-xs text-slate-500">Assigned Coach</div>
                <div className="text-sm font-bold text-slate-300">{athlete.coach}</div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="filter-label block mb-2">
              Bullet Point Observations
              <span className="text-xs text-slate-500 font-normal ml-2">(e.g. "improved backstroke", "great stamina")</span>
            </label>
            <textarea 
              rows={5}
              placeholder="- Much improved dive timing
- Good energy but gets tired near the end
- Needs to practice breathing on left side"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors font-mono text-sm"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full btn btn-primary py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(to right, #d946ef, #e11d48)", border: "none" }}
          >
            {isGenerating ? (
              <><Sparkles size={16} className="animate-spin" /> Drafting Professional Report...</>
            ) : (
              <><BrainCircuit size={16} /> Generate AI Report</>
            )}
          </button>
        </div>

        {/* Output Preview */}
        <div className="card relative flex flex-col">
          <div className="section-header">
            <span className="section-title text-fuchsia-400 flex items-center gap-2">
              <FileText size={16} /> Generated Parent Report
            </span>
          </div>

          <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-800 p-6 relative overflow-hidden">
            {isGenerating && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                <Sparkles size={32} className="text-fuchsia-400 animate-pulse mb-4" />
                <div className="text-fuchsia-400 font-bold tracking-widest text-sm uppercase">Synthesizing Coach Notes</div>
              </div>
            )}

            {!generatedReport && !isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <UserCircle size={48} className="mb-4 opacity-50" />
                <p>Awaiting coach input to generate report...</p>
              </div>
            ) : (
              <div className="h-full overflow-y-auto pr-2 space-y-4">
                <div className="flex gap-2 items-center text-slate-400 text-xs mb-4 pb-4 border-b border-slate-800">
                  <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">Tone: Encouraging & Professional</span>
                  <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">Format: Email</span>
                </div>
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                  {generatedReport}
                </div>
              </div>
            )}
          </div>

          {generatedReport && !isGenerating && (
            <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-end">
              {isSent ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold mr-auto">
                  <CheckCircle2 size={16} /> Sent to Parent App
                </div>
              ) : (
                <button 
                  onClick={handleSend}
                  className="btn btn-secondary bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border-indigo-600/30"
                >
                  <Send size={14} /> Distribute to Parent
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </>
  );
}
