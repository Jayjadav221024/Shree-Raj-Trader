export const companyInfo = {
  name: "Shree Raj Traders",
  tagline: "Top Industrial Motors, Siemens Switchgears, FRP Gratings & Cable Tray Supplier",
  location: "Ahmedabad, Gujarat, India",
  experienceYears: "25+",
  phone: "+91 98250 12345 / +91 79 2658 9999",
  email: "info@shreerajtraders.in",
  address: "Plot No. 42, GIDC Industrial Estate, Odhav / Changodar, Ahmedabad - 382415, Gujarat, India",
  operatingHours: "Mon - Sat: 9:00 AM - 7:00 PM",
  about: "Welcome to Shree Raj Traders – a trusted Siemens switchgear supplier in Ahmedabad and authorized channel partner for industrial motors, gearboxes, switchgears, and FRP cable trays and gratings. We deliver high-efficiency, reliable engineering products backed by expert technical support across Gujarat and India."
};

export const authorizedBrands = [
  {
    id: "siemens",
    name: "SIEMENS",
    tagline: "Global Powerhouse in Electrical & Automation",
    category: "Switchgear, Motors, Drives",
    logo: "https://shreerajtraders.in/wp-content/uploads/2025/03/SIEMENS.png",
    color: "cyan",
    highlights: ["Low Voltage Switchgears", "IE3/IE4 Efficiency Motors", "SINNOVA Range", "ACB & MCCB Protection"]
  },
  {
    id: "crompton",
    name: "Crompton Greaves (CG Power)",
    tagline: "Pioneers in Industrial Electric Motors",
    category: "Motors, Alternators",
    logo: "https://shreerajtraders.in/wp-content/uploads/2025/05/Crompton-Power-Logo-1.png",
    color: "orange",
    highlights: ["Foot & Flange Mounted Motors", "Flameproof Motors", "Crane Duty Motors", "HV Motors"]
  },
  {
    id: "hindustan",
    name: "Hindustan Electric Motors",
    tagline: "Heavy Industrial High-Torque Solutions",
    category: "Electric Motors",
    logo: "https://shreerajtraders.in/wp-content/uploads/2025/03/HINDUSTAN-MOTORS.png",
    color: "emerald",
    highlights: ["3-Phase Induction Motors", "Brake Motors", "VFD Duty Motors", "Cast Iron Frames"]
  },
  {
    id: "innomotics",
    name: "Innomotics",
    tagline: "Next-Gen Motion & Motor Engineering",
    category: "High Power Drives & Motors",
    logo: "https://shreerajtraders.in/wp-content/uploads/2025/03/INNOMOTICS.png",
    color: "purple",
    highlights: ["High Voltage Motors", "Medium Voltage Drives", "Industrial Digitalization", "Severe Duty Motors"]
  },
  {
    id: "rotomotive",
    name: "Rotomotive",
    tagline: "Precision Italian-Engineered Drives & Motors",
    category: "Gear Motors & Automation",
    logo: "https://shreerajtraders.in/wp-content/uploads/2025/03/ROTOMOTIVE.png",
    color: "blue",
    highlights: ["Helical Gearboxes", "Worm Gearboxes", "Compact Drives", "Custom Drive Systems"]
  }
];

export const productCategories = [
  {
    id: "motors",
    title: "Industrial Electric Motors",
    badge: "High Efficiency IE3/IE4",
    image: "https://shreerajtraders.in/wp-content/uploads/2025/02/Motors.jpg",
    description: "Advanced 3-phase induction electric motors engineered for maximum uptime, high torque performance, and low energy consumption.",
    items: [
      {
        name: "Siemens IE3/IE4 Super Premium Motor",
        brand: "Siemens",
        powerRange: "0.37 kW to 375 kW (0.5 HP to 500 HP)",
        speedRPM: "750 / 1000 / 1500 / 3000 RPM",
        voltage: "415V ±10%, 50Hz",
        enclosure: "IP55 / IP56 / IP66 Cast Iron",
        rating: "4.9/5",
        features: ["Low vibration & noise level", "Class H Insulation with F temp rise", "Suitable for VFD operations", "Heavy duty dual shield bearings"],
        applications: "Pumps, Compressors, Fans, Blowers, Crushers, Conveyors"
      },
      {
        name: "Crompton Greaves Flameproof Motor",
        brand: "Crompton Greaves",
        powerRange: "0.75 kW to 250 kW",
        speedRPM: "1000 / 1500 / 3000 RPM",
        voltage: "415V / 690V",
        enclosure: "Ex-d Flameproof (Gas Group I, IIA, IIB, IIC)",
        rating: "4.8/5",
        features: ["CIMFR & PESO Certified", "Cast Iron robust enclosure", "High starting torque capability", "Hazardous area compliant"],
        applications: "Chemical Refineries, Oil & Gas, Pharma Plants, Paint Industries"
      },
      {
        name: "Hindustan Electric Heavy-Duty Motor",
        brand: "Hindustan Electric",
        powerRange: "0.5 HP to 350 HP",
        speedRPM: "750 to 3000 RPM",
        voltage: "415V 3-Phase",
        enclosure: "IP55 Cast Iron Frame",
        rating: "4.7/5",
        features: ["100% Copper Winding", "Thermal overload protection", "Dyno balanced rotor", "Dual frequency 50Hz/60Hz"],
        applications: "Textile Mills, Cement Works, Steel Rolling Mills, Paper Mills"
      }
    ]
  },
  {
    id: "switchgears",
    title: "Siemens Power Distribution & Switchgears",
    badge: "Siemens LV Distribution",
    image: "https://shreerajtraders.in/wp-content/uploads/2025/02/Switchgears.jpg",
    description: "State-of-the-art Siemens low voltage switchgears, air circuit breakers (ACB), molded case circuit breakers (MCCB), and Sinnova control devices.",
    items: [
      {
        name: "Siemens Low Voltage Power Distribution Product (ACB / MCCB)",
        brand: "Siemens",
        currentRating: "63A to 6300A",
        breakingCapacity: "36kA to 100kA",
        type: "3 Pole / 4 Pole Air Circuit Breaker & Molded Case",
        standard: "IEC 60947-2 / IS 13947",
        rating: "5.0/5",
        features: ["Microprocessor electronic trip units", "Integrated energy metering & communication", "Compact ergonomic casing", "High short-time withstand current"],
        applications: "Main Power Distribution Boards, Industrial Control Centers, Commercial Towers"
      },
      {
        name: "Siemens Low Voltage Control Product (Contactors & Overload Relays)",
        brand: "Siemens",
        currentRating: "9A to 820A (AC-3 rating)",
        controlVoltage: "24V DC / 110V AC / 230V AC / 415V AC",
        features: ["Bi-metallic & Solid state trip units", "Auxiliary contact blocks option", "High switching frequency durability", "DIN Rail & Base mounting"],
        applications: "Direct-On-Line Starters, Star-Delta Panels, VFD Bypass Circuits"
      },
      {
        name: "Siemens MCB & RCCB (5SL & 5SY Series)",
        brand: "Siemens",
        currentRating: "0.5A to 63A",
        trippingCurve: "B, C, D Curves",
        breakingCap: "10kA / 15kA",
        features: ["Patented finger-touch safe terminals", "ISI marked & CE compliant", "Low power dissipation loss"],
        applications: "Residential, Commercial & Heavy Industrial Distribution Boards"
      },
      {
        name: "Siemens Sinnova Wiring & Protection System",
        brand: "Siemens",
        currentRating: "6A to 125A",
        features: ["Sleek design modular switches", "Heavy duty industrial sockets", "Surge arresters"],
        applications: "Control Panels, Machinery Enclosures, Automation Racks"
      }
    ]
  },
  {
    id: "frp-gratings",
    title: "FRP Molded Gratings & Covers",
    badge: "Corrosion Proof & Light Weight",
    image: "https://shreerajtraders.in/wp-content/uploads/2025/02/FRP.jpg",
    description: "Fiber Reinforced Polymer (FRP) molded gratings engineered for high strength-to-weight ratio, anti-slip surface, and extreme chemical resistance.",
    items: [
      {
        name: "Meniscus Top FRP Grating",
        type: "Molded Mesh Panel",
        thickness: "25mm / 30mm / 38mm / 50mm",
        surfaceFinish: "Concave Meniscus Anti-Slip",
        resinType: "Isophthalic Polyester / Vinyl Ester",
        rating: "4.9/5",
        features: ["Naturally anti-skid concave ridge", "Non-conductive dielectric electrical safety", "Zero rusting or corrosion maintenance", "UV resistant top layer"],
        applications: "Chemical Walkways, Offshore Rigs, Wastewater Treatment Plants"
      },
      {
        name: "Grit Top FRP Grating",
        type: "Heavy Anti-Skid Mesh",
        thickness: "30mm / 38mm / 50mm",
        surfaceFinish: "Embedded Quartz Grit Coating",
        resinType: "Vinyl Ester Corrosion Grade",
        rating: "5.0/5",
        features: ["Maximum friction coefficient (COF > 0.8)", "Extreme slip prevention in oil/water environments", "Flame retardant ASTM E84 Class 1"],
        applications: "Oil Refineries, Marine Decks, Washdown Bays, Platforms"
      },
      {
        name: "Checkered Solid Covered FRP Plate",
        type: "Solid FRP Plate Cover",
        thickness: "3mm / 5mm FRP Cover over 38mm Grating",
        surfaceFinish: "Diamond Pattern Checkered",
        rating: "4.8/5",
        features: ["Prevents drop of small object/tools", "Odor control sealing for tanks", "High point load deflection resistance"],
        applications: "Sewerage Covers, Cable Trench Covers, Odor Sealing Platforms"
      }
    ]
  },
  {
    id: "frp-cable-trays",
    title: "FRP Cable Trays (Ladder & Perforated)",
    badge: "Non-Corrosive Electrical Support",
    image: "https://shreerajtraders.in/wp-content/uploads/2025/02/FRP-CABLE-TRAY.png",
    description: "Pultruded FRP Ladder & Perforated cable management systems designed to withstand aggressive acidic/alkaline outdoor industrial atmospheres.",
    items: [
      {
        name: "Pultruded FRP Ladder Type Cable Tray",
        widthRange: "150mm to 1000mm",
        heightSideRail: "50mm / 75mm / 100mm / 150mm",
        rungSpacing: "250mm / 300mm",
        resin: "Fire Retardant Isophthalic Polyester",
        rating: "4.9/5",
        features: ["High load bearing capacity (up to 200 kg/m)", "Complete accessories (Bends, Tees, Reducers)", "Non-magnetic & electromagnetic transparent"],
        applications: "Substations, Power Plants, Chemical Plants, Coastal Projects"
      },
      {
        name: "FRP Perforated Type Cable Tray",
        widthRange: "50mm to 600mm",
        depth: "25mm to 100mm",
        perforation: "Precision staggered ventilation holes",
        rating: "4.8/5",
        features: ["Smooth edges to prevent cable sheath damage", "Uniform heat dispersion for control cables", "Pre-drilled splice plate joints"],
        applications: "Instrumentation Wiring, Control Room Cables, Solar Power Plants"
      }
    ]
  },
  {
    id: "gearboxes",
    title: "Heavy Duty Gearboxes & Drives",
    badge: "High Torque Transmission",
    image: "https://shreerajtraders.in/wp-content/uploads/2025/03/gear-box.png",
    description: "Robust industrial gearboxes offering smooth torque transfer, low backlash, and customizable speed ratios for heavy-duty industrial machinery.",
    items: [
      {
        name: "Helical & Bevel Helical Gearbox",
        brand: "Rotomotive / Siemens",
        ratioRange: "1.5:1 to 500:1",
        torqueCapacity: "Up to 50,000 Nm",
        rating: "4.9/5",
        features: ["Hardened & ground helical gears", "High power density design", "Synthetic lube pre-filled option"],
        applications: "Agitators, Elevators, Extruders, Conveyors, Mixers"
      },
      {
        name: "Worm & Planetary Drive Units",
        brand: "Rotomotive",
        ratioRange: "7.5:1 to 100:1",
        features: ["Aluminum alloy lightweight body", "Universal mounting configurations", "Self-locking gear mechanism"],
        applications: "Packaging Machinery, Material Handling, Automatic Doors"
      }
    ]
  }
];

export const domains = [
  {
    title: "Engineering Solutions",
    icon: "Cpu",
    description: "Delivering prompt, custom-tailored industrial motor & switchgear solutions with dedicated technical support to minimize operational downtime."
  },
  {
    title: "Infrastructure Excellence",
    icon: "Building2",
    description: "Developing robust electrical & composite infrastructure linkages that boost regional industrial productivity across Gujarat."
  },
  {
    title: "Technical Workforce",
    icon: "Users",
    description: "Comprehensive engineering staffing & technical advisory network ensuring you get expert guidance during installation & maintenance."
  },
  {
    title: "Environmental Responsibility",
    icon: "Leaf",
    description: "Promoting energy-efficient IE3/IE4 electric motors and recyclable, non-polluting FRP solutions supporting industrial sustainability."
  },
  {
    title: "Electrical Distribution",
    icon: "Zap",
    description: "Offering Siemens LV switchgears, ACB, MCCB, and MCB products with fast turn-around and genuine factory warranty."
  },
  {
    title: "Logistics Network",
    icon: "Truck",
    description: "Robust distribution network ensuring prompt on-site delivery of heavy equipment across Ahmedabad, Vadodara, Surat, Rajkot, and Pan-India."
  }
];

export const groupCompanies = [
  {
    name: "Shree Raj Traders",
    role: "Authorized Motors & Switchgear Supplier",
    location: "Ahmedabad, Gujarat"
  },
  {
    name: "TransPower Technologies",
    role: "Power Automation & Turnkey Electricals",
    location: "Gujarat, India"
  },
  {
    name: "Raj Composites & FRP",
    role: "FRP Gratings & Cable Tray Manufacturing",
    location: "GIDC Industrial Zone, Gujarat"
  }
];

export const statsCounter = [
  { value: "25+", label: "Years Experience" },
  { value: "5000+", label: "Projects Supplied" },
  { value: "100%", label: "Genuine Siemens & CG Products" },
  { value: "50+", label: "Expert Support Engineers" }
];

export const faqs = [
  {
    q: "Are you an authorized Siemens switchgear supplier in Ahmedabad?",
    a: "Yes! Shree Raj Traders is an authorized supplier and channel partner for Siemens low voltage switchgears, circuit breakers (ACB, MCCB), contactors, MCBs, and industrial electric motors in Ahmedabad and across Gujarat."
  },
  {
    q: "What brands of electric motors do you stock?",
    a: "We offer top industrial electric motor brands including Siemens, Crompton Greaves (CG Power), Hindustan Electric Motors, Innomotics, and Rotomotive gear motors ranging from 0.5 HP up to 500 HP."
  },
  {
    q: "Why should we choose FRP Gratings over steel gratings?",
    a: "FRP (Fiberglass Reinforced Polymer) Gratings are 100% corrosion resistant, non-conductive (electrically safe), lightweight, UV stable, and require zero painting or rust maintenance, offering lower lifetime cost."
  },
  {
    q: "Can I get an instant price quotation for bulk industrial orders?",
    a: "Absolutely. Use our Smart RFQ Calculator on this website or call us directly at +91 98250 12345. Our engineering sales team will dispatch a formal quotation within 2 hours."
  }
];
