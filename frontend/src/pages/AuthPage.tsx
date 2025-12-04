// AuthPage.tsx
import React, { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

const AuthPage: React.FC = () => {
  const { login, register } = useAuth();

  // UI state
  const [role, setRole] = useState<Role>("patient");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Doctor-specific
  const [specialization, setSpecialization] = useState("");
  const [license, setLicense] = useState("");
  const [experience, setExperience] = useState("");

  // Helpers
  const clearDoctorFields = useCallback(() => {
    setSpecialization("");
    setLicense("");
    setExperience("");
  }, []);

  const handleRoleChange = (newRole: Role) => {
    setError("");
    setRole(newRole);
    if (newRole === "patient") clearDoctorFields();
  };

  const extractErrorMessage = (err: any) => {
    // axios-like error extraction; safe fallback
    if (!err) return "Authentication failed. Please try again.";
    return (
      err.response?.data?.message ||
      err.message ||
      String(err) ||
      "Authentication failed. Please try again."
    );
  };

  const simpleEmailValid = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!simpleEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        // Map UI role 'doctor' -> API role 'provider'
        const apiRole = role === "doctor" ? "provider" : "patient";

        const baseData: Record<string, any> = {
          name,
          email,
          password,
          role: apiRole,
        };

        const payload =
          role === "doctor"
            ? {
                ...baseData,
                specialization,
                licenseNumber: license,
                yearsOfExperience: Number(experience) || 0,
                bio: "New doctor",
              }
            : baseData;

        // call register
        await register(payload);

        // auto-login after successful register (common UX)
        await login({ email, password });
      } else {
        // login
        await login({ email, password });
      }
    } catch (err: any) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          WellnessConnect
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Healthcare management simplified.
        </p>

        {error && (
          <div
            role="alert"
            className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-200"
          >
            {error}
          </div>
        )}

        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-8" role="tablist">
          <button
            type="button"
            onClick={() => handleRoleChange("patient")}
            aria-pressed={role === "patient"}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              role === "patient" ? "bg-white shadow text-indigo-600" : "text-gray-500"
            }`}
            disabled={loading}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("doctor")}
            aria-pressed={role === "doctor"}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              role === "doctor" ? "bg-white shadow text-indigo-600" : "text-gray-500"
            }`}
            disabled={loading}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder={role === "patient" ? "John Doe" : "Dr. Sarah Smith"}
                aria-label="Full name"
                disabled={loading}
              />
            </div>
          )}

          {/* Doctor specific */}
          {isRegistering && role === "doctor" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  required
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Cardiologist"
                  aria-label="Specialization"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License #
                  </label>
                  <input
                    type="text"
                    required
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="LIC123"
                    aria-label="License number"
                    disabled={loading}
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years Exp.
                  </label>
                  <input
                    type="number"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="10"
                    aria-label="Years of experience"
                    min={0}
                    disabled={loading}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="name@example.com"
              aria-label="Email address"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none pr-12"
                placeholder="••••••••"
                aria-label="Password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-indigo-600 hover:text-indigo-800"
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegistering
              ? "Register & Login"
              : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegistering((s) => !s);
              setError("");
            }}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            disabled={loading}
          >
            {isRegistering ? "Already have an account? Login" : "New to WellnessConnect? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
