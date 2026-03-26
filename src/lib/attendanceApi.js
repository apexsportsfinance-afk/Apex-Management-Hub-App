import { supabase } from "./supabase";

export const AttendanceAPI = {
  /**
   * Records a new scan with automated session matching
   */
  recordScan: async ({ eventId, athleteId, clubName, scannerLocation }) => {
    try {
      const now = new Date();
      const checkInDate = now.toISOString().split("T")[0];
      const { data: sessions } = await supabase
        .from("event_sessions")
        .select("*")
        .eq("event_id", eventId)
        .eq("session_date", checkInDate)
        .order("start_time", { ascending: true });

      let sessionId = null;
      let punctuality = 'UNASSIGNED';

      if (sessions && sessions.length > 0) {
        for (const s of sessions) {
          const [sh, sm] = s.start_time.split(':').map(Number);
          const [eh, em] = s.end_time.split(':').map(Number);
          const sStart = new Date(now); sStart.setHours(sh, sm, 0, 0);
          const sEnd = new Date(now); sEnd.setHours(eh, em, 0, 0);
          const grace = new Date(sStart.getTime() + (15 * 60 * 1000));
          const minsBefore = (sStart - now) / (1000 * 60);

          if (now >= sStart && now <= grace) {
            sessionId = s.id; punctuality = 'ON_TIME'; break;
          } else if (now > grace && now <= sEnd) {
            sessionId = s.id; punctuality = 'LATE'; break;
          } else if (now < sStart && minsBefore <= 30) {
            sessionId = s.id; punctuality = 'ON_TIME'; break;
          }
        }
      }

      let q = supabase.from("event_attendance").select("id, scan_count").eq("event_id", eventId).eq("athlete_id", athleteId);
      if (sessionId) q = q.eq("session_id", sessionId);
      else q = q.eq("check_in_date", checkInDate).is("session_id", null);

      const { data: existing } = await q.maybeSingle();
      if (existing) {
        await supabase.from("event_attendance").update({ scan_count: (existing.scan_count || 1) + 1 }).eq("id", existing.id);
        return { status: "duplicate" };
      }

      const { error } = await supabase.from("event_attendance").insert([{
        event_id: eventId, athlete_id: athleteId, session_id: sessionId, punctuality_status: punctuality,
        club_name: clubName || null, check_in_date: checkInDate, check_in_time: now.toISOString(),
        scanner_location: scannerLocation || "Main Entrance", scan_count: 1
      }]);
      if (error) throw error;
      return { status: "success" };
    } catch (err) { return { status: "error", message: err.message }; }
  },

  markPresent: async ({ eventId, athleteId, clubName, sessionId = null }) => {
    try {
      const now = new Date();
      const checkInDate = now.toISOString().split("T")[0];
      let q = supabase.from("event_attendance").select("id").eq("event_id", eventId).eq("athlete_id", athleteId).eq("check_in_date", checkInDate);
      if (sessionId) q = q.eq("session_id", sessionId);
      else q = q.is("session_id", null);

      const { data: existing } = await q.maybeSingle();
      if (existing) return { status: "duplicate" };

      const { error } = await supabase.from("event_attendance").insert([{
        event_id: eventId, athlete_id: athleteId, club_name: clubName, session_id: sessionId,
        punctuality_status: 'ON_TIME', check_in_date: checkInDate, check_in_time: now.toISOString(),
        scanner_location: 'Manual Entry', scan_count: 1
      }]);
      if (error) throw error;
      return { status: "success" };
    } catch (err) { return { status: "error", message: err.message }; }
  },

  unmarkPresent: async ({ eventId, athleteId, date, sessionId = null }) => {
    try {
      let q = supabase.from("event_attendance").delete().eq("event_id", eventId).eq("athlete_id", athleteId);
      if (sessionId) q = q.eq("session_id", sessionId);
      else q = q.eq("check_in_date", date).is("session_id", null);
      const { error } = await q;
      if (error) throw error;
      return { status: "success" };
    } catch (err) { return { status: "error", message: err.message }; }
  },

  getSessionsForEvent: async (eventId, date) => {
    const { data, error } = await supabase.from("event_sessions").select("*").eq("event_id", eventId).eq("session_date", date).order("sort_order", { ascending: true });
    if (error) throw error; return data || [];
  },

  createSession: async ({ eventId, sessionName, startTime, endTime, date }) => {
    const { data: res, error } = await supabase.from("event_sessions").insert([{
      event_id: eventId,
      session_name: sessionName,
      start_time: startTime,
      end_time: endTime,
      session_date: date
    }]).select().single();
    if (error) throw error; return res;
  },

  updateSession: async (id, { sessionName, startTime, endTime, date }) => {
    const { data: res, error } = await supabase.from("event_sessions")
      .update({
        session_name: sessionName,
        start_time: startTime,
        end_time: endTime,
        session_date: date
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error; return res;
  },

  deleteSession: async (id) => {
    const { error } = await supabase.from("event_sessions").delete().eq("id", id);
    if (error) throw error; return true;
  },

  getAttendanceForEvent: async (eventId, date) => {
    const { data, error } = await supabase.from("event_attendance").select("*").eq("event_id", eventId).eq("check_in_date", date);
    if (error) throw error; return data || [];
  }
};
