import React from 'react';
import { ShieldCheck, Award, ExternalLink, Sparkles } from 'lucide-react';
import LiquidCard from './LiquidCard';
import { authorizedBrands } from '../data/shreerajData';

export default function BrandMatrix({ onSelectBrand }) {
  return (
    <section id="brands" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono-code">
            <Award className="w-3.5 h-3.5" />
            <span>OFFICIAL AUTHORIZED DISTRIBUTOR &amp; CHANNEL PARTNER</span>
          </div>

          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            GLOBAL INDUSTRIAL <span className="text-orange-400 text-glow-orange">BRAND PARTNERS</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            We partner with world-leading manufacturers to bring genuine, high-efficiency motors, switchgears, and power transmission products directly to industries in Ahmedabad and across India.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorizedBrands.map((b) => (
            <LiquidCard
              key={b.id}
              color={b.color}
              className="p-6 flex flex-col justify-between group"
              onClick={() => onSelectBrand && onSelectBrand(b.id)}
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="h-14 px-4 bg-white/95 rounded-xl flex items-center justify-center p-2 shadow-md">
                    <img
                      src={b.logo}
                      alt={b.name}
                      className="max-h-10 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <span className="text-xs font-mono-code px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-300">
                    Verified Partner
                  </span>
                </div>

                <h3 className="font-orbitron font-bold text-xl text-white group-hover:text-cyan-300 transition-colors">
                  {b.name}
                </h3>
                <p className="text-xs text-orange-400 font-mono-code mt-1">{b.tagline}</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{b.category}</p>

                {/* Highlights List */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
                  {b.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono-code group-hover:text-cyan-400 transition-colors">
                <span>View Products Catalog</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </LiquidCard>
          ))}
        </div>
      </div>
    </section>
  );
}
