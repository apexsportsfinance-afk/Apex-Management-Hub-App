import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Users, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import DataTable from '../ui/DataTable';
import { AccreditationsAPI } from '../../lib/storage';
import { AttendanceAPI } from '../../lib/attendanceApi';
import SessionManager from './SessionManager';
import * as XLSX from 'xlsx';

export default function AttendanceSheet({ event }) {
  const [accreditations, setAccreditations] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => { loadData(); }, [event.id, targetDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [accs, checks, sess] = await Promise.all([
        AccreditationsAPI.getByEventId(event.id),
        AttendanceAPI.getAttendanceForEvent(event.id, targetDate),
        AttendanceAPI.getSessionsForEvent(event.id, targetDate)
      ]);
      setAccreditations(accs || []);
      setAttendanceRecords(checks || []);
      setSessions(sess || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleToggleAttendance = async (athlete, present, sessionId) => {
    setActionLoading(athlete.id);
    try {
      if (present) {
        if (!window.confirm(`Remove attendance for ${athlete.firstName}?`)) {
          setActionLoading(null); return;
        }
        await AttendanceAPI.unmarkPresent({ eventId: event.id, athleteId: athlete.id, date: targetDate, sessionId });
      } else {
        await AttendanceAPI.markPresent({ eventId: event.id, athleteId: athlete.id, clubName: athlete.club, sessionId });
      }
      await loadData();
    } finally { setActionLoading(null); }
  };

  const combinedData = useMemo(() => {
    const athletes = accreditations.filter(a => a.status === 'approved');
    return athletes.map((athlete, idx) => {
      const records = attendanceRecords.filter(r => r.athlete_id === athlete.id);
      const latest = [...records].sort((a,b) => new Date(b.check_in_time) - new Date(a.check_in_time))[0];
      const age = athlete.dob && event.ageCalculationYear ? event.ageCalculationYear - new Date(athlete.dob).getFullYear() : "-";

      return {
        sr: idx + 1, id: athlete.id, athleteRaw: athlete,
        name: `${athlete.firstName || ""} ${athlete.lastName || ""}`.trim(),
        photoUrl: athlete.photoUrl, club: athlete.club || "Independent",
        category: athlete.role || "-", age, status: latest ? "Present" : "Absent",
        latestSessionId: latest?.session_id || null,
        time: latest ? new Date(latest.check_in_time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + 
              ' | ' + new Date(latest.check_in_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : "-",
        punctuality: latest?.punctuality_status || null,
        presenceScore: { attended: records.filter(r => r.session_id).length, total: sessions.length }
      };
    }).sort((a, b) => a.club.localeCompare(b.club) || a.name.localeCompare(b.name));
  }, [accreditations, attendanceRecords, event, sessions]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return combinedData;
    const term = searchTerm.toLowerCase();
    return combinedData.filter(r => r.name.toLowerCase().includes(term) || r.club.toLowerCase().includes(term));
  }, [combinedData, searchTerm]);

  const stats = useMemo(() => {
    const total = combinedData.length;
    const present = combinedData.filter(r => r.status === "Present").length;
    return { total, present, absent: total - present };
  }, [combinedData]);

  const columns = [
    { key: "sr", header: "SR#", render: (r) => <span className="text-slate-500 font-mono text-xs">{r.sr}</span> },
    { key: "name", header: "Athlete Name", render: (r) => (
      <div className="flex items-center gap-3">
        {r.photoUrl ? <img src={r.photoUrl} className="w-8 h-8 rounded-full object-cover border border-slate-700" /> :
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
            {r.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
        }
        <span className="text-white font-medium text-sm">{r.name}</span>
      </div>
    )},
    { key: "club", header: "Club Name", render: (r) => <span className="text-slate-400 text-[11px] uppercase tracking-wider">{r.club}</span> },
    { key: "category", header: "Category", render: (r) => <span className="text-slate-500 text-[11px] font-medium">{r.category}</span> },
    { key: "age", header: "Age", render: (r) => <span className="text-amber-500 font-mono font-bold text-xs">{r.age}</span> },
    { key: "status", header: "Status", render: (row) => {
        const { attended, total } = row.presenceScore;
        if (total === 0) return <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest ${row.status === 'Present' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>{row.status}</span>;
        const pts = (attended / total) * 100;
        return (
          <div className="min-w-[80px]">
            <span className="text-white text-[10px] font-bold">{attended} / {total}</span>
            <div className="w-full bg-slate-800 h-1.5 mt-1 rounded-full"><div className={`h-1.5 rounded-full ${pts >= 80 ? 'bg-emerald-500' : pts >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${pts}%` }} /></div>
          </div>
        );
    }},
    { key: "time", header: "Attendance Time", render: (row) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-cyan-400 font-mono text-[11px]">{row.time}</span>
        {row.punctuality && <span className={`text-[9px] font-black uppercase tracking-widest ${row.punctuality === 'ON_TIME' ? 'text-emerald-400' : 'text-amber-400'}`}>{row.punctuality === 'ON_TIME' ? '✅ ON TIME' : '⚠️ LATE'}</span>}
      </div>
    )},
    { key: "action", header: "Action", render: (row) => (
      <button 
        disabled={actionLoading === row.id}
        onClick={() => handleToggleAttendance(row.athleteRaw, row.status === 'Present', row.latestSessionId)}
        className={`transition-all ${row.status === 'Present' ? 'bg-red-500/10 text-red-400 border-red-500/30 font-bold hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold hover:bg-emerald-500/20'} border px-3 py-1 rounded text-[10px] font-black uppercase flex items-center justify-center min-w-[100px]`}
      >
        {actionLoading === row.id ? <Loader2 className="w-3 h-3 animate-spin" /> : row.status === 'Present' ? 'Remove' : 'Mark Present'}
      </button>
    )}
  ];

  const handleExport = () => {
    const data = filteredData.map(r => {
      const b = { "SR#": r.sr, "Athlete": r.name, "Club": r.club, "Category": r.category, "Age": r.age, "Status": r.status, "Last Seen": r.time };
      sessions.forEach(s => {
        const rec = attendanceRecords.find(ar => ar.athlete_id === r.id && ar.session_id === s.id);
        b[s.session_name] = rec ? new Date(rec.check_in_time).toLocaleTimeString() + (rec.punctuality_status === 'LATE' ? ' (LATE)' : '') : 'Absent';
      });
      return b;
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `${event.name}_Attendance.xlsx`);
  };

  return (
    <div className="space-y-6">
      <SessionManager event={event} targetDate={targetDate} sessions={sessions} onSessionsChange={setSessions} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Total Athletes</p><p className="text-2xl font-black text-white">{stats.total}</p></div><Users className="w-5 h-5 text-slate-700" /></CardContent></Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest">Present</p><p className="text-2xl font-black text-emerald-400">{stats.present}</p></div><CheckCircle className="w-5 h-5 text-emerald-400" /></CardContent></Card>
        <Card className="bg-red-500/10 border-red-500/20"><CardContent className="p-4 flex items-center justify-between"><div><p className="text-[10px] text-red-500 uppercase font-black tracking-widest">Absent</p><p className="text-2xl font-black text-red-500">{stats.absent}</p></div><XCircle className="w-5 h-5 text-red-500" /></CardContent></Card>
      </div>
      <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-xl">
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="bg-slate-950 border border-slate-800 rounded px-4 py-2 text-white text-sm" />
            <div className="flex gap-2 w-full md:w-auto"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" /><input placeholder="Search athlete or club..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 bg-slate-950 border border-slate-800 rounded px-4 py-2 text-white text-sm" /></div><Button variant="secondary" icon={Download} onClick={handleExport}>Export</Button></div>
          </div>
          <DataTable data={filteredData} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}
