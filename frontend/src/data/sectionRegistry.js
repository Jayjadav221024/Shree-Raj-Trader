// =============================================================================
// WEBSITE SECTION REGISTRY — the master list of everything editable on the site
// =============================================================================
// This file is the contract between the public website and the Website Editor
// screen in the admin panel (/admin/website/editor). Every block a visitor can
// see is listed here exactly once, with:
//
//   defaults : the copy/images shipped with the build (what the site shows when
//              nothing has been edited)
//   fields   : how the editor should render the form for that block
//   apply()  : how a saved value is pushed back into the live site
//
// >>> IF YOU ADD A NEW SECTION TO THE WEBSITE, ADD IT HERE TOO. <<<
// A section missing from this list is invisible to the editor, which is exactly
// the situation this registry exists to prevent. `npm run dev` prints nothing if
// you forget — the only safety net is this comment and the section count shown
// at the top of the editor screen.
//
// Two kinds of content flow through here:
//   1. copy   — headings, labels and paragraphs, held in ./sectionCopy.js
//   2. data   — structured lists already used by components (brands, domains,
//               timeline, team, …), held in ./siteData.js and friends
// Both are merged IN PLACE so components need no rewiring beyond reading the
// copy object.
//
// Catalogue content (products, categories, testimonials, FAQs, blog posts) is
// NOT duplicated here: it already has its own database-backed master screens.
// Those sections appear in the editor as pointers to the right screen so an
// editor never has to wonder where a block is managed.
// =============================================================================

import { images } from './images';
import {
  companyInfo,
  siteMeta,
  statsCounter,
  heroAssurances,
  authorizedBrands,
  domains,
  groupCompanies,
  companyTimeline,
  clientLogos,
  epcDivision,
  galleryPhotos,
  navMenus
} from './siteData';
import { leadershipMessages, teamMembers, careers } from './team';
import { CITIES } from './cities';
import { copy } from './sectionCopy';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// -----------------------------------------------------------------------------
// Small helpers
// -----------------------------------------------------------------------------

export const clone = (value) =>
  typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

/** Reverse lookup so image defaults are stored as editable keys, not bundled URLs. */
const keyOf = (group, mediaObject) => {
  if (!mediaObject) return '';
  const bucket = images[group] || {};
  return Object.keys(bucket).find((k) => bucket[k] === mediaObject) || '';
};

/**
 * Turns whatever the editor saved back into the `{ src, width, height }` shape
 * components expect: a bundled asset key, an uploaded `/uploads/...` path or a
 * full external URL all work.
 */
const toMedia = (value, group, fallback = null) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;
  if (/^https?:\/\//i.test(value)) return { src: value, width: 800, height: 600 };
  if (value.startsWith('/uploads/')) {
    return { src: `${BACKEND_BASE_URL}${value}`, width: 800, height: 600 };
  }
  return images[group]?.[value] || fallback;
};

/** Replaces an array's contents without breaking the references components hold. */
const replaceItems = (target, items) => {
  if (!Array.isArray(target) || !Array.isArray(items)) return;
  target.splice(0, target.length, ...items);
};

/** Merges plain copy values into the shared (stable-identity) copy object. */
const applyCopy = (id, values) => {
  Object.assign(copy[id], values);
};

const list = (values, key) => (Array.isArray(values?.[key]) ? values[key] : []);

// -----------------------------------------------------------------------------
// Pages, in the order they appear in the editor sidebar
// -----------------------------------------------------------------------------

export const SECTION_PAGES = [
  {
    id: 'seo',
    label: 'SEO',
    route: '/',
    description:
      'Browser tab titles, Google result text and the preview card shown when a page is shared. One entry per page.'
  },
  {
    id: 'global',
    label: 'Site-wide',
    route: '/',
    description: 'Header, footer and contact details — these appear on every page.'
  },
  { id: 'home', label: 'Home page', route: '/', description: 'The landing page.' },
  { id: 'about', label: 'About Us', route: '/about-us/', description: 'Company story, leadership and team.' },
  { id: 'products', label: 'Products', route: '/products/', description: 'Catalogue listing page.' },
  { id: 'contact', label: 'Contact', route: '/contact/', description: 'Contact details, enquiry form and FAQs.' },
  { id: 'blog', label: 'Blog', route: '/blog/', description: 'Article index.' },
  { id: 'gallery', label: 'Gallery', route: '/gallery/', description: 'The flip-book facility tour.' },
  {
    id: 'career',
    label: 'Careers',
    route: '/career/',
    description:
      'Unlisted page — deliberately absent from the menu and footer. Reachable only at /career/, so share the link directly with candidates.'
  },
  { id: 'locations', label: 'Locations', route: '/locations/', description: 'City index page.' },
  {
    id: 'city',
    label: 'City landing pages',
    route: `/locations/${CITIES[0]?.slug || 'vadodara'}/`,
    description: 'One template shared by every city page. Edit once, all cities update.'
  }
];

// -----------------------------------------------------------------------------
// Reusable field-set fragments
// -----------------------------------------------------------------------------

const headingFields = [
  { key: 'eyebrow', label: 'Small label above the heading', type: 'text' },
  { key: 'title', label: 'Heading (first part)', type: 'text' },
  { key: 'titleAccent', label: 'Heading (highlighted part)', type: 'text', help: 'Shown in orange.' },
  { key: 'intro', label: 'Intro paragraph', type: 'textarea' }
];

/**
 * Alt text describes a picture for people using a screen reader, for anyone whose
 * images fail to load, and for search engines. Every editable image gets one.
 */
const altField = (key, label) => ({
  key,
  label,
  type: 'text',
  help: 'Describe what the picture shows. Leave blank to fall back to the name above.'
});

// -----------------------------------------------------------------------------
// THE SECTIONS
// -----------------------------------------------------------------------------

/**
 * Builds one SEO section per page. They all share the same two fields, so the
 * shape is generated rather than repeated eleven times — and a page can never be
 * given an SEO entry that behaves differently from the others.
 */
const seoSection = ({ id, label, description, route, titleHelp, descriptionHelp, extraFields = [] }) => ({
  id,
  page: 'seo',
  label,
  description,
  icon: 'Search',
  route,
  anchor: 'global.navbar',
  fields: [
    {
      key: 'title',
      label: 'Browser tab / Google title',
      type: 'text',
      help: titleHelp || 'Around 60 characters. The site name is added after it automatically.'
    },
    ...extraFields,
    {
      key: 'description',
      label: 'Google description',
      type: 'textarea',
      help: descriptionHelp || 'Around 150 characters. This is the grey text under the title in search results.'
    }
  ],
  defaults: clone(copy[id]),
  apply(values) {
    applyCopy(id, values);
  }
});

export const SECTIONS = [
  // ===========================================================================
  // SEO — one entry per page
  // ===========================================================================
  {
    id: 'seo.global',
    page: 'seo',
    label: 'Site-wide SEO defaults',
    description:
      'The site name added after every page title, the text used when a page has none of its own, and the picture shown when a link is shared.',
    icon: 'Globe',
    route: '/',
    anchor: 'global.navbar',
    fields: [
      {
        key: 'siteName',
        label: 'Site name',
        type: 'text',
        help: 'Added after every page title, e.g. "Contact Us | Shree Raj Traders".'
      },
      { key: 'fallbackTitle', label: 'Fallback title', type: 'text', help: 'Used on any page with no title of its own.' },
      { key: 'fallbackDescription', label: 'Fallback description', type: 'textarea' },
      {
        key: 'shareImage',
        label: 'Share preview image',
        type: 'image',
        imageGroup: 'site',
        help: 'Shown when someone shares a link on WhatsApp, LinkedIn or Facebook. Product and article pages use their own picture instead.'
      },
      altField('shareImageAlt', 'Share image alt text')
    ],
    defaults: clone(copy['seo.global']),
    apply(values) {
      applyCopy('seo.global', values);
    }
  },

  seoSection({
    id: 'seo.home',
    label: 'Home page',
    description: 'How the landing page appears in Google and browser tabs.',
    route: '/'
  }),
  seoSection({
    id: 'seo.about',
    label: 'About Us page',
    description: 'How the About page appears in Google and browser tabs.',
    route: '/about-us/'
  }),
  seoSection({
    id: 'seo.products',
    label: 'Products catalogue',
    description: 'The catalogue listing, including the per-category variants.',
    route: '/products/',
    extraFields: [
      {
        key: 'categoryTitle',
        label: 'Title when a category is selected',
        type: 'text',
        help: 'Write {category} where the category name should appear.'
      }
    ]
  }),
  seoSection({
    id: 'seo.product-detail',
    label: 'Single product pages',
    description: 'One template used by every product page.',
    route: '/products/',
    titleHelp: 'Write {product} where the product name should appear.',
    descriptionHelp: 'Write {product} where the product name should appear.'
  }),
  seoSection({
    id: 'seo.contact',
    label: 'Contact page',
    description: 'How the Contact page appears in Google and browser tabs.',
    route: '/contact/'
  }),
  seoSection({
    id: 'seo.blog',
    label: 'Blog index',
    description: 'How the article listing appears in Google and browser tabs.',
    route: '/blog/'
  }),
  seoSection({
    id: 'seo.blog-post',
    label: 'Single article pages',
    description: 'One template used by every blog article.',
    route: '/blog/',
    titleHelp: 'Write {article} where the article title should appear.',
    descriptionHelp: 'Available placeholders: {article} and {excerpt}.'
  }),
  seoSection({
    id: 'seo.career',
    label: 'Careers page',
    description: 'How the unlisted careers page appears if someone shares the link.',
    route: '/career/'
  }),
  seoSection({
    id: 'seo.gallery',
    label: 'Gallery page',
    description: 'How the facility gallery appears in Google and browser tabs.',
    route: '/gallery/'
  }),
  seoSection({
    id: 'seo.locations',
    label: 'Locations page',
    description: 'How the city index appears in Google and browser tabs.',
    route: '/locations/'
  }),
  seoSection({
    id: 'seo.city',
    label: 'City landing pages',
    description: 'One template used by every city page.',
    route: `/locations/${CITIES[0]?.slug || 'vadodara'}/`,
    titleHelp: 'Available placeholders: {city} and {district}.',
    descriptionHelp: 'Available placeholders: {city} and {district}.'
  }),

  // ===========================================================================
  // SITE-WIDE
  // ===========================================================================
  {
    id: 'global.navbar',
    page: 'global',
    label: 'Top navigation bar',
    description: 'Logo wordmark, menu labels and the "Get Quote" button.',
    icon: 'Menu',
    route: '/',
    anchor: 'global.navbar',
    fields: [
      { key: 'wordmarkPrimary', label: 'Logo text', type: 'text' },
      { key: 'wordmarkAccent', label: 'Logo text (orange part)', type: 'text' },
      { key: 'wordmarkSub', label: 'Line under the logo', type: 'text' },
      { key: 'navHome', label: 'Menu: Home', type: 'text', group: 'Menu labels' },
      { key: 'navAbout', label: 'Menu: About', type: 'text', group: 'Menu labels' },
      { key: 'navGallery', label: 'Menu: Gallery', type: 'text', group: 'Menu labels' },
      { key: 'navProducts', label: 'Menu: Products', type: 'text', group: 'Menu labels' },
      { key: 'navLocations', label: 'Menu: Locations', type: 'text', group: 'Menu labels' },
      { key: 'navBlog', label: 'Menu: Blog', type: 'text', group: 'Menu labels' },
      { key: 'navContact', label: 'Menu: Contact', type: 'text', group: 'Menu labels' },
      { key: 'ctaQuote', label: 'Quote button', type: 'text', group: 'Menu labels' },
      {
        key: 'aboutLinks',
        label: 'About Us dropdown',
        type: 'list',
        itemLabel: 'link',
        itemFields: [
          { key: 'label', label: 'Link text', type: 'text' },
          { key: 'href', label: 'Goes to', type: 'text' }
        ]
      },
      {
        key: 'productGroups',
        label: 'Products dropdown groups',
        type: 'list',
        itemLabel: 'group',
        help: 'The "Goes to" key must match a product category.',
        itemFields: [
          { key: 'label', label: 'Group name', type: 'text' },
          { key: 'key', label: 'Category key', type: 'text' }
        ]
      }
    ],
    defaults: {
      ...clone(copy['global.navbar']),
      aboutLinks: clone(navMenus.about)
    },
    apply(values) {
      applyCopy('global.navbar', values);
      replaceItems(navMenus.about, list(values, 'aboutLinks'));
    }
  },

  {
    id: 'global.company',
    page: 'global',
    label: 'Company contact details',
    description:
      'Phone numbers, email addresses and the office address. Used by the header, footer, contact page and every city page at once.',
    icon: 'Building2',
    route: '/contact/',
    anchor: 'contact.head-office',
    fields: [
      { key: 'name', label: 'Company name', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      { key: 'phonePrimary', label: 'Phone 1 (displayed)', type: 'text', group: 'Phone' },
      {
        key: 'telPrimary',
        label: 'Phone 1 (dial link)',
        type: 'text',
        group: 'Phone',
        help: 'Digits only, e.g. +919726788690 — no spaces.'
      },
      { key: 'phoneSecondary', label: 'Phone 2 (displayed)', type: 'text', group: 'Phone' },
      { key: 'telSecondary', label: 'Phone 2 (dial link)', type: 'text', group: 'Phone' },
      { key: 'emailPrimary', label: 'Sales email', type: 'text', group: 'Email' },
      { key: 'emailAccounts', label: 'Accounts email', type: 'text', group: 'Email' },
      { key: 'emailAlternate', label: 'Alternate email', type: 'text', group: 'Email' },
      { key: 'emailCareers', label: 'Careers email', type: 'text', group: 'Email' },
      { key: 'address', label: 'Full office address', type: 'textarea', group: 'Address' },
      { key: 'googleMaps', label: 'Google Maps link', type: 'text', group: 'Address' },
      { key: 'whatsapp', label: 'WhatsApp link', type: 'text', group: 'Address' }
    ],
    defaults: {
      name: companyInfo.name,
      tagline: companyInfo.tagline,
      phonePrimary: companyInfo.phonePrimary,
      telPrimary: companyInfo.telPrimary,
      phoneSecondary: companyInfo.phoneSecondary,
      telSecondary: companyInfo.telSecondary,
      emailPrimary: companyInfo.emailPrimary,
      emailAccounts: companyInfo.emailAccounts,
      emailAlternate: companyInfo.emailAlternate,
      emailCareers: companyInfo.emailCareers,
      address: companyInfo.address,
      googleMaps: companyInfo.googleMaps,
      whatsapp: companyInfo.whatsapp
    },
    apply(values) {
      Object.assign(companyInfo, values);
      // `phone` and `email` are legacy aliases some blocks still read.
      companyInfo.phone = `${values.phonePrimary} | ${values.phoneSecondary}`;
      companyInfo.email = values.emailPrimary;
    }
  },

  {
    id: 'global.map-section',
    page: 'global',
    label: 'Google Maps & Location Section',
    description: 'The interactive Google Maps and facility details block displayed before the footer.',
    icon: 'MapPin',
    route: '/',
    anchor: 'global.map-section',
    fields: [
      { key: 'eyebrow', label: 'Small label', type: 'text' },
      { key: 'title', label: 'Heading (first part)', type: 'text' },
      { key: 'titleAccent', label: 'Heading (orange part)', type: 'text' },
      { key: 'subtitle', label: 'Intro description', type: 'textarea' },
      { key: 'timingsLabel', label: 'Timings label', type: 'text', group: 'Timings' },
      { key: 'timingsValue', label: 'Timings text', type: 'text', group: 'Timings' },
      { key: 'supportNote', label: 'Support note', type: 'textarea', group: 'Timings' }
    ],
    defaults: clone(copy['global.map-section']),
    apply(values) {
      applyCopy('global.map-section', values);
    }
  },

  {
    id: 'global.footer',
    page: 'global',
    label: 'Footer',
    description: 'The dark band at the bottom of every page.',
    icon: 'PanelBottom',
    route: '/',
    anchor: 'global.footer',
    fields: [
      { key: 'wordmarkPrimary', label: 'Logo text', type: 'text' },
      { key: 'wordmarkAccent', label: 'Logo text (orange part)', type: 'text' },
      altField('logoAlt', 'Logo alt text'),
      { key: 'blurb', label: 'Company blurb', type: 'textarea' },
      {
        key: 'badges',
        label: 'Trust badges',
        type: 'list',
        itemLabel: 'badge',
        itemFields: [{ key: 'label', label: 'Badge text', type: 'text' }]
      },
      { key: 'quickLinksHeading', label: 'Column 2 heading', type: 'text', group: 'Quick links' },
      {
        key: 'quickLinks',
        label: 'Quick links',
        type: 'list',
        group: 'Quick links',
        itemLabel: 'link',
        itemFields: [
          { key: 'label', label: 'Link text', type: 'text' },
          { key: 'href', label: 'Goes to', type: 'text' }
        ]
      },
      { key: 'productsHeading', label: 'Column 3 heading', type: 'text', group: 'Product links' },
      {
        key: 'productLinks',
        label: 'Product links',
        type: 'list',
        group: 'Product links',
        itemLabel: 'link',
        itemFields: [
          { key: 'label', label: 'Link text', type: 'text' },
          { key: 'href', label: 'Goes to', type: 'text' }
        ]
      },
      { key: 'contactHeading', label: 'Column 4 heading', type: 'text', group: 'Contact column' },
      { key: 'addressShort', label: 'Short address', type: 'textarea', group: 'Contact column' },
      { key: 'groupHeading', label: 'Group companies heading', type: 'text', group: 'Contact column' },
      {
        key: 'copyright',
        label: 'Copyright line',
        type: 'text',
        group: 'Bottom bar',
        help: 'Write {year} where the current year should appear.'
      },
      { key: 'backToTop', label: '"Back to top" button', type: 'text', group: 'Bottom bar' }
    ],
    defaults: clone(copy['global.footer']),
    apply(values) {
      applyCopy('global.footer', values);
    }
  },

  // ===========================================================================
  // HOME
  // ===========================================================================
  {
    id: 'home.hero',
    page: 'home',
    label: 'Hero banner',
    description: 'The headline, intro paragraph, product tiles and the four statistic counters.',
    icon: 'Sparkles',
    route: '/',
    anchor: 'hero',
    fields: [
      { key: 'eyebrow', label: 'Small label above the headline', type: 'text' },
      { key: 'headingLine1', label: 'Headline line 1', type: 'text' },
      {
        key: 'headingLine3',
        label: 'Headline line 3',
        type: 'text',
        help: 'Line 2 rotates through the product tile names below.'
      },
      { key: 'intro', label: 'Intro paragraph', type: 'textarea' },
      { key: 'ctaPrimary', label: 'Main button', type: 'text' },
      { key: 'backgroundText', label: 'Watermark text', type: 'text' },
      {
        key: 'assurances',
        label: 'Assurance pills',
        type: 'list',
        itemLabel: 'pill',
        itemFields: [{ key: 'label', label: 'Text', type: 'text' }]
      },
      {
        key: 'productPills',
        label: 'Product tiles (image carousel)',
        type: 'list',
        itemLabel: 'tile',
        itemFields: [
          { key: 'label', label: 'Product name', type: 'text' },
          { key: 'spec', label: 'Spec line', type: 'text' },
          { key: 'imageKey', label: 'Image', type: 'image', imageGroup: 'products' },
          altField('imageAlt', 'Image alt text')
        ]
      },
      {
        key: 'stats',
        label: 'Statistic counters',
        type: 'list',
        itemLabel: 'statistic',
        itemFields: [
          { key: 'value', label: 'Number', type: 'text', help: 'e.g. 60+, 8,000+, 99%' },
          { key: 'label', label: 'Caption', type: 'text' }
        ]
      }
    ],
    defaults: {
      ...clone(copy['home.hero']),
      intro: companyInfo.about,
      assurances: heroAssurances.map((label) => ({ label })),
      stats: statsCounter.map((s) => ({ value: s.value, label: s.label }))
    },
    apply(values) {
      applyCopy('home.hero', values);
      companyInfo.about = values.intro;
      replaceItems(
        heroAssurances,
        list(values, 'assurances').map((a) => a.label)
      );
      replaceItems(
        statsCounter,
        list(values, 'stats').map((s) => ({ ...s, status: 'edited' }))
      );
    }
  },

  {
    id: 'home.featured-categories',
    page: 'home',
    label: 'Featured category tiles',
    description: 'The four product-family tiles below the hero.',
    icon: 'LayoutGrid',
    route: '/',
    anchor: 'featured-categories',
    managedBy: { label: 'Categories', to: '/admin/master/category' },
    fields: [],
    defaults: {},
    apply() {}
  },

  {
    id: 'home.brands',
    page: 'home',
    label: 'Brand partners',
    description: 'The stacked cards for Siemens, CGL, Hindustan and Innomotics.',
    icon: 'BadgeCheck',
    route: '/',
    anchor: 'brands',
    fields: [
      ...headingFields,
      { key: 'viewLabel', label: '"View products" link text', type: 'text' },
      { key: 'highlightsAuthorizedLabel', label: 'Highlights heading (authorized brands)', type: 'text' },
      { key: 'highlightsGenericLabel', label: 'Highlights heading (other brands)', type: 'text' },
      {
        key: 'items',
        label: 'Brands',
        type: 'list',
        itemLabel: 'brand',
        itemFields: [
          { key: 'name', label: 'Brand name', type: 'text' },
          { key: 'category', label: 'Product category line', type: 'text' },
          { key: 'tagline', label: 'Description', type: 'textarea' },
          { key: 'logo', label: 'Logo', type: 'image', imageGroup: 'brands' },
          altField('logoAlt', 'Logo alt text'),
          { key: 'authorizedPartner', label: 'Authorized partner', type: 'boolean' },
          {
            key: 'highlights',
            label: 'Highlights',
            type: 'list',
            itemLabel: 'highlight',
            itemFields: [{ key: 'label', label: 'Text', type: 'text' }]
          }
        ]
      }
    ],
    defaults: {
      ...clone(copy['home.brands']),
      items: authorizedBrands.map((b) => ({
        name: b.name,
        category: b.category,
        tagline: b.tagline,
        logo: keyOf('brands', b.logo),
        logoAlt: b.logoAlt || `${b.name} logo`,
        authorizedPartner: b.authorizedPartner,
        highlights: b.highlights.map((label) => ({ label }))
      }))
    },
    apply(values) {
      applyCopy('home.brands', values);
      replaceItems(
        authorizedBrands,
        list(values, 'items').map((b, i) => ({
          id: authorizedBrands[i]?.id || `brand-${i}`,
          name: b.name,
          category: b.category,
          tagline: b.tagline,
          logo: toMedia(b.logo, 'brands', images.site['logo-mini']),
          logoAlt: b.logoAlt || `${b.name} logo`,
          color: 'orange',
          authorizedPartner: Boolean(b.authorizedPartner),
          highlights: (b.highlights || []).map((h) => h.label)
        }))
      );
    }
  },

  {
    id: 'home.domains',
    page: 'home',
    label: 'Operational domains',
    description: 'The six numbered capability cards.',
    icon: 'Cpu',
    route: '/',
    anchor: 'domains',
    fields: [
      ...headingFields,
      {
        key: 'items',
        label: 'Domain cards',
        type: 'list',
        itemLabel: 'card',
        itemFields: [
          { key: 'title', label: 'Card title', type: 'text' },
          { key: 'description', label: 'Card text', type: 'textarea' },
          {
            key: 'icon',
            label: 'Icon',
            type: 'text',
            help: 'One of: Cpu, Building2, Users, Leaf, Zap, Truck'
          }
        ]
      }
    ],
    defaults: {
      ...clone(copy['home.domains']),
      items: clone(domains)
    },
    apply(values) {
      applyCopy('home.domains', values);
      replaceItems(domains, list(values, 'items'));
    }
  },

  {
    id: 'home.group-companies',
    page: 'home',
    label: 'Group of companies',
    description: 'The four sister-company cards. Also feeds the "Group Offices" block on Contact.',
    icon: 'Network',
    route: '/',
    anchor: 'home.group-companies',
    fields: [
      { key: 'eyebrow', label: 'Small label above the heading', type: 'text' },
      { key: 'title', label: 'Heading (first part)', type: 'text' },
      { key: 'titleAccent', label: 'Heading (highlighted part)', type: 'text' },
      {
        key: 'items',
        label: 'Companies',
        type: 'list',
        itemLabel: 'company',
        itemFields: [
          { key: 'name', label: 'Company name', type: 'text' },
          { key: 'role', label: 'What they do', type: 'text' },
          { key: 'location', label: 'Address', type: 'textarea' },
          { key: 'href', label: 'Website link', type: 'text', help: 'Leave blank for no link.' },
          { key: 'logo', label: 'Logo', type: 'image', imageGroup: 'group' },
          altField('logoAlt', 'Logo alt text')
        ]
      }
    ],
    defaults: {
      ...clone(copy['home.group-companies']),
      items: groupCompanies.map((c) => ({
        name: c.name,
        role: c.role,
        location: c.location,
        href: c.href || '',
        logo: keyOf('group', c.logo),
        logoAlt: c.logoAlt || `${c.name} logo`
      }))
    },
    apply(values) {
      applyCopy('home.group-companies', values);
      replaceItems(
        groupCompanies,
        list(values, 'items').map((c) => ({
          name: c.name,
          role: c.role,
          location: c.location,
          href: c.href || null,
          logo: toMedia(c.logo, 'group', null),
          logoAlt: c.logoAlt || `${c.name} logo`
        }))
      );
    }
  },

  {
    id: 'home.testimonials',
    page: 'home',
    label: 'Client testimonials',
    description: 'Heading for the quote cards.',
    icon: 'Quote',
    route: '/',
    anchor: 'testimonials',
    managedBy: { label: 'Testimonials', to: '/admin/master/testimonial' },
    managedByNote: 'The quotes themselves are database records — the heading below is edited here.',
    fields: headingFields,
    defaults: clone(copy['home.testimonials']),
    apply(values) {
      applyCopy('home.testimonials', values);
    }
  },

  {
    id: 'home.clients',
    page: 'home',
    label: 'Client logo marquee',
    description: 'The scrolling strip of customer logos.',
    icon: 'Building',
    route: '/',
    anchor: 'home.clients',
    fields: [
      { key: 'eyebrow', label: 'Small label above the heading', type: 'text' },
      { key: 'title', label: 'Heading (first part)', type: 'text' },
      { key: 'titleAccent', label: 'Heading (highlighted part)', type: 'text' },
      {
        key: 'items',
        label: 'Client logos',
        type: 'list',
        itemLabel: 'client',
        itemFields: [
          { key: 'name', label: 'Client name', type: 'text' },
          { key: 'image', label: 'Logo', type: 'image', imageGroup: 'clients' },
          altField('imageAlt', 'Logo alt text')
        ]
      }
    ],
    defaults: {
      ...clone(copy['home.clients']),
      items: clientLogos.map((c) => ({
        name: c.name,
        image: keyOf('clients', c.image),
        imageAlt: c.imageAlt || `${c.name} logo`
      }))
    },
    apply(values) {
      applyCopy('home.clients', values);
      replaceItems(
        clientLogos,
        list(values, 'items').map((c) => ({
          name: c.name,
          image: toMedia(c.image, 'clients', images.site['logo-mini']),
          imageAlt: c.imageAlt || `${c.name} logo`
        }))
      );
    }
  },

  {
    id: 'home.journey',
    page: 'home',
    label: 'Our journey timeline',
    description: 'The milestone timeline. The same milestones appear on the About page.',
    icon: 'Milestone',
    route: '/',
    anchor: 'journey',
    fields: [
      ...headingFields,
      {
        key: 'items',
        label: 'Milestones',
        type: 'list',
        itemLabel: 'milestone',
        itemFields: [
          { key: 'year', label: 'Year', type: 'text' },
          { key: 'event', label: 'What happened', type: 'textarea' }
        ]
      }
    ],
    defaults: {
      ...clone(copy['home.journey']),
      items: clone(companyTimeline)
    },
    apply(values) {
      applyCopy('home.journey', values);
      replaceItems(companyTimeline, list(values, 'items'));
    }
  },

  // ===========================================================================
  // ABOUT US
  // ===========================================================================
  {
    id: 'about.intro',
    page: 'about',
    label: 'About introduction',
    description: 'Page heading and the facility photograph.',
    icon: 'Info',
    route: '/about-us/',
    anchor: 'about',
    fields: [
      { key: 'eyebrow', label: 'Small label above the heading', type: 'text' },
      { key: 'title', label: 'Heading (first part)', type: 'text' },
      { key: 'titleAccent', label: 'Heading (highlighted part)', type: 'text' },
      {
        key: 'photo',
        label: 'Facility photo',
        type: 'image',
        imageGroup: 'site'
      },
      altField('photoAlt', 'Photo alt text')
    ],
    defaults: {
      ...clone(copy['about.intro']),
      photo: keyOf('site', siteMeta.aboutPhoto)
    },
    intro:
      'The paragraph under the heading is the same one used on the home page hero — edit it there.',
    apply(values) {
      applyCopy('about.intro', values);
      siteMeta.aboutPhoto = toMedia(values.photo, 'site', siteMeta.aboutPhoto);
    }
  },

  {
    id: 'about.leadership',
    page: 'about',
    label: 'Leadership messages',
    description: 'The "Words from…" quote cards.',
    icon: 'MessageSquareQuote',
    route: '/about-us/',
    anchor: 'leadership',
    fields: [
      {
        key: 'items',
        label: 'Messages',
        type: 'list',
        itemLabel: 'message',
        itemFields: [
          { key: 'heading', label: 'Card label', type: 'text' },
          { key: 'body', label: 'Message', type: 'textarea' },
          { key: 'name', label: 'Person', type: 'text' },
          { key: 'role', label: 'Job title', type: 'text' },
          { key: 'photo', label: 'Photo', type: 'image', imageGroup: 'team' },
          altField('photoAlt', 'Photo alt text')
        ]
      }
    ],
    defaults: {
      items: leadershipMessages.map((m) => ({
        heading: m.heading,
        body: m.body,
        name: m.name,
        role: m.role,
        photo: keyOf('team', m.photo),
        photoAlt: m.photoAlt || m.name
      }))
    },
    apply(values) {
      replaceItems(
        leadershipMessages,
        list(values, 'items').map((m, i) => ({
          id: leadershipMessages[i]?.id || `message-${i}`,
          heading: m.heading,
          body: m.body,
          name: m.name,
          role: m.role,
          photo: toMedia(m.photo, 'team', null),
          photoAlt: m.photoAlt || m.name
        }))
      );
    }
  },

  {
    id: 'about.vision-mission',
    page: 'about',
    label: 'Vision & mission',
    description: 'The two cards stating the company vision and mission.',
    icon: 'Target',
    route: '/about-us/',
    anchor: 'about.vision-mission',
    fields: [
      { key: 'visionTitle', label: 'Vision card title', type: 'text' },
      { key: 'vision', label: 'Vision', type: 'textarea' },
      { key: 'missionTitle', label: 'Mission card title', type: 'text' },
      { key: 'mission', label: 'Mission', type: 'textarea' }
    ],
    defaults: {
      ...clone(copy['about.vision-mission']),
      vision: companyInfo.vision,
      mission: companyInfo.mission
    },
    apply(values) {
      applyCopy('about.vision-mission', values);
      companyInfo.vision = values.vision;
      companyInfo.mission = values.mission;
    }
  },

  {
    id: 'about.group-tagline',
    page: 'about',
    label: 'Group tagline',
    description: 'The single italic quote card.',
    icon: 'Quote',
    route: '/about-us/',
    anchor: 'about.group-tagline',
    fields: [{ key: 'quote', label: 'Quote', type: 'textarea' }],
    defaults: clone(copy['about.group-tagline']),
    apply(values) {
      applyCopy('about.group-tagline', values);
    }
  },

  {
    id: 'about.epc',
    page: 'about',
    label: 'EPC division',
    description: 'The installation & commissioning services card.',
    icon: 'Wrench',
    route: '/about-us/',
    anchor: 'about.epc',
    fields: [
      { key: 'enabled', label: 'Show this block on the site', type: 'boolean' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' }
    ],
    defaults: {
      enabled: epcDivision.enabled,
      title: epcDivision.title,
      description: epcDivision.description
    },
    apply(values) {
      Object.assign(epcDivision, {
        enabled: Boolean(values.enabled),
        title: values.title,
        description: values.description
      });
    }
  },

  {
    id: 'about.team',
    page: 'about',
    label: 'Our team',
    description: 'The staff photo grid.',
    icon: 'Users',
    route: '/about-us/',
    anchor: 'about.team',
    fields: [
      { key: 'eyebrow', label: 'Small label above the heading', type: 'text' },
      { key: 'title', label: 'Heading (first part)', type: 'text' },
      { key: 'titleAccent', label: 'Heading (highlighted part)', type: 'text' },
      {
        key: 'items',
        label: 'Team members',
        type: 'list',
        itemLabel: 'person',
        itemFields: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'role', label: 'Job title', type: 'text' },
          { key: 'photo', label: 'Photo', type: 'image', imageGroup: 'team' },
          altField('photoAlt', 'Photo alt text')
        ]
      }
    ],
    defaults: {
      ...clone(copy['about.team']),
      items: teamMembers.map((m) => ({
        name: m.name,
        role: m.role,
        photo: keyOf('team', m.photo),
        photoAlt: m.photoAlt || m.name
      }))
    },
    apply(values) {
      applyCopy('about.team', values);
      replaceItems(
        teamMembers,
        list(values, 'items').map((m) => ({
          name: m.name,
          role: m.role,
          photo: toMedia(m.photo, 'team', images.site['logo-mini']),
          photoAlt: m.photoAlt || m.name
        }))
      );
    }
  },

  {
    id: 'about.careers',
    page: 'about',
    label: 'Careers block',
    description: 'The "Life @ Shree Raj Traders" recruitment card.',
    icon: 'Briefcase',
    route: '/about-us/',
    anchor: 'about.careers',
    fields: [
      { key: 'eyebrow', label: 'Small label', type: 'text' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'body', label: 'Body text', type: 'textarea' },
      { key: 'email', label: 'CV inbox', type: 'text' }
    ],
    defaults: clone(careers),
    apply(values) {
      Object.assign(careers, values);
    }
  },

  {
    id: 'about.journey',
    page: 'about',
    label: 'Journey heading (About page)',
    description: 'Heading above the timeline on the About page.',
    icon: 'Milestone',
    route: '/about-us/',
    anchor: 'about.journey',
    intro: 'The milestones themselves are shared with the Home page — edit them in "Our journey timeline".',
    fields: headingFields,
    defaults: clone(copy['about.journey']),
    apply(values) {
      applyCopy('about.journey', values);
    }
  },

  // ===========================================================================
  // PRODUCTS
  // ===========================================================================
  {
    id: 'products.header',
    page: 'products',
    label: 'Catalogue header',
    description: 'Heading and intro above the product grid.',
    icon: 'Package',
    route: '/products/',
    anchor: 'products.header',
    managedBy: { label: 'Products', to: '/admin/master/product' },
    managedByNote: 'Products and categories are database records — the header below is edited here.',
    fields: [
      { key: 'title', label: 'Page heading', type: 'text' },
      { key: 'intro', label: 'Intro paragraph', type: 'textarea' },
      { key: 'allTabLabel', label: '"All products" tab label', type: 'text' }
    ],
    defaults: clone(copy['products.header']),
    apply(values) {
      applyCopy('products.header', values);
    }
  },

  {
    id: 'products.detail',
    page: 'products',
    label: 'Single product page',
    description: 'Labels and buttons shared by every product page.',
    icon: 'Tag',
    route: '/products/',
    anchor: 'products.detail',
    intro:
      'Preview a real product page by opening the catalogue and clicking any product. The product name, photo, description and specifications come from the Products master.',
    fields: [
      { key: 'backToCatalog', label: 'Back button', type: 'text' },
      { key: 'specificationsTitle', label: 'Specifications heading', type: 'text' },
      { key: 'featuresTitle', label: 'Features heading', type: 'text' },
      {
        key: 'quoteButton',
        label: 'Quote button',
        type: 'text',
        help: 'Write {product} where the product name should appear.'
      },
      { key: 'notFoundTitle', label: 'Unknown product heading', type: 'text', group: 'Error state' },
      { key: 'notFoundCta', label: 'Unknown product button', type: 'text', group: 'Error state' }
    ],
    defaults: clone(copy['products.detail']),
    apply(values) {
      applyCopy('products.detail', values);
    }
  },

  // ===========================================================================
  // CONTACT
  // ===========================================================================
  {
    id: 'contact.header',
    page: 'contact',
    label: 'Contact header',
    description: 'Heading at the top of the contact page.',
    icon: 'Mail',
    route: '/contact/',
    anchor: 'contact',
    fields: headingFields,
    defaults: clone(copy['contact.header']),
    apply(values) {
      applyCopy('contact.header', values);
    }
  },

  {
    id: 'contact.head-office',
    page: 'contact',
    label: 'Head office card',
    description: 'Labels on the address / phone / email card.',
    icon: 'MapPin',
    route: '/contact/',
    anchor: 'contact.head-office',
    intro: 'The address, phone numbers and emails themselves live in "Company contact details".',
    fields: [
      { key: 'heading', label: 'Card heading', type: 'text' },
      { key: 'addressLabel', label: 'Address label', type: 'text' },
      { key: 'phoneLabel', label: 'Phone label', type: 'text' },
      { key: 'emailLabel', label: 'Email label', type: 'text' },
      { key: 'mapsButton', label: 'Maps button', type: 'text' }
    ],
    defaults: clone(copy['contact.head-office']),
    apply(values) {
      applyCopy('contact.head-office', values);
    }
  },

  {
    id: 'contact.form',
    page: 'contact',
    label: 'Enquiry form',
    description: 'Field labels, the product dropdown and the thank-you message.',
    icon: 'Send',
    route: '/contact/',
    anchor: 'contact.form',
    fields: [
      { key: 'heading', label: 'Form heading', type: 'text' },
      { key: 'nameLabel', label: 'Name field label', type: 'text', group: 'Field labels' },
      { key: 'phoneLabel', label: 'Phone field label', type: 'text', group: 'Field labels' },
      { key: 'emailLabel', label: 'Email field label', type: 'text', group: 'Field labels' },
      { key: 'subjectLabel', label: 'Product field label', type: 'text', group: 'Field labels' },
      { key: 'messageLabel', label: 'Message field label', type: 'text', group: 'Field labels' },
      { key: 'submitLabel', label: 'Submit button', type: 'text' },
      { key: 'successMessage', label: 'Thank-you message', type: 'textarea' },
      {
        key: 'subjects',
        label: 'Product dropdown options',
        type: 'list',
        itemLabel: 'option',
        itemFields: [{ key: 'label', label: 'Option', type: 'text' }]
      }
    ],
    defaults: clone(copy['contact.form']),
    apply(values) {
      applyCopy('contact.form', values);
    }
  },

  {
    id: 'contact.group-offices',
    page: 'contact',
    label: 'Group offices',
    description: 'Heading above the associate-network office cards.',
    icon: 'Network',
    route: '/contact/',
    anchor: 'contact.group-offices',
    intro: 'The offices listed come from "Group of companies" on the Home page.',
    fields: [
      { key: 'eyebrow', label: 'Small label above the heading', type: 'text' },
      { key: 'title', label: 'Heading (first part)', type: 'text' },
      { key: 'titleAccent', label: 'Heading (highlighted part)', type: 'text' },
      { key: 'locationLabel', label: '"Location" label', type: 'text' },
      { key: 'divisionLabel', label: '"Division" label', type: 'text' }
    ],
    defaults: clone(copy['contact.group-offices']),
    apply(values) {
      applyCopy('contact.group-offices', values);
    }
  },

  {
    id: 'contact.faqs',
    page: 'contact',
    label: 'FAQ heading',
    description: 'Heading above the frequently asked questions.',
    icon: 'HelpCircle',
    route: '/contact/',
    anchor: 'contact.faqs',
    managedBy: { label: 'FAQs', to: '/admin/master/faq' },
    managedByNote: 'The questions and answers are database records — the heading below is edited here.',
    fields: [
      { key: 'eyebrow', label: 'Small label above the heading', type: 'text' },
      { key: 'title', label: 'Heading (first part)', type: 'text' },
      { key: 'titleAccent', label: 'Heading (highlighted part)', type: 'text' }
    ],
    defaults: clone(copy['contact.faqs']),
    apply(values) {
      applyCopy('contact.faqs', values);
    }
  },

  {
    id: 'contact.rfq',
    page: 'contact',
    label: 'RFQ builder',
    description: 'The "Build your enquiry" quotation tool below the contact form.',
    icon: 'Calculator',
    route: '/contact/',
    anchor: 'calculator',
    fields: [
      ...headingFields,
      {
        key: 'categories',
        label: 'Category buttons',
        type: 'list',
        itemLabel: 'category',
        itemFields: [
          { key: 'label', label: 'Button text', type: 'text' },
          {
            key: 'id',
            label: 'Internal key',
            type: 'text',
            help: 'motor, switchgear or frp — changing this affects which fields appear.'
          }
        ]
      }
    ],
    defaults: clone(copy['contact.rfq']),
    apply(values) {
      applyCopy('contact.rfq', values);
    }
  },

  // ===========================================================================
  // BLOG
  // ===========================================================================
  {
    id: 'blog.header',
    page: 'blog',
    label: 'Blog header',
    description: 'Heading above the article grid.',
    icon: 'BookOpen',
    route: '/blog/',
    anchor: 'blog.header',
    managedBy: { label: 'Blogs', to: '/admin/master/blog' },
    managedByNote: 'The articles are database records — the heading below is edited here.',
    fields: [
      { key: 'eyebrow', label: 'Small label above the heading', type: 'text' },
      { key: 'titleAccent', label: 'Heading', type: 'text' },
      { key: 'intro', label: 'Intro paragraph', type: 'textarea' }
    ],
    defaults: clone(copy['blog.header']),
    apply(values) {
      applyCopy('blog.header', values);
    }
  },

  {
    id: 'blog.post',
    page: 'blog',
    label: 'Single article page',
    description: 'Labels shared by every blog article page.',
    icon: 'FileText',
    route: '/blog/',
    anchor: 'blog.post',
    managedBy: { label: 'Blogs', to: '/admin/master/blog' },
    managedByNote: 'Article titles, images and body text are database records.',
    fields: [
      { key: 'backToBlog', label: 'Back button', type: 'text' },
      { key: 'notFoundTitle', label: 'Unknown article heading', type: 'text', group: 'Error state' },
      { key: 'notFoundCta', label: 'Unknown article button', type: 'text', group: 'Error state' }
    ],
    defaults: clone(copy['blog.post']),
    apply(values) {
      applyCopy('blog.post', values);
    }
  },

  // ===========================================================================
  // GALLERY
  // ===========================================================================
  {
    id: 'gallery.header',
    page: 'gallery',
    label: 'Gallery header',
    description: 'The bar above the flip-book.',
    icon: 'Images',
    route: '/gallery/',
    anchor: 'gallery.header',
    fields: [
      { key: 'eyebrow', label: 'Small label', type: 'text' },
      { key: 'title', label: 'Heading (first part)', type: 'text' },
      { key: 'titleAccent', label: 'Heading (highlighted part)', type: 'text' },
      { key: 'hint', label: 'Instruction line', type: 'textarea' }
    ],
    defaults: clone(copy['gallery.header']),
    apply(values) {
      applyCopy('gallery.header', values);
    }
  },

  {
    id: 'gallery.book',
    page: 'gallery',
    label: 'Flip-book cover & end pages',
    description: 'Front cover, welcome page and the closing "Thank you" page.',
    icon: 'BookMarked',
    route: '/gallery/',
    anchor: 'gallery.book',
    fields: [
      { key: 'coverEyebrow', label: 'Cover label', type: 'text', group: 'Front cover' },
      { key: 'coverTitleLine1', label: 'Cover title line 1', type: 'text', group: 'Front cover' },
      { key: 'coverTitleLine2', label: 'Cover title line 2', type: 'text', group: 'Front cover' },
      { key: 'coverLocation', label: 'Cover location', type: 'text', group: 'Front cover' },
      { key: 'coverStatValue', label: 'Cover statistic', type: 'text', group: 'Front cover' },
      { key: 'coverStatLabel', label: 'Cover statistic caption', type: 'text', group: 'Front cover' },
      { key: 'coverScrollHint', label: 'Cover scroll hint', type: 'text', group: 'Front cover' },
      { key: 'introBadge', label: 'Welcome badge', type: 'text', group: 'Welcome page' },
      { key: 'introTitle', label: 'Welcome title', type: 'text', group: 'Welcome page' },
      { key: 'introBody1', label: 'Welcome paragraph 1', type: 'textarea', group: 'Welcome page' },
      { key: 'introBody2', label: 'Welcome paragraph 2', type: 'textarea', group: 'Welcome page' },
      { key: 'introBody3', label: 'Welcome paragraph 3', type: 'textarea', group: 'Welcome page' },
      { key: 'outroBadge', label: 'Closing badge', type: 'text', group: 'Closing page' },
      { key: 'outroTitle', label: 'Closing title', type: 'text', group: 'Closing page' },
      { key: 'outroBody', label: 'Closing paragraph', type: 'textarea', group: 'Closing page' },
      { key: 'outroHotlineLabel', label: 'Hotline label', type: 'text', group: 'Closing page' },
      { key: 'outroEmailLabel', label: 'Email label', type: 'text', group: 'Closing page' },
      { key: 'outroAddressLabel', label: 'Address label', type: 'text', group: 'Closing page' },
      { key: 'outroAddress', label: 'Address shown', type: 'textarea', group: 'Closing page' },
      { key: 'outroCtaProducts', label: 'Catalogue button', type: 'text', group: 'Closing page' },
      { key: 'outroCtaContact', label: 'Contact button', type: 'text', group: 'Closing page' },
      { key: 'pageFooterLabel', label: 'Page footer label', type: 'text', group: 'Page furniture' },
      { key: 'brandFooterLabel', label: 'Brand footer label', type: 'text', group: 'Page furniture' }
    ],
    defaults: clone(copy['gallery.book']),
    apply(values) {
      applyCopy('gallery.book', values);
    }
  },

  {
    id: 'gallery.photos',
    page: 'gallery',
    label: 'Facility photographs',
    description: 'The seven photo pages inside the flip-book, with their captions.',
    icon: 'Camera',
    route: '/gallery/',
    anchor: 'gallery.photos',
    fields: [
      {
        key: 'items',
        label: 'Photographs',
        type: 'list',
        itemLabel: 'photo',
        fixedLength: true,
        help: 'The book is laid out for exactly seven photographs.',
        itemFields: [
          { key: 'title', label: 'Page title', type: 'text' },
          { key: 'tag', label: 'Corner tag', type: 'text' },
          { key: 'description', label: 'Caption', type: 'textarea' },
          { key: 'image', label: 'Photograph', type: 'image', imageGroup: 'gallery' },
          altField('alt', 'Photo alt text')
        ]
      }
    ],
    defaults: {
      items: galleryPhotos.map((photo) => ({
        title: photo.num,
        tag: photo.tag,
        description: photo.description,
        image: keyOf('gallery', photo.image),
        alt: photo.alt
      }))
    },
    apply(values) {
      replaceItems(
        galleryPhotos,
        list(values, 'items').map((p, i) => ({
          id: galleryPhotos[i]?.id || `facility-${i + 1}`,
          image: toMedia(p.image, 'gallery', images.site['logo-mini']),
          alt: p.alt || p.description || '',
          num: p.title,
          tag: p.tag,
          description: p.description
        }))
      );
    }
  },

  // ===========================================================================
  // CAREERS — unlisted page at /career/
  // ===========================================================================
  {
    id: 'career.hero',
    page: 'career',
    label: 'Careers banner',
    description: 'The heading at the top of the careers page.',
    icon: 'Briefcase',
    route: '/career/',
    anchor: 'career.hero',
    intro:
      'This page is not in the website menu or footer on purpose — candidates reach it only through the link you send them: /career/',
    fields: [
      ...headingFields,
      { key: 'ctaLabel', label: 'Button to the openings list', type: 'text' },
      { key: 'statsLabel', label: 'Caption under the open-role count', type: 'text' }
    ],
    defaults: clone(copy['career.hero']),
    apply(values) {
      applyCopy('career.hero', values);
    }
  },

  {
    id: 'career.why-join',
    page: 'career',
    label: 'Why join us',
    description: 'The reasons-to-work-here cards.',
    icon: 'Sparkles',
    route: '/career/',
    anchor: 'career.why-join',
    fields: [
      ...headingFields,
      {
        key: 'items',
        label: 'Cards',
        type: 'list',
        itemLabel: 'card',
        itemFields: [
          { key: 'title', label: 'Card title', type: 'text' },
          { key: 'description', label: 'Card text', type: 'textarea' }
        ]
      }
    ],
    defaults: clone(copy['career.why-join']),
    apply(values) {
      applyCopy('career.why-join', values);
    }
  },

  {
    id: 'career.openings',
    page: 'career',
    label: 'Open positions',
    description: 'Headings and labels around the vacancy list.',
    icon: 'ListChecks',
    route: '/career/',
    anchor: 'career.openings',
    managedBy: { label: 'Job Openings', to: '/admin/master/job-opening' },
    managedByNote:
      'The vacancies themselves are database records — add, edit or deactivate them there. The labels below are edited here.',
    fields: [
      ...headingFields,
      { key: 'applyLabel', label: 'Apply button', type: 'text' },
      { key: 'responsibilitiesLabel', label: 'Responsibilities heading', type: 'text' },
      { key: 'requirementsLabel', label: 'Requirements heading', type: 'text' },
      {
        key: 'emptyTitle',
        label: 'Heading when there are no vacancies',
        type: 'text',
        group: 'When nothing is open'
      },
      {
        key: 'emptyBody',
        label: 'Text when there are no vacancies',
        type: 'textarea',
        group: 'When nothing is open'
      }
    ],
    defaults: clone(copy['career.openings']),
    apply(values) {
      applyCopy('career.openings', values);
    }
  },

  {
    id: 'career.form',
    page: 'career',
    label: 'Application form',
    description: 'Field labels and the thank-you message on the application form.',
    icon: 'Send',
    route: '/career/',
    anchor: 'career.form',
    managedBy: { label: 'Job Applications', to: '/admin/master/job-application' },
    managedByNote: 'Submitted applications, including attached CVs, arrive there.',
    fields: [
      ...headingFields,
      { key: 'nameLabel', label: 'Name field', type: 'text', group: 'Field labels' },
      { key: 'emailLabel', label: 'Email field', type: 'text', group: 'Field labels' },
      { key: 'phoneLabel', label: 'Phone field', type: 'text', group: 'Field labels' },
      { key: 'positionLabel', label: 'Position field', type: 'text', group: 'Field labels' },
      { key: 'positionPlaceholder', label: 'Position placeholder', type: 'text', group: 'Field labels' },
      { key: 'experienceLabel', label: 'Experience field', type: 'text', group: 'Field labels' },
      { key: 'messageLabel', label: 'Message field', type: 'text', group: 'Field labels' },
      { key: 'resumeLabel', label: 'CV upload field', type: 'text', group: 'Field labels' },
      { key: 'resumeHint', label: 'CV upload hint', type: 'text', group: 'Field labels' },
      { key: 'submitLabel', label: 'Submit button', type: 'text' },
      { key: 'successMessage', label: 'Thank-you message', type: 'textarea' },
      { key: 'errorMessage', label: 'Failure message', type: 'textarea' }
    ],
    defaults: clone(copy['career.form']),
    apply(values) {
      applyCopy('career.form', values);
    }
  },

  {
    id: 'career.contact',
    page: 'career',
    label: 'Email us instead',
    description: 'The fallback card offering the HR email address.',
    icon: 'Mail',
    route: '/career/',
    anchor: 'career.contact',
    intro: 'The address shown is the careers inbox from "Company contact details".',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Text', type: 'textarea' },
      { key: 'emailLabel', label: 'Label before the address', type: 'text' }
    ],
    defaults: clone(copy['career.contact']),
    apply(values) {
      applyCopy('career.contact', values);
    }
  },

  // ===========================================================================
  // LOCATIONS
  // ===========================================================================
  {
    id: 'locations.header',
    page: 'locations',
    label: 'Locations header',
    description: 'Heading above the city grid.',
    icon: 'Map',
    route: '/locations/',
    anchor: 'locations.header',
    fields: [...headingFields, { key: 'cardCta', label: 'City card link text', type: 'text' }],
    defaults: clone(copy['locations.header']),
    apply(values) {
      applyCopy('locations.header', values);
    }
  },

  {
    id: 'locations.cities',
    page: 'locations',
    label: 'Cities served',
    description: 'Every city gets its own landing page at /locations/<web address>/.',
    icon: 'MapPinned',
    route: '/locations/',
    anchor: 'locations.cities',
    fields: [
      {
        key: 'items',
        label: 'Cities',
        type: 'list',
        itemLabel: 'city',
        itemFields: [
          { key: 'name', label: 'City', type: 'text' },
          { key: 'district', label: 'District', type: 'text' },
          {
            key: 'slug',
            label: 'Web address',
            type: 'text',
            help: 'Lower case, no spaces. Changing this breaks existing links to that city.'
          }
        ]
      }
    ],
    defaults: { items: clone(CITIES) },
    apply(values) {
      replaceItems(CITIES, list(values, 'items'));
    }
  },

  // ===========================================================================
  // CITY LANDING PAGES
  // ===========================================================================
  {
    id: 'city.page',
    page: 'city',
    label: 'City page template',
    description:
      'One template shared by every city landing page. Write {city} or {district} where the city name should appear.',
    icon: 'FileText',
    route: `/locations/${CITIES[0]?.slug || 'vadodara'}/`,
    anchor: 'city.page',
    fields: [
      { key: 'backLink', label: 'Back link', type: 'text', group: 'Top banner' },
      { key: 'heroEyebrow', label: 'Small label', type: 'text', group: 'Top banner' },
      { key: 'heroTitle', label: 'Headline', type: 'text', group: 'Top banner', help: 'The city name is appended in orange.' },
      { key: 'heroIntro', label: 'Intro paragraph', type: 'textarea', group: 'Top banner' },
      { key: 'ctaRfq', label: 'RFQ button', type: 'text', group: 'Top banner' },
      { key: 'ctaCatalog', label: 'Catalogue button', type: 'text', group: 'Top banner' },
      { key: 'brandsStripLabel', label: 'Brand strip caption', type: 'text', group: 'Top banner' },

      { key: 'infoBadge', label: 'Badge', type: 'text', group: 'Main article' },
      { key: 'infoTitle', label: 'Heading', type: 'text', group: 'Main article' },
      { key: 'infoSubtitle', label: 'Sub-heading', type: 'text', group: 'Main article' },
      {
        key: 'infoBodyHtml',
        label: 'Body copy',
        type: 'html',
        group: 'Main article',
        help: 'Wrap each paragraph in <p>…</p>. <strong>bold</strong> is allowed.'
      },
      { key: 'coverageTitle', label: 'Coverage heading', type: 'text', group: 'Main article' },
      { key: 'coverageIntro', label: 'Coverage intro', type: 'textarea', group: 'Main article' },
      {
        key: 'coverageItems',
        label: 'Coverage bullets',
        type: 'list',
        group: 'Main article',
        itemLabel: 'bullet',
        itemFields: [{ key: 'label', label: 'Text', type: 'text' }]
      },
      { key: 'specsTitle', label: 'Specification heading', type: 'text', group: 'Main article' },
      {
        key: 'specGroups',
        label: 'Specification tables',
        type: 'list',
        group: 'Main article',
        itemLabel: 'table',
        itemFields: [
          { key: 'title', label: 'Table title', type: 'text' },
          { key: 'row1Label', label: 'Row 1 label', type: 'text' },
          { key: 'row1Value', label: 'Row 1 value', type: 'text' },
          { key: 'row2Label', label: 'Row 2 label', type: 'text' },
          { key: 'row2Value', label: 'Row 2 value', type: 'text' },
          { key: 'row3Label', label: 'Row 3 label', type: 'text' },
          { key: 'row3Value', label: 'Row 3 value', type: 'text' }
        ]
      },

      { key: 'sidebarEyebrow', label: 'Small label', type: 'text', group: 'Pricing sidebar' },
      { key: 'sidebarTitle', label: 'Heading', type: 'text', group: 'Pricing sidebar' },
      { key: 'sidebarIntro', label: 'Text', type: 'textarea', group: 'Pricing sidebar' },

      { key: 'advantageEyebrow', label: 'Small label', type: 'text', group: 'Why choose us' },
      { key: 'advantageTitle', label: 'Heading', type: 'text', group: 'Why choose us' },
      { key: 'advantageIntro', label: 'Intro paragraph', type: 'textarea', group: 'Why choose us' },
      {
        key: 'advantageCards',
        label: 'Cards',
        type: 'list',
        group: 'Why choose us',
        itemLabel: 'card',
        fixedLength: true,
        help: 'Four cards, each with a fixed icon.',
        itemFields: [
          { key: 'title', label: 'Card title', type: 'text' },
          { key: 'description', label: 'Card text', type: 'textarea' }
        ]
      },

      { key: 'faqEyebrow', label: 'Small label', type: 'text', group: 'FAQ' },
      { key: 'faqTitle', label: 'Heading (first part)', type: 'text', group: 'FAQ' },
      { key: 'faqTitleAccent', label: 'Heading (highlighted part)', type: 'text', group: 'FAQ' },
      { key: 'faqIntro', label: 'Intro paragraph', type: 'textarea', group: 'FAQ' },

      { key: 'finalCtaBadge', label: 'Badge', type: 'text', group: 'Closing call to action' },
      { key: 'finalCtaTitle', label: 'Heading', type: 'text', group: 'Closing call to action' },
      { key: 'finalCtaIntro', label: 'Text', type: 'textarea', group: 'Closing call to action' },
      { key: 'finalCtaPrimary', label: 'RFQ button', type: 'text', group: 'Closing call to action' },
      { key: 'finalCtaWhatsapp', label: 'WhatsApp button', type: 'text', group: 'Closing call to action' },

      { key: 'notFoundTitle', label: 'Unknown city heading', type: 'text', group: 'Error state' },
      { key: 'notFoundCta', label: 'Unknown city button', type: 'text', group: 'Error state' }
    ],
    defaults: clone(copy['city.page']),
    apply(values) {
      applyCopy('city.page', values);
    }
  }
];

/** Registry lookups used by the editor and the in-page overlay. */
export const SECTION_BY_ID = SECTIONS.reduce((acc, section) => {
  acc[section.id] = section;
  return acc;
}, {});

export const sectionsForPage = (pageId) => SECTIONS.filter((s) => s.page === pageId);

/** Full default payload — the state the site is in before any edit. */
export const defaultSiteContent = () =>
  SECTIONS.reduce((acc, section) => {
    acc[section.id] = clone(section.defaults);
    return acc;
  }, {});
