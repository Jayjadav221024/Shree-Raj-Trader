import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import AdminLayout from '../components/AdminLayout';
import PageHeader from '../components/PageHeader';
import DynamicIcon from '../components/DynamicIcon';
import { Shield, Users, Mail, LayoutGrid, Terminal, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({ label, value, hint, icon: Icon, tone = 'primary' }) {
  const tones = {
    primary: 'bg-adm-primary-soft text-adm-primary',
    success: 'bg-adm-success-soft text-adm-success',
    accent: 'bg-adm-accent-soft text-adm-accent',
  };

  return (
    <div className="flex min-h-[9.5rem] flex-col justify-between rounded-2xl border border-adm-line bg-adm-surface p-5 shadow-adm-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-adm-faint">{label}</span>
        <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-semibold leading-none tracking-tight text-adm-text">{value}</div>
        <p className="mt-1.5 text-xs text-adm-muted">{hint}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, permittedMenus, menuGroups } = useAuthStore();

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Manage master data, roles and permissions, transactional email and audit logs from one place."
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Welcome banner */}
        <div className="relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-2xl bg-adm-nav p-6 text-white shadow-adm-md md:col-span-2">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-12 h-52 w-52 rounded-full bg-adm-primary/25 blur-2xl"
          />
          <Shield
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 opacity-[0.06]"
          />
          <div className="relative">
            <h2 className="mb-1.5 text-lg font-semibold tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Administrator'}
            </h2>
            <p className="text-sm text-adm-nav-text">
              Signed in as{' '}
              <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-xs font-semibold text-white">
                {user?.role || '—'}
              </span>
            </p>
          </div>
          <div className="relative mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-adm-nav-text/70">
            Shreeraj Traders · Admin console
          </div>
        </div>

        <StatCard
          label="Access scope"
          value={permittedMenus.length}
          hint="Screens you are authorised to open"
          icon={LayoutGrid}
        />

        <StatCard
          label="Modules"
          value={menuGroups.length}
          hint="Configured menu groups"
          icon={Mail}
          tone="success"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Shortcuts */}
        <div className="rounded-2xl border border-adm-line bg-adm-surface p-5 shadow-adm-sm lg:col-span-2 sm:p-6">
          <h3 className="mb-4 border-b border-adm-line-soft pb-3 text-sm font-semibold tracking-tight text-adm-text">
            Quick access
          </h3>

          {permittedMenus.length === 0 ? (
            <p className="py-8 text-center text-sm text-adm-muted">
              No modules are assigned to your role yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {permittedMenus.slice(0, 6).map((menu) => (
                <Link
                  key={menu._id}
                  to={menu.route}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-adm-line bg-adm-surface-2 p-3.5 transition-all hover:border-adm-primary/40 hover:bg-adm-primary-soft"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-adm-line bg-adm-surface text-adm-primary transition-colors group-hover:border-adm-primary/30">
                      <DynamicIcon name={menu.icon || 'Database'} className="h-[18px] w-[18px]" />
                    </div>
                    <span className="truncate text-sm font-semibold text-adm-text">{menu.label}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-adm-faint transition-all group-hover:translate-x-0.5 group-hover:text-adm-primary" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Security */}
        <div className="flex flex-col rounded-2xl border border-adm-line bg-adm-surface p-5 shadow-adm-sm sm:p-6">
          <h3 className="mb-4 border-b border-adm-line-soft pb-3 text-sm font-semibold tracking-tight text-adm-text">
            Security
          </h3>

          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-adm-primary-soft text-adm-primary">
                <Users className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-adm-text">Role-based access</h4>
                <p className="mt-0.5 text-xs leading-relaxed text-adm-muted">
                  Every screen is checked against your role permissions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-adm-surface-3 text-adm-muted">
                <Terminal className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-adm-text">Sign-in auditing</h4>
                <p className="mt-0.5 text-xs leading-relaxed text-adm-muted">
                  Successful and failed attempts are recorded server-side.
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/admin/master/login-logs"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-adm-line px-4 py-2.5 text-sm font-semibold text-adm-text transition-colors hover:bg-adm-surface-3"
          >
            Inspect sign-in logs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
