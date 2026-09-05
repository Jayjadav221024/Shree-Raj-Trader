import React, { useState, useEffect, useRef } from 'react';
import { companyTimeline } from '../data/siteData';
import { copy } from '../data/sectionCopy';

export default function JourneySection() {
  const c = copy['home.journey'];
  const timelineRef = useRef(null);
  const trackRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeItems, setActiveItems] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current || !trackRef.current) return;
      
      const trackRect = trackRef.current.getBoundingClientRect();
      const triggerY = window.innerHeight * 0.55; // Milestone activates when at 55% of viewport
      
      // Calculate filled line height based on viewport center relative to track
      const topOffset = triggerY - trackRect.top;
      const progressPercent = Math.max(0, Math.min(100, (topOffset / trackRect.height) * 100));
      setScrollProgress(progressPercent);

      // Check which milestone items have crossed the trigger line
      const nodes = timelineRef.current.querySelectorAll('.timeline-node-item');
      const newActive = {};
      nodes.forEach((node) => {
        const nodeRect = node.getBoundingClientRect();
        const year = node.getAttribute('data-year');
        if (nodeRect.top + nodeRect.height * 0.25 <= triggerY) {
          newActive[year] = true;
        }
      });

      // Keep at least the first item active if top of section is reached
      if (trackRect.top <= triggerY && companyTimeline[0]?.year) {
        newActive[companyTimeline[0].year] = true;
      }

      setActiveItems(newActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section id="journey" data-section="home.journey" className="section bg-[var(--bg-card)] overflow-hidden">
      <div className="container-page">
        <div className="timeline-container relative" ref={timelineRef}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Sticky Title & Info */}
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
              <div 
                ref={trackRef}
                className="absolute left-6 lg:left-8 top-6 bottom-6 w-1 bg-slate-200 rounded-full overflow-hidden"
              >
                {/* Dynamic liquid glowing scroll progress fill */}
                <div 
                  className="w-full bg-gradient-to-b from-[var(--accent-orange)] via-[var(--accent-orange-bright)] to-[var(--accent-orange)] rounded-full transition-all duration-100 ease-linear shadow-[0_0_12px_rgba(217,101,59,0.8)]"
                  style={{ height: `${scrollProgress}%` }}
                />
              </div>

              <div className="space-y-12">
                {companyTimeline.map((milestone, idx) => {
                  const isActive = !!activeItems[milestone.year];
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
                        className={`absolute -left-12 lg:-left-16 w-11 h-11 rounded-full border-[3px] bg-white flex items-center justify-center transition-all duration-500 z-10 ${
                          isActive 
                            ? 'border-[var(--accent-orange)] shadow-[0_0_20px_rgba(217,101,59,0.55)] scale-110 bg-[var(--accent-orange-tint)]' 
                            : 'border-slate-300 opacity-60'
                        }`}
                      >
                        <span className={`text-[0.7rem] font-black transition-colors ${
                          isActive ? 'text-[var(--accent-orange-deep)]' : 'text-slate-400'
                        }`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Milestone details card */}
                      <div className={`card p-6 sm:p-7 w-full flex-1 relative border-l-4 transition-all duration-500 ${
                        isActive
                          ? 'border-l-[var(--accent-orange)] border-[var(--border-color)] shadow-[var(--shadow-lift)]'
                          : 'border-l-slate-300 border-slate-200/80 shadow-sm opacity-60'
                      }`}>
                        <div className={`font-display text-3xl sm:text-4xl font-extrabold leading-none transition-colors duration-300 ${
                          isActive ? 'text-[var(--accent-orange)]' : 'text-slate-400'
                        }`}>
                          {milestone.year}
                        </div>
                        <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2.5 leading-relaxed font-medium">
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
