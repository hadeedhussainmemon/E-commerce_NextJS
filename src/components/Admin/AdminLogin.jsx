import React, { useState } from 'react';
import { Lock, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';

import { useRouter } from 'next/navigation';
import config from '../../config';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const API_BASE_URL = config.api.baseUrl;
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        // Set cookie for middleware (7 days)
        document.cookie = `adminToken=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

        // Small delay to show success state
        setTimeout(() => {
          onLogin(data.token);
          router.push('/admin/dashboard');
          router.refresh(); // Refresh to clear any stale middleware redirects
        }, 800);
      } else {
        setError(data.message || 'Identity verification failed');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Neural tunnel connection failure');
      console.error('Login error:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#020617] overflow-hidden relative selection:bg-emerald-500/30 font-inter">
      {/* Dynamic Animated Background - Optimized Neural Flow */}
      <div className="absolute inset-0 w-full h-full opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[140px] animate-blob pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[140px] animate-blob animation-delay-4000 pointer-events-none"></div>
      </div>

      {/* Matrix Mesh Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-[460px] relative z-20">
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-700 hover:border-emerald-500/30">

          {/* Header Section - Gatekeeper Alpha */}
          <div className="relative p-10 pb-4 text-center">
            <div className="relative mx-auto w-24 h-24 mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative w-full h-full bg-black/40 border border-white/5 rounded-3xl flex items-center justify-center shadow-inner overflow-hidden group-hover:border-emerald-500/40 transition-all duration-500">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                <Lock className="w-10 h-10 text-emerald-500 group-hover:scale-125 transition-transform duration-500" />
              </div>
              <div className="absolute -bottom-1 -right-1">
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)] border-4 border-[#020617]"></div>
              </div>
            </div>

            <h2 className="text-4xl font-playfair font-black text-white italic tracking-tighter mb-2">Gatekeeper Alpha</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Neural Identity Verification</p>
          </div>

          {/* Form Section */}
          <div className="p-10 pt-6">
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* Error Message */}
              {error && (
                <div className="p-5 bg-rose-500/5 border border-rose-500/10 text-rose-400 rounded-2xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest animate-pulse backdrop-blur-md">
                  <AlertCircle size={18} />
                  <span>Protocol Alert: {error}</span>
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Digital Signature</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-500 transition-colors duration-300 group-focus-within:text-emerald-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-14 pr-6 py-5 bg-black/20 border border-white/5 rounded-[1.5rem] text-white placeholder-slate-800 focus:outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-500 font-black uppercase tracking-widest text-xs"
                    placeholder="USERNAME..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Cryptographic Key</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-500 transition-colors duration-300 group-focus-within:text-emerald-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    className="block w-full pl-14 pr-6 py-5 bg-black/20 border border-white/5 rounded-[1.5rem] text-white placeholder-slate-800 focus:outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 transition-all duration-500 font-bold tracking-[0.5em] text-xs"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group relative overflow-hidden bg-emerald-600 text-white font-black py-5 px-6 rounded-[1.5rem] transition-all duration-500 hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="relative flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em]">
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        <span>Scanning Neural Profile...</span>
                      </>
                    ) : (
                      <>
                        <span>Initialize Uplink</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-10 py-6 bg-black/40 border-t border-white/5 text-center">
            <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.4em]">
              Vanguard OS Matrix // Secure Tunnel Alpha
            </p>
          </div>
        </div>
      </div>

      {/* CSS for custom animations if not in tailwind config */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(50px, -70px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

import { AlertCircle } from 'lucide-react';

export default AdminLogin;