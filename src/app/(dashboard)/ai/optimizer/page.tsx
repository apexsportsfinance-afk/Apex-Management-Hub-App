"use client";

import { Brain, CalendarCheck, Lightbulb, Sparkles, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const optimizationData = [
  { time: "14:00", capacity: 40, attendance: 35, demandScore: 45 },
  { time: "15:00", capacity: 60, attendance: 55, demandScore: 68 },
  { time: "16:00", capacity: 80, attendance: 78, demandScore: 92 },
  { time: "17:00", capacity: 100, attendance: 95, demandScore: 98 },
  { time: "18:00", capacity: 100, attendance: 90, demandScore: 85 },
  { time: "19:00", capacity: 80, attendance: 65, demandScore: 70 },
  { time: "20:00", capacity: 60, attendance: 30, demandScore: 40 },
];

const recommendations = [
  {
    id: 1,
    title: "High Demand at 16:00 - 18:00 (Court 1 & 2)",
    insight: "Attendance is consistently >90%. Adding a 17:30 slot for U12 Tennis would capture overflow demand.",
    impact: "+AED 8,500/mo estimated revenue",
    type: "positive",
    confidence: 96,
  },
  {
    id: 2,
    title: "Low Yield at 20:00 (Gym A)",
    insight: "Senior fitness classes at 20:00 rarely exceed 50% capacity. Consider moving this to 19:00 or consolidating classes.",
    impact: "Save AED 3,200/mo in overhead",
    type: "warning",
    confidence: 88,
  },
  {
    id: 3,
    title: "Venue Utilization Gap (Pool)",
    insight: "The swimming pool is completely empty on Thursday mornings. A 'Mom & Baby' introductory class has 78% success rate in similar venues.",
    impact: "Utilize 4 hours of dead-time",
    type: "opportunity",
    confidence: 91,
  }
];

export default function AIOptimizerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2500);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Brain size={20} />
            </div>
            AI Scheduling Optimizer
          </h1>
          <p className="page-subtitle mt-2">Predictive logistics and revenue maximization strategies</p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="btn btn-primary shadow-lg shadow-indigo-500/20"
          style={{ background: "linear-gradient(to right, #6366f1, #a855f7)", border: "none" }}
        >
          {isAnalyzing ? (
            <><Sparkles size={14} className="animate-spin" /> Analyzing 44,000+ points...</>
          ) : (
            <><Brain size={14} /> Run Deep Analysis</>
          )}
        </button>
      </div>

      {!showResults && !isAnalyzing && (
        <div className="card text-center py-24 border-dashed border-2 border-slate-700 bg-slate-800/20">
          <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles size={32} className="text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Ready to Optimize the Next Term?</h3>
          <p className="text-slate-400 max-w-lg mx-auto mb-8">
            Our AI engine will analyze historical attendance, coach performance, and venue utilization across 44,000+ records to suggest the most profitable schedule adjustments.
          </p>
          <button 
            onClick={runAnalysis}
            className="btn btn-primary py-3 px-8 text-sm font-bold shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(to right, #6366f1, #a855f7)", border: "none" }}
          >
            Start AI Engine
          </button>
        </div>
      )}

      {(isAnalyzing || showResults) && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="grid-3 mb-6">
            <div className="card shadow-lg shadow-indigo-500/5" style={{ borderColor: "rgba(99,102,241,0.2)" }}>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={18} className="text-indigo-400" />
                <span className="font-bold text-slate-300">Revenue Potential</span>
              </div>
              <div className="text-3xl font-extrabold text-white">
                {isAnalyzing ? <div className="h-9 w-32 bg-slate-700 animate-pulse rounded"></div> : "+AED 14K /mo"}
              </div>
              <p className="text-sm text-slate-500 mt-2">Estimated uplift from optimized slots</p>
            </div>
            
            <div className="card shadow-lg shadow-emerald-500/5" style={{ borderColor: "rgba(16,185,129,0.2)" }}>
              <div className="flex items-center gap-3 mb-2">
                <CalendarCheck size={18} className="text-emerald-400" />
                <span className="font-bold text-slate-300">Target Fill Rate</span>
              </div>
              <div className="text-3xl font-extrabold text-white">
                {isAnalyzing ? <div className="h-9 w-24 bg-slate-700 animate-pulse rounded"></div> : "92%"}
              </div>
              <p className="text-sm text-slate-500 mt-2">Up from 74% current average</p>
            </div>

            <div className="card shadow-lg shadow-amber-500/5" style={{ borderColor: "rgba(245,158,11,0.2)" }}>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle size={18} className="text-amber-400" />
                <span className="font-bold text-slate-300">Inefficient Slots</span>
              </div>
              <div className="text-3xl font-extrabold text-white">
                {isAnalyzing ? <div className="h-9 w-16 bg-slate-700 animate-pulse rounded"></div> : "12"}
              </div>
              <p className="text-sm text-slate-500 mt-2">Classes running &lt;40% capacity</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Visual AI Analysis Chart */}
            <div className="card lg:col-span-2 relative overflow-hidden">
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-3 h-3 bg-fuchsia-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <div className="text-indigo-400 font-bold mt-4 text-sm tracking-widest uppercase">Crunching Neural Net</div>
                </div>
              )}
              
              <div className="section-header">
                <span className="section-title">
                  <BarChart size={14} /> Demand vs. Time Correlation
                </span>
              </div>
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={optimizationData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#fff" }}
                    />
                    <Bar dataKey="attendance" name="Avg Attendance" radius={[4, 4, 0, 0]}>
                      {optimizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.demandScore > 80 ? '#6366f1' : entry.demandScore > 50 ? '#818cf8' : '#334155'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insights Engine Sidebar */}
            <div className="card relative overflow-hidden flex flex-col">
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                  <Sparkles size={24} className="text-amber-400 animate-pulse mb-4" />
                  <div className="text-amber-400 font-bold text-sm tracking-widest uppercase text-center px-6">Generating Insights</div>
                </div>
              )}

              <div className="section-header">
                <span className="section-title text-fuchsia-400 flex items-center gap-2">
                  <Sparkles size={14} /> AI Recommendations
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-xl" style={{
                    background: rec.type === 'positive' ? 'rgba(99,102,241,0.05)' : rec.type === 'warning' ? 'rgba(244,63,94,0.05)' : 'rgba(16,185,129,0.05)',
                    border: `1px solid ${rec.type === 'positive' ? 'rgba(99,102,241,0.2)' : rec.type === 'warning' ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)'}`
                  }}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-slate-200 text-sm leading-tight flex-1 pr-4">{rec.title}</h4>
                      <div className="text-xs font-bold px-2 py-1 bg-slate-800 rounded text-slate-400 whitespace-nowrap">{rec.confidence}% Conf</div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {rec.insight}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className={`text-xs font-bold ${rec.type === 'positive' ? 'text-indigo-400' : rec.type === 'warning' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {rec.impact}
                      </span>
                      <button className="text-slate-400 hover:text-white transition-colors">
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </>
  );
}
