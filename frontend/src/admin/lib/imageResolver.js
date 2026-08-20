import { images } from '../../data/siteData';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Resolves an image source from either:
 * 1. An uploaded URL path like `/uploads/123-photo.webp`
 * 2. An absolute external URL like `https://example.com/photo.webp`
 * 3. A static key mapped in `images.js` (e.g., `images.products[key]`, `images.blog[key]`, etc.)
 * 4. A fallback default image
 */
export function resolveImageUrl(imageKeyOrUrl, group = 'products', fallbackKey = 'logo-mini') {
  if (!imageKeyOrUrl) {
    const fallback = images.site?.[fallbackKey] || images.products?.['sinnova'];
    return {
      src: fallback?.src || '',
      width: fallback?.width || 600,
      height: fallback?.height || 600,
    };
  }

  // Check if string is already an uploaded file path or full URL
  if (typeof imageKeyOrUrl === 'string') {
    if (imageKeyOrUrl.startsWith('http://') || imageKeyOrUrl.startsWith('https://')) {
      return {
        src: imageKeyOrUrl,
        width: 800,
        height: 600,
      };
    }

    if (imageKeyOrUrl.startsWith('/uploads/')) {
      return {
        src: `${BACKEND_BASE_URL}${imageKeyOrUrl}`,
        width: 800,
        height: 600,
      };
    }
  }

  // Check static lookup in images dictionary
  const staticGroup = images[group] || images.products || {};
  const found = staticGroup[imageKeyOrUrl];
  if (found) {
    return found;
  }

  // Fallback to site logo or first product image
  const fallback = images.site?.[fallbackKey] || images.products?.['sinnova'];
  return {
    src: fallback?.src || '',
    width: fallback?.width || 600,
    height: fallback?.height || 600,
  };
}
