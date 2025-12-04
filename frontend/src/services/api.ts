// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/", // keep as-is or move '/api' into caller if you prefer
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token from localStorage for every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Optional: response interceptor to auto-handle 401 (logout)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // best-effort: clear token and reload to force redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.assign('/') // uncomment if you want immediate redirect
    }
    return Promise.reject(err);
  }
);

export default api;
