import React, { useState } from 'react';
import { Cpu, Building2, Users, Leaf, Zap, Truck, ExternalLink, MapPin, ShieldCheck, Wrench } from 'lucide-react';
import { domains, groupCompanies, images } from '../data/siteData';
import { copy } from '../data/sectionCopy';

const ICONS = { Cpu, Building2, Users, Leaf, Zap, Truck };

export default function DomainSection() {
  const c = copy['home.domains'];
  const g = copy['home.group-companies'];
  const [activeCompanyIndex, setActiveCompanyIndex] = useState(0);

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

        {/* Group of companies - Interactive Accordion Gallery */}
        <div data-section="home.group-companies" className="pt-4">
          <div className="section-header">
            <span className="eyebrow eyebrow-teal">{g.eyebrow}</span>
            <h2 className="section-title">
              {g.title} <span className="text-orange">{g.titleAccent}</span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[440px] w-full">
            {enhancedCompanies.map((company, index) => {
              const isActive = index === activeCompanyIndex;
              const Icon = company.icon;
              const isLinked = Boolean(company.href);

              return (
                <div
                  key={company.name}
                  onMouseEnter={() => setActiveCompanyIndex(index)}
                  onClick={() => setActiveCompanyIndex(index)}
                  className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between p-6 sm:p-7 bg-white ${
                    isActive
                      ? 'lg:flex-[3.5] min-h-[390px] lg:min-h-0 border-2 border-[var(--accent-orange)] shadow-[0_16px_36px_-6px_rgba(217,101,59,0.2)] ring-4 ring-[var(--accent-orange)]/10'
                      : 'lg:flex-1 min-h-[150px] lg:min-h-0 border border-[var(--border-color)] hover:border-[var(--accent-orange)]/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)]'
                  }`}
                >
                  {/* Subtle Accent Glow for Active Card */}
                  {isActive && (
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--accent-orange-tint)]/60 via-transparent to-transparent rounded-bl-full pointer-events-none" />
                  )}

                  {/* Top Header / Badges */}
                  <div className="relative z-10 flex items-center justify-between w-full">
                    {/* Left Pill (Number) */}
                    <div
                      className={`flex items-center justify-center font-bold transition-all duration-500 ${
                        isActive
                          ? 'w-10 h-10 rounded-full bg-[var(--accent-orange-tint)] border border-[var(--accent-orange)] text-[var(--accent-orange)] text-sm shadow-sm'
                          : 'px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] text-xs font-bold'
                      }`}
                    >
                      <span>{company.num}</span>
                    </div>

                    {/* Right Pill (Icon) */}
                    <div
                      className={`flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? 'w-11 h-11 rounded-2xl bg-[var(--accent-orange)] text-white shadow-md shadow-orange-500/25'
                          : 'w-8 h-8 rounded-lg bg-[var(--accent-cyan-tint)] border border-[rgba(20,96,122,0.18)] text-[var(--accent-cyan)]'
                      }`}
                    >
                      <Icon className={isActive ? 'w-5 h-5' : 'w-4 h-4'} />
                    </div>
                  </div>

                  {/* Middle / Center Company Logo Display */}
                  <div className={`relative z-10 my-auto flex items-center justify-center transition-all duration-500 ${isActive ? 'py-4' : 'py-2'}`}>
                    {company.logo && (
                      <div className={`rounded-2xl bg-[var(--bg-secondary)] p-3 sm:p-4 border border-[var(--border-color)] flex items-center justify-center transition-all duration-500 ${
                        isActive ? 'max-w-[280px] h-20 shadow-sm' : 'max-w-[150px] h-14 opacity-80'
                      }`}>
                        <img
                          src={company.logo.src}
                          alt={company.name}
                          width={company.logo.width}
                          height={company.logo.height}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Active Card Bottom Details Card */}
                  {isActive ? (
                    <div className="relative z-10 mt-auto bg-[var(--bg-secondary)]/90 border border-[var(--border-color)] p-5 sm:p-6 rounded-2xl shadow-sm space-y-2 animate-fadeIn">
                      <div>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-main)] leading-tight">
                          {company.name}
                        </h3>
                        <p className="text-xs font-semibold text-teal uppercase tracking-wider mt-1">
                          {company.role}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-[var(--text-muted)] flex items-start gap-2 pt-1 leading-relaxed">
                        <MapPin className="w-4 h-4 text-orange shrink-0 mt-0.5" />
                        <span>{company.location}</span>
                      </p>

                      {isLinked && (
                        <a
                          href={company.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-orange hover:text-[var(--accent-orange-deep)] pt-2 transition-colors group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Visit Official Website</span>
                          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      )}
                    </div>
                  ) : (
                    /* Collapsed Inactive Pill Button at bottom */
                    <div className="relative z-10 mt-auto flex justify-center w-full">
                      <div className="w-full text-center py-2 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-main)] font-bold text-xs truncate shadow-sm hover:border-[var(--accent-orange)] transition-colors">
                        <span className="text-[var(--accent-orange)] mr-1.5">{company.num}</span>
                        <span>{company.shortName}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
