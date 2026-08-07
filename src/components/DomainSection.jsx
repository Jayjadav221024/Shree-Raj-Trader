import React, { useState } from 'react';
import { Cpu, Building2, Users, Leaf, Zap, Truck, ChevronDown, ChevronUp, Layers, CheckCircle2 } from 'lucide-react';
import LiquidCard from './LiquidCard';
import { domains, groupCompanies } from '../data/shreerajData';

export default function DomainSection() {
  const [openAccordion, setOpenAccordion] = useState(0);

  const iconMap = {
    Cpu: Cpu,
    Building2: Building2,
    Users: Users,
    Leaf: Leaf,
    Zap: Zap,
    Truck: Truck
  };

  return (
    <section id="domains" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code">
            <Building2 className="w-3.5 h-3.5" />
            <span>EXPERT CAPABILITIES &amp; ECOLOGICAL VISION</span>
          </div>

          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            OUR OPERATIONAL <span className="text-emerald-400 text-glow-emerald">DOMAINS</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Shree Raj Traders excels in providing comprehensive engineering, infrastructure, electrical distribution, and sustainability solutions for industries throughout Gujarat.
          </p>
        </div>

        {/* Domains Accordion / Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {domains.map((domain, index) => {
            const Icon = iconMap[domain.icon] || Cpu;
            const isOpen = openAccordion === index;

            return (
              <LiquidCard
                key={index}
                color={index % 3 === 0 ? 'emerald' : index % 3 === 1 ? 'cyan' : 'orange'}
                className="p-6 flex flex-col justify-between cursor-pointer"
                onClick={() => setOpenAccordion(isOpen ? -1 : index)}
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-[10px] font-mono-code px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                      Domain 0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-orbitron font-bold text-xl text-white">
                    {domain.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {domain.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-mono-code">
                  <span>Explore Capabilities</span>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </LiquidCard>
            );
          })}
        </div>

        {/* Group of Companies Section */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-mono-code text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                SYNERGISTIC GROUP ALLIANCE
              </span>
              <h3 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white mt-2">
                OUR GROUP OF COMPANIES
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Combining power automation, motor supply, and composite FRP manufacturing into a single unified engineering partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groupCompanies.map((comp, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/30 transition">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5 text-cyan-400" />
                </div>
                <h4 className="font-orbitron font-bold text-lg text-white">{comp.name}</h4>
                <p className="text-xs text-cyan-400 font-mono-code mt-1">{comp.role}</p>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {comp.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
