import React, { useEffect, useState } from 'react';
import type { User, LogEntry } from '../types';
import { DAILY_TIPS, MOCK_REMINDERS } from '../utils/constants';
import { apiCall } from '../utils/api';
import { Icons } from '../components/SharedIcons';


export const PatientDashboard: React.FC<{ user: User }> = ({ user }) => {
const [tip, setTip] = useState(DAILY_TIPS[0]);
const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);


useEffect(() => {
setTip(DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)]);
if (user.id) apiCall(`/logs/${user.id}`).then(setRecentLogs).catch(console.error);
}, [user]);


const todayLog = recentLogs[0] || { water: 0, sleep: 0, steps: 0 };


return (<div> ... paste dashboard JSX ... </div>);
};