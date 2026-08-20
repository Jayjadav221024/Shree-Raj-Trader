import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, FileText, ArrowRight } from 'lucide-react';
import { productCategories } from '../data/siteData';
import { copy } from '../data/sectionCopy';
import { fillTemplate } from '../lib/siteContent';
import SEO from './SEO';

const CATEGORY_MAP = {
  'gearbox': 'gearboxes',
  'gear-box': 'gearboxes',
  'gratings': 'frp-gratings',
  'trays': 'frp-cable-trays',
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
    { id: 'all', label: c.allTabLabel },
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

  return (
    <>
      <SEO
        title={
          activeTab === 'all'
            ? seo.title
            : fillTemplate(seo.categoryTitle, {
                category: categories.find((cat) => cat.id === activeTab)?.title || '',
              })
        }
        description={seo.description}
      />

      <section
        data-section="products.header"
        className="section bg-[var(--bg-secondary)] border-b border-[var(--border-color)]"
      >
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl sm:text-5xl text-[var(--text-main)] font-black uppercase tracking-tight">
              {c.title}
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2">
              {c.intro}
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-wider whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[var(--accent-orange)] text-white border-[var(--accent-orange)] shadow-[var(--shadow-glow)]'
                    : 'bg-white border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="card p-12 text-center">
            <Search className="w-10 h-10 text-[var(--text-faint)] mx-auto mb-4" />
            <h3 className="font-display text-xl">No Matching Products</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              No products found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item) => (
              <article key={`${item.categoryId}-${item.name}`} className="product-card">
                <Link
                  to={`/product/${item.slug}`}
                  className="relative h-44 bg-[var(--bg-secondary)] overflow-hidden block"
                >
                  <img
                    src={item.image.src}
                    alt={item.imageAlt || `${item.name}${item.brand ? ` by ${item.brand}` : ''}`}
                    width={item.image.width}
                    height={item.image.height}
                    loading="lazy"
                    className="w-full h-full object-contain p-3"
                  />
                  <span className="badge-tag absolute top-3 left-3 bg-white/95">
                    {item.brand || item.categoryBadge}
                  </span>
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl sm:text-2xl leading-tight">
                    <Link
                      to={`/product/${item.slug}`}
                      className="hover:text-[var(--accent-orange)] transition-colors block"
                    >
                      {item.name}
                    </Link>
                  </h3>

                  {item.applications && (
                    <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed line-clamp-2">
                      {item.applications}
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex-1">
                    {CARD_SPECS.filter(([key]) => item[key]).slice(0, 4).map(([key, label]) => (
                      <div key={key} className="spec-row">
                        <span className="spec-label">{label}</span>
                        <span className="spec-value">{item[key]}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-2.5">
                    <Link
                      to={`/product/${item.slug}`}
                      className="btn btn-secondary btn-sm flex-1 justify-center"
                    >
                      <FileText className="w-3.5 h-3.5 text-orange" />
                      Details
                    </Link>
                    <button
                      onClick={() => onSelectProductForRfq && onSelectProductForRfq(item)}
                      className="btn btn-primary btn-sm flex-1"
                    >
                      Get Quote
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
