import React, { useState, useEffect, useRef } from 'react';
import { companyTimeline } from '../data/siteData';
import { copy } from '../data/sectionCopy';

export default function JourneySection() {
  const c = copy['home.journey'];
  const timelineRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  // Initialize the first year as active by default so it shows up immediately
  const [activeItems, setActiveItems] = useState({
    [companyTimeline[0]?.year]: true
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
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

    // Query elements locally inside this container
    const elements = timelineRef.current.querySelectorAll('.timeline-node-item');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="journey" data-section="home.journey" className="section bg-[var(--bg-card)]">
      <div className="container-page">
        <div className="timeline-container relative" ref={timelineRef}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Sticky Title */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 h-fit">
              <span className="eyebrow eyebrow-teal">{c.eyebrow}</span>
              <h2 className="section-title">
                {c.title} <span className="text-orange">{c.titleAccent}</span>
              </h2>
              <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-sm leading-relaxed mt-3">
                {c.intro}
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
                          {milestone.year}
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
