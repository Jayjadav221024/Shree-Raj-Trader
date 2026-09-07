import React, { useState } from 'react';
import { Cpu, Building2, Users, Leaf, Zap, Truck, ExternalLink, MapPin, Wrench } from 'lucide-react';
import { domains, images } from '../data/siteData';
import { copy } from '../data/sectionCopy';

const ICONS = { Cpu, Building2, Users, Leaf, Zap, Truck };

export default function DomainSection() {
  const c = copy['home.domains'];
  const g = copy['home.group-companies'];

  const enhancedCompanies = [
    {
      num: '01',
      name: 'Apidel Technologies',
      shortName: 'Apidel Tech',
      role: 'Technology Services & Digital Solutions',
      location: '4th Floor, Pancham Icon, Vasna Rd, Vadodara, Gujarat 390007',
      href: 'https://apideltech.com/',
      logo: images.group['apidel-technologies'],
      icon: Cpu
    },
    {
      num: '02',
      name: 'Techno Sales Agency',
      shortName: 'Techno Sales',
      role: 'Engineering Supplier & Industrial Distribution',
      location: '8/5-6, Kewal Shopping Centre, GIDC, Ankleshwar, Gujarat 393002',
      href: null,
      logo: images.group['techno-sales-agency'],
      icon: Truck
    },
    {
      num: '03',
      name: 'Transpower Technologies Pvt. Ltd.',
      shortName: 'Transpower',
      role: 'Power & Automation Engineering',
      location: '346, Makarpura GIDC, Vadodara, Gujarat 390010',
      href: 'https://www.transpower.net.in/',
      logo: images.group['transpower-technologies'],
      icon: Wrench
    }
  ];

  return (
    <section id="domains" className="section section-alt">
      <div className="container-page">
        <div data-section="home.domains">
          <div className="section-header">
            <span className="eyebrow">{c.eyebrow}</span>
            <h2 className="section-title">
              {c.title} <span className="text-orange">{c.titleAccent}</span>
            </h2>
            <p>{c.intro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14 sm:mb-16">
            {domains.map((domain, index) => {
              const Icon = ICONS[domain.icon] || Cpu;
              return (
                <div key={domain.title} className="card card-hover p-7">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-[12px] bg-[var(--accent-orange-tint)] border border-[rgba(217,101,59,0.2)] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-orange" />
                    </div>
                    <span className="font-display text-3xl leading-none text-[var(--border-strong)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-[var(--text-main)] font-bold">{domain.title}</h3>
                  <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2 leading-relaxed">
                    {domain.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Group of companies - Premium Industrial Cards Grid with Dynamic Hover Glow Movement */}
        <div data-section="home.group-companies" className="pt-4">
          <div className="section-header">
            <span className="eyebrow eyebrow-teal">{g.eyebrow}</span>
            <h2 className="section-title">
              {g.title} <span className="text-orange">{g.titleAccent}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full mt-4">
            {enhancedCompanies.map((company) => {
              const Icon = company.icon;
              const isLinked = Boolean(company.href);

              const handleMouseMove = (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
              };

              return (
                <div
                  key={company.name}
                  onMouseMove={handleMouseMove}
                  className="interactive-glow-card group relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-white border border-[var(--border-color)] hover:border-[var(--accent-orange)] shadow-[var(--shadow-card)] hover:shadow-[0_22px_45px_-10px_rgba(217,101,59,0.22)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 flex flex-col justify-between"
                  style={{
                    '--mouse-x': '50%',
                    '--mouse-y': '50%'
                  }}
                >
                  {/* Dynamic Cursor-Following Radial Glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(217, 101, 59, 0.12), rgba(20, 96, 122, 0.06) 40%, transparent 80%)'
                    }}
                  />

                  {/* Ambient Shimmer Light Streak on Hover */}
                  <div className="card-shimmer-sweep absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100" />

                  {/* Subtle Top Border Glow on Hover */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--accent-orange)] to-[var(--accent-orange-bright)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top Badges (Number + Floating Icon) */}
                  <div className="relative z-10 flex items-center justify-between w-full mb-6">
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[var(--accent-orange-tint)] text-[var(--accent-orange-deep)] border border-[rgba(217,101,59,0.2)] group-hover:bg-[var(--accent-orange)] group-hover:text-white transition-colors duration-300">
                      {company.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] group-hover:bg-[var(--accent-orange)] group-hover:text-white group-hover:border-[var(--accent-orange)] text-[var(--accent-cyan)] flex items-center justify-center transition-all duration-300 shadow-xs group-hover:rotate-6">
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Middle: Prominent Logo Presentation with Floating Aura */}
                  <div className="relative z-10 w-full h-28 sm:h-32 rounded-2xl bg-[var(--bg-secondary)]/90 border border-[var(--border-color)] p-5 flex items-center justify-center mb-6 group-hover:bg-white group-hover:border-[rgba(217,101,59,0.4)] group-hover:shadow-[0_12px_24px_-8px_rgba(217,101,59,0.15)] transition-all duration-400 shadow-xs">
                    {company.logo ? (
                      <img
                        src={company.logo.src}
                        alt={company.name}
                        width={company.logo.width}
                        height={company.logo.height}
                        className="max-h-full max-w-[85%] object-contain transition-transform duration-400 group-hover:scale-108"
                      />
                    ) : (
                      <span className="font-display font-black text-lg text-[var(--text-main)]">
                        {company.name}
                      </span>
                    )}
                  </div>

                  {/* Bottom: Typography & Info */}
                  <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-main)] group-hover:text-[var(--accent-orange)] transition-colors leading-snug">
                        {company.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-teal tracking-wide mt-1.5 uppercase">
                        {company.role}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--border-color)] mt-4 space-y-3">
                      <p className="text-xs text-[var(--text-muted)] flex items-start gap-2 leading-relaxed">
                        <MapPin className="w-3.5 h-3.5 text-orange shrink-0 mt-0.5" />
                        <span>{company.location}</span>
                      </p>

                      {isLinked ? (
                        <a
                          href={company.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--accent-orange)] text-[var(--text-main)] hover:text-white font-bold text-xs transition-all duration-200 border border-[var(--border-color)] hover:border-[var(--accent-orange)] shadow-xs group/btn mt-1"
                        >
                          <span>Visit Official Website</span>
                          <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </a>
                      ) : (
                        <div className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-muted)] font-semibold text-xs border border-[var(--border-color)] mt-1 opacity-75">
                          <span>Authorized Distribution Hub</span>
                          <Building2 className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
