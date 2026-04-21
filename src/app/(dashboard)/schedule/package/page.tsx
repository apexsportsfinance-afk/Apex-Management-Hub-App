"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar, Package, Clock, MapPin, ChevronLeft, ChevronRight,
  Check, AlertTriangle, Search, Filter
} from "lucide-react";
import { ATHLETES, COACHES, CLASSES, AthleteRecord } from "@/lib/scheduleData";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDayDate(weekOffset: number, dayIdx: number): Date {
  const d = new Date("2026-04-21"); // pinned to current date
  const dow = d.getDay(); // 0 = Sun, 1 = Mon, ...
  const diffToMonday = (dow === 0 ? -6 : 1 - dow);
  d.setDate(d.getDate() + diffToMonday + weekOffset * 7 + dayIdx);
  return d;
}

function isWithinPackage(a: AthleteRecord, date: Date): boolean {
  const start = new Date(a.startDate);
  const end   = new Date(a.endDate);
  return date >= start && date <= end;
}

const PACKAGE_COLORS: Record<string, string> = {
  "15d": "#f59e0b", "30d": "#8b5cf6", "1mo": "#6366f1",
  "2mo": "#ec4899", "3mo": "#0ea5e9", "6mo": "#4ade80",
};

// Map each athlete to their enrolled classes that produce recurring slots
function getAthleteSlots(athlete: AthleteRecord, weekOffset: number) {
  const enrolledClasses = CLASSES.filter(c => c.enrolledAthletes.includes(athlete.name));
  const dayMap: Record<string, typeof CLASSES[0][]> = {
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  };
  enrolledClasses.forEach(c => {
    if (dayMap[c.day] !== undefined) dayMap[c.day].push(c);
  });
  return dayMap;
}

export default function PackageSchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [filterPkg, setFilterPkg] = useState("all");

  const athletes = useMemo(() =>
    ATHLETES.filter(a =>
      a.status !== "suspended" &&
      a.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterPkg === "all" || a.packageType === filterPkg)
    ),
    [search, filterPkg]
  );

  const weekDates = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => getDayDate(weekOffset, i)),
    [weekOffset]
  );

  const weekLabel = `${weekDates[0].toDateString().slice(4)} – ${weekDates[6].toDateString().slice(4)}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Package-Linked Schedule</h1>
          <p className="page-subtitle">View each athlete's allocated sessions within their booking window</p>
        </div>
        {/* Week navigator */}
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary btn-sm" onClick={() => setWeekOffset(w => w - 1)}>
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm font-bold text-slate-300 min-w-max">{weekLabel}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => setWeekOffset(w => w + 1)}>
            <ChevronRight size={14} />
          </button>
          <button className="btn btn-secondary btn-sm text-xs" onClick={() => setWeekOffset(0)}>
            Today
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-panel">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="filter-select pl-8" placeholder="Search athlete…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={filterPkg} onChange={e => setFilterPkg(e.target.value)}>
            <option value="all">All Packages</option>
            {["15d","30d","1mo","2mo","3mo","6mo"].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {/* Day Header */}
        <div
          className="grid border-b border-white/5"
          style={{ gridTemplateColumns: "220px repeat(7, 1fr)" }}
        >
          <div className="px-4 py-3 text-xs text-slate-500 font-bold uppercase">Athlete</div>
          {weekDates.map((d, i) => {
            const isToday = d.toDateString() === new Date("2026-04-21").toDateString();
            return (
              <div key={i} className={`py-3 text-center border-l border-white/5 ${isToday ? "bg-indigo-600/10" : ""}`}>
                <div className="text-xs text-slate-500">{DAYS_SHORT[i]}</div>
                <div className={`text-sm font-bold ${isToday ? "text-indigo-400" : "text-slate-300"}`}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Athlete Rows */}
        <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
          {athletes.length === 0 && (
            <div className="text-center py-16 text-slate-500">No athletes match your filters.</div>
          )}
          {athletes.map(a => {
            const daySlots = getAthleteSlots(a, weekOffset);
            const color    = PACKAGE_COLORS[a.packageType] ?? "#6366f1";
            return (
              <div
                key={a.id}
                className="grid border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                style={{ gridTemplateColumns: "220px repeat(7, 1fr)", minHeight: 72 }}
              >
                {/* Athlete info cell */}
                <div className="px-4 py-3 flex items-center gap-3 border-r border-white/5">
                  <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{a.name.charAt(0)}</div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">{a.name}</div>
                    <span
                      className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold mt-0.5 uppercase"
                      style={{ background: `${color}20`, color }}
                    >
                      {a.packageType} · {a.sessionsPerWeek}/wk
                    </span>
                  </div>
                </div>

                {/* Day cells */}
                {weekDates.map((date, di) => {
                  const dayName = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][di];
                  const sessions = daySlots[dayName] ?? [];
                  const inRange  = isWithinPackage(a, date);

                  return (
                    <div
                      key={di}
                      className="border-l border-white/5 p-1.5 flex flex-col gap-1"
                      style={{ background: !inRange ? "rgba(0,0,0,0.2)" : undefined }}
                    >
                      {!inRange && (
                        <div className="flex items-center justify-center h-full opacity-20">
                          <AlertTriangle size={12} className="text-rose-400" />
                        </div>
                      )}
                      {inRange && sessions.map(s => (
                        <div
                          key={s.id}
                          className="rounded px-1.5 py-1 text-[9px] font-bold leading-tight"
                          style={{ background: `${color}20`, borderLeft: `2px solid ${color}`, color }}
                        >
                          <div className="truncate">{s.name}</div>
                          <div className="text-[8px] font-normal opacity-70 mt-0.5">{s.startTime}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-3 h-3 rounded bg-rose-500/20 flex items-center justify-center">
              <AlertTriangle size={8} className="text-rose-400" />
            </div>
            Outside package window (no sessions allowed)
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-3 h-3 rounded bg-indigo-600/20"></div>
            Today
          </div>
          {Object.entries(PACKAGE_COLORS).map(([pkg, color]) => (
            <div key={pkg} className="flex items-center gap-1 text-xs" style={{ color }}>
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
              {pkg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
