import type { Reminder } from '../types';


export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


export const DAILY_TIPS: string[] = [
"Drink at least 8 glasses of water today.",
"Take a 10-minute walk after lunch to boost digestion.",
"Reduce screen time 1 hour before bed for better sleep.",
"Schedule your annual dental checkup if you haven't yet.",
"Eat a colorful salad to get a variety of vitamins."
];


export const MOCK_REMINDERS: Reminder[] = [
{ id: 1, text: "Annual Blood Test", date: "2023-11-15", type: "urgent" },
{ id: 2, text: "Flu Vaccination", date: "2023-12-01", type: "warning" },
{ id: 3, text: "Dental Cleaning", date: "2024-01-10", type: "normal" },
];


export const COMPLIANCE_STATUS = {
MET: { label: "Goal Met", color: "text-green-600 bg-green-100" },
MISSED: { label: "Missed Checkup", color: "text-red-600 bg-red-100" },
PENDING: { label: "Pending Review", color: "text-yellow-600 bg-yellow-100" }
} as const;