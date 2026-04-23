/**
 * Squad Timetable Grid Parser for Apex Sports Hub
 * Processes unstructured text grids from legacy PDF exports.
 */

export interface ParsedSession {
  level: string;
  day: string;
  venue: string;
  coach: string;
  startTime: string;
  endTime: string;
  raw: string;
  type: 'squad' | 'coach-centric';
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const LEVELS = ['Development Junior B/C', 'Development A', 'Competitive Junior', 'Competitive A / Performance Junior', 'Performance A', 'Club Squad'];

export function parseSquadTimetable(text: string): ParsedSession[] {
  const sessions: ParsedSession[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  let currentLevel = 'Unknown';
  let currentDayIndices: string[] = []; // Tracks which day we are processing based on headers

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Detect Level
    const foundLevel = LEVELS.find(l => line.toLowerCase().includes(l.toLowerCase()));
    if (foundLevel) {
      currentLevel = foundLevel;
      continue;
    }

    // 2. Detect Day Headers (to reset context)
    if (line.includes('Sunday') && line.includes('Saturday')) {
      currentDayIndices = DAYS.filter(d => line.includes(d));
      continue;
    }

    // 3. Detect Session Pattern: "VENUE - COACH" then "TIME - TIME"
    // Example: NLCS - Ash
    // Example: 16:00 - 17:30
    if (line.includes(' - ') && !line.includes(':')) {
      const parts = line.split(' - ');
      const venue = parts[0].trim();
      const coach = parts[1].trim();
      
      // Look at the next line for the time
      const nextLine = lines[i + 1] || '';
      if (nextLine.includes(' - ') && nextLine.includes(':')) {
        const timeParts = nextLine.split(' - ');
        const startTime = timeParts[0].trim();
        const endTime = timeParts[1].trim();

        // We assign a day based on local heuristics or the presence of day headers
        // Since the user's raw text is flat, we'll assign a placeholder or use 
        // the last known Day context if we can find it in the sequence.
        
        sessions.push({
          level: currentLevel,
          day: 'Multi-Day', // Placeholders until we build the interactive mapper UI
          venue,
          coach,
          startTime,
          endTime,
          raw: `${line} / ${nextLine}`
        });
        
        i++; // Skip the time line
      }
    }
  }

  return sessions;
}
