"use client";

import { useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2, Download, Filter } from "lucide-react";
import Link from "next/link";


const mockBookings = [
  { id: "BK-001", athlete: "Emma Wilson", coach: "Mike Torres", venue: "Court 1", term: "Term 1", start: "20/04/26", end: "20/05/26", status: "paid", method: "Cash" },
  { id: "BK-002", athlete: "James Lee", coach: "Sarah Kim", venue: "Court 2", term: "Term 1", start: "21/04/26", end: "21/06/26", status: "pending", method: "Card" },
  { id: "BK-003", athlete: "Priya Patel", coach: "Mike Torres", venue: "Gym A", term: "Term 2", start: "22/04/26", end: "22/07/26", status: "paid", method: "Bank Transfer" },
  { id: "BK-004", athlete: "Carlos Ruiz", coach: "Anna Brown", venue: "Pool", term: "Term 1", start: "18/04/26", end: "18/05/26", status: "overdue", method: "Cash" },
  { id: "BK-005", athlete: "Sophie Hart", coach: "Sarah Kim", venue: "Court 3", term: "Term 3", start: "15/04/26", end: "15/04/26", status: "cancelled", method: "Online" },
  { id: "BK-006", athlete: "David Chen", coach: "Mike Torres", venue: "Court 1", term: "Term 2", start: "10/04/26", end: "10/06/26", status: "paid", method: "Card" },
  { id: "BK-007", athlete: "Aisha Malik", coach: "Anna Brown", venue: "Pool", term: "Term 1", start: "05/04/26", end: "05/07/26", status: "paid", method: "Bank Transfer" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { paid: "badge-paid", pending: "badge-pending", overdue: "badge-overdue", cancelled: "badge-cancelled" };
  const label: Record<string, string> = { paid: "✓ Paid", pending: "● Pending", overdue: "⚠ Overdue", cancelled: "✕ Cancelled" };
  return <span className={`badge ${map[status] ?? ""}`}>{label[status] ?? status}</span>;
}

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ year: "2026", month: "all", venue: "all", coach: "all", status: "all", term: "all" });

  const filtered = mockBookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.athlete.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.coach.toLowerCase().includes(q);
    const matchVenue = filters.venue === "all" || b.venue === filters.venue;
    const matchStatus = filters.status === "all" || b.status === filters.status;
    const matchCoach = filters.coach === "all" || b.coach === filters.coach;
    const matchTerm = filters.term === "all" || b.term === filters.term;
    return matchSearch && matchVenue && matchStatus && matchCoach && matchTerm;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="page-subtitle">Showing {filtered.length} of {mockBookings.length} bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary btn-sm"><Download size={13} /> Export CSV</button>
          <Link href="/bookings/new" className="btn btn-primary btn-sm">
            <Plus size={13} /> New Booking
          </Link>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="filter-panel mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} style={{ color: "#6366f1" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>Filters</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(5, 1fr)", gap: 12 }}>
          <div>
            <div className="filter-label">Search</div>
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
              <input className="input" placeholder="Athlete, ID, coach..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 30, height: 36 }} />
            </div>
          </div>
          {[
            { id: "venue", label: "Venue", options: ["all", "Court 1", "Court 2", "Court 3", "Pool", "Gym A"] },
            { id: "coach", label: "Coach", options: ["all", "Mike Torres", "Sarah Kim", "Anna Brown"] },
            { id: "term", label: "Term", options: ["all", "Term 1", "Term 2", "Term 3"] },
            { id: "status", label: "Status", options: ["all", "paid", "pending", "overdue", "cancelled"] },
            { id: "year", label: "Year", options: ["2026", "2025", "2024"] },
          ].map(f => (
            <div key={f.id}>
              <div className="filter-label">{f.label}</div>
              <select className="filter-select" value={filters[f.id as keyof typeof filters]} onChange={e => setFilters({ ...filters, [f.id]: e.target.value })}>
                {f.options.map(o => <option key={o} value={o}>{o === "all" ? `All ${f.label}s` : o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Athlete</th>
                <th>Coach</th>
                <th>Venue</th>
                <th>Term</th>
                <th>Period</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td><span style={{ fontFamily: "monospace", color: "#818cf8", fontSize: 12 }}>{b.id}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{b.athlete.charAt(0)}</div>
                      {b.athlete}
                    </div>
                  </td>
                  <td style={{ color: "#94a3b8" }}>{b.coach}</td>
                  <td style={{ color: "#94a3b8" }}>{b.venue}</td>
                  <td><span style={{ fontSize: 12, color: "#64748b" }}>{b.term}</span></td>
                  <td style={{ fontSize: 12, color: "#64748b" }}>{b.start} – {b.end}</td>
                  <td><span style={{ fontSize: 12, color: "#94a3b8" }}>{b.method}</span></td>
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
          {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-text">No bookings match your filters</div></div>}
        </div>
      </div>
    </>
  );
}
