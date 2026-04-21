"use client";

import { AlertCircle, Bell, CreditCard, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { generateInvoicePDF } from "@/lib/generateInvoice";

const initialCritical = [
  { id: "BK-045", athlete: "Emma Watson", coach: "John Parker", venue: "Court 3", expiry: "22/04/26", days: 2, amount: 2400 },
  { id: "BK-078", athlete: "Mark Simmons", coach: "Lisa Marsh", venue: "Court 1", expiry: "24/04/26", days: 4, amount: 1800 },
  { id: "BK-102", athlete: "Lina Chen", coach: "Mike Torres", venue: "Gym A", expiry: "25/04/26", days: 5, amount: 3600 },
];

const initialWarning = [
  { id: "BK-089", athlete: "Jane Doe", coach: "Mike Torres", venue: "Court 2", expiry: "15/05/26", days: 25, amount: 2400 },
  { id: "BK-091", athlete: "Ryan Park", coach: "Sarah Kim", venue: "Pool", expiry: "18/05/26", days: 28, amount: 2100 },
  { id: "BK-095", athlete: "Nour Ali", coach: "Anna Brown", venue: "Court 1", expiry: "20/05/26", days: 30, amount: 1800 },
];

export default function ExpiryPage() {
  const [critical, setCritical] = useState(initialCritical);
  const [warning, setWarning] = useState(initialWarning);
  
  const [checkoutItem, setCheckoutItem] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Generate Invoice
      generateInvoicePDF({
        invoiceId: `RNW-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toLocaleDateString(),
        parentName: checkoutItem.athlete.split(" ")[1] + " Family",
        athleteName: checkoutItem.athlete,
        packageName: "Term Renewal Package",
        amount: checkoutItem.amount,
        status: "Paid"
      });

      // Remove item from lists after 2s
      setTimeout(() => {
        setCritical(c => c.filter(x => x.id !== checkoutItem.id));
        setWarning(w => w.filter(x => x.id !== checkoutItem.id));
        setIsSuccess(false);
        setCheckoutItem(null);
      }, 2000);

    }, 2000); // 2 second mock process
  };

  const ExpiryRow = ({ item, isCriticalState }: { item: any; isCriticalState: boolean }) => (
    <tr>
      <td><span style={{ fontFamily: "monospace", color: "#818cf8", fontSize: 12 }}>{item.id}</span></td>
      <td>
        <div className="flex items-center gap-2">
          <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, background: isCriticalState ? "rgba(244,63,94,0.2)" : "rgba(245,158,11,0.2)", color: isCriticalState ? "#fb7185" : "#fbbf24" }}>{item.athlete.charAt(0)}</div>
          {item.athlete}
        </div>
      </td>
      <td style={{ color: "#94a3b8" }}>{item.coach}</td>
      <td style={{ color: "#94a3b8" }}>{item.venue}</td>
      <td style={{ fontSize: 12, color: "#64748b" }}>{item.expiry}</td>
      <td>
        <span className="badge" style={{ background: isCriticalState ? "rgba(244,63,94,0.12)" : "rgba(245,158,11,0.12)", color: isCriticalState ? "#fb7185" : "#fbbf24", border: `1px solid ${isCriticalState ? "rgba(244,63,94,0.2)" : "rgba(245,158,11,0.2)"}` }}>
          {item.days} day{item.days !== 1 ? "s" : ""} left
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary btn-sm"><Bell size={12} /> Remind</button>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setCheckoutItem(item)}
            style={{ background: "#6366f1", border: "none" }}
          >
            <CreditCard size={12} /> Pay Link
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">⚠️ Package Expiry Management</h1>
          <p className="page-subtitle">Monitor and act on expiring bookings</p>
        </div>
        <button className="btn btn-primary btn-sm"><Bell size={13} /> Send All Reminders</button>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Critical (7 days)", count: critical.length, color: "#f43f5e", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.2)" },
          { label: "Warning (30 days)", count: warning.length, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
          { label: "Total Expiring", count: critical.length + warning.length, color: "#818cf8", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)" },
        ].map(s => (
          <div key={s.label} className="card" style={{ borderColor: s.border, background: s.bg, textAlign: "center" }}>
            <div style={{ fontSize: 38, fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Critical */}
      {critical.length > 0 && (
        <div className="card mb-6">
          <div className="section-header">
            <span className="section-title" style={{ color: "#fb7185" }}>
              <AlertCircle size={15} style={{ color: "#f43f5e" }} /> 🔴 Critical — Expiring within 7 days
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Booking ID</th><th>Athlete</th><th>Coach</th><th>Venue</th><th>Expiry Date</th><th>Days Left</th><th>Action</th></tr></thead>
              <tbody>{critical.map(i => <ExpiryRow key={i.id} item={i} isCriticalState={true} />)}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Warning */}
      {warning.length > 0 && (
        <div className="card">
          <div className="section-header">
            <span className="section-title" style={{ color: "#fbbf24" }}>
              <AlertCircle size={15} style={{ color: "#f59e0b" }} /> 🟡 Warning — Expiring within 30 days
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Booking ID</th><th>Athlete</th><th>Coach</th><th>Venue</th><th>Expiry Date</th><th>Days Left</th><th>Action</th></tr></thead>
              <tbody>{warning.map(i => <ExpiryRow key={i.id} item={i} isCriticalState={false} />)}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dummy Stripe Checkout Modal */}
      {checkoutItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">🏋️</div>
                  Apex Sports
                </div>
                <button onClick={() => setCheckoutItem(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <div className="text-slate-500 text-sm">Pay Apex Sports LLC</div>
                <div className="text-3xl font-extrabold text-slate-900 mt-1">AED {checkoutItem.amount.toLocaleString()}.00</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Athlete Renewal</span>
                  <span className="font-bold text-slate-800">{checkoutItem.athlete}</span>
                </div>
                <div className="h-px bg-slate-100"></div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Email</span>
                  <span className="font-bold text-slate-800">parent@example.com</span>
                </div>
              </div>

              {isSuccess ? (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl flex items-center gap-3 animate-in fade-in">
                  <ShieldCheck size={24} />
                  <div>
                    <div className="font-bold">Payment Successful</div>
                    <div className="text-sm opacity-80">Invoice downloading...</div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : `Pay AED ${checkoutItem.amount.toLocaleString()}.00`}
                </button>
              )}

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <CreditCard size={14} /> Powered by Stripe
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

