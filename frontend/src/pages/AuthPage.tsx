import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC = () => {
  const { login, register, error } = useAuth();
  // UI Role State (Toggle)
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor'>('patient');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    // Doctor specific fields
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: 0,
    bio: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegistering) {
        // Prepare Register Payload
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole === 'doctor' ? 'provider' : 'patient', // Map UI 'doctor' to API 'provider'
          ...(selectedRole === 'doctor' && {
            specialization: formData.specialization,
            licenseNumber: formData.licenseNumber,
            yearsOfExperience: Number(formData.yearsOfExperience),
            bio: formData.bio
          })
        };
        await register(payload);
      } else {
        // Prepare Login Payload
        await login({
          email: formData.email,
          password: formData.password
        });
      }
    } catch (err) {
      console.error(err);
      // Error is handled in context and displayed below
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 my-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">WellnessConnect</h1>
        <p className="text-center text-gray-500 mb-6">Healthcare management simplified.</p>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => { setSelectedRole('patient'); setIsRegistering(false); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              selectedRole === 'patient' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
            }`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => { setSelectedRole('doctor'); setIsRegistering(false); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              selectedRole === 'doctor' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
            }`}
          >
            Doctor
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* REGISTER FIELDS */}
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                name="name" 
                type="text" 
                required 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
          )}

          {/* DOCTOR SPECIFIC REGISTER FIELDS */}
          {isRegistering && selectedRole === 'doctor' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input name="specialization" type="text" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Cardiologist" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License #</label>
                  <input name="licenseNumber" type="text" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Yrs)</label>
                  <input name="yearsOfExperience" type="number" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea name="bio" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-20"></textarea>
              </div>
            </>
          )}
          
          {/* COMMON FIELDS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="name@example.com" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-indigo-400"
          >
            {isLoading ? 'Processing...' : (isRegistering ? 'Register & Login' : 'Login')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
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