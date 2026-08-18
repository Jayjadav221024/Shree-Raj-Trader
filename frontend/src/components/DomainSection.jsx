import React from 'react';
import { Cpu, Building2, Users, Leaf, Zap, Truck, ExternalLink, MapPin } from 'lucide-react';
import { domains, groupCompanies } from '../data/siteData';

const ICONS = { Cpu, Building2, Users, Leaf, Zap, Truck };

export default function DomainSection() {
  return (
    <section id="domains" className="section section-alt">
      <div className="container-page">
        <div className="section-header">
          <span className="eyebrow">What We Do</span>
          <h2 className="section-title">
            Our Operational <span className="text-orange">Domains</span>
          </h2>
          <p>
            Engineering, infrastructure, electrical distribution and logistics support for
            industries across Gujarat and India.
          </p>
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
                <h3 className="font-display text-xl sm:text-2xl tracking-wide uppercase text-[var(--text-main)]">{domain.title}</h3>
                <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2 leading-relaxed">
                  {domain.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Group of companies */}
        <div className="section-header">
          <span className="eyebrow eyebrow-teal">Synergistic Group Alliance</span>
          <h2 className="section-title">
            Our Group of <span className="text-orange">Companies</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {groupCompanies.map((company) => {
            const isLinked = Boolean(company.href) && company.href !== '/';
            const Wrapper = isLinked ? 'a' : 'div';
            const linkProps = isLinked
              ? { href: company.href, target: '_blank', rel: 'noreferrer' }
              : {};

            return (
              <Wrapper
                key={company.name}
                {...linkProps}
                className="card card-hover p-6 flex flex-col group"
              >
                {company.logo && (
                  <div className="h-12 flex items-center mb-4">
                    <img
                      src={company.logo.src}
                      alt={`${company.name} logo`}
                      width={company.logo.width}
                      height={company.logo.height}
                      loading="lazy"
                      className="max-h-10 max-w-[80%] object-contain"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl sm:text-2xl tracking-wide uppercase leading-tight group-hover:text-[var(--accent-orange)] transition-colors">
                    {company.name}
                  </h3>
                  {isLinked && (
                    <ExternalLink className="w-4 h-4 text-[var(--text-faint)] shrink-0 mt-1 group-hover:text-[var(--accent-orange)] transition-colors" />
                  )}
                </div>

                <p className="text-xs font-bold uppercase tracking-wider text-teal mt-1.5">
                  {company.role}
                </p>

                <p className="text-sm text-[var(--text-muted)] mt-3 leading-relaxed flex items-start gap-2 flex-1">
                  <MapPin className="w-3.5 h-3.5 text-orange shrink-0 mt-1" />
                  <span>{company.location}</span>
                </p>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
