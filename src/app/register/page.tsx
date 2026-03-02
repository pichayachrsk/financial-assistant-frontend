'use client';

import { registerAction } from '@/lib/actions';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
	AlertCircle,
	ArrowRight,
	Lock,
	Mail,
	User as UserIcon,
	UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: registerAction,
    onSuccess: (res) => {
      if (res.success) {
        router.push('/login');
      } else {
        setError(res.error || 'Registration failed');
      }
    },
    onError: (err: unknown) => {
      let message = 'Failed to create account. Please try again.';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.detail || message;
      }
      setError(message);
    }
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    registerMutation.mutate({
      email: formData.email,
      password: formData.password,
      username: formData.username
    });
  };

  const isLoading = registerMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-20">
      <div className="max-w-md w-full space-y-8 bg-slate-900/50 p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-3xl animate-in zoom-in-95 duration-500">
        <header className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 mb-4 border border-indigo-500/20 shadow-xl">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Create Access Key</h2>
          <p className="mt-2 text-slate-400 font-medium">Join the next generation of financial analysis</p>
        </header>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-200 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="text-red-400" />
              <p className="text-sm font-bold tracking-tight">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="group space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="Ex: market_pro"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Terminal</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Secure Passphrase</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deploying Account...
              </span>
            ) : (
              <span className="flex items-center gap-2 uppercase tracking-widest">
                Initialize Account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <footer className="text-center">
           <p className="text-slate-500 font-medium">
             Already registered?{' '}
             <Link 
              href="/login"
              className="text-white font-bold hover:text-indigo-400 underline underline-offset-4 decoration-slate-800 transition-colors"
             >
               Sign in to vault
             </Link>
           </p>
        </footer>
      </div>
    </div>
  );
}
