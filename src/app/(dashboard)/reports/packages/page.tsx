"use client";

import React, { useMemo } from "react";
import { Download, Package, TrendingUp, Users, Calendar, ChevronRight, FileText } from "lucide-react";
import { ATHLETES, AthleteRecord } from "@/lib/scheduleData";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const PACKAGE_META: Record<string, { label: string; days: number; color: string; bg: string }> = {
  "15d": { label: "15 Days",  days: 15,  color: "#f59e0b", bg: "rgba(245,158,11,0.08)"  },
  "30d": { label: "30 Days",  days: 30,  color: "#8b5cf6", bg: "rgba(139,92,246,0.08)"  },
  "1mo": { label: "1 Month",  days: 30,  color: "#6366f1", bg: "rgba(99,102,241,0.08)"  },
  "2mo": { label: "2 Months", days: 60,  color: "#ec4899", bg: "rgba(236,72,153,0.08)"  },
  "3mo": { label: "3 Months", days: 90,  color: "#0ea5e9", bg: "rgba(14,165,233,0.08)"  },
  "6mo": { label: "6 Months", days: 180, color: "#4ade80", bg: "rgba(74,222,128,0.08)"  },
};

function actualDays(start: string, end: string) {
  const d1 = new Date(start);
  const d2 = new Date(end);
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

function statusOf(a: AthleteRecord): "active" | "expired" | "upcoming" {
  const today = new Date("2026-04-21");
  const start = new Date(a.startDate);
  const end   = new Date(a.endDate);
  if (today < start) return "upcoming";
  if (today > end)   return "expired";
  return "active";
}

const DURATION_ORDER = ["15d", "30d", "1mo", "2mo", "3mo", "6mo"] as const;

export default function PackageReportsPage() {
  const grouped = useMemo(() => {
    return DURATION_ORDER.map(pkg => ({
      pkg,
      meta: PACKAGE_META[pkg],
      athletes: ATHLETES.filter(a => a.packageType === pkg),
    }));
  }, []);

  const exportCSV = () => {
    const header = "Name,Package,Start Date,End Date,Actual Days,Sessions/Week,Sessions/Month,Status\n";
    const rows = ATHLETES.map(a =>
      `${a.name},${a.packageType},${a.startDate},${a.endDate},${actualDays(a.startDate, a.endDate)},${a.sessionsPerWeek},${a.sessionsPerMonth},${statusOf(a)}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "package_duration_report.csv"; link.click();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Package Duration Reports</h1>
          <p className="page-subtitle">Athlete breakdown by booked package tier — with actual session days</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn btn-secondary btn-sm flex items-center gap-1">
            <Download size={13} /> Export CSV
          </button>
          <button className="btn btn-primary btn-sm flex items-center gap-1">
            <FileText size={13} /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary Tiles */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
        {grouped.map(({ pkg, meta, athletes }) => (
          <div
            key={pkg}
            className="card glass-panel text-center"
            style={{ background: meta.bg, borderColor: `${meta.color}30`, padding: "16px 12px" }}
          >
            <div className="text-2xl font-extrabold mb-1" style={{ color: meta.color }}>
              {athletes.length}
            </div>
            <div className="text-xs text-slate-300 font-bold">{meta.label}</div>
            <div className="text-[10px] text-slate-500 mt-1">{meta.days} day pkg</div>
          </div>
        ))}
      </div>

      {/* Per-package Athlete Tables */}
      {grouped.map(({ pkg, meta, athletes }) => (
        <div key={pkg} className="card" style={{ padding: 0, overflow: "hidden" }}>
          {/* Section Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: meta.bg }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${meta.color}20`, color: meta.color }}
              >
                <Package size={16} />
              </div>
              <div>
                <span className="font-bold text-white">{meta.label} Package</span>
                <span className="ml-3 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${meta.color}20`, color: meta.color }}>
                  {athletes.length} athlete{athletes.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-500">
              Booked for {meta.days} days · {Math.round(meta.days / 7)} weeks
            </span>
          </div>

          {athletes.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No athletes on this package</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Athlete</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actual Days</th>
                    <th>Sessions / Week</th>
                    <th>Sessions / Month</th>
                    <th>Used (Week)</th>
                    <th>Used (Month)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.map(a => {
                    const days = actualDays(a.startDate, a.endDate);
                    const st   = statusOf(a);
                    const weekPct  = Math.round((a.sessionsUsedThisWeek / a.sessionsPerWeek) * 100);
                    const monthPct = Math.round((a.sessionsUsedThisMonth / a.sessionsPerMonth) * 100);
                    return (
                      <tr key={a.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{a.name.charAt(0)}</div>
                            <span style={{ fontWeight: 600, color: "#f1f5f9" }}>{a.name}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: 12, color: "#94a3b8" }}>{a.startDate}</td>
                        <td style={{ fontSize: 12, color: "#94a3b8" }}>{a.endDate}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: meta.color }}>{days}</span>
                          <span style={{ fontSize: 10, color: "#64748b" }}> days</span>
                        </td>
                        <td style={{ fontWeight: 600, color: "#f1f5f9" }}>{a.sessionsPerWeek}</td>
                        <td style={{ fontWeight: 600, color: "#f1f5f9" }}>{a.sessionsPerMonth}</td>
                        {/* Week usage micro-bar */}
                        <td>
                          <div className="flex items-center gap-2">
                            <div style={{ width: 48, height: 5, background: "#1e293b", borderRadius: 9999 }}>
                              <div style={{
                                height: "100%", borderRadius: 9999,
                                background: weekPct >= 100 ? "#ef4444" : meta.color,
                                width: `${Math.min(100, weekPct)}%`
                              }} />
                            </div>
                            <span style={{ fontSize: 11, color: "#64748b" }}>{a.sessionsUsedThisWeek}/{a.sessionsPerWeek}</span>
                          </div>
                        </td>
                        {/* Month usage micro-bar */}
                        <td>
                          <div className="flex items-center gap-2">
                            <div style={{ width: 48, height: 5, background: "#1e293b", borderRadius: 9999 }}>
                              <div style={{
                                height: "100%", borderRadius: 9999,
                                background: monthPct >= 100 ? "#ef4444" : "#8b5cf6",
                                width: `${Math.min(100, monthPct)}%`
                              }} />
                            </div>
                            <span style={{ fontSize: 11, color: "#64748b" }}>{a.sessionsUsedThisMonth}/{a.sessionsPerMonth}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge capitalize ${
                            st === "active"   ? "badge-active"  :
                            st === "expired"  ? "badge-overdue" : "badge-pending"
                          }`}>
                            {st}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
