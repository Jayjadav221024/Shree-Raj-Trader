import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, ChevronDown, Phone } from 'lucide-react';
import { companyInfo, routes, navMenus } from '../data/siteData';
import { copy } from '../data/sectionCopy';

export default function Navbar({ onOpenRfq }) {
  const c = copy['global.navbar'];
  const PRODUCT_GROUPS = c.productGroups;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);

  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '';
  const showLogo = !isHomePage || scrolled;

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 70);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header
      data-section="global.navbar"
      className={`site-header transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled ? 'site-header-scrolled py-3' : 'py-4'}`}
    >
      <div className="container-page flex items-center justify-between gap-4">
        {/* Left cluster: Wordmark (collapsible) + Desktop Nav */}
        <div className="flex items-center">
          {/* Wordmark with ultra-smooth grid-template-columns expansion */}
          <div
            className="grid transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 will-change-[grid-template-columns]"
            style={{ gridTemplateColumns: showLogo ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden min-w-0">
              <div
                className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pr-8 flex items-center will-change-[transform,opacity] ${
                  showLogo
                    ? 'opacity-100 translate-x-0 blur-0 pointer-events-auto'
                    : 'opacity-0 -translate-x-8 blur-[1px] pointer-events-none'
                }`}
              >
                <a
                  href={routes.home.path}
                  className="flex items-center gap-3 group shrink-0 logo-3d-container py-1 whitespace-nowrap"
                >
                  <div className="leading-none logo-text-3d">
                    <div className="font-display text-xl sm:text-2xl tracking-wide font-extrabold group-hover:scale-[1.02] transition-transform">
                      <span className="logo-gradient-text">{c.wordmarkPrimary}</span>{' '}
                      <span className="logo-gradient-accent">{c.wordmarkAccent}</span>
                    </div>
                    <div className="text-[10px] font-bold tracking-[0.16em] uppercase logo-sub-gradient mt-1">
                      {c.wordmarkSub}
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <a href={routes.home.path} className="nav-link">{c.navHome}</a>

            <a href={routes.aboutUs.path} className="nav-link">{c.navAbout}</a>

            <a href={routes.gallery.path} className="nav-link">{c.navGallery}</a>

            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => {
                setActiveDropdown(null);
                setActiveSubmenu(null);
              }}
            >
              <a href="/products/" className="nav-link flex items-center gap-1 py-2 cursor-pointer">
                {c.navProducts} <ChevronDown className="w-3.5 h-3.5" />
              </a>
              {activeDropdown === 'products' && (
                <div className="absolute top-full left-0 w-56 dropdown-panel animate-fadeIn z-50">
                  {PRODUCT_GROUPS.map((group) => (
                    <div
                      key={group.key}
                      className="relative"
                      onMouseEnter={() => setActiveSubmenu(group.key)}
                      onMouseLeave={() => setActiveSubmenu(null)}
                    >
                      <a href={`/products/${group.key}`} className="dropdown-item">
                        <span>{group.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                      </a>
                      {activeSubmenu === group.key && (
                        <div className="absolute left-full top-0 ml-1 w-64 dropdown-panel animate-fadeIn">
                          {(navMenus.products[group.key] || []).map((link) => (
                            <a key={link.label} href={link.href} className="dropdown-item">
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <a href="/locations/" className="nav-link">{c.navLocations}</a>
            <a href={routes.blog.path} className="nav-link">{c.navBlog}</a>
            <a href={routes.contact.path} className="nav-link">{c.navContact}</a>
          </nav>
        </div>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0 ml-auto">
          <button onClick={onOpenRfq} className="btn btn-primary btn-sm">
            {c.ctaQuote}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-lg bg-white border border-[var(--border-color)] text-[var(--text-main)] ml-auto"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[var(--border-color)] px-6 py-6 space-y-1 animate-fadeIn max-h-[80vh] overflow-y-auto">
          <a href={routes.home.path} onClick={closeMobile} className="block py-2.5 nav-link">{c.navHome}</a>

          <a href={routes.aboutUs.path} onClick={closeMobile} className="block py-2.5 nav-link">{c.navAbout}</a>

          <a href={routes.gallery.path} onClick={closeMobile} className="block py-2.5 nav-link">{c.navGallery}</a>

          <div>
            <button
              onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
              className="w-full flex items-center justify-between py-2.5 nav-link"
            >
              <span>{c.navProducts}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileProductsOpen && (
              <div className="pl-4 border-l border-[var(--border-color)] space-y-1 mb-2">
                {PRODUCT_GROUPS.map((group) => (
                  <div key={group.key}>
                    <button
                      onClick={() => setMobileSubmenu(mobileSubmenu === group.key ? null : group.key)}
                      className="w-full flex items-center justify-between py-2 text-sm font-semibold text-[var(--text-muted)]"
                    >
                      <span>{group.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileSubmenu === group.key ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileSubmenu === group.key && (
                      <div className="pl-4 border-l border-[var(--border-color)] space-y-1">
                        {(navMenus.products[group.key] || []).map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            onClick={closeMobile}
                            className="block py-1.5 text-xs text-[var(--text-faint)] hover:text-[var(--accent-orange)]"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <a href="/locations/" onClick={closeMobile} className="block py-2.5 nav-link">{c.navLocations}</a>
          <a href={routes.blog.path} onClick={closeMobile} className="block py-2.5 nav-link">{c.navBlog}</a>
          <a href={routes.contact.path} onClick={closeMobile} className="block py-2.5 nav-link">{c.navContact}</a>

          <div className="pt-4 mt-2 border-t border-[var(--border-color)] flex flex-col gap-2.5">
            <button
              onClick={() => {
                closeMobile();
                onOpenRfq();
              }}
              className="btn btn-primary w-full"
            >
              {c.ctaQuote}
            </button>
            <a href={`tel:${companyInfo.telPrimary}`} className="btn btn-secondary w-full">
              <Phone className="w-4 h-4 text-orange" />
              {companyInfo.phonePrimary}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
