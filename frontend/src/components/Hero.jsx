import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import CountUp from './CountUp';
import { statsCounter, heroAssurances, companyInfo, siteMeta, images } from '../data/siteData';
import { copy } from '../data/sectionCopy';

export default function Hero({ onOpenRfq }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Read at render, not at module scope: the Website Editor rewrites these
  // objects in place once saved content arrives.
  const c = copy['home.hero'];
  const cNav = copy['global.navbar'];
  const PRODUCT_PILLS = c.productPills;

  useEffect(() => {
    // The tile list is editable, so it can legitimately be emptied.
    if (isPaused || PRODUCT_PILLS.length === 0) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % PRODUCT_PILLS.length);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, PRODUCT_PILLS.length]);

  const handlePillClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section id="hero" data-section="home.hero" className="hero-section">
      <div className="hero-background-text" aria-hidden="true">{c.backgroundText}</div>

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Brand Text Logo in Hero - displayed on sm and up since mobile header shows it, or nicely scaled */}
            <div className="hidden sm:inline-block logo-3d-container">
              <div className="leading-none logo-text-3d">
                <div className="font-display text-2xl sm:text-3xl tracking-wide font-extrabold">
                  <span className="logo-gradient-text">{cNav.wordmarkPrimary}</span>{' '}
                  <span className="logo-gradient-accent">{cNav.wordmarkAccent}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold tracking-[0.16em] uppercase logo-sub-gradient mt-1.5">
                  {cNav.wordmarkSub}
                </div>
              </div>
            </div>

            <h1 className="hero-headline text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.2] sm:leading-[1.15] tracking-tight">
              <span className="block">{c.headingLine1}</span>
              <span className="block mt-1">
                <span className="text-orange inline-block overflow-hidden h-[1.25em] align-bottom">
                  <span key={activeIndex} className="inline-block animate-slideUp">
                    {PRODUCT_PILLS[activeIndex]?.label}
                  </span>
                </span>
              </span>
              <span className="block mt-1">{c.headingLine3}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button onClick={onOpenRfq} className="btn btn-primary">
                {c.ctaPrimary}
                <ArrowRight className="w-4 h-4" />
              </button>
              <a href={`tel:${companyInfo.telPrimary}`} className="btn btn-secondary">
                <Phone className="w-4 h-4 text-orange" />
                {companyInfo.phonePrimary}
              </a>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {heroAssurances.map((assurance) => (
                <span key={assurance} className="hero-feature-pill">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange shrink-0 mt-0.5 sm:mt-0" />
                  <span>{assurance}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Product image carousel */}
          <div className="lg:col-span-5">
            <div 
              className="relative rounded-[18px] overflow-hidden border border-[var(--border-color)] bg-white shadow-[var(--shadow-lift)] aspect-[635/411] w-full cursor-pointer"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {PRODUCT_PILLS.map((pill, idx) => {
                const imgData = images.products[pill.imageKey] || siteMeta.heroImage;
                const isActive = idx === activeIndex;
                return (
                  <img
                    key={pill.label}
                    src={imgData.src}
                    alt={pill.imageAlt || `${pill.label} range supplied by Shree Raj Traders`}
                    width={imgData.width}
                    height={imgData.height}
                    fetchPriority={idx === 0 ? "high" : "low"}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                      isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                    }`}
                  />
                );
              })}
              
              {/* Overlay slide indicators */}
              <div className="absolute bottom-3 right-3 z-20 flex gap-1.5 bg-black/35 px-2.5 py-1.5 rounded-full backdrop-blur-sm">
                {PRODUCT_PILLS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === activeIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-4">
              {PRODUCT_PILLS.map((pill, idx) => {
                const isActive = idx === activeIndex;
                const isLastAndOdd = idx === PRODUCT_PILLS.length - 1 && PRODUCT_PILLS.length % 2 !== 0;
                return (
                  <button
                    key={pill.label}
                    onClick={() => handlePillClick(idx)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={`px-3.5 py-3 rounded-[12px] bg-white border text-left transition-all duration-300 w-full cursor-pointer hover:border-[var(--accent-orange)] ${
                      isActive 
                        ? 'border-[var(--accent-orange)] shadow-[var(--shadow-glow)] ring-1 ring-[var(--accent-orange)]' 
                        : 'border-[var(--border-color)]'
                    } ${isLastAndOdd ? 'col-span-2' : ''}`}
                  >
                    <div className="font-display text-base tracking-wide text-[var(--text-main)] leading-none">
                      {pill.label}
                    </div>
                    <div className={`text-xs font-semibold mt-1.5 transition-colors ${
                      isActive ? 'text-orange' : 'text-[var(--text-muted)]'
                    }`}>
                      {pill.spec}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14 pt-12 border-t border-[var(--border-color)]">
          {statsCounter.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-card-number">
                <CountUp value={stat.value} />
              </div>
              <div className="stat-card-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

