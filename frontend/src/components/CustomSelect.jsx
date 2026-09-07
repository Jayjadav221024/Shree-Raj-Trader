import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options = [], // [{ value: '', label: '' }] or string[]
  placeholder = 'Select option...',
  className = '',
  buttonClassName = '',
  disabled = false,
  id,
  name
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return { value: opt.value, label: opt.label ?? opt.value };
    }
    return { value: opt, label: String(opt) };
  });

  const selectedOption = normalizedOptions.find((opt) => String(opt.value) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : (value || placeholder);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currIdx = normalizedOptions.findIndex((o) => String(o.value) === String(value));
        if (currIdx < normalizedOptions.length - 1) {
          onChange({ target: { value: normalizedOptions[currIdx + 1].value, name } });
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currIdx = normalizedOptions.findIndex((o) => String(o.value) === String(value));
        if (currIdx > 0) {
          onChange({ target: { value: normalizedOptions[currIdx - 1].value, name } });
        }
      }
    }
  };

  const handleSelect = (val) => {
    onChange({ target: { value: val, name } });
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`custom-select-container relative w-full ${className}`}
      id={id}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`custom-select-trigger w-full flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
          buttonClassName || 'form-control select-trigger-styled'
        } ${isOpen ? 'border-[var(--accent-orange)] ring-4 ring-[var(--accent-orange)]/10 shadow-sm' : ''} ${
          disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''
        }`}
      >
        <span className={`truncate ${!selectedOption && !value ? 'text-[var(--text-faint)]' : 'text-[var(--text-main)] font-medium'}`}>
          {displayLabel}
        </span>
        <ChevronDown
          className={`w-4 h-4 ml-2 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen ? 'rotate-180 text-[var(--accent-orange)]' : 'text-[var(--text-muted)]'
          }`}
        />
      </button>

      {/* Animated Dropdown Menu with Pop-in Transition */}
      <div
        className={`custom-select-dropdown absolute left-0 right-0 top-full mt-1.5 z-50 overflow-hidden bg-white border border-[var(--border-color)] rounded-xl shadow-[0_12px_32px_-4px_rgba(14,26,43,0.18)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'
        }`}
        role="listbox"
      >
        <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 custom-select-scrollbar">
          {normalizedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 text-left font-medium cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--accent-orange-tint)] text-[var(--accent-orange-deep)] font-semibold shadow-xs'
                    : 'text-[var(--text-main)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent-orange)]'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check className="w-4 h-4 ml-2 text-[var(--accent-orange)] shrink-0 animate-fadeIn" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
