import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, Eye, EyeOff, Sun, AlertCircle, ArrowRight } from "lucide-react";
import { setStoredUser, isUserLoggedIn } from "../lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid credentials. Please check and try again.");
      }

      if (data.token) {
        localStorage.setItem("admin_token", data.token);
      }
      if (data.admin) {
        localStorage.setItem("admin_user", JSON.stringify(data.admin));
      }

      setStoredUser({
        id: data.admin?.id || data.admin?._id || "1",
        email: data.admin?.email || email,
        name: data.admin?.name || "Administrator",
        role: data.admin?.role || "admin",
        token: data.token,
      });

      navigate("/");
    } catch (err) {
      setError((err as Error).message || "Login failed. Please verify server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/20 text-slate-100 items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-xl shadow-amber-500/10">
            <Sun className="w-9 h-9 animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Matri Shakti Solar
          </h1>
          <p className="text-xs tracking-widest text-amber-400 uppercase font-semibold mt-1">
            Dedicated Admin & CRM Control Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Administrator Access</h2>
            <p className="text-xs text-slate-400 mt-1">
              Sign in with authorized administrator credentials to manage solar projects, leads, and dealers.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-800/60 text-red-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@matrishakti.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to CRM Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-800/40 px-3 py-1.5 rounded-full border border-slate-700/50">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Isolated Admin Portal • Encrypted Session</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
