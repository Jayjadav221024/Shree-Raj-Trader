import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BrandMatrix from './components/BrandMatrix';
import FeaturedCategories from './components/FeaturedCategories';
import JourneySection from './components/JourneySection';
import AboutSection from './components/AboutSection';
import ProductCatalog from './components/ProductCatalog';
import RfqCalculator from './components/RfqCalculator';
import DomainSection from './components/DomainSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import LocationsPage from './pages/LocationsPage';
import CityPage from './pages/CityPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SEO from './components/SEO';
import { allProducts } from './data/siteData';

const ALL_ITEMS = allProducts;

/** Scrolls to top on route change, or to the hash target when one is present. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

function AppShell() {
  const [selectedProductForRfq, setSelectedProductForRfq] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') setSearchModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  /** Scrolls to a homepage section, navigating home first when off-route. */
  const goToSection = (id) => {
    if (pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToRfq = () => {
    navigate('/contact/');
  };

  const handleOpenRfqForProduct = (product) => {
    setSelectedProductForRfq(product);
    navigate('/contact/');
  };

  const handleBrandSelect = () => {
    navigate('/products/');
  };

  const query = globalSearchQuery.trim().toLowerCase();
  const searchResults = query
    ? ALL_ITEMS.filter((item) =>
        [item.name, item.brand, item.categoryTitle].filter(Boolean).join(' ').toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="min-h-screen">
      <Navbar
        onOpenRfq={scrollToRfq}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      <ScrollManager />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SEO
                  title="Siemens Switchgears, Motors & FRP Solutions"
                  description="Shree Raj Traders is a trusted distributor of Siemens low-voltage switchgears, CGL and Hindustan electric motors, FRP gratings, and FRP cable trays in Ahmedabad, Gujarat."
                />
                <Hero
                  onOpenRfq={scrollToRfq}
                />

                <FeaturedCategories />
                <BrandMatrix onSelectBrand={handleBrandSelect} />
                <DomainSection />
                <TestimonialsSection />
                <JourneySection />
              </>
            }
          />
          <Route path="/about-us/" element={<AboutSection />} />
          <Route path="/products/" element={<ProductCatalog onSelectProductForRfq={handleOpenRfqForProduct} />} />
          <Route path="/products/:category" element={<ProductCatalog onSelectProductForRfq={handleOpenRfqForProduct} />} />
          <Route path="/product/:slug" element={<ProductDetailPage onSelectProductForRfq={handleOpenRfqForProduct} />} />
          <Route
            path="/contact/"
            element={
              <>
                <ContactSection />
                <RfqCalculator preselectedProduct={selectedProductForRfq} />
              </>
            }
          />
          <Route path="/gallery/" element={<GalleryPage />} />
          <Route path="/blog/" element={<BlogPage />} />
          <Route path="/blog/:slug/" element={<BlogPostPage />} />
          <Route path="/locations/" element={<LocationsPage />} />
          <Route path="/locations/:city/" element={<CityPage />} />
        </Routes>
      </main>

      <Footer />

      {/* Search modal */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 z-[1100] bg-[rgba(14,26,43,0.55)] backdrop-blur-sm flex items-start justify-center pt-24 p-4 animate-fadeIn"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-[18px] p-6 relative shadow-[var(--shadow-lift)] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
              <Search className="w-5 h-5 text-orange shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search motors, switchgears, FRP..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {!query ? (
                <p className="p-8 text-center text-sm text-[var(--text-faint)]">
                  Try &quot;Siemens&quot;, &quot;MCCB&quot;, &quot;Sinnova&quot; or &quot;Grit Top&quot;.
                </p>
              ) : searchResults.length === 0 ? (
                <p className="p-8 text-center text-sm text-[var(--text-muted)]">
                  No products found for &quot;{globalSearchQuery}&quot;.
                </p>
              ) : (
                searchResults.map((item) => (
                  <Link
                    key={`${item.categoryId}-${item.name}`}
                    to={`/product/${item.slug}`}
                    onClick={() => setSearchModalOpen(false)}
                    className="w-full p-4 rounded-[12px] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--accent-orange)] transition flex items-center justify-between gap-4 text-left group block"
                  >
                    <div>
                      <div className="font-bold text-[var(--text-main)] group-hover:text-[var(--accent-orange)] transition text-sm">
                        {item.name}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">
                        <span className="text-teal font-bold">{item.brand || item.categoryTitle}</span>
                        {item.outputPower && <span> · {item.outputPower}</span>}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--text-faint)] group-hover:text-[var(--accent-orange)] group-hover:translate-x-1 transition shrink-0" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
