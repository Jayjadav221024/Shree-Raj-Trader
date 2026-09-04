import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink, ShieldCheck, Building2, CheckCircle2, Copy, Check } from 'lucide-react';
import { companyInfo } from '../data/siteData';
import { copy } from '../data/sectionCopy';

export default function LocationMapSection() {
  const [copied, setCopied] = useState(false);
  const c = copy['global.map-section'] || {
    eyebrow: 'Our Headquarters & Warehouse',
    title: 'Visit Our Facility in',
    titleAccent: 'Ahmedabad',
    subtitle: 'Strategically located in Vatva GIDC Industrial Hub with direct logistics access across Gujarat & Pan-India.',
    timingsLabel: 'Facility Hours',
    timingsValue: 'Monday – Saturday: 9:30 AM to 7:00 PM',
    supportNote: 'Direct warehouse pickup & express dispatch available'
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(companyInfo.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Google Maps Embed Query URL
  const mapEmbedUrl = `https://maps.google.com/maps?q=39,%20Mahalaxmi%20Industrial%20Estate,%20Near%20Ghodasar%20Railway%20Crossing,%20Bombay%20Conductor%20Road,%20Vatva,%20Phase%201,%20Ahmedabad,%20Gujarat&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="location-map" data-section="global.map-section" className="section bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
      <div className="container-page">
        {/* Header */}
        <div className="section-header max-w-3xl mx-auto">
          <span className="eyebrow eyebrow-teal">
            <Building2 className="w-3.5 h-3.5" />
            {c.eyebrow}
          </span>
          <h2 className="section-title">
            {c.title} <span className="text-orange">{c.titleAccent}</span>
          </h2>
          <p className="section-subtitle">
            {c.subtitle}
          </p>
        </div>

        {/* 2-Column Responsive Layout: Details Card + Interactive Google Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Details Column (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="card p-7 sm:p-8 bg-white border border-[var(--border-color)] shadow-[var(--shadow-card)] space-y-6 flex-1">
              
              {/* Facility badge & title */}
              <div className="flex items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-cyan)] block">
                    Central Distribution & Head Office
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-main)] mt-0.5">
                    {companyInfo.name}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-orange-tint)] flex items-center justify-center text-orange shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>

              {/* Address with Quick Copy */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] flex items-center justify-between">
                  <span>Registered Address</span>
                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent-orange)] hover:underline cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Address
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                  {companyInfo.address}
                </p>
              </div>

              {/* Contact Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <span className="text-xs font-bold text-[var(--text-faint)] uppercase block mb-1">
                    Call Direct
                  </span>
                  <a
                    href={`tel:${companyInfo.telPrimary}`}
                    className="font-bold text-sm text-[var(--text-main)] hover:text-[var(--accent-orange)] transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-orange shrink-0" />
                    <span>{companyInfo.phonePrimary}</span>
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <span className="text-xs font-bold text-[var(--text-faint)] uppercase block mb-1">
                    Sales Email
                  </span>
                  <a
                    href={`mailto:${companyInfo.emailPrimary}`}
                    className="font-bold text-sm text-[var(--text-main)] hover:text-[var(--accent-orange)] transition-colors flex items-center gap-1.5 truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-orange shrink-0" />
                    <span className="truncate">{companyInfo.emailPrimary}</span>
                  </a>
                </div>
              </div>

              {/* Timings & Highlights */}
              <div className="p-4 rounded-xl bg-[var(--accent-cyan-tint)]/40 border border-[rgba(20,96,122,0.2)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-cyan)]">
                  <Clock className="w-4 h-4 text-[var(--accent-cyan)] shrink-0" />
                  <span>{c.timingsLabel}: {c.timingsValue}</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] pl-6">
                  {c.supportNote}
                </p>
              </div>

              {/* Google Maps Actions */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={companyInfo.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full inline-flex items-center justify-center gap-2 text-xs sm:text-[13px] font-bold py-3.5 px-4 whitespace-nowrap shadow-[var(--shadow-glow)]"
                >
                  <Navigation className="w-4 h-4 shrink-0" />
                  <span>Get Driving Directions</span>
                </a>
                <a
                  href={companyInfo.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary w-full inline-flex items-center justify-center gap-2 text-xs sm:text-[13px] font-bold py-3.5 px-4 whitespace-nowrap"
                  aria-label="Open in Google Maps"
                >
                  <ExternalLink className="w-4 h-4 text-orange shrink-0" />
                  <span>View on Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Embed Column (7 cols on lg) */}
          <div className="lg:col-span-7 flex">
            <div className="w-full min-h-[380px] sm:min-h-[460px] rounded-3xl overflow-hidden card border-2 border-[var(--border-color)] shadow-[var(--shadow-lift)] relative bg-white group">
              <iframe
                title="Shree Raj Traders Facility Location"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '100%' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[380px] sm:min-h-[460px] grayscale-[20%] contrast-[105%] group-hover:grayscale-0 transition-all duration-500"
              />
              
              {/* Floating Location Badge on Map */}
              <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-[var(--border-color)] hidden sm:flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-ping shrink-0" />
                <div>
                  <div className="text-xs font-bold text-[var(--text-main)]">
                    Vatva GIDC Hub, Ahmedabad
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-semibold">
                    Authorized Stocking & Operations Yard
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
