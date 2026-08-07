import React, { useState, useEffect } from 'react';
import { Search, Phone, FileText, Menu, X, Zap, ChevronRight, ShieldCheck } from 'lucide-react';
import { companyInfo } from '../data/shreerajData';

export default function Navbar({ onOpenRfq, onOpenSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/20 py-3 shadow-2xl shadow-cyan-950/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-orange-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20 group-hover:text-orange-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="font-orbitron font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
              SHREE RAJ <span className="text-cyan-400">TRADERS</span>
            </div>
            <div className="text-[10px] text-slate-400 tracking-wider uppercase font-mono-code flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-orange-400 inline" /> SIEMENS & CG AUTHORIZED
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#hero" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            Home
          </a>
          <a href="#products" className="hover:text-cyan-400 transition-colors">
            Products & Motors
          </a>
          <a href="#brands" className="hover:text-cyan-400 transition-colors">
            Authorized Brands
          </a>
          <a href="#3d-inspector" className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
            3D Inspector
          </a>
          <a href="#calculator" className="hover:text-orange-400 transition-colors">
            RFQ Estimator
          </a>
          <a href="#domains" className="hover:text-cyan-400 transition-colors">
            Domains
          </a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">
            Contact
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition"
            title="Search Catalog (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Contact Direct */}
          <a
            href={`tel:${companyInfo.phone.split('/')[0].trim()}`}
            className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-mono-code hover:border-slate-700 transition"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>+91 98250 12345</span>
          </a>

          {/* Quick RFQ Button */}
          <button
            onClick={onOpenRfq}
            className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-orbitron font-bold text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Get RFQ Quote
            </span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 px-6 py-6 space-y-4 animate-fadeIn">
          <nav className="flex flex-col gap-4 text-base font-medium">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-1"
            >
              Home
            </a>
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-1"
            >
              Products & Motors
            </a>
            <a
              href="#brands"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-1"
            >
              Authorized Brands
            </a>
            <a
              href="#3d-inspector"
              onClick={() => setMobileMenuOpen(false)}
              className="text-cyan-400 font-semibold py-1 flex items-center justify-between"
            >
              3D Inspector <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="text-orange-400 py-1"
            >
              RFQ Estimator
            </a>
            <a
              href="#domains"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-1"
            >
              Domains
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-1"
            >
              Contact Us
            </a>
          </nav>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRfq();
              }}
              className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-orbitron font-bold text-sm text-center uppercase tracking-wider shadow-lg shadow-cyan-500/30"
            >
              Get Instant Quote RFQ
            </button>
            <a
              href={`tel:${companyInfo.phone.split('/')[0].trim()}`}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono-code text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              Call Sales: +91 98250 12345
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
