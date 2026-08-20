import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { login } = useAuthStore();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      addToast('Welcome back — signed in successfully.', 'success');
      // PublicOnlyRoute redirects to the requested screen once the session lands.
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid administrator credentials', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-root relative flex min-h-screen items-center justify-center overflow-hidden bg-adm-bg p-4">
      {/* Ambient brand wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-adm-primary/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-[26rem] w-[26rem] rounded-full bg-adm-accent/12 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-7 text-center">
          <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-adm-primary text-lg font-bold tracking-tight text-adm-primary-fg shadow-adm-md">
            ST
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-adm-text">Shreeraj Traders</h1>
          <p className="mt-1.5 text-sm text-adm-muted">Sign in to the admin console</p>
        </div>

        <div className="rounded-2xl border border-adm-line bg-adm-surface p-6 shadow-adm-md sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="block text-xs font-semibold text-adm-muted">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-adm-faint" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="admin@shreeraj.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-adm-line bg-adm-surface-2 py-2.5 pl-9 pr-3 text-sm text-adm-text placeholder:text-adm-faint transition-colors focus:border-adm-primary focus:bg-adm-surface focus:outline-none focus:ring-2 focus:ring-adm-primary/25"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="block text-xs font-semibold text-adm-muted">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-adm-faint" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-adm-line bg-adm-surface-2 py-2.5 pl-9 pr-10 text-sm text-adm-text placeholder:text-adm-faint transition-colors focus:border-adm-primary focus:bg-adm-surface focus:outline-none focus:ring-2 focus:ring-adm-primary/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-adm-faint transition-colors hover:bg-adm-surface-3 hover:text-adm-text"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-adm-primary px-5 py-2.5 text-sm font-semibold text-adm-primary-fg shadow-adm-sm transition-colors hover:bg-adm-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-adm-primary/40 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-adm-faint">
          <ShieldCheck className="h-3.5 w-3.5" />
          Authorised personnel only. Sign-in attempts are logged.
        </p>
      </div>
    </div>
  );
}
