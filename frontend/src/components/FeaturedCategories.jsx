import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productCategories } from '../data/siteData';

// Custom component to handle scroll-driven scattering/alignment transitions
function ScatterRevealCard({ children, index, side = 'left' }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Define unique scattered translation values for each index to come from different sides
  const scatterStyles = {
    // Left side items
    0: { '--scatter-x': '-250px', '--scatter-y': '-150px', '--scatter-rot': '-20deg' },
    1: { '--scatter-x': '-250px', '--scatter-y': '150px', '--scatter-rot': '-10deg' },
    // Right side items
    2: { '--scatter-x': '250px', '--scatter-y': '-150px', '--scatter-rot': '20deg' },
    3: { '--scatter-x': '250px', '--scatter-y': '150px', '--scatter-rot': '10deg' }
  };

  const style = scatterStyles[index] || {};

  return (
    <div
      ref={cardRef}
      style={style}
      className={`scatter-card-wrapper ${isVisible ? 'is-aligned' : 'is-scattered'}`}
    >
      {children}
    </div>
  );
}

export default function FeaturedCategories({ categories: propCategories }) {
  const navigate = useNavigate();
  const itemsList = propCategories && propCategories.length > 0 ? propCategories : productCategories;
  const [hoveredItem, setHoveredItem] = useState(itemsList[0]);

  useEffect(() => {
    if (itemsList.length > 0) {
      setHoveredItem(itemsList[0]);
    }
  }, [itemsList]);

  const leftSideItems = itemsList.slice(0, 2);
  const rightSideItems = itemsList.slice(2, 4);

  return (
    <section
      className="section section-alt overflow-hidden"
      id="featured-categories"
      data-section="home.featured-categories"
    >
      <div className="container-page">
        
        {/* Desktop Layout (lg screens and above) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-center min-h-[300px]">
          
          {/* LEFT COLUMN: 2 cards coming from left/top/bottom, scaling up */}
          <div className="lg:col-span-4 flex flex-col gap-6 items-stretch">
            {leftSideItems.map((item, idx) => (
              <ScatterRevealCard key={item.id} index={idx} side="left">
                <div
                  onMouseEnter={() => setHoveredItem(item)}
                  onClick={() => navigate(item.isCustom ? '/contact/' : `/products/${item.id}`)}
                  className={`flat-category-card bg-white rounded-xl p-5 border border-[var(--border-color)] shadow-[var(--shadow-card)] hover:border-[var(--accent-orange)] transition-all duration-300 flex items-center gap-4 cursor-pointer ${hoveredItem?.id === item.id ? 'active-highlight' : ''}`}
                >
                  <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-xl overflow-hidden flex items-center justify-center p-2.5 shrink-0">
                    {item.isCustom ? (
                      <Layers className="w-9 h-9 text-[var(--accent-orange)]" />
                    ) : (
                      <img src={item.image.src} alt={item.imageAlt || item.title} className="max-h-full max-w-full object-contain" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-cyan)] block">
                      {item.badge}
                    </span>
                    <h4 className="text-base font-bold text-[var(--text-main)] uppercase mt-1 font-display">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </ScatterRevealCard>
            ))}
          </div>

          {/* CENTER COLUMN: Text & Info Display */}
          <div className="lg:col-span-4 text-center px-6 py-10 bg-white/80 rounded-3xl border border-[var(--border-color)] backdrop-blur-md shadow-[var(--shadow-lift)] flex flex-col items-center justify-center min-h-[300px] z-10">
            {hoveredItem && (
              <>
                <span className="badge-tag bg-white/95 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm text-[var(--accent-cyan)] border border-[var(--border-color)]">
                  {hoveredItem.badge}
                </span>
                
                <h3 className="text-2xl font-bold text-[var(--text-main)] uppercase font-display leading-tight tracking-wide mt-4 min-h-[3rem] flex items-center justify-center">
                  {hoveredItem.title}
                </h3>
                
                <p className="text-xs text-[var(--text-muted)] mt-4 leading-relaxed max-w-[300px] min-h-[6rem] overflow-y-auto">
                  {hoveredItem.description}
                </p>

                <button
                  onClick={() => navigate(hoveredItem.isCustom ? '/contact/' : `/products/${hoveredItem.id}`)}
                  className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--accent-cyan)] hover:bg-[var(--accent-cyan-deep)] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[var(--shadow-teal)] hover:shadow-lg hover:-translate-y-0.5"
                >
                  {hoveredItem.isCustom ? 'Open Calculator' : 'View Products'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* RIGHT COLUMN: 2 cards coming from right/top/bottom, scaling up */}
          <div className="lg:col-span-4 flex flex-col gap-6 items-stretch">
            {rightSideItems.map((item, idx) => (
              <ScatterRevealCard key={item.id} index={idx + 2} side="right">
                <div
                  onMouseEnter={() => setHoveredItem(item)}
                  onClick={() => navigate(item.isCustom ? '/contact/' : `/products/${item.id}`)}
                  className={`flat-category-card bg-white rounded-xl p-5 border border-[var(--border-color)] shadow-[var(--shadow-card)] hover:border-[var(--accent-orange)] transition-all duration-300 flex items-center gap-4 cursor-pointer ${hoveredItem?.id === item.id ? 'active-highlight' : ''}`}
                >
                  <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-xl overflow-hidden flex items-center justify-center p-2.5 shrink-0">
                    {item.isCustom ? (
                      <Layers className="w-9 h-9 text-[var(--accent-orange)]" />
                    ) : (
                      <img src={item.image.src} alt={item.imageAlt || item.title} className="max-h-full max-w-full object-contain" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-cyan)] block">
                      {item.badge}
                    </span>
                    <h4 className="text-base font-bold text-[var(--text-main)] uppercase mt-1 font-display">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </ScatterRevealCard>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Layout (rendered as a clean responsive grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {itemsList.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.isCustom ? '/contact/' : `/products/${item.id}`)}
              className="bg-white rounded-2xl p-5 border border-[var(--border-color)] shadow-[var(--shadow-card)] active:scale-[0.98] transition-all flex flex-col gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-xl overflow-hidden flex items-center justify-center p-2 shrink-0">
                  {item.isCustom ? (
                    <Layers className="w-8 h-8 text-[var(--accent-orange)]" />
                  ) : (
                    <img src={item.image.src} alt={item.imageAlt || item.title} className="max-h-full max-w-full object-contain" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-cyan)] block">
                    {item.badge}
                  </span>
                  <h4 className="text-base font-bold text-[var(--text-main)] uppercase mt-0.5 font-display">
                    {item.title}
                  </h4>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {item.description}
              </p>
              <div className="text-[11px] font-bold text-[var(--accent-orange)] uppercase tracking-wider flex items-center gap-1 mt-1">
                {item.isCustom ? 'Open Calculator' : 'View Products'} <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
