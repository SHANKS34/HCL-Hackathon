import React, { useState } from 'react';
import { 
  Footprints, Clock, Moon, Flame, MapPin, 
  BarChart3, Edit2, Save, X, Bell, Droplets 
} from 'lucide-react';

const PatientGoals: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // State to hold goal data (matching your mock values)
  const [goals, setGoals] = useState({
    steps: { current: 3620, target: 6000 },
    activeTime: { current: 56, target: 60, calories: 1712, distance: 1.23 },
    sleep: { hours: 6, minutes: 30, start: '11:30 pm', end: '06:00 am' }
  });

  // Temporary state for editing
  const [editForm, setEditForm] = useState(goals);

  const handleEdit = () => {
    setEditForm(goals);
    setIsEditing(true);
  };

  const handleSave = () => {
    setGoals(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Helper to calculate percentage for progress bars
  const getPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Page Header with Edit Button */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Wellness Goals</h1>
          <p className="text-gray-500">Track and update your daily targets</p>
        </div>
        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <button 
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <X size={18} /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Save size={18} /> Save Targets
              </button>
            </div>
          ) : (
            <button 
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <Edit2 size={18} /> Edit Goals
            </button>
          )}
        </div>
      </div>

      {/* --- GOAL CARDS SECTION --- */}
      <div className="space-y-6">
        
        {/* 1. Steps Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                <Footprints size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-800">Steps</h3>
            </div>
            <div className="text-center">
              <span className="text-xs text-gray-400 block mb-1">Now</span>
              <BarChart3 className="text-gray-400" size={20} />
            </div>
          </div>

          <div className="mb-4">
            {isEditing ? (
               <div className="flex items-center gap-2">
                 <span className="text-2xl font-bold text-gray-400">{goals.steps.current}</span>
                 <span className="text-gray-400">/</span>
                 <input 
                   type="number"
                   value={editForm.steps.target}
                   onChange={(e) => setEditForm({...editForm, steps: {...editForm.steps, target: Number(e.target.value)}})}
                   className="border border-indigo-300 rounded px-2 py-1 w-24 text-xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                 />
                 <span className="text-gray-500 text-sm font-medium">steps</span>
               </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-800">{goals.steps.current}</span>
                <span className="text-gray-500 font-medium">/ {goals.steps.target} steps</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-8 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
            <div 
              className="absolute top-0 left-0 h-full bg-gray-400 transition-all duration-1000 ease-out flex items-center justify-end pr-3"
              style={{ width: `${getPercentage(goals.steps.current, goals.steps.target)}%` }}
            >
              <span className="text-white text-xs font-bold">{getPercentage(goals.steps.current, goals.steps.target)}%</span>
            </div>
          </div>
        </div>

        {/* 2. Active Time Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
              <Clock size={24} />
            </div>
            <h3 className="font-bold text-lg text-gray-800">Active Time</h3>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            {/* Main Time Stat */}
            <div>
              {isEditing ? (
                 <div className="flex items-center gap-2">
                   <span className="text-2xl font-bold text-gray-400">{goals.activeTime.current}</span>
                   <span className="text-gray-400">/</span>
                   <input 
                     type="number"
                     value={editForm.activeTime.target}
                     onChange={(e) => setEditForm({...editForm, activeTime: {...editForm.activeTime, target: Number(e.target.value)}})}
                     className="border border-indigo-300 rounded px-2 py-1 w-20 text-xl font-bold text-gray-800"
                   />
                   <span className="text-gray-500 font-medium">mins</span>
                 </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-800">{goals.activeTime.current}</span>
                  <span className="text-gray-500 font-medium">/ {goals.activeTime.target} mins</span>
                </div>
              )}
            </div>

            {/* Sub Stats (Calories & Distance) */}
            <div className="flex items-center gap-4 text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-orange-500" />
                <span className="text-sm font-semibold">{goals.activeTime.calories} Kcal</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" />
                <span className="text-sm font-semibold">{goals.activeTime.distance} km</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Sleep Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
              <Moon size={24} />
            </div>
            <h3 className="font-bold text-lg text-gray-800">Sleep</h3>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            {/* Sleep Duration */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-800">{goals.sleep.hours}</span>
                <span className="text-gray-500 font-medium text-sm">hrs</span>
                <span className="text-3xl font-bold text-gray-800">{goals.sleep.minutes}</span>
                <span className="text-gray-500 font-medium text-sm">mins</span>
              </div>
            </div>

            {/* Sleep Schedule Visual */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-gray-400 text-sm font-medium">
                {goals.sleep.start} - {goals.sleep.end}
              </span>
              {/* Visual Sleep Pill Representation */}
              <div className="flex gap-1">
                 {[1,2,3,4,5,6].map((i) => (
                   <div key={i} className={`h-3 w-4 rounded-sm ${i > 4 ? 'bg-gray-200' : 'bg-gray-400'}`}></div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER SECTIONS FROM MOCK --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        {/* Preventive Care Reminders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bell size={18} className="text-indigo-500" /> Preventive Care Reminders
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5"></span>
              <span>Upcoming: Annual blood test on <strong>23rd Jan 2025</strong></span>
            </li>
          </ul>
        </div>

        {/* Health Tip */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Droplets size={18} className="text-blue-500" /> Health Tip of the Day
          </h4>
          <p className="text-sm text-gray-600 italic leading-relaxed">
            "Stay hydrated! Aim to drink at least 8 glasses of water per day to maintain energy levels."
          </p>
        </div>

      </div>
    </div>
  );
};

export default PatientGoals;