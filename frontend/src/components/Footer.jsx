import React from 'react';
import { Phone, Mail, MapPin, ArrowUp, ShieldCheck, Clock, Truck, ChevronRight } from 'lucide-react';
import { companyInfo, siteMeta, groupCompanies, routes } from '../data/siteData';

const QUICK_LINKS = [
  { label: 'Home', href: routes.home.path },
  { label: 'About Us', href: routes.aboutUs.path },
  { label: 'Products', href: '/products/' },
  { label: 'Locations', href: '/locations/' },
  { label: 'Gallery', href: routes.gallery.path },
  { label: 'Blog', href: routes.blog.path },
  { label: 'Contact', href: routes.contact.path }
];

const PRODUCT_LINKS = [
  { label: 'Siemens Switchgears', href: '/products/switchgears' },
  { label: 'Industrial Motors', href: '/products/motors' },
  { label: 'FRP Gratings', href: '/products/gratings' },
  { label: 'FRP Cable Trays', href: '/products/trays' },
  { label: 'Sinnova Range', href: '/product/sinnova' }
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-page">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Overview (5 cols on desktop) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-white p-1 shadow-sm">
                <img
                  src={siteMeta.logo.src}
                  alt="Shree Raj Traders"
                  width={siteMeta.logo.width}
                  height={siteMeta.logo.height}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="font-display text-2xl tracking-wide text-white leading-none">
                SHREE RAJ <span className="text-[var(--accent-orange-bright)]">TRADERS</span>
              </div>
            </div>

            <p className="text-sm text-[var(--text-on-dark-muted)] leading-relaxed max-w-sm">
              Authorized Channel Partner for Siemens, CGL, and HEM. Delivering genuine electro-mechanical switchgears, industrial motors, and FRP composite solutions for over six decades.
            </p>

            {/* Trust Highlights */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-[var(--text-on-dark-muted)]">
                <Clock className="w-3.5 h-3.5 text-[var(--accent-orange-bright)]" />
                60+ Years Trust
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-[var(--text-on-dark-muted)]">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-orange-bright)]" />
                Authorized Partner
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-[var(--text-on-dark-muted)]">
                <Truck className="w-3.5 h-3.5 text-[var(--accent-orange-bright)]" />
                Pan-India Supply
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols on desktop) */}
          <div className="lg:col-span-2">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="space-y-2 mt-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="footer-link group">
                    <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[var(--accent-orange-bright)] group-hover:translate-x-0.5 transition-all mr-1" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Products (3 cols on desktop) */}
          <div className="lg:col-span-3">
            <h4 className="footer-heading">Product Solutions</h4>
            <ul className="space-y-2 mt-3">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="footer-link group">
                    <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[var(--accent-orange-bright)] group-hover:translate-x-0.5 transition-all mr-1" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Alliance (3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="footer-heading">Direct Contact</h4>
            <div className="space-y-3 text-sm mt-3">
              <a href={`tel:${companyInfo.telPrimary}`} className="footer-link flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-[var(--accent-orange-bright)]" />
                </div>
                <span>{companyInfo.phonePrimary}</span>
              </a>

              <a href={`mailto:${companyInfo.emailPrimary}`} className="footer-link flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-[var(--accent-orange-bright)]" />
                </div>
                <span>{companyInfo.emailPrimary}</span>
              </a>

              <div className="footer-link flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-orange-bright)]" />
                </div>
                <span className="text-xs text-[var(--text-on-dark-muted)] leading-relaxed">
                  39, Mahalaxmi Industrial Estate, Vatva, Phase 1, Ahmedabad, Gujarat
                </span>
              </div>
            </div>

            {/* Group Alliance Mini Bar */}
            <div className="pt-3 border-t border-white/10">
              <div className="text-[0.7rem] font-bold uppercase tracking-wider text-white/60 mb-2">
                Group Companies
              </div>
              <div className="flex flex-wrap gap-2">
                {groupCompanies.map((company) => (
                  <span
                    key={company.name}
                    className="text-[0.75rem] px-2 py-0.5 rounded bg-white/5 text-[var(--text-on-dark-muted)] border border-white/10"
                  >
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Sub-Footer / Copyright & Scroll Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-on-dark-muted)] text-center sm:text-left">
            © {new Date().getFullYear()} Shree Raj Traders · All Rights Reserved · Authorized Industrial Distributor
          </p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn btn-ghost-dark btn-sm inline-flex items-center gap-2"
          >
            Back to Top
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
