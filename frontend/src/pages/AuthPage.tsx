import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';
import { Activity } from 'lucide-react'; // Optional: Assuming you might have lucide-react for icons

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
    <div className="min-h-screen w-full flex">
      
      {/* LEFT SIDE: Decorative Image Section (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")' }} 
        />
        
        {/* Decorative Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-800 opacity-90" />

        {/* Branding Content */}
        <div className="relative z-10 w-full flex flex-col justify-center px-12 text-white h-full">
          <div className="mb-6 p-3 bg-white/10 w-fit rounded-xl backdrop-blur-sm">
            {/* If you don't have lucide-react, you can remove the Icon or use an SVG */}
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6">WellnessConnect</h1>
          <p className="text-xl text-indigo-100 max-w-md leading-relaxed">
            Experience the future of healthcare management. Connect with top specialists and track your health journey in one secure platform.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
        {/* Changed max-w-md to max-w-xl and increased padding for a wider form */}
        <div className="w-full max-w-xl space-y-8">
          
          {/* Mobile Header (Visible only on small screens) */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-gray-600">
              Please enter your details to access your portal.
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => { setRole('patient'); setIsRegistering(false); }}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'patient' 
                  ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Patient Portal
            </button>
            <button
              onClick={() => { setRole('doctor'); setIsRegistering(false); }}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'doctor' 
                  ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-gray-200' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Doctor Portal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && role === 'patient' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                  placeholder="John Doe" 
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                placeholder="name@example.com" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                required 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-lg transition-all transform hover:scale-[1.01] shadow-lg shadow-indigo-200">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {role === 'patient' && (
            <div className="text-center pt-4">
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
              >
                {isRegistering 
                  ? 'Already have an account? Log in' 
                  : 'New to WellnessConnect? Register for free'}
              </button>
            </div>
          )}
          
          <div className="text-center mt-6">
             <p className="text-xs text-gray-400">© 2024 WellnessConnect. Secure HIPAA Compliant Login.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;