import React, { useState, useEffect, useRef } from 'react';
import { Quote, Eye, Target, Wrench, Mail } from 'lucide-react';
import { companyInfo, companyTimeline, epcDivision, siteMeta } from '../data/siteData';
import { leadershipMessages, teamMembers, careers } from '../data/team';
import { copy } from '../data/sectionCopy';
import CountUp from './CountUp';
import SEO from './SEO';

export default function AboutSection() {
  const intro = copy['about.intro'];
  const vm = copy['about.vision-mission'];
  const tagline = copy['about.group-tagline'];
  const team = copy['about.team'];
  const journey = copy['about.journey'];
  const timelineRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeItems, setActiveItems] = useState({
    [companyTimeline[0]?.year]: true
  });

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
    <section id="about" className="section page-top-spacing">
      <SEO
        title={copy['seo.about'].title}
        description={copy['seo.about'].description}
        image={siteMeta.aboutPhoto}
        imageAlt={intro.photoAlt}
      />
      <div className="container-page">
        <div data-section="about.intro">
          <div className="section-header">
            <span className="eyebrow">{intro.eyebrow}</span>
            <h2 className="section-title">
              {intro.title} <span className="text-orange">{intro.titleAccent}</span>
            </h2>
            <p>{companyInfo.about}</p>
          </div>

          {/* Facility photo */}
          <div className="card overflow-hidden mb-6">
            <img
              src={siteMeta.aboutPhoto.src}
              alt={intro.photoAlt}
              width={siteMeta.aboutPhoto.width}
              height={siteMeta.aboutPhoto.height}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Leadership messages */}
        <div id="leadership" data-section="about.leadership" className="space-y-6 mb-6 scroll-mt-28">
          {leadershipMessages.map((message) => (
            <div key={message.id} className="card p-8 sm:p-10">
              <div className="flex flex-col md:flex-row gap-7">
                {message.photo ? (
                  <img
                    src={message.photo.src}
                    alt={message.photoAlt || message.name}
                    width={message.photo.width}
                    height={message.photo.height}
                    loading="lazy"
                    className="w-24 h-24 rounded-[12px] object-cover object-top shrink-0"
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-[12px] flex items-center justify-center shrink-0"
                    style={{ background: 'var(--grad-orange)' }}
                  >
                    <Quote className="w-7 h-7 text-white" />
                  </div>
                )}
                <div className="space-y-4">
                  <span className="eyebrow">{message.heading}</span>
                  <p className="text-[var(--text-muted)] leading-relaxed">{message.body}</p>
                  <div className="pt-4 border-t border-[var(--border-color)]">
                    <div className="font-display text-2xl tracking-wide text-[var(--text-main)]">
                      {message.name}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-orange mt-0.5">
                      {message.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vision & mission */}
        <div data-section="about.vision-mission" className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {[
            { icon: Eye, title: vm.visionTitle, body: companyInfo.vision },
            { icon: Target, title: vm.missionTitle, body: companyInfo.mission }
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="card card-hover p-7">
              <div className="w-12 h-12 rounded-[12px] bg-[var(--accent-cyan-tint)] border border-[rgba(20,96,122,0.2)] flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-teal" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl tracking-wide uppercase text-[var(--text-main)]">{title}</h3>
              <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Group Tagline */}
        <div
          data-section="about.group-tagline"
          className="card p-7 mb-6 text-center border-l-4 border-l-[var(--accent-cyan)]"
        >
          <p className="italic text-base md:text-lg text-[var(--text-main)] font-medium">
            &ldquo;{tagline.quote}&rdquo;
          </p>
        </div>

        {/* EPC division */}
        {epcDivision.enabled && (
        <div data-section="about.epc" className="card p-7 mb-14 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-12 h-12 rounded-[12px] bg-[var(--accent-orange-tint)] border border-[rgba(217,101,59,0.2)] flex items-center justify-center shrink-0">
              <Wrench className="w-6 h-6 text-orange" />
            </div>
            <div>
              <h3 className="font-display text-xl sm:text-2xl tracking-wide uppercase text-[var(--text-main)]">{epcDivision.title}</h3>
              <p className="text-sm sm:text-base text-[var(--text-muted)] mt-1.5 leading-relaxed">
                {epcDivision.description}
              </p>
            </div>
          </div>
        </div>
        )}

        {/* Our Team */}
        <div data-section="about.team">
        <div className="section-header">
          <span className="eyebrow eyebrow-teal">{team.eyebrow}</span>
          <h2 className="section-title">
            {team.title} <span className="text-orange">{team.titleAccent}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="card card-hover overflow-hidden">
              <img
                src={member.photo.src}
                alt={member.photoAlt || member.name}
                width={member.photo.width}
                height={member.photo.height}
                loading="lazy"
                className="w-full h-auto object-cover"
              />
              <div className="p-4">
                <div className="font-display text-lg tracking-wide leading-none text-[var(--text-main)]">
                  {member.name}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-orange mt-1.5 leading-snug">
                  {member.role}
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* Careers */}
        <div data-section="about.careers" className="card p-8 sm:p-10 mb-14 sm:mb-16">
          <span className="eyebrow">{careers.eyebrow}</span>
          <h3 className="font-display text-xl sm:text-2xl tracking-wide uppercase text-[var(--text-main)] mt-2">{careers.heading}</h3>
          <p className="font-display text-xl sm:text-2xl tracking-wide text-orange mt-2">{careers.tagline}</p>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-3 leading-relaxed">
            {careers.body}{' '}
            <a
              href={`mailto:${careers.email}`}
              className="font-bold text-[var(--text-main)] hover:text-[var(--accent-orange)] transition inline-flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-orange" />
              {careers.email}
            </a>
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} data-section="about.journey" className="timeline-container mt-16 relative">
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
  );
}
