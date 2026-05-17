import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'vini@200325') {
      onLogin(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 border border-natural-border shadow-xl space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-natural-sage/10 text-natural-sage rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-natural-title">Secure Access</h2>
          <p className="text-natural-muted text-sm">Please login to view your medical journal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-natural-label uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-label" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-natural-bg border border-natural-border rounded-xl focus:ring-2 focus:ring-natural-sage outline-none transition-all"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-natural-label uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-label" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-natural-bg border border-natural-border rounded-xl focus:ring-2 focus:ring-natural-sage outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center gap-3 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Invalid credentials. Please try again.</p>
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-natural-sage hover:bg-natural-sage-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg mt-6"
          >
            Login <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
