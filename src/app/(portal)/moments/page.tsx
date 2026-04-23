"use client";

import { Award, BarChart3, Calendar, Camera, ChevronRight, FileText, Heart, MapPin, MessageSquare, Star, TrendingUp, Zap, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import BadgeGallery from "@/components/BadgeGallery";

const athleteData = {
  name: "Emma Watson",
  sport: "Swimming",
  level: "Intermediate Block 2",
  coach: "Coach Sarah",
  attendance: "92%",
  lastLog: "Showing great consistency in butterfly stroke rhythm.",
  rank: 12,
  nextClass: "Tue, Apr 23 @ 5:00 PM",
  location: "Hamdan Sports Complex",
  photos: [
    { id: 1, url: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80&w=400", caption: "Mastering the dive" },
    { id: 2, url: "https://images.unsplash.com/photo-1542461927-10576624536d?auto=format&fit=crop&q=80&w=400", caption: "Relay practice" },
    { id: 3, url: "https://images.unsplash.com/photo-1530549387631-f535c763b9df?auto=format&fit=crop&q=80&w=400", caption: "Morning laps" },
  ]
};

import { Suspense } from "react";

function MomentsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "feed");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam.toLowerCase());
    }
  }, [tabParam]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-indigo-500/30 p-1">
             <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-4xl font-black text-indigo-400">
               EW
             </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-2 border-4 border-slate-950 shadow-lg">
             <Star size={16} className="text-white fill-current" />
          </div>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
            <h1 className="text-4xl font-black text-white tracking-tight">{athleteData.name}</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-widest">
              PRO ACCESS
            </span>
          </div>
          <p className="text-slate-400 text-lg flex items-center justify-center md:justify-start gap-2">
            Elite {athleteData.sport} • {athleteData.coach} • <MapPin size={16} /> {athleteData.location}
          </p>
        </div>

        <div className="flex gap-4">
           <div className="text-center px-6 border-r border-slate-800">
             <div className="text-2xl font-black text-white">{athleteData.attendance}</div>
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Attendance</div>
           </div>
           <div className="text-center px-6">
             <div className="text-2xl font-black text-indigo-400">#{athleteData.rank}</div>
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Academy Rank</div>
           </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-8 border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar">
         {['Feed', 'Progress', 'Milestones', 'Competitions', 'Attendance', 'Billing'].map((tab) => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab.toLowerCase())}
             className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab.toLowerCase() ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
           >
             {tab}
             {activeTab === tab.toLowerCase() && (
               <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full"></div>
             )}
           </button>
         ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Span: Feed/Content */}
        <div className="lg:col-span-2 space-y-8">
           {activeTab === 'feed' && (
             <>
               {/* Last Coach Log Card */}
               <div className="card bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">Coach's Weekly Note</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">3 Days Ago</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed italic pr-8">
                    "{athleteData.lastLog}"
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                     <div className="flex -space-x-2">
                        {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-indigo-400 fill-current" />)}
                     </div>
                     <button className="text-xs font-black text-indigo-400 hover:text-indigo-300 underline uppercase tracking-widest">
                       View Full Journal
                     </button>
                  </div>
               </div>

               {/* Moments Gallery */}
               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Camera size={20} className="text-slate-400" /> Recent Moments
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {athleteData.photos.map(photo => (
                       <div key={photo.id} className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-800">
                          <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
                          <div className="absolute bottom-4 left-4">
                             <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Training Session</div>
                             <div className="text-white font-bold">{photo.caption}</div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             </>
           )}

           {activeTab === 'competitions' && (
             <div className="space-y-6">
               <div className="card bg-slate-900 border-indigo-500/20 p-8 text-center">
                 < Award size={48} className="text-indigo-400 mx-auto mb-4" />
                 <h2 className="text-2xl font-black text-white">Active Competitions</h2>
                 <p className="text-slate-400">Select an event below to register your child.</p>
               </div>
               
               <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 1, title: "Dubai Spring Open 2026", date: "May 15-16", price: "250 AED", status: "Open" },
                    { id: 2, title: "Academy Invitational", date: "June 02", price: "150 AED", status: "Closing Soon" }
                  ].map(comp => (
                    <div key={comp.id} className="card p-6 flex items-center justify-between hover:border-indigo-500/40 transition-all cursor-pointer">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${comp.status === 'Open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {comp.status}
                          </span>
                          <span className="text-xs font-bold text-slate-500 uppercase">{comp.date}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white">{comp.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">Registration includes event kit and digital certificate.</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-white mb-2">{comp.price}</div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-lg transition-colors uppercase tracking-widest">
                          Register Now
                        </button>
                      </div>
                    </div>
                  ))}
               </div>
             </div>
           )}

           {activeTab === 'milestones' && (
             <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Athlete Achievements</h3>
                 <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest">
                   <Star size={16} className="fill-current" /> 4 Badges Earned
                 </div>
               </div>
               <BadgeGallery />
             </div>
           )}

           {['progress', 'attendance', 'billing'].includes(activeTab) && (
             <div className="card flex flex-col items-center justify-center py-20 text-slate-500 space-y-4">
                <BarChart3 size={48} className="opacity-10" />
                <div className="font-bold uppercase tracking-widest text-sm">Detailed {activeTab} coming soon</div>
                <p className="text-xs text-slate-600 max-w-xs text-center">We're finalizing the high-fidelity visualizations for historical {activeTab} data.</p>
             </div>
           )}
        </div>

        {/* Right Span: Utility Widgets */}
        <div className="space-y-6">
           {/* Next Session Widget */}
           <div className="card p-6 bg-slate-800/40 border-slate-700/50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-700 pb-2">Next Session</h4>
              <div className="flex items-start gap-4 mb-6">
                 <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center leading-none">
                    <div className="text-indigo-400 font-bold mb-1">TUE</div>
                    <div className="text-white font-black text-xs uppercase">23</div>
                 </div>
                 <div>
                    <div className="text-lg font-black text-white leading-tight">Elite Stroke 02</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 uppercase tracking-tight">
                       <MapPin size={10} /> Hamdan Sports Complex
                    </div>
                 </div>
              </div>
              <button className="btn btn-primary w-full py-3 text-xs font-black" style={{ background: "linear-gradient(to right, #6366f1, #a855f7)", border: "none" }}>
                 JOIN VIDEO CALL (IF ACTIVE)
              </button>
           </div>

           {/* Quick Stats Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div className="card p-4 text-center">
                 <Award size={20} className="mx-auto mb-2 text-amber-400" />
                 <div className="text-sm font-bold text-white">4</div>
                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-none mt-1">Badges</div>
              </div>
              <div className="card p-4 text-center">
                 <TrendingUp size={20} className="mx-auto mb-2 text-emerald-400" />
                 <div className="text-sm font-bold text-white">Top 5%</div>
                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-none mt-1">Stamina</div>
              </div>
           </div>

           {/* Progress Package Health */}
           <div className="card p-6 bg-gradient-to-br from-indigo-600/20 to-transparent border-indigo-500/30">
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Package Status</h4>
                 <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">In Credit</span>
              </div>
              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between mb-1">
                       <span className="text-xs font-bold text-white">Sessions Remaining</span>
                       <span className="text-xs font-black text-white">8 / 12</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 rounded-full w-[66%]"></div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Renewal Date</div>
                    <div className="text-[10px] text-white font-black uppercase tracking-tight">May 12, 2026</div>
                 </div>
              </div>
           </div>

           {/* Health Compliance */}
           <div className="card p-5 border-l-4 border-emerald-500 bg-emerald-500/5">
              <div className="flex items-center gap-3">
                 <Heart size={18} className="text-emerald-500" />
                 <div>
                    <div className="text-xs font-black text-white uppercase tracking-widest">Medical Clearance</div>
                    <div className="text-[11px] text-emerald-400 font-bold mt-0.5 uppercase tracking-tight">Status: Active & Secure</div>
                 </div>
              </div>
           </div>

           {/* Support Button */}
           <div className="text-center">
              <button className="text-xs font-black text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto">
                 Need Help? Contact Front Desk <ChevronRight size={14} />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

export default function MomentsPortalPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-500 uppercase tracking-widest font-black">Loading Portal Experience...</div>}>
      <MomentsContent />
    </Suspense>
  );
}
