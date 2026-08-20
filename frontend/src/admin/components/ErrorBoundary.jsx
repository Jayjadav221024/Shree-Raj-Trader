import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * Catches render-time crashes anywhere inside the admin panel. Without it a single
 * thrown error unmounts the whole React tree and leaves a blank white page with no
 * hint of what went wrong.
 *
 * `resetKey` is normally the current pathname: when it changes the boundary clears
 * itself, so navigating away from a broken screen recovers instead of staying stuck.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, resetKey: props.resetKey };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.resetKey) {
      return { error: null, resetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error, info) {
    // Keep the stack reachable in the console for local debugging.
    console.error('[admin] render error:', error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="admin-root flex min-h-screen items-center justify-center bg-adm-bg p-6 text-adm-text">
        <div className="w-full max-w-lg rounded-2xl border border-adm-line bg-adm-surface p-8 text-center shadow-adm-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-adm-danger-soft text-adm-danger">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="mb-2 text-lg font-semibold tracking-tight">Something went wrong</h2>
          <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-adm-muted">
            This screen failed to render. Reloading usually clears it — if it keeps happening, share the
            message below with the developer.
          </p>
          <pre className="mb-7 max-h-32 overflow-auto rounded-lg bg-adm-bg px-4 py-3 text-left text-xs leading-relaxed text-adm-danger">
            {error?.message || String(error)}
          </pre>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="inline-flex items-center gap-2 rounded-lg border border-adm-line px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-adm-bg"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-lg bg-adm-primary px-5 py-2.5 text-sm font-semibold text-adm-primary-fg shadow-adm-sm transition-colors hover:bg-adm-primary-hover"
            >
              Reload page
            </button>
          </div>
        </div>
      </div>
    );
  }
}
