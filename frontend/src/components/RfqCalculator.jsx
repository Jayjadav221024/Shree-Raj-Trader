import React, { useState, useEffect } from 'react';
import { Send, Check, Copy, FileText, MapPin, Phone, Mail } from 'lucide-react';
import { companyInfo } from '../data/siteData';

const CATEGORIES = [
  { id: 'motor', label: 'Motors' },
  { id: 'switchgear', label: 'Switchgears' },
  { id: 'frp', label: 'FRP Grating / Tray' }
];

export default function RfqCalculator({ preselectedProduct }) {
  // All fields start empty — the summary shows an empty state until the user
  // actually picks something, so no placeholder values can be mistaken for data.
  const [equipmentType, setEquipmentType] = useState('');
  const [brand, setBrand] = useState('');
  const [powerRating, setPowerRating] = useState('');
  const [rpm, setRpm] = useState('');
  const [enclosure, setEnclosure] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!preselectedProduct) return;
    const { categoryId, brand: productBrand } = preselectedProduct;
    if (categoryId === 'motors') setEquipmentType('motor');
    if (categoryId === 'switchgears') setEquipmentType('switchgear');
    if (categoryId === 'frp-gratings' || categoryId === 'frp-cable-trays') setEquipmentType('frp');
    if (productBrand) setBrand(productBrand);
  }, [preselectedProduct]);

  // True once the user has actually entered something worth quoting.
  const hasSelection = Boolean(
    equipmentType || brand || powerRating || enclosure || quantity || location ||
    clientName || clientPhone || clientEmail || notes
  );

  const getRfqSummaryText = () => {
    const lines = ['SHREE RAJ TRADERS — REQUEST FOR QUOTATION', ''];

    if (clientName) lines.push(`Client: ${clientName}`);
    if (clientPhone) lines.push(`Phone: ${clientPhone}`);
    if (clientEmail) lines.push(`Email: ${clientEmail}`);
    if (clientName || clientPhone || clientEmail) lines.push('');

    const req = [];
    const category = CATEGORIES.find((c) => c.id === equipmentType)?.label;
    if (category) req.push(`- Category: ${category}`);
    if (brand) req.push(`- Brand: ${brand}`);
    if (powerRating) req.push(`- Rating / Spec: ${powerRating}${equipmentType === 'motor' && rpm ? ` @ ${rpm}` : ''}`);
    if (enclosure) req.push(`- Protection / Size: ${enclosure}`);
    if (quantity) req.push(`- Quantity: ${quantity} units`);
    if (location) req.push(`- Delivery Location: ${location}`);
    if (notes) req.push(`- Notes: ${notes}`);

    if (req.length) lines.push('REQUIREMENT', ...req, '');
    lines.push('Please send your quotation and lead time.');

    return lines.join('\n');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getRfqSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="calculator" className="section section-alt">
      <div className="container-page">
        <div className="section-header">
          <span className="eyebrow">Request for Quotation</span>
          <h2 className="section-title">
            Build Your <span className="text-orange">Enquiry</span>
          </h2>
          <p>
            Select your requirement below and send it to our sales team by WhatsApp, or copy the
            summary into an email.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-7 card p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="form-label">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setEquipmentType(cat.id)}
                      className={`px-3 py-3 rounded-lg border text-xs font-bold uppercase tracking-wide transition ${
                        equipmentType === cat.id
                          ? 'bg-[var(--accent-orange)] text-white border-[var(--accent-orange)]'
                          : 'bg-white border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--accent-orange)]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {equipmentType === 'motor' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Brand</label>
                    <select value={brand} onChange={(e) => setBrand(e.target.value)} className="form-control">
                      <option value="Siemens">Siemens</option>
                      <option value="CGL (Crompton Greaves)">CGL (Crompton Greaves)</option>
                      <option value="Hindustan Electric">Hindustan Electric</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Output Power</label>
                    <select value={powerRating} onChange={(e) => setPowerRating(e.target.value)} className="form-control">
                      <option value="3 HP (2.2 kW)">3 HP (2.2 kW)</option>
                      <option value="5.5 HP (4 kW)">5.5 HP (4 kW)</option>
                      <option value="10 HP (7.5 kW)">10 HP (7.5 kW)</option>
                      <option value="15 HP (11 kW)">15 HP (11 kW)</option>
                      <option value="25 HP (18.5 kW)">25 HP (18.5 kW)</option>
                      <option value="50 HP (37 kW)">50 HP (37 kW)</option>
                      <option value="100 HP (75 kW)">100 HP (75 kW)</option>
                      <option value="200 HP - 425 HP">200 HP - 425 HP</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Speed / Poles</label>
                    <select value={rpm} onChange={(e) => setRpm(e.target.value)} className="form-control">
                      <option value="3000 RPM (2 Pole)">3000 RPM (2 Pole)</option>
                      <option value="1500 RPM (4 Pole)">1500 RPM (4 Pole)</option>
                      <option value="1000 RPM (6 Pole)">1000 RPM (6 Pole)</option>
                      <option value="750 RPM (8 Pole)">750 RPM (8 Pole)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Degree of Protection</label>
                    <select value={enclosure} onChange={(e) => setEnclosure(e.target.value)} className="form-control">
                      <option value="IP55">IP55</option>
                      <option value="IP56">IP56</option>
                      <option value="IP65">IP65</option>
                    </select>
                  </div>
                </div>
              )}

              {equipmentType === 'switchgear' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Product</label>
                    <select value={powerRating} onChange={(e) => setPowerRating(e.target.value)} className="form-control">
                      <option value="SIEMENS Switchgear Low Voltage Power Distribution Product">LV Power Distribution (Contactors)</option>
                      <option value="Low Voltage Control Product">Low Voltage Control Product (MCCB)</option>
                      <option value="MCB">MCB</option>
                      <option value="Sinnova">Sinnova</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Current Rating</label>
                    <select value={enclosure} onChange={(e) => setEnclosure(e.target.value)} className="form-control">
                      <option value="0.5A - 63A">0.5A - 63A (MCB)</option>
                      <option value="7A - 500A">7A - 500A (Contactors)</option>
                      <option value="16A - 630A">16A - 630A (Sinnova MCCB)</option>
                      <option value="16A - 1250A">16A - 1250A (MCCB)</option>
                      <option value="800A - 4000A">800A - 4000A (Sinnova ACB)</option>
                    </select>
                  </div>
                </div>
              )}

              {equipmentType === 'frp' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Product</label>
                    <select value={powerRating} onChange={(e) => setPowerRating(e.target.value)} className="form-control">
                      <option value="Meniscus Top">Meniscus Top</option>
                      <option value="Grit Top">Grit Top</option>
                      <option value="Checkered Plate">Checkered Plate</option>
                      <option value="Ladder Type Cable Tray">Ladder Type Cable Tray</option>
                      <option value="Perforated Cable Tray">Perforated Cable Tray</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Height (Gratings)</label>
                    <select value={enclosure} onChange={(e) => setEnclosure(e.target.value)} className="form-control">
                      <option value="25 mm">25 mm</option>
                      <option value="30 mm">30 mm</option>
                      <option value="38 mm">38 mm</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="form-label">Delivery Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Vatva, Ahmedabad"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="pt-5 border-t border-[var(--border-color)] space-y-4">
                <label className="form-label">Your Contact Details</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Company / Name *"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="form-control"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone *"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="form-control"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="form-control"
                  />
                </div>
                <textarea
                  rows="3"
                  placeholder="Additional notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-control"
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Generate Enquiry
              </button>

              {submitted && (
                <div className="p-4 rounded-lg bg-[var(--accent-cyan-tint)] border border-[rgba(20,96,122,0.25)] flex items-start gap-3 animate-fadeIn">
                  <Check className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--text-muted)]">
                    Enquiry ready. Send it via WhatsApp or copy the summary — our sales team will
                    contact you at <strong className="text-[var(--text-main)]">{clientPhone || 'your phone'}</strong>.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Summary + contact */}
          <div className="lg:col-span-5 space-y-5">
            <div className="card p-6 sm:p-7">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-orange" />
                <h3 className="text-[1.2rem]">Enquiry Summary</h3>
              </div>

              {hasSelection ? (
                <pre className="p-4 rounded-[12px] bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto font-sans-ui">
                  {getRfqSummaryText()}
                </pre>
              ) : (
                <div className="p-4 rounded-[12px] bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-faint)] leading-relaxed">
                  Choose a category and fill in your requirement — your enquiry summary will
                  appear here, ready to send.
                </div>
              )}

              <div className="mt-5 space-y-2.5">
                <a
                  href={`${companyInfo.whatsapp}?text=${encodeURIComponent(getRfqSummaryText())}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!hasSelection}
                  className={`btn btn-primary w-full ${hasSelection ? '' : 'pointer-events-none opacity-50'}`}
                >
                  <Send className="w-4 h-4" />
                  Send via WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!hasSelection}
                  className={`btn btn-secondary w-full ${hasSelection ? '' : 'opacity-50 cursor-not-allowed'}`}
                >
                  {copied ? <Check className="w-4 h-4 text-teal" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </button>
              </div>
            </div>

            <div className="card p-6 sm:p-7 space-y-4">
              <h3 className="text-[1.2rem]">Talk to Sales</h3>

              <a href={`tel:${companyInfo.telPrimary}`} className="flex items-start gap-3 group">
                <Phone className="w-4 h-4 text-orange shrink-0 mt-1" />
                <span className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--accent-orange)] transition">
                  {companyInfo.phone}
                </span>
              </a>

              <a href={`mailto:${companyInfo.emailPrimary}`} className="flex items-start gap-3 group">
                <Mail className="w-4 h-4 text-orange shrink-0 mt-1" />
                <span className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--accent-orange)] transition">
                  {companyInfo.emailPrimary}
                </span>
              </a>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange shrink-0 mt-1" />
                <span className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {companyInfo.address}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
