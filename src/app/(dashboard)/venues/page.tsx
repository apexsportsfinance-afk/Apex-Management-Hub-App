"use client";

import { Plus } from "lucide-react";

const venues = [
  { id: 1, name: "Court 1", location: "Main Building, Level 1", capacity: 30, status: "active", bookings: 48 },
  { id: 2, name: "Court 2", location: "Main Building, Level 1", capacity: 30, status: "active", bookings: 37 },
  { id: 3, name: "Court 3", location: "Main Building, Level 2", capacity: 25, status: "active", bookings: 55 },
  { id: 4, name: "Pool", location: "Outdoor Complex", capacity: 50, status: "active", bookings: 26 },
  { id: 5, name: "Gym A", location: "Fitness Centre", capacity: 40, status: "maintenance", bookings: 82 },
];

const statusMap: Record<string, string> = { active: "badge-paid", maintenance: "badge-pending", closed: "badge-cancelled" };
const statusLabel: Record<string, string> = { active: "● Active", maintenance: "⚙ Maintenance", closed: "✕ Closed" };

export default function VenuesPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Venues</h1>
          <p className="page-subtitle">{venues.length} facilities managed</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={13} /> Add Venue</button>
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>#</th><th>Venue</th><th>Location</th><th>Capacity</th><th>Bookings</th><th>Status</th></tr></thead>
            <tbody>
              {venues.map(v => (
                <tr key={v.id}>
                  <td style={{ color: "#475569", fontSize: 12 }}>{v.id}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 28, height: 28, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏢</div>
                      <span style={{ fontWeight: 600, color: "#e2e8f0" }}>{v.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "#64748b", fontSize: 13 }}>{v.location}</td>
                  <td><span style={{ fontSize: 13, color: "#94a3b8" }}>{v.capacity} pax</span></td>
                  <td><span style={{ fontSize: 13, color: "#818cf8", fontWeight: 600 }}>{v.bookings}</span></td>
                  <td><span className={`badge ${statusMap[v.status]}`}>{statusLabel[v.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
