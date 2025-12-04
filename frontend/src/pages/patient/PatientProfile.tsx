import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Edit2, Save, X, 
  Activity, AlertCircle, HeartPulse, Ruler 
} from 'lucide-react';

// 1. Define Types for this page
interface PatientProfileData {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  height: number; // cm
  weight: number; // kg
  allergies: string[];
  conditions: string[];
  address: string;
  emergencyContact: string;
}

const PatientProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  // 2. Mock Data (In a real app, fetch this from API)
  const [profile, setProfile] = useState<PatientProfileData>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dob: '1985-04-12',
    gender: 'Male',
    bloodGroup: 'O+',
    height: 175,
    weight: 78,
    allergies: ['Peanuts', 'Penicillin'],
    conditions: ['Hypertension', 'Mild Asthma'],
    address: '123 Wellness Blvd, Health City, HC 90210',
    emergencyContact: 'Jane Doe (+1 555-987-6543)'
  });

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'height' || name === 'weight' ? Number(value) : value
    }));
  };

  // Calculate BMI dynamically
  const bmi = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center md:items-start gap-6 relative">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 border-4 border-white shadow-md">
          <User size={40} />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-gray-500">Patient • ID: #P-88321</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
              {profile.gender}
            </span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-100">
              {calculateAge(profile.dob)} Years Old
            </span>
            <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-100 flex items-center gap-1">
              <HeartPulse size={14} /> {profile.bloodGroup}
            </span>
          </div>
        </div>

        {/* Edit Toggle Buttons */}
        <div className="absolute top-6 right-6">
          {isEditing ? (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <X size={16} /> Cancel
              </button>
              <button 
                onClick={() => setIsEditing(false)} // Save logic would go here
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <Edit2 size={16} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUMN 1: CONTACT & PERSONAL INFO */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField 
              label="Email Address" 
              value={profile.email} 
              icon={<Mail size={18} />} 
              isEditing={isEditing} 
              name="email" 
              onChange={handleChange} 
            />
            <InfoField 
              label="Phone Number" 
              value={profile.phone} 
              icon={<Phone size={18} />} 
              isEditing={isEditing} 
              name="phone" 
              onChange={handleChange} 
            />
            <InfoField 
              label="Date of Birth" 
              value={profile.dob} 
              type="date"
              isEditing={isEditing} 
              name="dob" 
              onChange={handleChange} 
            />
             <InfoField 
              label="Home Address" 
              value={profile.address} 
              icon={<MapPin size={18} />} 
              isEditing={isEditing} 
              name="address" 
              fullWidth
              onChange={handleChange} 
            />
             <InfoField 
              label="Emergency Contact" 
              value={profile.emergencyContact} 
              icon={<AlertCircle size={18} />} 
              isEditing={isEditing} 
              name="emergencyContact" 
              fullWidth
              className="text-red-600 font-medium"
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* COLUMN 2: HEALTH SNAPSHOT */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Vitals Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="text-indigo-500" /> Vitals
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                    <Ruler size={16} />
                  </div>
                  <span className="text-gray-600 text-sm">Height (cm)</span>
                </div>
                {isEditing ? (
                  <input 
                    name="height" 
                    type="number" 
                    value={profile.height} 
                    onChange={handleChange}
                    className="w-20 text-right p-1 border rounded"
                  />
                ) : (
                  <span className="font-bold text-gray-800">{profile.height} cm</span>
                )}
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                   {/* Using text for weight icon for simplicity */}
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm font-bold text-xs">
                    Kg
                  </div>
                  <span className="text-gray-600 text-sm">Weight (kg)</span>
                </div>
                {isEditing ? (
                  <input 
                    name="weight" 
                    type="number" 
                    value={profile.weight} 
                    onChange={handleChange}
                    className="w-20 text-right p-1 border rounded"
                  />
                ) : (
                  <span className="font-bold text-gray-800">{profile.weight} kg</span>
                )}
              </div>

              {/* Calculated BMI */}
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Body Mass Index (BMI)</p>
                <p className={`text-2xl font-bold mt-1 ${
                  Number(bmi) > 25 ? 'text-orange-500' : 'text-green-500'
                }`}>
                  {bmi}
                </p>
                <p className="text-xs text-gray-400">
                  {Number(bmi) > 25 ? 'Overweight' : 'Normal Weight'}
                </p>
              </div>
            </div>
          </div>

          {/* Medical Alerts Card (Read Only usually) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Medical History</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Chronic Conditions</p>
              <div className="flex flex-wrap gap-2">
                {profile.conditions.map(c => (
                  <span key={c} className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-lg border border-yellow-100 font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Allergies</p>
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map(a => (
                  <span key={a} className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 font-medium">
                    {a}
                  </span>
                ))}
              </div>
            </div>
            {isEditing && (
              <p className="text-xs text-gray-400 mt-4 italic">
                * To update medical history, please consult your assigned doctor.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Helper Component for Form Fields ---
const InfoField = ({ 
  label, value, icon, isEditing, name, onChange, type = "text", fullWidth, className = "" 
}: any) => (
  <div className={`${fullWidth ? 'col-span-1 md:col-span-2' : ''}`}>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
      {label}
    </label>
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
      isEditing ? 'bg-white border-indigo-300 ring-2 ring-indigo-50' : 'bg-gray-50 border-transparent'
    }`}>
      {icon && <div className="text-gray-400">{icon}</div>}
      {isEditing ? (
        <input 
          type={type} 
          name={name}
          value={value} 
          onChange={onChange}
          className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-400"
        />
      ) : (
        <span className={`text-gray-800 font-medium ${className}`}>{value}</span>
      )}
    </div>
  </div>
);

// Helper for Age
const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff); 
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default PatientProfile;