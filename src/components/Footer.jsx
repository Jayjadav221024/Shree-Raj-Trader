import React from 'react';
import { Zap, ShieldCheck, Phone, Mail, ArrowUp } from 'lucide-react';
import { companyInfo } from '../data/shreerajData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-orange-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="font-orbitron font-extrabold text-lg text-white">
                SHREE RAJ <span className="text-cyan-400">TRADERS</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Premier authorized Siemens switchgear supplier and industrial motors distributor in Ahmedabad, Gujarat. Delivering high-efficiency power equipment and FRP composite solutions.
            </p>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1 font-mono-code">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> {companyInfo.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-orange-400" /> {companyInfo.email}
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-sm text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="hover:text-cyan-400 transition">Home Overview</a></li>
              <li><a href="#products" className="hover:text-cyan-400 transition">Industrial Motors Catalog</a></li>
              <li><a href="#brands" className="hover:text-cyan-400 transition">Siemens &amp; CG Switchgears</a></li>
              <li><a href="#3d-inspector" className="hover:text-cyan-400 transition">3D Holographic Inspector</a></li>
              <li><a href="#calculator" className="hover:text-orange-400 transition">Smart RFQ Calculator</a></li>
            </ul>
          </div>

          {/* Col 3: Product Lines */}
          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-sm text-white uppercase tracking-wider">
              Product Range
            </h4>
            <ul className="space-y-2">
              <li><a href="#products" className="hover:text-cyan-400 transition">Siemens IE3/IE4 Motors</a></li>
              <li><a href="#products" className="hover:text-cyan-400 transition">Crompton Greaves Motors</a></li>
              <li><a href="#products" className="hover:text-cyan-400 transition">Siemens ACB &amp; MCCB Panels</a></li>
              <li><a href="#products" className="hover:text-emerald-400 transition">Meniscus &amp; Grit FRP Gratings</a></li>
              <li><a href="#products" className="hover:text-purple-400 transition">Pultruded FRP Cable Trays</a></li>
            </ul>
          </div>

          {/* Col 4: Group & Legal */}
          <div className="space-y-3">
            <h4 className="font-orbitron font-bold text-sm text-white uppercase tracking-wider">
              Group Alliance
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Shree Raj Traders</li>
              <li>TransPower Technologies</li>
              <li>Raj Composites &amp; FRP</li>
              <li className="pt-2 text-cyan-400 font-mono-code text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> ISO Certified Standards
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono-code">
          <p className="text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} Shree Raj Traders. All Rights Reserved. Designed with Futuristic 3D Cyber Industrial Aesthetics.
          </p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition flex items-center gap-1.5"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
