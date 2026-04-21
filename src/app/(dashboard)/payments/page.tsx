"use client";

import { Download, Filter } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockPayments = [
  { id: "PAY-001", bookingId: "BK-001", athlete: "Emma Wilson", coach: "Mike Torres", venue: "Court 1", amount: 2400, date: "20/04/26", method: "Cash" },
  { id: "PAY-002", bookingId: "BK-003", athlete: "Priya Patel", coach: "Mike Torres", venue: "Gym A", amount: 3600, date: "22/04/26", method: "Bank Transfer" },
  { id: "PAY-003", bookingId: "BK-006", athlete: "David Chen", coach: "Mike Torres", venue: "Court 1", amount: 1800, date: "10/04/26", method: "Card" },
  { id: "PAY-004", bookingId: "BK-007", athlete: "Aisha Malik", coach: "Anna Brown", venue: "Pool", amount: 2100, date: "05/04/26", method: "Bank Transfer" },
];

const revenueByVenue = [
  { venue: "Court 1", revenue: 18400 },
  { venue: "Court 2", revenue: 14200 },
  { venue: "Court 3", revenue: 22100 },
  { venue: "Pool", revenue: 9800 },
  { venue: "Gym A", revenue: 31500 },
];

export default function PaymentsPage() {
  const [filters, setFilters] = useState({ venue: "all", coach: "all", method: "all" });
  const totalRevenue = mockPayments.reduce((s, p) => s + p.amount, 0);

  const filtered = mockPayments.filter(p => {
    const matchVenue = filters.venue === "all" || p.venue === filters.venue;
    const matchCoach = filters.coach === "all" || p.coach === filters.coach;
    const matchMethod = filters.method === "all" || p.method === filters.method;
    return matchVenue && matchCoach && matchMethod;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Payments & Revenue</h1>
          <p className="page-subtitle">Track all financial transactions</p>
        </div>
        <button className="btn btn-secondary btn-sm"><Download size={13} /> Export Report</button>
      </div>

      {/* Revenue Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Revenue (Displayed)", value: `AED ${totalRevenue.toLocaleString()}`, color: "#6366f1" },
          { label: "Transactions", value: filtered.length, color: "#8b5cf6" },
          { label: "Avg. Transaction", value: `AED ${filtered.length ? Math.round(totalRevenue / filtered.length).toLocaleString() : 0}`, color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} className="card" style={{ borderColor: `${s.color}33` }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Table */}
      <div className="grid-2 mb-6">
        <div className="card">
          <div className="section-header"><span className="section-title">Revenue by Venue</span></div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByVenue} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="venue" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: "#1e2535", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#cbd5e1" }} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue (AED)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="section-header"><span className="section-title"><Filter size={14} /> Filters</span></div>
          {[
            { id: "venue", label: "Venue", options: ["all", "Court 1", "Court 2", "Court 3", "Pool", "Gym A"] },
            { id: "coach", label: "Coach", options: ["all", "Mike Torres", "Sarah Kim", "Anna Brown"] },
            { id: "method", label: "Payment Method", options: ["all", "Cash", "Card", "Bank Transfer", "Online"] },
          ].map(f => (
            <div key={f.id} style={{ marginBottom: 12 }}>
              <div className="filter-label">{f.label}</div>
              <select className="filter-select" value={filters[f.id as keyof typeof filters]} onChange={e => setFilters({ ...filters, [f.id]: e.target.value })}>
                {f.options.map(o => <option key={o} value={o}>{o === "all" ? `All ${f.label}s` : o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="card">
        <div className="section-header"><span className="section-title">💳 Transactions</span></div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>Booking</th><th>Athlete</th><th>Coach</th><th>Venue</th><th>Amount</th><th>Method</th><th>Date</th><th style={{ textAlign: "right" }}>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><span style={{ fontFamily: "monospace", color: "#818cf8", fontSize: 12 }}>{p.id}</span></td>
                  <td><span style={{ fontFamily: "monospace", color: "#64748b", fontSize: 12 }}>{p.bookingId}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar" style={{ width: 26, height: 26, fontSize: 10 }}>{p.athlete.charAt(0)}</div>
                      {p.athlete}
                    </div>
                  </td>
                  <td style={{ color: "#94a3b8" }}>{p.coach}</td>
                  <td style={{ color: "#94a3b8" }}>{p.venue}</td>
                  <td><span style={{ fontWeight: 700, color: "#4ade80" }}>AED {p.amount.toLocaleString()}</span></td>
                  <td><span style={{ fontSize: 12, color: "#94a3b8" }}>{p.method}</span></td>
                  <td style={{ fontSize: 12, color: "#64748b" }}>{p.date}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        import("@/lib/generateInvoice").then(({ generateInvoicePDF }) => {
                          generateInvoicePDF({
                            invoiceId: p.id.replace("PAY-", ""),
                            date: p.date,
                            parentName: p.athlete.split(" ")[1] + " Family", // Mock parent name
                            athleteName: p.athlete,
                            packageName: "Standard Term Booking",
                            amount: p.amount,
                            status: "Paid",
                          });
                        });
                      }}
                    >
                      <Download size={13} /> Invoice
                    </button>
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
