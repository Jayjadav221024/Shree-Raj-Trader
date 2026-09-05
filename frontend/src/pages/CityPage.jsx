import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, FileText, ArrowLeft, ArrowRight, 
  ShieldCheck, Truck, Zap, Plus, Minus, CheckCircle, ChevronDown,
  Building2, HardHat, Link, Star
} from 'lucide-react';
import { CITIES } from '../data/cities';
import { companyInfo, authorizedBrands } from '../data/siteData';
import { copy } from '../data/sectionCopy';
import { fillTemplate } from '../lib/siteContent';
import SEO from '../components/SEO';
import { CityLandmarkArt } from '../components/CityLandmarkArt';

const CARD_ICONS = [ShieldCheck, Truck, Zap, CheckCircle];
const COVERAGE_ICONS = [Building2, HardHat, Link, Star];

export default function CityPage() {
  const { city: citySlug } = useParams();
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const t = copy['city.page'];

  const city = CITIES.find((c) => c.slug === citySlug.toLowerCase());

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 bg-[var(--bg-primary)]">
        <h2 className="font-display text-3xl text-[var(--text-main)]">{t.notFoundTitle}</h2>
        <button onClick={() => navigate('/locations/')} className="btn btn-primary mt-4">
          {t.notFoundCta}
        </button>
      </div>
    );
  }

  /** Fills {city} / {district} in any editable string on this page. */
  const fill = (text) => fillTemplate(text, { city: city.name, district: city.district });

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const cityFaqs = [
    {
      q: `Are you an authorized Siemens switchgear supplier in ${city.name}?`,
      a: `Yes, Shree Raj Traders is a trusted distributor supplying authentic Siemens low voltage switchgears, contactors, overload relays, and MCCBs directly to companies and infrastructure projects operating across ${city.name} and the wider ${city.district}.`
    },
    {
      q: `How long does it take to deliver motors and switchgear orders to ${city.name}?`,
      a: `Through our robust Gujarat-wide logistics network, we ensure prompt freight handling and safe delivery to industrial zones in ${city.name}. Most standard stock items are dispatched within 24 to 48 hours.`
    },
    {
      q: `Do you supply high-efficiency electric motors in ${city.name}?`,
      a: `Absolutely. We offer high-efficiency three-phase induction motors from Siemens, Crompton Greaves (CGL), and Hindustan Electric Motors, ranging from 0.5 HP to 425 HP complying with IE2, IE3, and IE4 standards.`
    },
    {
      q: `Can we get custom engineering and selection support for our facility in ${city.name}?`,
      a: `Yes, our technical team provides extensive pre-sales consultation, custom RFQ calculations, and commissioning support to ensure you select the optimal electrical and mechanical components for your site requirements.`
    },
    {
      q: `What kinds of FRP composite products do you supply to ${city.name}?`,
      a: `We distribute lightweight, corrosion-proof, and fire-retardant FRP Gratings (Mesh 3838, available in heights of 25mm, 30mm, and 38mm) and FRP Cable Trays (ladder & perforated configurations) tailored for local chemical, wastewater, and infrastructure sites.`
    }
  ];

  return (
    <div data-section="city.page" className="min-h-screen bg-[var(--bg-primary)]">
      <SEO
        title={fill(copy['seo.city'].title)}
        description={fill(copy['seo.city'].description)}
      />
      {/* 1. Dynamic Hero Section with 2D Model Drawing */}
      <section className="hero-section border-b border-[var(--border-color)]">
        {/* Oversized ghost text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display text-[12vw] text-slate-100/50 leading-none uppercase tracking-widest font-black">
            {city.name}
          </span>
        </div>

        <div className="container-page relative z-10">
          <button
            onClick={() => navigate('/locations/')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--accent-orange)] transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backLink}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <span className="eyebrow eyebrow-teal">
                {t.heroEyebrow}
              </span>
              <h1 className="leading-none">
                {fill(t.heroTitle)} <span className="text-orange">{city.name}</span>
              </h1>
              <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl">
                {fill(t.heroIntro)}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => navigate('/contact/#calculator')}
                  className="btn btn-primary inline-flex items-center gap-2.5 shadow-[var(--shadow-glow)]"
                >
                  <FileText className="w-4.5 h-4.5" />
                  {t.ctaRfq}
                </button>
                <button
                  onClick={() => navigate('/products/')}
                  className="btn btn-secondary inline-flex items-center gap-2"
                >
                  <span>{t.ctaCatalog}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2D Landmark Architectural Model Drawing Card */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-xs card p-6 bg-white/90 backdrop-blur-md border-2 border-[var(--border-color)] rounded-3xl text-center shadow-lg hover:border-[var(--accent-orange)] transition-all duration-300">
                <div className="w-36 h-28 mx-auto flex items-center justify-center p-2">
                  <CityLandmarkArt
                    slug={city.slug}
                    className="w-full h-full text-slate-700"
                    accentColor="#d9653b"
                  />
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                  <div className="font-display font-bold text-lg text-[var(--text-main)]">
                    {city.name} Landmark
                  </div>
                  <div className="text-xs font-semibold text-orange mt-0.5">
                    {city.district} Industrial Zone
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Autoscroll Section */}
      <section className="section-tight bg-white border-b border-[var(--border-color)] overflow-hidden">
        <div className="container-page mb-3 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-faint)]">
            {t.brandsStripLabel}
          </span>
        </div>
        <div className="marquee-wrapper relative overflow-hidden py-2 w-full">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="marquee-track flex gap-6 animate-marquee hover:[animation-play-state:paused] cursor-pointer">
            {/* Set 1 */}
            {authorizedBrands.map((brand) => (
              <div key={`brand1-${brand.id}`} className="client-chip w-60 sm:w-68 h-28 px-6 py-3.5 shrink-0 flex flex-col items-center justify-center bg-white border border-[var(--border-color)] rounded-xl hover:border-[var(--accent-orange)] transition">
                <img
                  src={brand.logo.src}
                  alt={brand.logoAlt || `${brand.name} logo`}
                  className="max-h-16 sm:max-h-18 max-w-[85%] object-contain"
                />
              </div>
            ))}
            {/* Set 2 */}
            {authorizedBrands.map((brand) => (
              <div key={`brand2-${brand.id}`} className="client-chip w-60 sm:w-68 h-28 px-6 py-3.5 shrink-0 flex flex-col items-center justify-center bg-white border border-[var(--border-color)] rounded-xl hover:border-[var(--accent-orange)] transition">
                <img
                  src={brand.logo.src}
                  alt={brand.logoAlt || `${brand.name} logo`}
                  className="max-h-16 sm:max-h-18 max-w-[85%] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Detailed Landing Info & Specifications */}
      <section className="section">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Main Rich text column */}
            <div className="lg:col-span-8 card p-8 sm:p-10 space-y-8">
              <div>
                <span className="badge-tag">
                  {t.infoBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wide mt-3">
                  {fill(t.infoTitle)}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-1.5">
                  {fill(t.infoSubtitle)}
                </p>
              </div>

              <hr className="border-[var(--border-color)]" />

              {/* Body copy is authored in the Website Editor, which is behind the
                  admin login — the same trust level as the blog article bodies. */}
              <div
                className="city-body space-y-5 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: fill(t.infoBodyHtml) }}
              />

              {/* Local Industrial Coverage & Logistics Support */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xl sm:text-2xl font-display uppercase">{t.coverageTitle}</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {fill(t.coverageIntro)}
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-[var(--text-main)]">
                  {t.coverageItems.map((item, idx) => {
                    const Icon = COVERAGE_ICONS[idx % COVERAGE_ICONS.length];
                    return (
                      <li
                        key={item.label}
                        className="flex items-center gap-2 p-3 bg-white border border-[var(--border-color)] rounded-lg"
                      >
                        <Icon className="w-4.5 h-4.5 text-orange shrink-0" />
                        {fill(item.label)}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Specs Table */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xl sm:text-2xl font-display uppercase">{t.specsTitle}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {t.specGroups.map((group) => (
                    <div
                      key={group.title}
                      className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]"
                    >
                      <div className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)] mb-2">
                        {group.title}
                      </div>
                      <div className="space-y-1 text-xs">
                        {[1, 2, 3].map((rowNumber) => (
                          <div key={rowNumber} className="flex justify-between">
                            <span className="text-[var(--text-faint)]">{group[`row${rowNumber}Label`]}</span>
                            <span className="font-bold text-[var(--text-main)]">
                              {group[`row${rowNumber}Value`]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky contact widget */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              <div className="card p-6 sm:p-8 border-l-4 border-l-[var(--accent-orange)] space-y-5 bg-white shadow-lg">
                <span className="eyebrow eyebrow-teal">{t.sidebarEyebrow}</span>
                <h3 className="text-xl sm:text-2xl font-display uppercase">{fill(t.sidebarTitle)}</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {fill(t.sidebarIntro)}
                </p>
                <div className="space-y-3.5 pt-2">
                  <a 
                    href={`tel:${companyInfo.telPrimary}`}
                    className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg text-sm font-bold text-[var(--text-main)] hover:bg-[var(--accent-orange-tint)] hover:text-[var(--accent-orange-deep)] transition"
                  >
                    <Phone className="w-4 h-4 text-orange shrink-0" />
                    <span>Call: {companyInfo.phonePrimary}</span>
                  </a>
                  <a 
                    href={`mailto:${companyInfo.emailPrimary}`}
                    className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg text-sm font-bold text-[var(--text-main)] hover:bg-[var(--accent-orange-tint)] hover:text-[var(--accent-orange-deep)] transition"
                  >
                    <Mail className="w-4 h-4 text-orange shrink-0" />
                    <span>Email: {companyInfo.emailPrimary}</span>
                  </a>
                </div>
                <button
                  onClick={() => navigate('/contact/')}
                  className="btn btn-primary w-full inline-flex items-center justify-center gap-2 mt-2"
                >
                  <FileText className="w-4.5 h-4.5" />
                  {t.ctaRfq}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="section section-alt">
        <div className="container-page">
          <div className="section-header text-center">
            <span className="eyebrow">{t.advantageEyebrow}</span>
            <h2 className="section-title">
              {fill(t.advantageTitle)} <span className="text-orange">{city.name}</span>
            </h2>
            <p>{fill(t.advantageIntro)}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.advantageCards.map((card, idx) => {
              const Icon = CARD_ICONS[idx % CARD_ICONS.length];
              return (
                <div
                  key={card.title}
                  className="card p-6 bg-white space-y-3 hover:border-[var(--accent-orange)] transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-orange-tint)] flex items-center justify-center text-[var(--accent-orange-deep)]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-xl tracking-wide uppercase text-[var(--text-main)]">
                    {fill(card.title)}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {fill(card.description)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Interactive FAQ Section */}
      <section className="section">
        <div className="container-page">
          <div className="section-header text-center">
            <span className="eyebrow eyebrow-teal">{t.faqEyebrow}</span>
            <h2 className="section-title">
              {t.faqTitle} <span className="text-orange">{t.faqTitleAccent}</span>
            </h2>
            <p>{fill(t.faqIntro)}</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {cityFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="card bg-white border border-[var(--border-color)] overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 font-bold text-sm sm:text-base text-[var(--text-main)] uppercase hover:text-[var(--accent-orange)] transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 text-[var(--text-faint)] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--accent-orange)]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed bg-[var(--bg-secondary)]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Footer Call To Action & Contact Us */}
      <section className="section section-ink">
        <div className="container-page text-center max-w-2xl mx-auto space-y-6">
          <span className="badge-tag badge-teal">
            {t.finalCtaBadge}
          </span>
          <h2 className="section-title text-white">
            {fill(t.finalCtaTitle)} <span className="text-orange">{city.name}</span>
          </h2>
          <p className="text-sm text-[var(--text-on-dark-muted)] leading-relaxed">
            {fill(t.finalCtaIntro)}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/contact/#calculator')}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <FileText className="w-4.5 h-4.5" />
              <span>{t.finalCtaPrimary}</span>
            </button>
            <a
              href={companyInfo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost-dark inline-flex items-center gap-2"
            >
              <Zap className="w-4.5 h-4.5 text-orange" />
              <span>{t.finalCtaWhatsapp}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
