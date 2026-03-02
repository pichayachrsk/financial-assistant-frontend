'use client';

import { useAuth } from '@/hooks/useAuth';
import { loginAction } from '@/lib/actions';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
	AlertCircle,
	ArrowRight,
	BarChart3,
	ShieldCheck,
	TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: loginAction,
    onSuccess: (res) => {
      console.log('[Login] Mutation onSuccess:', res);
      if (res.success && res.user) {
        login(res.user);
        router.push('/');
      } else {
        setError(res.error || 'Login failed');
      }
    },
    onError: (err: unknown) => {
      console.error('[Login] Mutation onError:', err);
      let message = 'Authentication failed. Please check your credentials.';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.detail || message;
      }
      setError(message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Login] Form submitted - invoking loginAction');
    setError('');
    loginMutation.mutate({ email, password });
  };

  const isLoading = loginMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-indigo-500/30 selection:text-white antialiased">
      {/* Informative Left Side */}
      <section className="hidden lg:flex w-1/2 bg-slate-950 p-16 flex-col justify-between border-r border-slate-900 border-dashed relative overflow-hidden">
        <div className="flex items-center gap-3 text-2xl font-black tracking-tight group cursor-default relative z-10">
           <div className="p-3 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-500 ease-out">
            <TrendingUp size={32} strokeWidth={2.5} className="text-white" />
           </div>
           <span className="bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
             FINANCE <span className="text-indigo-400 font-extrabold font-mono">ASSISTANT</span>
           </span>
        </div>

        <div className="space-y-12 max-w-lg mb-20 animate-in fade-in slide-in-from-left-8 duration-700 delay-150 relative z-10">
           <h1 className="text-6xl font-black leading-tight tracking-tighter">
             Intelligent <span className="text-indigo-500">Wealth</span> Management
           </h1>
           
           <div className="grid gap-8">
              <div className="flex gap-6 group">
                 <div className="h-14 w-14 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <BarChart3 size={28} />
                 </div>
                 <div className="flex-1 pt-1">
                    <h3 className="text-xl font-bold mb-2">Real-Time Data</h3>
                    <p className="text-slate-400 leading-relaxed text-lg">Connect directly to global market feeds for sub-second quote updates and analysis.</p>
                 </div>
              </div>

              <div className="flex gap-6 group">
                 <div className="h-14 w-14 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <ShieldCheck size={28} />
                 </div>
                 <div className="flex-1 pt-1">
                    <h3 className="text-xl font-bold mb-2">Institutional Security</h3>
                    <p className="text-slate-400 leading-relaxed text-lg">All conversations and financial queries are encrypted and processed with absolute privacy.</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4 text-slate-500 font-medium relative z-10">
           <p>© 2026 FinBot Intelligence. Built for accuracy.</p>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -z-0" />
      </section>

      {/* Login Section */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950/50 backdrop-blur-xl">
        <div className="w-full max-w-md space-y-10 animate-in zoom-in-95 fade-in duration-500">
          <header className="text-center space-y-3">
             <h2 className="text-4xl font-extrabold tracking-tight">Welcome Back</h2>
             <p className="text-slate-400 font-medium text-lg">Log in to your secure financial dashboard</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20} />
                <p className="text-sm font-bold tracking-tight">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-widest text-slate-500 pl-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-600"
                  placeholder="Enter your email..."
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                   <label className="text-sm font-semibold uppercase tracking-widest text-slate-500">Password</label>
                   <button type="button" className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors">Forgot Password?</button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-600"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 group"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Connect to Dashboard
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <footer className="text-center">
            <p className="text-slate-500 font-medium">
              New to FinBot AI?{' '}
              <button 
                onClick={() => router.push('/register')}
                className="text-white font-bold hover:text-indigo-400 underline underline-offset-4 decoration-slate-800 transition-colors"
                type="button"
              >
                Create access key
              </button>
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}
