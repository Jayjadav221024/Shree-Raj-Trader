import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, FileText, ArrowRight, Layers } from 'lucide-react';
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

  const tabs = React.useMemo(() => [
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

  const allProducts = React.useMemo(() => {
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

  const filteredProducts = allProducts.filter((p) => {
    return activeTab === 'all' || p.categoryId === activeTab;
  });

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
        className="section section-alt page-top-spacing border-b border-[var(--border-color)] relative overflow-hidden pb-10"
      >
        <div className="container-page relative z-10">
          <div className="max-w-3xl">
            <span className="eyebrow">Industrial Equipment & Components</span>
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
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pt-10 pb-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[var(--accent-orange)] text-white border-[var(--accent-orange)] shadow-[var(--shadow-glow)]'
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

      {/* Product Grid Area */}
      <div className="container-page pt-10 pb-24 md:pb-32">
        {filteredProducts.length === 0 ? (
          <div className="card p-16 text-center max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-orange-tint)] flex items-center justify-center mx-auto mb-4 text-[var(--accent-orange-deep)]">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl text-[var(--text-main)]">No Matching Products</h3>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              No products found in this category. Browse our other categories or request a custom quotation.
            </p>
            <button
              onClick={() => handleTabClick('all')}
              className="btn btn-secondary btn-sm mt-6 inline-flex items-center gap-2"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {filteredProducts.map((item) => (
              <article
                key={`${item.categoryId}-${item.name}`}
                className="card card-hover flex flex-col overflow-hidden group bg-white border border-[var(--border-color)] rounded-2xl shadow-xs"
              >
                {/* Image Container */}
                <Link
                  to={`/product/${item.slug}`}
                  className="relative h-60 bg-[var(--bg-secondary)] overflow-hidden flex items-center justify-center p-6 border-b border-[var(--border-color)] group-hover:bg-[var(--accent-orange-tint)]/20 transition-colors"
                >
                  <img
                    src={item.image.src}
                    alt={item.imageAlt || `${item.name}${item.brand ? ` by ${item.brand}` : ''}`}
                    width={item.image.width}
                    height={item.image.height}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="badge-tag absolute top-4 left-4 bg-white/95 shadow-xs z-10">
                    {item.brand || item.categoryBadge || item.categoryTitle}
                  </span>
                </Link>

                {/* Content */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 pb-8">
                  <h3 className="font-display text-xl sm:text-2xl leading-tight">
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
                  <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex-1">
                    {CARD_SPECS.filter(([key]) => item[key]).slice(0, 3).map(([key, label]) => (
                      <div key={key} className="spec-row">
                        <span className="spec-label text-xs">{label}</span>
                        <span className="spec-value text-xs">{item[key]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[var(--border-color)]">
                    <Link
                      to={`/product/${item.slug}`}
                      className="btn btn-secondary btn-sm flex-1 justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-orange" />
                      Details
                    </Link>
                    <button
                      onClick={() => onSelectProductForRfq && onSelectProductForRfq(item)}
                      className="btn btn-primary btn-sm flex-1 justify-center gap-1.5"
                    >
                      Get Quote
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
