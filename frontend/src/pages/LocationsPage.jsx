import React, { useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ChevronLeft, ChevronRight, Building2, Search, X } from 'lucide-react';
import { CITIES } from '../data/cities';
import { copy } from '../data/sectionCopy';
import SEO from '../components/SEO';
import { CityLandmarkArt } from '../components/CityLandmarkArt';

export default function LocationsPage() {
  const navigate = useNavigate();
  const c = copy['locations.header'];
  const stripRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  const scrollStrip = (direction) => {
    if (stripRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      stripRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredCities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CITIES;
    return CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(q) ||
        city.district.toLowerCase().includes(q) ||
        city.slug.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <section className="section section-alt page-top-spacing min-h-screen">
      <SEO title={copy['seo.locations'].title} description={copy['seo.locations'].description} />
      <div className="container-page">
        {/* Section Header */}
        <div data-section="locations.header" className="section-header max-w-2xl mx-auto">
          <span className="eyebrow eyebrow-teal">
            <Building2 className="w-3.5 h-3.5" />
            {c.eyebrow}
          </span>
          <h1 className="section-title">
            {c.title} <span className="text-orange">{c.titleAccent}</span>
          </h1>
          <p>{c.intro}</p>
        </div>

        {/* 2D Architectural Landmark Model Strip (Like BookMyShow / Landmark Strip Drawing) */}
        <div className="card p-6 sm:p-8 bg-white border border-[var(--border-color)] shadow-[var(--shadow-card)] mb-10 relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-6 border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-orange)] animate-pulse" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">
                Industrial Cities & Regional Hubs
              </span>
            </div>
            
            {/* Scroll buttons for carousel strip */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollStrip('left')}
                className="w-8 h-8 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-[var(--accent-orange)] transition-colors cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollStrip('right')}
                className="w-8 h-8 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-[var(--accent-orange)] transition-colors cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={stripRef}
            className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
          >
            {CITIES.map((city) => (
              <button
                key={`strip-${city.slug}`}
                onClick={() => navigate(`/locations/${city.slug}/`)}
                className="group flex flex-col items-center justify-center shrink-0 w-28 sm:w-32 text-center p-3 rounded-2xl hover:bg-[var(--accent-orange-tint)]/40 transition-all duration-300 cursor-pointer"
              >
                <div className="w-20 h-16 sm:w-24 sm:h-20 flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110">
                  <CityLandmarkArt
                    slug={city.slug}
                    className="w-full h-full text-slate-700 group-hover:text-[var(--accent-cyan)] transition-colors"
                    accentColor="#d9653b"
                  />
                </div>
                <span className="font-display font-bold text-xs sm:text-sm text-[var(--text-main)] group-hover:text-[var(--accent-orange)] transition-colors leading-tight whitespace-nowrap">
                  {city.name}
                </span>
              </button>
            ))}
          </div>

          <div className="text-center pt-4 border-t border-[var(--border-color)]/60 mt-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-faint)]">
              Authorized Supply Network across Gujarat
            </span>
          </div>
        </div>

        {/* Search Bar & Locations Count */}
        <div className="card p-4 sm:p-5 bg-white border border-[var(--border-color)] shadow-xs rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[var(--text-faint)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city or district (e.g. Ahmedabad, Bharuch, Surat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-orange)] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-faint)] hover:text-[var(--text-main)] cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs font-semibold text-[var(--text-muted)] shrink-0 self-end sm:self-center">
            Showing <span className="font-bold text-[var(--text-main)]">{filteredCities.length}</span> of {CITIES.length} industrial locations
          </div>
        </div>

        {/* Full City Grid with 2D Architectural Drawing Model Badges */}
        {filteredCities.length === 0 ? (
          <div className="card p-12 text-center bg-white border border-[var(--border-color)] rounded-2xl">
            <MapPin className="w-10 h-10 text-[var(--text-faint)] mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-[var(--text-main)]">No locations found</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any location matching &ldquo;{searchQuery}&rdquo;. Try another city or district name.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="btn btn-secondary btn-sm mt-4 inline-flex items-center gap-2 cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div
            data-section="locations.cities"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {filteredCities.map((city) => (
              <div
                key={city.slug}
                onClick={() => navigate(`/locations/${city.slug}/`)}
                className="card card-hover p-6 flex flex-col justify-between min-h-[220px] cursor-pointer group bg-white border border-[var(--border-color)] rounded-2xl transition-all duration-300"
              >
                <div>
                  {/* 2D Model Drawing illustration inside card */}
                  <div className="w-full h-24 bg-[var(--bg-secondary)] rounded-xl flex items-center justify-center p-2 mb-4 border border-[var(--border-color)] group-hover:border-[var(--accent-orange)] group-hover:bg-[var(--accent-orange-tint)]/20 transition-all duration-300 overflow-hidden">
                    <CityLandmarkArt
                      slug={city.slug}
                      className="w-20 h-16 text-slate-600 group-hover:text-[var(--accent-cyan)] group-hover:scale-105 transition-all duration-300"
                      accentColor="#d9653b"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-display font-bold text-[var(--text-main)] group-hover:text-[var(--accent-orange)] transition-colors leading-tight">
                      {city.name}
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1.5" />
                  </div>
                  
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 hand-3 text-orange shrink-0" />
                    {city.district}
                  </p>
                </div>

                <div className="text-[var(--accent-orange-deep)] font-extrabold text-xs mt-5 inline-flex items-center gap-1.5 pt-3 border-t border-[var(--border-color)]">
                  {c.cardCta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
