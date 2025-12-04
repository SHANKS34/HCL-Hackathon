// Authentication & User Types
export type Role = 'patient' | 'provider' | 'doctor';

export interface User {
  _id: string; // MongoDB ID
  name: string;
  email: string;
  role: Role;
  
  // Patient Specific
  age?: number;
  assignedDoctor?: string;
  illnesses?: string[]; // Array of conditions (e.g., ['Diabetes'])
  
  // Doctor/Provider Specific
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  bio?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// --- Patient Dashboard Data Types ---

export interface WellnessGoal {
  id: string;
  title: string;
  status: 'active' | 'achieved' | 'overdue';
  progress: number; // 0 to 100
}

export interface DoctorTip {
  id: string;
  content: string;
  dateAdded: string;
}

export interface UpcomingSchedule {
  id: string;
  title: string;
  doctorName: string;
  date: string; // ISO Date string
  status: 'Confirmed' | 'Pending';
}

export interface DashboardData {
  goalsMatch: {
    percentage: number;
    statusMessage: string;
    onTrack: string[];
    needsAttention: string[];
  };
  tips: DoctorTip[];
  upcomingSchedules: UpcomingSchedule[];
}

// --- General Appointment Types ---

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  priority?: 'critical' | 'moderate' | 'regular'; // Doctor view priority
}