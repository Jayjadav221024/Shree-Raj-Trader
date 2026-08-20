import React, { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Paperclip,
  Send,
  Sparkles,
  Users,
  X
} from 'lucide-react';
import { companyInfo } from '../data/siteData';
import { copy } from '../data/sectionCopy';
import api from '../admin/lib/axios';
import SEO from '../components/SEO';

const CARD_ICONS = [Clock, Sparkles, Users, Briefcase];

/**
 * The careers page, served at /career/.
 *
 * It is deliberately absent from the navbar and the footer: the route exists and
 * works, but nothing on the site links to it, so it is only reachable by someone
 * given the address. Everything on it — copy, vacancies and the applications it
 * collects — is managed from the admin panel.
 */
export default function CareerPage() {
  const hero = copy['career.hero'];
  const why = copy['career.why-join'];
  const openingsCopy = copy['career.openings'];
  const form = copy['career.form'];
  const contact = copy['career.contact'];

  const openingsRef = useRef(null);
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    message: ''
  });
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorText, setErrorText] = useState('');

  const { data: openings, isLoading } = useQuery({
    queryKey: ['public-careers'],
    queryFn: async () => {
      const res = await api.get('/public/careers');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000
  });

  const roles = useMemo(() => openings || [], [openings]);

  const update = (field) => (event) =>
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  /** Pre-fills the form with the chosen role and jumps to it. */
  const applyForRole = (role) => {
    setFormState((prev) => ({ ...prev, position: role.title }));
    scrollTo(formRef);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    setErrorText('');

    try {
      // Upload the CV first: the application record stores a path to it, so a
      // failed upload must not produce an application pointing at nothing.
      let resumeUrl = '';
      if (resume) {
        const payload = new FormData();
        payload.append('document', resume);
        const uploadRes = await api.post('/public/upload/resume', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        resumeUrl = uploadRes.data?.data?.url || '';
      }

      await api.post('/public/job-applications', {
        ...formState,
        position: formState.position || form.positionPlaceholder,
        resumeUrl
      });

      setStatus('sent');
      setFormState({ name: '', email: '', phone: '', position: '', experience: '', message: '' });
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('[Careers] Application failed:', error);
      setStatus('error');
      setErrorText(error.response?.data?.message || form.errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEO title={copy['seo.career'].title} description={copy['seo.career'].description} />

      {/* Banner */}
      <section data-section="career.hero" className="section page-top-spacing">
        <div className="container-page">
          <div className="max-w-3xl space-y-5">
            <span className="eyebrow">
              <Briefcase className="w-3.5 h-3.5" />
              {hero.eyebrow}
            </span>
            <h1 className="leading-tight">
              {hero.title} <span className="text-orange">{hero.titleAccent}</span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">{hero.intro}</p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button onClick={() => scrollTo(openingsRef)} className="btn btn-primary">
                {hero.ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <span className="font-display text-4xl leading-none text-orange">
                  {isLoading ? '—' : roles.length}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-faint)] max-w-[9rem] leading-tight">
                  {hero.statsLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why join */}
      <section data-section="career.why-join" className="section section-alt">
        <div className="container-page">
          <div className="section-header">
            <span className="eyebrow">{why.eyebrow}</span>
            <h2 className="section-title">
              {why.title} <span className="text-orange">{why.titleAccent}</span>
            </h2>
            <p>{why.intro}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {why.items.map((item, idx) => {
              const Icon = CARD_ICONS[idx % CARD_ICONS.length];
              return (
                <div key={item.title} className="card card-hover p-6 space-y-3">
                  <div className="w-11 h-11 rounded-[12px] bg-[var(--accent-orange-tint)] border border-[rgba(217,101,59,0.2)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-orange" />
                  </div>
                  <h3 className="font-display text-xl tracking-wide uppercase text-[var(--text-main)]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vacancies */}
      <section ref={openingsRef} data-section="career.openings" className="section">
        <div className="container-page">
          <div className="section-header">
            <span className="eyebrow eyebrow-teal">{openingsCopy.eyebrow}</span>
            <h2 className="section-title">
              {openingsCopy.title} <span className="text-orange">{openingsCopy.titleAccent}</span>
            </h2>
            <p>{openingsCopy.intro}</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--text-muted)]">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading open positions…
            </div>
          ) : roles.length === 0 ? (
            <div className="card p-10 text-center max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-[12px] bg-[var(--accent-cyan-tint)] flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-teal" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl tracking-wide uppercase text-[var(--text-main)]">
                {openingsCopy.emptyTitle}
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                {openingsCopy.emptyBody}
              </p>
              <button onClick={() => scrollTo(formRef)} className="btn btn-primary mt-6">
                {form.submitLabel}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {roles.map((role) => (
                <article key={role._id} className="card card-hover p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                      <div>
                        <h3 className="font-display text-2xl tracking-wide uppercase text-[var(--text-main)] leading-tight">
                          {role.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          {role.department && (
                            <span className="inline-flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-orange" />
                              {role.department}
                            </span>
                          )}
                          {role.location && (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-orange" />
                              {role.location}
                            </span>
                          )}
                          {role.employmentType && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-orange" />
                              {role.employmentType}
                            </span>
                          )}
                          {role.experience && (
                            <span className="inline-flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-orange" />
                              {role.experience}
                            </span>
                          )}
                        </div>
                      </div>

                      {role.description && (
                        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                          {role.description}
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                        {role.responsibilities?.length > 0 && (
                          <div>
                            <div className="form-label mb-2">{openingsCopy.responsibilitiesLabel}</div>
                            <ul className="space-y-2">
                              {role.responsibilities.map((line) => (
                                <li
                                  key={line}
                                  className="flex items-start gap-2.5 text-sm text-[var(--text-muted)] leading-relaxed"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-orange shrink-0 mt-0.5" />
                                  <span>{line}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {role.requirements?.length > 0 && (
                          <div>
                            <div className="form-label mb-2">{openingsCopy.requirementsLabel}</div>
                            <ul className="space-y-2">
                              {role.requirements.map((line) => (
                                <li
                                  key={line}
                                  className="flex items-start gap-2.5 text-sm text-[var(--text-muted)] leading-relaxed"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                                  <span>{line}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <button onClick={() => applyForRole(role)} className="btn btn-primary w-full lg:w-auto">
                        {openingsCopy.applyLabel}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application form */}
      <section ref={formRef} data-section="career.form" className="section section-alt">
        <div className="container-page">
          <div className="section-header">
            <span className="eyebrow">{form.eyebrow}</span>
            <h2 className="section-title">
              {form.title} <span className="text-orange">{form.titleAccent}</span>
            </h2>
            <p>{form.intro}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 card p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">{form.nameLabel}</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={update('name')}
                      placeholder="Your full name"
                      className="form-control"
                    />
                  </div>
                  <div>
                    <label className="form-label">{form.phoneLabel}</label>
                    <input
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={update('phone')}
                      placeholder="+91 XXXXX XXXXX"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">{form.emailLabel}</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={update('email')}
                      placeholder="you@example.com"
                      className="form-control"
                    />
                  </div>
                  <div>
                    <label className="form-label">{form.experienceLabel}</label>
                    <input
                      type="text"
                      value={formState.experience}
                      onChange={update('experience')}
                      placeholder="e.g. 3 years"
                      className="form-control"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">{form.positionLabel}</label>
                  <input
                    type="text"
                    value={formState.position}
                    onChange={update('position')}
                    placeholder={form.positionPlaceholder}
                    className="form-control"
                  />
                </div>

                <div>
                  <label className="form-label">{form.messageLabel}</label>
                  <textarea
                    rows={4}
                    value={formState.message}
                    onChange={update('message')}
                    placeholder="A short note about your background and why this role interests you"
                    className="form-control"
                  />
                </div>

                {/* CV attachment */}
                <div>
                  <label className="form-label">{form.resumeLabel}</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx,.rtf,.odt"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-secondary btn-sm"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-orange" />
                      {resume ? 'Choose a different file' : 'Choose file'}
                    </button>

                    {resume && (
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-main)]">
                        <FileText className="w-4 h-4 text-orange shrink-0" />
                        <span className="truncate max-w-[16rem]">{resume.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setResume(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          aria-label="Remove attached file"
                          className="text-[var(--text-faint)] hover:text-[var(--accent-orange)] transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[var(--text-faint)] mt-2">{form.resumeHint}</p>
                </div>

                <button type="submit" disabled={status === 'sending'} className="btn btn-primary w-full">
                  {status === 'sending' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {form.submitLabel}
                </button>

                {status === 'sent' && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--accent-orange-tint)] text-[var(--accent-orange-deep)] text-sm font-semibold animate-fadeIn">
                    <CheckCircle2 className="w-5 h-5 text-orange shrink-0 mt-0.5" />
                    {form.successMessage}
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--accent-cyan-tint)] text-teal text-sm font-semibold animate-fadeIn">
                    <X className="w-5 h-5 shrink-0 mt-0.5" />
                    {errorText || form.errorMessage}
                  </div>
                )}
              </form>
            </div>

            {/* Email fallback */}
            <div className="lg:col-span-4">
              <div
                data-section="career.contact"
                className="card p-6 sm:p-8 space-y-4 border-l-4 border-l-[var(--accent-cyan)]"
              >
                <div className="w-11 h-11 rounded-[12px] bg-[var(--accent-cyan-tint)] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-teal" />
                </div>
                <h3 className="font-display text-xl tracking-wide uppercase text-[var(--text-main)]">
                  {contact.heading}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{contact.body}</p>
                <div>
                  <div className="form-label mb-1">{contact.emailLabel}</div>
                  <a
                    href={`mailto:${companyInfo.emailCareers}`}
                    className="text-sm font-bold text-[var(--text-main)] hover:text-[var(--accent-orange)] transition break-all"
                  >
                    {companyInfo.emailCareers}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
