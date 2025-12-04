export type Role = 'patient' | 'doctor' | 'provider';

export interface WellnessGoal {
  _id: string;
  title: string;
  status: 'active' | 'achieved' | 'overdue';
  progress: number;
}

export interface DoctorTip {
  _id: string; // Changed to _id to match MongoDB default
  content: string;
  dateAdded: string;
}

export interface DashboardData {
  goalsMatch: {
    percentage: number;
    statusMessage: string;
    onTrack: string[];
    needsAttention: string[];
  };
  tips: DoctorTip[];
  upcomingSchedules: {
    _id: string; // Changed to _id to match MongoDB default
    title: string;
    doctorName: string;
    date: string;
    status: 'Confirmed' | 'Pending';
  }[];
}

export interface User {
  _id: string; // FIXED: Changed from 'id' to '_id' to match your error
  name: string;
  email: string;
  role: Role;
  
  // Patient specific
  age?: number;
  assignedDoctor?: string;
  
  // Doctor/Provider specific
  specialization?: string;
  licenseNumber?: string;      // Added for AuthPage
  yearsOfExperience?: number;  // Added for AuthPage
  bio?: string;                // Added for AuthPage
}

export interface Goal {
  _id: string; // Changed to _id
  title: string;
  target: string;
  status: 'active' | 'achieved' | 'overdue';
  progress: number; // 0-100
}

export interface Appointment {
  _id: string; // Changed to _id
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  priority?: 'critical' | 'moderate' | 'regular';
}