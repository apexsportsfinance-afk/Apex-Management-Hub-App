import React, { useRef, useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

/**
 * Enterprise Grade Virtualized Table using TanStack
 * Handles 10,000+ rows with zero DOM lag.
 */
export default function VirtualAccreditationTable({ data }) {
  // 1. Column Definition
  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID', size: 80 },
      { accessorKey: 'name', header: 'Full Name', size: 250 },
      { accessorKey: 'role', header: 'Event Role', size: 150 },
      { accessorKey: 'status', header: 'Status', size: 100 },
    ],
    []
  );

  // 2. Table Instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  // 3. Virtualizer Setup
  const tableContainerRef = useRef(null);
  
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 45, // 45px estimated row height
    overscan: 10, // Buffer items outside the visible area
  });

  return (
    <div className="glass rounded-xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
      {/* Fixed Header */}
      <div className="bg-slate-900/50 border-b border-white/10 px-6 py-4">
        {table.getHeaderGroups().map(headerGroup => (
          <div key={headerGroup.id} className="flex text-sm font-display font-medium text-slate-400 uppercase tracking-wider">
            {headerGroup.headers.map(header => (
              <div 
                key={header.id} 
                style={{ width: header.getSize() }}
                className="cursor-pointer select-none"
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Virtualized Body */}
      <div 
        ref={tableContainerRef} 
        className="flex-1 overflow-auto custom-scrollbar px-6"
      >
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={row.id}
                className="absolute top-0 left-0 w-full flex items-center border-b border-white/5 hover:bg-white/5 transition-colors duration-150"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <div key={cell.id} style={{ width: cell.column.getSize() }} className="text-sm text-slate-300 font-sans truncate pr-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
