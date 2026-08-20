import React from 'react';

export default function ActiveToggle({ value, onChange, label = 'Active status' }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-adm-primary focus-visible:ring-offset-2 focus-visible:ring-offset-adm-surface ${
          value ? 'bg-adm-primary' : 'bg-adm-line-strong'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      {label && <span className="text-sm font-medium text-adm-text">{label}</span>}
    </div>
  );
}
