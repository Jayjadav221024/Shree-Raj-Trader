import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useLocation } from 'react-router-dom';
import DynamicIcon from './DynamicIcon';
import { PanelLeftClose, PanelLeftOpen, LogOut, Moon, Sun, X, LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
  const {
    menuGroups,
    permittedMenus,
    sidebarCollapsed,
    toggleSidebar,
    mobileNavOpen,
    setMobileNavOpen,
    theme,
    toggleTheme,
    logout,
    user,
  } = useAuthStore();
  const location = useLocation();

  // Navigating on mobile should dismiss the drawer rather than leave it covering the page.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname, setMobileNavOpen]);

  const getGroupItems = (groupId) =>
    permittedMenus.filter(
      (item) =>
        item.menuGroupId === groupId ||
        (typeof item.menuGroupId === 'object' && item.menuGroupId?._id === groupId),
    );

  const isRailed = sidebarCollapsed;

  const navLink = (route, label, icon, key) => {
    const isActive = location.pathname === route || location.pathname.startsWith(`${route}/`);
    return (
      <Link
        key={key}
        to={route}
        title={isRailed ? label : undefined}
        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-adm-primary text-adm-primary-fg'
            : 'text-adm-nav-text hover:bg-adm-nav-hover hover:text-white'
        } ${isRailed ? 'md:justify-center md:px-0' : ''}`}
      >
        {typeof icon === 'string' ? (
          <DynamicIcon name={icon || 'CircleDot'} className="h-[18px] w-[18px] shrink-0" />
        ) : (
          icon
        )}
        <span className={`truncate ${isRailed ? 'md:hidden' : ''}`}>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile scrim */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-adm-nav-line bg-adm-nav transition-[width,transform] duration-300 ${
          isRailed ? 'w-64 md:w-[4.5rem]' : 'w-64'
        } ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand */}
        <div
          className={`flex h-16 shrink-0 items-center gap-2.5 border-b border-adm-nav-line bg-adm-nav-2 px-4 ${
            isRailed ? 'md:justify-center md:px-0' : 'justify-between'
          }`}
        >
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-adm-primary text-sm font-bold tracking-tight text-adm-primary-fg">
              ST
            </span>
            <span className={`flex flex-col leading-tight ${isRailed ? 'md:hidden' : ''}`}>
              <span className="truncate text-sm font-semibold text-white">Shreeraj Traders</span>
              <span className="truncate text-[11px] font-medium text-adm-nav-text">Admin console</span>
            </span>
          </Link>

          <button
            onClick={toggleSidebar}
            aria-label={isRailed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden rounded-lg p-1.5 text-adm-nav-text transition-colors hover:bg-adm-nav-hover hover:text-white md:block ${
              isRailed ? 'md:hidden' : ''
            }`}
          >
            <PanelLeftClose className="h-[18px] w-[18px]" />
          </button>

          <button
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-adm-nav-text transition-colors hover:bg-adm-nav-hover hover:text-white md:hidden"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Expand affordance when railed */}
        {isRailed && (
          <button
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            className="mx-auto mt-3 hidden rounded-lg p-2 text-adm-nav-text transition-colors hover:bg-adm-nav-hover hover:text-white md:block"
          >
            <PanelLeftOpen className="h-[18px] w-[18px]" />
          </button>
        )}

        {/* Navigation */}
        <nav className="admin-scroll flex-1 space-y-6 overflow-y-auto px-3 py-5">
          <div className="space-y-1">
            {navLink(
              '/admin/dashboard',
              'Dashboard',
              <LayoutDashboard className="h-[18px] w-[18px] shrink-0" />,
              'dashboard',
            )}
          </div>

          {menuGroups.map((group) => {
            const items = getGroupItems(group._id);
            if (items.length === 0) return null;

            return (
              <div key={group._id} className="space-y-1">
                <h4
                  className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-adm-nav-text/60 ${
                    isRailed ? 'md:hidden' : ''
                  }`}
                >
                  {group.name}
                </h4>
                {isRailed && <div className="mx-auto hidden h-px w-8 bg-adm-nav-line md:block" />}
                {items.map((item) => navLink(item.route, item.label, item.icon, item._id))}
              </div>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="shrink-0 space-y-1 border-t border-adm-nav-line bg-adm-nav-2/60 p-3">
          <div
            className={`mb-2 flex items-center gap-2.5 rounded-lg px-2 py-2 ${isRailed ? 'md:justify-center md:px-0' : ''}`}
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-adm-primary-soft text-xs font-semibold uppercase text-adm-primary">
              {(user?.name || 'A').slice(0, 2)}
            </span>
            <span className={`flex min-w-0 flex-col leading-tight ${isRailed ? 'md:hidden' : ''}`}>
              <span className="truncate text-xs font-semibold text-white">
                {user?.name || 'Administrator'}
              </span>
              <span className="truncate text-[11px] text-adm-nav-text">{user?.role || '—'}</span>
            </span>
          </div>

          <button
            onClick={toggleTheme}
            title={isRailed ? 'Toggle theme' : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-adm-nav-text transition-colors hover:bg-adm-nav-hover hover:text-white ${
              isRailed ? 'md:justify-center md:px-0' : ''
            }`}
          >
            {theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px] shrink-0 text-amber-400" />
            ) : (
              <Moon className="h-[18px] w-[18px] shrink-0" />
            )}
            <span className={isRailed ? 'md:hidden' : ''}>
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </span>
          </button>

          <button
            onClick={logout}
            title={isRailed ? 'Sign out' : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-adm-nav-text transition-colors hover:bg-adm-danger/15 hover:text-adm-danger ${
              isRailed ? 'md:justify-center md:px-0' : ''
            }`}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span className={isRailed ? 'md:hidden' : ''}>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
