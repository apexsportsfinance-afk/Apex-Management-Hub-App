"use client";

import { ChevronRight, CreditCard, Group, Mail, Phone, Plus, Search, User, Users } from "lucide-react";
import { useState } from "react";

const families = [
  { 
    id: "FAM-001", 
    parent: "David Watson", 
    email: "david@watson.com", 
    phone: "+971 50 123 4567",
    siblings: [
      { name: "Emma Watson", sport: "Swimming", status: "Active" },
      { name: "Jack Watson", sport: "Football", status: "Active" }
    ],
    billing: { status: "Paid", totalMRR: 900, discount: "10% Sibling Discount Applied" }
  },
  { 
    id: "FAM-002", 
    parent: "Li Chen", 
    email: "li.chen@global.me", 
    phone: "+971 55 987 6543",
    siblings: [
      { name: "Lina Chen", sport: "Tennis", status: "Active" }
    ],
    billing: { status: "Pending", totalMRR: 450, discount: "No Discount" }
  },
  { 
    id: "FAM-003", 
    parent: "Sarah Smith", 
    email: "sarah.smith@me.com", 
    phone: "+971 52 444 1122",
    siblings: [
      { name: "Adam Smith", sport: "Swimming", status: "Suspended" },
      { name: "Chloe Smith", sport: "Swimming", status: "Active" }
    ],
    billing: { status: "Overdue", totalMRR: 850, discount: "5% Multi-Sport Discount" }
  },
];

export default function FamilyCRMPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFamilies = families.filter(f => 
    f.parent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/20">
              <Group size={20} />
            </div>
            Family-Centric CRM
          </h1>
          <p className="page-subtitle mt-2">Manage sibling linkages, unified billing, and parent communication.</p>
        </div>
        <button className="btn btn-primary shadow-lg shadow-fuchsia-500/20 flex items-center gap-2" style={{ background: "linear-gradient(to right, #d946ef, #db2777)", border: "none" }}>
          <Plus size={16} /> Link New Family
        </button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input 
          type="text" 
          placeholder="Search by parent name, email, or sibling name..."
          className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500 transition-all shadow-inner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredFamilies.map((family) => (
          <div key={family.id} className="card p-0 overflow-hidden border border-slate-800 hover:border-fuchsia-500/30 transition-all group">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Parent Info */}
              <div className="lg:col-span-4 p-6 bg-slate-900/30 border-b lg:border-b-0 lg:border-r border-slate-800">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-full bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 font-black">
                     {family.parent.split(' ').map(n => n[0]).join('')}
                   </div>
                   <div>
                      <div className="text-xl font-bold text-white group-hover:text-fuchsia-400 transition-colors">{family.parent}</div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{family.id}</div>
                   </div>
                </div>
                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-slate-400 text-sm">
                      <Mail size={14} className="text-slate-600" /> {family.email}
                   </div>
                   <div className="flex items-center gap-3 text-slate-400 text-sm">
                      <Phone size={14} className="text-slate-600" /> {family.phone}
                   </div>
                </div>
                <button className="w-full mt-6 py-2 rounded-lg bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors">
                  Edit Profile
                </button>
              </div>

              {/* Sibling Linkage */}
              <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-slate-800">
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Linked Athletes ({family.siblings.length})</div>
                <div className="space-y-3">
                   {family.siblings.map((sib, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/50 hover:bg-slate-900 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                              <User size={14} />
                           </div>
                           <div>
                              <div className="text-sm font-bold text-slate-200">{sib.name}</div>
                              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{sib.sport}</div>
                           </div>
                        </div>
                        <div className={`text-[10px] font-black px-2 py-1 rounded uppercase ${sib.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                           {sib.status}
                        </div>
                     </div>
                   ))}
                   <button className="w-full py-2 border border-dashed border-slate-700 rounded-xl text-slate-600 text-xs font-bold flex items-center justify-center gap-2 hover:text-slate-400 hover:border-slate-500 transition-all">
                      <Plus size={12} /> Add Sibling
                   </button>
                </div>
              </div>

              {/* Unified Billing */}
              <div className="lg:col-span-3 p-6 bg-slate-900/10 flex flex-col justify-between">
                <div>
                   <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Unified Billing</div>
                   <div className="text-3xl font-black text-white">AED {family.billing.totalMRR}</div>
                   <div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-tight">Total Monthly Revenue</div>
                   
                   <div className="mt-4 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">
                      {family.billing.discount}
                   </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                   <div className={`text-center py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${family.billing.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : family.billing.status === 'Overdue' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-amber-500/10 text-amber-500'}`}>
                      {family.billing.status}
                   </div>
                   <button className="flex items-center justify-center gap-2 text-xs font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest mt-2 group/btn">
                      View Statements <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </>
  );
}
