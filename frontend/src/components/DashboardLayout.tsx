import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, User, CheckSquare, Calendar, 
  FileText, LogOut, Activity 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const patientLinks = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/patient/profile', icon: User },
    { name: 'Set Wellness Goals', path: '/patient/goals', icon: CheckSquare },
    { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
    { name: 'Health Info', path: '/patient/info', icon: FileText },
  ];

  const doctorLinks = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/doctor/profile', icon: User },
    { name: 'Active Appointments', path: '/doctor/appointments', icon: Activity },
    { name: 'Health Info', path: '/doctor/info', icon: FileText },
  ];

  const links = user?.role === 'patient' ? patientLinks : doctorLinks;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-indigo-600">WellnessConnect</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === link.path
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <link.icon size={20} />
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome, {user?.name}
          </h2>
          <div className="flex items-center gap-4">
            {user?.role === 'patient' ? (
              <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium">
                Assigned: {user.assignedDoctor}
              </div>
            ) : (
              <div className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                On Duty
              </div>
            )}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;