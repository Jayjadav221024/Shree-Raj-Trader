import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
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
import LocationMapSection from './components/LocationMapSection';
import Footer from './components/Footer';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import LocationsPage from './pages/LocationsPage';
import CityPage from './pages/CityPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CareerPage from './pages/CareerPage';
import OurTeamPage from './pages/OurTeamPage';
import SEO from './components/SEO';
import SectionEditOverlay, { isSectionEditMode } from './components/SectionEditOverlay';
import { SiteContentProvider, useSiteContent } from './lib/siteContent';
import { copy } from './data/sectionCopy';
import { allProducts, productCategories, images } from './data/siteData';
import { resolveImageUrl } from './admin/lib/imageResolver';
import { useQuery } from '@tanstack/react-query';
import api from './admin/lib/axios';

// Admin imports
import QueryProvider from './admin/providers/QueryProvider';
import AuthProvider from './admin/providers/AuthProvider';
import AdminLoginPage from './admin/views/Login';
import AdminDashboardPage from './admin/views/Dashboard';
import AdminUsersPage from './admin/views/AdminUsers';
import UserRolesPage from './admin/views/UserRoles';
import GenericMastersPage from './admin/views/GenericMasters';
import EmailSetupPage from './admin/views/EmailSetup';
import EmailForPage from './admin/views/EmailFor';
import EmailTemplatePage from './admin/views/EmailTemplate';
import WebsiteEditorPage from './admin/views/WebsiteEditor';
import { ProtectedRoute, PublicOnlyRoute } from './admin/components/ProtectedRoute';

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

  // 1. Fetch Categories
  const { data: categoriesData } = useQuery({
    queryKey: ['public-categories'],
    queryFn: async () => {
      const res = await api.get('/public/categories');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000
  });

  // 2. Fetch Products
  const { data: productsData } = useQuery({
    queryKey: ['public-products'],
    queryFn: async () => {
      const res = await api.get('/public/products');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000
  });

  // 3. Fetch Testimonials
  const { data: testimonialsData } = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: async () => {
      const res = await api.get('/public/testimonials');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000
  });

  // 4. Fetch FAQs
  const { data: faqsData } = useQuery({
    queryKey: ['public-faqs'],
    queryFn: async () => {
      const res = await api.get('/public/faqs');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000
  });

  // 5. Fetch Blogs
  const { data: blogsData } = useQuery({
    queryKey: ['public-blogs'],
    queryFn: async () => {
      const res = await api.get('/public/blogs');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000
  });

  // Dynamic mappers
  const resolvedCategories = React.useMemo(() => {
    if (!categoriesData || categoriesData.length === 0) {
      return productCategories;
    }
    const pList = productsData || [];
    return categoriesData.map((cat) => {
      const catProducts = pList.filter((p) => p.categoryId === cat.id);
      return {
        id: cat.id,
        title: cat.title,
        badge: cat.badge,
        description: cat.description,
        imageKey: cat.imageKey,
        imageAlt: cat.imageAlt || cat.title,
        image: resolveImageUrl(cat.imageKey, 'products', 'logo-mini'),
        items: catProducts.map((p) => ({
          slug: p.slug,
          name: p.name,
          brand: p.brand,
          longDescription: p.longDescription,
          applications: p.applications,
          specs: p.specs,
          liveSpecs: p.liveSpecs,
          imageKey: p.imageKey,
          imageAlt: p.imageAlt || p.name,
          image: resolveImageUrl(p.imageKey, 'products', 'logo-mini'),
          ...p.attributes
        }))
      };
    });
  }, [categoriesData, productsData]);

  const resolvedProducts = React.useMemo(() => {
    if (!categoriesData || categoriesData.length === 0) {
      return allProducts;
    }
    return resolvedCategories.flatMap((cat) =>
      cat.items.map((item) => ({
        ...item,
        categoryId: cat.id,
        categoryTitle: cat.title,
        categoryBadge: cat.badge,
        categoryImage: cat.image
      }))
    );
  }, [resolvedCategories, categoriesData]);

  const resolvedBlogs = React.useMemo(() => {
    if (!blogsData || blogsData.length === 0) {
      return null;
    }
    return blogsData.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      readTime: post.readTime,
      imageKey: post.imageKey,
      imageAlt: post.imageAlt || post.title,
      image: resolveImageUrl(post.imageKey, 'blog', 'logo-mini')
    }));
  }, [blogsData]);

  const ALL_ITEMS = resolvedProducts;

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

  const isAdminRoute = pathname.startsWith('/admin');

  // Bumped once the Website Editor's saved content has been merged in. Used as
  // a remount key so every component picks the new copy up in one pass.
  const { version: contentVersion } = useSiteContent();
  const editMode = isSectionEditMode() && !isAdminRoute;

  return (
    <div className="min-h-screen" key={contentVersion}>
      {!isAdminRoute && (
        <Navbar
          onOpenRfq={scrollToRfq}
          onOpenSearch={() => setSearchModalOpen(true)}
        />
      )}

      {editMode && <SectionEditOverlay />}

      <ScrollManager />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SEO
                  title={copy['seo.home'].title}
                  description={copy['seo.home'].description}
                />
                <Hero
                  onOpenRfq={scrollToRfq}
                />

                <FeaturedCategories categories={resolvedCategories} />
                <BrandMatrix onSelectBrand={handleBrandSelect} />
                <DomainSection />
                <TestimonialsSection testimonials={testimonialsData} />
                <JourneySection />
              </>
            }
          />
          <Route path="/about-us/" element={<AboutSection />} />
          <Route path="/about-us" element={<Navigate to="/about-us/" replace />} />
          <Route path="/our-team/" element={<OurTeamPage />} />
          <Route path="/our-team" element={<Navigate to="/our-team/" replace />} />
          <Route path="/products/" element={<ProductCatalog categories={resolvedCategories} products={resolvedProducts} onSelectProductForRfq={handleOpenRfqForProduct} />} />
          <Route path="/products/:category" element={<ProductCatalog categories={resolvedCategories} products={resolvedProducts} onSelectProductForRfq={handleOpenRfqForProduct} />} />
          <Route path="/product/:slug" element={<ProductDetailPage products={resolvedProducts} onSelectProductForRfq={handleOpenRfqForProduct} />} />
          <Route
            path="/contact/"
            element={
              <>
                <ContactSection faqs={faqsData} />
                <RfqCalculator preselectedProduct={selectedProductForRfq} />
              </>
            }
          />
          <Route path="/gallery/" element={<GalleryPage />} />
          <Route path="/blog/" element={<BlogPage blogs={resolvedBlogs} />} />
          <Route path="/blog/:slug/" element={<BlogPostPage blogs={resolvedBlogs} />} />
          <Route path="/locations/" element={<LocationsPage />} />
          <Route path="/locations/:city/" element={<CityPage />} />

          {/* Careers — intentionally unlisted. The route works, but nothing in the
              navbar or footer links to it, so it is reachable only by address.
              Both spellings resolve so a shared link cannot 404 on a missing slash. */}
          <Route path="/career" element={<CareerPage />} />
          <Route path="/career/" element={<CareerPage />} />
          <Route path="/careers" element={<Navigate to="/career/" replace />} />
          <Route path="/careers/" element={<Navigate to="/career/" replace />} />

          {/* Admin panel routes — every screen but the login form sits behind ProtectedRoute */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/login"
            element={
              <PublicOnlyRoute>
                <AdminLoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/setup/admin-users"
            element={
              <ProtectedRoute>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/setup/user-roles"
            element={
              <ProtectedRoute>
                <UserRolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/master/:module"
            element={
              <ProtectedRoute>
                <GenericMastersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cms/email-setup"
            element={
              <ProtectedRoute>
                <EmailSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cms/email-for"
            element={
              <ProtectedRoute>
                <EmailForPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cms/email-template"
            element={
              <ProtectedRoute>
                <EmailTemplatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/website/editor"
            element={
              <ProtectedRoute>
                <WebsiteEditorPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && (
        <>
          <LocationMapSection />
          <Footer />
        </>
      )}

      {/* Search modal */}
      {searchModalOpen && !isAdminRoute && (
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
      <QueryProvider>
        <AuthProvider>
          <SiteContentProvider>
            <AppShell />
          </SiteContentProvider>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}
