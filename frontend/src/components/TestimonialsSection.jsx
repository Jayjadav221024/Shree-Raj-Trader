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
    }, 6000);
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
        {/* Cinematic Testimonial Showcase Box matching theme colors */}
        <div
          data-section="home.testimonials"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative rounded-2xl md:rounded-[24px] overflow-hidden bg-[#0a121e] border border-slate-800 shadow-[0_24px_50px_-12px_rgba(10,18,30,0.6)] p-6 sm:p-10 lg:p-12 mb-16"
        >
          {/* Subtle Ambient Background Gradients in theme terracotta and teal */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--accent-cyan)]/25 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[var(--accent-orange)]/20 via-transparent to-transparent pointer-events-none" />
          
          {/* Top Multi-Color Gradient Line matching theme palette */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--accent-orange)] to-[var(--accent-orange-bright)]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center relative z-10">
            {/* LEFT COLUMN: Quote & Information */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between text-left">
              <div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent-orange)] block mb-2 font-mono">
                  {c.eyebrow || 'IN THEIR WORDS'}
                </span>

                <h2 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-black uppercase text-white leading-tight mb-4 tracking-wide">
                  {c.title || 'THE LINES THAT'}{' '}
                  <span className="text-[var(--accent-orange)]">{c.titleAccent || 'MOVED THE ROOM'}</span>
                </h2>

                {/* Accent quote symbol and bar */}
                <div className="mb-4">
                  <div className="w-14 h-[2.5px] bg-gradient-to-r from-[var(--accent-orange)] via-[var(--accent-cyan)] to-transparent mb-1 rounded-full" />
                  <Quote className="w-6 h-6 text-[var(--accent-orange)] rotate-180 inline-block fill-[var(--accent-orange)]" />
                </div>

                {/* Quote Body */}
                <blockquote className="text-base sm:text-lg lg:text-[19px] text-slate-100 font-normal leading-relaxed mb-8 min-h-[4.5rem]">
                  "{activeItem.feedback}"
                </blockquote>

                {/* Client Name & Designation & Company Badge */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-[var(--accent-orange)] flex items-center justify-center font-bold text-white tracking-wider text-sm shadow-md shrink-0">
                    {activeItem.initials}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm sm:text-base font-black uppercase text-white tracking-wider font-display flex items-center gap-2">
                      {activeItem.client}
                      <ShieldCheck className="w-4 h-4 text-emerald-400 inline" title="Verified Client" />
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide flex items-center gap-2">
                      <span>{activeItem.company}</span>
                      {activeItem.designation && activeItem.designation !== activeItem.company && (
                        <>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{activeItem.designation}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Navigation controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    {enhancedList.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          idx === activeIndex
                            ? 'w-8 bg-[var(--accent-orange)]'
                            : 'w-3.5 bg-slate-700/80 hover:bg-slate-500'
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
                    className="w-8 h-8 rounded-full bg-slate-900/90 hover:bg-[var(--accent-orange)] text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700 cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-8 h-8 rounded-full bg-slate-900/90 hover:bg-[var(--accent-orange)] text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700 cursor-pointer"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Vertical Cards Carousel */}
            <div className="lg:col-span-6 xl:col-span-6 flex items-center gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 justify-start lg:justify-end">
              {enhancedList.map((item, idx) => {
                const isActive = idx === activeIndex;

                return (
                  <div
                    key={`${item.client}-${idx}`}
                    onClick={() => setActiveIndex(idx)}
                    className={`shrink-0 rounded-2xl overflow-hidden relative cursor-pointer transition-all duration-300 select-none flex flex-col justify-between ${
                      isActive
                        ? 'w-[185px] sm:w-[215px] h-[300px] sm:h-[350px] border-2 border-[var(--accent-orange)] shadow-[0_20px_40px_-10px_rgba(217,101,59,0.35)] scale-100 z-20 ring-1 ring-[var(--accent-orange)]/50'
                        : 'w-[130px] sm:w-[155px] h-[260px] sm:h-[300px] border border-slate-800/80 opacity-70 hover:opacity-95 hover:scale-[1.02] z-10'
                    } bg-gradient-to-b ${item.theme.cardBg}`}
                  >
                    {/* Background Pattern Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                    {/* If genuine photo exists, render it. Otherwise render authentic company/initial badge */}
                    {item.hasRealPhoto ? (
                      <>
                        <img
                          src={item.image}
                          alt={item.client}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a121e] via-[#0a121e]/40 to-black/30" />
                      </>
                    ) : (
                      <div className="relative z-10 p-4 pt-14 flex flex-col items-center justify-center flex-1 text-center">
                        {/* Authentic Company Logo or Stylized Monogram Avatar */}
                        {item.companyLogo ? (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/95 p-2.5 shadow-lg border border-slate-700 flex items-center justify-center mb-3 transition-transform">
                            <img
                              src={item.companyLogo}
                              alt={item.company}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${item.theme.badgeBg} text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg border border-white/20 mb-3 tracking-wider`}>
                            {item.initials}
                          </div>
                        )}

                        <div className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-300 uppercase tracking-widest bg-black/40 px-2.5 py-1 rounded-full border border-slate-800">
                          <Building2 className="w-3 h-3 text-[var(--accent-orange)]" />
                          <span className="truncate max-w-[100px]">{item.company}</span>
                        </div>
                      </div>
                    )}

                    {/* Top Tag Pill in theme styling */}
                    <div className="absolute top-3.5 left-3.5 z-20">
                      <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md bg-black/75 border border-[var(--accent-orange)]/60 text-[var(--accent-orange-bright)] tracking-wider uppercase shadow-sm flex items-center gap-1">
                        <UserCheck className="w-3 h-3 inline" />
                        {item.tag}
                      </span>
                    </div>

                    {/* Bottom Author Name Overlay */}
                    <div className="relative z-20 p-3.5 bg-gradient-to-t from-[#060b13] via-[#0a121e]/95 to-transparent text-left border-t border-slate-800/40">
                      <div className="font-black text-white text-xs uppercase tracking-wide truncate">
                        {item.client}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-medium text-slate-300 truncate mt-0.5">
                        {item.company}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reputed clients */}
        <div data-section="home.clients">
          <div className="section-header">
            <span className="eyebrow eyebrow-teal">{cl.eyebrow}</span>
            <h2 className="section-title">
              {cl.title} <span className="text-orange">{cl.titleAccent}</span>
            </h2>
          </div>

          <div className="marquee-wrapper relative overflow-hidden py-4 w-full">
            {/* Edge gradient fades for seamless overlay blending */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

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
      </div>
    </section>
  );
}
