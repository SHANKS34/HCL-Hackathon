export type Role = 'patient' | 'doctor';

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