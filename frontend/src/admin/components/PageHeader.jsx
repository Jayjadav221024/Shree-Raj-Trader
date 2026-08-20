import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function PageHeader({ title, subtitle, breadcrumbs = [], action = null }) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-adm-line pb-6 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <nav className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-adm-faint">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-1 rounded transition-colors hover:text-adm-primary"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
              {crumb.href ? (
                <Link to={crumb.href} className="transition-colors hover:text-adm-primary">
                  {crumb.label}
                </Link>
              ) : (
                <span className="truncate font-semibold text-adm-muted">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
        <h1 className="text-xl font-semibold tracking-tight text-adm-text sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-adm-muted">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
