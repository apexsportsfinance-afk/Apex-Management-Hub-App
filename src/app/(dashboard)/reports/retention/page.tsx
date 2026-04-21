"use client";

import React, { useMemo } from "react";
import {
  RefreshCcw, UserX, TrendingUp, Package, Download,
  ChevronRight, Users, AlertTriangle, FileText
} from "lucide-react";
import { ATHLETES, AthleteRecord } from "@/lib/scheduleData";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const today = new Date("2026-04-21");

// For demo: "renewed" if package hasn't expired and they've been active > 30 days
function derivedRetention(a: AthleteRecord) {
  const start    = new Date(a.startDate);
  const end      = new Date(a.endDate);
  const daysLeft = Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const daysIn   = Math.round((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = today > end;
  const isActive  = !isExpired && today >= start;
  const renewedLabel = daysIn > 20 && isActive ? "renewed" : isExpired ? "churned" : "new";
  return { daysLeft, daysIn, isExpired, isActive, renewedLabel };
}

const PACKAGE_COLORS: Record<string, string> = {
  "15d": "#f59e0b", "30d": "#8b5cf6", "1mo": "#6366f1",
  "2mo": "#ec4899", "3mo": "#0ea5e9", "6mo": "#4ade80",
};

export default function RetentionReportPage() {
  const athletesWithStatus = useMemo(() =>
    ATHLETES.map(a => ({ ...a, ...derivedRetention(a) })),
    []
  );

  const renewed = athletesWithStatus.filter(a => a.renewedLabel === "renewed");
  const churned = athletesWithStatus.filter(a => a.renewedLabel === "churned");
  const newAthletes = athletesWithStatus.filter(a => a.renewedLabel === "new");

  const retentionRate = ATHLETES.length > 0
    ? Math.round((renewed.length / ATHLETES.length) * 100)
    : 0;

  // Group churned by package type for insight
  const churnByPackage = useMemo(() => {
    const groups: Record<string, number> = {};
    churned.forEach(a => {
      groups[a.packageType] = (groups[a.packageType] ?? 0) + 1;
    });
    return groups;
  }, [churned]);

  const exportCSV = () => {
    const header = "Name,Package,Start,End,Days In,Days Left,Status\n";
    const rows = athletesWithStatus.map(a =>
      `${a.name},${a.packageType},${a.startDate},${a.endDate},${a.daysIn},${a.daysLeft},${a.renewedLabel}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "retention_report.csv"; link.click();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Athlete Retention Report</h1>
          <p className="page-subtitle">Track renewals, churn, and new enrollments by package type</p>
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

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card indigo">
          <div className="kpi-icon indigo"><RefreshCcw size={18} /></div>
          <div className="kpi-value">{renewed.length}</div>
          <div className="kpi-label">Renewed</div>
          <div className="kpi-subtext">{retentionRate}% retention rate</div>
        </div>
        <div className="kpi-card rose">
          <div className="kpi-icon rose"><UserX size={18} /></div>
          <div className="kpi-value">{churned.length}</div>
          <div className="kpi-label">Churned</div>
          <div className="kpi-subtext">Package expired, not renewed</div>
        </div>
        <div className="kpi-card violet">
          <div className="kpi-icon violet"><Users size={18} /></div>
          <div className="kpi-value">{newAthletes.length}</div>
          <div className="kpi-label">New Enrollments</div>
          <div className="kpi-subtext">Started recently</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-icon amber"><TrendingUp size={18} /></div>
          <div className="kpi-value">{retentionRate}%</div>
          <div className="kpi-label">Retention Rate</div>
          <div className="kpi-subtext">Target: 80%</div>
        </div>
      </div>

      {/* Retention Rate Bar */}
      <div className="card glass-panel py-3 px-4 flex items-center gap-4">
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider whitespace-nowrap">Retention Rate</span>
        <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${retentionRate}%`,
              background: retentionRate >= 80 ? "#4ade80" : retentionRate >= 60 ? "#f59e0b" : "#ef4444"
            }}
          />
        </div>
        <span className="font-extrabold text-sm" style={{ color: retentionRate >= 80 ? "#4ade80" : "#f59e0b" }}>
          {retentionRate}%
        </span>
        {retentionRate < 80 && (
          <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
            <AlertTriangle size={12} /> Below Target
          </span>
        )}
      </div>

      {/* Churn by Package Insight */}
      {churned.length > 0 && (
        <div className="card glass-panel border-rose-500/10">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-rose-400" />
            <h3 className="text-sm font-bold text-white">Churn Breakdown by Package</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {Object.entries(churnByPackage).map(([pkg, count]) => (
              <div key={pkg} className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: `${PACKAGE_COLORS[pkg]}30`, background: `${PACKAGE_COLORS[pkg]}08` }}>
                <span style={{ color: PACKAGE_COLORS[pkg], fontWeight: 700 }}>{count}</span>
                <span className="text-xs text-slate-400">{pkg} churned</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Three-panel athlete tables */}
      <div className="grid gap-6">
        {[
          { label: "✅ Renewed Athletes", list: renewed, badgeClass: "badge-active", color: "#4ade80" },
          { label: "⚠️ Churned Athletes",  list: churned,  badgeClass: "badge-overdue", color: "#ef4444" },
          { label: "🆕 New Enrollments",   list: newAthletes, badgeClass: "badge-pending", color: "#f59e0b" },
        ].map(({ label, list, badgeClass, color }) => (
          <div key={label} className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <span className="font-bold text-white">{label}</span>
              <span className={`badge ${badgeClass}`}>{list.length} athletes</span>
            </div>
            {list.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No athletes in this category</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Athlete</th>
                      <th>Package</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Days Active</th>
                      <th>Days Left</th>
                      <th>Sessions/Week</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(a => (
                      <tr key={a.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{a.name.charAt(0)}</div>
                            <span style={{ fontWeight: 600, color: "#f1f5f9" }}>{a.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{ background: `${PACKAGE_COLORS[a.packageType]}15`, color: PACKAGE_COLORS[a.packageType] }}>
                            <Package size={9} /> {a.packageType}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: "#94a3b8" }}>{a.startDate}</td>
                        <td style={{ fontSize: 12, color: "#94a3b8" }}>{a.endDate}</td>
                        <td style={{ fontWeight: 700, color }}>
                          {Math.max(0, a.daysIn)}d
                        </td>
                        <td style={{ fontSize: 12, color: a.daysLeft < 7 ? "#ef4444" : "#64748b" }}>
                          {a.daysLeft > 0 ? `${a.daysLeft}d` : "Expired"}
                        </td>
                        <td style={{ fontWeight: 600, color: "#f1f5f9" }}>{a.sessionsPerWeek}</td>
                        <td>
                          <span className={`badge ${badgeClass} capitalize`}>{a.renewedLabel}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
