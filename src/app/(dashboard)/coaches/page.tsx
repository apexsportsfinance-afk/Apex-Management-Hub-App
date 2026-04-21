"use client";

import { Plus } from "lucide-react";

const coaches = [
  { id: 1, name: "Mike Torres", email: "mike@apex.com", specialty: "Tennis", status: "active", athletes: 22 },
  { id: 2, name: "Sarah Kim", email: "sarah@apex.com", specialty: "Swimming", status: "active", athletes: 18 },
  { id: 3, name: "Anna Brown", email: "anna@apex.com", specialty: "Athletics", status: "active", athletes: 14 },
  { id: 4, name: "John Parker", email: "john@apex.com", specialty: "Fitness", status: "inactive", athletes: 4 },
];

export default function CoachesPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Coaches</h1>
          <p className="page-subtitle">{coaches.length} coaches registered</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={13} /> Add Coach</button>
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Specialty</th><th>Athletes</th><th>Status</th></tr></thead>
            <tbody>
              {coaches.map(c => (
                <tr key={c.id}>
                  <td style={{ color: "#475569", fontSize: 12 }}>{c.id}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, background: "linear-gradient(135deg,#8b5cf6,#6366f1)" }}>{c.name.charAt(0)}</div>
                      {c.name}
                    </div>
                  </td>
                  <td style={{ color: "#64748b", fontSize: 13 }}>{c.email}</td>
                  <td><span style={{ fontSize: 12, color: "#a78bfa", background: "rgba(139,92,246,0.12)", padding: "2px 10px", borderRadius: 20, border: "1px solid rgba(139,92,246,0.2)" }}>{c.specialty}</span></td>
                  <td><span style={{ fontSize: 13, color: "#818cf8", fontWeight: 600 }}>{c.athletes}</span></td>
                  <td>
                    <span className={`badge ${c.status === "active" ? "badge-paid" : "badge-cancelled"}`}>
                      {c.status === "active" ? "● Active" : "✕ Inactive"}
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
