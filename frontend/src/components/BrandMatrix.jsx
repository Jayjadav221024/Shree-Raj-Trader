import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { authorizedBrands } from '../data/siteData';
import { copy } from '../data/sectionCopy';

export default function BrandMatrix({ onSelectBrand }) {
  const c = copy['home.brands'];

  return (
    <section id="brands" data-section="home.brands" className="section section-alt">
      <div className="container-page">
        <div className="section-header">
          <span className="eyebrow">{c.eyebrow}</span>
          <h2 className="section-title">
            {c.title} <span className="text-orange">{c.titleAccent}</span>
          </h2>
          <p>{c.intro}</p>
        </div>

        <div className="brand-stack-container relative space-y-8">
          {authorizedBrands.map((brand, index) => (
            <button
              key={brand.id}
              onClick={() => onSelectBrand && onSelectBrand(brand.id)}
              className="brand-sticky-card w-full card p-8 sm:p-10 text-left block group transition-all duration-300"
              style={{ '--card-index': index }}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center w-full">
                {/* Left Side: Brand info */}
                <div className="md:col-span-6 space-y-4">
                  <div className="h-20 sm:h-24 flex items-center p-2 rounded-xl bg-white border border-[var(--border-color)]/60 w-fit max-w-[280px]">
                    <img
                      src={brand.logo.src}
                      alt={brand.logoAlt || `${brand.name} logo`}
                      width={brand.logo.width}
                      height={brand.logo.height}
                      loading="lazy"
                      className="max-h-16 sm:max-h-20 max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold group-hover:text-[var(--accent-orange)] transition-colors leading-tight">
                      {brand.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal mt-1">
                      {brand.category}
                    </p>
                  </div>
                  <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                    {brand.tagline}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-faint)] group-hover:text-[var(--accent-orange)] transition-all pt-2">
                    <span>{c.viewLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>

                {/* Right Side: Key Highlights */}
                <div className="md:col-span-6 border-t md:border-t-0 md:border-l border-[var(--border-color)] pt-6 md:pt-0 md:pl-8 space-y-3">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--accent-cyan)] mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--accent-cyan-tint)]/70 border border-[rgba(20,96,122,0.18)]">
                    {brand.authorizedPartner ? c.highlightsAuthorizedLabel : c.highlightsGenericLabel}
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {brand.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 group-hover:border-[var(--accent-orange)]/40 group-hover:bg-[var(--accent-orange-tint)]/25 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-lg bg-[var(--accent-orange-tint)] border border-[rgba(217,101,59,0.25)] flex items-center justify-center shrink-0">
                          <Sparkles className="w-3.5 h-3.5 text-orange" />
                        </div>
                        <span className="text-sm sm:text-[14.5px] font-bold text-[var(--text-main)] leading-snug tracking-tight">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
