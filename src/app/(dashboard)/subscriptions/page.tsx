"use client";

import { CheckCircle2, Clock, CreditCard, Play, Plus, RefreshCw, XCircle } from "lucide-react";
import { useState } from "react";

const mockSubscriptions = [
  { id: "SUB-101", athlete: "Emma Watson", plan: "Pro Swim Monthly", amount: 450, status: "active", nextBilling: "28/04/2026", card: "**** 4242" },
  { id: "SUB-102", athlete: "Ryan Park", plan: "Elite Tennis + Gym", amount: 850, status: "active", nextBilling: "01/05/2026", card: "**** 1121" },
  { id: "SUB-103", athlete: "Lina Chen", plan: "Basic Football", amount: 350, status: "past_due", nextBilling: "15/04/2026", card: "**** 9088" },
  { id: "SUB-104", athlete: "Adam Smith", plan: "Pro Swim Monthly", amount: 450, status: "canceled", nextBilling: "-", card: "N/A" },
];

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const filteredSubs = mockSubscriptions.filter(s => {
    if (activeTab === "active") return s.status === "active";
    if (activeTab === "issues") return s.status === "past_due" || s.status === "canceled";
    return true;
  });

  const handleRetry = (id: string) => {
    setIsProcessing(id);
    setTimeout(() => {
      setIsProcessing(null);
      // In a real app, this would refresh the state after a successful Stripe call
    }, 2000);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <RefreshCw size={20} />
            </div>
            Recurring Subscriptions
          </h1>
          <p className="page-subtitle mt-2">Manage automated billing, plan upgrades, and payment failures.</p>
        </div>
        <button className="btn btn-primary shadow-lg shadow-indigo-500/20 flex items-center gap-2" style={{ background: "linear-gradient(to right, #6366f1, #a855f7)", border: "none" }}>
          <Plus size={16} /> New Subscription
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card border-l-4" style={{ borderColor: "#10b981" }}>
          <div className="text-slate-400 text-sm font-bold mb-1">Active MRR</div>
          <div className="text-3xl font-black text-white">AED 14,250</div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <TrendingUpIcon size={12} /> +12% from last month
          </div>
        </div>
        <div className="card border-l-4" style={{ borderColor: "#f43f5e" }}>
          <div className="text-slate-400 text-sm font-bold mb-1">Failed Charges</div>
          <div className="text-3xl font-black text-white">AED 700</div>
          <div className="text-xs text-rose-400 mt-2 flex items-center gap-1">
            2 subscriptions past due
          </div>
        </div>
        <div className="card border-l-4" style={{ borderColor: "#6366f1" }}>
          <div className="text-slate-400 text-sm font-bold mb-1">Projected Next 30 Days</div>
          <div className="text-3xl font-black text-white">AED 16,800</div>
          <div className="text-xs text-indigo-400 mt-2 flex items-center gap-1">
            <Clock size={12} /> Includes pending upgrades
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex border-b border-slate-700/50 p-4 gap-4">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'active' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800'}`}
            onClick={() => setActiveTab('active')}
          >
            Active Plans
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'issues' ? 'bg-rose-500/10 text-rose-400' : 'text-slate-400 hover:bg-slate-800'}`}
            onClick={() => setActiveTab('issues')}
          >
            Requires Attention
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            onClick={() => setActiveTab('all')}
          >
            All Subscriptions
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-4">
            <div className="col-span-3">Athlete & Plan</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-3">Next Billing</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="space-y-3">
            {filteredSubs.map(sub => (
              <div key={sub.id} className="grid grid-cols-12 gap-4 items-center bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                <div className="col-span-3">
                  <div className="font-bold text-white">{sub.athlete}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{sub.plan}</div>
                </div>
                
                <div className="col-span-2 font-bold text-slate-300">
                  AED {sub.amount}
                  <span className="text-xs text-slate-500 font-normal block">/ mo</span>
                </div>
                
                <div className="col-span-3">
                  <div className="text-sm text-slate-300 flex items-center gap-2">
                    <CalendarIcon size={14} className="text-slate-500" /> {sub.nextBilling}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <CreditCard size={12} /> {sub.card}
                  </div>
                </div>
                
                <div className="col-span-2">
                  {sub.status === 'active' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 size={12} /> Active
                    </span>
                  )}
                  {sub.status === 'past_due' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/10 text-rose-400">
                      <XCircle size={12} /> Past Due
                    </span>
                  )}
                  {sub.status === 'canceled' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-700 text-slate-400">
                      <XCircle size={12} /> Canceled
                    </span>
                  )}
                </div>
                
                <div className="col-span-2 text-right flex items-center justify-end gap-2">
                  {sub.status === 'past_due' ? (
                    <button 
                      onClick={() => handleRetry(sub.id)}
                      disabled={isProcessing === sub.id}
                      className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1 disabled:opacity-50"
                      style={{ background: "linear-gradient(to right, #f43f5e, #e11d48)", border: "none" }}
                    >
                      {isProcessing === sub.id ? (
                         <><RefreshCw size={12} className="animate-spin" /> Retrying...</>
                      ) : (
                        <><Play size={12} className="fill-current" /> Retry Charge</>
                      )}
                    </button>
                  ) : (
                    <button className="text-slate-400 hover:text-white transition-colors text-xs font-bold border border-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-700">
                      Manage
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {filteredSubs.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <RefreshCw size={32} className="mx-auto mb-3 opacity-20" />
                No subscriptions match the selected criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  );
}

function CalendarIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
      <line x1="16" x2="16" y1="2" y2="6"></line>
      <line x1="8" x2="8" y1="2" y2="6"></line>
      <line x1="3" x2="21" y1="10" y2="10"></line>
    </svg>
  );
}
