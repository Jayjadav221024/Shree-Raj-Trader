import React, { useState, useEffect } from 'react';
import { Calculator, Send, Check, Copy, FileText, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { companyInfo } from '../data/shreerajData';

export default function RfqCalculator({ preselectedProduct, onCloseModal }) {
  const [equipmentType, setEquipmentType] = useState('motor');
  const [brand, setBrand] = useState('Siemens');
  const [powerRating, setPowerRating] = useState('15 HP (11 kW)');
  const [rpm, setRpm] = useState('1500 RPM (4 Pole)');
  const [enclosure, setEnclosure] = useState('IP55 Cast Iron');
  const [quantity, setQuantity] = useState(2);
  const [location, setLocation] = useState('Ahmedabad, Gujarat');
  
  // Customer details
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (preselectedProduct) {
      if (preselectedProduct.categoryId === 'motors') setEquipmentType('motor');
      if (preselectedProduct.categoryId === 'switchgears') setEquipmentType('switchgear');
      if (preselectedProduct.categoryId === 'frp-gratings') setEquipmentType('frp');
      if (preselectedProduct.brand) setBrand(preselectedProduct.brand);
    }
  }, [preselectedProduct]);

  const handleCalculateAndSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // fallback
    }
  };

  const getRfqSummaryText = () => {
    return `=== SHREE RAJ TRADERS - RFQ ESTIMATE REQUEST ===
Client: ${clientName || 'Valued Customer'}
Phone: ${clientPhone || 'N/A'}
Email: ${clientEmail || 'N/A'}

EQUIPMENT DETAILS:
- Product Type: ${equipmentType.toUpperCase()}
- Brand: ${brand}
- Rating / Spec: ${powerRating} @ ${rpm}
- Protection / Finish: ${enclosure}
- Quantity: ${quantity} units
- Project Delivery Location: ${location}
- Notes: ${notes || 'None'}

Please send official price quotation and lead time.`;
  };

  const handleCopyRfq = () => {
    navigator.clipboard.writeText(getRfqSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="calculator" className="py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono-code">
            <Calculator className="w-3.5 h-3.5" />
            <span>INSTANT QUOTATION ENGINE</span>
          </div>

          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
            SMART <span className="text-cyan-400 text-glow-cyan">RFQ CALCULATOR</span>
          </h2>

          <p className="text-slate-400 text-sm">
            Select your industrial motor or switchgear specifications below to build your quotation request and receive instant engineering pricing from Shree Raj Traders.
          </p>
        </div>

        {/* Calculator Form & Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <form onSubmit={handleCalculateAndSubmit} className="space-y-5 text-xs">
              {/* Category Selector */}
              <div>
                <label className="text-slate-400 font-mono-code mb-2 block uppercase">Select Equipment Category:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'motor', label: 'IE3/IE4 Motor' },
                    { id: 'switchgear', label: 'Siemens Switchgear' },
                    { id: 'frp', label: 'FRP Grating/Tray' }
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setEquipmentType(cat.id)}
                      className={`p-3 rounded-xl border text-center font-orbitron font-semibold transition-all ${
                        equipmentType === cat.id
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Specs based on Category */}
              {equipmentType === 'motor' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-mono-code mb-1 block">Preferred Brand:</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                    >
                      <option value="Siemens">Siemens (IE3/IE4)</option>
                      <option value="Crompton Greaves">Crompton Greaves (CG)</option>
                      <option value="Hindustan Electric">Hindustan Electric</option>
                      <option value="Innomotics">Innomotics</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-mono-code mb-1 block">Power Rating (HP / kW):</label>
                    <select
                      value={powerRating}
                      onChange={(e) => setPowerRating(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                    >
                      <option value="3 HP (2.2 kW)">3 HP (2.2 kW)</option>
                      <option value="5.5 HP (4 kW)">5.5 HP (4 kW)</option>
                      <option value="10 HP (7.5 kW)">10 HP (7.5 kW)</option>
                      <option value="15 HP (11 kW)">15 HP (11 kW)</option>
                      <option value="25 HP (18.5 kW)">25 HP (18.5 kW)</option>
                      <option value="50 HP (37 kW)">50 HP (37 kW)</option>
                      <option value="100 HP (75 kW)">100 HP (75 kW)</option>
                      <option value="200 HP+ Custom">200 HP+ Heavy Industrial</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-mono-code mb-1 block">Speed / Poles:</label>
                    <select
                      value={rpm}
                      onChange={(e) => setRpm(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                    >
                      <option value="3000 RPM (2 Pole)">3000 RPM (2 Pole)</option>
                      <option value="1500 RPM (4 Pole)">1500 RPM (4 Pole)</option>
                      <option value="1000 RPM (6 Pole)">1000 RPM (6 Pole)</option>
                      <option value="750 RPM (8 Pole)">750 RPM (8 Pole)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-mono-code mb-1 block">Enclosure Protection:</label>
                    <select
                      value={enclosure}
                      onChange={(e) => setEnclosure(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                    >
                      <option value="IP55 Standard Cast Iron">IP55 Standard Cast Iron</option>
                      <option value="IP56 / IP66 Severe Duty">IP56 / IP66 Severe Duty</option>
                      <option value="Flameproof Ex-d Gas Group IIB/IIC">Flameproof Ex-d (Gas Group IIB/IIC)</option>
                    </select>
                  </div>
                </div>
              )}

              {equipmentType === 'switchgear' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-mono-code mb-1 block">Siemens Product Line:</label>
                    <select
                      value={powerRating}
                      onChange={(e) => setPowerRating(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                    >
                      <option value="Siemens Air Circuit Breaker (ACB)">Siemens Air Circuit Breaker (ACB)</option>
                      <option value="Siemens Molded Case Breaker (MCCB)">Siemens Molded Case Breaker (MCCB)</option>
                      <option value="Siemens Power Contactor & Overload">Siemens Contactor &amp; Overload</option>
                      <option value="Siemens MCB 5SL/5SY Series">Siemens MCB 5SL / 5SY Series</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-mono-code mb-1 block">Current Rating (Amperes):</label>
                    <select
                      value={rpm}
                      onChange={(e) => setRpm(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                    >
                      <option value="63A - 250A MCCB">63A - 250A</option>
                      <option value="400A - 800A ACB/MCCB">400A - 800A</option>
                      <option value="1000A - 2500A Heavy ACB">1000A - 2500A ACB</option>
                      <option value="3200A - 6300A Power ACB">3200A - 6300A Main ACB</option>
                    </select>
                  </div>
                </div>
              )}

              {equipmentType === 'frp' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 font-mono-code mb-1 block">FRP Product Type:</label>
                    <select
                      value={powerRating}
                      onChange={(e) => setPowerRating(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                    >
                      <option value="Meniscus Top Molded FRP Grating">Meniscus Top Molded Grating</option>
                      <option value="Grit Top Anti-Skid FRP Grating">Grit Top Anti-Skid Grating</option>
                      <option value="Checkered Solid Covered FRP Plate">Checkered Solid Covered Plate</option>
                      <option value="Pultruded FRP Ladder Cable Tray">Pultruded FRP Ladder Cable Tray</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 font-mono-code mb-1 block">Thickness / Depth:</label>
                    <select
                      value={enclosure}
                      onChange={(e) => setEnclosure(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                    >
                      <option value="25mm Mesh Depth">25mm Mesh Depth</option>
                      <option value="30mm Heavy Mesh">30mm Heavy Mesh</option>
                      <option value="38mm Industrial Platform Standard">38mm Industrial Platform</option>
                      <option value="50mm Extra Heavy Duty Load">50mm Extra Heavy Duty</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Quantity & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-slate-400 font-mono-code mb-1 block">Required Quantity (Units):</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-mono-code mb-1 block">Delivery Location:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Odhav GIDC, Ahmedabad"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <span className="text-slate-400 font-mono-code block">YOUR CONTACT DETAILS (FOR FORMAL QUOTE DISPATCH):</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Company / Your Name *"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Phone Number *"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-slate-950 font-orbitron font-bold text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Generate Official RFQ Quote
              </button>
            </form>
          </div>

          {/* RFQ Preview & Copy Box */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-orbitron font-bold text-sm">
                  <FileText className="w-4 h-4" /> RFQ SUMMARY PREVIEW
                </div>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950 text-cyan-300">
                  READY
                </span>
              </div>

              {/* Formatted Code Box */}
              <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] font-mono-code text-cyan-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {getRfqSummaryText()}
              </pre>

              {submitted && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-3 animate-fadeIn">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-orbitron font-bold">RFQ Request Dispatched!</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Our sales engineer at Shree Raj Traders will contact you at <strong>{clientPhone || 'your phone'}</strong> within 2 business hours with pricing.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-3">
              <button
                type="button"
                onClick={handleCopyRfq}
                className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono-code text-xs hover:border-cyan-400 transition flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy RFQ Summary Text'}</span>
              </button>

              <a
                href={`https://wa.me/919825012345?text=${encodeURIComponent(getRfqSummaryText())}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-orbitron font-bold text-xs text-center flex items-center justify-center gap-2 hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" /> Send RFQ via WhatsApp Instant
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
