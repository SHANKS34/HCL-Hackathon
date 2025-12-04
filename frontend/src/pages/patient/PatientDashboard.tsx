import React from 'react';

const PatientDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section - Matches the Profile Page Header style */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Hello, Mrs. Maria Waston</h1>
        <p className="text-gray-500">Here is your daily health summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Goals Status - Styled to look like the reference card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm md:col-span-2 flex flex-col sm:flex-row items-center gap-8">
          {/* Custom CSS Circle for 85% */}
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-100"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={351.86} // 2 * pi * r
                strokeDashoffset={351.86 - (351.86 * 0.85)} // 85% filled
                className="text-indigo-600"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-gray-800">85%</span>
              <span className="text-xs text-gray-500">Goal Reached</span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-800 mb-2">You are doing great!</h3>
            <p className="text-gray-500 mb-4">Your daily goals are almost met. Keep up the good work on your hydration and sleep schedule.</p>
            
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
               <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium flex items-center">
                 💧 Water Intake
               </span>
               <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium flex items-center">
                 😴 Sleep
               </span>
               <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium flex items-center">
                 👣 Steps (Low)
               </span>
            </div>
          </div>
        </div>

        {/* 2. Doctor Tips - Styled as a "Soft Blue" Widget */}
        <div className="bg-indigo-50 p-6 rounded-2xl shadow-sm border border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-lg text-indigo-600">
              {/* Simple Bulb Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-indigo-900">Doctor's Tips</h3>
          </div>
          
          <ul className="space-y-4">
            <li className="bg-white/60 p-3 rounded-xl text-sm text-indigo-800">
              <span className="font-semibold block mb-1">🩸 BP Management</span>
              Reduce salt intake in your dinner meals specifically.
            </li>
            <li className="bg-white/60 p-3 rounded-xl text-sm text-indigo-800">
              <span className="font-semibold block mb-1">🏃‍♀️ Evening Activity</span>
              Try to walk 15 mins post-dinner to aid digestion.
            </li>
          </ul>
        </div>

        {/* 3. Upcoming Schedule - Full width bottom section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Upcoming Schedule</h3>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View Calendar</button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex flex-col items-center justify-center text-indigo-600 font-bold mr-4">
                  <span className="text-lg">2{item}</span>
                  <span className="text-xs uppercase">Oct</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">General Checkup</h4>
                  <p className="text-sm text-gray-500">Dr. Sarah Smith • Cardiology</p>
                  <p className="text-xs text-gray-400 mt-1">10:00 AM - 11:30 AM</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;