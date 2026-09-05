import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollBlurText / ScrollBlurReveal
 * Wraps any text, heading, or block to provide a sleek, performant scroll-triggered
 * blur-to-sharp focus reveal animation when scrolled into view.
 */
export function ScrollBlurReveal({
  children,
  as: Component = 'div',
  className = '',
  delay = 0,
  threshold = 0.15,
  once = false,
  ...props
}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  const delayClass = delay === 100 ? 'delay-100' : delay === 200 ? 'delay-200' : delay === 300 ? 'delay-300' : '';

  return (
    <Component
      ref={ref}
      className={`scroll-blur-reveal ${isInView ? 'is-in-view' : ''} ${delayClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Global Scroll Blur Animator Hook
 * Automatically attaches an intersection observer to headings, titles, eyebrows, and lead text
 * on public pages. Elements above the fold on initial load are immediately visible (no reload animation/flash).
 * Text reveals with blur-to-focus transition only when the user scrolls down to them.
 */
export function useGlobalTextScrollBlur() {
  useEffect(() => {
    let hasUserScrolled = false;

    const onFirstScroll = () => {
      hasUserScrolled = true;
      window.removeEventListener('scroll', onFirstScroll);
    };
    window.addEventListener('scroll', onFirstScroll, { passive: true });

    // Select section headers, titles, subtitles, eyebrows, and key text blocks
    const targetSelectors = [
      '.section-header',
      '.section-title',
      '.section-subtitle',
      '.eyebrow',
      'blockquote',
      '.stat-card'
    ];

    const elements = document.querySelectorAll(targetSelectors.join(', '));

    // Filter out admin elements and hero elements that are above the fold
    const validElements = Array.from(elements).filter(
      (el) => !el.closest('.admin-root') && !el.closest('dialog') && !el.closest('.hero-section')
    );

    const vh = window.innerHeight;

    validElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // If element is already in the viewport on initial page load, display it immediately without blur
      if (rect.top < vh && rect.bottom > 0) {
        el.classList.add('scroll-blur-reveal', 'is-in-view', 'no-initial-transition');
        // Enable smooth transitions for future scrolls after a brief delay
        setTimeout(() => {
          el.classList.remove('no-initial-transition');
        }, 100);
      } else {
        el.classList.add('scroll-blur-reveal');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
          } else {
            // Re-blur only after user has actively scrolled away
            const rect = entry.target.getBoundingClientRect();
            if (hasUserScrolled && (rect.top > window.innerHeight || rect.bottom < 0)) {
              entry.target.classList.remove('is-in-view');
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    validElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', onFirstScroll);
      observer.disconnect();
    };
  }, []);
}

export default ScrollBlurReveal;
