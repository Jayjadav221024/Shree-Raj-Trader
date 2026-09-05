// =============================================================================
// EDITABLE SECTION COPY
// =============================================================================
// Headings, eyebrows, button labels and intro paragraphs that used to be typed
// straight into the JSX. They live here so the Website Editor
// (/admin/website/editor) can change them without a developer touching code.
//
// HOW IT WORKS
//   * These objects are the built-in defaults — what the site shows when nobody
//     has edited anything.
//   * On boot the site fetches /public/site-content and `applySiteContent`
//     (see ../lib/siteContent.jsx) copies any saved overrides INTO these same
//     objects, in place. Components keep reading `copy['home.hero'].eyebrow`
//     and simply see the new value.
//   * Because the merge is in place, the object identities below must stay
//     stable — never reassign `copy['home.hero'] = {...}`.
//
// ADDING A NEW EDITABLE STRING
//   1. add the key here with its current text,
//   2. read it in the component instead of the literal,
//   3. list it in ../data/sectionRegistry.js so it appears in the editor.
// =============================================================================

export const copy = {
  // ---------------------------------------------------------------------------
  // SEARCH ENGINE LISTING (SEO)
  // ---------------------------------------------------------------------------
  // The title shown in the browser tab and in Google results, the description
  // underneath it, and the card that appears when a page is shared on WhatsApp,
  // LinkedIn or Facebook. Every page has an entry; `{placeholders}` are filled in
  // from the record being viewed.
  // ---------------------------------------------------------------------------
  'seo.global': {
    siteName: 'Shree Raj Traders',
    fallbackTitle: 'Siemens Switchgear & Motors | Shree Raj Traders',
    fallbackDescription:
      'Authorized distributor for Siemens, CGL & HEM motors, switchgears & FRP cable trays in Ahmedabad, Gujarat. 10,000+ verified industrial SKUs in stock.',
    shareImage: 'logo-mini',
    shareImageAlt: 'Shree Raj Traders logo'
  },

  'seo.home': {
    title: 'Siemens Switchgear & Motors | Shree Raj Traders',
    description:
      'Authorized distributor for Siemens, CGL & HEM motors, switchgears & FRP cable trays in Ahmedabad, Gujarat. 10,000+ verified industrial SKUs in stock.'
  },

  'seo.about': {
    title: 'Industrial Electro-Mechanical Supplier | Shree Raj Traders',
    description:
      'Authorized distributor of Siemens, CGL & HEM motors & switchgears in Ahmedabad, Gujarat. Over six decades of engineering supply trust.'
  },

  'seo.products': {
    title: 'Industrial Products Catalog | Shree Raj Traders',
    categoryTitle: '{category} Catalog | Shree Raj Traders',
    description:
      'Authorized supplier of Siemens low-voltage switchgears, CGL & HEM motors, Rotomotive gearboxes, and FRP cable trays across Gujarat.'
  },

  'seo.product-detail': {
    title: '{product} Specs & Details',
    description:
      'Get technical specifications, applications, and direct RFQ pricing options for {product} from Shree Raj Traders.'
  },

  'seo.contact': {
    title: 'Contact Us - Request a Custom RFQ Quote',
    description:
      'Get in touch with Shree Raj Traders in Ahmedabad, Gujarat. Request datasheets, custom product pricing, or technical support for motors, switchgears, and FRP solutions.'
  },

  'seo.blog': {
    title: 'Blog - Switchgear, Motor & FRP Insights',
    description:
      'Technical guidance on switchgears, industrial motors, FRP gratings and cable trays from the Shree Raj Traders engineering team.'
  },

  'seo.blog-post': {
    title: '{article}',
    description: 'Read our article: {article}. {excerpt}'
  },

  'seo.career': {
    title: 'Careers at Shree Raj Traders',
    description:
      'Current openings at Shree Raj Traders in Ahmedabad, Gujarat. Join a six-decade-old electro-mechanical distribution business supplying Siemens, CGL and Hindustan Electric Motors.'
  },

  'seo.gallery': {
    title: 'Facility Gallery - Inside Shree Raj Traders',
    description:
      'A photographic tour of the Shree Raj Traders stores and warehouse in Vatva, Ahmedabad, and the team who run them.'
  },

  'seo.locations': {
    title: 'Our Service Locations - Gujarat Industrial Network',
    description:
      'Shree Raj Traders supplies premium Siemens switchgears, CGL & Hindustan electric motors, and FRP composite solutions to major industrial hubs and cities across Gujarat.'
  },

  'seo.city': {
    title: 'Siemens Switchgears & Motors Supplier in {city}',
    description:
      'Authorized distributor of Siemens low-voltage switchgears, CGL and Hindustan electric motors, FRP gratings and cable trays in {city}, {district}, Gujarat.'
  },

  // ---------------------------------------------------------------------------
  // GLOBAL — shown on every page
  // ---------------------------------------------------------------------------
  'global.navbar': {
    wordmarkPrimary: 'SHREE RAJ',
    wordmarkAccent: 'TRADERS',
    wordmarkSub: 'Siemens · CGL · Hindustan',
    navHome: 'Home',
    navAbout: 'About Us',
    navGallery: 'Gallery',
    navProducts: 'Products',
    navLocations: 'Locations',
    navBlog: 'Blogs',
    navContact: 'Contact Us',
    ctaQuote: 'Get Quote',
    productGroups: [
      { key: 'switchgears', label: 'Switchgears' },
      { key: 'motors', label: 'Motors' },
      { key: 'gearbox', label: 'Gear Box' },
      { key: 'gratings', label: 'FRP Gratings' },
      { key: 'trays', label: 'FRP Cable Tray' }
    ]
  },

  'global.footer': {
    wordmarkPrimary: 'SHREE RAJ',
    wordmarkAccent: 'TRADERS',
    logoAlt: 'Shree Raj Traders',
    blurb:
      'Authorized Channel Partner for Siemens, CGL, HEM, and Rotomotive. Delivering genuine electro-mechanical switchgears, industrial motors, gearboxes, and FRP composite solutions for over six decades.',
    badges: [
      { label: '60+ Years Trust' },
      { label: 'Authorized Partner' },
      { label: 'Pan-India Supply' }
    ],
    quickLinksHeading: 'Quick Links',
    quickLinks: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about-us/' },
      { label: 'Products', href: '/products/' },
      { label: 'Locations', href: '/locations/' },
      { label: 'Gallery', href: '/gallery/' },
      { label: 'Blog', href: '/blog/' },
      { label: 'Contact', href: '/contact/' }
    ],
    productsHeading: 'Product Solutions',
    productLinks: [
      { label: 'Siemens Switchgears', href: '/products/switchgears' },
      { label: 'Industrial Motors', href: '/products/motors' },
      { label: 'Industrial Gearboxes', href: '/products/gearbox' },
      { label: 'FRP Gratings', href: '/products/gratings' },
      { label: 'FRP Cable Trays', href: '/products/trays' },
      { label: 'Sinnova Range', href: '/product/sinnova' }
    ],
    contactHeading: 'Direct Contact',
    addressShort: '39, Mahalaxmi Industrial Estate, Vatva, Phase 1, Ahmedabad, Gujarat',
    groupHeading: 'Sister Companies & Network',
    // {year} is replaced with the current year when the page renders.
    copyright: '© {year} Shree Raj Traders · All Rights Reserved · Authorized Industrial Distributor',
    backToTop: 'Back to Top'
  },

  // ---------------------------------------------------------------------------
  // HOME
  // ---------------------------------------------------------------------------
  'home.hero': {
    backgroundText: 'SHREE RAJ',
    eyebrow: 'Authorized Channel Partner · Over Six Decades',
    headingLine1: 'Switchgears, Cables &',
    headingLine3: 'For Indian Industry',
    ctaPrimary: 'Request a Quote',
    productPills: [
      {
        label: 'Motors',
        spec: '0.5 HP - 425 HP',
        imageKey: 'cat-motors',
        imageAlt: 'Motors range supplied by Shree Raj Traders'
      },
      {
        label: 'Switchgears',
        spec: 'MCCB 16A - 1250A',
        imageKey: 'cat-switchgears',
        imageAlt: 'Switchgears range supplied by Shree Raj Traders'
      },
      {
        label: 'FRP Gratings',
        spec: 'Mesh 3838',
        imageKey: 'cat-frp-gratings',
        imageAlt: 'FRP Gratings range supplied by Shree Raj Traders'
      },
      {
        label: 'FRP Cable Tray',
        spec: 'Fire-Retardant',
        imageKey: 'cat-frp-cable-tray',
        imageAlt: 'FRP Cable Tray range supplied by Shree Raj Traders'
      }
    ]
  },

  'home.featured-categories': {
    eyebrow: 'Product Portfolio',
    title: 'Featured',
    titleAccent: 'Product Categories',
    intro:
      'Explore our comprehensive range of high-performance electro-mechanical equipment and composite infrastructure solutions.'
  },

  'home.brands': {
    eyebrow: 'Our Brand Partners',
    title: 'Our',
    titleAccent: 'Brand Partners',
    intro:
      'We supply genuine products from leading manufacturers of motors, switchgears and power transmission equipment.',
    viewLabel: 'View Products',
    highlightsAuthorizedLabel: 'Authorized Highlights',
    highlightsGenericLabel: 'Product Highlights'
  },

  'home.domains': {
    eyebrow: 'What We Do',
    title: 'Our Operational',
    titleAccent: 'Domains',
    intro:
      'Engineering, infrastructure, electrical distribution and logistics support for industries across Gujarat and India.'
  },

  'home.group-companies': {
    eyebrow: 'Synergistic Group Alliance',
    title: 'Transpower Group &',
    titleAccent: 'Sister Companies'
  },

  'home.testimonials': {
    eyebrow: 'IN THEIR WORDS',
    title: 'THE LINES THAT',
    titleAccent: 'MOVED THE ROOM',
    intro:
      'Trusted by leading manufacturing facilities, infrastructure developers, and industrial plants across India.'
  },

  'home.clients': {
    eyebrow: 'Trusted Across Industries',
    title: 'Our Reputed',
    titleAccent: 'Clients'
  },

  'home.journey': {
    eyebrow: 'Group Milestones',
    title: 'Our',
    titleAccent: 'Journey',
    intro:
      'Over six decades of growth, engineering excellence, and expanding regional industrial networks across Ahmedabad, Gujarat, and Pan-India.'
  },

  // ---------------------------------------------------------------------------
  // ABOUT US
  // ---------------------------------------------------------------------------
  'about.intro': {
    eyebrow: 'Six Decades in the Electro-Mechanical Industry',
    title: 'About',
    titleAccent: 'Shree Raj Traders',
    photoAlt: 'Shree Raj Traders warehouse and stock at the Vatva, Ahmedabad facility'
  },

  'about.vision-mission': {
    visionTitle: 'Our Vision',
    missionTitle: 'Our Mission'
  },

  'about.group-tagline': {
    quote:
      'Shree Raj Traders Group promotes & creates innovative products & solutions for a better life'
  },

  'about.team': {
    eyebrow: 'The People Behind Shree Raj',
    title: 'Our',
    titleAccent: 'Team'
  },

  'about.journey': {
    eyebrow: 'Group Milestones',
    title: 'Our',
    titleAccent: 'Journey',
    intro:
      'Over six decades of growth, strategic acquisitions, and diversification across the engineering, infrastructure, electrical automation and composite industrial landscapes of India.'
  },

  // ---------------------------------------------------------------------------
  // PRODUCTS
  // ---------------------------------------------------------------------------
  'products.header': {
    title: 'Industrial Catalog',
    intro:
      'Browse our complete inventory of Siemens switchgears, Crompton Greaves induction motors, and custom composite FRP gratings and cable trays.',
    allTabLabel: 'All Products'
  },

  // ---------------------------------------------------------------------------
  // CONTACT
  // ---------------------------------------------------------------------------
  'contact.header': {
    eyebrow: 'Get in Touch',
    title: 'Contact',
    titleAccent: 'Shree Raj Traders',
    intro:
      'Visit our office or get in touch for product selection advice, datasheets and quotations.'
  },

  'contact.head-office': {
    heading: 'Head Office',
    addressLabel: 'Address',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    mapsButton: 'Open in Google Maps'
  },

  'contact.form': {
    heading: 'Send a Message',
    nameLabel: 'Full Name *',
    phoneLabel: 'Phone *',
    emailLabel: 'Email Address *',
    subjectLabel: 'Product of Interest',
    messageLabel: 'Requirements / Specs / RFQ Details *',
    submitLabel: 'Send Inquiry',
    successMessage:
      'Thank you. Our sales engineers will review your request and get back to you shortly.',
    subjects: [
      { label: 'Motors' },
      { label: 'Switchgears' },
      { label: 'FRP Gratings' },
      { label: 'FRP Cable Tray' },
      { label: 'General Technical Support' }
    ]
  },

  'contact.group-offices': {
    eyebrow: 'Our Associate Network',
    title: 'Group',
    titleAccent: 'Offices',
    locationLabel: 'Location',
    divisionLabel: 'Division'
  },

  'contact.faqs': {
    eyebrow: 'Frequently Asked Questions',
    title: 'Common',
    titleAccent: 'Questions'
  },

  'contact.rfq': {
    eyebrow: 'Request for Quotation',
    title: 'Build Your',
    titleAccent: 'Enquiry',
    intro:
      'Select your requirement below and send it to our sales team by WhatsApp, or copy the summary into an email.',
    categories: [
      { id: 'motor', label: 'Motors' },
      { id: 'switchgear', label: 'Switchgears' },
      { id: 'frp', label: 'FRP Grating / Tray' }
    ]
  },

  // ---------------------------------------------------------------------------
  // BLOG
  // ---------------------------------------------------------------------------
  'blog.header': {
    eyebrow: 'Insights & Guides',
    titleAccent: 'Blog',
    intro:
      'Technical guidance on switchgears, industrial motors, FRP gratings and cable trays.'
  },

  // ---------------------------------------------------------------------------
  // SINGLE PRODUCT PAGE (/product/:slug)
  // {product} is replaced with the product name when the page renders.
  // ---------------------------------------------------------------------------
  'products.detail': {
    backToCatalog: 'Back to Catalog',
    specificationsTitle: 'Product Specifications',
    featuresTitle: 'Product Features',
    quoteButton: 'Get Custom Quote for {product}',
    notFoundTitle: 'Product Not Found',
    notFoundCta: 'Back to Products'
  },

  // ---------------------------------------------------------------------------
  // SINGLE ARTICLE PAGE (/blog/:slug/)
  // ---------------------------------------------------------------------------
  'blog.post': {
    backToBlog: 'All Articles',
    notFoundTitle: 'Article Not Found',
    notFoundCta: 'Back to Blog'
  },

  // ---------------------------------------------------------------------------
  // CAREERS (/career/)
  // ---------------------------------------------------------------------------
  // This page is deliberately NOT linked from the site navigation or footer.
  // It is reachable only by typing the address or by a link shared directly with
  // a candidate. Everything on it is edited from the admin panel.
  // ---------------------------------------------------------------------------
  'career.hero': {
    eyebrow: 'Life @ Shree Raj Traders',
    title: 'Build Your Career With',
    titleAccent: 'Shree Raj Traders',
    intro:
      'At the heart of every extraordinary change is a great human. Come be a part of our exceptional team, bring your ideas, and help us grow an enterprise built over six decades.',
    ctaLabel: 'See open roles',
    statsLabel: 'Open positions right now'
  },

  'career.why-join': {
    eyebrow: 'Why Join Us',
    title: 'What You Get',
    titleAccent: 'Working Here',
    intro:
      'A stable, established business with the pace and responsibility of a much smaller team.',
    items: [
      {
        title: 'Six Decades of Stability',
        description:
          'An established name in the electro-mechanical industry with a long-standing client base across Gujarat and India.'
      },
      {
        title: 'Real Technical Depth',
        description:
          'Work hands-on with Siemens, Crompton Greaves and Hindustan Electric products, and learn the engineering behind them.'
      },
      {
        title: 'Room to Own Your Work',
        description:
          'A small, close team where your decisions visibly affect how the business runs — no layers to hide behind.'
      },
      {
        title: 'Group Opportunities',
        description:
          'Scope to move across our group of companies spanning distribution, technology and power automation.'
      }
    ]
  },

  'career.openings': {
    eyebrow: 'Current Vacancies',
    title: 'Open',
    titleAccent: 'Positions',
    intro: 'Apply directly below. We read every application.',
    applyLabel: 'Apply for this role',
    responsibilitiesLabel: 'What you will do',
    requirementsLabel: 'What we are looking for',
    emptyTitle: 'No open positions right now',
    emptyBody:
      'We are not actively hiring at the moment, but we always want to hear from good people. Send us your details below and we will keep them on file.'
  },

  'career.form': {
    eyebrow: 'Apply Now',
    title: 'Send Us Your',
    titleAccent: 'Application',
    intro: 'Fill in your details and attach your CV. We will get back to you if there is a fit.',
    nameLabel: 'Full Name *',
    emailLabel: 'Email Address *',
    phoneLabel: 'Phone Number *',
    positionLabel: 'Position Applying For',
    positionPlaceholder: 'General application',
    experienceLabel: 'Years of Experience',
    messageLabel: 'Tell us about yourself',
    resumeLabel: 'Attach your CV',
    resumeHint: 'PDF or Word document, up to 5 MB.',
    submitLabel: 'Submit Application',
    successMessage:
      'Thank you. Your application has been received — our team will review it and get in touch if there is a match.',
    errorMessage: 'Something went wrong sending your application. Please try again, or email us your CV.'
  },

  'career.contact': {
    heading: 'Prefer to email us?',
    body: 'Send your CV directly to our HR inbox and mention the role you are interested in.',
    emailLabel: 'Email your CV to'
  },

  // ---------------------------------------------------------------------------
  // GALLERY
  // ---------------------------------------------------------------------------
  'gallery.header': {
    eyebrow: 'Inside Shree Raj Traders',
    title: 'FACILITY',
    titleAccent: 'GALLERY',
    hint: 'Use Mouse Scroll, Trackpad, Swipe, Arrow Keys, or Controls below to turn book pages.'
  },

  'gallery.book': {
    coverEyebrow: 'Facility Tour',
    coverTitleLine1: 'SHREE RAJ',
    coverTitleLine2: 'TRADERS',
    coverLocation: 'Ahmedabad, Gujarat',
    coverStatValue: '10,000+',
    coverStatLabel: 'SKUs in Stock',
    coverScrollHint: 'Scroll Down to Open Book ↓',
    introBadge: 'Welcome',
    introTitle: 'INSIDE SHREE RAJ TRADERS',
    introBody1:
      'A look at how we work in Vatva, Ahmedabad — the stores and the warehouse floor, and the people who run them.',
    introBody2:
      'As authorized channel partners for Siemens, Crompton Greaves (CGL), and Hindustan Electric Motors, our warehouses store and manage over 10,000 SKUs to minimize operational downtime for clients.',
    introBody3:
      'Turn the pages to see stock control, materials handling and day-to-day coordination — and to meet the team behind every order.',
    outroBadge: 'Tour Complete',
    outroTitle: 'THANK YOU',
    outroBody:
      'Shree Raj Traders is committed to providing industry-leading electromechanical products and logistics support across India.',
    outroHotlineLabel: 'Sales Hotline:',
    outroEmailLabel: 'Email:',
    outroAddressLabel: 'Address:',
    outroAddress: '39, Mahalaxmi Industrial Estate, Vatva Phase 1, Ahmedabad',
    outroCtaProducts: 'Products Catalog',
    outroCtaContact: 'Contact Us',
    pageFooterLabel: 'FACILITY GALLERY',
    brandFooterLabel: 'SHREE RAJ TRADERS'
  },

  // ---------------------------------------------------------------------------
  // LOCATIONS
  // ---------------------------------------------------------------------------
  'locations.header': {
    eyebrow: 'Industrial Supply Network',
    title: 'Our Service',
    titleAccent: 'Locations',
    intro:
      'Supplying premium motors, switchgears, and FRP solutions across major industrial districts in Gujarat.',
    cardCta: 'View details'
  },

  // ---------------------------------------------------------------------------
  // CITY LANDING PAGE (/locations/:city/)
  // Text containing {city} or {district} has the city name substituted in when
  // the page renders — keep those placeholders in place.
  // ---------------------------------------------------------------------------
  'city.page': {
    backLink: 'Back to Locations',
    heroEyebrow: 'Industrial Solutions Hub',
    heroTitle: 'Siemens Switchgears & Motors Supplier in',
    heroIntro:
      'Authorized distribution & technical supply channel network serving the manufacturing hubs and industrial zones of {district}, Gujarat.',
    ctaRfq: 'Request Custom RFQ',
    ctaCatalog: 'View Products Catalog',
    brandsStripLabel: 'Supplying Genuine Products From Trusted Global Brands',
    infoBadge: 'Authorized Supply Channel',
    infoTitle: 'Delivering Engineered Excellence to {city}',
    infoSubtitle:
      'Serving Industrial Areas, Manufacturing Plants & Engineering Contractors in {city}.',
    infoBodyHtml:
      '<p>Shree Raj Traders is your premier source for industrial components and engineering solutions. As a trusted supplier, we deliver highly reliable electro-mechanical equipment directly to companies, manufacturing facilities, and workshops operating across <strong>{city}</strong> and the surrounding industrial zones in <strong>{district}</strong>. Our service catalog features a broad range of products designed to handle heavy industrial requirements while maintaining top energy efficiency ratings.</p><p>We supply authentic <strong>Siemens low voltage switchgears</strong>, contactors (available in frame sizes S00 to S12 supporting operational currents from 7A to 500A), overload relays, and Molded Case Circuit Breakers (MCCBs). In addition to switchgears, we stock and distribute high-efficiency three-phase induction motors from leading brands such as <strong>Siemens</strong>, <strong>CGL (Crompton Greaves)</strong>, and <strong>Hindustan Electric Motors</strong>. Ranging from 0.5 HP to 425 HP, these motors comply with the latest standards, offering IE2, IE3, and IE4 efficiency classes for significant energy savings and operational reliability.</p><p>Furthermore, we are a major distributor of composite materials, including corrosion-resistant <strong>FRP gratings</strong> and <strong>FRP cable trays</strong> (including ladder type and perforated configurations).</p>',
    coverageTitle: 'Regional Coverage & Key Highlights',
    coverageIntro:
      'Our customized freight and logistics dispatch networks provide prompt, reliable service to various business zones and infrastructure sites within {city} and Gujarat:',
    coverageItems: [
      { label: 'Direct delivery to GIDC & SEZ zones' },
      { label: 'Technical consultation at project sites' },
      { label: 'Seamless supply chain linkages' },
      { label: 'Authorized warranty validation' }
    ],
    specsTitle: 'Industrial Portfolios & Specifications',
    specGroups: [
      {
        title: 'Switchgears',
        row1Label: 'Range',
        row1Value: '16A to 1250A',
        row2Label: 'Type',
        row2Value: 'ACB, MCCB, Contactors',
        row3Label: 'Standard',
        row3Value: 'IEC 60947'
      },
      {
        title: 'Electric Motors',
        row1Label: 'Capacity',
        row1Value: '0.5 HP to 425 HP',
        row2Label: 'Protection',
        row2Value: 'IP55 / IP56 / IP65',
        row3Label: 'Efficiency',
        row3Value: 'IE2 / IE3 / IE4'
      }
    ],
    sidebarEyebrow: 'Fast Dispatch',
    sidebarTitle: 'Get Pricing for {city}',
    sidebarIntro:
      'Request custom product pricing and freight rates directly for your infrastructure and maintenance requirements.',
    advantageEyebrow: 'The Shreeraj Advantage',
    advantageTitle: 'Why Choose Us in',
    advantageIntro:
      'Combining 6 decades of experience with brand reliability and rapid support channels.',
    advantageCards: [
      {
        title: '100% Genuine Brands',
        description:
          'Directly sourced from Siemens, Crompton Greaves, and Hindustan Electric Motors ensuring genuine products with warranty.'
      },
      {
        title: 'Reliable Logistics',
        description:
          'Dedicated transport channels handling heavy consignments and direct freight shipping to factories across {city}.'
      },
      {
        title: 'Technical Consultation',
        description:
          'Product engineering advisory assisting you with the selection of correct ratings, starters, gear ratios, and finishes.'
      },
      {
        title: '60+ Years Trust',
        description:
          'Backed by six decades of reputation in electro-mechanical trading, distribution, and custom solutions in Gujarat.'
      }
    ],
    faqEyebrow: 'Common Queries',
    faqTitle: 'Frequently Asked',
    faqTitleAccent: 'Questions',
    faqIntro:
      'Have questions about switchgear supply, logistics, or custom order estimates?',
    finalCtaBadge: 'Industrial Procurement partner',
    finalCtaTitle: 'Procure Premium Switchgear & Motors for your Project in',
    finalCtaIntro:
      'Get technical assistance on selection, quick pricing calculations, and fast logistics handling to your facility site.',
    finalCtaPrimary: 'Open Smart RFQ',
    finalCtaWhatsapp: 'Connect on WhatsApp',
    notFoundTitle: 'Location Not Found',
    notFoundCta: 'View All Locations'
  },

  'global.map-section': {
    eyebrow: 'Our Headquarters & Facility',
    title: 'Visit Our Facility in',
    titleAccent: 'Ahmedabad',
    subtitle:
      'Strategically located in Vatva GIDC Phase 1 with rapid logistics connectivity across Gujarat & Pan-India.',
    timingsLabel: 'Operating Hours',
    timingsValue: 'Monday – Saturday: 9:30 AM to 7:00 PM',
    supportNote: 'Direct warehouse pickup, technical inspection & express freight dispatch available.'
  }
};

export default copy;
