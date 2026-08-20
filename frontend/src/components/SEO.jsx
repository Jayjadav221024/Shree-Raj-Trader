import { useEffect } from 'react';
import { copy } from '../data/sectionCopy';
import { resolveImageUrl } from '../admin/lib/imageResolver';

/**
 * Writes the page's search-engine and link-sharing tags.
 *
 * Every value is editable from the admin panel under Website Editor → SEO; this
 * component only decides where each one is written to. Tags are created when the
 * document does not already carry them, so nothing depends on index.html having
 * the right placeholders.
 */
const setMeta = (attribute, key, content) => {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

/** Share previews are fetched by other servers, so the URL has to be absolute. */
const absoluteUrl = (src) => {
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src;
  return `${window.location.origin}${src.startsWith('/') ? '' : '/'}${src}`;
};

export default function SEO({ title, description, image, imageAlt }) {
  useEffect(() => {
    const global = copy['seo.global'];

    const fullTitle = title ? `${title} | ${global.siteName}` : global.fallbackTitle;
    const finalDescription = description || global.fallbackDescription;

    document.title = fullTitle;
    setMeta('name', 'description', finalDescription);

    // A product or article passes its own picture; everything else shares the
    // site-wide default set in the SEO section.
    const resolved =
      image && typeof image === 'object' ? image : resolveImageUrl(image || global.shareImage, 'site', 'logo-mini');
    const shareImage = absoluteUrl(resolved?.src);

    setMeta('property', 'og:site_name', global.siteName);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', window.location.href);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', finalDescription);
    setMeta('property', 'og:image', shareImage);
    setMeta('property', 'og:image:alt', imageAlt || global.shareImageAlt);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', finalDescription);
    setMeta('name', 'twitter:image', shareImage);
    setMeta('name', 'twitter:image:alt', imageAlt || global.shareImageAlt);
  }, [title, description, image, imageAlt]);

  return null;
}
