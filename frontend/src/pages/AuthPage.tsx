import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  
  // State
  const [role, setRole] = useState<Role>('patient');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  
  // Form Data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Doctor Specific Data
  const [specialization, setSpecialization] = useState('');
  const [license, setLicense] = useState('');
  const [experience, setExperience] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        // Prepare Register Payload
        const baseData = { name, email, password, role: role === 'doctor' ? 'provider' : 'patient' };
        
        const payload = role === 'doctor' 
          ? { ...baseData, specialization, licenseNumber: license, yearsOfExperience: Number(experience), bio: 'New doctor' }
          : baseData;

        await register(payload);
      } else {
        // Prepare Login Payload
        await login({ email, password });
      }
    } catch (err: any) {
      // Handle axios error response
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">WellnessConnect</h1>
        <p className="text-center text-gray-500 mb-8">Healthcare management simplified.</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
          <button
            type="button"
            onClick={() => { setRole('patient'); setError(''); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              role === 'patient' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
            }`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => { setRole('doctor'); setError(''); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              role === 'doctor' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
            }`}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder={role === 'patient' ? "John Doe" : "Dr. Sarah Smith"} 
              />
            </div>
          )}

          {/* Doctor Specific Registration Fields */}
          {isRegistering && role === 'doctor' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input 
                  type="text" 
                  required 
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="Cardiologist" 
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">License #</label>
                  <input 
                    type="text" 
                    required 
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="LIC123" 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years Exp.</label>
                  <input 
                    type="number" 
                    required 
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="10" 
                  />
                </div>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="name@example.com" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors">
            {isRegistering ? 'Register & Login' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {isRegistering 
              ? 'Already have an account? Login' 
              : 'New to WellnessConnect? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;