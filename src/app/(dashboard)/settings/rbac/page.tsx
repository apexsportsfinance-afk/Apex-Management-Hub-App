"use client";

import { Check, Shield, Users, Lock, ChevronRight, Info, AlertOctagon } from "lucide-react";
import { useState } from "react";

const roles = [
  { id: "admin", name: "Administrator", description: "Full system access, financial management, and root settings.", users: 2, color: "rose" },
  { id: "manager", name: "Operations Manager", description: "Edit schedules, manage coaches, and view reports.", users: 5, color: "amber" },
  { id: "coach", name: "Head Coach", description: "View rosters, log weekly progress, and track attendance.", users: 24, color: "indigo" },
  { id: "parent", name: "Parent Access", description: "View child moments, billing, and progress reports.", users: 850, color: "emerald" },
];

const permissions = [
  { module: "Dashboard", admin: true, manager: true, coach: true, parent: false },
  { module: "Financial Data", admin: true, manager: false, coach: false, parent: false },
  { module: "Edit Schedule", admin: true, manager: true, coach: false, parent: false },
  { module: "Log Progress", admin: true, manager: true, coach: true, parent: false },
  { module: "View Payments", admin: true, manager: false, coach: false, parent: true },
];

export default function RBACPage() {
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-slate-900 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 text-shadow-glow">
              <Shield size={20} />
            </div>
            Role-Based Access Control
          </h1>
          <p className="page-subtitle mt-2">Scale security with granular permissions and multi-factor governance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Role Selector Sidebar */}
        <div className="lg:col-span-1 space-y-4">
           {roles.map((role) => (
             <button 
               key={role.id}
               onClick={() => setSelectedRole(role)}
               className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${selectedRole.id === role.id ? 'bg-indigo-500/10 border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02]' : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'}`}
             >
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2">
                      <Users size={16} className={selectedRole.id === role.id ? 'text-indigo-400' : 'text-slate-500'} />
                      <span className={`text-sm font-black uppercase tracking-widest ${selectedRole.id === role.id ? 'text-white' : 'text-slate-400'}`}>
                        {role.name}
                      </span>
                   </div>
                   <div className="text-[10px] font-bold text-slate-600 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                      {role.users} Users
                   </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {role.description}
                </p>
             </button>
           ))}

           <div className="card bg-rose-500/5 border-rose-500/20 p-4 mt-8">
              <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest mb-2">
                 <AlertOctagon size={14} /> Security Notice
              </div>
              <p className="text-[10px] text-rose-300/60 leading-normal">
                Changes to Role-Based Access take effect immediately. Ensure you have validated permission overrides before saving.
              </p>
           </div>
        </div>

        {/* Permission Matrix */}
        <div className="lg:col-span-3 space-y-6">
           <div className="card p-0 overflow-hidden border-slate-800 shadow-2xl">
              <div className="bg-slate-900/80 p-6 border-b border-slate-800 flex items-center justify-between">
                 <div>
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                       Configuring {selectedRole.name} 
                       <span className="text-xs font-black text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded bg-indigo-500/5 uppercase tracking-widest leading-none">
                          Active Role
                       </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Permission Matrix v1.4</p>
                 </div>
                 <button className="btn btn-primary text-xs font-black uppercase tracking-widest px-8">
                    Save Changes
                 </button>
              </div>

              <div className="p-6">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                          <th className="pb-4 pt-0">Module & Capability</th>
                          <th className="pb-4 pt-0 text-center">Read</th>
                          <th className="pb-4 pt-0 text-center">Write</th>
                          <th className="pb-4 pt-0 text-center">Delete</th>
                          <th className="pb-4 pt-0 text-right">Audit Log</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                       {permissions.map((p, i) => (
                         <tr key={i} className="group hover:bg-slate-800/20 transition-colors">
                            <td className="py-5 pr-4">
                               <div className="font-bold text-slate-200">{p.module}</div>
                               <div className="text-[10px] text-slate-600 font-bold uppercase mt-1">Core Access Layer</div>
                            </td>
                            <td className="py-5 text-center">
                               <div className="flex justify-center">
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${p[selectedRole.id as keyof typeof p] ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10' : 'bg-slate-800/50 text-slate-700'}`}>
                                     <Check size={14} strokeWidth={3} />
                                  </div>
                               </div>
                            </td>
                            <td className="py-5 text-center">
                               <div className="flex justify-center">
                                  <div className="w-6 h-6 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-700">
                                     <Lock size={12} />
                                  </div>
                               </div>
                            </td>
                            <td className="py-5 text-center">
                               <div className="flex justify-center">
                                  <div className="w-6 h-6 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-700">
                                     <Lock size={12} />
                                  </div>
                               </div>
                            </td>
                            <td className="py-5 text-right">
                               <div className="flex items-center justify-end gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors cursor-pointer">
                                  View History <ChevronRight size={14} />
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              {/* Advanced Security */}
              <div className="p-6 bg-slate-900/30 border-t border-slate-800 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400">
                       <Shield size={20} />
                    </div>
                    <div>
                       <div className="text-sm font-bold text-white">Require 2FA for this role</div>
                       <div className="text-xs text-slate-600 font-medium">All users in {selectedRole.name} must use Authenticator.</div>
                    </div>
                 </div>
                 <div className="w-12 h-6 bg-indigo-500 rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                 </div>
              </div>
           </div>

           {/* User Management Quick View */}
           <div className="card p-6 bg-gradient-to-r from-slate-900 to-indigo-950/30 border-indigo-500/10">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Users size={24} className="text-indigo-400" />
                    <div>
                       <div className="font-bold text-white text-lg">Active Personnel</div>
                       <div className="text-sm text-slate-500">Currently viewing 24 users with {selectedRole.name} role.</div>
                    </div>
                 </div>
                 <button className="flex items-center gap-2 text-xs font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.2em]">
                    Manage Users <ChevronRight size={16} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </>
  );
}
