"use client";

import React from "react";
import { Award, Zap, Shield, Star, Flame, Target } from "lucide-react";

const badges = [
  { 
    id: 1, 
    name: "Consistency King", 
    description: "Attended 5 sessions in a row without a single absence.",
    icon: Flame, 
    color: "rose", 
    rarity: "Epic",
    date: "Apre 15, 2026"
  },
  { 
    id: 2, 
    name: "Stroke Master", 
    description: "Perfect butterfly technique verified by AI analysis.",
    icon: Target, 
    color: "indigo", 
    rarity: "Rare",
    date: "Apr 10, 2026"
  },
  { 
    id: 3, 
    name: "Early Bird", 
    description: "Arrived at least 15 minutes early for 3 morning sessions.",
    icon: Zap, 
    color: "amber", 
    rarity: "Common",
    date: "Mar 28, 2026"
  },
  { 
    id: 4, 
    name: "Team Guardian", 
    description: "Demonstrated exceptional leadership during group drills.",
    icon: Shield, 
    color: "emerald", 
    rarity: "Legendary",
    date: "Mar 15, 2026"
  }
];

export default function BadgeGallery() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className="relative group overflow-hidden">
            <div className={`p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-${badge.color}-500/30 transition-all duration-500 backdrop-blur-xl`}>
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-${badge.color}-500/20 flex items-center justify-center text-${badge.color}-400 shadow-lg shadow-${badge.color}-500/10 group-hover:scale-110 transition-transform duration-500`}>
                   <badge.icon size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-lg font-black text-white uppercase tracking-tight">{badge.name}</h4>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-${badge.color}-500/10 text-${badge.color}-400 border border-${badge.color}-500/20`}>
                      {badge.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                    {badge.description}
                  </p>
                  <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                    Earned on {badge.date}
                  </div>
                </div>
              </div>
              
              {/* Decorative Glow */}
              <div className={`absolute -top-12 -right-12 w-24 h-24 bg-${badge.color}-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          </div>
        ))}
      </div>

      {/* Progress to Next Badge */}
      <div className="card p-8 bg-slate-900 border-dashed border-slate-800">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-indigo-500 border-r-indigo-500 flex items-center justify-center relative">
            < Award size={40} className="text-indigo-400 opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center font-black text-white text-xl">75%</div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Next Milestone: Centurion</h3>
            <p className="text-sm text-slate-400 mt-1">Complete <span className="text-white font-bold">100 total hours</span> of training to unlock the Centurion badge. You are only 12 hours away!</p>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 w-3/4 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            </div>
          </div>
          <button className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-white hover:bg-white/10 transition-all">
             View All Goals
          </button>
        </div>
      </div>
    </div>
  );
}
