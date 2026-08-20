import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-adm-danger-soft text-adm-danger">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <p className="pt-1 text-sm leading-relaxed text-adm-muted">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-adm-line-soft pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-adm-line px-4 py-2 text-sm font-semibold text-adm-text transition-colors hover:bg-adm-surface-3 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-adm-danger px-5 py-2 text-sm font-semibold text-white shadow-adm-sm transition-colors hover:brightness-110 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
