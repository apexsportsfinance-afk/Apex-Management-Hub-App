"use client";

import { Users, Plus } from "lucide-react";

const athletes = [
  { id: 1, name: "Emma Wilson", email: "emma@example.com", phone: "+971 50 123 4567", status: "active", bookings: 5 },
  { id: 2, name: "James Lee", email: "james@example.com", phone: "+971 50 234 5678", status: "active", bookings: 3 },
  { id: 3, name: "Priya Patel", email: "priya@example.com", phone: "+971 50 345 6789", status: "active", bookings: 7 },
  { id: 4, name: "Carlos Ruiz", email: "carlos@example.com", phone: "+971 50 456 7890", status: "inactive", bookings: 1 },
  { id: 5, name: "Sophie Hart", email: "sophie@example.com", phone: "+971 50 567 8901", status: "active", bookings: 4 },
];

export default function AthletesPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Athletes</h1>
          <p className="page-subtitle">{athletes.length} registered athletes</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={13} /> Add Athlete</button>
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Bookings</th><th>Status</th></tr></thead>
            <tbody>
              {athletes.map(a => (
                <tr key={a.id}>
                  <td style={{ color: "#475569", fontSize: 12 }}>{a.id}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{a.name.charAt(0)}</div>
                      {a.name}
                    </div>
                  </td>
                  <td style={{ color: "#64748b", fontSize: 13 }}>{a.email}</td>
                  <td style={{ color: "#64748b", fontSize: 13 }}>{a.phone}</td>
                  <td><span style={{ fontSize: 13, color: "#818cf8", fontWeight: 600 }}>{a.bookings}</span></td>
                  <td>
                    <span className={`badge ${a.status === "active" ? "badge-paid" : "badge-cancelled"}`}>
                      {a.status === "active" ? "● Active" : "✕ Inactive"}
                    </span>
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
