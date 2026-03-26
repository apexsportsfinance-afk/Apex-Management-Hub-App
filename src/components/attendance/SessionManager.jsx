import React, { useState } from 'react';
import { Plus, X, Clock, Calendar, Edit2, Check, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { AttendanceAPI } from '../../lib/attendanceApi';

export default function SessionManager({ event, targetDate, sessions, onSessionsChange }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sessionForm, setSessionForm] = useState({ name: '', start: '', end: '', date: targetDate });
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setSessionForm({ name: '', start: '', end: '', date: targetDate });
    setShowAdd(false);
    setEditingId(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await AttendanceAPI.createSession({
        eventId: event.id,
        sessionName: sessionForm.name,
        startTime: sessionForm.start,
        endTime: sessionForm.end,
        date: sessionForm.date
      });
      onSessionsChange([...sessions, created]);
      resetForm();
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await AttendanceAPI.updateSession(editingId, {
        sessionName: sessionForm.name,
        startTime: sessionForm.start,
        endTime: sessionForm.end,
        date: sessionForm.date
      });
      onSessionsChange(sessions.map(s => s.id === editingId ? updated : s));
      resetForm();
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const startEdit = (session) => {
    setEditingId(session.id);
    setSessionForm({
      name: session.session_name,
      start: session.start_time,
      end: session.end_time,
      date: session.session_date
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this session? Existing attendance will be unassigned.")) return;
    try {
      await AttendanceAPI.deleteSession(id);
      onSessionsChange(sessions.filter(s => s.id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Daily Session Schedule</h2>
        </div>
        {!showAdd && !editingId && (
          <Button onClick={() => setShowAdd(true)} variant="secondary" size="sm" icon={Plus}>
            Add Session
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {sessions.map((session) => (
          editingId === session.id ? (
            <Card key={session.id} className="w-80 bg-slate-900 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <CardContent className="p-4">
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-cyan-500 uppercase font-black">Edit Name</label>
                    <input autoFocus required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-white focus:border-cyan-500/50 outline-none" value={sessionForm.name} onChange={(e) => setSessionForm({...sessionForm, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-black">Edit Date</label>
                    <input type="date" required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-white" value={sessionForm.date} onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-black">Start</label>
                      <input type="time" required className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" value={sessionForm.start} onChange={(e) => setSessionForm({...sessionForm, start: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-black">End</label>
                      <input type="time" required className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" value={sessionForm.end} onChange={(e) => setSessionForm({...sessionForm, end: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button type="submit" size="sm" className="flex-1" loading={loading} icon={Check}>Update</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={resetForm}><X className="w-4 h-4" /></Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card key={session.id} className="w-64 bg-slate-900/60 border-slate-800 hover:border-cyan-500/30 transition-all group">
              <CardContent className="p-4 relative">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(session)} className="p-1.5 text-slate-600 hover:text-cyan-400 bg-slate-950/50 rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(session.id)} className="p-1.5 text-slate-600 hover:text-red-500 bg-slate-950/50 rounded"><X className="w-3.5 h-3.5" /></button>
                </div>
                <p className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-1">{session.session_name}</p>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{new Date(session.session_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-mono font-bold">{session.start_time.substring(0, 5)} — {session.end_time.substring(0, 5)}</span>
                </div>
              </CardContent>
            </Card>
          )
        ))}

        {showAdd && (
          <Card className="w-80 bg-slate-900 border-dashed border-slate-700 animate-in fade-in slide-in-from-top-2">
            <CardContent className="p-4">
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1 text-white">
                  <label className="text-[10px] text-slate-500 uppercase font-black">New Session Name</label>
                  <input autoFocus required placeholder="e.g. Heats Day 1" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm" value={sessionForm.name} onChange={(e) => setSessionForm({...sessionForm, name: e.target.value})} />
                </div>
                <div className="space-y-1 text-white">
                  <label className="text-[10px] text-slate-500 uppercase font-black">New Session Date</label>
                  <input type="date" required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm" value={sessionForm.date} onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1"><label className="text-[10px] text-slate-500 uppercase font-black">Start</label><input type="time" required className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" value={sessionForm.start} onChange={(e) => setSessionForm({...sessionForm, start: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-[10px] text-slate-500 uppercase font-black">End</label><input type="time" required className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" value={sessionForm.end} onChange={(e) => setSessionForm({...sessionForm, end: e.target.value})} /></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" size="sm" className="flex-1" loading={loading}>Save</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={resetForm}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
