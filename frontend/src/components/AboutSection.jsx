import React, { useState, useEffect, useRef } from 'react';
import { Quote, Eye, Target, Wrench, Mail, Users, ShieldCheck, Award, HeartHandshake, ArrowRight, Briefcase } from 'lucide-react';
import { companyInfo, companyTimeline, epcDivision, siteMeta } from '../data/siteData';
import { leadershipMessages, teamMembers, careers } from '../data/team';
import { copy } from '../data/sectionCopy';
import CountUp from './CountUp';
import SEO from './SEO';

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

export default function AboutSection() {
  const intro = copy['about.intro'];
  const vm = copy['about.vision-mission'];
  const tagline = copy['about.group-tagline'];
  const team = copy['about.team'];
  const journey = copy['about.journey'];
  
  const [activeDept, setActiveDept] = useState('All');
  const timelineRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeItems, setActiveItems] = useState({
    [companyTimeline[0]?.year]: true
  });

  const filteredMembers = activeDept === 'All'
    ? teamMembers
    : teamMembers.filter((m) => getDepartment(m.role) === activeDept);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate start and end offsets relative to viewport
      const start = rect.top - viewportHeight * 0.7;
      const end = rect.bottom - viewportHeight * 0.3;
      const total = end - start;
      const current = -start;
      
      let progress = Math.max(0, Math.min(100, (current / total) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!timelineRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const year = entry.target.getAttribute('data-year');
            if (year) {
              setActiveItems((prev) => ({ ...prev, [year]: true }));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    const elements = timelineRef.current.querySelectorAll('.timeline-node-item');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="About Us & Our Team | Shree Raj Traders Ahmedabad"
        description="Learn about Shree Raj Traders, our 60+ years legacy, leadership, corporate vision, and dedicated team of electro-mechanical specialists in Ahmedabad, Gujarat."
        image={siteMeta.aboutPhoto}
        imageAlt={intro.photoAlt}
      />

      {/* Hero / About Company Introduction */}
      <section id="about" className="section page-top-spacing pb-12">
        <div className="container-page">
          <div data-section="about.intro">
            <div className="section-header max-w-3xl mx-auto">
              <span className="eyebrow">{intro.eyebrow}</span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text-main)] mt-2">
                {intro.title} <span className="text-orange">{intro.titleAccent}</span>
              </h1>
              <p className="text-[var(--text-muted)] text-base sm:text-lg mt-4 leading-relaxed">
                {companyInfo.about}
              </p>
            </div>

            {/* Facility photo */}
            <div className="card overflow-hidden mb-12 shadow-[var(--shadow-lift)] rounded-3xl border-2 border-[var(--border-color)]">
              <img
                src={siteMeta.aboutPhoto.src}
                alt={intro.photoAlt}
                width={siteMeta.aboutPhoto.width}
                height={siteMeta.aboutPhoto.height}
                loading="lazy"
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          </div>

          {/* Vision & Mission */}
          <div data-section="about.vision-mission" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: Eye, title: vm.visionTitle, body: companyInfo.vision },
              { icon: Target, title: vm.missionTitle, body: companyInfo.mission }
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="card card-hover p-8 border-2 border-[var(--border-color)]">
                <div className="w-12 h-12 rounded-[12px] bg-[var(--accent-cyan-tint)] border border-[rgba(20,96,122,0.2)] flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-teal" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-main)]">{title}</h3>
                <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2.5 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* Group Tagline */}
          <div
            data-section="about.group-tagline"
            className="card p-8 mb-12 text-center border-l-4 border-l-[var(--accent-cyan)] bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-secondary)]"
          >
            <p className="italic text-base md:text-lg text-[var(--text-main)] font-medium">
              &ldquo;{tagline.quote}&rdquo;
            </p>
          </div>

          {/* EPC Division */}
          {epcDivision.enabled && (
            <div data-section="about.epc" className="card p-8 mb-12 border-2 border-[var(--border-color)]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-[var(--accent-orange-tint)] border border-[rgba(217,101,59,0.2)] flex items-center justify-center shrink-0">
                  <Wrench className="w-7 h-7 text-orange" />
                </div>
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-main)]">{epcDivision.title}</h3>
                  <p className="text-sm sm:text-base text-[var(--text-muted)] mt-1.5 leading-relaxed">
                    {epcDivision.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Leadership Messages */}
      <section id="leadership" data-section="about.leadership" className="section section-alt scroll-mt-24">
        <div className="container-page">
          <div className="section-header max-w-3xl mx-auto">
            <span className="eyebrow eyebrow-teal">
              <Users className="w-3.5 h-3.5" />
              Leadership Insights
            </span>
            <h2 className="section-title">
              Executive <span className="text-orange">Leadership Messages</span>
            </h2>
            <p className="section-subtitle">
              Guidance and commitment from our leaders driving electro-mechanical innovation and trust.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
            {leadershipMessages.map((message) => (
              <div
                key={message.id}
                className="card p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group hover:border-[var(--accent-orange)] transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-orange-tint)] rounded-bl-full -z-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                
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
      </section>

      {/* Culture & Work Philosophy Pillars */}
      <section className="section">
        <div className="container-page">
          <div className="section-header max-w-2xl mx-auto">
            <span className="eyebrow">Work Philosophy</span>
            <h2 className="section-title">
              Our Core <span className="text-orange">Values & Culture</span>
            </h2>
            <p className="section-subtitle">
              The foundational principles that inspire our team relationships and customer delivery every day.
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

      {/* Team Directory with Department Filters */}
      <section id="team-directory" className="section section-alt">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="eyebrow eyebrow-teal">{team.eyebrow}</span>
              <h2 className="section-title">
                {team.title} <span className="text-orange">{team.titleAccent}</span>
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2 max-w-xl">
                Meet the engineering consultants, sales advisors, logistics managers, and accounts staff powering our operations.
              </p>
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
                  className="card card-hover overflow-hidden flex flex-col group bg-white border border-[var(--border-color)] shadow-xs"
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

      {/* Timeline Section */}
      <section className="section">
        <div className="container-page">
          <div ref={timelineRef} data-section="about.journey" className="timeline-container relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Sticky Title */}
              <div className="lg:col-span-5 lg:sticky lg:top-28 h-fit space-y-4">
                <span className="eyebrow eyebrow-teal">{journey.eyebrow}</span>
                <h2 className="section-title">
                  {journey.title} <span className="text-orange">{journey.titleAccent}</span>
                </h2>
                <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-sm leading-relaxed">
                  {journey.intro}
                </p>
              </div>

              {/* Right Column: Animated Track and Cards */}
              <div className="lg:col-span-7 relative pl-12 lg:pl-16">
                {/* Vertical timeline track line */}
                <div className="absolute left-6 lg:left-8 top-4 bottom-4 w-1 bg-[var(--border-color)] rounded-full">
                  {/* Scroll progress fill overlay */}
                  <div 
                    className="w-full bg-[var(--accent-orange)] rounded-full transition-all duration-150 ease-out"
                    style={{ height: `${scrollProgress}%` }}
                  />
                </div>

                <div className="space-y-10">
                  {companyTimeline.map((milestone, idx) => {
                    const isActive = activeItems[milestone.year];
                    return (
                      <div 
                        key={milestone.year} 
                        data-year={milestone.year}
                        className={`timeline-node-item relative flex flex-col sm:flex-row sm:items-center gap-4 ${
                          isActive ? 'active' : ''
                        }`}
                      >
                        {/* Interactive dot/node indicator */}
                        <div 
                          className={`absolute -left-12 lg:-left-16 w-10 h-10 rounded-full border-4 bg-white flex items-center justify-center transition-all duration-300 z-10 ${
                            isActive 
                              ? 'border-[var(--accent-orange)] shadow-[var(--shadow-glow)] scale-110' 
                              : 'border-[var(--border-color)]'
                          }`}
                        >
                          <span className="text-[0.62rem] font-bold text-[var(--accent-cyan)] uppercase">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Milestone details card */}
                        <div className="card card-hover p-6 w-full flex-1 relative border-l-4 border-l-[var(--accent-orange)]">
                          <div className="font-display text-3xl leading-none text-orange">
                            {isActive ? (
                              <CountUp value={milestone.year} />
                            ) : (
                              <span className="opacity-0">0000</span>
                            )}
                          </div>
                          <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                            {milestone.event}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Careers Banner */}
      <section className="section section-alt pt-0 pb-16">
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
