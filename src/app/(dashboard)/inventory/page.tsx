"use client";

import { Box, Package, Plus, Search, Tag, Truck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const inventory = [
  { id: "INV-001", item: "Elite Swim Cap (Black/Gold)", category: "Apparel", stock: 12, minStock: 20, status: "low", price: 85 },
  { id: "INV-002", item: "Training Fins (Size L)", category: "Equipment", stock: 45, minStock: 10, status: "ok", price: 210 },
  { id: "INV-003", item: "Tennis Balls (Case of 24)", category: "Consumables", stock: 2, minStock: 5, status: "critical", price: 450 },
  { id: "INV-004", item: "Academy Tracksuit (M)", category: "Apparel", stock: 0, minStock: 10, status: "out", price: 320 },
];

export default function InventoryHubPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Box size={20} />
            </div>
            Inventory Management
          </h1>
          <p className="page-subtitle mt-2">Track academy kit, retail gear, and rental equipment.</p>
        </div>
        <div className="flex gap-4">
           <button className="btn btn-secondary flex items-center gap-2 border border-slate-700 bg-slate-800/50 hover:bg-slate-700">
             <Truck size={16} /> Order Stock
           </button>
           <button className="btn btn-primary shadow-lg shadow-amber-500/20 flex items-center gap-2" style={{ background: "linear-gradient(to right, #f59e0b, #d97706)", border: "none" }}>
             <Plus size={16} /> Add Item
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="text-slate-400 text-sm font-bold mb-1">Total Assets</div>
          <div className="text-3xl font-black text-white">452</div>
          <div className="text-xs text-slate-500 mt-1">Across 4 categories</div>
        </div>
        <div className="card border-l-4 border-rose-500">
          <div className="text-slate-400 text-sm font-bold mb-1">Out of Stock</div>
          <div className="text-3xl font-black text-white text-rose-500">4 Items</div>
          <div className="text-xs text-rose-400 mt-1 flex items-center gap-1"><AlertTriangle size={12}/> Restock required</div>
        </div>
        <div className="card border-l-4 border-amber-500">
          <div className="text-slate-400 text-sm font-bold mb-1">Low Stock</div>
          <div className="text-3xl font-black text-white text-amber-500">12 Items</div>
          <div className="text-xs text-amber-400 mt-1">Below minimum threshold</div>
        </div>
        <div className="card">
          <div className="text-slate-400 text-sm font-bold mb-1">Inventory Value</div>
          <div className="text-3xl font-black text-white">AED 42,900</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><TrendingUpIcon size={12} /> +5% from Q1</div>
        </div>
      </div>

      <div className="card mb-8">
        <div className="flex items-center gap-4 mb-6 px-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search items, categories, or SKUs..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
             <button className="px-4 py-2 text-xs font-bold text-white bg-slate-800 rounded-lg">All</button>
             <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-300">Apparel</button>
             <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-300">Equipment</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">
                <th className="p-4">Item Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Retail Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors">
                        <Package size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">{item.item}</div>
                        <div className="text-xs text-slate-500 mt-0.5">SKU: {item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                       <Tag size={12} className="text-slate-600" /> {item.category}
                    </span>
                  </td>
                  <td className="p-4">
                     <div className="text-sm font-bold text-slate-300">{item.stock} Units</div>
                     <div className="text-[10px] text-slate-600 font-bold uppercase mt-1">Min: {item.minStock}</div>
                  </td>
                  <td className="p-4">
                    {item.status === 'ok' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 size={12} /> Healthy Stock
                      </span>
                    )}
                    {item.status === 'low' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 text-shadow-glow">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    )}
                    {item.status === 'critical' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                        <AlertTriangle size={12} /> Critical
                      </span>
                    )}
                    {item.status === 'out' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-400 border border-slate-600">
                         Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-black text-white text-lg">AED {item.price}</div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-700 transition-all uppercase">
                      Adjustment
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

function TrendingUpIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
      <polyline points="16 7 22 7 22 13"></polyline>
    </svg>
  );
}
