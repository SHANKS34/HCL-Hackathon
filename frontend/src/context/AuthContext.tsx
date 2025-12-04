import React, { createContext, useContext, useState } from 'react';
import { User, Role } from '../types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (role: Role, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = (role: Role, email: string) => {
    // Mock Login Logic
    const mockUser: User = {
      id: '1',
      name: role === 'patient' ? 'John Doe' : 'Dr. Sarah Smith',
      email,
      role,
      assignedDoctor: role === 'patient' ? 'Dr. Sarah Smith' : undefined,
      specialization: role === 'doctor' ? 'Cardiologist' : undefined,
    };
    setUser(mockUser);
    
    // Redirect based on role
    if (role === 'patient') navigate('/patient/dashboard');
    else navigate('/doctor/dashboard');
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};