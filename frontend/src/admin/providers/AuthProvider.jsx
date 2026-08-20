import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { setUnauthorizedHandler } from '../lib/axios';

const TOAST_STYLES = {
  success: { className: 'bg-adm-success-soft text-adm-success border-adm-success/30', Icon: CheckCircle2 },
  error: { className: 'bg-adm-danger-soft text-adm-danger border-adm-danger/30', Icon: XCircle },
  warning: { className: 'bg-adm-warning-soft text-adm-warning border-adm-warning/30', Icon: AlertTriangle },
  info: { className: 'bg-adm-primary-soft text-adm-primary border-adm-primary/30', Icon: Info },
};

export default function AuthProvider({ children }) {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setTheme = useAuthStore((s) => s.setTheme);
  const theme = useAuthStore((s) => s.theme);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  const { toasts, removeToast } = useToastStore();
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  // Restore the saved theme once. The class itself is applied per-route below so
  // the light-only public site is never painted with the admin dark palette.
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    } else {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isAdminRoute && theme === 'dark');
  }, [isAdminRoute, theme]);

  // A 401 on a real API call means the session expired mid-session. Drop the
  // local session so the route guard renders the login screen on the next pass.
  useEffect(() => {
    setUnauthorizedHandler(() => clearSession());
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  // Only the admin panel needs a session. Probing `/auth/me` for every visitor to
  // the public site produced a 401 on every page load and a bounce to the login screen.
  useEffect(() => {
    if (isAdminRoute && !isInitialized) {
      checkAuth();
    }
  }, [isAdminRoute, isInitialized, checkAuth]);

  return (
    <>
      {children}

      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const { className, Icon } = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

          return (
            <div
              key={toast.id}
              className={`admin-root pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-adm-lg backdrop-blur-md animate-fadeIn ${className}`}
              role="alert"
            >
              <Icon className="h-5 w-5 shrink-0 mt-px" />
              <div className="flex-1 text-sm font-medium leading-snug pt-0.5">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 -m-0.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
