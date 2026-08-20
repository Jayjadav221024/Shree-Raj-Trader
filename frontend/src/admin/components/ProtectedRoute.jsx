import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import ErrorBoundary from './ErrorBoundary';

/** Full-screen placeholder shown while the session probe is still in flight. */
function SessionLoader() {
  return (
    <div className="admin-root flex min-h-screen flex-col items-center justify-center gap-4 bg-adm-bg text-adm-muted">
      <Loader2 className="h-8 w-8 animate-spin text-adm-primary" />
      <p className="text-sm font-medium tracking-wide">Loading admin panel…</p>
    </div>
  );
}

/**
 * Gate for every authenticated admin screen. Renders nothing but a loader until
 * `checkAuth` settles, so a protected view never mounts — and never fires its
 * queries — for a visitor who turns out to be signed out.
 */
export function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const location = useLocation();

  if (!isInitialized) return <SessionLoader />;

  if (!isAuthenticated) {
    // `from` lets the login screen send the user back where they were headed.
    return <Navigate to="/admin/login" replace state={{ from: location.pathname + location.search }} />;
  }

  // Keyed on the pathname so navigating to another screen clears a caught error.
  return <ErrorBoundary resetKey={location.pathname}>{children}</ErrorBoundary>;
}

/**
 * Inverse of ProtectedRoute: keeps an already signed-in admin off the login
 * screen instead of showing them a form they no longer need.
 */
export function PublicOnlyRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const location = useLocation();

  if (!isInitialized) return <SessionLoader />;

  if (isAuthenticated) {
    return <Navigate to={location.state?.from || '/admin/dashboard'} replace />;
  }

  return <ErrorBoundary resetKey={location.pathname}>{children}</ErrorBoundary>;
}

export default ProtectedRoute;
