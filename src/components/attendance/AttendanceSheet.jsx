import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Users, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import DataTable from '../ui/DataTable';
import { AccreditationsAPI } from '../../lib/storage';
import { AttendanceAPI } from '../../lib/attendanceApi';
import * as XLSX from 'xlsx';

export default function AttendanceSheet({ event }) {
  const [accreditations, setAccreditations] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, [event.id, targetDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [accs, checks] = await Promise.all([
        AccreditationsAPI.getByEventId(event.id),
        AttendanceAPI.getAttendanceForEvent(event.id, targetDate)
      ]);
      setAccreditations(accs || []);
      setAttendanceRecords(checks || []);
    } catch (err) {
      console.error("Failed to load attendance sheet", err);
    } finally {
      setLoading(false);
    }
  };

  const combinedData = useMemo(() => {
    // We want to list all approved participants in this event
    const athletes = accreditations.filter(a => a.status === 'approved');
    
    // Create lookup for O(1) checking
    const attendanceMap = new Map();
    attendanceRecords.forEach(record => {
      attendanceMap.set(record.athlete_id, record);
    });

    return athletes.map((athlete, idx) => {
      const record = attendanceMap.get(athlete.id);
      
      // Calculate age robustly ONLY for athletes
      let age = "-";
      const isAthleteRole = String(athlete.role || '').toLowerCase().includes('athlete');
      
      if (isAthleteRole && athlete.dob && event.ageCalculationYear) {
        const birthYear = new Date(athlete.dob).getFullYear();
        if (!isNaN(birthYear)) {
          age = event.ageCalculationYear - birthYear;
        }
      }

      return {
        sr: idx + 1,
        id: athlete.id,
        name: `${athlete.firstName || ""} ${athlete.lastName || ""}`.trim(),
        photoUrl: athlete.photoUrl,
        club: athlete.club || "Independent",
        category: athlete.role || "-",
        age: age,
        status: record ? "Present" : "Absent",
        time: record ? new Date(record.check_in_time).toLocaleTimeString() : "-",
        scanCount: record ? record.scan_count : 0
      };
    }).sort((a, b) => a.club.localeCompare(b.club) || a.name.localeCompare(b.name));
  }, [accreditations, attendanceRecords, event]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return combinedData;
    const term = searchTerm.toLowerCase();
    return combinedData.filter(r => 
      r.name.toLowerCase().includes(term) || 
      r.club.toLowerCase().includes(term)
    );
  }, [combinedData, searchTerm]);

  const stats = useMemo(() => {
    const total = combinedData.length;
    const present = combinedData.filter(r => r.status === "Present").length;
    return { total, present, absent: total - present };
  }, [combinedData]);

  const columns = [
    { key: "sr", header: "SR#", render: (row) => <span className="text-slate-500 font-mono text-sm">{row.sr}</span> },
    { 
      key: "name", 
      header: "Athlete Name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-4">
          {row.photoUrl ? (
            <img 
              src={row.photoUrl} 
              alt={row.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-500/30 flex-shrink-0" 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-ocean-600 flex items-center justify-center flex-shrink-0 border-2 border-primary-500/30">
              <span className="text-lg font-medium text-white">
                {row.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-white text-[15px]">{row.name}</p>
          </div>
        </div>
      )
    },
    { key: "club", header: "Club Name", sortable: true, render: (row) => <span className="text-cyan-50 font-medium uppercase tracking-wider text-xs">{row.club}</span> },
    { key: "category", header: "Category", sortable: true, render: (row) => <span className="text-slate-300 font-medium uppercase tracking-wider text-xs">{row.category}</span> },
    { key: "age", header: "Age", render: (row) => <span className="text-amber-400 font-mono font-bold">{row.age}</span> },
    { 
      key: "status", 
      header: "Status", 
      sortable: true, 
      render: (row) => (
        <span className={`inline-flex px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
          row.status === 'Present' ? 'bg-emerald-500/15 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 text-red-500'
        }`}>
          {row.status}
        </span>
      )
    },
    { key: "time", header: "Attendance Time", render: (row) => <span className="text-cyan-400 font-mono text-sm font-semibold tracking-wide">{row.time}</span> }
  ];

  const handleExport = () => {
    if (filteredData.length === 0) return;
    const exportData = filteredData.map(r => ({
      "SR#": r.sr,
      "Athlete Name": r.name,
      "Club Name": r.club,
      "Category": r.category,
      "Age": r.age,
      "Status": r.status,
      "Attendance Time": r.time,
      "Scan Count": r.scanCount
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `${event.name.replace(/\s+/g, '_')}_Attendance_${targetDate}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/40 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Athletes</p>
              <p className="text-3xl font-black text-white">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
              <Users className="w-6 h-6 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest mb-1">Present</p>
              <p className="text-3xl font-black text-emerald-400">{stats.present}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-red-500/70 uppercase tracking-widest mb-1">Absent</p>
              <p className="text-3xl font-black text-red-400">{stats.absent}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-xl">
        <CardContent className="p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-4 items-center">
              <input 
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="px-4 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search athlete or club..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <Button variant="secondary" icon={Download} onClick={handleExport} disabled={filteredData.length === 0}>
                Export
              </Button>
            </div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-lg text-slate-400">Loading attendance data...</p>
              </div>
            ) : (
              <DataTable 
                data={filteredData}
                columns={columns}
                searchable={false}
                emptyMessage="No athletes found for this event."
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
