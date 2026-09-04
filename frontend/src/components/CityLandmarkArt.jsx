import React from 'react';

/**
 * 2D Architectural / Landmark Line-Art Vector Illustrations for Gujarat Cities & Industrial Hubs
 * Styled exactly like the clean architectural drawing line-art model in the reference image.
 */

export function CityLandmarkArt({ slug, className = "w-20 h-20", color = "currentColor", accentColor = "#d9653b" }) {
  const commonProps = {
    viewBox: "0 0 100 80",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: className,
    stroke: color,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  switch (slug) {
    case 'ahmedabad':
      // Sidi Saiyyed Jali / Teen Darwaza Inspired arches & minarets
      return (
        <svg {...commonProps}>
          {/* Base */}
          <line x1="8" y1="72" x2="92" y2="72" strokeWidth="2.2" />
          <line x1="12" y1="68" x2="88" y2="68" />
          {/* Main central arch */}
          <path d="M38 68 V42 C38 32 62 32 62 42 V68" />
          <path d="M44 68 V46 C44 40 56 40 56 46 V68" stroke={accentColor} />
          {/* Side arches */}
          <path d="M20 68 V48 C20 40 34 40 34 48 V68" />
          <path d="M66 68 V48 C66 40 80 40 80 48 V68" />
          {/* Minaret Left */}
          <rect x="14" y="24" width="6" height="44" />
          <path d="M13 24 H21 L17 14 Z" fill={accentColor} fillOpacity="0.15" />
          <line x1="17" y1="14" x2="17" y2="9" />
          {/* Minaret Right */}
          <rect x="80" y="24" width="6" height="44" />
          <path d="M79 24 H87 L83 14 Z" fill={accentColor} fillOpacity="0.15" />
          <line x1="83" y1="14" x2="83" y2="9" />
          {/* Dome & Jali details */}
          <path d="M42 34 C42 22 58 22 58 34" stroke={accentColor} />
          <circle cx="50" cy="24" r="1.5" fill={accentColor} />
          <line x1="50" y1="22" x2="50" y2="15" />
          {/* Geometric Jali grid marks */}
          <line x1="44" y1="52" x2="56" y2="52" strokeDasharray="1.5 2" />
          <line x1="44" y1="58" x2="56" y2="58" strokeDasharray="1.5 2" />
        </svg>
      );

    case 'vadodara':
      // Laxmi Vilas Palace Domes & Grand Towers
      return (
        <svg {...commonProps}>
          <line x1="6" y1="72" x2="94" y2="72" strokeWidth="2.2" />
          <rect x="12" y="48" width="76" height="20" />
          {/* Central Clock Tower */}
          <rect x="42" y="26" width="16" height="22" />
          <path d="M40 26 C40 14 60 14 60 26 Z" fill={accentColor} fillOpacity="0.15" />
          <line x1="50" y1="14" x2="50" y2="8" />
          <circle cx="50" cy="36" r="3" stroke={accentColor} />
          {/* Windows / Arches */}
          <path d="M46 48 V42 C46 39 54 39 54 42 V48" />
          <path d="M22 68 V56 C22 52 30 52 30 56 V68" />
          <path d="M70 68 V56 C70 52 78 52 78 56 V68" />
          {/* Left Dome */}
          <rect x="16" y="38" width="12" height="10" />
          <path d="M15 38 C15 28 29 28 29 38 Z" />
          <line x1="22" y1="28" x2="22" y2="22" />
          {/* Right Dome */}
          <rect x="72" y="38" width="12" height="10" />
          <path d="M71 38 C71 28 85 28 85 38 Z" />
          <line x1="78" y1="28" x2="78" y2="22" />
          {/* Balconies */}
          <line x1="14" y1="48" x2="30" y2="48" />
          <line x1="70" y1="48" x2="86" y2="48" />
        </svg>
      );

    case 'surat':
      // Surat Castle / Textile Diamond Hub & Modern Industrial Facade
      return (
        <svg {...commonProps}>
          <line x1="8" y1="72" x2="92" y2="72" strokeWidth="2.2" />
          {/* Fort Battlement Base */}
          <rect x="18" y="44" width="64" height="24" />
          {/* Castle Crenellations */}
          <path d="M18 44 V38 H24 V44 H30 V38 H36 V44 H64 V38 H70 V44 H76 V38 H82 V44" />
          {/* Watchtower Left */}
          <rect x="12" y="32" width="10" height="36" />
          <path d="M10 32 L17 22 L24 32 Z" fill={accentColor} fillOpacity="0.15" />
          {/* Watchtower Right */}
          <rect x="78" y="32" width="10" height="36" />
          <path d="M76 32 L83 22 L90 32 Z" fill={accentColor} fillOpacity="0.15" />
          {/* Diamond / Geometric Emblem over gate */}
          <path d="M50 20 L58 28 L50 36 L42 28 Z" stroke={accentColor} strokeWidth="1.6" fill={accentColor} fillOpacity="0.1" />
          {/* Main Gate */}
          <path d="M42 68 V50 C42 44 58 44 58 50 V68" />
          {/* Window slits */}
          <line x1="17" y1="42" x2="17" y2="48" stroke={accentColor} />
          <line x1="83" y1="42" x2="83" y2="48" stroke={accentColor} />
          <line x1="32" y1="54" x2="32" y2="60" />
          <line x1="68" y1="54" x2="68" y2="60" />
        </svg>
      );

    case 'rajkot':
      // Watson Museum / Traditional Saurashtra Heritage Gate
      return (
        <svg {...commonProps}>
          <line x1="8" y1="72" x2="92" y2="72" strokeWidth="2.2" />
          {/* Steps */}
          <line x1="14" y1="68" x2="86" y2="68" />
          <line x1="18" y1="64" x2="82" y2="64" />
          {/* Central Dome Structure */}
          <rect x="30" y="38" width="40" height="26" />
          <path d="M30 38 C30 20 70 20 70 38 Z" fill={accentColor} fillOpacity="0.15" />
          <line x1="50" y1="20" x2="50" y2="12" />
          <circle cx="50" cy="11" r="1.5" fill={accentColor} />
          {/* Pillars */}
          <line x1="36" y1="64" x2="36" y2="38" />
          <line x1="44" y1="64" x2="44" y2="38" />
          <line x1="56" y1="64" x2="56" y2="38" />
          <line x1="64" y1="64" x2="64" y2="38" />
          {/* Side pavilions */}
          <rect x="16" y="46" width="12" height="18" />
          <path d="M14 46 L22 34 L30 46 Z" />
          <rect x="72" y="46" width="12" height="18" />
          <path d="M70 46 L78 34 L86 46 Z" />
          {/* Arches on Center */}
          <path d="M46 64 V52 C46 48 54 48 54 52 V64" stroke={accentColor} />
        </svg>
      );

    case 'bharuch':
    case 'ankleshwar':
      // Golden Bridge on Narmada / Industrial Chemical & Engineering Towers
      return (
        <svg {...commonProps}>
          <line x1="6" y1="72" x2="94" y2="72" strokeWidth="2.2" />
          {/* Bridge Trusses / Industrial Framework */}
          <line x1="10" y1="56" x2="90" y2="56" strokeWidth="2" />
          <path d="M12 56 L24 32 L36 56 L48 32 L60 56 L72 32 L84 56" />
          <line x1="24" y1="32" x2="72" y2="32" stroke={accentColor} />
          {/* Bridge Pillars in Water */}
          <rect x="20" y="56" width="8" height="16" fill={accentColor} fillOpacity="0.1" />
          <rect x="44" y="56" width="8" height="16" fill={accentColor} fillOpacity="0.1" />
          <rect x="68" y="56" width="8" height="16" fill={accentColor} fillOpacity="0.1" />
          {/* Water wave ripples */}
          <path d="M8 74 Q 18 70, 28 74 T 48 74 T 68 74 T 88 74" strokeDasharray="3 3" />
          {/* Factory Plant / Refinery Silhouette */}
          <rect x="46" y="18" width="4" height="14" />
          <line x1="45" y1="18" x2="51" y2="18" />
          <rect x="70" y="14" width="4" height="18" stroke={accentColor} />
          <line x1="69" y1="14" x2="75" y2="14" stroke={accentColor} />
        </svg>
      );

    case 'anand':
      // Amul Dairy / Cooperative Milk Revolution Memorial Tower
      return (
        <svg {...commonProps}>
          <line x1="8" y1="72" x2="92" y2="72" strokeWidth="2.2" />
          {/* Modern Processing Building */}
          <rect x="14" y="46" width="44" height="22" />
          {/* Milk Silos / Industrial Storage */}
          <rect x="64" y="32" width="10" height="36" rx="2" stroke={accentColor} />
          <path d="M64 32 C64 26 74 26 74 32" stroke={accentColor} />
          <rect x="78" y="38" width="10" height="30" rx="2" stroke={accentColor} />
          <path d="M78 38 C78 32 88 32 88 38" stroke={accentColor} />
          {/* Modern Corporate Glass Facade & Tower */}
          <rect x="22" y="24" width="20" height="44" />
          <line x1="22" y1="16" x2="42" y2="24" stroke={accentColor} />
          <line x1="32" y1="12" x2="32" y2="6" stroke={accentColor} />
          {/* Grid windows */}
          <line x1="26" y1="32" x2="38" y2="32" strokeDasharray="1.5 2" />
          <line x1="26" y1="40" x2="38" y2="40" strokeDasharray="1.5 2" />
          <line x1="26" y1="48" x2="38" y2="48" strokeDasharray="1.5 2" />
          {/* Gate */}
          <path d="M46 68 V56 H54 V68" />
        </svg>
      );

    case 'vapi':
      // Industrial GIDC Gateway & Chemical Manufacturing Infrastructure
      return (
        <svg {...commonProps}>
          <line x1="8" y1="72" x2="92" y2="72" strokeWidth="2.2" />
          {/* Grand Industrial Arch / Gate */}
          <rect x="18" y="28" width="10" height="40" />
          <rect x="72" y="28" width="10" height="40" />
          <path d="M14 28 H86 V22 H14 Z" fill={accentColor} fillOpacity="0.15" />
          <path d="M28 42 C28 32 72 32 72 42" stroke={accentColor} strokeWidth="2" />
          {/* Industrial Plant inside */}
          <rect x="36" y="44" width="12" height="24" />
          <path d="M36 44 L42 36 L48 44 Z" />
          <rect x="52" y="40" width="12" height="28" stroke={accentColor} />
          <line x1="58" y1="40" x2="58" y2="28" stroke={accentColor} />
          {/* Gear / Mechanical Symbol in Gate */}
          <circle cx="50" cy="22" r="3" stroke={accentColor} />
          <line x1="50" y1="16" x2="50" y2="12" />
        </svg>
      );

    case 'godhra':
      // Stepwell Heritage & Traditional Stone Pavilion
      return (
        <svg {...commonProps}>
          <line x1="8" y1="72" x2="92" y2="72" strokeWidth="2.2" />
          {/* Multi-tiered Step Pavilion */}
          <rect x="22" y="52" width="56" height="16" />
          <rect x="28" y="38" width="44" height="14" />
          <rect x="36" y="26" width="28" height="12" />
          {/* Roof Pavilion */}
          <path d="M32 26 L50 14 L68 26 Z" fill={accentColor} fillOpacity="0.15" />
          <line x1="50" y1="14" x2="50" y2="8" stroke={accentColor} />
          {/* Pillars */}
          <line x1="28" y1="68" x2="28" y2="52" />
          <line x1="38" y1="68" x2="38" y2="38" />
          <line x1="50" y1="68" x2="50" y2="26" stroke={accentColor} />
          <line x1="62" y1="68" x2="62" y2="38" />
          <line x1="72" y1="68" x2="72" y2="52" />
          {/* Arches between pillars */}
          <path d="M42 52 C42 46 58 46 58 52" stroke={accentColor} />
        </svg>
      );

    case 'navsari':
      // Parsi Heritage Atash Behram / Fire Temple & Twin Palm Columns
      return (
        <svg {...commonProps}>
          <line x1="8" y1="72" x2="92" y2="72" strokeWidth="2.2" />
          <rect x="22" y="44" width="56" height="24" />
          {/* Classical Temple Pediment */}
          <path d="M18 44 L50 22 L82 44 Z" fill={accentColor} fillOpacity="0.15" />
          <circle cx="50" cy="34" r="4" stroke={accentColor} />
          {/* Eternal Urn / Flame Finial */}
          <path d="M47 22 C47 16 53 16 53 22 Z" fill={accentColor} />
          <line x1="50" y1="16" x2="50" y2="10" stroke={accentColor} />
          {/* Grand Pillars */}
          <line x1="30" y1="68" x2="30" y2="44" />
          <line x1="42" y1="68" x2="42" y2="44" />
          <line x1="58" y1="68" x2="58" y2="44" />
          <line x1="70" y1="68" x2="70" y2="44" />
          {/* Central Entrance */}
          <path d="M46 68 V54 C46 50 54 50 54 54 V68" stroke={accentColor} />
        </svg>
      );

    case 'bhuj':
      // Aina Mahal / Prag Mahal Italian Gothic Clock Tower & Kutch Heritage
      return (
        <svg {...commonProps}>
          <line x1="8" y1="72" x2="92" y2="72" strokeWidth="2.2" />
          {/* Palace Wing */}
          <rect x="14" y="46" width="40" height="22" />
          {/* Gothic Clock Tower */}
          <rect x="54" y="18" width="22" height="50" />
          {/* Steep Tower Spire */}
          <path d="M52 18 L65 4 L78 18 Z" fill={accentColor} fillOpacity="0.15" />
          <line x1="65" y1="4" x2="65" y2="1" stroke={accentColor} />
          {/* Tower Clock */}
          <circle cx="65" cy="28" r="4" stroke={accentColor} />
          <line x1="65" y1="26" x2="65" y2="28" />
          <line x1="65" y1="28" x2="67" y2="28" />
          {/* Jharokhas & Arches */}
          <path d="M22 58 V50 C22 46 30 46 30 50 V58" />
          <path d="M38 58 V50 C38 46 46 46 46 50 V58" />
          <path d="M58 54 V46 C58 42 72 42 72 46 V54" stroke={accentColor} />
          <rect x="80" y="52" width="10" height="16" />
          <path d="M78 52 L85 44 L92 52 Z" />
        </svg>
      );

    case 'amreli':
      // Gir Lion Sanctuary Gateway & Saurashtra Heritage Arch
      return (
        <svg {...commonProps}>
          <line x1="8" y1="72" x2="92" y2="72" strokeWidth="2.2" />
          {/* Royal Heritage Gate Arch */}
          <path d="M24 68 V38 C24 24 76 24 76 38 V68" />
          <path d="M32 68 V42 C32 30 68 30 68 42 V68" stroke={accentColor} />
          {/* Side Turrets */}
          <rect x="14" y="32" width="10" height="36" />
          <path d="M12 32 C12 24 26 24 26 32 Z" />
          <rect x="76" y="32" width="10" height="36" />
          <path d="M74 32 C74 24 88 24 88 32 Z" />
          {/* Embellishment Dome */}
          <path d="M42 24 C42 14 58 14 58 24 Z" fill={accentColor} fillOpacity="0.15" />
          <circle cx="50" cy="12" r="1.5" fill={accentColor} />
          <line x1="50" y1="10" x2="50" y2="4" stroke={accentColor} />
          {/* Trees / Forest Safari motifs on sides */}
          <path d="M8 68 Q 6 56, 12 56 Q 16 56, 14 68" strokeDasharray="1.5 1.5" />
          <path d="M92 68 Q 94 56, 88 56 Q 84 56, 86 68" strokeDasharray="1.5 1.5" />
        </svg>
      );

    case 'dahod':
      // Dahod Fort / Eastern Gateway & Railway Industrial Hub
      return (
        <svg {...commonProps}>
          <line x1="8" y1="72" x2="92" y2="72" strokeWidth="2.2" />
          {/* Mughal Heritage Gateway & Wall */}
          <rect x="18" y="42" width="64" height="26" />
          {/* Three pointed arches */}
          <path d="M40 68 V48 C40 40 60 40 60 48 V68" stroke={accentColor} />
          <path d="M22 68 V52 C22 46 34 46 34 52 V68" />
          <path d="M66 68 V52 C66 46 78 46 78 52 V68" />
          {/* Chhatris on Top */}
          <rect x="22" y="32" width="12" height="10" />
          <path d="M20 32 C20 22 36 22 36 32 Z" fill={accentColor} fillOpacity="0.15" />
          <rect x="66" y="32" width="12" height="10" />
          <path d="M64 32 C64 22 80 22 80 32 Z" fill={accentColor} fillOpacity="0.15" />
          {/* Center dome */}
          <rect x="42" y="34" width="16" height="8" />
          <path d="M40 34 C40 20 60 20 60 34 Z" stroke={accentColor} />
          <line x1="50" y1="20" x2="50" y2="12" stroke={accentColor} />
        </svg>
      );

    default:
      // Generic Industrial Hub & Heritage Architecture
      return (
        <svg {...commonProps}>
          <line x1="8" y1="72" x2="92" y2="72" strokeWidth="2.2" />
          <rect x="20" y="44" width="60" height="24" />
          <path d="M38 68 V48 C38 40 62 40 62 48 V68" stroke={accentColor} />
          <path d="M30 44 C30 24 70 24 70 44 Z" fill={accentColor} fillOpacity="0.15" />
          <line x1="50" y1="24" x2="50" y2="14" stroke={accentColor} />
          <rect x="14" y="32" width="8" height="36" />
          <path d="M12 32 L18 20 L24 32 Z" />
          <rect x="78" y="32" width="8" height="36" />
          <path d="M76 32 L82 20 L88 32 Z" />
        </svg>
      );
  }
}
