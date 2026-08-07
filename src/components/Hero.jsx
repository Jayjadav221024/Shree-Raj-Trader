import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Zap, Activity, Layers, Download, CheckCircle2 } from 'lucide-react';
import LiquidCard from './LiquidCard';
import { statsCounter } from '../data/shreerajData';

export default function Hero({ onOpenRfq }) {
  return (
    <section id="hero" className="relative pt-32 pb-20 overflow-hidden">
      {/* Glow Ambient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-blob" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none animate-blob" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Channel Partner Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono-code text-cyan-400 mb-8 backdrop-blur-md shadow-lg shadow-cyan-950/40 animate-float">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>AUTHORIZED CHANNEL PARTNER & SUPPLIER IN AHMEDABAD</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Main Title & Subtitle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="font-orbitron font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
              NEXT-GEN <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-orange-400 bg-clip-text text-transparent text-glow-cyan">
                INDUSTRIAL MOTORS
              </span> <br />
              &amp; SWITCHGEARS
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Shree Raj Traders is Gujarat's premier authorized channel partner for <span className="text-cyan-300 font-semibold">Siemens Switchgears</span>, <span className="text-orange-300 font-semibold">IE3/IE4 Motors</span> (Siemens, CG, Hindustan), <span className="text-emerald-300 font-semibold">FRP Gratings</span>, Cable Trays, and Industrial Gearboxes.
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenRfq}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-slate-950 font-orbitron font-bold text-sm uppercase tracking-wider shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all flex items-center gap-2 group"
              >
                <span>Request Quotation RFQ</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#3d-inspector"
                className="px-7 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 font-orbitron font-medium text-sm hover:border-cyan-500/50 hover:text-cyan-300 transition-all flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Launch 3D Inspector</span>
              </a>
            </div>

            {/* Key Assurance Badges */}
            <div className="pt-4 flex flex-wrap gap-4 text-xs text-slate-400 font-mono-code">
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Genuine Siemens Warranty
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Express Dispatch in Gujarat
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-orange-400" /> Technical Field Support
              </span>
            </div>
          </div>

          {/* Liquid Cards Showcase Right Side */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LiquidCard color="cyan" className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white">Industrial Motors</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Siemens IE3/IE4, CG Power &amp; Hindustan High Torque 3-Phase Motors.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-mono-code">
                <span>0.5 HP - 500 HP</span>
                <span>IP55 / IP66</span>
              </div>
            </LiquidCard>

            <LiquidCard color="orange" className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white">Siemens Switchgears</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                ACB, MCCB, Contactors, MCBs &amp; Sinnova Power Distribution.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-orange-400 font-mono-code">
                <span>63A - 6300A</span>
                <span>IEC 60947</span>
              </div>
            </LiquidCard>

            <LiquidCard color="emerald" className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white">FRP Gratings</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Meniscus Top, Grit Top &amp; Checkered Solid Plates anti-corrosive.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-mono-code">
                <span>Anti-Slip COF&gt;0.8</span>
                <span>Dielectric</span>
              </div>
            </LiquidCard>

            <LiquidCard color="purple" className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white">FRP Cable Trays</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Pultruded Ladder &amp; Perforated Trays for coastal &amp; chemical plants.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-purple-400 font-mono-code">
                <span>200 kg/m Load</span>
                <span>UV Stable</span>
              </div>
            </LiquidCard>
          </div>
        </div>

        {/* Stats Counter Bar */}
        <div className="mt-16 pt-12 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {statsCounter.map((stat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md">
              <div className="font-orbitron font-extrabold text-3xl sm:text-4xl text-cyan-400 text-glow-cyan">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400 uppercase font-mono-code tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
