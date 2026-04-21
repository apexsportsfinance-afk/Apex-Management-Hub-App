"use client";

import { useState } from "react";
import { Plus, Search, Filter, Calendar, MapPin, Users as UsersIcon, Clock } from "lucide-react";
import { CLASSES, COACHES } from "@/lib/scheduleData";

export default function ClassesPage() {
  const [search, setSearch] = useState("");

  const filtered = CLASSES.filter((c) => {
    const coach = COACHES.find(coach => coach.id === c.coachId);
    const q = search.toLowerCase();
    return !q || 
      c.name.toLowerCase().includes(q) || 
      coach?.name.toLowerCase().includes(q) ||
      c.venue.toLowerCase().includes(q);
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Classes & Sessions</h1>
          <p className="page-subtitle">Manage recurring sports classes and attendance</p>
        </div>
        <button className="btn btn-primary btn-sm">
          <Plus size={13} /> Create Class
        </button>
      </div>

      <div className="filter-panel mb-6">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
            <input 
              className="input" 
              placeholder="Search by class, coach, or venue..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ paddingLeft: 30, height: 36 }} 
            />
          </div>
          <div>
            <select className="filter-select">
              <option value="all">All Sports</option>
              <option value="tennis">Tennis</option>
              <option value="swimming">Swimming</option>
              <option value="fitness">Fitness</option>
            </select>
          </div>
          <div>
            <select className="filter-select">
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <select className="filter-select">
              <option value="all">All Days</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
        {filtered.map((c) => {
          const coach = COACHES.find(coach => coach.id === c.coachId);
          const occupancy = (c.enrolled / c.capacity) * 100;

          return (
            <div key={c.id} className="card hover-trigger" style={{ borderLeft: `4px solid ${coach?.color ?? "#6366f1"}` }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{c.name}</h3>
                  <span style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.term} · {c.level}</span>
                </div>
                <div className="avatar" style={{ background: coach?.color }}>{coach?.avatar}</div>
              </div>

              <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
                <div className="flex items-center gap-2" style={{ fontSize: 13, color: "#cbd5e1" }}>
                  <Calendar size={14} style={{ color: "#64748b" }} />
                  {c.day} · {c.startTime} – {c.endTime}
                </div>
                <div className="flex items-center gap-2" style={{ fontSize: 13, color: "#cbd5e1" }}>
                  <Clock size={14} style={{ color: "#64748b" }} />
                  Coach: <span style={{ fontWeight: 600 }}>{coach?.name}</span>
                </div>
                <div className="flex items-center gap-2" style={{ fontSize: 13, color: "#cbd5e1" }}>
                  <MapPin size={14} style={{ color: "#64748b" }} />
                  {c.venue}
                </div>
                <div className="flex items-center gap-2" style={{ fontSize: 13, color: "#cbd5e1" }}>
                  <UsersIcon size={14} style={{ color: "#64748b" }} />
                  Enrolled: <span style={{ fontWeight: 600 }}>{c.enrolled} / {c.capacity}</span>
                </div>
              </div>

              <div style={{ background: "rgba(30, 41, 59, 0.5)", height: 6, borderRadius: 10, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ 
                  width: `${occupancy}%`, 
                  height: "100%", 
                  background: occupancy > 80 ? "#ef4444" : occupancy > 50 ? "#f59e0b" : "#4ade80",
                  transition: "width 0.3s ease"
                }} />
              </div>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: 11, color: "#64748b" }}>Occupancy: {Math.round(occupancy)}%</span>
                <button className="btn btn-secondary btn-sm" style={{ padding: "4px 12px", fontSize: 11 }}>View Roster</button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🎾</div>
          <div className="empty-state-text">No classes match your search</div>
        </div>
      )}
    </>
  );
}
