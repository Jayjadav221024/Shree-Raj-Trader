import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, description, children, size = 'md' }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      }
    } else if (dialog.open) {
      dialog.close();
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
    };

    const handleClickOutside = (e) => {
      if (e.target === dialog) onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleClickOutside);

    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl',
  }[size];

  return (
    <dialog
      ref={dialogRef}
      className={`admin-root m-auto w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-adm-line bg-adm-surface p-0 text-adm-text shadow-adm-lg focus:outline-none ${sizeClasses}`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-adm-line bg-adm-surface-2 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold tracking-tight text-adm-text">{title}</h3>
          {description && <p className="mt-1 text-xs leading-relaxed text-adm-muted">{description}</p>}
        </div>
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="-mr-1 shrink-0 rounded-lg p-1.5 text-adm-faint transition-colors hover:bg-adm-surface-3 hover:text-adm-text"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>
      <div className="admin-scroll max-h-[72vh] overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
    </dialog>
  );
}
