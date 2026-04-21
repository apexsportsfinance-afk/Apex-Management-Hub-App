"use client";

import { Bell, Search, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="flex items-center gap-3">
        <div style={{ position: "relative" }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#475569",
            }}
          />
          <input
            type="text"
            placeholder="Search bookings, athletes..."
            className="input"
            style={{ paddingLeft: "32px", width: "260px", height: "36px" }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "8px",
            cursor: "pointer",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bell size={16} />
          <span
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              width: "7px",
              height: "7px",
              background: "#f43f5e",
              borderRadius: "50%",
              border: "1.5px solid #0f1117",
            }}
          />
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="avatar">A</div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0" }}>
              Admin
            </div>
            <div style={{ fontSize: "11px", color: "#475569" }}>
              apex@sports.com
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
