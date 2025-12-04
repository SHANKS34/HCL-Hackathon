import React from 'react';

const PatientDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Goals Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Goals Match Status</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-indigo-500 flex items-center justify-center">
            <span className="text-xl font-bold text-indigo-600">85%</span>
          </div>
          <div>
            <p className="text-gray-600">You are doing great!</p>
            <p className="text-sm text-gray-400 mt-1">On track for: Water intake, Sleep</p>
            <p className="text-sm text-red-400 mt-1">Needs attention: Steps count</p>
          </div>
        </div>
      </div>

      {/* 2. Doctor Tips */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Doctor's Advised Tips</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2 text-sm text-blue-700">
            <span className="mt-1">•</span> Reduce salt intake for better BP management.
          </li>
          <li className="flex items-start gap-2 text-sm text-blue-700">
            <span className="mt-1">•</span> Try to walk 15 mins post-dinner.
          </li>
        </ul>
      </div>

      {/* 3. Upcoming Schedule */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 lg:col-span-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Health Schedules</h3>
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                  2{item}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">General Checkup</h4>
                  <p className="text-sm text-gray-500">Dr. Sarah Smith • 10:00 AM</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">Confirmed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;