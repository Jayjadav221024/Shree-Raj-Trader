import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Animates a numeric string up from zero the first time it scrolls into view.
 *
 * Accepts the display value as written in the data ("60+", "8,000+", "99%") and
 * preserves whatever prefix/suffix it carries, so the rendered text is always
 * identical to the source value once the animation settles.
 *
 * Honours prefers-reduced-motion by rendering the final value immediately.
 */

const PARTS = /^([^\d]*)([\d.,]+)(.*)$/s;

/** Splits "8,000+" into { prefix: '', value: 8000, suffix: '+', grouped, decimals }. */
function parseValue(raw) {
  const match = String(raw).match(PARTS);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const grouped = digits.includes(',');
  const plain = digits.replace(/,/g, '');
  const value = Number.parseFloat(plain);
  if (Number.isNaN(value)) return null;

  const dot = plain.indexOf('.');
  const decimals = dot === -1 ? 0 : plain.length - dot - 1;

  return { prefix, value, suffix, grouped, decimals };
}

const format = ({ grouped, decimals }, n) => {
  const fixed = n.toFixed(decimals);
  if (!grouped) return fixed;
  return Number(fixed).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// Decelerating curve — fast start, gentle settle.
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export default function CountUp({ value, duration = 1600, className = '' }) {
  // Memoised so the animation effect below has a stable dependency and does not
  // restart on every render.
  const parsed = useMemo(() => parseValue(value), [value]);
  const ref = useRef(null);
  const [display, setDisplay] = useState(() => (parsed ? `${parsed.prefix}${format(parsed, 0)}${parsed.suffix}` : value));

  useEffect(() => {
    if (!parsed) return;

    const node = ref.current;
    if (!node) return;

    const settle = () => setDisplay(value);

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      settle();
      return;
    }

    let frame = null;
    let start = null;

    const step = (now) => {
      if (start === null) start = now;
      const t = Math.min((now - start) / duration, 1);
      const current = parsed.value * easeOutCubic(t);

      setDisplay(`${parsed.prefix}${format(parsed, current)}${parsed.suffix}`);

      if (t < 1) frame = requestAnimationFrame(step);
      else settle();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [value, duration, parsed]);

  // The ghost copy reserves the final width so the card never reflows mid-count.
  return (
    <span ref={ref} className={`count-up ${className}`.trim()}>
      <span className="count-up-ghost" aria-hidden="true">{value}</span>
      <span className="count-up-value">{display}</span>
    </span>
  );
}
