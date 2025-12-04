export type Role = 'patient' | 'doctor';

export interface WellnessGoal {
  id: string;
  title: string;
  status: 'active' | 'achieved' | 'overdue';
  progress: number;
}

export interface DoctorTip {
  id: string;
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
    id: string;
    title: string;
    doctorName: string;
    date: string;
    status: 'Confirmed' | 'Pending';
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  // Patient specific
  age?: number;
  assignedDoctor?: string;
  // Doctor specific
  specialization?: string;
}

export interface Goal {
  id: string;
  title: string;
  target: string;
  status: 'active' | 'achieved' | 'overdue';
  progress: number; // 0-100
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  priority?: 'critical' | 'moderate' | 'regular'; // For doctors
}