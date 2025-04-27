"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });

      if (response.data.token !== null) {
        const { _id, email, token, formLink } = response.data;

        // Save in localStorage without encryption
        localStorage.setItem(
          "admin",
          JSON.stringify({ id: _id, email, token, formLink })
        );

        router.push("/");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute inset-0">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-purple-700/20 rounded-full filter blur-3xl"></div>
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-600/20 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className={`relative w-full max-w-md transform transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-gray-950/80 backdrop-blur-xl p-10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-gray-800">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-6">
              <img src="/cf-logo.jpg" alt="Admin Dashboard" className="h-12 w-auto" />
            </div>
            <h2 className="text-white text-3xl font-bold tracking-tight mb-2">
              Admin Portal
            </h2>
            <p className="text-gray-400 text-sm">Enter your credentials to access the dashboard</p>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">Email</label>
              <div className={`relative transform transition-all duration-300 delay-100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 bg-gray-900/80 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">Password</label>
              <div className={`relative transform transition-all duration-300 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3.5 bg-gray-900/80 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 relative overflow-hidden group transform delay-300 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                disabled={loading}
              >
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                <span className="relative flex items-center justify-center">
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : null}
                  {loading ? "Authenticating..." : "Sign In"}
                </span>
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
