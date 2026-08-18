import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Phone, Mail, FileText, ArrowLeft, ArrowRight, 
  ShieldCheck, Truck, Zap, Plus, Minus, CheckCircle, ChevronDown,
  Building2, HardHat, Link, Star
} from 'lucide-react';
import { CITIES } from '../data/cities';
import { companyInfo, authorizedBrands } from '../data/siteData';
import SEO from '../components/SEO';

export default function CityPage() {
  const { city: citySlug } = useParams();
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const city = CITIES.find((c) => c.slug === citySlug.toLowerCase());

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 bg-[var(--bg-primary)]">
        <h2 className="font-display text-3xl text-[var(--text-main)]">Location Not Found</h2>
        <button onClick={() => navigate('/locations/')} className="btn btn-primary mt-4">
          View All Locations
        </button>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEO
        title={`Siemens Switchgears & Motors Supplier in ${city.name}`}
        description={`Authorized distributor of Siemens low-voltage switchgears, CGL and Hindustan electric motors, FRP gratings and cable trays in ${city.name}, ${city.district}, Gujarat.`}
      />
      {/* 1. Dynamic Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 border-b border-[var(--border-color)] bg-gradient-to-b from-white to-[var(--bg-primary)]">
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
            Back to Locations
          </button>

          <div className="max-w-3xl space-y-6">
            <span className="eyebrow eyebrow-teal">
              Industrial Solutions Hub
            </span>
            <h1 className="leading-none">
              Siemens Switchgears &amp; Motors Supplier in <span className="text-orange">{city.name}</span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl">
              Authorized distribution &amp; technical supply channel network serving the manufacturing hubs and industrial zones of {city.district}, Gujarat.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate('/contact/')}
                className="btn btn-primary inline-flex items-center gap-2.5 shadow-[var(--shadow-glow)]"
              >
                <FileText className="w-4.5 h-4.5" />
                Request Custom RFQ
              </button>
              <button
                onClick={() => navigate('/products/')}
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                <span>View Products Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Autoscroll Section */}
      <section className="py-8 bg-white border-b border-[var(--border-color)] overflow-hidden">
        <div className="container-page mb-3 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-faint)]">
            Supplying Genuine Products From Trusted Global Brands
          </span>
        </div>
        <div className="marquee-wrapper relative overflow-hidden py-2 w-full">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="marquee-track flex gap-8 animate-marquee hover:[animation-play-state:paused] cursor-pointer">
            {/* Set 1 */}
            {authorizedBrands.map((brand) => (
              <div key={`brand1-${brand.id}`} className="client-chip w-44 shrink-0 flex flex-col items-center justify-center p-4 bg-white border border-[var(--border-color)] rounded-lg hover:border-[var(--accent-orange)] transition">
                <img
                  src={brand.logo.src}
                  alt={`${brand.name} logo`}
                  className="max-h-10 max-w-full object-contain"
                />
              </div>
            ))}
            {/* Set 2 */}
            {authorizedBrands.map((brand) => (
              <div key={`brand2-${brand.id}`} className="client-chip w-44 shrink-0 flex flex-col items-center justify-center p-4 bg-white border border-[var(--border-color)] rounded-lg hover:border-[var(--accent-orange)] transition">
                <img
                  src={brand.logo.src}
                  alt={`${brand.name} logo`}
                  className="max-h-10 max-w-full object-contain"
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
                  Authorized Supply Channel
                </span>
                <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wide mt-3">
                  Delivering Engineered Excellence to {city.name}
                </h2>
                <p className="text-sm text-[var(--text-muted)] mt-1.5">
                  Serving Industrial Areas, Manufacturing Plants &amp; Engineering Contractors in {city.name}.
                </p>
              </div>

              <hr className="border-[var(--border-color)]" />

              <div className="space-y-5 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                <p>
                  Shree Raj Traders is your premier source for industrial components and engineering solutions. As a trusted supplier, we deliver highly reliable electro-mechanical equipment directly to companies, manufacturing facilities, and workshops operating across <strong>{city.name}</strong> and the surrounding industrial zones in <strong>{city.district}</strong>. Our service catalog features a broad range of products designed to handle heavy industrial requirements while maintaining top energy efficiency ratings.
                </p>
                <p>
                  We supply authentic <strong>Siemens low voltage switchgears</strong>, contactors (available in frame sizes S00 to S12 supporting operational currents from 7A to 500A), overload relays, and Molded Case Circuit Breakers (MCCBs). In addition to switchgears, we stock and distribute high-efficiency three-phase induction motors from leading brands such as <strong>Siemens</strong>, <strong>CGL (Crompton Greaves)</strong>, and <strong>Hindustan Electric Motors</strong>. Ranging from 0.5 HP to 425 HP, these motors comply with the latest standards, offering IE2, IE3, and IE4 efficiency classes for significant energy savings and operational reliability.
                </p>
                <p>
                  Furthermore, we are a major distributor of composite materials, including corrosion-resistant <strong>FRP gratings</strong> and <strong>FRP cable trays</strong> (including ladder type and perforated configurations).
                </p>
              </div>

              {/* Local Industrial Coverage & Logistics Support */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xl sm:text-2xl font-display uppercase">Regional Coverage &amp; Key Highlights</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Our customized freight and logistics dispatch networks provide prompt, reliable service to various business zones and infrastructure sites within {city.name} and Gujarat:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-[var(--text-main)]">
                  <li className="flex items-center gap-2 p-3 bg-white border border-[var(--border-color)] rounded-lg">
                    <Building2 className="w-4.5 h-4.5 text-orange shrink-0" />
                    Direct delivery to GIDC &amp; SEZ zones
                  </li>
                  <li className="flex items-center gap-2 p-3 bg-white border border-[var(--border-color)] rounded-lg">
                    <HardHat className="w-4.5 h-4.5 text-orange shrink-0" />
                    Technical consultation at project sites
                  </li>
                  <li className="flex items-center gap-2 p-3 bg-white border border-[var(--border-color)] rounded-lg">
                    <Link className="w-4.5 h-4.5 text-orange shrink-0" />
                    Seamless supply chain linkages
                  </li>
                  <li className="flex items-center gap-2 p-3 bg-white border border-[var(--border-color)] rounded-lg">
                    <Star className="w-4.5 h-4.5 text-orange shrink-0" />
                    Authorized warranty validation
                  </li>
                </ul>
              </div>

              {/* Specs Table */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xl sm:text-2xl font-display uppercase">Industrial Portfolios &amp; Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
                    <div className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)] mb-2">Switchgears</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-[var(--text-faint)]">Range</span><span className="font-bold text-[var(--text-main)]">16A to 1250A</span></div>
                      <div className="flex justify-between"><span className="text-[var(--text-faint)]">Type</span><span className="font-bold text-[var(--text-main)]">ACB, MCCB, Contactors</span></div>
                      <div className="flex justify-between"><span className="text-[var(--text-faint)]">Standard</span><span className="font-bold text-[var(--text-main)]">IEC 60947</span></div>
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
                    <div className="font-bold text-xs uppercase tracking-wider text-[var(--text-main)] mb-2">Electric Motors</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-[var(--text-faint)]">Capacity</span><span className="font-bold text-[var(--text-main)]">0.5 HP to 425 HP</span></div>
                      <div className="flex justify-between"><span className="text-[var(--text-faint)]">Protection</span><span className="font-bold text-[var(--text-main)]">IP55 / IP56 / IP65</span></div>
                      <div className="flex justify-between"><span className="text-[var(--text-faint)]">Efficiency</span><span className="font-bold text-[var(--text-main)]">IE2 / IE3 / IE4</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky contact widget */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
              <div className="card p-6 sm:p-8 border-l-4 border-l-[var(--accent-orange)] space-y-5 bg-white shadow-lg">
                <span className="eyebrow eyebrow-teal">Fast Dispatch</span>
                <h3 className="text-xl sm:text-2xl font-display uppercase">Get Pricing for {city.name}</h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Request custom product pricing and freight rates directly for your infrastructure and maintenance requirements.
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
                  Request Custom RFQ
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
            <span className="eyebrow">The Shreeraj Advantage</span>
            <h2 className="section-title">
              Why Choose Us in <span className="text-orange">{city.name}</span>
            </h2>
            <p>
              Combining 6 decades of experience with brand reliability and rapid support channels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 bg-white space-y-3 hover:border-[var(--accent-orange)] transition">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-orange-tint)] flex items-center justify-center text-[var(--accent-orange-deep)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl tracking-wide uppercase text-[var(--text-main)]">100% Genuine Brands</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Directly sourced from Siemens, Crompton Greaves, and Hindustan Electric Motors ensuring genuine products with warranty.
              </p>
            </div>

            <div className="card p-6 bg-white space-y-3 hover:border-[var(--accent-orange)] transition">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-orange-tint)] flex items-center justify-center text-[var(--accent-orange-deep)]">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl tracking-wide uppercase text-[var(--text-main)]">Reliable Logistics</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Dedicated transport channels handling heavy consignments and direct freight shipping to factories across {city.name}.
              </p>
            </div>

            <div className="card p-6 bg-white space-y-3 hover:border-[var(--accent-orange)] transition">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-orange-tint)] flex items-center justify-center text-[var(--accent-orange-deep)]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl tracking-wide uppercase text-[var(--text-main)]">Technical Consultation</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Product engineering advisory assisting you with the selection of correct ratings, starters, gear ratios, and finishes.
              </p>
            </div>

            <div className="card p-6 bg-white space-y-3 hover:border-[var(--accent-orange)] transition">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-orange-tint)] flex items-center justify-center text-[var(--accent-orange-deep)]">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl tracking-wide uppercase text-[var(--text-main)]">60+ Years Trust</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Backed by six decades of reputation in electro-mechanical trading, distribution, and custom solutions in Gujarat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive FAQ Section */}
      <section className="section">
        <div className="container-page">
          <div className="section-header text-center">
            <span className="eyebrow eyebrow-teal">Common Queries</span>
            <h2 className="section-title">
              Frequently Asked <span className="text-orange">Questions</span>
            </h2>
            <p>
              Have questions about switchgear supply, logistics, or custom order estimates?
            </p>
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
            Industrial Procurement partner
          </span>
          <h2 className="section-title text-white">
            Procure Premium Switchgear &amp; Motors for your Project in <span className="text-orange">{city.name}</span>
          </h2>
          <p className="text-sm text-[var(--text-on-dark-muted)] leading-relaxed">
            Get technical assistance on selection, quick pricing calculations, and fast logistics handling to your facility site.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/contact/')}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <FileText className="w-4.5 h-4.5" />
              <span>Open Smart RFQ</span>
            </button>
            <a 
              href={companyInfo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost-dark inline-flex items-center gap-2"
            >
              <Zap className="w-4.5 h-4.5 text-orange" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
