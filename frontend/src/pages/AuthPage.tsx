import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

const AuthPage: React.FC = () => {
  const { login } = useAuth();
  const [role, setRole] = useState<Role>('patient');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role, email);
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">WellnessConnect</h1>
        <p className="text-center text-gray-500 mb-8">Healthcare management simplified.</p>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
          <button
            onClick={() => { setRole('patient'); setIsRegistering(false); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              role === 'patient' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
            }`}
          >
            Patient
          </button>
          <button
            onClick={() => { setRole('doctor'); setIsRegistering(false); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              role === 'doctor' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'
            }`}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && role === 'patient' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="John Doe" />
            </div>
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
            <input type="password" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors">
            {isRegistering ? 'Register & Login' : 'Login'}
          </button>
        </form>

        {role === 'patient' && (
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
        )}
      </div>
    </div>
  );
};

export default AuthPage;