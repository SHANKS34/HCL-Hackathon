// AuthPage.tsx (Updated Layout)
import React, { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

const AuthPage: React.FC = () => {
  const { login, register } = useAuth();

  const [role, setRole] = useState<Role>("patient");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [specialization, setSpecialization] = useState("");
  const [license, setLicense] = useState("");
  const [experience, setExperience] = useState("");

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

  const extractErrorMessage = (err: any) =>
    err?.response?.data?.message || err.message || "Authentication failed.";

  const simpleEmailValid = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!simpleEmailValid(email)) return setError("Invalid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      if (isRegistering) {
        const apiRole = role === "doctor" ? "provider" : "patient";

        const payload =
          role === "doctor"
            ? {
                name,
                email,
                password,
                role: apiRole,
                specialization,
                licenseNumber: license,
                yearsOfExperience: Number(experience),
                bio: "New doctor",
              }
            : { name, email, password, role: apiRole };

        await register(payload);
        await login({ email, password });
      } else {
        await login({ email, password });
      }
    } catch (err: any) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex transform">
        
        {/* LEFT SIDE PANEL */}
        <div className="w-1/2 bg-gradient-to-br from-blue-500 to-purple-500 p-12 text-white flex flex-col justify-center">
          <h1 className="text-5xl font-extrabold mb-6">Hello World.</h1>

          <p className="text-sm mb-6 opacity-90">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur et est sed felis aliquet sollicitudin.
          </p>

          <p className="text-sm mb-3 opacity-70">Login with social media</p>

          <div className="flex items-center gap-4">
            <button className="bg-blue-800 py-2 px-4 rounded-full text-sm flex items-center gap-2 hover:bg-blue-900 transition">
              <span className="text-white">f</span> Login with Facebook
            </button>

            <button className="bg-blue-300 py-2 px-4 rounded-full text-sm flex items-center gap-2 hover:bg-blue-400 transition">
              Login with Twitter
            </button>
          </div>
        </div>

        {/* RIGHT – AUTH FORM */}
        <div className="w-1/2 p-12">
          <h2 className="text-3xl font-bold mb-2">{isRegistering ? "Register" : "Login"}</h2>

          <p className="text-gray-600 text-sm mb-4">
            {isRegistering ? (
              <>Already have an account?{" "}
                <button className="text-blue-600" onClick={() => setIsRegistering(false)}>
                  Login here
                </button>
              </>
            ) : (
              <>Don't have an account?{" "}
                <button className="text-blue-600" onClick={() => setIsRegistering(true)}>
                  Create your account
                </button>
              </>
            )}
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* ROLE SELECTOR */}
          {isRegistering && (
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleRoleChange("patient")}
                className={`flex-1 py-2 rounded-lg border ${
                  role === "patient" ? "bg-blue-100 border-blue-400" : "border-gray-300"
                }`}
              >
                Patient
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("doctor")}
                className={`flex-1 py-2 rounded-lg border ${
                  role === "doctor" ? "bg-blue-100 border-blue-400" : "border-gray-300"
                }`}
              >
                Doctor
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (only during register) */}
            {isRegistering && (
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Full Name"
              />
            )}

            {/* Doctor fields */}
            {isRegistering && role === "doctor" && (
              <>
                <input
                  type="text"
                  required
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg"
                  placeholder="Specialization"
                />

                <div className="flex gap-3">
                  <input
                    type="text"
                    required
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg"
                    placeholder="License Number"
                  />

                  <input
                    type="number"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg"
                    placeholder="Experience (Years)"
                  />
                </div>
              </>
            )}

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Email address"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg pr-12"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition disabled:opacity-60"
            >
              {loading ? "Please wait..." : isRegistering ? "Register" : "Login"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
