import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import type { DashboardData } from '../../types';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch Data on Load
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?._id) return;
      try {
        const response = await api.post('/data/getPatientData', { userId: user._id });
        setData(response.data.data || response.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
        setError('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  // 2. Loading / Error States
  if (loading) return <div className="p-12 text-center text-gray-500">Loading your health summary...</div>;
  if (error) return <div className="p-12 text-center text-red-500">{error}</div>;
  if (!data) return <div className="p-12 text-center text-gray-500">No data available.</div>;

  // 3. Calculate Progress Circle dynamically
  const radius = 56;
  const circumference = 2 * Math.PI * radius; // ~351.86
  const offset = circumference - (data.goalsMatch.percentage / 100) * circumference;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Hello, {user?.name || 'Patient'}</h1>
        <p className="text-gray-500">Here is your daily health summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Goals Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm md:col-span-2 flex flex-col sm:flex-row items-center gap-8">
          {/* Dynamic CSS Circle */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx="64" cy="64" r={radius}
                stroke="currentColor" strokeWidth="12"
                fill="transparent" className="text-gray-100"
              />
              {/* Progress Circle */}
              <circle
                cx="64" cy="64" r={radius}
                stroke="currentColor" strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset} // Dynamic Offset
                className="text-indigo-600 transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-gray-800">{data.goalsMatch.percentage}%</span>
              <span className="text-xs text-gray-500">Goal Reached</span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{data.goalsMatch.statusMessage}</h3>
            <p className="text-gray-500 mb-4">
              Your daily goals are being tracked. Keep up the consistency!
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              {/* Render 'On Track' items */}
              {data.goalsMatch.onTrack.map((item, idx) => (
                <span key={`ot-${idx}`} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium flex items-center">
                  ✅ {item}
                </span>
              ))}
              {/* Render 'Needs Attention' items */}
              {data.goalsMatch.needsAttention.map((item, idx) => (
                <span key={`na-${idx}`} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium flex items-center">
                  ⚠️ {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Doctor Tips */}
        <div className="bg-indigo-50 p-6 rounded-2xl shadow-sm border border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-lg text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-indigo-900">Doctor's Tips</h3>
          </div>
          
          <ul className="space-y-4">
            {data.tips.length > 0 ? (
              data.tips.map((tip) => (
                // FIX: Used tip._id instead of tip.id
                <li key={tip._id} className="bg-white/60 p-3 rounded-xl text-sm text-indigo-800">
                  <span className="font-semibold block mb-1">💡 Advice</span>
                  {tip.content}
                </li>
              ))
            ) : (
              <li className="text-sm text-indigo-400 italic">No new tips from your doctor.</li>
            )}
          </ul>
        </div>

        {/* 3. Upcoming Schedule */}
        <div className="bg-white p-6 rounded-2xl shadow-sm md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Upcoming Schedule</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View Calendar</button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data.upcomingSchedules.length > 0 ? (
              data.upcomingSchedules.map((item) => {
                const dateObj = new Date(item.date);
                return (
                  // FIX: Used item._id instead of item.id
                  <div key={item._id} className="flex items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-14 h-14 bg-indigo-50 rounded-xl flex flex-col items-center justify-center text-indigo-600 font-bold mr-4 shrink-0">
                      <span className="text-lg">{dateObj.getDate()}</span>
                      <span className="text-xs uppercase">{dateObj.toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 truncate">{item.title}</h4>
                      <p className="text-sm text-gray-500 truncate">{item.doctorName}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`ml-2 px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap ${
                      item.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 col-span-2 text-center py-4">No upcoming appointments scheduled.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;