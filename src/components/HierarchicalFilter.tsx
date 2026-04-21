"use client";

import React from "react";
import { Filter, ChevronRight } from "lucide-react";
import { useFilters } from "@/lib/FilterContext";

const mockOptions = {
  years: ["2024", "2025"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  weeks: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
  venues: ["Dubai Heights Academy", "Kent College", "Sunmarke School", "Nord Anglia"]
};

export default function HierarchicalFilter() {
  const { filters, updateFilter } = useFilters();

  return (
    <div className="filter-panel">
      <div className="flex items-center gap-2 mb-4 opacity-70">
        <Filter size={14} className="text-indigo-400" />
        <span className="text-xs font-bold uppercase tracking-wider">Diagnostic Filter Matrix</span>
      </div>
      
      <div className="filter-grid">
        <div className="flex flex-col gap-1">
          <label className="filter-label">Year</label>
          <select 
            className="filter-select" 
            value={filters.year}
            onChange={(e) => updateFilter("year", e.target.value)}
          >
            {mockOptions.years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="filter-label">Month</label>
          <select 
            className="filter-select"
            value={filters.month}
            onChange={(e) => updateFilter("month", e.target.value)}
          >
            {mockOptions.months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="filter-label">Week / Period</label>
          <select 
            className="filter-select"
            value={filters.week}
            onChange={(e) => updateFilter("week", e.target.value)}
          >
            {mockOptions.weeks.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="filter-label">Physical Venue</label>
          <select 
            className="filter-select"
            value={filters.venue}
            onChange={(e) => updateFilter("venue", e.target.value)}
          >
            <option value="All Venues">All Venues</option>
            {mockOptions.venues.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500 font-medium bg-slate-900/50 p-2 rounded-md border border-white/5">
        <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded">Active Path</span>
        <span>{filters.year}</span>
        <ChevronRight size={10} />
        <span>{filters.month}</span>
        <ChevronRight size={10} />
        <span>{filters.week}</span>
        <ChevronRight size={10} />
        <span className="text-indigo-300">{filters.venue}</span>
      </div>
    </div>
  );
}
