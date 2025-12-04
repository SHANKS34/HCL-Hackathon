export type UserRole = 'patient' | 'provider';


export interface HealthInfo {
allergies: string;
medications: string;
bloodType: string;
}


export interface User {
id: string;
name: string;
email: string;
role: UserRole;
token?: string;
}


export interface UserProfile {
userId: string;
fullName: string;
healthInfo: HealthInfo;
}


export interface LogEntry {
steps: string | number;
water: string | number;
sleep: string | number;
date?: string;
_id?: string;
}


export interface Reminder {
id: number;
text: string;
date: string;
type: 'urgent' | 'warning' | 'normal';
}


export interface PatientMock {
id: string;
name: string;
status: 'MET' | 'MISSED' | 'PENDING';
lastVisit: string;
nextGoal: string;
}