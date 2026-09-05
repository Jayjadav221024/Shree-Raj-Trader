import React, { useState, useEffect, useRef } from 'react';
import { testimonials, clientLogos, images } from '../data/siteData';
import { copy } from '../data/sectionCopy';
import { resolveImageUrl } from '../admin/lib/imageResolver';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function TestimonialsSection({ testimonials: propTestimonials }) {
  const rawList = propTestimonials && propTestimonials.length > 0 ? propTestimonials : testimonials;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const c = copy['home.testimonials'];
  const cl = copy['home.clients'];

  const sampleTeamImages = [
    images.gallery?.['facility-2']?.src || images.gallery?.['facility-1']?.src,
    images.gallery?.['facility-4']?.src,
    images.gallery?.['facility-6']?.src || images.gallery?.['facility-5']?.src,
    images.gallery?.['facility-7']?.src,
  ];

  const sampleTags = ['PARTNER 2025', 'CLIENT 2024', 'VERIFIED CLIENT', 'TRUSTED 2024'];

  const enhancedList = rawList.map((item, idx) => {
    let photoSrc = '';
    if (item.imageKey) {
      photoSrc = resolveImageUrl(item.imageKey, 'team', 'about-facility')?.src;
    } else if (item.image) {
      photoSrc = typeof item.image === 'string' ? item.image : item.image?.src;
    } else if (item.photo) {
      photoSrc = typeof item.photo === 'string' ? item.photo : item.photo?.src;
    } else {
      photoSrc = sampleTeamImages[idx % sampleTeamImages.length];
    }

    return {
      ...item,
      tag: item.tag || sampleTags[idx % sampleTags.length],
      image: photoSrc,
      designation: item.designation || item.role || item.company || 'Industrial Partner',
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
          
          {/* Top Multi-Color Gradient Line matching theme palette (Siemens Cyan -> Industrial Orange -> Bright Orange) */}
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
                  {activeItem.feedback}
                </blockquote>

                {/* Client Name & Designation */}
                <div className="space-y-0.5 mb-8">
                  <div className="text-sm sm:text-base font-black uppercase text-white tracking-wider font-display">
                    {activeItem.client}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
                    {activeItem.company} {activeItem.designation ? `· ${activeItem.designation}` : ''}
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
                    className={`shrink-0 rounded-xl overflow-hidden relative cursor-pointer transition-all duration-300 select-none ${
                      isActive
                        ? 'w-[185px] sm:w-[215px] h-[300px] sm:h-[350px] border-2 border-[var(--accent-orange)] shadow-[0_20px_40px_-10px_rgba(217,101,59,0.35)] scale-100 z-20 ring-1 ring-[var(--accent-orange)]/50'
                        : 'w-[130px] sm:w-[155px] h-[260px] sm:h-[300px] border border-slate-800/80 opacity-65 hover:opacity-90 hover:scale-[1.02] z-10'
                    }`}
                  >
                    {/* Background Person Profile Image with Overlay */}
                    <img
                      src={item.image}
                      alt={item.client}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a121e] via-[#0a121e]/40 to-black/30" />

                    {/* Top Tag Pill in theme styling */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md bg-black/70 border border-[var(--accent-orange)]/60 text-[var(--accent-orange-bright)] tracking-wider uppercase">
                        {item.tag}
                      </span>
                    </div>

                    {/* Bottom Author Name Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-[#0a121e] via-[#0a121e]/85 to-transparent text-left">
                      <div className="font-black text-white text-xs uppercase tracking-wide truncate">
                        {item.client}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-medium text-slate-300 truncate mt-0.5">
                        {item.designation || item.company}
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
