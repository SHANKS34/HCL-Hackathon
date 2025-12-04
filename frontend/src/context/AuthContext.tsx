// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: Record<string, any>) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Helper: set token in axios defaults + localStorage
  const persistToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
  };

  // Helper: save user
  const persistUser = (u: any | null) => {
    setUser(u);
    if (u) localStorage.setItem("user", JSON.stringify(u));
    else localStorage.removeItem("user");
  };

  // 1. On load: try to validate token & fetch current user
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      // ensure axios has header for this check
      persistToken(token);

      try {
        const resp = await api.get("/auth/me");
        // backend may return { success:true, data: user } or user directly
        const body = resp.data;
        const resolvedUser = body?.data ?? body;
        persistUser(resolvedUser || null);
      } catch (err) {
        console.warn("Auth check failed — clearing session", err);
        persistToken(null);
        persistUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // login
  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const resp = await api.post("/auth/login", { email, password });
      const data = resp.data;
      // Expecting { token, user } but be robust
      const token = data?.token ?? data?.data?.token;
      const userObj = data?.user ?? data?.data?.user ?? data?.data ?? data;

      if (!token) {
        // If no token returned, still allow userObj and rely on subsequent endpoints (or throw)
        console.warn("Login response did not contain token.");
      } else {
        persistToken(token);
      }

      persistUser(userObj || null);

      // route based on role
      const role = userObj?.role;
      if (role === "patient") navigate("/patient/dashboard");
      else if (role === "provider" || role === "doctor") navigate("/doctor/dashboard");
      else navigate("/"); // fallback
    } catch (err) {
      // rethrow so UI can display message
      throw err;
    }
  };

  // register
  const register = async (formData: Record<string, any>) => {
    try {
      const resp = await api.post("/auth/register", formData);
      const data = resp.data;

      // If backend returns token, persist it; otherwise UI may auto-login.
      const token = data?.token ?? data?.data?.token;
      const userObj = data?.user ?? data?.data?.user ?? data?.data ?? data;

      if (token) persistToken(token);
      persistUser(userObj || null);

      // If token was not returned, frontend caller (AuthPage) can call login() after register.
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    persistToken(null);
    persistUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
