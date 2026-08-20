import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../admin/lib/axios';
import { SECTIONS } from '../data/sectionRegistry';

/**
 * Bridges the Website Editor to the live site.
 *
 * On boot the site fetches every saved section override and hands each one to
 * that section's `apply()` in the registry, which writes the values into the
 * shared copy/data objects the components already read. Sections with no saved
 * override are re-applied from their built-in defaults, so the result is the
 * same no matter what order edits happened in.
 *
 * Components are not subscribed to individual values — after the merge the
 * provider bumps a version number and the page remounts once, which is cheap
 * and keeps every component free of editor plumbing.
 */
const SiteContentContext = createContext({ version: 0, isLoaded: false });

export const applySiteContent = (overrides = {}) => {
  SECTIONS.forEach((section) => {
    const merged = { ...section.defaults, ...(overrides[section.id] || {}) };
    try {
      section.apply(merged);
    } catch (error) {
      // A bad saved value must never take the website down — fall back to what
      // is already rendered and leave a trace for whoever is debugging.
      console.error(`[SiteContent] Could not apply section "${section.id}"`, error);
    }
  });
};

export function SiteContentProvider({ children }) {
  const [version, setVersion] = useState(0);
  const appliedSignature = useRef(null);

  const { data, isFetched } = useQuery({
    queryKey: ['public-site-content'],
    queryFn: async () => {
      const res = await api.get('/public/site-content');
      return res.data.data || {};
    },
    staleTime: 60 * 1000,
    retry: 1
  });

  useEffect(() => {
    if (!data) return;
    // Re-applying identical content would remount the page for nothing (and
    // throw away scroll position) every time the window regains focus.
    const signature = JSON.stringify(data);
    if (appliedSignature.current === signature) return;
    appliedSignature.current = signature;
    applySiteContent(data);
    setVersion((v) => v + 1);
  }, [data]);

  const value = useMemo(() => ({ version, isLoaded: isFetched }), [version, isFetched]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export const useSiteContent = () => useContext(SiteContentContext);

/** Replaces {city} / {district} / {year} style placeholders in editable copy. */
export const fillTemplate = (text, values = {}) => {
  if (typeof text !== 'string') return text;
  return text.replace(/\{(\w+)\}/g, (match, key) =>
    values[key] === undefined || values[key] === null ? match : String(values[key])
  );
};
