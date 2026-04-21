"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface FilterState {
  year: string;
  month: string;
  week: string;
  venue: string;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  updateFilter: (key: keyof FilterState, value: string) => void;
}

const defaultFilters: FilterState = {
  year: "2024",
  month: "April",
  week: "Week 3",
  venue: "All Venues"
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, updateFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
