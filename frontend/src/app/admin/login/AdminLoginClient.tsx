'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, Cake } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function AdminLoginClient() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success('Welcome back! 🎂');
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cake-light to-primary/5 dark:from-cake-dark dark:to-primary/10 p-4">
      <div className="w-full max-w-md">
        {/* Logo/brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full
                          bg-gradient-rose shadow-glow mb-4">
            <Cake size={32} className="text-white" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-[var(--text)]">Admin Login</h1>
          <p className="text-[var(--muted)] text-sm mt-1">DK&apos;s Cake World Dashboard</p>
        </div>

        {/* Form card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Email / Username
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input pl-10"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]
                             hover:text-primary transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
