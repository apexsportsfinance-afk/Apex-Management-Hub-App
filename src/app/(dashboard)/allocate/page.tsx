"use client";

import { useState, useMemo } from "react";
import {
  Search, UserPlus, CheckCircle2, AlertCircle, ChevronRight,
  Info, Calendar as CalendarIcon, Clock, MapPin, Package,
  TrendingUp, AlertTriangle, ShieldCheck, Ban
} from "lucide-react";
import { ATHLETES, COACHES, CLASSES, AthleteRecord } from "@/lib/scheduleData";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const today = new Date("2026-04-21"); // pinned to current date

function isWithinPackage(athlete: AthleteRecord, sessionDay: string): boolean {
  // Map class day string to a target date within current week
  const start = new Date(athlete.startDate);
  const end = new Date(athlete.endDate);
  return today >= start && today <= end;
}

function getSessionsStatus(athlete: AthleteRecord) {
  const weekRemaining = Math.max(0, athlete.sessionsPerWeek - athlete.sessionsUsedThisWeek);
  const monthRemaining = Math.max(0, athlete.sessionsPerMonth - athlete.sessionsUsedThisMonth);
  const isWeekFull = weekRemaining === 0;
  const isMonthFull = monthRemaining === 0;
  const isExpired = new Date(athlete.endDate) < today;
  const notStarted = new Date(athlete.startDate) > today;
  return { weekRemaining, monthRemaining, isWeekFull, isMonthFull, isExpired, notStarted };
}

const PACKAGE_LABELS: Record<string, string> = {
  "15d": "15 Days", "30d": "30 Days", "1mo": "1 Month",
  "2mo": "2 Months", "3mo": "3 Months", "6mo": "6 Months"
};

function PackageBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
      <Package size={9} /> {PACKAGE_LABELS[type] ?? type}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AllocatePage() {
  const [step, setStep] = useState(1);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteRecord | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<typeof COACHES[0] | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAthletes = useMemo(() =>
    ATHLETES.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  const availableClasses = useMemo(() => {
    if (!selectedCoach) return [];
    return CLASSES.filter(c => c.coachId === selectedCoach.id);
  }, [selectedCoach]);

  const selectedClass = useMemo(() =>
    CLASSES.find(c => c.id === selectedClassId),
    [selectedClassId]
  );

  const athleteStatus = selectedAthlete ? getSessionsStatus(selectedAthlete) : null;
  const canAllocate = !!(
    selectedAthlete &&
    athleteStatus &&
    !athleteStatus.isExpired &&
    !athleteStatus.notStarted &&
    !athleteStatus.isWeekFull &&
    !athleteStatus.isMonthFull &&
    isWithinPackage(selectedAthlete, selectedClass?.day ?? "")
  );

  const handleReset = () => {
    setStep(1);
    setSelectedAthlete(null);
    setSelectedCoach(null);
    setSelectedClassId(null);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="page-title">Athlete Allocation</h1>
        <p className="page-subtitle">Assign athletes to class sessions — enforced by their booked package</p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-2">
        {[
          { num: 1, label: "Select Athlete" },
          { num: 2, label: "Choose Coach" },
          { num: 3, label: "Pick Class" },
          { num: 4, label: "Confirm" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-3" style={{ minWidth: "max-content" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 14,
              background: step === s.num ? "#4f46e5" : step > s.num ? "#4ade80" : "#1e293b",
              color: step === s.num || step > s.num ? "#fff" : "#64748b",
              border: step === s.num ? "none" : "1px solid #334155"
            }}>
              {step > s.num ? <CheckCircle2 size={18} /> : s.num}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: step === s.num ? "#f1f5f9" : "#64748b" }}>
              {s.label}
            </span>
            {s.num < 4 && <ChevronRight size={16} style={{ color: "#334155" }} />}
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "1.5fr 1fr", alignItems: "start", gap: 32 }}>
        <div className="card">

          {/* STEP 1: SELECT ATHLETE */}
          {step === 1 && (
            <div>
              <div className="section-header">
                <span className="section-title">Search Athlete</span>
                <span className="badge badge-pending text-[10px]">{ATHLETES.length} Athletes</span>
              </div>
              <div style={{ position: "relative", marginBottom: 20 }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
                <input
                  className="input" placeholder="Type athlete name..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: 40 }}
                />
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {filteredAthletes.map(a => {
                  const s = getSessionsStatus(a);
                  const blocked = s.isExpired || s.notStarted || a.status === "suspended";
                  return (
                    <button
                      key={a.id}
                      disabled={blocked}
                      onClick={() => { setSelectedAthlete(a); setStep(2); setSearchTerm(""); }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "12px 16px", background: blocked ? "rgba(15,23,42,0.4)" : "#0f172a",
                        border: "1px solid #1e293b", borderRadius: 8, textAlign: "left",
                        opacity: blocked ? 0.55 : 1, cursor: blocked ? "not-allowed" : "pointer"
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="avatar" style={{ width: 36, height: 36 }}>{a.name.charAt(0)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontWeight: 600, color: "#f1f5f9" }}>{a.name}</span>
                            <PackageBadge type={a.packageType} />
                            {a.status === "suspended" && <span className="badge badge-overdue text-[9px]">SUSPENDED</span>}
                            {s.isExpired && <span className="badge badge-overdue text-[9px]">EXPIRED</span>}
                            {s.notStarted && <span className="badge badge-pending text-[9px]">NOT STARTED</span>}
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                            📅 {a.startDate} → {a.endDate} &nbsp;·&nbsp;
                            <span style={{ color: s.isWeekFull ? "#ef4444" : "#4ade80" }}>
                              Week: {s.weekRemaining}/{a.sessionsPerWeek} left
                            </span>
                            &nbsp;·&nbsp;
                            <span style={{ color: s.isMonthFull ? "#ef4444" : "#94a3b8" }}>
                              Month: {s.monthRemaining}/{a.sessionsPerMonth} left
                            </span>
                          </div>
                        </div>
                      </div>
                      {!blocked && <ChevronRight size={18} style={{ color: "#475569" }} />}
                      {blocked && <Ban size={16} style={{ color: "#ef4444" }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE COACH */}
          {step === 2 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc" }}>Available Coaches</h3>
                  {selectedAthlete && (
                    <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      Allocating for <span style={{ color: "#818cf8", fontWeight: 600 }}>{selectedAthlete.name}</span>
                      &nbsp;({athleteStatus?.weekRemaining} sessions left this week)
                    </p>
                  )}
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>Back</button>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {COACHES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCoach(c); setStep(3); }}
                    style={{
                      display: "grid", gridTemplateColumns: "auto 1fr auto",
                      alignItems: "center", gap: 16, padding: 16,
                      background: "#0f172a", border: "1px solid #1e293b",
                      borderRadius: 12, textAlign: "left"
                    }}
                  >
                    <div className="avatar" style={{ width: 44, height: 44, background: c.color, fontSize: 18 }}>{c.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "#f1f5f9" }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: c.color, fontWeight: 600, textTransform: "uppercase" }}>{c.specialty}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Sessions</div>
                      <div style={{ fontWeight: 700, color: "#f1f5f9", fontSize: 13 }}>
                        {CLASSES.filter(cls => cls.coachId === c.id).length} classes
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PICK CLASS */}
          {step === 3 && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc" }}>{selectedCoach?.name}'s Classes</h3>
                  <p style={{ fontSize: 12, color: "#64748b" }}>
                    Session must fall within athlete's package dates ({selectedAthlete?.startDate} – {selectedAthlete?.endDate})
                  </p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setStep(2)}>Back</button>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {availableClasses.map(c => {
                  const isFull = c.enrolled >= c.capacity;
                  // "Outside date range" flag for visual hint
                  const outOfRange = selectedAthlete ? !isWithinPackage(selectedAthlete, c.day) : false;
                  const blocked = isFull || outOfRange;
                  return (
                    <button
                      key={c.id}
                      disabled={blocked}
                      onClick={() => { setSelectedClassId(c.id); setStep(4); }}
                      style={{
                        display: "grid", gridTemplateColumns: "1fr auto",
                        padding: 16, background: blocked ? "rgba(30,41,59,0.2)" : "#0f172a",
                        border: selectedClassId === c.id ? "2px solid #4f46e5" : "1px solid #1e293b",
                        borderRadius: 12, textAlign: "left",
                        opacity: blocked ? 0.6 : 1, cursor: blocked ? "not-allowed" : "pointer"
                      }}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ fontWeight: 700, color: "#f1f5f9" }}>{c.name}</span>
                          <span className={`badge text-[9px] ${c.level === "Advanced" ? "badge-overdue" : c.level === "Intermediate" ? "badge-pending" : "badge-active"}`}>
                            {c.level}
                          </span>
                          {outOfRange && <span className="badge badge-overdue text-[9px]">OUT OF RANGE</span>}
                        </div>
                        <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#94a3b8" }}>
                          <span className="flex items-center gap-1"><CalendarIcon size={12} /> {c.day}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {c.startTime} – {c.endTime}</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {c.venue}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>Capacity</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isFull ? "#ef4444" : "#4ade80" }}>
                          {c.enrolled} / {c.capacity}
                        </div>
                        {isFull && <div style={{ fontSize: 10, color: "#ef4444" }}>FULL</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {step === 4 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              {canAllocate ? (
                <>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(74,222,128,0.1)", color: "#4ade80", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                    <ShieldCheck size={48} />
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: "#f8fafc", marginBottom: 8 }}>Package Verified ✓</h3>
                  <p style={{ color: "#94a3b8", marginBottom: 32 }}>
                    {selectedAthlete?.name} has <strong style={{ color: "#4ade80" }}>{athleteStatus?.weekRemaining} session(s)</strong> remaining this week under their {PACKAGE_LABELS[selectedAthlete!.packageType]} package.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button className="btn btn-secondary" onClick={() => setStep(3)}>Change Class</button>
                    <button className="btn btn-primary" style={{ padding: "0 40px" }} onClick={handleReset}>Confirm Allocation</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(239,68,68,0.1)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                    <AlertTriangle size={48} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc", marginBottom: 8 }}>Allocation Blocked</h3>
                  <p style={{ color: "#94a3b8", maxWidth: 360, margin: "0 auto 32px" }}>
                    {athleteStatus?.isExpired && "This athlete's package has expired. Please renew before allocating."}
                    {athleteStatus?.isWeekFull && !athleteStatus.isExpired && "Weekly session limit reached. No more allocations allowed this week."}
                    {athleteStatus?.isMonthFull && !athleteStatus.isWeekFull && !athleteStatus.isExpired && "Monthly session limit reached for this package."}
                    {athleteStatus?.notStarted && "Package hasn't started yet. Allocation is locked until the start date."}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button className="btn btn-secondary" onClick={() => setStep(1)}>Choose Another Athlete</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* SIDEBAR: PACKAGE SUMMARY */}
        <div style={{ position: "sticky", top: 20 }}>
          <div className="card" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", borderColor: "#334155" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <Info size={16} style={{ color: "#4f46e5" }} /> Enrollment Summary
            </h3>

            <div style={{ display: "grid", gap: 20 }}>
              {/* Athlete */}
              <div>
                <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Athlete</div>
                {selectedAthlete ? (
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="avatar" style={{ width: 32, height: 32 }}>{selectedAthlete.name.charAt(0)}</div>
                      <span style={{ fontWeight: 600, color: "#f1f5f9" }}>{selectedAthlete.name}</span>
                    </div>

                    {/* Package Details */}
                    <div className="p-3 rounded-xl border" style={{ background: "rgba(79,70,229,0.05)", borderColor: "rgba(79,70,229,0.2)" }}>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-400">Package</span>
                        <PackageBadge type={selectedAthlete.packageType} />
                      </div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Valid From</span>
                        <span className="text-slate-200 font-bold">{selectedAthlete.startDate}</span>
                      </div>
                      <div className="flex justify-between text-xs mb-3">
                        <span className="text-slate-400">Valid Until</span>
                        <span className={`font-bold ${athleteStatus?.isExpired ? "text-rose-400" : "text-slate-200"}`}>
                          {selectedAthlete.endDate}
                        </span>
                      </div>

                      {/* Session Bars */}
                      <div className="mb-2">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-slate-400">WEEK</span>
                          <span style={{ color: athleteStatus?.isWeekFull ? "#ef4444" : "#4ade80", fontWeight: 700 }}>
                            {athleteStatus?.weekRemaining}/{selectedAthlete.sessionsPerWeek} left
                          </span>
                        </div>
                        <div style={{ height: 6, background: "#1e293b", borderRadius: 9999, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", borderRadius: 9999,
                            background: athleteStatus?.isWeekFull ? "#ef4444" : "#4f46e5",
                            width: `${((selectedAthlete.sessionsUsedThisWeek / selectedAthlete.sessionsPerWeek) * 100).toFixed(0)}%`,
                            transition: "width 0.4s"
                          }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-slate-400">MONTH</span>
                          <span style={{ color: athleteStatus?.isMonthFull ? "#ef4444" : "#94a3b8", fontWeight: 700 }}>
                            {athleteStatus?.monthRemaining}/{selectedAthlete.sessionsPerMonth} left
                          </span>
                        </div>
                        <div style={{ height: 6, background: "#1e293b", borderRadius: 9999, overflow: "hidden" }}>
                          <div style={{
                            height: "100%", borderRadius: 9999,
                            background: athleteStatus?.isMonthFull ? "#ef4444" : "#8b5cf6",
                            width: `${((selectedAthlete.sessionsUsedThisMonth / selectedAthlete.sessionsPerMonth) * 100).toFixed(0)}%`,
                            transition: "width 0.4s"
                          }} />
                        </div>
                      </div>
                    </div>

                    {/* Eligibility Warning */}
                    {athleteStatus && (athleteStatus.isExpired || athleteStatus.isWeekFull || athleteStatus.isMonthFull) && (
                      <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-300 border border-rose-500/20" style={{ background: "rgba(239,68,68,0.05)" }}>
                        <AlertCircle size={14} />
                        {athleteStatus.isExpired ? "Package Expired" : athleteStatus.isWeekFull ? "Week Limit Reached" : "Month Limit Reached"}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, fontStyle: "italic", color: "#475569" }}>Select an athlete to begin</div>
                )}
              </div>

              {/* Coach */}
              <div>
                <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Assigned Coach</div>
                {selectedCoach ? (
                  <div className="flex items-center gap-3">
                    <div className="avatar" style={{ width: 32, height: 32, background: selectedCoach.color }}>{selectedCoach.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#f1f5f9" }}>{selectedCoach.name}</div>
                      <div style={{ fontSize: 11, color: selectedCoach.color }}>{selectedCoach.specialty}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, fontStyle: "italic", color: "#475569" }}>No coach assigned yet</div>
                )}
              </div>

              {/* Session */}
              <div>
                <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Session Details</div>
                {selectedClass ? (
                  <div style={{ display: "grid", gap: 4 }}>
                    <div style={{ fontWeight: 600, color: "#f1f5f9" }}>{selectedClass.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{selectedClass.day} @ {selectedClass.startTime}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{selectedClass.venue}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {selectedClass.enrolled}/{selectedClass.capacity} enrolled
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, fontStyle: "italic", color: "#475569" }}>Select a class session</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
