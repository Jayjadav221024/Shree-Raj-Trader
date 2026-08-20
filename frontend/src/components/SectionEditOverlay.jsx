import React, { useCallback, useEffect, useState } from 'react';
import { SECTION_BY_ID } from '../data/sectionRegistry';

/**
 * The click-to-edit layer.
 *
 * The Website Editor loads the real website in an iframe with `?srtEdit=1`.
 * This component only does anything in that mode: it outlines whichever
 * registered section the cursor is over and shows an "Edit" button on it.
 * Pressing that button posts the section id up to the admin panel, which opens
 * the matching form.
 *
 * Sections are found by the `data-section="<registry id>"` attribute the site
 * components carry — that attribute is the whole contract, so a block without
 * one simply cannot be clicked (and should be given one).
 */
export const EDIT_MODE_PARAM = 'srtEdit';
export const EDITOR_MESSAGE_SOURCE = 'srt-website-editor';

export const isSectionEditMode = () => {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get(EDIT_MODE_PARAM) === '1';
};

const postToEditor = (message) => {
  if (typeof window === 'undefined' || window.parent === window) return;
  window.parent.postMessage({ source: EDITOR_MESSAGE_SOURCE, ...message }, '*');
};

/**
 * Finds the block a section id refers to. A few sections are cross-cutting
 * (company contact details, say) and have no block of their own, so they fall
 * back to the registry `anchor` — the nearest place that block is visible.
 */
export const findSectionElement = (sectionId) => {
  const direct = document.querySelector(`[data-section="${sectionId}"]`);
  if (direct) return direct;

  const anchor = SECTION_BY_ID[sectionId]?.anchor;
  if (!anchor) return null;
  return document.querySelector(`[data-section="${anchor}"]`) || document.getElementById(anchor);
};

export default function SectionEditOverlay() {
  const [active, setActive] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const enabled = isSectionEditMode();

  const measure = useCallback((element) => {
    if (!element) return null;
    const id = element.getAttribute('data-section');
    const rect = element.getBoundingClientRect();
    return {
      id,
      label: SECTION_BY_ID[id]?.label || id,
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    };
  }, []);

  // Track the hovered section.
  useEffect(() => {
    if (!enabled) return undefined;

    const handlePointerMove = (event) => {
      const element = event.target?.closest?.('[data-section]');
      setActive(element ? measure(element) : null);
    };
    const handleLeave = () => setActive(null);

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handleLeave);
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handleLeave);
    };
  }, [enabled, measure]);

  // Keep the outline glued to the section while the page moves under it.
  useEffect(() => {
    if (!enabled || !active) return undefined;
    const reposition = () => {
      const element = findSectionElement(active.id);
      setActive(element ? measure(element) : null);
    };
    window.addEventListener('scroll', reposition, { passive: true });
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition);
      window.removeEventListener('resize', reposition);
    };
  }, [enabled, active, measure]);

  // Commands coming down from the admin panel.
  useEffect(() => {
    if (!enabled) return undefined;

    const handleMessage = (event) => {
      const payload = event.data;
      if (!payload || payload.source !== EDITOR_MESSAGE_SOURCE) return;

      if (payload.type === 'highlight-section') {
        const element = findSectionElement(payload.sectionId);
        setSelectedId(payload.sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setActive(measure(element));
        }
      }
    };

    window.addEventListener('message', handleMessage);
    // Tell the editor which sections this page actually renders, so it can flag
    // any registry entry that never showed up.
    const present = Array.from(document.querySelectorAll('[data-section]')).map((el) =>
      el.getAttribute('data-section')
    );
    postToEditor({ type: 'page-ready', path: window.location.pathname, sections: present });

    return () => window.removeEventListener('message', handleMessage);
  }, [enabled, measure]);

  // In edit mode, links must not navigate the preview away from the page the
  // editor is showing — the section list and the frame would fall out of step.
  useEffect(() => {
    if (!enabled) return undefined;
    const swallowNavigation = (event) => {
      const anchor = event.target?.closest?.('a[href]');
      if (!anchor) return;
      if (anchor.closest('[data-editor-ui]')) return;
      event.preventDefault();
    };
    document.addEventListener('click', swallowNavigation, true);
    return () => document.removeEventListener('click', swallowNavigation, true);
  }, [enabled]);

  if (!enabled) return null;

  const outline = active;

  return (
    <div
      data-editor-ui="true"
      className="pointer-events-none fixed inset-0 z-[2147483000]"
      aria-hidden="true"
    >
      <div className="pointer-events-none fixed left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-[#0f172a] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
        Edit mode · hover a section, then press Edit
      </div>

      {outline && (
        <div
          className="pointer-events-none fixed rounded-[10px] border-2 border-dashed transition-[top,left,width,height] duration-150"
          style={{
            top: outline.top,
            left: outline.left,
            width: outline.width,
            height: outline.height,
            borderColor: selectedId === outline.id ? '#14607a' : '#d9653b',
            background:
              selectedId === outline.id ? 'rgba(20,96,122,0.06)' : 'rgba(217,101,59,0.06)'
          }}
        >
          <button
            type="button"
            data-editor-ui="true"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setSelectedId(outline.id);
              postToEditor({ type: 'edit-section', sectionId: outline.id });
            }}
            className="pointer-events-auto absolute right-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-lg bg-[#d9653b] px-3 py-1.5 text-xs font-bold text-white shadow-lg transition-colors hover:bg-[#b8502c]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            <span className="truncate">Edit {outline.label}</span>
          </button>
        </div>
      )}
    </div>
  );
}
