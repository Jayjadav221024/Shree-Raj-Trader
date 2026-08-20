import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileText } from 'lucide-react';
import { productCategories } from '../data/siteData';
import { copy } from '../data/sectionCopy';
import { fillTemplate } from '../lib/siteContent';
import SEO from '../components/SEO';

// Keys that describe the record rather than the product, so they must never be
// rendered as a spec card in the attribute grid below.
const HIDDEN_KEYS = [
  'name', 'href', 'slug', 'imageKey', 'imageAlt', 'image', 'longDescription', 'liveSpecs',
  'categoryId', 'categoryTitle', 'categoryBadge', 'categoryImage', 'specs'
];

export default function ProductDetailPage({ onSelectProductForRfq, products: propProducts }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find product across all categories
  const allProducts = propProducts && propProducts.length > 0 ? propProducts : productCategories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      categoryId: cat.id,
      categoryTitle: cat.title,
      categoryBadge: cat.badge,
      categoryImage: cat.image
    }))
  );

  const product = allProducts.find((p) => p.slug === slug);
  const c = copy['products.detail'];

  if (!product) {
    return (
      <section className="section page-top-spacing">
        <div className="container-page text-center">
          <h1 className="section-title">{c.notFoundTitle}</h1>
          <Link to="/products/" className="btn btn-primary mt-6">
            <ArrowLeft className="w-4 h-4" />
            {c.notFoundCta}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section data-section="products.detail" className="section page-top-spacing">
      <SEO
        title={fillTemplate(copy['seo.product-detail'].title, { product: product.name })}
        description={fillTemplate(copy['seo.product-detail'].description, { product: product.name })}
        image={product.image}
        imageAlt={product.imageAlt || product.name}
      />
      <div className="container-page">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-sm mb-8 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {c.backToCatalog}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Product Image */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-[var(--border-color)] shadow-[var(--shadow-card)] flex items-center justify-center min-h-[350px]">
            <img
              src={product.image.src}
              alt={product.imageAlt || product.name}
              width={product.image.width}
              height={product.image.height}
              className="max-h-[380px] w-auto object-contain"
            />
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="badge-tag">{product.brand || product.categoryTitle}</span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl mt-3 leading-tight font-display">{product.name}</h1>
            </div>

            {product.longDescription && (
              <p className="text-[var(--text-muted)] leading-relaxed text-sm sm:text-base">
                {product.longDescription}
              </p>
            )}

            {/* Feature Grid / Specs list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(product).map(([key, val]) => {
                if (HIDDEN_KEYS.includes(key) || typeof val !== 'string') return null;
                return (
                  <div key={key} className="p-4 rounded-xl bg-white border border-[var(--border-color)] shadow-sm">
                    <div className="text-[0.7rem] font-bold uppercase tracking-wider text-[var(--text-faint)]">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div className="text-base font-bold text-[var(--text-main)] mt-1">{val}</div>
                  </div>
                );
              })}
            </div>

            {/* Bullet Specifications */}
            {product.liveSpecs && (
              <div className="pt-4">
                <h3 className="text-orange text-lg font-display tracking-wide mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {c.specificationsTitle}
                </h3>
                <div className="space-y-2">
                  {product.liveSpecs.map((spec) => (
                    <div key={spec} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                      <CheckCircle2 className="w-4 h-4 text-orange shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bullet Features */}
            {product.specs && (
              <div className="pt-4">
                <h3 className="text-orange text-lg font-display tracking-wide mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {c.featuresTitle}
                </h3>
                <div className="space-y-2">
                  {product.specs.map((spec) => (
                    <div key={spec} className="flex items-start gap-2.5 text-sm text-[var(--text-muted)]">
                      <CheckCircle2 className="w-4 h-4 text-orange shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-[var(--border-color)]">
              <button
                onClick={() => onSelectProductForRfq && onSelectProductForRfq(product)}
                className="btn btn-primary px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-xl shadow-[var(--shadow-glow)]"
              >
                {fillTemplate(c.quoteButton, { product: product.name })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
