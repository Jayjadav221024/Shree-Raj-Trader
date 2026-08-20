import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { sidebarCollapsed, permittedMenus, user } = useAuthStore();
  const location = useLocation();

  const isDashboard = location.pathname === '/admin/dashboard';

  const isAuthorized = React.useMemo(() => {
    if (isDashboard) return true;
    if (user?.role === 'Super Admin') return true;
    return permittedMenus.some((menu) => menu.route && location.pathname.startsWith(menu.route));
  }, [location.pathname, permittedMenus, user, isDashboard]);

  return (
    <div className="admin-root min-h-screen flex bg-adm-bg text-adm-text">
      <Sidebar />

      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-[padding] duration-300 ${
          sidebarCollapsed ? 'md:pl-[4.5rem]' : 'md:pl-64'
        }`}
      >
        <Topbar />

        <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {isAuthorized ? (
            children
          ) : (
            <div className="mx-auto max-w-lg rounded-2xl border border-adm-line bg-adm-surface p-8 py-16 text-center shadow-adm-sm animate-fadeIn">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-adm-danger-soft text-adm-danger">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <h2 className="mb-2 text-lg font-semibold tracking-tight text-adm-text">Access denied</h2>
              <p className="mx-auto mb-7 max-w-sm text-sm leading-relaxed text-adm-muted">
                Your role does not include permission for this screen. Contact a system administrator if you
                believe this is a mistake.
              </p>
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-adm-primary px-5 py-2.5 text-sm font-semibold text-adm-primary-fg shadow-adm-sm transition-colors hover:bg-adm-primary-hover"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
