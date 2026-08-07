import React, { useState } from 'react';
import { Search, Filter, Cpu, Zap, Layers, Activity, FileText, CheckCircle2, ChevronRight, X, Star } from 'lucide-react';
import LiquidCard from './LiquidCard';
import { productCategories } from '../data/shreerajData';

export default function ProductCatalog({ onSelectProductForRfq }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [activeSpecModal, setActiveSpecModal] = useState(null);

  const categories = [
    { id: 'all', label: 'All Products', icon: Layers },
    { id: 'motors', label: 'Industrial Motors', icon: Cpu },
    { id: 'switchgears', label: 'Siemens Switchgears', icon: Zap },
    { id: 'frp-gratings', label: 'FRP Gratings', icon: Layers },
    { id: 'frp-cable-trays', label: 'FRP Cable Trays', icon: Activity },
    { id: 'gearboxes', label: 'Gearboxes & Drives', icon: Activity }
  ];

  // Flatten products with category meta
  const allProducts = productCategories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      categoryId: cat.id,
      categoryTitle: cat.title,
      categoryBadge: cat.badge,
      categoryImage: cat.image
    }))
  );

  const filteredProducts = allProducts.filter((p) => {
    const matchesTab = activeTab === 'all' || p.categoryId === activeTab;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.applications && p.applications.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBrand =
      selectedBrand === 'all' || (p.brand && p.brand.toLowerCase().includes(selectedBrand.toLowerCase()));

    return matchesTab && matchesSearch && matchesBrand;
  });

  return (
    <section id="products" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono-code">
              <Cpu className="w-3.5 h-3.5" />
              <span>CATALOG SPECIFICATION HUB</span>
            </div>
            <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              EXPLORE OUR <span className="text-cyan-400 text-glow-cyan">ENGINEERING PRODUCTS</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Authentic Siemens Switchgears, High Torque Electric Motors, FRP Molded Gratings &amp; Cable Trays engineered for heavy industrial environments.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog or specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
              />
            </div>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono-code text-slate-300 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">All Brands</option>
              <option value="siemens">Siemens</option>
              <option value="crompton">Crompton Greaves</option>
              <option value="hindustan">Hindustan Electric</option>
              <option value="rotomotive">Rotomotive</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-orbitron font-semibold tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product Liquid Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="font-orbitron text-lg text-slate-300">No matching products found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or searching for terms like "IE4", "ACB", "Switchgear", "FRP Grating".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item, idx) => (
              <LiquidCard key={idx} color={item.categoryId === 'switchgears' ? 'orange' : item.categoryId === 'frp-gratings' ? 'emerald' : 'cyan'} className="p-6 flex flex-col justify-between">
                <div>
                  {/* Category Image & Badge */}
                  <div className="relative h-44 rounded-xl overflow-hidden mb-5 bg-slate-950/80 border border-slate-800">
                    <img
                      src={item.categoryImage}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/90 border border-slate-700 text-xs font-mono-code text-cyan-300 backdrop-blur-md">
                      {item.brand || item.categoryBadge}
                    </div>

                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/90 text-[11px] font-mono-code text-amber-400 flex items-center gap-1 border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{item.rating || '4.9/5'}</span>
                    </div>
                  </div>

                  <h3 className="font-orbitron font-bold text-lg text-white leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {item.applications ? `Applications: ${item.applications}` : item.categoryTitle}
                  </p>

                  {/* Spec Highlights Table */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                    {item.powerRange && (
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-500 font-mono-code">Power Range:</span>
                        <span className="font-semibold text-cyan-300">{item.powerRange}</span>
                      </div>
                    )}
                    {item.voltage && (
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-500 font-mono-code">Voltage:</span>
                        <span className="text-slate-200">{item.voltage}</span>
                      </div>
                    )}
                    {item.currentRating && (
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-500 font-mono-code">Current Rating:</span>
                        <span className="font-semibold text-orange-400">{item.currentRating}</span>
                      </div>
                    )}
                    {item.surfaceFinish && (
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-500 font-mono-code">Finish:</span>
                        <span className="text-emerald-400">{item.surfaceFinish}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => setActiveSpecModal(item)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition text-xs font-mono-code flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Specs</span>
                  </button>

                  <button
                    onClick={() => onSelectProductForRfq && onSelectProductForRfq(item)}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-orbitron font-bold text-xs hover:bg-cyan-400 transition shadow-md shadow-cyan-500/20 flex items-center gap-1"
                  >
                    <span>RFQ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </LiquidCard>
            ))}
          </div>
        )}
      </div>

      {/* Product Spec Detail Modal */}
      {activeSpecModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setActiveSpecModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono-code text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                {activeSpecModal.brand || activeSpecModal.categoryTitle}
              </span>
              <h3 className="font-orbitron font-extrabold text-2xl text-white mt-3">
                {activeSpecModal.name}
              </h3>
            </div>

            {/* Spec breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {Object.entries(activeSpecModal).map(([key, val]) => {
                if (
                  ['name', 'categoryId', 'categoryTitle', 'categoryBadge', 'categoryImage', 'features'].includes(key) ||
                  typeof val !== 'string'
                )
                  return null;
                return (
                  <div key={key} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 capitalize font-mono-code block">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-slate-200 font-medium text-sm mt-0.5 block">{val}</span>
                  </div>
                );
              })}
            </div>

            {/* Feature Checklist */}
            {activeSpecModal.features && (
              <div>
                <h4 className="font-orbitron font-bold text-sm text-cyan-400 mb-2">Key Engineering Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeSpecModal.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveSpecModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono-code hover:bg-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const item = activeSpecModal;
                  setActiveSpecModal(null);
                  onSelectProductForRfq && onSelectProductForRfq(item);
                }}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:bg-cyan-400"
              >
                Add to RFQ Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
