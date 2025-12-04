import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '../types';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // 1. Check if user is already logged in on page load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Endpoint 4: Get Current User
          const { data } = await api.get('/auth/me');
          // Adjust 'data.data' vs 'data' depending on your backend response structure
          // Assuming backend returns { success: true, data: user } or just user
          setUser(data.data || data); 
        } catch (error) {
          console.error('Session expired', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // 2. Login Function
  const login = async (formData: any) => {
    try {
      // Endpoint 3: Login
      const { data } = await api.post('/auth/login', formData);
      
      localStorage.setItem('token', data.token);
      setUser(data.user || null); // Adjust based on backend response

      // Redirect based on role
      const role = data.user?.role;
      if (role === 'patient') navigate('/patient/dashboard');
      else if (role === 'provider' || role === 'doctor') navigate('/doctor/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      throw error; // Throw to component to show error message
    }
  };

  // 3. Register Function
  const register = async (formData: any) => {
    try {
      // Endpoint 1 & 2: Register (URL is same, body differs)
      const { data } = await api.post('/auth/register', formData);
      
      localStorage.setItem('token', data.token);
      setUser(data.user || null);

      const role = data.user?.role;
      if (role === 'patient') navigate('/patient/dashboard');
      else if (role === 'provider' || role === 'doctor') navigate('/doctor/dashboard');
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};