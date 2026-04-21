"use client";

import { useState } from "react";
import {
  CalendarDays,
  Users,
  AlertCircle,
  TrendingUp,
  Eye,
  Pencil,
  Trash2,
  Download,
  Plus,
  Filter,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,

  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import HierarchicalFilter from "@/components/HierarchicalFilter";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const revenueByVenue = [
  { venue: "Court 1", revenue: 18400, bookings: 48 },
  { venue: "Court 2", revenue: 14200, bookings: 37 },
  { venue: "Court 3", revenue: 22100, bookings: 55 },
  { venue: "Pool", revenue: 9800, bookings: 26 },
  { venue: "Gym A", revenue: 31500, bookings: 82 },
];

const recentBookings = [
  { id: "BK-001", athlete: "Emma Wilson", coach: "Mike Torres", venue: "Court 1", start: "20/04/26", end: "20/05/26", status: "paid" },
  { id: "BK-002", athlete: "James Lee", coach: "Sarah Kim", venue: "Court 2", start: "21/04/26", end: "21/06/26", status: "pending" },
  { id: "BK-003", athlete: "Priya Patel", coach: "Mike Torres", venue: "Gym A", start: "22/04/26", end: "22/07/26", status: "paid" },
  { id: "BK-004", athlete: "Carlos Ruiz", coach: "Anna Brown", venue: "Pool", start: "18/04/26", end: "18/05/26", status: "overdue" },
  { id: "BK-005", athlete: "Sophie Hart", coach: "Sarah Kim", venue: "Court 3", start: "15/04/26", end: "15/04/26", status: "cancelled" },
];

const expiryAlerts = [
  { id: "BK-045", athlete: "Tom Baker", coach: "Mike Torres", venue: "Court 3", expiry: "22/04/26", days: 2 },
  { id: "BK-078", athlete: "Layla Nour", coach: "Anna Brown", venue: "Court 1", expiry: "24/04/26", days: 4 },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1e2535", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px" }}>
        <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.fill === "#6366f1" ? "#818cf8" : "#a78bfa", fontSize: 13, fontWeight: 600 }}>
            {p.dataKey === "revenue" ? `AED ${p.value.toLocaleString()}` : `${p.value} bookings`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "badge-paid",
    pending: "badge-pending",
    overdue: "badge-overdue",
    cancelled: "badge-cancelled",
  };
  const label: Record<string, string> = { paid: "✓ Paid", pending: "● Pending", overdue: "⚠ Overdue", cancelled: "✕ Cancelled" };
  return <span className={`badge ${map[status] ?? ""} draggable-badge`}>{label[status] ?? status}</span>;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon, value, label, sub, color, href }: { icon: React.ReactNode; value: string | number; label: string; sub: string; color: "indigo" | "violet" | "rose" | "amber"; href?: string }) {
  const CardContent = (
    <div className={`kpi-card ${color}`}>
      <div className={`kpi-icon ${color}`}>{icon}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-subtext">{sub}</div>
      {href && <div style={{ position: "absolute", right: 16, bottom: 16, opacity: 0.3 }}><ArrowRight size={14} /></div>}
    </div>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: "none" }}>{CardContent}</Link>;
  }
  return CardContent;
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const totalRevenue = revenueByVenue.reduce((s, v) => s + v.revenue, 0);

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Monday, 20 April 2026 — Live overview</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary btn-sm">
            <Download size={13} /> Export
          </button>
          <Link href="/bookings/new" className="btn btn-primary btn-sm">
            <Plus size={13} /> New Booking
          </Link>
        </div>
      </div>

      {/* Filter Panel */}
      <HierarchicalFilter />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard icon={<CalendarDays size={20} />} value="245" label="Total Bookings" sub="↑ 12% from last month" color="indigo" href="/bookings" />
        <KpiCard icon={<Users size={20} />} value="89" label="Active Athletes" sub="↑ 5 new this week" color="violet" href="/athletes" />
        <KpiCard icon={<TrendingUp size={20} />} value={`AED ${(totalRevenue / 1000).toFixed(0)}K`} label="Total Revenue" sub="↑ 18% year on year" color="amber" href="/payments" />
        <KpiCard icon={<AlertCircle size={20} />} value={expiryAlerts.length} label="Expiring (7 Days)" sub="Immediate action needed" color="rose" href="/expiry" />
      </div>

      {/* Charts + Expiry Panel */}
      <div className="grid-2 mb-6">
        {/* Revenue Chart */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">💰 Revenue by Venue</span>
            <span style={{ fontSize: 12, color: "#475569" }}>Financial Year 2026</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByVenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="venue" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#64748b" }} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue (AED)" />
                <Bar dataKey="bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expiry Alerts Panel */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">⚠️ Expiry Alerts</span>
            <a href="/expiry" className="btn btn-secondary btn-sm" style={{ textDecoration: "none" }}>View All</a>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              {[
                { label: "Critical (7d)", value: 12, color: "#f43f5e" },
                { label: "Warning (30d)", value: 45, color: "#f59e0b" },
              ].map((s) => (
                <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 14px", border: `1px solid ${s.color}22` }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {expiryAlerts.map((a) => (
                <div key={a.id} className="card alert-critical" style={{ padding: "10px 14px", marginBottom: 0 }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{a.athlete}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{a.venue} · {a.coach}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#fb7185", fontWeight: 700 }}>{a.days} days</div>
                      <div style={{ fontSize: 10, color: "#475569" }}>{a.expiry}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary w-full" style={{ justifyContent: "center", marginTop: 4 }}>
            Send Renewal Reminders
          </button>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">📅 Recent Bookings</span>
          <a href="/bookings" className="btn btn-secondary btn-sm" style={{ textDecoration: "none" }}>View All →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Athlete</th>
                <th>Coach</th>
                <th>Venue</th>
                <th>Period</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <span style={{ fontFamily: "monospace", color: "#818cf8", fontSize: 12 }}>{b.id}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {b.athlete.charAt(0)}
                      </div>
                      {b.athlete}
                    </div>
                  </td>
                  <td style={{ color: "#94a3b8" }}>{b.coach}</td>
                  <td style={{ color: "#94a3b8" }}>{b.venue}</td>
                  <td style={{ fontSize: 12, color: "#64748b" }}>{b.start} – {b.end}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="btn btn-secondary btn-sm" style={{ padding: "4px 8px" }}><Eye size={12} /></button>
                      <button className="btn btn-secondary btn-sm" style={{ padding: "4px 8px" }}><Pencil size={12} /></button>
                      <button className="btn btn-danger btn-sm" style={{ padding: "4px 8px" }}><Trash2 size={12} /></button>
                    </div>
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
