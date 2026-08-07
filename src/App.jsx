import React, { useState, useEffect } from 'react';
import LiquidCanvas from './components/LiquidCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BrandMatrix from './components/BrandMatrix';
import EquipmentViewer3D from './components/EquipmentViewer3D';
import ProductCatalog from './components/ProductCatalog';
import RfqCalculator from './components/RfqCalculator';
import DomainSection from './components/DomainSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { Search, X, Cpu, FileText, ArrowRight } from 'lucide-react';
import { productCategories } from './data/shreerajData';

export default function App() {
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [selectedProductForRfq, setSelectedProductForRfq] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenRfqForProduct = (product) => {
    setSelectedProductForRfq(product);
    setRfqModalOpen(true);
  };

  const handleBrandSelect = (brandId) => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Flattened search items
  const allSearchItems = productCategories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      categoryTitle: cat.title
    }))
  );

  const searchResults = globalSearchQuery.trim()
    ? allSearchItems.filter(
        (item) =>
          item.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
          (item.brand && item.brand.toLowerCase().includes(globalSearchQuery.toLowerCase())) ||
          item.categoryTitle.toLowerCase().includes(globalSearchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 relative selection:bg-cyan-500 selection:text-black">
      {/* Background Interactive Liquid Particle Canvas */}
      <LiquidCanvas />

      {/* Navigation Header */}
      <Navbar
        onOpenRfq={() => {
          setSelectedProductForRfq(null);
          setRfqModalOpen(true);
        }}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="relative z-10 space-y-10">
        <Hero
          onOpenRfq={() => {
            setSelectedProductForRfq(null);
            setRfqModalOpen(true);
          }}
        />

        <BrandMatrix onSelectBrand={handleBrandSelect} />

        {/* 3D Holographic Inspector Section */}
        <section id="3d-inspector" className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono-code">
                <Cpu className="w-3.5 h-3.5 animate-pulse" />
                <span>INTERACTIVE THREE.JS DIAGNOSTIC VIEW</span>
              </div>
              <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                3D HOLOGRAPHIC <span className="text-cyan-400 text-glow-cyan">EQUIPMENT INSPECTOR</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Rotate, zoom, and inspect internal components of Siemens IE3/IE4 electric motors, ACB switchgears, and FRP gratings in real-time WebGL 3D.
              </p>
            </div>

            <EquipmentViewer3D />
          </div>
        </section>

        <ProductCatalog onSelectProductForRfq={handleOpenRfqForProduct} />

        <RfqCalculator preselectedProduct={selectedProductForRfq} />

        <DomainSection />

        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global RFQ Modal Popup */}
      {rfqModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-4xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setRfqModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <RfqCalculator
              preselectedProduct={selectedProductForRfq}
              onCloseModal={() => setRfqModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Global Search Modal Popup */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-start justify-center pt-24 p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 relative shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3 w-full pr-4">
                <Search className="w-5 h-5 text-cyan-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type to search motors, switchgears, FRP gratings..."
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base focus:outline-none font-orbitron"
                />
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto space-y-2 text-xs">
              {globalSearchQuery.trim() === '' ? (
                <div className="p-8 text-center text-slate-500 font-mono-code">
                  Type a keyword e.g. "Siemens", "15 HP", "ACB", "Grit Top", "Flameproof".
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-mono-code">
                  No matching products found for "{globalSearchQuery}".
                </div>
              ) : (
                searchResults.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSearchModalOpen(false);
                      handleOpenRfqForProduct(item);
                    }}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between group transition"
                  >
                    <div>
                      <div className="font-orbitron font-bold text-sm text-white group-hover:text-cyan-300">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span className="text-cyan-400 font-mono-code">{item.brand || item.categoryTitle}</span>
                        {item.powerRange && <span>• {item.powerRange}</span>}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
