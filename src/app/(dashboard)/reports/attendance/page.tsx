"use client";

import React, { useState, useMemo } from "react";
import {
  Download, Filter, Search, Calendar, User, MapPin,
  CheckCircle2, XCircle, Clock, ChevronDown, FileText, Table
} from "lucide-react";
import { ATHLETES, COACHES } from "@/lib/scheduleData";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const VENUES = ["Dubai Heights Academy", "Kent College", "Sunmarke School", "Victory Heights"];
const TERMS  = ["Term 1 (Jan–Mar)", "Term 2 (Apr–Jun)", "Term 3 (Jul–Sep)", "Term 4 (Oct–Dec)"];
const SPORTS = ["Football", "Basketball", "Swimming", "Athletics", "Tennis", "Fitness"];

type AttendanceRow = {
  id: number;
  date: string;
  athlete: string;
  coach: string;
  venue: string;
  sport: string;
  term: string;
  status: "present" | "absent" | "excused";
  duration: string;
};

// Generate ~80 rows of mock data
const BASE_DATE = new Date("2026-04-01");
const mockRows: AttendanceRow[] = Array.from({ length: 80 }, (_, i) => {
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() + (i % 21));
  const athlete = ATHLETES[i % ATHLETES.length];
  const coach   = COACHES[i % COACHES.length];
  const statuses: AttendanceRow["status"][] = ["present", "present", "present", "absent", "excused"];
  return {
    id: i + 1,
    date: d.toISOString().slice(0, 10),
    athlete: athlete.name,
    coach: coach.name,
    venue: VENUES[i % VENUES.length],
    sport: SPORTS[i % SPORTS.length],
    term: TERMS[Math.floor(i / 20) % TERMS.length],
    status: statuses[i % statuses.length],
    duration: ["60 min", "90 min", "45 min"][i % 3],
  };
});

const STATUS_BADGE: Record<string, string> = {
  present: "badge-active",
  absent:  "badge-overdue",
  excused: "badge-pending",
};

export default function AttendanceReportsPage() {
  const [period, setPeriod]         = useState<"daily" | "weekly" | "monthly">("weekly");
  const [filterCoach, setFilterCoach]   = useState("all");
  const [filterVenue, setFilterVenue]   = useState("all");
  const [filterTerm, setFilterTerm]     = useState("all");
  const [filterSport, setFilterSport]   = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch]             = useState("");

  const filtered = useMemo(() => {
    return mockRows.filter(r => {
      if (filterCoach  !== "all" && r.coach  !== filterCoach)  return false;
      if (filterVenue  !== "all" && r.venue  !== filterVenue)  return false;
      if (filterTerm   !== "all" && r.term   !== filterTerm)   return false;
      if (filterSport  !== "all" && r.sport  !== filterSport)  return false;
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      if (search && !r.athlete.toLowerCase().includes(search.toLowerCase()) &&
          !r.coach.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filterCoach, filterVenue, filterTerm, filterSport, filterStatus, search]);

  const summary = useMemo(() => ({
    total:   filtered.length,
    present: filtered.filter(r => r.status === "present").length,
    absent:  filtered.filter(r => r.status === "absent").length,
    excused: filtered.filter(r => r.status === "excused").length,
    rate:    filtered.length
      ? Math.round((filtered.filter(r => r.status === "present").length / filtered.length) * 100)
      : 0,
  }), [filtered]);

  // Download stub — in production replace with exceljs / jspdf
  const handleDownload = (format: "csv" | "pdf") => {
    if (format === "csv") {
      const header = "Date,Athlete,Coach,Venue,Sport,Term,Status,Duration\n";
      const rows   = filtered.map(r =>
        `${r.date},${r.athlete},${r.coach},${r.venue},${r.sport},${r.term},${r.status},${r.duration}`
      ).join("\n");
      const blob = new Blob([header + rows], { type: "text/csv" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href = url; a.download = `attendance_${period}_report.csv`; a.click();
    } else {
      alert("PDF export will be available with jspdf integration in Phase 4.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Attendance Reports</h1>
          <p className="page-subtitle">Filter by Site · Coach · Term · Period and download</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleDownload("csv")} className="btn btn-secondary btn-sm flex items-center gap-1">
            <Table size={13} /> Export CSV
          </button>
          <button onClick={() => handleDownload("pdf")} className="btn btn-primary btn-sm flex items-center gap-1">
            <FileText size={13} /> Export PDF
          </button>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="flex items-center gap-1 bg-slate-900 border border-white/5 p-1 rounded-xl w-fit">
        {(["daily", "weekly", "monthly"] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
              period === p
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card indigo">
          <div className="kpi-icon indigo"><CheckCircle2 size={18} /></div>
          <div className="kpi-value">{summary.present}</div>
          <div className="kpi-label">Present</div>
          <div className="kpi-subtext">{summary.rate}% rate</div>
        </div>
        <div className="kpi-card rose">
          <div className="kpi-icon rose"><XCircle size={18} /></div>
          <div className="kpi-value">{summary.absent}</div>
          <div className="kpi-label">Absent</div>
          <div className="kpi-subtext">Of {summary.total} sessions</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-icon amber"><Clock size={18} /></div>
          <div className="kpi-value">{summary.excused}</div>
          <div className="kpi-label">Excused</div>
          <div className="kpi-subtext">Pre-approved</div>
        </div>
        <div className="kpi-card violet">
          <div className="kpi-icon violet"><Filter size={18} /></div>
          <div className="kpi-value">{summary.total}</div>
          <div className="kpi-label">Total Records</div>
          <div className="kpi-subtext">Filtered view</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-panel">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="filter-select pl-8"
              placeholder="Search athlete / coach…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select className="filter-select" value={filterCoach} onChange={e => setFilterCoach(e.target.value)}>
            <option value="all">All Coaches</option>
            {COACHES.map(c => <option key={c.id}>{c.name}</option>)}
          </select>

          <select className="filter-select" value={filterVenue} onChange={e => setFilterVenue(e.target.value)}>
            <option value="all">All Sites</option>
            {VENUES.map(v => <option key={v}>{v}</option>)}
          </select>

          <select className="filter-select" value={filterTerm} onChange={e => setFilterTerm(e.target.value)}>
            <option value="all">All Terms</option>
            {TERMS.map(t => <option key={t}>{t}</option>)}
          </select>

          <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="excused">Excused</option>
          </select>
        </div>
      </div>

      {/* Attendance Rate Bar */}
      <div className="card glass-panel py-3 px-4 flex items-center gap-4">
        <span className="text-xs text-slate-400 whitespace-nowrap font-bold uppercase tracking-wider">Attendance Rate</span>
        <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${summary.rate}%`,
              background: summary.rate >= 80 ? "#4ade80" : summary.rate >= 60 ? "#f59e0b" : "#ef4444"
            }}
          />
        </div>
        <span className="text-sm font-extrabold" style={{
          color: summary.rate >= 80 ? "#4ade80" : summary.rate >= 60 ? "#f59e0b" : "#ef4444"
        }}>
          {summary.rate}%
        </span>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table className="data-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Athlete</th>
                <th>Coach</th>
                <th>Sport</th>
                <th>Site / Venue</th>
                <th>Term</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#475569" }}>
                    No records match the current filters.
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: "#94a3b8", fontSize: 12 }}>{r.date}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{r.athlete.charAt(0)}</div>
                      <span style={{ fontWeight: 600, color: "#f1f5f9" }}>{r.athlete}</span>
                    </div>
                  </td>
                  <td style={{ color: "#94a3b8" }}>{r.coach}</td>
                  <td style={{ color: "#94a3b8" }}>{r.sport}</td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>{r.venue}</td>
                  <td style={{ color: "#64748b", fontSize: 11 }}>{r.term}</td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>{r.duration}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[r.status]} capitalize`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-500">Showing {filtered.length} of {mockRows.length} records</span>
          <button onClick={() => handleDownload("csv")} className="btn btn-secondary btn-sm text-xs">
            <Download size={12} /> Download filtered CSV
          </button>
        </div>
      </div>
    </div>
  );
}
