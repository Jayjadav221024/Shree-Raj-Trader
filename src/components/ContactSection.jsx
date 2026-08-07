import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { companyInfo, faqs } from '../data/shreerajData';

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Motors / Switchgear Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({
        name: '',
        phone: '',
        email: '',
        subject: 'Motors / Switchgear Inquiry',
        message: ''
      });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono-code">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>CONNECT WITH ENGINEERING SALES</span>
          </div>

          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            CONTACT <span className="text-cyan-400 text-glow-cyan">SHREE RAJ TRADERS</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Visit our office or get in touch for instant engineering advice, price quotes, Siemens catalog datasheets, or custom FRP grating orders in Ahmedabad.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Contact Details & Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
              <h3 className="font-orbitron font-bold text-xl text-white border-b border-slate-800 pb-4">
                Head Office &amp; Warehouse
              </h3>

              <div className="space-y-5 text-xs text-slate-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono-code block mb-0.5">LOCATION ADDRESS</span>
                    <p className="text-slate-200 font-medium leading-relaxed">{companyInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono-code block mb-0.5">PHONE NUMBERS</span>
                    <p className="text-slate-200 font-medium">{companyInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono-code block mb-0.5">EMAIL INQUIRIES</span>
                    <p className="text-slate-200 font-medium">{companyInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono-code block mb-0.5">BUSINESS HOURS</span>
                    <p className="text-slate-200 font-medium">{companyInfo.operatingHours}</p>
                  </div>
                </div>
              </div>

              {/* Map View Box */}
              <div className="pt-4 border-t border-slate-800">
                <a
                  href="https://maps.google.com/?q=Ahmedabad+Gujarat"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono-code flex items-center justify-center gap-2 hover:border-cyan-400 transition"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Open Google Maps Location</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="font-orbitron font-bold text-xl text-white mb-2">
                Send Direct Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-mono-code mb-1 block">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Rajesh Shah"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono-code mb-1 block">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="+91 98250 XXXXX"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 font-mono-code mb-1 block">Email Address</label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="rajesh@company.com"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono-code mb-1 block">Subject Requirement</label>
                  <select
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                  >
                    <option value="Industrial Electric Motors">Industrial Electric Motors (Siemens/CG)</option>
                    <option value="Siemens Switchgear & ACB">Siemens Switchgear &amp; ACB</option>
                    <option value="FRP Gratings & Cable Trays">FRP Gratings &amp; Cable Trays</option>
                    <option value="Industrial Gearboxes">Industrial Gearboxes</option>
                    <option value="General Technical Support">General Technical Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono-code mb-1 block">Project Requirements / Note</label>
                <textarea
                  rows="4"
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Specify motor power HP, voltage, quantity, or FRP grating dimensions..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                />
              </div>

              {submitted && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Thank you! Your message has been sent successfully. Sales team will contact you shortly.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-cyan-500 text-slate-950 font-orbitron font-bold text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Engineering Inquiry
              </button>
            </form>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-center mb-8">
            <h3 className="font-orbitron font-bold text-2xl text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" /> FREQUENTLY ASKED QUESTIONS
            </h3>
          </div>

          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer transition-all hover:border-slate-700"
                onClick={() => setOpenFaq(isOpen ? -1 : idx)}
              >
                <div className="flex items-center justify-between gap-4 font-orbitron font-semibold text-sm text-slate-200">
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
                {isOpen && (
                  <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80 leading-relaxed animate-fadeIn">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
