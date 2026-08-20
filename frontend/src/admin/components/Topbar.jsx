import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, LogOut, ChevronDown } from 'lucide-react';

export default function Topbar() {
  const { toggleMobileNav, user, theme, toggleTheme, logout, permittedMenus } = useAuthStore();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const currentLabel =
    pathname === '/admin/dashboard'
      ? 'Dashboard'
      : permittedMenus.find((m) => m.route && pathname.startsWith(m.route))?.label || 'Admin';

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-adm-line bg-adm-surface/85 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={toggleMobileNav}
          aria-label="Open navigation"
          className="-ml-1 rounded-lg p-2 text-adm-muted transition-colors hover:bg-adm-surface-3 hover:text-adm-text md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="truncate text-sm font-semibold tracking-tight text-adm-text">{currentLabel}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="rounded-lg p-2 text-adm-muted transition-colors hover:bg-adm-surface-3 hover:text-adm-text"
        >
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-adm-surface-3"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-adm-primary-soft text-xs font-semibold uppercase text-adm-primary">
              {(user?.name || 'A').slice(0, 2)}
            </span>
            <span className="hidden flex-col text-left leading-tight sm:flex">
              <span className="text-xs font-semibold text-adm-text">{user?.name || 'Administrator'}</span>
              <span className="text-[11px] font-medium text-adm-faint">{user?.role || '—'}</span>
            </span>
            <ChevronDown
              className={`h-4 w-4 text-adm-faint transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+0.5rem)] w-56 overflow-hidden rounded-xl border border-adm-line bg-adm-surface shadow-adm-lg animate-fadeIn"
            >
              <div className="border-b border-adm-line-soft px-4 py-3">
                <p className="truncate text-sm font-semibold text-adm-text">
                  {user?.name || 'Administrator'}
                </p>
                <p className="truncate text-xs text-adm-muted">{user?.email || '—'}</p>
              </div>
              <button
                onClick={logout}
                role="menuitem"
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-adm-danger transition-colors hover:bg-adm-danger-soft"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
