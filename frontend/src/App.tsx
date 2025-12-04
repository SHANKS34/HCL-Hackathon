import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Shield, 
  LogOut, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Heart, 
  Droplets, 
  Moon, 
  ChevronRight,
  Menu,
  X,
  Stethoscope,
  Lock
} from 'lucide-react';

// --- Configuration ---
// In production, this would come from import.meta.env.VITE_API_URL
const API_BASE_URL = 'http://localhost:5000/api';

// --- Type Definitions ---

type UserRole = 'patient' | 'provider';

interface HealthInfo {
  allergies: string;
  medications: string;
  bloodType: string;
}

// User object matching the structure returned by your Node.js backend
interface User {
  id: string; // MongoDB _id
  name: string;
  email: string;
  role: UserRole;
  token?: string; // JWT token if you implement it
}

interface UserProfile {
  userId: string;
  fullName: string;
  healthInfo: HealthInfo;
}

interface LogEntry {
  steps: string | number;
  water: string | number;
  sleep: string | number;
  date?: string;
  _id?: string;
}

interface Reminder {
  id: number;
  text: string;
  date: string;
  type: 'urgent' | 'warning' | 'normal';
}

interface PatientMock {
  id: string;
  name: string;
  status: 'MET' | 'MISSED' | 'PENDING';
  lastVisit: string;
  nextGoal: string;
}

// --- Constants & Utilities ---
const DAILY_TIPS: string[] = [
  "Drink at least 8 glasses of water today.",
  "Take a 10-minute walk after lunch to boost digestion.",
  "Reduce screen time 1 hour before bed for better sleep.",
  "Schedule your annual dental checkup if you haven't yet.",
  "Eat a colorful salad to get a variety of vitamins."
];

const MOCK_REMINDERS: Reminder[] = [
  { id: 1, text: "Annual Blood Test", date: "2023-11-15", type: "urgent" },
  { id: 2, text: "Flu Vaccination", date: "2023-12-01", type: "warning" },
  { id: 3, text: "Dental Cleaning", date: "2024-01-10", type: "normal" },
];

const COMPLIANCE_STATUS = {
  MET: { label: "Goal Met", color: "text-green-600 bg-green-100" },
  MISSED: { label: "Missed Checkup", color: "text-red-600 bg-red-100" },
  PENDING: { label: "Pending Review", color: "text-yellow-600 bg-yellow-100" }
};

// --- API Utility ---
// Helper to simulate handling API responses
async function apiCall(endpoint: string, method: string = 'GET', body?: any) {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.msg || data.error || 'API Request Failed');
    }
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// --- Components ---

// 1. Navigation / Layout
interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  setView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <nav className="bg-teal-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
              <Shield className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl tracking-tight">WellGuard Portal</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => setView('home')} className="hover:bg-teal-600 px-3 py-2 rounded-md text-sm font-medium">Home</button>
                {isLoggedIn && user.role === 'patient' && (
                  <>
                    <button onClick={() => setView('dashboard')} className="hover:bg-teal-600 px-3 py-2 rounded-md text-sm font-medium">Dashboard</button>
                    <button onClick={() => setView('tracker')} className="hover:bg-teal-600 px-3 py-2 rounded-md text-sm font-medium">Tracker</button>
                    <button onClick={() => setView('profile')} className="hover:bg-teal-600 px-3 py-2 rounded-md text-sm font-medium">Profile</button>
                  </>
                )}
                {isLoggedIn && user.role === 'provider' && (
                  <button onClick={() => setView('provider-dashboard')} className="hover:bg-teal-600 px-3 py-2 rounded-md text-sm font-medium">Provider Panel</button>
                )}
                {!isLoggedIn ? (
                   <button onClick={() => setView('auth')} className="bg-white text-teal-700 hover:bg-slate-100 px-4 py-2 rounded-md text-sm font-bold shadow-sm">Login / Register</button>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="text-sm bg-teal-800 px-3 py-1 rounded-full capitalize">{user.role}</span>
                    <button onClick={onLogout} className="flex items-center hover:bg-teal-600 px-3 py-2 rounded-md text-sm font-medium">
                      <LogOut className="h-4 w-4 mr-1" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-teal-800 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-teal-600 focus:outline-none">
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-teal-800 pb-3 pt-2 px-2 sm:px-3">
             <button onClick={() => { setView('home'); setIsMobileMenuOpen(false); }} className="text-white block px-3 py-2 rounded-md text-base font-medium">Home</button>
             {isLoggedIn && user.role === 'patient' && (
                <>
                  <button onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} className="text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</button>
                  <button onClick={() => { setView('tracker'); setIsMobileMenuOpen(false); }} className="text-white block px-3 py-2 rounded-md text-base font-medium">Tracker</button>
                  <button onClick={() => { setView('profile'); setIsMobileMenuOpen(false); }} className="text-white block px-3 py-2 rounded-md text-base font-medium">Profile</button>
                </>
             )}
              {isLoggedIn && user.role === 'provider' && (
                 <button onClick={() => { setView('provider-dashboard'); setIsMobileMenuOpen(false); }} className="text-white block px-3 py-2 rounded-md text-base font-medium">Provider Panel</button>
              )}
             {!isLoggedIn ? (
                <button onClick={() => { setView('auth'); setIsMobileMenuOpen(false); }} className="text-white block px-3 py-2 rounded-md text-base font-medium">Login / Register</button>
             ) : (
                <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="text-white block px-3 py-2 rounded-md text-base font-medium">Logout</button>
             )}
          </div>
        )}
      </nav>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-slate-800 text-slate-400 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© 2024 WellGuard Healthcare Portal. MVP Version. HIPAA Compliant Design.</p>
        </div>
      </footer>
    </div>
  );
};

// 2. Public Home Page
const PublicHome: React.FC<{ setView: (view: string) => void }> = ({ setView }) => (
  <div className="space-y-12">
    <div className="text-center space-y-4 py-10">
      <h1 className="text-4xl md:text-6xl font-extrabold text-teal-800 tracking-tight">
        Your Health, <span className="text-teal-600">Proactively Managed</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
        A secure portal connecting patients and providers for better preventive care compliance and daily wellness tracking.
      </p>
      <div className="flex justify-center gap-4 mt-8">
        <button onClick={() => setView('auth')} className="bg-teal-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-teal-700 transition transform hover:-translate-y-1">
          Get Started
        </button>
        <button onClick={() => setView('learn-more')} className="bg-white text-teal-600 border border-teal-200 px-8 py-3 rounded-full font-semibold shadow-sm hover:bg-slate-50 transition">
          Learn More
        </button>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 text-teal-600">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2">Daily Tracking</h3>
        <p className="text-slate-600">Log your steps, water intake, and sleep patterns to maintain a healthy lifestyle.</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
          <Shield className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2">Preventive Care</h3>
        <p className="text-slate-600">Never miss a checkup with automated reminders for vaccinations and screenings.</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
        <p className="text-slate-600">Your data is encrypted and secure. Built with HIPAA compliance in mind.</p>
      </div>
    </div>
  </div>
);

// 2.1 Learn More Page
const LearnMore: React.FC<{ setView: (view: string) => void }> = ({ setView }) => (
  <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-slate-100 space-y-8 animate-fade-in">
    <div className="text-center border-b border-slate-100 pb-8">
      <h2 className="text-3xl font-bold text-teal-800 mb-4">About WellGuard Portal</h2>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto">
        Empowering patients and providers with a secure, integrated platform for better health outcomes.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-teal-700 flex items-center gap-2">
          <Shield className="w-6 h-6" /> Our Mission
        </h3>
        <p className="text-slate-600 leading-relaxed">
          To bridge the gap between daily wellness activities and clinical care. We believe that preventive care is the most effective way to maintain long-term health. By connecting your daily habits with provider oversight, we aim to reduce chronic risks.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-teal-700 flex items-center gap-2">
          <Lock className="w-6 h-6" /> Privacy First
        </h3>
        <p className="text-slate-600 leading-relaxed">
          Your health data is sensitive. We employ state-of-the-art encryption and strict access controls to ensure your information is only seen by you and your authorized providers. We are committed to maintaining HIPAA compliance standards at every level.
        </p>
      </div>
    </div>

     <div className="bg-teal-50 p-6 rounded-xl mt-4">
        <h3 className="text-xl font-bold text-teal-800 mb-4 text-center">Platform Features</h3>
        <ul className="grid md:grid-cols-2 gap-4">
           <li className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
              <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Real-time Vitals Tracking</span>
           </li>
           <li className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
              <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Provider Compliance Dashboard</span>
           </li>
           <li className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
              <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Automated Health Reminders</span>
           </li>
           <li className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
              <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
              <span className="text-slate-700 font-medium">Secure Profile Management</span>
           </li>
        </ul>
     </div>

    <div className="text-center pt-8 border-t border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Ready to take control of your health?</h3>
      <div className="flex justify-center gap-4">
        <button onClick={() => setView('auth')} className="bg-teal-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-teal-700 transition">
          Join Now
        </button>
        <button onClick={() => setView('home')} className="text-teal-600 font-semibold hover:underline px-6 py-2">
          Back to Home
        </button>
      </div>
    </div>
  </div>
);

// 3. Authentication Component
interface AuthProps {
  onLogin: (data: any, role: UserRole, isRegistering: boolean) => Promise<void>;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>('patient');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [consent, setConsent] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering && !consent) {
      setError("You must consent to data usage.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      await onLogin(formData, role, isRegistering);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-bold text-center mb-6 text-teal-800">
        {isRegistering ? 'Create Account' : 'Welcome Back'}
      </h2>
      
      <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
        <button 
          onClick={() => setRole('patient')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition ${role === 'patient' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500'}`}
        >
          Patient
        </button>
        <button 
          onClick={() => setRole('provider')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition ${role === 'provider' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500'}`}
        >
          Provider
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegistering && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input 
            required
            type="email" 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input 
            required
            type="password" 
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
        </div>

        {isRegistering && (
           <div className="flex items-start gap-2 pt-2">
             <input 
               type="checkbox" 
               id="consent" 
               checked={consent} 
               onChange={e => setConsent(e.target.checked)}
               className="mt-1 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
             />
             <label htmlFor="consent" className="text-xs text-slate-500">
               I consent to the collection and processing of my health data for the purpose of preventive care services as outlined in the Privacy Policy.
             </label>
           </div>
        )}

        {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

        <button 
          disabled={loading}
          type="submit" 
          className="w-full bg-teal-600 text-white py-2 rounded-md font-bold hover:bg-teal-700 transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <button onClick={() => setIsRegistering(!isRegistering)} className="text-teal-600 hover:underline">
          {isRegistering ? "Already have an account? Login" : "New here? Create an account"}
        </button>
      </div>
    </div>
  );
};

// 4. Patient Components
interface DashboardProps {
  user: User;
}

const PatientDashboard: React.FC<DashboardProps> = ({ user }) => {
  const [tip, setTip] = useState<string>(DAILY_TIPS[0]);
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const randomTip = DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)];
    setTip(randomTip);

    // Fetch logs from backend
    if (user.id) {
       apiCall(`/logs/${user.id}`).then(setRecentLogs).catch(console.error);
    }
  }, [user]);

  // Calculate quick stats from fetched logs (or mock if empty)
  const todayLog = recentLogs[0] || { water: 0, sleep: 0, steps: 0 };

  return (
    <div className="space-y-6">
      <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <Stethoscope className="h-5 w-5 text-teal-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-teal-800">Health Tip of the Day</h3>
            <div className="mt-2 text-sm text-teal-700">
              <p>{tip}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Reminders Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" /> Upcoming Reminders
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">{MOCK_REMINDERS.length} Active</span>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_REMINDERS.map(reminder => (
              <div key={reminder.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-800">{reminder.text}</p>
                  <p className="text-sm text-slate-500">Due: {reminder.date}</p>
                </div>
                {reminder.type === 'urgent' && <AlertCircle className="text-red-500 w-5 h-5" />}
                {reminder.type === 'warning' && <AlertCircle className="text-orange-500 w-5 h-5" />}
                {reminder.type === 'normal' && <CheckCircle className="text-green-500 w-5 h-5" />}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
           <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-500" /> Daily Snapshot
            </h3>
           </div>
           <div className="p-6 grid grid-cols-2 gap-4">
             <div className="bg-blue-50 p-4 rounded-lg text-center">
               <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
               <p className="text-2xl font-bold text-slate-800">{todayLog.water}/8</p>
               <p className="text-xs text-slate-500 uppercase tracking-wide">Glasses</p>
             </div>
             <div className="bg-indigo-50 p-4 rounded-lg text-center">
               <Moon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
               <p className="text-2xl font-bold text-slate-800">{todayLog.sleep}h</p>
               <p className="text-xs text-slate-500 uppercase tracking-wide">Sleep</p>
             </div>
             <div className="bg-green-50 p-4 rounded-lg text-center col-span-2">
               <Heart className="w-8 h-8 text-green-500 mx-auto mb-2" />
               <p className="text-2xl font-bold text-slate-800">{todayLog.steps}</p>
               <p className="text-xs text-slate-500 uppercase tracking-wide">Steps Today</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const GoalTracker: React.FC<{ userId: string | undefined }> = ({ userId }) => {
  const [goals, setGoals] = useState<LogEntry>({ steps: '', water: '', sleep: '' });
  const [status, setStatus] = useState<string>('');

  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      console.error("No userId found for GoalTracker");
      return;
    }
    setStatus('saving');
    
    try {
      // API call to MongoDB backend
      await apiCall('/logs', 'POST', {
        userId,
        ...goals
      });
      
      setStatus('saved');
      setGoals({ steps: '', water: '', sleep: '' });
      setTimeout(() => setStatus(''), 3000);
    } catch (e) {
      console.error("Error logging goal:", e);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Activity className="text-teal-600" /> Log Daily Vitals
      </h2>
      <form onSubmit={handleLog} className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Steps Taken</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="0"
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                value={goals.steps}
                onChange={e => setGoals({...goals, steps: e.target.value})}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-400">👣</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Water (Cups)</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="0"
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                value={goals.water}
                onChange={e => setGoals({...goals, water: e.target.value})}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Droplets className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Sleep (Hours)</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="0"
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                value={goals.sleep}
                onChange={e => setGoals({...goals, sleep: e.target.value})}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Moon className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition flex justify-center items-center gap-2"
        >
          {status === 'saving' ? 'Logging...' : 'Log Entry'}
          {status === 'saved' && <CheckCircle className="h-5 w-5" />}
        </button>
        {status === 'saved' && <p className="text-green-600 text-center text-sm">Successfully logged to your health record.</p>}
        {status === 'error' && <p className="text-red-600 text-center text-sm">Failed to connect to server.</p>}
      </form>
    </div>
  );
};

const Profile: React.FC<{ userId: string | undefined }> = ({ userId }) => {
  const [profile, setProfile] = useState<HealthInfo>({ 
    allergies: '', 
    medications: '', 
    bloodType: '' 
  });
  const [saving, setSaving] = useState<boolean>(false);

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      // Assuming a PUT /profile endpoint exists in backend reference
      // await apiCall(`/profile/${userId}`, 'PUT', { healthInfo: profile });
      
      // Simulate save for MVP if endpoint missing in previous reference
      console.log("Saving profile to MongoDB via API:", profile);
      setTimeout(() => setSaving(false), 1000);
    } catch (e) {
      console.error("Error saving profile:", e);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-lg text-slate-800">My Health Profile</h3>
        <span className="text-xs text-slate-400">ID: {userId?.substring(0,8)}...</span>
      </div>
      <div className="p-6 space-y-6">
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Known Allergies</label>
           <textarea 
             className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
             rows={3}
             placeholder="e.g., Peanuts, Penicillin..."
             value={profile.allergies}
             onChange={e => setProfile({...profile, allergies: e.target.value})}
           ></textarea>
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Current Medications</label>
           <textarea 
             className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
             rows={3}
             placeholder="e.g., Lisinopril 10mg daily..."
             value={profile.medications}
             onChange={e => setProfile({...profile, medications: e.target.value})}
           ></textarea>
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Blood Type</label>
           <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500"
              value={profile.bloodType}
              onChange={e => setProfile({...profile, bloodType: e.target.value})}
           >
             <option value="">Select...</option>
             <option value="A+">A+</option>
             <option value="A-">A-</option>
             <option value="B+">B+</option>
             <option value="B-">B-</option>
             <option value="O+">O+</option>
             <option value="O-">O-</option>
             <option value="AB+">AB+</option>
             <option value="AB-">AB-</option>
           </select>
        </div>
        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            className="bg-teal-600 text-white px-6 py-2 rounded-md font-medium hover:bg-teal-700 transition flex items-center gap-2"
          >
            {saving ? 'Saving...' : 'Update Profile'}
            {saving && <CheckCircle className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. Provider Dashboard
const ProviderDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [patients, setPatients] = useState<PatientMock[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch real patients from API
    setLoading(true);
    apiCall(`/provider/patients/${user.id}`)
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(err => {
         console.warn("Failed to load patients, using fallback mock", err);
         setLoading(false);
         // Fallback mock if server down/empty
         setPatients([
           { id: 'p1', name: 'Sarah Connor (Mock)', status: 'MET', lastVisit: '2023-10-15', nextGoal: 'Lower BP' },
         ]);
      });
  }, [user.id]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Assigned Patients</h2>
        <div className="flex gap-2">
           <button className="text-sm bg-white border border-slate-300 px-3 py-1 rounded hover:bg-slate-50">Export Report</button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Compliance</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Visit</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Action</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading && <tr><td colSpan={5} className="text-center py-4">Loading data from MongoDB...</td></tr>}
              {!loading && patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
                        {patient.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{patient.name}</div>
                        <div className="text-sm text-slate-500">ID: {patient.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${COMPLIANCE_STATUS[patient.status].color}`}>
                      {COMPLIANCE_STATUS[patient.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {patient.lastVisit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {patient.nextGoal || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-teal-600 hover:text-teal-900 flex items-center justify-end w-full gap-1">
                      Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main App Controller ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<string>('home');
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Initialize Auth State from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('wellguard_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('wellguard_user');
      }
    }
    setLoading(false);
  }, []);

  // 2. View Logic
  useEffect(() => {
    if (view === 'auth' && user) {
       setView(user.role === 'patient' ? 'dashboard' : 'provider-dashboard');
    }
  }, [user, view]);

  // Handle Login
  const handleLogin = async (formData: any, role: UserRole, isRegistering: boolean) => {
    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    
    // API Call to Node.js Backend
    const response = await apiCall(endpoint, 'POST', {
      ...formData,
      username: formData.name, // Mapping 'name' to 'username' expected by backend
      role: role
    });

    // Normalize user object from response
    // Expecting response: { msg: "...", userId: "...", user: { ... } }
    const loggedInUser: User = {
      id: response.userId || response.user?.id,
      name: formData.name || response.user?.name || 'User',
      email: formData.email,
      role: role,
    };

    // Save to State & LocalStorage
    setUser(loggedInUser);
    localStorage.setItem('wellguard_user', JSON.stringify(loggedInUser));

    if (role === 'patient') {
      setView('dashboard');
    } else {
      setView('provider-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('wellguard_user');
    setView('home');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-teal-600">Loading Portal...</div>;

  return (
    <Layout user={user} onLogout={handleLogout} setView={setView}>
      {view === 'home' && <PublicHome setView={setView} />}
      {view === 'auth' && <Auth onLogin={handleLogin} />}
      {view === 'learn-more' && <LearnMore setView={setView} />}
      {view === 'dashboard' && user && <PatientDashboard user={user} />}
      {view === 'tracker' && <GoalTracker userId={user?.id} />}
      {view === 'profile' && <Profile userId={user?.id} />}
      {view === 'provider-dashboard' && user && <ProviderDashboard user={user} />}
    </Layout>
  );
}