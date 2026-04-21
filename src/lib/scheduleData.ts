// Shared mock data for the scheduling system
// Used across /classes, /schedule, and /allocate pages

export const COACHES = [
  { id: 1, name: "Mike Torres",  specialty: "Tennis",     avatar: "M", color: "#6366f1" },
  { id: 2, name: "Sarah Kim",    specialty: "Swimming",   avatar: "S", color: "#8b5cf6" },
  { id: 3, name: "Anna Brown",   specialty: "Athletics",  avatar: "A", color: "#ec4899" },
  { id: 4, name: "John Parker",  specialty: "Fitness",    avatar: "J", color: "#f59e0b" },
];

export const VENUES = ["Court 1", "Court 2", "Court 3", "Pool", "Gym A"];

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export type ClassSession = {
  id: string;
  name: string;
  coachId: number;
  venue: string;
  day: string;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolled: number;
  term: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  enrolledAthletes: string[];
};

export const CLASSES: ClassSession[] = [
  // Mike Torres – Tennis
  { id: "CLS-001", name: "Tennis Basics",      coachId: 1, venue: "Court 1", day: "Monday",    startTime: "08:00", endTime: "09:00", capacity: 8,  enrolled: 5, term: "Term 1", level: "Beginner",     enrolledAthletes: ["Emma Wilson",  "James Lee",   "Priya Patel",  "Carlos Ruiz", "Sophie Hart"] },
  { id: "CLS-002", name: "Tennis Drill",        coachId: 1, venue: "Court 1", day: "Wednesday", startTime: "10:00", endTime: "11:30", capacity: 6,  enrolled: 6, term: "Term 1", level: "Intermediate",  enrolledAthletes: ["David Chen",   "Aisha Malik", "Emma Wilson",  "James Lee",   "Priya Patel", "Carlos Ruiz"] },
  { id: "CLS-003", name: "Tennis Advanced",     coachId: 1, venue: "Court 2", day: "Friday",    startTime: "14:00", endTime: "15:30", capacity: 5,  enrolled: 3, term: "Term 1", level: "Advanced",      enrolledAthletes: ["David Chen",   "Aisha Malik", "Sophie Hart"] },
  { id: "CLS-004", name: "Tennis Conditioning", coachId: 1, venue: "Gym A",   day: "Thursday",  startTime: "09:00", endTime: "10:00", capacity: 10, enrolled: 4, term: "Term 2", level: "Intermediate",  enrolledAthletes: ["Emma Wilson",  "James Lee",   "Priya Patel", "Carlos Ruiz"] },

  // Sarah Kim – Swimming
  { id: "CLS-005", name: "Swim Beginners",      coachId: 2, venue: "Pool",    day: "Monday",    startTime: "07:00", endTime: "08:00", capacity: 10, enrolled: 7, term: "Term 1", level: "Beginner",     enrolledAthletes: ["Emma Wilson",  "Sophie Hart", "Ryan Park",    "Nour Ali",    "Lina Chen",   "Tom Baker",  "Mark Simmons"] },
  { id: "CLS-006", name: "Swim Laps",           coachId: 2, venue: "Pool",    day: "Tuesday",   startTime: "09:00", endTime: "10:00", capacity: 8,  enrolled: 5, term: "Term 1", level: "Intermediate",  enrolledAthletes: ["James Lee",    "Carlos Ruiz", "Priya Patel",  "David Chen",  "Aisha Malik"] },
  { id: "CLS-007", name: "Swim Intensive",      coachId: 2, venue: "Pool",    day: "Thursday",  startTime: "11:00", endTime: "12:30", capacity: 6,  enrolled: 2, term: "Term 2", level: "Advanced",      enrolledAthletes: ["Emma Wilson",  "Ryan Park"] },
  { id: "CLS-008", name: "Aqua Fitness",        coachId: 2, venue: "Pool",    day: "Saturday",  startTime: "08:00", endTime: "09:00", capacity: 15, enrolled: 9, term: "Term 1", level: "Beginner",      enrolledAthletes: ["Sophie Hart",  "Nour Ali",    "Lina Chen",    "Tom Baker",   "Mark Simmons","Emma Wilson", "James Lee", "Carlos Ruiz", "Aisha Malik"] },

  // Anna Brown – Athletics
  { id: "CLS-009", name: "Sprint Training",     coachId: 3, venue: "Court 3", day: "Tuesday",   startTime: "07:00", endTime: "08:30", capacity: 8,  enrolled: 6, term: "Term 1", level: "Intermediate",  enrolledAthletes: ["Emma Wilson",  "James Lee",   "Priya Patel",  "David Chen",  "Sophie Hart", "Ryan Park"] },
  { id: "CLS-010", name: "Long Distance",       coachId: 3, venue: "Court 3", day: "Thursday",  startTime: "07:00", endTime: "08:30", capacity: 8,  enrolled: 4, term: "Term 1", level: "Intermediate",  enrolledAthletes: ["Carlos Ruiz",  "Aisha Malik", "Nour Ali",     "Lina Chen"] },
  { id: "CLS-011", name: "Agility & Drills",   coachId: 3, venue: "Court 3", day: "Saturday",  startTime: "07:00", endTime: "09:00", capacity: 10, enrolled: 8, term: "Term 2", level: "Advanced",      enrolledAthletes: ["Emma Wilson",  "James Lee",   "Priya Patel",  "David Chen",  "Sophie Hart", "Ryan Park", "Nour Ali", "Tom Baker"] },

  // John Parker – Fitness
  { id: "CLS-012", name: "Strength & Core",     coachId: 4, venue: "Gym A",   day: "Monday",    startTime: "10:00", endTime: "11:00", capacity: 12, enrolled: 8, term: "Term 1", level: "Beginner",      enrolledAthletes: ["Emma Wilson",  "James Lee",   "Priya Patel",  "Carlos Ruiz", "Sophie Hart", "Aisha Malik", "David Chen", "Ryan Park"] },
  { id: "CLS-013", name: "HIIT Session",        coachId: 4, venue: "Gym A",   day: "Wednesday", startTime: "17:00", endTime: "18:00", capacity: 15, enrolled: 11,term: "Term 1", level: "Intermediate",  enrolledAthletes: ["Emma Wilson",  "James Lee",   "Priya Patel",  "Carlos Ruiz", "Sophie Hart", "Aisha Malik", "David Chen", "Ryan Park", "Nour Ali", "Lina Chen", "Tom Baker"] },
  { id: "CLS-014", name: "Flex & Recovery",     coachId: 4, venue: "Gym A",   day: "Friday",    startTime: "09:00", endTime: "10:00", capacity: 12, enrolled: 3, term: "Term 2", level: "Beginner",      enrolledAthletes: ["Sophie Hart",  "Mark Simmons","Carlos Ruiz"] },
];

export type AthleteRecord = {
  id: number;
  name: string;
  status: "active" | "suspended" | "inactive";
  currentClasses: number;
  // Package / Booking info
  packageType: "15d" | "30d" | "1mo" | "2mo" | "3mo" | "6mo";
  startDate: string;   // ISO date string
  endDate: string;     // ISO date string
  sessionsPerWeek: number;
  sessionsPerMonth: number;
  sessionsUsedThisWeek: number;
  sessionsUsedThisMonth: number;
};

export const ATHLETES: AthleteRecord[] = [
  { id: 1,  name: "Emma Wilson",   status: "active",    currentClasses: 4, packageType: "3mo", startDate: "2026-04-01", endDate: "2026-06-30", sessionsPerWeek: 3, sessionsPerMonth: 12, sessionsUsedThisWeek: 2, sessionsUsedThisMonth: 8  },
  { id: 2,  name: "James Lee",     status: "active",    currentClasses: 5, packageType: "1mo", startDate: "2026-04-15", endDate: "2026-05-14", sessionsPerWeek: 2, sessionsPerMonth: 8,  sessionsUsedThisWeek: 2, sessionsUsedThisMonth: 7  },
  { id: 3,  name: "Priya Patel",   status: "active",    currentClasses: 4, packageType: "6mo", startDate: "2026-01-01", endDate: "2026-06-30", sessionsPerWeek: 4, sessionsPerMonth: 16, sessionsUsedThisWeek: 1, sessionsUsedThisMonth: 5  },
  { id: 4,  name: "Carlos Ruiz",   status: "active",    currentClasses: 4, packageType: "2mo", startDate: "2026-03-01", endDate: "2026-04-30", sessionsPerWeek: 3, sessionsPerMonth: 12, sessionsUsedThisWeek: 3, sessionsUsedThisMonth: 11 },
  { id: 5,  name: "Sophie Hart",   status: "active",    currentClasses: 5, packageType: "30d", startDate: "2026-04-01", endDate: "2026-04-30", sessionsPerWeek: 2, sessionsPerMonth: 8,  sessionsUsedThisWeek: 1, sessionsUsedThisMonth: 4  },
  { id: 6,  name: "David Chen",    status: "active",    currentClasses: 4, packageType: "3mo", startDate: "2026-02-01", endDate: "2026-04-30", sessionsPerWeek: 3, sessionsPerMonth: 12, sessionsUsedThisWeek: 2, sessionsUsedThisMonth: 9  },
  { id: 7,  name: "Aisha Malik",   status: "active",    currentClasses: 3, packageType: "1mo", startDate: "2026-04-10", endDate: "2026-05-09", sessionsPerWeek: 2, sessionsPerMonth: 8,  sessionsUsedThisWeek: 0, sessionsUsedThisMonth: 2  },
  { id: 8,  name: "Ryan Park",     status: "active",    currentClasses: 3, packageType: "15d", startDate: "2026-04-15", endDate: "2026-04-29", sessionsPerWeek: 2, sessionsPerMonth: 4,  sessionsUsedThisWeek: 1, sessionsUsedThisMonth: 2  },
  { id: 9,  name: "Nour Ali",      status: "active",    currentClasses: 3, packageType: "6mo", startDate: "2026-04-01", endDate: "2026-09-30", sessionsPerWeek: 3, sessionsPerMonth: 12, sessionsUsedThisWeek: 0, sessionsUsedThisMonth: 1  },
  { id: 10, name: "Lina Chen",     status: "active",    currentClasses: 2, packageType: "2mo", startDate: "2026-03-15", endDate: "2026-05-14", sessionsPerWeek: 2, sessionsPerMonth: 8,  sessionsUsedThisWeek: 2, sessionsUsedThisMonth: 6  },
  { id: 11, name: "Tom Baker",     status: "suspended", currentClasses: 2, packageType: "1mo", startDate: "2026-03-01", endDate: "2026-03-31", sessionsPerWeek: 2, sessionsPerMonth: 8,  sessionsUsedThisWeek: 0, sessionsUsedThisMonth: 0  },
  { id: 12, name: "Mark Simmons",  status: "active",    currentClasses: 2, packageType: "30d", startDate: "2026-04-20", endDate: "2026-05-19", sessionsPerWeek: 2, sessionsPerMonth: 8,  sessionsUsedThisWeek: 0, sessionsUsedThisMonth: 0  },
];
