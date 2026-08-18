import React, { useState, useEffect } from 'react';
import { Search, Phone, Menu, X, ChevronRight, ChevronDown } from 'lucide-react';
import { companyInfo, routes, navMenus, siteMeta } from '../data/siteData';

const PRODUCT_GROUPS = [
  { key: 'switchgears', label: 'Switchgears' },
  { key: 'motors', label: 'Motors' },
  { key: 'gratings', label: 'FRP Gratings' },
  { key: 'trays', label: 'FRP Cable Tray' }
];

export default function Navbar({ onOpenRfq, onOpenSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className={`site-header ${scrolled ? 'site-header-scrolled py-3' : 'py-4'}`}>
      <div className="container-page flex items-center justify-between gap-6">
        {/* Wordmark */}
        <a href={routes.home.path} className="flex items-center gap-3 group shrink-0 logo-3d-container">
          <div className="leading-none logo-text-3d">
            <div className="font-display text-xl sm:text-2xl tracking-wide text-[var(--text-main)] group-hover:text-[var(--accent-orange)] transition-colors">
              SHREE RAJ <span className="text-orange">TRADERS</span>
            </div>
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-faint)] mt-1">
              Siemens · CGL · Hindustan
            </div>
          </div>
        </a>



        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5">
          <a href={routes.home.path} className="nav-link">Home</a>

          {/* About */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('about')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="nav-link flex items-center gap-1 py-2">
              About Us <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {activeDropdown === 'about' && (
              <div className="absolute top-full left-0 w-60 dropdown-panel animate-fadeIn z-50">
                {navMenus.about.map((link) => (
                  <a key={link.label} href={link.href} className="dropdown-item">
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href={routes.gallery.path} className="nav-link">Gallery</a>

          {/* Products */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('products')}
            onMouseLeave={() => {
              setActiveDropdown(null);
              setActiveSubmenu(null);
            }}
          >
            <button className="nav-link flex items-center gap-1 py-2">
              Products <ChevronDown className="w-3.5 h-3.5" />
            </button>
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
                        {navMenus.products[group.key].map((link) => (
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

          <a href="/locations/" className="nav-link">Locations</a>
          <a href={routes.blog.path} className="nav-link">Blog</a>
          <a href={routes.contact.path} className="nav-link">Contact</a>
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSearch}
            title="Search catalog (Ctrl+K)"
            className="p-2.5 rounded-lg bg-white border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--accent-orange)] hover:border-[var(--accent-orange)] transition"
          >
            <Search className="w-4 h-4" />
          </button>

          <a
            href={`tel:${companyInfo.telPrimary}`}
            className="hidden xl:inline-flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold hover:border-[var(--accent-orange)] transition"
          >
            <Phone className="w-3.5 h-3.5 text-orange" />
            {companyInfo.phonePrimary}
          </a>

          <button onClick={onOpenRfq} className="btn btn-primary btn-sm">
            Get Quote
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-lg bg-white border border-[var(--border-color)] text-[var(--text-main)]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[var(--border-color)] px-6 py-6 space-y-1 animate-fadeIn max-h-[80vh] overflow-y-auto">
          <a href={routes.home.path} onClick={closeMobile} className="block py-2.5 nav-link">Home</a>

          <div>
            <button
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              className="w-full flex items-center justify-between py-2.5 nav-link"
            >
              <span>About Us</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileAboutOpen && (
              <div className="pl-4 border-l border-[var(--border-color)] space-y-1 mb-2">
                {navMenus.about.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMobile}
                    className="block py-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--accent-orange)]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href={routes.gallery.path} onClick={closeMobile} className="block py-2.5 nav-link">Gallery</a>

          <div>
            <button
              onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
              className="w-full flex items-center justify-between py-2.5 nav-link"
            >
              <span>Products</span>
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
                        {navMenus.products[group.key].map((link) => (
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

          <a href="/locations/" onClick={closeMobile} className="block py-2.5 nav-link">Locations</a>
          <a href={routes.blog.path} onClick={closeMobile} className="block py-2.5 nav-link">Blog</a>
          <a href={routes.contact.path} onClick={closeMobile} className="block py-2.5 nav-link">Contact</a>

          <div className="pt-4 mt-2 border-t border-[var(--border-color)] flex flex-col gap-2.5">
            <button
              onClick={() => {
                closeMobile();
                onOpenRfq();
              }}
              className="btn btn-primary w-full"
            >
              Get Quote
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
