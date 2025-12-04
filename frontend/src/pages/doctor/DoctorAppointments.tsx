import React, { useState } from 'react';
import type { Appointment } from '../../types';

// Mock Data
const mockAppointments: Appointment[] = [
  // FIX 1: Changed 'id' to '_id'
  { _id: '1', patientName: 'John Doe', doctorName: 'Me', date: '2025-10-24', time: '10:00', reason: 'Chest Pain', status: 'scheduled', priority: 'critical' },
  { _id: '2', patientName: 'Jane Smith', doctorName: 'Me', date: '2025-10-24', time: '11:00', reason: 'Flu', status: 'scheduled', priority: 'moderate' },
  { _id: '3', patientName: 'Alice Johnson', doctorName: 'Me', date: '2025-10-24', time: '12:00', reason: 'Routine', status: 'scheduled', priority: 'regular' },
];

const DoctorAppointments: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'moderate' | 'regular'>('all');

  const filteredApps = mockAppointments.filter(app => 
    filter === 'all' ? true : app.priority === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Active Appointment Status</h2>
          <p className="text-gray-500">Manage patient queue and priorities</p>
        </div>
        <div className="flex gap-2">
          {['all', 'critical', 'moderate', 'regular'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Patient</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Time</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Ailment</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Priority</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredApps.map((app) => (
              // FIX 2: Changed key from 'app.id' to 'app._id'
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{app.patientName}</td>
                <td className="px-6 py-4 text-gray-600">{app.time}</td>
                <td className="px-6 py-4 text-gray-600">{app.reason}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    app.priority === 'critical' ? 'bg-red-100 text-red-700' :
                    app.priority === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {app.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointments;