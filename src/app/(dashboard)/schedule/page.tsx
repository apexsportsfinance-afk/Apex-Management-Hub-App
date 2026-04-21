"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, Filter, Search, Calendar as CalendarIcon, Clock, Users as UsersIcon, Copy } from "lucide-react";
import Link from "next/link";
import { CLASSES, COACHES, DAYS } from "@/lib/scheduleData";

export default function SchedulePage() {
  const [selectedCoachId, setSelectedCoachId] = useState<number | "all">("all");
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);

  const filteredClasses = CLASSES.filter(c => {
    return (selectedCoachId === "all" || c.coachId === selectedCoachId) && c.day === selectedDay;
  });

  const getCoach = (id: number) => COACHES.find(c => c.id === id);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Coach Schedules</h1>
          <p className="page-subtitle">Weekly timetable and roster distribution</p>
        </div>
        <div className="flex gap-2">
          <Link href="/schedule/templates" className="btn btn-secondary btn-sm">
            <Copy size={13} /> Manage Templates
          </Link>
          <button className="btn btn-secondary btn-sm">
            <Download size={13} /> Download PDF
          </button>
          <button className="btn btn-primary btn-sm">
            Print Weekly
          </button>
        </div>
      </div>

      <div className="filter-panel mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="flex bg-[#0f172a] rounded-lg p-1 border border-[#1e293b]">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: "6px 16px",
                    fontSize: 13,
                    borderRadius: 6,
                    fontWeight: 600,
                    transition: "all 0.2s",
                    background: selectedDay === day ? "#4f46e5" : "transparent",
                    color: selectedDay === day ? "#fff" : "#94a3b8",
                  }}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
            
            <div style={{ minWidth: 200 }}>
              <select 
                className="filter-select"
                value={selectedCoachId}
                onChange={(e) => setSelectedCoachId(e.target.value === "all" ? "all" : Number(e.target.value))}
              >
                <option value="all">All Coaches</option>
                {COACHES.map(coach => (
                  <option key={coach.id} value={coach.id}>{coach.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ position: "relative" }}>
             <span style={{ fontSize: 13, color: "#64748b" }}>Showing schedule for: <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{selectedDay}</span></span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table className="data-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: "100px" }}>Time</th>
                {selectedCoachId === "all" ? (
                  COACHES.map(coach => (
                    <th key={coach.id} style={{ textAlign: "center", borderLeft: "1px solid #1e293b" }}>
                      <div className="flex flex-col items-center gap-1">
                        <div className="avatar" style={{ background: coach.color, width: 28, height: 28, fontSize: 12 }}>{coach.avatar}</div>
                        <span style={{ fontSize: 11 }}>{coach.name}</span>
                      </div>
                    </th>
                  ))
                ) : (
                  <th style={{ textAlign: "center", borderLeft: "1px solid #1e293b" }}>
                    {getCoach(Number(selectedCoachId))?.name}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {/* This is a simplified grid view for the demo */}
              {[
                "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", 
                "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
              ].map(time => (
                <tr key={time} style={{ height: 80 }}>
                  <td style={{ verticalAlign: "top", fontSize: 12, color: "#64748b", fontWeight: 700 }}>{time}</td>
                  {(selectedCoachId === "all" ? COACHES : [getCoach(Number(selectedCoachId))]).map(coach => {
                    if (!coach) return null;
                    const session = filteredClasses.find(c => c.coachId === coach.id && c.startTime.startsWith(time.split(":")[0]));
                    
                    return (
                      <td key={coach.id} style={{ borderLeft: "1px solid #1e293b", position: "relative" }}>
                        {session ? (
                          <div 
                            style={{ 
                              position: "absolute", 
                              inset: "4px", 
                              background: `${coach.color}15`, 
                              border: `1px solid ${coach.color}40`,
                              borderLeft: `3px solid ${coach.color}`,
                              borderRadius: 4,
                              padding: "6px 10px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              cursor: "pointer"
                            }}
                          >
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: "#f8fafc", lineHeight: 1.2 }}>{session.name}</div>
                              <div style={{ fontSize: 10, color: "#94a3b8", display: "flex", alignItems: "center", gap: 3 }}>
                                <Clock size={10} /> {session.startTime} - {session.endTime}
                              </div>
                            </div>
                            <div className="flex justify-between items-end">
                              <span style={{ fontSize: 10, color: coach.color, fontWeight: 600 }}>{session.venue}</span>
                              <div className="flex items-center gap-1" style={{ fontSize: 10, color: "#64748b" }}>
                                <UsersIcon size={10} /> {session.enrolled}/{session.capacity}
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
