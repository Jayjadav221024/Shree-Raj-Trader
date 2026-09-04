import React, { useState } from 'react';
import { Quote, Users, Mail, ArrowRight, ShieldCheck, Award, HeartHandshake, Sparkles, Briefcase } from 'lucide-react';
import { leadershipMessages, teamMembers, careers } from '../data/team';
import { siteMeta, routes, companyInfo } from '../data/siteData';
import { copy } from '../data/sectionCopy';
import SEO from '../components/SEO';

const DEPARTMENTS = ['All', 'Leadership', 'Sales & Support', 'Operations & Logistics', 'Finance & Accounts'];

function getDepartment(role) {
  if (role.toLowerCase().includes('partner') || role.toLowerCase().includes('director')) return 'Leadership';
  if (role.toLowerCase().includes('sales') || role.toLowerCase().includes('territory')) return 'Sales & Support';
  if (role.toLowerCase().includes('godown') || role.toLowerCase().includes('inventory')) return 'Operations & Logistics';
  if (role.toLowerCase().includes('account')) return 'Finance & Accounts';
  return 'Operations & Logistics';
}

const CULTURE_PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Engineering Integrity',
    desc: 'Six decades of uncompromising quality standards and authorized partnerships with global leaders.'
  },
  {
    icon: Users,
    title: 'Customer First Mindset',
    desc: 'Dedicated technical advisors and fast-turnaround support for mission-critical industrial requirements.'
  },
  {
    icon: Award,
    title: 'Technical Mastery',
    desc: 'Continuous domain training in industrial motors, switchgears, and specialized cable containment systems.'
  },
  {
    icon: HeartHandshake,
    title: 'Collaborative Excellence',
    desc: 'A closely-knit family of engineering, logistics, and sales specialists committed to zero-downtime delivery.'
  }
];

export default function OurTeamPage() {
  const [activeDept, setActiveDept] = useState('All');

  const filteredMembers = activeDept === 'All'
    ? teamMembers
    : teamMembers.filter((m) => getDepartment(m.role) === activeDept);

  return (
    <div className="min-h-screen">
      <SEO
        title="Our Team & Leadership | Shree Raj Traders Ahmedabad"
        description="Meet the experienced leadership and dedicated technical team driving electro-mechanical excellence at Shree Raj Traders for over six decades."
      />

      {/* Page Header */}
      <section className="section page-top-spacing">
        <div className="container-page">
          <div className="section-header max-w-3xl mx-auto">
            <span className="eyebrow eyebrow-teal">
              <Users className="w-3.5 h-3.5" />
              Our People & Leadership
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-main)] mt-2">
              The Team Behind <span className="text-orange">60+ Years</span> of Trust
            </h1>
            <p className="text-[var(--text-muted)] text-base sm:text-lg mt-4 leading-relaxed">
              From technical engineering consultants to warehouse specialists, our team is united by a singular mission: delivering robust electro-mechanical solutions and zero-downtime customer satisfaction.
            </p>
          </div>

          {/* Leadership Messages */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-1 bg-[var(--accent-orange)] rounded-full inline-block"></span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
                Executive Leadership Messages
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {leadershipMessages.map((message) => (
                <div
                  key={message.id}
                  className="card p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--accent-orange)] transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-orange-tint)] rounded-bl-full -z-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      {message.photo ? (
                        <img
                          src={message.photo.src}
                          alt={message.photoAlt || message.name}
                          width={message.photo.width}
                          height={message.photo.height}
                          loading="lazy"
                          className="w-16 h-16 rounded-full object-cover object-top border-2 border-[var(--accent-orange)] shrink-0"
                        />
                      ) : (
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-2 border-[var(--accent-orange)]"
                          style={{ background: 'var(--grad-orange)' }}
                        >
                          <Quote className="w-7 h-7 text-white" />
                        </div>
                      )}
                      <div>
                        <div className="font-display text-xl font-bold text-[var(--text-main)]">
                          {message.name}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wider text-orange mt-0.5">
                          {message.role}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-0.5">
                          {message.heading}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed pt-3 border-t border-[var(--border-color)]">
                      &ldquo;{message.body}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Culture & Pillars */}
      <section className="section section-alt">
        <div className="container-page">
          <div className="section-header max-w-2xl mx-auto">
            <span className="eyebrow">Life @ Shree Raj Traders</span>
            <h2 className="section-title">
              Our Core <span className="text-orange">Work Philosophy</span>
            </h2>
            <p className="section-subtitle">
              The foundational values that inspire our everyday decisions, customer relationships, and operational excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CULTURE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="card card-hover p-7 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-cyan-tint)] text-[var(--accent-cyan)] flex items-center justify-center mb-5 border border-[rgba(20,96,122,0.15)]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[var(--text-main)] mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Directory with Filters */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="eyebrow eyebrow-teal">Team Directory</span>
              <h2 className="section-title">
                Meet Our <span className="text-orange">Specialists</span>
              </h2>
            </div>

            {/* Department Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveDept(dept)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeDept === dept
                      ? 'bg-[var(--accent-orange)] text-white shadow-[var(--shadow-glow)]'
                      : 'bg-white border border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredMembers.map((member) => {
              const dept = getDepartment(member.role);
              return (
                <div
                  key={member.name}
                  className="card card-hover overflow-hidden flex flex-col group"
                >
                  <div className="aspect-square w-full bg-[var(--bg-secondary)] overflow-hidden relative">
                    <img
                      src={member.photo.src}
                      alt={member.photoAlt || member.name}
                      width={member.photo.width}
                      height={member.photo.height}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="badge-tag bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-[var(--accent-cyan)] shadow-xs">
                        {dept}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-display text-base sm:text-lg font-bold text-[var(--text-main)] leading-snug">
                        {member.name}
                      </div>
                      <div className="text-xs font-semibold text-orange mt-1">
                        {member.role}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Join Our Team / Careers Banner */}
      <section className="section section-alt">
        <div className="container-page">
          <div className="card p-8 sm:p-12 relative overflow-hidden bg-gradient-to-br from-white to-[var(--bg-secondary)] border-2 border-[var(--border-color)]">
            <div className="max-w-2xl space-y-4">
              <span className="eyebrow">{careers.eyebrow}</span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
                {careers.heading}: <span className="text-orange">{careers.tagline}</span>
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                {careers.body}{' '}
                <a
                  href={`mailto:${careers.email}`}
                  className="font-bold text-[var(--accent-orange)] hover:underline inline-flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4 text-orange" />
                  {careers.email}
                </a>
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${careers.email}?subject=Career%20Application%20at%20Shree%20Raj%20Traders`}
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  Send Your Resume
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/career/"
                  className="btn btn-secondary inline-flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-teal" />
                  View Open Positions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
