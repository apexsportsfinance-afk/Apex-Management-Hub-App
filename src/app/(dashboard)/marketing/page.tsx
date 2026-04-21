"use client";

import { BarChart, Search, Target, TrendingUp, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: 'Jan', Meta: 4000, Google: 2400 },
  { name: 'Feb', Meta: 3000, Google: 1398 },
  { name: 'Mar', Meta: 2000, Google: 9800 },
  { name: 'Apr', Meta: 2780, Google: 3908 },
  { name: 'May', Meta: 1890, Google: 4800 },
  { name: 'Jun', Meta: 2390, Google: 3800 },
  { name: 'Jul', Meta: 3490, Google: 4300 },
];

const campaigns = [
  { id: 1, name: "Summer Swim Intensive", channel: "Meta Ads", spend: 1200, revenue: 8400, leads: 45, conversions: 12 },
  { id: 2, name: "Tennis Elite Tryouts", channel: "Google Search", spend: 850, revenue: 5200, leads: 22, conversions: 8 },
  { id: 3, name: "Refer-a-Friend (Organic)", channel: "Email", spend: 0, revenue: 3100, leads: 15, conversions: 5 },
  { id: 4, name: "Football Winter Camp", channel: "Meta Ads", spend: 2000, revenue: 14000, leads: 88, conversions: 20 },
];

export default function MarketingAttributionPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Target size={20} />
            </div>
            Marketing Attribution ROI
          </h1>
          <p className="page-subtitle mt-2">Track campaign spend, customer acquisition cost, and lifetime value.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-slate-400 text-sm font-bold mb-1 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-400"/> Total Ad Spend
          </div>
          <div className="text-3xl font-black text-white">AED 4,050</div>
        </div>
        <div className="card">
          <div className="text-slate-400 text-sm font-bold mb-1 flex items-center gap-2">
            <Search size={14} className="text-blue-400"/> Attributed Revenue
          </div>
          <div className="text-3xl font-black text-white">AED 30,700</div>
        </div>
        <div className="card border-l-4" style={{ borderColor: "#06b6d4" }}>
          <div className="text-slate-400 text-sm font-bold mb-1">Blended ROAS</div>
          <div className="text-3xl font-black text-cyan-400">7.5x</div>
          <div className="text-xs text-slate-500 mt-1">Return on Ad Spend</div>
        </div>
        <div className="card">
          <div className="text-slate-400 text-sm font-bold mb-1 flex items-center gap-2">
            <Users size={14} className="text-fuchsia-400"/> Blended CAC
          </div>
          <div className="text-3xl font-black text-white">AED 90</div>
          <div className="text-xs text-slate-500 mt-1">Cost to acquire one student</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <div className="card lg:col-span-2">
          <div className="section-header">
            <span className="section-title">Revenue by Channel Over Time</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `AED ${value}`} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <Tooltip 
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 8 }}
                />
                <Area type="monotone" dataKey="Meta" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMeta)" />
                <Area type="monotone" dataKey="Google" stroke="#06b6d4" fillOpacity={1} fill="url(#colorGoogle)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Channels */}
        <div className="card flex flex-col">
          <div className="section-header">
            <span className="section-title">Channel Performance</span>
          </div>
          <div className="flex-1 space-y-6">
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <div className="text-sm font-bold text-white">Meta Ads (FB/IG)</div>
                  <div className="text-xs text-slate-400">AED 3,200 Spend</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">AED 22,400</div>
                  <div className="text-xs text-slate-500">Revenue</div>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <div className="text-sm font-bold text-white">Google Search</div>
                  <div className="text-xs text-slate-400">AED 850 Spend</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">AED 5,200</div>
                  <div className="text-xs text-slate-500">Revenue</div>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <div className="text-sm font-bold text-white">Organic/Referral</div>
                  <div className="text-xs text-slate-400">AED 0 Spend</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">AED 3,100</div>
                  <div className="text-xs text-slate-500">Revenue</div>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-fuchsia-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-6 border-b border-slate-700/50 py-4">
          <h3 className="font-bold text-white">Campaign Details</h3>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
             <thead>
               <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                 <th className="p-3">Campaign Name</th>
                 <th className="p-3">Channel</th>
                 <th className="p-3 text-right">Spend</th>
                 <th className="p-3 text-right">Leads</th>
                 <th className="p-3 text-right">Conversions</th>
                 <th className="p-3 text-right">Revenue</th>
                 <th className="p-3 text-right">ROAS</th>
               </tr>
             </thead>
             <tbody>
               {campaigns.map(camp => (
                 <tr key={camp.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                   <td className="p-3 font-bold text-slate-300">{camp.name}</td>
                   <td className="p-3 text-sm text-slate-400">{camp.channel}</td>
                   <td className="p-3 text-sm text-rose-400 text-right">-AED {camp.spend}</td>
                   <td className="p-3 text-sm text-slate-300 text-right">{camp.leads}</td>
                   <td className="p-3 text-sm text-slate-300 text-right">{camp.conversions}</td>
                   <td className="p-3 text-sm font-bold text-emerald-400 text-right">+AED {camp.revenue}</td>
                   <td className="p-3 text-sm font-bold text-cyan-400 text-right">
                     {camp.spend > 0 ? (camp.revenue / camp.spend).toFixed(1) + 'x' : 'ထ'}
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
