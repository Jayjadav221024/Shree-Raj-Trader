// =============================================================================
// SINGLE SOURCE OF TRUTH FOR ALL SITE CONTENT
// Every value below is taken from the live production site
// https://shreerajtraders.in — do not add specs, numbers, ratings or claims
// that are not published there. If the live site has no value for a field,
// omit the field rather than guessing.
//
// Anything that is NOT on the live site lives in ./content.js instead, so it
// can be approved or removed by the client in one place.
// Images are local .webp files, imported via ./images.js.
// =============================================================================
import { images } from './images';
import { statsCounter as flaggedStats, epcDivision as flaggedEpc, faqs as flaggedFaqs, alternateEmail } from './content';

export { images };

export const companyInfo = {
  name: "Shree Raj Traders",
  tagline: "Authorized Channel Partner for Siemens, CGL (Crompton Greaves), and Hindustan Electric Motors",
  location: "Ahmedabad, Gujarat, India",
  experienceYears: "60+",

  // Contact
  phone: "+91-97267 88690 | +91-98256 88690",
  phonePrimary: "+91-97267 88690",
  phoneSecondary: "+91-98256 88690",
  telPrimary: "+919726788690",   // for href="tel:" — never include spaces
  telSecondary: "+919825688690",

  email: "sales@shreerajtraders.in",
  emailPrimary: "sales@shreerajtraders.in",
  emailAccounts: "finance@shreerajtraders.in",
  // Not on the live footer — see content.js
  emailAlternate: alternateEmail.value,
  // Careers inbox, from the live Our Team page
  emailCareers: "info@shreerajtraders.in",

  address:
    "39, Mahalaxmi Industrial Estate, Near Ghodasar Railway Crossing, Bombay Conductor Road, Vatva, Phase 1, Ahmedabad, Gujarat, India",

  whatsapp: "https://wa.me/919726788690",
  googleMaps:
    "https://maps.google.com/?q=39,+Mahalaxmi+Industrial+Estate,+Near+Ghodasar+Railway+Crossing,+Bombay+Conductor+Road,+Vatva,+Phase+1,+Ahmedabad,+Gujarat",

  // NOTE: business/operating hours are intentionally absent — the live site
  // does not publish them.

  about:
    "Welcome to Shree Raj Traders – a trusted Siemens switchgear supplier in Ahmedabad and authorized channel partner for motors, gearboxes, switchgear, and FRP cable trays and gratings.",

  director: "Mr. Hemant Patel",
  directorTitle: "Director",
  directorMessage:
    "At Shree Raj Traders, our foundation is built on six decades of trust, engineering excellence, and unwavering commitment to our clients. We strive to deliver the highest quality electro-mechanical equipment and support our partners with complete solutions from selection to commissioning.",

  vision:
    "To be the most sought-after global business partner delivering value to clients, employees, and shareholders through innovation, integrity, and absolute customer satisfaction.",
  mission:
    "Leveraging our 60+ years in the Electro-Mechanical Industry to supply top-tier engineering products, offering reliable technical support, and building long-lasting relationship links with our clients."
};

export const siteMeta = {
  // Verbatim from the live footer
  copyright: "© Copyright 2012 Shreerajtraders",
  logo: images.site['logo-mini'],
  favicon: images.site['fav-icon'],
  aboutPhoto: images.site['about-facility'],
  // Siemens low-voltage switchgear range — doubles as the Switchgears category
  // thumbnail. Replaced the placeholder hero.png render.
  heroImage: images.products['cat-switchgears'],
  // Corporate profile paragraph, verbatim from the live footer
  corporateProfile:
    "Shree Raj Traders stands as a globally recognized leader in the Electro-Mechanical Industry, with a distinguished presence spanning over six decades. Our company has consistently demonstrated robust growth and cultivated a prestigious clientele base. As we continue to expand our global footprint, Shree Raj Traders remains dedicated to providing cutting-edge solutions and maintaining the highest standards of quality and service. Our long-standing expertise, coupled with our forward-thinking approach, positions us as a reliable partner for businesses seeking best-in-class electro-mechanical products and services."
};

// -----------------------------------------------------------------------------
// LIVE URL STRUCTURE
// Preserved verbatim from production so existing SEO rankings survive the
// revamp. The current build is a single-page app, so links resolve to in-page
// section anchors where an equivalent section exists (`anchor`), and to the
// canonical live path otherwise (`path`). When real routing is introduced,
// point the components at `path` and delete the `anchor` fallbacks.
// -----------------------------------------------------------------------------
export const routes = {
  home: { path: "/", anchor: "/#hero" },
  aboutUs: { path: "/about-us/", anchor: "/#about" },
  ourTeam: { path: "/our-team/", anchor: "/#leadership" },
  gallery: { path: "/gallery/", anchor: "/gallery/" },
  blog: { path: "/blog/", anchor: "/blog/" },
  contact: { path: "/contact/", anchor: "/#contact" },
  products: { path: "/products/", anchor: "/#products" }
};

export const productCategoryRoutes = {
  switchgears: "/products_category/switchgears/",
  motors: "/products_category/motors/",
  frpGratings: "/products_category/frp-gratings/",
  frpCableTray: "/products_category/frp-cable-tray/"
};

// -----------------------------------------------------------------------------
// NAVIGATION
// Labels + destinations only. The Navbar keeps its existing markup and simply
// reads these values, so nav content can change without touching components.
// -----------------------------------------------------------------------------
export const navMenus = {
  about: [
    { label: "About Shree Raj Traders", href: routes.aboutUs.path },
    { label: "Our Team", href: routes.aboutUs.path }
  ],
  products: {
    switchgears: [
      { label: "Siemens LV Power Distribution", href: "/product/siemens-switchgear-low-voltage-power-distribution-product" },
      { label: "Low Voltage Control Product", href: "/product/low-voltage-control-product" },
      { label: "MCB", href: "/product/mcb" },
      { label: "Sinnova", href: "/product/sinnova" }
    ],
    motors: [
      { label: "Siemens Motor", href: "/product/siemens-motor" },
      { label: "Crompton Greaves Motor", href: "/product/crompton-greaves-motor" },
      { label: "Hindustan Electric Motor", href: "/product/hindustan-electric-motor" }
    ],
    gratings: [
      { label: "Meniscus Top", href: "/product/meniscus-top" },
      { label: "Grit Top", href: "/product/grit-top" },
      { label: "Checkered Plate", href: "/product/cheker-plate" }
    ],
    trays: [
      { label: "Ladder Type Cable Tray", href: "/product/ladder-type-cable-tray" },
      { label: "Perforated Cable Tray", href: "/product/perforated-cable-tray" }
    ]
  }
};

// -----------------------------------------------------------------------------
// HERO
// -----------------------------------------------------------------------------
// Not published on live — editable/removable in content.js
export const statsCounter = flaggedStats;

// Only claims that are supported by the live site. Warranty / dispatch-speed
// promises are deliberately absent.
export const heroAssurances = [
  "Authorized Channel Partner: Siemens, CGL & Hindustan",
  "10,000+ SKUs in Stock",
  "Technical Field Support"
];

// Two-value spec strip shown at the foot of each hero showcase card.
export const heroCardSpecs = {
  motors: { left: "0.5 HP - 425 HP", right: "IP55 / IP56 / IP65" },
  switchgears: { left: "MCCB 16A - 1250A", right: "IEC 60947" },
  gratings: { left: "Mesh 3838", right: "25 / 30 / 38 mm" },
  cableTrays: { left: "Fire-Retardant", right: "UV Stabilized" }
};

// -----------------------------------------------------------------------------
// BRANDS
// -----------------------------------------------------------------------------
export const authorizedBrands = [
  {
    id: "siemens",
    name: "SIEMENS",
    tagline: "Global Powerhouse in Electrical & Automation",
    category: "Switchgear, Motors, Drives",
    logo: images.brands.siemens,
    color: "orange",
    authorizedPartner: true,
    highlights: [
      "Low Voltage Switchgears",
      "IE2/IE3/IE4 Efficiency Motors",
      "SINNOVA Range",
      "ACB & MCCB Protection"
    ]
  },
  {
    id: "crompton",
    name: "Crompton Greaves (CGL)",
    tagline: "Pioneers in Industrial Electric Motors",
    category: "Motors",
    logo: images.brands['crompton-greaves'],
    color: "orange",
    authorizedPartner: true,
    highlights: [
      "Foot & Flange Mounted Motors",
      "IE2/IE3/IE4 Motors",
      "Induction Motors",
      "Cast Iron Housing"
    ]
  },
  {
    id: "hindustan",
    name: "Hindustan Electric Motors",
    tagline: "Heavy Industrial High-Torque Solutions",
    category: "Electric Motors",
    logo: images.brands['hindustan-electric'],
    color: "orange",
    authorizedPartner: true,
    highlights: [
      "3-Phase Induction Motors",
      "IE2/IE3/IE4 Motors",
      "Foot & Flange Mounting",
      "Cast Iron Frames"
    ]
  },
  {
    id: "innomotics",
    name: "Innomotics",
    tagline: "Motors & Large Drives Systems",
    category: "Motors & Drives",
    logo: images.brands.innomotics,
    color: "orange",
    authorizedPartner: false,
    highlights: [
      "Industrial Electric Motors",
      "Large Drive Systems",
      "Motion Control",
      "Energy Efficient Drives"
    ]
  }
];

// -----------------------------------------------------------------------------
// PRODUCTS
// Five top-level categories, matching the live site exactly:
// Switchgears, Motors, Gear Box, FRP Gratings, FRP Cable Tray.
// No star ratings exist on the live site — do not reintroduce a `rating` field.
// -----------------------------------------------------------------------------
export { productCategories, allProducts } from './products';

// -----------------------------------------------------------------------------
// SERVICES & DOMAINS
// -----------------------------------------------------------------------------
export const domains = [
  {
    title: "Engineering Solutions",
    icon: "Cpu",
    description:
      "Delivering prompt, custom-tailored industrial motor & switchgear solutions with dedicated technical support to minimize operational downtime."
  },
  {
    title: "Infrastructure Excellence",
    icon: "Building2",
    description:
      "Developing robust electrical & composite infrastructure linkages that boost regional industrial productivity across Gujarat."
  },
  {
    title: "Technical Workforce",
    icon: "Users",
    description:
      "Comprehensive engineering staffing & technical advisory network ensuring you get expert guidance during installation & maintenance."
  },
  {
    title: "Environmental Responsibility",
    icon: "Leaf",
    description:
      "Promoting energy-efficient IE2/IE3/IE4 electric motors and durable, corrosion-resistant FRP solutions that reduce maintenance waste over their service life."
  },
  {
    title: "Electrical Components",
    icon: "Zap",
    description:
      "Offering Siemens LV switchgears, control products, MCBs and the Sinnova range with responsive technical turn-around."
  },
  {
    title: "Distribution Services",
    icon: "Truck",
    description:
      "Efficient distribution and a robust logistics network ensuring timely, reliable delivery from manufacturers to industry."
  }
];

export const epcDivision = flaggedEpc;

// -----------------------------------------------------------------------------
// GROUP OF COMPANIES
// -----------------------------------------------------------------------------
export const groupCompanies = [
  {
    name: "Shree Raj Traders",
    logo: images.group["shree-raj-traders"],
    role: "Authorized Motors & Switchgear Supplier",
    location: "39, Mahalaxmi Industrial Estate, Vatva Phase 1, Ahmedabad",
    href: "/"
  },
  {
    name: "Apidel Technologies",
    logo: images.group["apidel-technologies"],
    role: "Technology Services",
    location:
      "4th Floor, Pancham Icon, Vasna Rd, beside D Mart Mall, Vadodara, Gujarat 390007",
    href: "https://apideltech.com/"
  },
  {
    name: "Techno Sales Agency",
    logo: images.group["techno-sales-agency"],
    role: "Engineering Supplier",
    location:
      "8/5-6, Kewal Shopping Centre, Old N.H. No. 8, GIDC, Ankleshwar, Gujarat 393002",
    href: null
  },
  {
    name: "Transpower Technologies Pvt. Ltd.",
    logo: images.group["transpower-technologies"],
    role: "Power & Automation",
    location: "346, Makarpura GIDC, Makarpura, Vadodara, Gujarat 390010",
    href: "https://www.transpower.net.in/"
  }
];

// -----------------------------------------------------------------------------
// COMPANY HISTORY
// -----------------------------------------------------------------------------
export const companyTimeline = [
  { year: "1998", event: "Acquired Desai Brothers and Company" },
  { year: "2005", event: "Renamed to Transpower Technologies Pvt Ltd" },
  { year: "2008", event: "Acquired Yash High Voltage" },
  { year: "2010", event: "Launched Livebird and ventured into farming" },
  { year: "2012", event: "Established Apidel Technologies" },
  { year: "2013", event: "Acquired Shree Raj Traders" },
  { year: "2017", event: "Acquired Techno Sales Agency" },
  { year: "2018", event: "Expanded into the FRP industry" }
];

// -----------------------------------------------------------------------------
// SOCIAL PROOF
// -----------------------------------------------------------------------------
export const testimonials = [
  {
    client: "Mukesh Dobariya",
    company: "HI-MAKE",
    feedback:
      "We received exceptional value for money on Siemens switchgear, along with valuable technical assistance in selecting the right products for our requirements."
  },
  {
    client: "Rakesh Gaveriya",
    company: "Mech Tech Machine Pvt Ltd",
    feedback:
      "A reliable partner for Crompton Greaves induction motors. They are responsive, deliver promptly, and have consistently helped us meet our project deadlines."
  },
  {
    client: "Abhay",
    company: "Spectom",
    feedback:
      "Their knowledge of Siemens, Crompton Greaves and Hindustan induction motors is unmatched. Application expertise plays an important role in deciding which motor should be used in the production machines and not just as an electrical item."
  }
];

export const clientLogos = [
  { name: "Shiva Pharma", image: images.clients["shiva-pharma"] },
  { name: "Anupam", image: images.clients["anupam"] },
  { name: "GEA", image: images.clients["gea"] },
  { name: "GSFC", image: images.clients["gsfc"] },
  { name: "GACL", image: images.clients["gacl"] },
  { name: "Hero", image: images.clients["hero"] },
  { name: "PI Industries", image: images.clients["pi-industries"] },
  { name: "TBEA", image: images.clients["tbea"] },
  { name: "Alembic", image: images.clients["alembic"] },
  { name: "Aerzen", image: images.clients["aerzen"] },
  { name: "R K Bio", image: images.clients["r-k-bio"] },
  { name: "Hi-Make", image: images.clients["hi-make"] },
  { name: "Nayara", image: images.clients["nayara"] }
];

// -----------------------------------------------------------------------------
// FAQ
// -----------------------------------------------------------------------------
export const faqs = flaggedFaqs;

// -----------------------------------------------------------------------------
// GALLERY
// Seven facility photographs from https://shreerajtraders.in/gallery/
// The live gallery publishes no captions, so alt text is descriptive only.
// `num`/`tag`/`description` are the page furniture inside the flip-book; they
// live here (rather than in the component) so the Website Editor can reach them.
// -----------------------------------------------------------------------------
export const galleryPhotos = [
  {
    id: 'facility-1',
    image: images.gallery['facility-1'],
    alt: 'Two Shree Raj Traders staff checking boxed spares against paperwork in the parts store',
    num: 'Parts Store',
    tag: 'Stock Control',
    description: 'Checking boxed spares against paperwork, on shelving of labelled Siemens and allied components.'
  },
  {
    id: 'facility-2',
    image: images.gallery['facility-2'],
    alt: 'The Shree Raj Traders warehouse team photographed on the storage floor',
    num: 'Warehouse Team',
    tag: 'Our People',
    description: 'The warehouse team on the storage floor, among the racked and crated stock they handle each day.'
  },
  {
    id: 'facility-3',
    image: images.gallery['facility-3'],
    alt: 'A staff member moving crated equipment on a hydraulic pallet truck in the warehouse',
    num: 'Materials Handling',
    tag: 'Operations',
    description: 'Moving crated equipment across the warehouse floor on a hydraulic pallet truck.'
  },
  {
    id: 'facility-4',
    image: images.gallery['facility-4'],
    alt: 'The Shree Raj Traders team gathered together on a lawn at dusk',
    num: 'Team Gathering',
    tag: 'Our People',
    description: 'The team together on the lawn outside, photographed at dusk.'
  },
  {
    id: 'facility-5',
    image: images.gallery['facility-5'],
    alt: 'Shree Raj Traders staff working through paperwork around the table in the office meeting room',
    num: 'Planning Meeting',
    tag: 'Coordination',
    description: 'Working through orders and schedules around the table in the office meeting room.'
  },
  {
    id: 'facility-6',
    image: images.gallery['facility-6'],
    alt: 'The Shree Raj Traders office team photographed in the meeting room',
    num: 'Office Team',
    tag: 'Our People',
    description: 'The office team photographed in the meeting room at the company premises.'
  },
  {
    id: 'facility-7',
    image: images.gallery['facility-7'],
    alt: 'A full Shree Raj Traders team photograph taken outdoors beside the compound wall',
    num: 'The Full Team',
    tag: 'Our People',
    description: "A full team photograph taken outdoors beside the compound's boundary wall."
  }
];
