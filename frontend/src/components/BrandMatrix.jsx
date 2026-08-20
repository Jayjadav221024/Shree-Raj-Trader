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
                  <div className="h-16 flex items-center">
                    <img
                      src={brand.logo.src}
                      alt={brand.logoAlt || `${brand.name} logo`}
                      width={brand.logo.width}
                      height={brand.logo.height}
                      loading="lazy"
                      className="max-h-12 max-w-[65%] object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl tracking-wide uppercase group-hover:text-[var(--accent-orange)] transition-colors leading-tight">
                      {brand.name}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-teal mt-1">
                      {brand.category}
                    </p>
                  </div>
                  <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                    {brand.tagline}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] group-hover:text-[var(--accent-orange)] transition-all pt-2">
                    <span>{c.viewLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>

                {/* Right Side: Key Highlights */}
                <div className="md:col-span-6 border-t md:border-t-0 md:border-l border-[var(--border-color)] pt-6 md:pt-0 md:pl-8 space-y-3.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-cyan)] mb-2.5">
                    {brand.authorizedPartner ? c.highlightsAuthorizedLabel : c.highlightsGenericLabel}
                  </div>
                  {brand.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                      <div className="w-5 h-5 rounded-full bg-[var(--accent-orange-tint)] flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3 h-3 text-orange" />
                      </div>
                      <span className="leading-relaxed">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
