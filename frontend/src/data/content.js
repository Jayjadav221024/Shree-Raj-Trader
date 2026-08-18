// =============================================================================
// UNVERIFIED CONTENT — PENDING CLIENT APPROVAL
// =============================================================================
// Everything in this file is rendered on the site but is NOT published on
// https://shreerajtraders.in, or could not be corroborated there. It is
// collected here so the client can approve, correct or delete it in one place
// without touching any component.
//
// To remove an item from the site, empty/blank it here — components read from
// this module and skip falsy values.
//
// Legend for `status`:
//   'live'      – verified against a live page (kept here only for grouping)
//   'unverified'– not found on the live site; needs client sign-off
// =============================================================================

/** Hero stat counters. Not published anywhere on the live site. */
export const statsCounter = [
  { value: '60+', label: 'Years of Experience', status: 'unverified' },
  { value: '8,000+', label: 'Happy Customers', status: 'unverified' },
  { value: '99%', label: 'Customer Retention Rate', status: 'unverified' },
  { value: '10,000+', label: 'Stock Keeping Units (SKUs)', status: 'unverified' }
];

/**
 * Numeric product specs. These DO appear in the live product-page copy, but
 * they were flagged for re-confirmation because several live pages contain
 * transcription errors (e.g. "ISI markinh", MCB breaking capacity omitted).
 */
export const productSpecFigures = {
  motorOutputPower: { value: '0.5 HP to 425 HP', status: 'live' },
  motorProtection: { value: 'IP55, IP56, IP65', status: 'live' },
  motorEfficiency: { value: 'IE2, IE3, IE4', status: 'live' },
  mccbRatedCurrent: { value: '16A to 1250A', status: 'live' },
  mccbBreakingCapacity: { value: '16 kA to 55 kA', status: 'live' },
  gearboxTorque: { value: 'Up to 4300 Nm', status: 'live' },
  gratingMesh: { value: '3838', status: 'unverified' },
  gratingHeights: { value: '25 mm, 30 mm, 38 mm', status: 'unverified' }
};

/**
 * EPC division. No EPC page or section exists on the live site.
 * Set `enabled: false` to remove the block from the site.
 */
export const epcDivision = {
  enabled: true,
  status: 'unverified',
  title: 'EPC Division',
  description:
    'Our EPC division provides installation, erection and commissioning services — a one-stop solution covering supply through to a fully commissioned system.'
};

/**
 * FAQ section. No FAQ exists on the live site; this copy was written for the
 * revamp and needs client approval before it ships.
 */
export const faqsEnabled = true;
export const faqsStatus = 'unverified';

export const faqs = [
  {
    q: 'Are you an authorized Siemens switchgear supplier in Ahmedabad?',
    a: 'Yes. Shree Raj Traders is an authorized channel partner for Siemens, CGL (Crompton Greaves) and Hindustan Electric Motors, supplying low voltage switchgears, control products, MCBs, the Sinnova range and industrial electric motors in Ahmedabad and across Gujarat.'
  },
  {
    q: 'What brands of electric motors do you stock?',
    a: 'We supply Siemens, CGL (Crompton Greaves) and Hindustan Electric Motors, in output ratings from 0.5 HP to 425 HP across IE2, IE3 and IE4 efficiency classes.'
  },
  {
    q: 'Why should we choose FRP Gratings over steel gratings?',
    a: 'FRP gratings are a composite of resin and fiberglass — corrosion resistant, lightweight, and with a high strength-to-weight ratio, which lowers handling and maintenance effort compared with steel.'
  },
  {
    q: 'Can I get a price quotation for bulk industrial orders?',
    a: 'Yes. Use the RFQ Calculator on this website or call us on 1234 and our sales team will prepare a formal quotation.'
  }
];

/**
 * Third email address. The live footer lists only sales@ and finance@.
 * Blank this string to drop it from the contact block.
 */
export const alternateEmail = {
  value: 'shreerajtraders@rediffmail.com',
  status: 'unverified'
};

/**
 * Domain/capability cards. The six titles match the live homepage wording
 * (see `domains` in siteData); the descriptive copy below was written for the
 * revamp and is not on live.
 */
export const domainDescriptionsStatus = 'unverified';
