import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { companyInfo, faqs, groupCompanies } from '../data/siteData';
import { copy } from '../data/sectionCopy';
import SEO from './SEO';
import api from '../admin/lib/axios';

export default function ContactSection({ faqs: propFaqs }) {
  const head = copy['contact.header'];
  const office = copy['contact.head-office'];
  const form = copy['contact.form'];
  const offices = copy['contact.group-offices'];
  const faqCopy = copy['contact.faqs'];
  const SUBJECTS = form.subjects.map((s) => s.label);

  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    subject: SUBJECTS[0] || '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save contact form inquiry to MongoDB
    api.post('/public/inquiries', {
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      company: 'General Lead',
      productName: formState.subject,
      quantity: 1,
      message: formState.message
    }).catch(err => console.error('[RFQ] Failed to save contact lead:', err));

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: '', phone: '', email: '', subject: SUBJECTS[0] || '', message: '' });
    }, 4000);
  };

  const update = (field) => (e) => setFormState({ ...formState, [field]: e.target.value });

  const groupOffices = groupCompanies.filter(c => c.name !== "Shree Raj Traders");

  return (
    <section id="contact" className="section page-top-spacing">
      <SEO title={copy['seo.contact'].title} description={copy['seo.contact'].description} />
      <div className="container-page">
        <div data-section="contact.header" className="section-header">
          <span className="eyebrow">{head.eyebrow}</span>
          <h2 className="section-title">
            {head.title} <span className="text-orange">{head.titleAccent}</span>
          </h2>
          <p>{head.intro}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14 sm:mb-16">
          {/* Details */}
          <div data-section="contact.head-office" className="lg:col-span-5 card p-6 sm:p-8 space-y-6">
            <h3 className="font-display text-xl sm:text-2xl tracking-wide uppercase text-[var(--text-main)]">{office.heading}</h3>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-[10px] bg-[var(--accent-orange-tint)] border border-[rgba(217,101,59,0.2)] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-orange" />
              </div>
              <div>
                <div className="form-label mb-1">{office.addressLabel}</div>
                <p className="text-sm text-[var(--text-main)] font-semibold leading-relaxed">
                  {companyInfo.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-[10px] bg-[var(--accent-orange-tint)] border border-[rgba(217,101,59,0.2)] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-orange" />
              </div>
              <div>
                <div className="form-label mb-1">{office.phoneLabel}</div>
                <p className="text-sm font-semibold">
                  <a href={`tel:${companyInfo.telPrimary}`} className="hover:text-[var(--accent-orange)] transition">
                    {companyInfo.phonePrimary}
                  </a>
                  <span className="text-[var(--text-faint)]"> / </span>
                  <a href={`tel:${companyInfo.telSecondary}`} className="hover:text-[var(--accent-orange)] transition">
                    {companyInfo.phoneSecondary}
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-[10px] bg-[var(--accent-orange-tint)] border border-[rgba(217,101,59,0.2)] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-orange" />
              </div>
              <div>
                <div className="form-label mb-1">{office.emailLabel}</div>
                {[companyInfo.emailPrimary, companyInfo.emailAccounts, companyInfo.emailAlternate].filter(Boolean).map((email) => (
                  <p key={email} className="text-sm font-semibold">
                    <a href={`mailto:${email}`} className="hover:text-[var(--accent-orange)] transition">
                      {email}
                    </a>
                  </p>
                ))}
              </div>
            </div>

            <a
              href={companyInfo.googleMaps}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary w-full"
            >
              <MapPin className="w-4 h-4 text-orange" />
              {office.mapsButton}
            </a>
          </div>

          {/* Form */}
          <div data-section="contact.form" className="lg:col-span-7 card p-6 sm:p-8">
            <h3 className="font-display text-xl sm:text-2xl tracking-wide uppercase text-[var(--text-main)] mb-5">{form.heading}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">{form.nameLabel}</label>
                  <input type="text" required value={formState.name} onChange={update('name')} placeholder="Your name" className="form-control" />
                </div>
                <div>
                  <label className="form-label">{form.phoneLabel}</label>
                  <input type="tel" required value={formState.phone} onChange={update('phone')} placeholder="+91 XXXXX XXXXX" className="form-control" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">{form.emailLabel}</label>
                  <input type="email" required value={formState.email} onChange={update('email')} placeholder="you@company.com" className="form-control" />
                </div>
                <div>
                  <label className="form-label">{form.subjectLabel}</label>
                  <select value={formState.subject} onChange={update('subject')} className="form-control">
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">{form.messageLabel}</label>
                <textarea rows={4} required value={formState.message} onChange={update('message')} placeholder="Please describe motor rating, quantity, frame size or switchgear specs..." className="form-control" />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                <Send className="w-4 h-4" />
                {form.submitLabel}
              </button>

              {submitted && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--accent-orange-tint)] text-[var(--accent-orange-deep)] text-sm font-semibold animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-orange shrink-0" />
                  {form.successMessage}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Group Associate Network Offices */}
        <div data-section="contact.group-offices" className="mb-14 sm:mb-16">
          <div className="section-header">
            <span className="eyebrow eyebrow-teal">{offices.eyebrow}</span>
            <h2 className="section-title">
              {offices.title} <span className="text-orange">{offices.titleAccent}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groupOffices.map((office) => (
              <div key={office.name} className="card p-6 sm:p-8 space-y-4">
                <h3 className="font-display text-xl sm:text-2xl tracking-wide uppercase text-[var(--text-main)]">{office.name}</h3>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-orange-tint)] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-orange" />
                  </div>
                  <div>
                    <div className="form-label mb-0.5">{offices.locationLabel}</div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {office.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--accent-orange-tint)] flex items-center justify-center shrink-0 mt-0.5">
                    <Send className="w-4 h-4 text-orange" />
                  </div>
                  <div>
                    <div className="form-label mb-0.5">{offices.divisionLabel}</div>
                    <p className="text-xs font-semibold text-[var(--text-main)]">
                      {office.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div data-section="contact.faqs" className="max-w-3xl mx-auto">
          <div className="section-header">
            <span className="eyebrow eyebrow-teal">{faqCopy.eyebrow}</span>
            <h2 className="section-title">
              {faqCopy.title} <span className="text-orange">{faqCopy.titleAccent}</span>
            </h2>
          </div>

          <div className="space-y-3">
            {(propFaqs && propFaqs.length > 0 ? propFaqs : faqs).map((faq, idx) => {
              const isOpen = openFaq === idx;
              const qText = faq.question || faq.q;
              const aText = faq.answer || faq.a;
              return (
                <div key={qText} className="card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="font-bold text-[var(--text-main)] text-[0.95rem]">{qText}</span>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-orange shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-[var(--text-faint)] shrink-0" />}
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-5 -mt-1 text-sm text-[var(--text-muted)] leading-relaxed animate-fadeIn">
                      {aText}
                    </p>
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
