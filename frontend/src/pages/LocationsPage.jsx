import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { CITIES } from '../data/cities';
import { copy } from '../data/sectionCopy';
import SEO from '../components/SEO';

export default function LocationsPage() {
  const navigate = useNavigate();
  const c = copy['locations.header'];

  return (
    <section className="section section-alt page-top-spacing min-h-screen">
      <SEO title={copy['seo.locations'].title} description={copy['seo.locations'].description} />
      <div className="container-page">
        <div data-section="locations.header" className="section-header max-w-2xl mx-auto">
          <span className="eyebrow">{c.eyebrow}</span>
          <h1 className="section-title">
            {c.title} <span className="text-orange">{c.titleAccent}</span>
          </h1>
          <p>{c.intro}</p>
        </div>

        {/* City Grid */}
        <div
          data-section="locations.cities"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {CITIES.map((city) => (
            <div
              key={city.slug}
              onClick={() => navigate(`/locations/${city.slug}/`)}
              className="card card-hover p-6 flex flex-col justify-between min-h-[160px] cursor-pointer group"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-orange-tint)] flex items-center justify-center mb-4 text-[var(--accent-orange-deep)]">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-main)] group-hover:text-[var(--accent-orange)] transition-colors leading-none">
                  {city.name}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 font-semibold">
                  {city.district}
                </p>
              </div>

              <div className="text-[var(--accent-orange-deep)] font-extrabold text-xs mt-6 inline-flex items-center gap-1.5">
                {c.cardCta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
