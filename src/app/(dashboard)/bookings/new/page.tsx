"use client";

import { useState } from "react";
import { Save, X, Calendar, User, UserCheck, DollarSign, MapPin, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewBookingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    athleteId: "",
    coachId: "",
    venueId: "",
    termId: "term-1",
    startDate: "",
    endDate: "",
    amount: 1500,
    paymentMethod: "cash",
    status: "pending"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    alert("Booking created successfully!");
    router.push("/bookings");
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Create New Booking</h1>
          <p className="page-subtitle">Register a new booking for an athlete</p>
        </div>
        <Link href="/bookings" className="btn btn-secondary btn-sm">
          <X size={14} /> Cancel
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid-2 mb-8">
            {/* Left Column: General Info */}
            <div style={{ display: "grid", gap: 20 }}>
              <div>
                <label className="filter-label" style={{ marginBottom: 8, display: "block" }}>
                  <User size={13} style={{ marginRight: 4 }} /> Athlete
                </label>
                <select 
                  required
                  className="filter-select" 
                  value={formData.athleteId}
                  onChange={(e) => setFormData({ ...formData, athleteId: e.target.value })}
                >
                  <option value="">Select Athlete</option>
                  <option value="1">Emma Wilson</option>
                  <option value="2">James Lee</option>
                  <option value="3">Priya Patel</option>
                </select>
              </div>

              <div>
                <label className="filter-label" style={{ marginBottom: 8, display: "block" }}>
                  <UserCheck size={13} style={{ marginRight: 4 }} /> Assigned Coach
                </label>
                <select 
                  required
                  className="filter-select" 
                  value={formData.coachId}
                  onChange={(e) => setFormData({ ...formData, coachId: e.target.value })}
                >
                  <option value="">Select Coach</option>
                  <option value="1">Mike Torres (Tennis)</option>
                  <option value="2">Sarah Kim (Swimming)</option>
                  <option value="3">Anna Brown (Athletics)</option>
                </select>
              </div>

              <div>
                <label className="filter-label" style={{ marginBottom: 8, display: "block" }}>
                  <MapPin size={13} style={{ marginRight: 4 }} /> Venue
                </label>
                <select 
                  required
                  className="filter-select" 
                  value={formData.venueId}
                  onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                >
                  <option value="">Select Venue</option>
                  <option value="1">Court 1</option>
                  <option value="2">Court 2</option>
                  <option value="4">Pool</option>
                </select>
              </div>

              <div>
                <label className="filter-label" style={{ marginBottom: 8, display: "block" }}>
                  <Tag size={13} style={{ marginRight: 4 }} /> Term
                </label>
                <select 
                  className="filter-select" 
                  value={formData.termId}
                  onChange={(e) => setFormData({ ...formData, termId: e.target.value })}
                >
                  <option value="term-1">Term 1 (Jan - Apr)</option>
                  <option value="term-2">Term 2 (May - Aug)</option>
                  <option value="term-3">Term 3 (Sep - Dec)</option>
                </select>
              </div>
            </div>

            {/* Right Column: Date & Financials */}
            <div style={{ display: "grid", gap: 20 }}>
              <div>
                <label className="filter-label" style={{ marginBottom: 8, display: "block" }}>
                  <Calendar size={13} style={{ marginRight: 4 }} /> Start Date
                </label>
                <input 
                  type="date" 
                  className="input" 
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div>
                <label className="filter-label" style={{ marginBottom: 8, display: "block" }}>
                  <Calendar size={13} style={{ marginRight: 4 }} /> End Date
                </label>
                <input 
                  type="date" 
                  className="input" 
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>

              <div>
                <label className="filter-label" style={{ marginBottom: 8, display: "block" }}>
                  <DollarSign size={13} style={{ marginRight: 4 }} /> Amount (AED)
                </label>
                <input 
                  type="number" 
                  className="input" 
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="filter-label" style={{ marginBottom: 8, display: "block" }}>
                  Payment Method
                </label>
                <div className="flex gap-2">
                  {['cash', 'card', 'bank'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method })}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 8,
                        fontSize: 12,
                        textTransform: "capitalize",
                        fontWeight: 600,
                        border: "1px solid #1e293b",
                        background: formData.paymentMethod === method ? "#4f46e5" : "#0f172a",
                        color: formData.paymentMethod === method ? "#fff" : "#94a3b8",
                        transition: "all 0.2s"
                      }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #1e293b", paddingTop: 24, display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button type="button" className="btn btn-secondary" onClick={() => router.push("/bookings")}>Discard</button>
            <button type="submit" className="btn btn-primary" style={{ padding: "0 32px" }}>
              <Save size={14} /> Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
