import React from 'react';
import { Quote } from 'lucide-react';
import { testimonials, clientLogos } from '../data/siteData';
import { copy } from '../data/sectionCopy';

export default function TestimonialsSection({ testimonials: propTestimonials }) {
  const list = propTestimonials && propTestimonials.length > 0 ? propTestimonials : testimonials;
  const c = copy['home.testimonials'];
  const cl = copy['home.clients'];

  return (
    <section id="testimonials" className="section">
      <div className="container-page">
        <div data-section="home.testimonials">
        <div className="section-header">
          <span className="eyebrow">{c.eyebrow}</span>
          <h2 className="section-title">
            {c.title} <span className="text-orange">{c.titleAccent}</span>
          </h2>
          <p>{c.intro}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14 sm:mb-16">
          {list.map((item) => (
            <figure key={item.client} className="testimonial-card">
              <Quote className="w-8 h-8 text-[var(--accent-orange)] opacity-25" />

              <blockquote className="text-[var(--text-muted)] leading-relaxed flex-1 text-[0.95rem]">
                {item.feedback}
              </blockquote>

              <figcaption className="pt-4 border-t border-[var(--border-color)] flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'var(--grad-cyan)' }}
                >
                  <span className="font-display text-white text-lg leading-none pt-0.5">
                    {item.client.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-display text-lg tracking-wide text-[var(--text-main)] leading-none">
                    {item.client}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-orange mt-1">
                    {item.company}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        </div>

        {/* Reputed clients */}
        <div data-section="home.clients">
        <div className="section-header">
          <span className="eyebrow eyebrow-teal">{cl.eyebrow}</span>
          <h2 className="section-title">
            {cl.title} <span className="text-orange">{cl.titleAccent}</span>
          </h2>
        </div>

        <div className="marquee-wrapper relative overflow-hidden py-4 w-full">
          {/* Edge gradient fades for seamless overlay blending */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-neutral-100 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-neutral-100 to-transparent z-10 pointer-events-none" />

          <div className="marquee-track flex gap-6 animate-marquee hover:[animation-play-state:paused] cursor-pointer">
            {/* Set 1 */}
            {clientLogos.map((client) => (
              <div key={`set1-${client.name}`} className="client-chip w-64 sm:w-72 h-28 sm:h-32 px-6 py-4 shrink-0 flex items-center justify-center">
                <img
                  src={client.image.src}
                  alt={client.imageAlt || `${client.name} logo`}
                  width={client.image.width}
                  height={client.image.height}
                  loading="lazy"
                  className="max-h-20 sm:max-h-24 w-auto max-w-[85%] object-contain"
                />
              </div>
            ))}
            {/* Set 2 (Duplicated for infinite seamless loop transition) */}
            {clientLogos.map((client) => (
              <div key={`set2-${client.name}`} className="client-chip w-64 sm:w-72 h-28 sm:h-32 px-6 py-4 shrink-0 flex items-center justify-center">
                <img
                  src={client.image.src}
                  alt={client.imageAlt || `${client.name} logo`}
                  width={client.image.width}
                  height={client.image.height}
                  loading="lazy"
                  className="max-h-20 sm:max-h-24 w-auto max-w-[85%] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
