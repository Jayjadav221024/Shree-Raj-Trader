import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, FileText, ArrowRight, X, LayoutGrid, List, SlidersHorizontal, Layers, CheckCircle2 } from 'lucide-react';
import { productCategories } from '../data/siteData';
import { copy } from '../data/sectionCopy';
import { fillTemplate } from '../lib/siteContent';
import SEO from './SEO';

const CATEGORY_MAP = {
  'switchgears': 'switchgears',
  'motors': 'motors',
  'gearbox': 'gearboxes',
  'gear-box': 'gearboxes',
  'gearboxes': 'gearboxes',
  'gratings': 'frp-gratings',
  'frp-gratings': 'frp-gratings',
  'trays': 'frp-cable-trays',
  'frp-cable-trays': 'frp-cable-trays',
  'frp-cable-tray': 'frp-cable-trays'
};

// Spec keys promoted onto the card face, in display order.
const CARD_SPECS = [
  ['outputPower', 'Output Power'],
  ['ratedCurrent', 'Rated Current'],
  ['operationalCurrent', 'Operational Current'],
  ['breakingCapacity', 'Breaking Capacity'],
  ['torqueCapacity', 'Torque'],
  ['voltage', 'Voltage'],
  ['heights', 'Heights'],
  ['surfaceFinish', 'Surface']
];

export default function ProductCatalog({ onSelectProductForRfq, categories: propCategories, products: propProducts }) {
  const { category } = useParams();
  const navigate = useNavigate();

  const categories = propCategories || productCategories;
  const c = copy['products.header'];
  const seo = copy['seo.products'];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'name-asc' | 'name-desc' | 'brand'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const tabs = useMemo(() => [
    { id: 'all', label: c.allTabLabel || 'All Products' },
    ...categories.map((cat) => ({ id: cat.id, label: cat.title }))
  ], [categories, c.allTabLabel]);

  const getNormalizedCategory = (cat) => {
    if (!cat) return 'all';
    const normalized = CATEGORY_MAP[cat] || cat;
    return tabs.some(t => t.id === normalized) ? normalized : 'all';
  };

  const initialTab = getNormalizedCategory(category);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync activeTab when category route param changes
  React.useEffect(() => {
    const normalized = getNormalizedCategory(category);
    setActiveTab(normalized);
  }, [category, tabs]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'all') {
      navigate('/products/');
    } else {
      const reverseMap = {
        'gearboxes': 'gearbox',
        'frp-gratings': 'gratings',
        'frp-cable-trays': 'trays'
      };
      const urlParam = reverseMap[tabId] || tabId;
      navigate(`/products/${urlParam}`);
    }
  };

  const allProducts = useMemo(() => {
    if (propProducts && propProducts.length > 0) {
      return propProducts;
    }
    return categories.flatMap((cat) =>
      cat.items.map((item) => ({
        ...item,
        categoryId: cat.id,
        categoryTitle: cat.title,
        categoryBadge: cat.badge,
        categoryImage: cat.image
      }))
    );
  }, [propProducts, categories]);

  // Extract available brands for filter pills
  const availableBrands = useMemo(() => {
    const brandsSet = new Set();
    allProducts.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return ['All Brands', ...Array.from(brandsSet)];
  }, [allProducts]);

  // Filtered & Sorted products list
  const filteredAndSortedProducts = useMemo(() => {
    let list = allProducts.filter((p) => {
      return activeTab === 'all' || p.categoryId === activeTab;
    });

    // Search filter
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.categoryTitle && p.categoryTitle.toLowerCase().includes(q)) ||
        (p.applications && p.applications.toLowerCase().includes(q))
      );
    }

    // Brand filter
    if (selectedBrand !== 'All Brands') {
      list = list.filter((p) => p.brand === selectedBrand);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (sortBy === 'name-desc') {
        return (b.name || '').localeCompare(a.name || '');
      }
      if (sortBy === 'brand') {
        return (a.brand || '').localeCompare(b.brand || '');
      }
      return 0;
    });

    return list;
  }, [allProducts, activeTab, searchQuery, selectedBrand, sortBy]);

  const activeCategoryObj = categories.find((cat) => cat.id === activeTab);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEO
        title={
          activeTab === 'all'
            ? seo.title
            : fillTemplate(seo.categoryTitle, {
                category: activeCategoryObj?.title || '',
              })
        }
        description={seo.description}
      />

      {/* Header Section */}
      <section
        data-section="products.header"
        className="section-tight section-alt page-top-spacing border-b border-[var(--border-color)] relative overflow-hidden"
      >
        <div className="container-page relative z-10">
          <div className="max-w-3xl">
            <span className="eyebrow eyebrow-teal">Industrial Equipment & Components</span>
            <h1 className="section-title mt-2">
              {activeTab === 'all' ? (
                <>
                  Industrial <span className="text-orange">Catalog</span>
                </>
              ) : (
                <>
                  {activeCategoryObj?.title} <span className="text-orange">Range</span>
                </>
              )}
            </h1>
            <p className="section-subtitle !text-left !mx-0 mt-3">
              {activeTab === 'all'
                ? c.intro
                : activeCategoryObj?.description || c.intro}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pt-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[var(--accent-orange)] text-white border-[var(--accent-orange)] shadow-[var(--shadow-glow)] font-bold'
                      : 'bg-white border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] shadow-xs hover:shadow-sm'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="pt-8 pb-4">
        <div className="container-page">
          <div className="card p-5 bg-white border border-[var(--border-color)] shadow-xs rounded-2xl space-y-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Live Search Input */}
              <div className="relative w-full lg:max-w-md">
                <Search className="w-4 h-4 text-[var(--text-faint)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search motors, switchgears, cable trays by name, rating or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent-orange)] focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-faint)] hover:text-[var(--text-main)] cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Selector & View Toggle */}
              <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[var(--text-muted)] shrink-0 hidden sm:inline" />
                  <span className="text-xs font-semibold text-[var(--text-muted)] hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-orange)] cursor-pointer"
                  >
                    <option value="featured">Featured Order</option>
                    <option value="name-asc">Product Name (A - Z)</option>
                    <option value="name-desc">Product Name (Z - A)</option>
                    <option value="brand">By Brand</option>
                  </select>
                </div>

                {/* View Toggle: Grid vs List */}
                <div className="flex items-center p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                      viewMode === 'grid'
                        ? 'bg-white text-[var(--accent-orange)] shadow-xs font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                    aria-label="Grid View"
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                      viewMode === 'list'
                        ? 'bg-white text-[var(--accent-orange)] shadow-xs font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                    aria-label="List View"
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Brand Filter Chips & Results Count */}
            {availableBrands.length > 2 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--border-color)]">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  <span className="text-xs font-semibold text-[var(--text-muted)] shrink-0 mr-1">Brand:</span>
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        selectedBrand === brand
                          ? 'bg-[var(--accent-cyan)] text-white shadow-xs'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-color)]'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>

                <div className="text-xs font-semibold text-[var(--text-muted)] shrink-0 self-end sm:self-center">
                  Showing <span className="font-bold text-[var(--text-main)]">{filteredAndSortedProducts.length}</span> products
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product Grid / List Area */}
      <section className="section pt-4 pb-16">
        <div className="container-page">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="card p-16 text-center max-w-lg mx-auto my-8 bg-white border border-[var(--border-color)] rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-orange-tint)] flex items-center justify-center mx-auto mb-4 text-[var(--accent-orange-deep)]">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[var(--text-main)]">No Matching Products</h3>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              No products found matching your search or filters. Try clearing your filters or exploring all categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBrand('All Brands');
                handleTabClick('all');
              }}
              className="btn btn-secondary btn-sm mt-6 inline-flex items-center gap-2 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedProducts.map((item) => (
              <article
                key={`${item.categoryId}-${item.name}`}
                className="card card-hover flex flex-col overflow-hidden group bg-white border border-[var(--border-color)] rounded-2xl shadow-xs justify-between"
              >
                <div>
                  {/* Image Container */}
                  <Link
                    to={`/product/${item.slug}`}
                    className="relative h-60 bg-[var(--bg-secondary)] overflow-hidden flex items-center justify-center p-6 border-b border-[var(--border-color)] group-hover:bg-[var(--accent-orange-tint)]/20 transition-colors block"
                  >
                    {item.image?.src && (
                      <img
                        src={item.image.src}
                        alt={item.imageAlt || `${item.name}${item.brand ? ` by ${item.brand}` : ''}`}
                        width={item.image.width}
                        height={item.image.height}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <span className="badge-tag absolute top-4 left-4 bg-white/95 backdrop-blur-xs shadow-xs z-10 text-[11px] font-bold text-[var(--accent-cyan)]">
                      {item.brand || item.categoryBadge || item.categoryTitle}
                    </span>
                  </Link>

                  {/* Content */}
                  <div className="p-6 sm:p-7 pb-4">
                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight">
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-[var(--text-main)] group-hover:text-[var(--accent-orange)] transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                    </h3>

                    {item.applications && (
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed line-clamp-2">
                        {item.applications}
                      </p>
                    )}

                    {/* Spec Sheet */}
                    <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
                      {CARD_SPECS.filter(([key]) => item[key]).slice(0, 3).map(([key, label]) => (
                        <div key={key} className="spec-row flex items-center justify-between py-1 border-b border-dashed border-[var(--border-color)]/60 text-xs">
                          <span className="text-[var(--text-muted)] font-medium">{label}</span>
                          <span className="text-[var(--text-main)] font-bold">{item[key]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 sm:p-7 pt-0">
                  <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-color)]">
                    <Link
                      to={`/product/${item.slug}`}
                      className="btn btn-secondary btn-sm flex-1 justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-orange" />
                      Details
                    </Link>
                    <button
                      onClick={() => onSelectProductForRfq && onSelectProductForRfq(item)}
                      className="btn btn-primary btn-sm flex-1 justify-center gap-1.5 cursor-pointer"
                    >
                      Get Quote
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredAndSortedProducts.map((item) => (
              <article
                key={`${item.categoryId}-${item.name}`}
                className="card card-hover p-5 sm:p-6 bg-white border border-[var(--border-color)] rounded-2xl flex flex-col md:flex-row gap-6 items-center group justify-between"
              >
                <div className="flex flex-col md:flex-row gap-6 items-center w-full md:w-auto flex-1">
                  <Link
                    to={`/product/${item.slug}`}
                    className="w-full md:w-48 h-40 bg-[var(--bg-secondary)] rounded-xl overflow-hidden flex items-center justify-center p-4 shrink-0 border border-[var(--border-color)] relative block group-hover:bg-[var(--accent-orange-tint)]/20 transition-colors"
                  >
                    {item.image?.src && (
                      <img
                        src={item.image.src}
                        alt={item.imageAlt || `${item.name}`}
                        width={item.image.width}
                        height={item.image.height}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    )}
                    <span className="badge-tag absolute top-2.5 left-2.5 bg-white/95 text-[10px] font-bold text-[var(--accent-cyan)] shadow-xs">
                      {item.brand || item.categoryBadge || item.categoryTitle}
                    </span>
                  </Link>

                  <div className="flex-1 space-y-2 text-left w-full">
                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight">
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-[var(--text-main)] group-hover:text-[var(--accent-orange)] transition-colors"
                      >
                        {item.name}
                      </Link>
                    </h3>

                    {item.applications && (
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">
                        {item.applications}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs pt-2">
                      {CARD_SPECS.filter(([key]) => item[key]).slice(0, 3).map(([key, label]) => (
                        <div key={key} className="inline-flex items-center gap-1.5 text-[var(--text-muted)]">
                          <span className="font-medium text-[var(--text-faint)]">{label}:</span>
                          <span className="font-bold text-[var(--text-main)]">{item[key]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border-color)]">
                  <Link
                    to={`/product/${item.slug}`}
                    className="btn btn-secondary btn-sm flex-1 md:flex-initial justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-orange" />
                    Details
                  </Link>
                  <button
                    onClick={() => onSelectProductForRfq && onSelectProductForRfq(item)}
                    className="btn btn-primary btn-sm flex-1 md:flex-initial justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    Get Quote
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        </div>
      </section>
    </div>
  );
}
