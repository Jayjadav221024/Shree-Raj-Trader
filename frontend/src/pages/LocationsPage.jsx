import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { CITIES } from '../data/cities';
import SEO from '../components/SEO';

export default function LocationsPage() {
  const navigate = useNavigate();

  return (
    <section className="section section-alt page-top-spacing min-h-screen">
      <SEO
        title="Our Service Locations - Gujarat Industrial Network"
        description="Shree Raj Traders supplies premium Siemens switchgears, CGL & Hindustan electric motors, and FRP composite solutions to major industrial hubs and cities across Gujarat."
      />
      <div className="container-page">
        <div className="section-header max-w-2xl mx-auto">
          <span className="eyebrow">Industrial Supply Network</span>
          <h1 className="section-title">
            Our Service <span className="text-orange">Locations</span>
          </h1>
          <p>
            Supplying premium motors, switchgears, and FRP solutions across major industrial districts in Gujarat.
          </p>
        </div>

        {/* City Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
                <h3 className="text-xl sm:text-2xl font-display text-[var(--text-main)] group-hover:text-[var(--accent-orange)] transition-colors tracking-wide uppercase leading-none">
                  {city.name}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1.5 font-semibold">
                  {city.district}
                </p>
              </div>

              <div className="text-[var(--accent-orange-deep)] font-extrabold text-xs uppercase tracking-wider mt-6 inline-flex items-center gap-1.5">
                View details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
