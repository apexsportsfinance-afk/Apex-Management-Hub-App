"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart2, MapPin, Users, XCircle, Square, BookOpen, Tag,
  CheckSquare, CreditCard, TrendingDown, Package, Target,
  UserPlus, Clock, PieChart, Info, Download, FileText, Table,
  RefreshCcw, UserX, TrendingUp, Search, Filter, AlertTriangle
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { ATHLETES, COACHES, AthleteRecord } from "@/lib/scheduleData";

// ─── Shared data ─────────────────────────────────────────────────────────────
const incomeData = [
  { name: "W 1", income: 2400 },
  { name: "W 2", income: 1398 },
  { name: "W 3", income: 9800 },
  { name: "W 4", income: 3908 },
  { name: "W 5", income: 4800 },
];

const reportCards = [
  { title: "KPI by Programmes",   subtitle: "KPI Report",                icon: <PieChart />,      color: "#4ade80" },
  { title: "KPI by Facilities",   subtitle: "KPI Report",                icon: <MapPin />,        color: "#f59e0b" },
  { title: "KPI by Teachers",     subtitle: "KPI Report",                icon: <Users />,         color: "#8b5cf6" },
  { title: "Outstanding",         subtitle: "Outstanding Report",       icon: <XCircle />,       color: "#0ea5e9" },
  { title: "Spaces",              subtitle: "Spaces Report",            icon: <Square />,        color: "#4ade80" },
  { title: "Bookings",            subtitle: "Bookings Report",          icon: <BookOpen />,      color: "#f59e0b" },
  { title: "Discounts",           subtitle: "Discounts Report",         icon: <Tag />,           color: "#8b5cf6" },
  { title: "Payments",            subtitle: "Payments Report",          icon: <CreditCard />,    color: "#4ade80" },
  { title: "Churn",               subtitle: "Bookings Report",          icon: <TrendingDown />,  color: "#f59e0b" },
  { title: "Class Packs",         subtitle: "Class Packs",              icon: <Package />,       color: "#8b5cf6" },
  { title: "Targets",             subtitle: "All Targets",              icon: <Target />,        color: "#0ea5e9" },
  { title: "Utilization Report",  subtitle: "Venue Spaces Usage",       icon: <BarChart2 />,     color: "#8b5cf6" },
  { title: "Clients Report",      subtitle: "All Clients Report",       icon: <UserPlus />,      color: "#0ea5e9" },
  { title: "Class Utilization",   subtitle: "Fill Rate & Analysis",     icon: <Clock />,         color: "#f43f5e" },
  { title: "Churn Class Packs",   subtitle: "Class Packs Report",       icon: <TrendingDown />,  color: "#f59e0b" },
];

// ─── Attendance data ──────────────────────────────────────────────────────────
const VENUES  = ["Dubai Heights Academy", "Kent College", "Sunmarke School", "Victory Heights"];
const TERMS   = ["Term 1 (Jan–Mar)", "Term 2 (Apr–Jun)", "Term 3 (Jul–Sep)", "Term 4 (Oct–Dec)"];
const SPORTS  = ["Football", "Basketball", "Swimming", "Athletics", "Tennis", "Fitness"];
type AttRow   = { id:number; date:string; athlete:string; coach:string; venue:string; sport:string; term:string; status:"present"|"absent"|"excused"; duration:string };

const attendanceRows: AttRow[] = Array.from({ length: 80 }, (_, i) => {
  const d = new Date("2026-04-01"); d.setDate(d.getDate() + (i % 21));
  const athlete = ATHLETES[i % ATHLETES.length];
  const coach   = COACHES[i % COACHES.length];
  const statuses: AttRow["status"][] = ["present","present","present","absent","excused"];
  return { id: i+1, date: d.toISOString().slice(0,10), athlete: athlete.name, coach: coach.name,
    venue: VENUES[i%VENUES.length], sport: SPORTS[i%SPORTS.length], term: TERMS[Math.floor(i/20)%TERMS.length],
    status: statuses[i%statuses.length], duration: ["60 min","90 min","45 min"][i%3] };
});

// ─── Package data ─────────────────────────────────────────────────────────────
const PACKAGE_META: Record<string, { label:string; days:number; color:string }> = {
  "15d":{ label:"15 Days",  days:15,  color:"#f59e0b" },
  "30d":{ label:"30 Days",  days:30,  color:"#8b5cf6" },
  "1mo":{ label:"1 Month",  days:30,  color:"#6366f1" },
  "2mo":{ label:"2 Months", days:60,  color:"#ec4899" },
  "3mo":{ label:"3 Months", days:90,  color:"#0ea5e9" },
  "6mo":{ label:"6 Months", days:180, color:"#4ade80" },
};
const DURATION_ORDER = ["15d","30d","1mo","2mo","3mo","6mo"] as const;
function actualDays(s:string,e:string){ return Math.round((new Date(e).getTime()-new Date(s).getTime())/(86400000)); }
function statusOf(a:AthleteRecord){
  const t=new Date("2026-04-21"), s=new Date(a.startDate), e=new Date(a.endDate);
  return t<s?"upcoming":t>e?"expired":"active";
}

// ─── Retention data ───────────────────────────────────────────────────────────
const today = new Date("2026-04-21");
function derivedRetention(a:AthleteRecord){
  const start=new Date(a.startDate), end=new Date(a.endDate);
  const daysLeft=Math.round((end.getTime()-today.getTime())/86400000);
  const daysIn  =Math.round((today.getTime()-start.getTime())/86400000);
  const isExpired=today>end, isActive=!isExpired&&today>=start;
  const label = daysIn>20&&isActive?"renewed":isExpired?"churned":"new";
  return { daysLeft, daysIn, label };
}
const PACKAGE_COLORS: Record<string,string> = {
  "15d":"#f59e0b","30d":"#8b5cf6","1mo":"#6366f1","2mo":"#ec4899","3mo":"#0ea5e9","6mo":"#4ade80"
};

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id:"overview",   label:"Overview"   },
  { id:"attendance", label:"Attendance" },
  { id:"packages",   label:"Packages"   },
  { id:"retention",  label:"Retention"  },
] as const;
type TabId = typeof TABS[number]["id"];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // Attendance state
  const [attPeriod, setAttPeriod]       = useState<"daily"|"weekly"|"monthly">("weekly");
  const [attCoach,  setAttCoach]        = useState("all");
  const [attVenue,  setAttVenue]        = useState("all");
  const [attTerm,   setAttTerm]         = useState("all");
  const [attStatus, setAttStatus]       = useState("all");
  const [attSearch, setAttSearch]       = useState("");

  const filteredAtt = useMemo(() => attendanceRows.filter(r => {
    if (attCoach  !=="all" && r.coach  !==attCoach)  return false;
    if (attVenue  !=="all" && r.venue  !==attVenue)  return false;
    if (attTerm   !=="all" && r.term   !==attTerm)   return false;
    if (attStatus !=="all" && r.status !==attStatus) return false;
    if (attSearch && !r.athlete.toLowerCase().includes(attSearch.toLowerCase()) &&
        !r.coach.toLowerCase().includes(attSearch.toLowerCase())) return false;
    return true;
  }), [attCoach, attVenue, attTerm, attStatus, attSearch]);

  const attSummary = useMemo(()=>({
    total:   filteredAtt.length,
    present: filteredAtt.filter(r=>r.status==="present").length,
    absent:  filteredAtt.filter(r=>r.status==="absent").length,
    excused: filteredAtt.filter(r=>r.status==="excused").length,
    rate:    filteredAtt.length ? Math.round((filteredAtt.filter(r=>r.status==="present").length/filteredAtt.length)*100) : 0,
  }), [filteredAtt]);

  const downloadCSV = (rows: any[], filename: string, header: string) => {
    const blob = new Blob([header+"\n"+rows.join("\n")], {type:"text/csv"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=filename; a.click();
  };

  // Retention
  const athletesRetention = useMemo(()=>ATHLETES.map(a=>({...a,...derivedRetention(a)})),[]);
  const renewed     = athletesRetention.filter(a=>a.label==="renewed");
  const churned     = athletesRetention.filter(a=>a.label==="churned");
  const newAts      = athletesRetention.filter(a=>a.label==="new");
  const retRate     = ATHLETES.length ? Math.round((renewed.length/ATHLETES.length)*100) : 0;
  const churnByPkg  = useMemo(()=>{
    const g: Record<string,number>={};
    churned.forEach(a=>{ g[a.packageType]=(g[a.packageType]??0)+1; });
    return g;
  },[churned]);

  return (
    <>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {activeTab !== "overview" && (
            <button
              onClick={() => setActiveTab("overview")}
              className="btn btn-secondary btn-sm rounded-full w-8 h-8 flex items-center justify-center p-0"
            >
              ←
            </button>
          )}
          <div>
            <h1 className="page-title">{TABS.find(t=>t.id===activeTab)?.label}</h1>
            <p className="page-subtitle">Analyze facility performance and financial trends</p>
          </div>
        </div>
        {activeTab==="attendance" && (
          <button
            onClick={()=>downloadCSV(
              filteredAtt.map(r=>`${r.date},${r.athlete},${r.coach},${r.venue},${r.sport},${r.term},${r.status},${r.duration}`),
              "attendance_report.csv",
              "Date,Athlete,Coach,Venue,Sport,Term,Status,Duration"
            )}
            className="btn btn-secondary btn-sm flex items-center gap-1"
          >
            <Download size={13}/> Export CSV
          </button>
        )}
        {activeTab==="packages" && (
          <button
            onClick={()=>downloadCSV(
              ATHLETES.map(a=>`${a.name},${a.packageType},${a.startDate},${a.endDate},${actualDays(a.startDate,a.endDate)},${a.sessionsPerWeek},${a.sessionsPerMonth},${statusOf(a)}`),
              "package_report.csv",
              "Name,Package,Start,End,Actual Days,Sessions/Week,Sessions/Month,Status"
            )}
            className="btn btn-secondary btn-sm flex items-center gap-1"
          >
            <Download size={13}/> Export CSV
          </button>
        )}
        {activeTab==="retention" && (
          <button
            onClick={()=>downloadCSV(
              athletesRetention.map(a=>`${a.name},${a.packageType},${a.startDate},${a.endDate},${a.daysIn},${a.daysLeft},${a.label}`),
              "retention_report.csv",
              "Name,Package,Start,End,Days In,Days Left,Status"
            )}
            className="btn btn-secondary btn-sm flex items-center gap-1"
          >
            <Download size={13}/> Export CSV
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1 — Overview (Grid)
      ══════════════════════════════════════════════════════════════ */}
      {activeTab==="overview" && (
        <>
          <div className="card mb-8">
            <div className="section-header flex justify-between items-center">
              <span className="section-title">Income Chart</span>
              <div className="flex items-center gap-1" style={{ fontSize:11, color:"#64748b" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#4f46e5" }} /> Weekly Income
              </div>
            </div>
            <div style={{ height:260, marginTop:10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={incomeData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill:"#64748b", fontSize:11 }} dy={10}/>
                  <YAxis hide/>
                  <Tooltip contentStyle={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:8, fontSize:12, color:"#f1f5f9" }} itemStyle={{ color:"#818cf8" }}/>
                  <Area type="monotone" dataKey="income" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:20 }}>
            {reportCards.map((card, idx)=>(
              <div key={idx} className="hover-trigger" style={{
                background:"#1e293b", borderRadius:16, padding:24,
                display:"grid", gridTemplateColumns:"1fr auto", alignItems:"center",
                border:"1px solid rgba(255,255,255,0.05)", cursor:"pointer", transition:"transform 0.2s, background 0.2s"
              }}>
                <div>
                  <h3 style={{ fontSize:16, fontWeight:700, color:"#f1f5f9", marginBottom:4 }}>{card.title}</h3>
                  <p  style={{ fontSize:12, color:"#818cf8", fontWeight:600 }}>{card.subtitle}</p>
                </div>
                <div style={{ width:44, height:44, borderRadius:"50%", background:`${card.color}15`, color:card.color,
                  display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${card.color}30` }}>
                  {card.icon}
                </div>
              </div>
            ))}

            {/* Custom Interactive Report Cards */}
            <div
              className="hover-trigger"
              onClick={() => setActiveTab("attendance")}
              style={{
                background:"#1e293b", borderRadius:16, padding:24,
                display:"grid", gridTemplateColumns:"1fr auto", alignItems:"center",
                border:"1px solid rgba(255,255,255,0.05)", cursor:"pointer", transition:"transform 0.2s, background 0.2s"
              }}
            >
              <div>
                <h3 style={{ fontSize:16, fontWeight:700, color:"#f1f5f9", marginBottom:4 }}>Attendance Report</h3>
                <p  style={{ fontSize:12, color:"#818cf8", fontWeight:600 }}>Daily/Weekly/Monthly Tracking</p>
              </div>
              <div style={{ width:44, height:44, borderRadius:"50%", background:`#0ea5e915`, color:"#0ea5e9",
                display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid #0ea5e930` }}>
                <CheckSquare />
              </div>
            </div>

            <div
              className="hover-trigger"
              onClick={() => setActiveTab("packages")}
              style={{
                background:"#1e293b", borderRadius:16, padding:24,
                display:"grid", gridTemplateColumns:"1fr auto", alignItems:"center",
                border:"1px solid rgba(255,255,255,0.05)", cursor:"pointer", transition:"transform 0.2s, background 0.2s"
              }}
            >
              <div>
                <h3 style={{ fontSize:16, fontWeight:700, color:"#f1f5f9", marginBottom:4 }}>Package Duration</h3>
                <p  style={{ fontSize:12, color:"#818cf8", fontWeight:600 }}>15d—6mo Cohort Analysis</p>
              </div>
              <div style={{ width:44, height:44, borderRadius:"50%", background:`#8b5cf615`, color:"#8b5cf6",
                display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid #8b5cf630` }}>
                <Package />
              </div>
            </div>

            <div
              className="hover-trigger"
              onClick={() => setActiveTab("retention")}
              style={{
                background:"#1e293b", borderRadius:16, padding:24,
                display:"grid", gridTemplateColumns:"1fr auto", alignItems:"center",
                border:"1px solid rgba(255,255,255,0.05)", cursor:"pointer", transition:"transform 0.2s, background 0.2s"
              }}
            >
              <div>
                <h3 style={{ fontSize:16, fontWeight:700, color:"#f1f5f9", marginBottom:4 }}>Athlete Retention</h3>
                <p  style={{ fontSize:12, color:"#818cf8", fontWeight:600 }}>Renewals & Churn Tracking</p>
              </div>
              <div style={{ width:44, height:44, borderRadius:"50%", background:`#10b98115`, color:"#10b981",
                display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid #10b98130` }}>
                <TrendingUp />
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 rounded-2xl" style={{ background:"rgba(79,70,229,0.05)", border:"1px dashed rgba(79,70,229,0.2)", textAlign:"center" }}>
            <div className="flex items-center justify-center gap-2 mb-2" style={{ color:"#818cf8" }}>
              <Info size={18}/><span style={{ fontWeight:700, fontSize:14 }}>Need a Custom Report?</span>
            </div>
            <p style={{ fontSize:13, color:"#64748b" }}>Contact the system administrator to request a specialised analytical view.</p>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2 — Attendance
      ══════════════════════════════════════════════════════════════ */}
      {activeTab==="attendance" && (
        <div className="flex flex-col gap-6">
          {/* Period Tabs */}
          <div className="flex items-center gap-1 bg-slate-900 border border-white/5 p-1 rounded-xl w-fit">
            {(["daily","weekly","monthly"] as const).map(p=>(
              <button key={p} onClick={()=>setAttPeriod(p)}
                className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${attPeriod===p?"bg-indigo-600 text-white shadow":"text-slate-400 hover:text-white"}`}>
                {p}
              </button>
            ))}
          </div>

          {/* KPIs */}
          <div className="kpi-grid">
            <div className="kpi-card indigo"><div className="kpi-icon indigo"><CheckSquare size={18}/></div><div className="kpi-value">{attSummary.present}</div><div className="kpi-label">Present</div><div className="kpi-subtext">{attSummary.rate}% rate</div></div>
            <div className="kpi-card rose"><div className="kpi-icon rose"><XCircle size={18}/></div><div className="kpi-value">{attSummary.absent}</div><div className="kpi-label">Absent</div><div className="kpi-subtext">Of {attSummary.total}</div></div>
            <div className="kpi-card amber"><div className="kpi-icon amber"><Clock size={18}/></div><div className="kpi-value">{attSummary.excused}</div><div className="kpi-label">Excused</div><div className="kpi-subtext">Pre-approved</div></div>
            <div className="kpi-card violet"><div className="kpi-icon violet"><Filter size={18}/></div><div className="kpi-value">{attSummary.total}</div><div className="kpi-label">Total Records</div><div className="kpi-subtext">Filtered view</div></div>
          </div>

          {/* Filters */}
          <div className="filter-panel">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="relative lg:col-span-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                <input className="filter-select pl-8" placeholder="Search athlete / coach…" value={attSearch} onChange={e=>setAttSearch(e.target.value)}/>
              </div>
              <select className="filter-select" value={attCoach}  onChange={e=>setAttCoach(e.target.value)}>
                <option value="all">All Coaches</option>{COACHES.map(c=><option key={c.id}>{c.name}</option>)}
              </select>
              <select className="filter-select" value={attVenue}  onChange={e=>setAttVenue(e.target.value)}>
                <option value="all">All Sites</option>{VENUES.map(v=><option key={v}>{v}</option>)}
              </select>
              <select className="filter-select" value={attStatus} onChange={e=>setAttStatus(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="present">Present</option><option value="absent">Absent</option><option value="excused">Excused</option>
              </select>
            </div>
          </div>

          {/* Rate bar */}
          <div className="card glass-panel py-3 px-4 flex items-center gap-4">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Attendance Rate</span>
            <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{
                width:`${attSummary.rate}%`,
                background: attSummary.rate>=80?"#4ade80":attSummary.rate>=60?"#f59e0b":"#ef4444"
              }}/>
            </div>
            <span className="font-extrabold text-sm" style={{ color: attSummary.rate>=80?"#4ade80":attSummary.rate>=60?"#f59e0b":"#ef4444" }}>{attSummary.rate}%</span>
          </div>

          {/* Table */}
          <div className="card" style={{ padding:0, overflow:"hidden" }}>
            <div className="overflow-x-auto">
              <table className="data-table" style={{ margin:0 }}>
                <thead><tr><th>Date</th><th>Athlete</th><th>Coach</th><th>Sport</th><th>Site</th><th>Term</th><th>Duration</th><th>Status</th></tr></thead>
                <tbody>
                  {filteredAtt.length===0 ? (
                    <tr><td colSpan={8} style={{ textAlign:"center", padding:40, color:"#475569" }}>No records match filters.</td></tr>
                  ) : filteredAtt.map(r=>(
                    <tr key={r.id}>
                      <td style={{ fontSize:12, color:"#94a3b8" }}>{r.date}</td>
                      <td><div className="flex items-center gap-2"><div className="avatar" style={{ width:28, height:28, fontSize:11 }}>{r.athlete.charAt(0)}</div><span style={{ fontWeight:600, color:"#f1f5f9" }}>{r.athlete}</span></div></td>
                      <td style={{ color:"#94a3b8" }}>{r.coach}</td>
                      <td style={{ color:"#94a3b8" }}>{r.sport}</td>
                      <td style={{ color:"#64748b", fontSize:12 }}>{r.venue}</td>
                      <td style={{ color:"#64748b", fontSize:11 }}>{r.term}</td>
                      <td style={{ color:"#64748b", fontSize:12 }}>{r.duration}</td>
                      <td><span className={`badge capitalize ${r.status==="present"?"badge-active":r.status==="absent"?"badge-overdue":"badge-pending"}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs text-slate-500">Showing {filteredAtt.length} of {attendanceRows.length} records</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3 — Packages
      ══════════════════════════════════════════════════════════════ */}
      {activeTab==="packages" && (
        <div className="flex flex-col gap-6">
          {/* Summary tiles */}
          <div className="grid gap-4" style={{ gridTemplateColumns:"repeat(6,1fr)" }}>
            {DURATION_ORDER.map(pkg=>{
              const m = PACKAGE_META[pkg];
              const count = ATHLETES.filter(a=>a.packageType===pkg).length;
              return (
                <div key={pkg} className="card glass-panel text-center" style={{ background:`${m.color}08`, borderColor:`${m.color}30`, padding:"16px 12px" }}>
                  <div className="text-2xl font-extrabold mb-1" style={{ color:m.color }}>{count}</div>
                  <div className="text-xs text-slate-300 font-bold">{m.label}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{m.days}d pkg</div>
                </div>
              );
            })}
          </div>

          {/* Per-tier tables */}
          {DURATION_ORDER.map(pkg=>{
            const m   = PACKAGE_META[pkg];
            const ats = ATHLETES.filter(a=>a.packageType===pkg);
            return (
              <div key={pkg} className="card" style={{ padding:0, overflow:"hidden" }}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5" style={{ background:`${m.color}08` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:`${m.color}20`, color:m.color }}><Package size={16}/></div>
                    <span className="font-bold text-white">{m.label} Package</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background:`${m.color}20`, color:m.color }}>{ats.length} athletes</span>
                  </div>
                  <span className="text-xs text-slate-500">{m.days} days · {Math.round(m.days/7)} weeks</span>
                </div>
                {ats.length===0 ? (
                  <div className="text-center py-6 text-slate-500 text-sm">No athletes on this package</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="data-table" style={{ margin:0 }}>
                      <thead>
                        <tr><th>Athlete</th><th>Start Date</th><th>End Date</th><th>Actual Days</th><th>Sessions/Week</th><th>Sessions/Month</th><th>Used (Week)</th><th>Used (Month)</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {ats.map(a=>{
                          const days=actualDays(a.startDate,a.endDate);
                          const st=statusOf(a);
                          const wPct=Math.round((a.sessionsUsedThisWeek/a.sessionsPerWeek)*100);
                          const mPct=Math.round((a.sessionsUsedThisMonth/a.sessionsPerMonth)*100);
                          return (
                            <tr key={a.id}>
                              <td><div className="flex items-center gap-2"><div className="avatar" style={{ width:28, height:28, fontSize:11 }}>{a.name.charAt(0)}</div><span style={{ fontWeight:600, color:"#f1f5f9" }}>{a.name}</span></div></td>
                              <td style={{ fontSize:12, color:"#94a3b8" }}>{a.startDate}</td>
                              <td style={{ fontSize:12, color:"#94a3b8" }}>{a.endDate}</td>
                              <td><span style={{ fontWeight:700, color:m.color }}>{days}</span><span style={{ fontSize:10, color:"#64748b" }}> days</span></td>
                              <td style={{ fontWeight:600, color:"#f1f5f9" }}>{a.sessionsPerWeek}</td>
                              <td style={{ fontWeight:600, color:"#f1f5f9" }}>{a.sessionsPerMonth}</td>
                              <td><div className="flex items-center gap-2"><div style={{ width:48, height:5, background:"#1e293b", borderRadius:9999 }}><div style={{ height:"100%", borderRadius:9999, background:wPct>=100?"#ef4444":m.color, width:`${Math.min(100,wPct)}%` }}/></div><span style={{ fontSize:11, color:"#64748b" }}>{a.sessionsUsedThisWeek}/{a.sessionsPerWeek}</span></div></td>
                              <td><div className="flex items-center gap-2"><div style={{ width:48, height:5, background:"#1e293b", borderRadius:9999 }}><div style={{ height:"100%", borderRadius:9999, background:mPct>=100?"#ef4444":"#8b5cf6", width:`${Math.min(100,mPct)}%` }}/></div><span style={{ fontSize:11, color:"#64748b" }}>{a.sessionsUsedThisMonth}/{a.sessionsPerMonth}</span></div></td>
                              <td><span className={`badge capitalize ${st==="active"?"badge-active":st==="expired"?"badge-overdue":"badge-pending"}`}>{st}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 4 — Retention
      ══════════════════════════════════════════════════════════════ */}
      {activeTab==="retention" && (
        <div className="flex flex-col gap-6">
          {/* KPIs */}
          <div className="kpi-grid">
            <div className="kpi-card indigo"><div className="kpi-icon indigo"><RefreshCcw size={18}/></div><div className="kpi-value">{renewed.length}</div><div className="kpi-label">Renewed</div><div className="kpi-subtext">{retRate}% retention rate</div></div>
            <div className="kpi-card rose"><div className="kpi-icon rose"><UserX size={18}/></div><div className="kpi-value">{churned.length}</div><div className="kpi-label">Churned</div><div className="kpi-subtext">Package expired</div></div>
            <div className="kpi-card violet"><div className="kpi-icon violet"><Users size={18}/></div><div className="kpi-value">{newAts.length}</div><div className="kpi-label">New Enrollments</div><div className="kpi-subtext">Started recently</div></div>
            <div className="kpi-card amber"><div className="kpi-icon amber"><TrendingUp size={18}/></div><div className="kpi-value">{retRate}%</div><div className="kpi-label">Retention Rate</div><div className="kpi-subtext">Target: 80%</div></div>
          </div>

          {/* Rate bar */}
          <div className="card glass-panel py-3 px-4 flex items-center gap-4">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Retention Rate</span>
            <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width:`${retRate}%`, background: retRate>=80?"#4ade80":retRate>=60?"#f59e0b":"#ef4444" }}/>
            </div>
            <span className="font-extrabold text-sm" style={{ color: retRate>=80?"#4ade80":"#f59e0b" }}>{retRate}%</span>
            {retRate<80&&<span className="flex items-center gap-1 text-xs text-amber-400 font-bold"><AlertTriangle size={12}/> Below Target</span>}
          </div>

          {/* Churn by pkg */}
          {churned.length>0&&(
            <div className="card glass-panel border-rose-500/10">
              <div className="flex items-center gap-2 mb-3"><AlertTriangle size={16} className="text-rose-400"/><h3 className="text-sm font-bold text-white">Churn Breakdown by Package</h3></div>
              <div className="flex flex-wrap gap-3">
                {Object.entries(churnByPkg).map(([pkg,count])=>(
                  <div key={pkg} className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor:`${PACKAGE_COLORS[pkg]}30`, background:`${PACKAGE_COLORS[pkg]}08` }}>
                    <span style={{ color:PACKAGE_COLORS[pkg], fontWeight:700 }}>{count}</span>
                    <span className="text-xs text-slate-400">{pkg} churned</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Athlete tables */}
          {[
            { label:"✅ Renewed Athletes", list:renewed, cls:"badge-active", color:"#4ade80" },
            { label:"⚠️ Churned Athletes",  list:churned, cls:"badge-overdue",color:"#ef4444" },
            { label:"🆕 New Enrollments",   list:newAts,  cls:"badge-pending",color:"#f59e0b" },
          ].map(({label,list,cls,color})=>(
            <div key={label} className="card" style={{ padding:0, overflow:"hidden" }}>
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <span className="font-bold text-white">{label}</span>
                <span className={`badge ${cls}`}>{list.length} athletes</span>
              </div>
              {list.length===0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">No athletes in this category</div>
              ):(
                <div className="overflow-x-auto">
                  <table className="data-table" style={{ margin:0 }}>
                    <thead><tr><th>Athlete</th><th>Package</th><th>Start Date</th><th>End Date</th><th>Days Active</th><th>Days Left</th><th>Sessions/Week</th><th>Status</th></tr></thead>
                    <tbody>
                      {list.map(a=>(
                        <tr key={a.id}>
                          <td><div className="flex items-center gap-2"><div className="avatar" style={{ width:28, height:28, fontSize:11 }}>{a.name.charAt(0)}</div><span style={{ fontWeight:600, color:"#f1f5f9" }}>{a.name}</span></div></td>
                          <td><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background:`${PACKAGE_COLORS[a.packageType]}15`, color:PACKAGE_COLORS[a.packageType] }}><Package size={9}/>{a.packageType}</span></td>
                          <td style={{ fontSize:12, color:"#94a3b8" }}>{a.startDate}</td>
                          <td style={{ fontSize:12, color:"#94a3b8" }}>{a.endDate}</td>
                          <td style={{ fontWeight:700, color }}>{Math.max(0,a.daysIn)}d</td>
                          <td style={{ fontSize:12, color:a.daysLeft<7?"#ef4444":"#64748b" }}>{a.daysLeft>0?`${a.daysLeft}d`:"Expired"}</td>
                          <td style={{ fontWeight:600, color:"#f1f5f9" }}>{a.sessionsPerWeek}</td>
                          <td><span className={`badge ${cls} capitalize`}>{a.label}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
