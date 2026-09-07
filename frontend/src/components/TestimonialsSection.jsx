import React, { useState, useEffect, useRef } from 'react';
import { testimonials, clientLogos, images } from '../data/siteData';
import { copy } from '../data/sectionCopy';
import { resolveImageUrl } from '../admin/lib/imageResolver';
import { ChevronLeft, ChevronRight, Quote, Building2, UserCheck, ShieldCheck } from 'lucide-react';

export default function TestimonialsSection({ testimonials: propTestimonials }) {
  const rawList = propTestimonials && propTestimonials.length > 0 ? propTestimonials : testimonials;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const c = copy['home.testimonials'];
  const cl = copy['home.clients'];

  const sampleTags = ['PARTNER 2025', 'CLIENT 2024', 'VERIFIED CLIENT', 'TRUSTED PARTNER'];

  // Helper to resolve company logo by company name if available
  const getCompanyLogo = (companyName, explicitLogo) => {
    if (explicitLogo) {
      return typeof explicitLogo === 'string' ? explicitLogo : explicitLogo?.src;
    }
    if (!companyName) return null;
    const normalized = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalized.includes('himake') || normalized.includes('hi-make')) {
      return images.clients?.['hi-make']?.src;
    }
    if (normalized.includes('apidel')) {
      return images.group?.['apidel-technologies']?.src;
    }
    if (normalized.includes('technosales')) {
      return images.group?.['techno-sales-agency']?.src;
    }
    if (normalized.includes('transpower')) {
      return images.group?.['transpower-technologies']?.src;
    }
    return null;
  };

  // Helper to extract initials for clean avatar representation
  const getInitials = (name) => {
    if (!name) return 'SR';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Consistent color themes per client
  const avatarGradients = [
    {
      cardBg: 'from-orange-950/40 via-[#0d1624] to-[#080d16]',
      badgeBg: 'from-orange-600 to-amber-600',
      glow: 'rgba(217, 101, 59, 0.25)',
      accent: '#d9653b',
    },
    {
      cardBg: 'from-cyan-950/40 via-[#0d1624] to-[#080d16]',
      badgeBg: 'from-cyan-600 to-teal-600',
      glow: 'rgba(0, 163, 150, 0.25)',
      accent: '#00a396',
    },
    {
      cardBg: 'from-blue-950/40 via-[#0d1624] to-[#080d16]',
      badgeBg: 'from-blue-600 to-indigo-600',
      glow: 'rgba(59, 130, 246, 0.25)',
      accent: '#3b82f6',
    },
    {
      cardBg: 'from-emerald-950/40 via-[#0d1624] to-[#080d16]',
      badgeBg: 'from-emerald-600 to-teal-600',
      glow: 'rgba(16, 185, 129, 0.25)',
      accent: '#10b981',
    },
  ];

  const enhancedList = rawList.map((item, idx) => {
    let photoSrc = '';
    // Fetch only legitimate client/user image if set explicitly in backend or data
    if (item.imageKey && images.team?.[item.imageKey]) {
      photoSrc = images.team[item.imageKey].src;
    } else if (item.imageKey) {
      const resolved = resolveImageUrl(item.imageKey, 'team', null);
      if (resolved?.src && !resolved.src.includes('logo-mini') && !resolved.src.includes('sinnova')) {
        photoSrc = resolved.src;
      }
    } else if (item.image) {
      photoSrc = typeof item.image === 'string' ? item.image : item.image?.src;
    } else if (item.photo) {
      photoSrc = typeof item.photo === 'string' ? item.photo : item.photo?.src;
    }

    const companyLogoSrc = getCompanyLogo(item.company, item.companyLogo);
    const theme = avatarGradients[idx % avatarGradients.length];

    return {
      ...item,
      tag: item.tag || sampleTags[idx % sampleTags.length],
      hasRealPhoto: Boolean(photoSrc),
      image: photoSrc,
      companyLogo: companyLogoSrc,
      initials: getInitials(item.client),
      designation: item.designation || item.role || item.company || 'Industrial Partner',
      theme,
    };
  });

  useEffect(() => {
    if (isPaused || enhancedList.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % enhancedList.length);
    }, 2000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, enhancedList.length]);

  const activeItem = enhancedList[activeIndex] || enhancedList[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + enhancedList.length) % enhancedList.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % enhancedList.length);
  };

  return (
    <section id="testimonials" className="section section-alt overflow-hidden py-16">
      <div className="container-page">
        {/* Testimonial Showcase Box in clean white surface matching site theme */}
        <div
          data-section="home.testimonials"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative rounded-2xl md:rounded-[28px] overflow-hidden bg-white border border-[var(--border-color)] shadow-[0_12px_40px_-10px_rgba(14,26,43,0.08)] p-6 sm:p-10 lg:p-14 mb-16"
        >
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--accent-cyan-tint)]/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[var(--accent-orange-tint)]/60 via-transparent to-transparent pointer-events-none" />
          
          {/* Top Multi-Color Gradient Line */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--accent-orange)] to-[var(--accent-orange-bright)]" />

          {/* Section Eyebrow & Title */}
          <div className="mb-10 text-left relative z-10">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent-orange)] block mb-2 font-mono">
              {c.eyebrow || 'IN THEIR WORDS'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-black uppercase text-[var(--color-ink)] leading-tight tracking-wide">
              {c.title || 'THE LINES THAT'}{' '}
              <span className="text-[var(--accent-orange)]">{c.titleAccent || 'MOVED THE ROOM'}</span>
            </h2>
            <div className="w-16 h-[3px] bg-gradient-to-r from-[var(--accent-orange)] via-[var(--accent-cyan)] to-transparent mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10 min-h-[420px]">
            {/* LEFT COLUMN: 3-Node Rotating Circular Orbit Window across 10+ Testimonials */}
            <div className="lg:col-span-5 relative py-8 min-h-[360px] flex items-center overflow-visible">
              {/* Perfect SVG Arc connecting avatar centers */}
              <svg
                className="absolute left-0 top-0 bottom-0 w-full h-full pointer-events-none stroke-slate-300"
                viewBox="0 0 400 360"
                fill="none"
              >
                {/* Smooth quadratic arc passing through avatar centers */}
                <path
                  d="M 20 15 Q 140 180 20 345"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
              </svg>

              {/* 3 Visible Nodes Rotating on the Arc (Top, Active Center, Bottom) */}
              <div className="flex flex-col justify-between h-[330px] w-full relative z-10">
                {[-1, 0, 1].map((slotOffset) => {
                  const itemIndex = (activeIndex + slotOffset + enhancedList.length) % enhancedList.length;
                  const item = enhancedList[itemIndex];
                  const isActive = slotOffset === 0;

                  // 3 Fixed Geometric Curve positions:
                  // slotOffset -1 (top): x = 12px
                  // slotOffset 0 (center): x = 56px (peaks outward)
                  // slotOffset 1 (bottom): x = 12px
                  const offsetX = isActive ? 56 : 12;

                  return (
                    <div
                      key={`slot-${slotOffset}-${item.client}`}
                      onClick={() => setActiveIndex(itemIndex)}
                      style={{
                        paddingLeft: `${offsetX}px`,
                      }}
                      className={`flex items-center gap-3.5 cursor-pointer transition-all duration-700 select-none group w-fit ${
                        isActive
                          ? 'opacity-100 scale-100 z-20'
                          : 'opacity-70 hover:opacity-100 scale-95 z-10'
                      }`}
                    >
                      {/* Avatar Circle cleanly on the Arc */}
                      <div className="relative shrink-0 flex items-center justify-center">
                        {item.hasRealPhoto ? (
                          <img
                            src={item.image}
                            alt={item.client}
                            className={`rounded-full object-cover transition-all duration-500 bg-white ${
                              isActive
                                ? 'w-14 h-14 shadow-lg ring-3 ring-emerald-500 scale-110'
                                : 'w-10 h-10 ring-1 ring-slate-200 grayscale opacity-75 group-hover:opacity-100 group-hover:grayscale-0'
                            }`}
                          />
                        ) : item.companyLogo ? (
                          <div className={`rounded-full bg-white border border-slate-200 p-1.5 flex items-center justify-center transition-all duration-500 ${
                            isActive
                              ? 'w-14 h-14 shadow-lg ring-3 ring-emerald-500 scale-110'
                              : 'w-10 h-10 ring-1 ring-slate-200 opacity-75 group-hover:opacity-100'
                          }`}>
                            <img
                              src={item.companyLogo}
                              alt={item.company}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className={`rounded-full bg-gradient-to-tr ${item.theme.badgeBg} text-white font-bold flex items-center justify-center shadow-xs transition-all duration-500 ${
                            isActive
                              ? 'w-14 h-14 text-base ring-3 ring-emerald-500 scale-110'
                              : 'w-10 h-10 text-xs ring-1 ring-slate-200 opacity-75 group-hover:opacity-100'
                          }`}>
                            {item.initials}
                          </div>
                        )}
                      </div>

                      {/* Person Details (Exact style matching reference image) */}
                      <div className="text-left min-w-0 transition-all duration-500">
                        <h4 className={`font-bold tracking-tight truncate transition-colors duration-300 ${
                          isActive ? 'text-base sm:text-lg text-slate-900' : 'text-sm sm:text-base text-slate-700 group-hover:text-slate-900'
                        }`}>
                          {item.client}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                            ★ 4.9
                          </span>
                          <span>· {item.company}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: Clean Quotation Display */}
            <div className="lg:col-span-7 flex flex-col justify-between text-left lg:pl-8 border-t lg:border-t-0 lg:border-l border-slate-200 pt-8 lg:pt-0 min-h-[280px]">
              <div className="relative">
                {/* Quotation mark */}
                <div className="text-4xl sm:text-5xl lg:text-6xl text-[var(--accent-orange)] font-bold leading-none mb-3 select-none opacity-80">
                  &ldquo;
                </div>

                {/* Animated Quote Feedback matching Website Sans-Serif font */}
                <blockquote
                  key={`quote-${activeIndex}`}
                  className="text-lg sm:text-xl lg:text-2xl text-[var(--color-ink)] font-sans font-medium leading-relaxed mb-8 min-h-[6.5rem] animate-fadeIn relative z-10"
                >
                  {activeItem.feedback}
                </blockquote>

                {/* Active Client Sub-signature */}
                <div
                  key={`client-${activeIndex}`}
                  className="flex items-center gap-3 animate-fadeIn text-sm text-[var(--color-muted)] font-sans"
                >
                  <span className="w-8 h-[2px] bg-[var(--accent-orange)] inline-block rounded-full" />
                  <span className="text-[var(--color-ink)] font-bold tracking-wide">{activeItem.client}</span>
                  <span>({activeItem.company})</span>
                </div>
              </div>

              {/* Progress Indicators & Manual Navigation */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    {enhancedList.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === activeIndex
                            ? 'w-10 bg-[var(--accent-orange)]'
                            : 'w-4 bg-slate-300 hover:bg-slate-400'
                        }`}
                        aria-label={`Go to testimonial ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400 tracking-wider font-mono">
                    {activeIndex + 1} / {enhancedList.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[var(--accent-orange)] text-slate-600 hover:text-white flex items-center justify-center transition-colors border border-slate-200 cursor-pointer shadow-sm"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[var(--accent-orange)] text-slate-600 hover:text-white flex items-center justify-center transition-colors border border-slate-200 cursor-pointer shadow-sm"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reputed clients - Full screen width marquee */}
      <div data-section="home.clients" className="w-full mt-4">
        <div className="container-page">
          <div className="section-header">
            <span className="eyebrow eyebrow-teal">{cl.eyebrow}</span>
            <h2 className="section-title">
              {cl.title} <span className="text-orange">{cl.titleAccent}</span>
            </h2>
          </div>
        </div>

        <div className="marquee-wrapper relative overflow-hidden py-4 w-full">
          {/* Edge gradient fades for seamless overlay blending across the full viewport */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 md:w-48 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 md:w-48 bg-gradient-to-l from-[var(--bg-secondary)] to-transparent z-10 pointer-events-none" />

          <div className="marquee-track flex gap-6 animate-marquee hover:[animation-play-state:paused] cursor-pointer">
            {/* Set 1 */}
            {clientLogos.map((client) => (
              <div key={`set1-${client.name}`} className="client-chip w-64 sm:w-72 h-28 sm:h-32 px-6 py-4 shrink-0 flex items-center justify-center">
                <img
                  src={client.image.src}
                  alt={client.imageAlt || `${client.name} logo`}
                  width={client.image.width}
                  height={client.image.height}
                  loading="lazy"
                  className="max-h-20 sm:max-h-24 w-auto max-w-[85%] object-contain"
                />
              </div>
            ))}
            {/* Set 2 */}
            {clientLogos.map((client) => (
              <div key={`set2-${client.name}`} className="client-chip w-64 sm:w-72 h-28 sm:h-32 px-6 py-4 shrink-0 flex items-center justify-center">
                <img
                  src={client.image.src}
                  alt={client.imageAlt || `${client.name} logo`}
                  width={client.image.width}
                  height={client.image.height}
                  loading="lazy"
                  className="max-h-20 sm:max-h-24 w-auto max-w-[85%] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
