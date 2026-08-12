import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Building2, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [savedSubmissions, setSavedSubmissions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('whatslandlord_inquiries') || '[]');
    } catch {
      return [];
    }
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    portfolioSize: '51 – 250 Units',
    role: 'Property Manager',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.firstName && formData.email) {
      const newEntry = {
        ...formData,
        timestamp: new Date().toLocaleString()
      };
      const updatedList = [newEntry, ...savedSubmissions];
      setSavedSubmissions(updatedList);
      try {
        localStorage.getItem ? localStorage.setItem('whatslandlord_inquiries', JSON.stringify(updatedList)) : null;
      } catch (err) {
        console.log(err);
      }
      setIsSubmitted(true);
    }
  };
  return (
    <div>
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-brand-slate border-b border-brand-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="green" icon={Mail} className="mb-4">
            Contact & Demo Booking
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-neutral-dark tracking-tight leading-tight max-w-4xl mx-auto">
            Get in Touch with Our Real Estate Software Team
          </h1>
          <p className="mt-6 text-lg text-brand-neutral-muted max-w-3xl mx-auto leading-relaxed">
            Schedule a personalized software demonstration, inquire about custom enterprise integrations, or request portfolio migration assistance.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Contact Information & Offices */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <Badge variant="green" className="mb-3">Direct Contact</Badge>
                <h2 className="text-3xl font-extrabold text-brand-neutral-dark">Speak to an Enterprise Advisor</h2>
                <p className="text-sm text-brand-neutral-muted mt-2 leading-relaxed">
                  Our team is available Monday through Friday to answer questions about portfolio scale, custom pricing, and technical setup.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-brand-slate border border-brand-neutral-border">
                  <div className="p-2.5 rounded-lg bg-brand-blue text-white shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-neutral-dark">Email Inquiries</h4>
                    <p className="text-xs text-brand-neutral-muted mt-0.5">sales@propertysaas.com</p>
                    <p className="text-xs text-brand-neutral-muted">support@propertysaas.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-brand-slate border border-brand-neutral-border">
                  <div className="p-2.5 rounded-lg bg-brand-blue text-white shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-neutral-dark">Phone & Sales Line</h4>
                    <p className="text-xs text-brand-neutral-muted mt-0.5">+1 (800) 555-PROP (7767)</p>
                    <p className="text-xs text-brand-neutral-muted">Mon – Fri: 8:00 AM – 8:00 PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-brand-slate border border-brand-neutral-border">
                  <div className="p-2.5 rounded-lg bg-brand-blue text-white shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-neutral-dark">Corporate Headquarters</h4>
                    <p className="text-xs text-brand-neutral-muted mt-0.5">100 Enterprise Way, Suite 400</p>
                    <p className="text-xs text-brand-neutral-muted">Miami, FL 33131, United States</p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="p-5 rounded-2xl bg-brand-blue-surface border border-brand-blue/20 text-xs text-brand-blue space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enterprise Security Guaranteed</span>
                </div>
                <p className="text-brand-neutral-muted">
                  All demo requests and correspondence are strictly confidential and protected under SOC 2 compliance standards.
                </p>
              </div>
            </div>

            {/* Right Static Contact Form */}
            <div className="lg:col-span-7">
              <Card variant="white" className="p-8 sm:p-10 border-brand-neutral-border shadow-card">
                <h3 className="text-2xl font-extrabold text-brand-neutral-dark mb-2">Book a Live Personalized Demo</h3>
                <p className="text-xs text-brand-neutral-muted mb-6">
                  Fill out the form below to request a tailored 1-on-1 walkthrough of our property management platform.
                </p>

                {isSubmitted ? (
                  <div className="py-8 px-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4 animate-fade-in">
                    <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-extrabold text-emerald-950">Demo Request Submitted!</h3>
                    <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                      Thank you, <span className="font-bold">{formData.firstName || 'Valued User'}</span>! Your demo request for <span className="font-bold">{formData.portfolioSize}</span> has been saved. Our team will contact you at <span className="font-bold">{formData.email || 'your email'}</span>.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        Submit Another Inquiry
                      </button>
                      <button
                        onClick={() => setShowSubmissions(!showSubmissions)}
                        className="px-4 py-2.5 bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 font-bold text-xs rounded-xl transition-colors"
                      >
                        📋 View Stored Submissions ({savedSubmissions.length})
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-brand-neutral-dark mb-1">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className="w-full px-4 py-3 rounded-xl bg-brand-slate border border-brand-neutral-border text-brand-neutral-dark focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-brand-neutral-dark mb-1">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className="w-full px-4 py-3 rounded-xl bg-brand-slate border border-brand-neutral-border text-brand-neutral-dark focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-brand-neutral-dark mb-1">Work Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@company.com"
                          className="w-full px-4 py-3 rounded-xl bg-brand-slate border border-brand-neutral-border text-brand-neutral-dark focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-brand-neutral-dark mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 rounded-xl bg-brand-slate border border-brand-neutral-border text-brand-neutral-dark focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-brand-neutral-dark mb-1">Portfolio Size</label>
                        <select
                          name="portfolioSize"
                          value={formData.portfolioSize}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-brand-slate border border-brand-neutral-border text-brand-neutral-dark focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        >
                          <option>1 – 50 Units</option>
                          <option>51 – 250 Units</option>
                          <option>251 – 1,000 Units</option>
                          <option>1,000+ Units (Enterprise)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-brand-neutral-dark mb-1">Primary Role</label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-brand-slate border border-brand-neutral-border text-brand-neutral-dark focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        >
                          <option>Property Manager</option>
                          <option>Property Owner / Investor</option>
                          <option>Asset Manager</option>
                          <option>Operations Executive</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-brand-neutral-dark mb-1">How can we help your portfolio?</label>
                      <textarea
                        rows={4}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your current software challenges, accounting requirements, or migration timeline..."
                        className="w-full px-4 py-3 rounded-xl bg-brand-slate border border-brand-neutral-border text-brand-neutral-dark focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      ></textarea>
                    </div>

                    <Button type="submit" variant="primary" size="lg" icon={Send} className="w-full">
                      Submit Request
                    </Button>
                    <p className="text-[11px] text-center text-brand-neutral-muted">
                      Interactive enterprise demo form. Instant verification active.
                    </p>
                  </form>
                )}
              </Card>
            </div>
          </div>

          {/* Google Map Placeholder UI */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div 
              className="w-full h-56 rounded-2xl border border-brand-neutral-border relative overflow-hidden flex items-center justify-center text-center p-6 shadow-sm group"
              style={{ 
                backgroundColor: '#fbfaf8',
                backgroundImage: 'radial-gradient(#c7c3b9 1.5px, transparent 1.5px)', 
                backgroundSize: '24px 24px' 
              }}
            >
              {/* Overlay to fade grid slightly */}
              <div className="absolute inset-0 bg-white/60"></div>
              
              <div className="space-y-3 relative z-10 bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-white shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center mx-auto shadow-md relative">
                  {/* Ping animation behind pin */}
                  <div className="absolute inset-0 rounded-full bg-brand-blue animate-ping opacity-20"></div>
                  <MapPin className="w-6 h-6 text-brand-indigo-light relative z-10" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-brand-neutral-dark mb-1">Corporate Headquarters Location</h4>
                  <p className="text-xs text-brand-neutral-muted max-w-md mx-auto">
                    100 Enterprise Way, Suite 400, Miami, FL 33131<br />
                    <span className="text-[10px] text-brand-blue font-bold">Interactive Maps API Placeholder</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Submissions Modal */}
      {showSubmissions && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-brand-neutral-border max-h-[85vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-extrabold text-brand-neutral-dark flex items-center gap-2">
                <span>📋 Form Submissions Log</span>
                <span className="text-xs bg-brand-blue-surface text-brand-blue px-2 py-0.5 rounded-full font-bold">
                  {savedSubmissions.length} Entries
                </span>
              </h3>
              <button 
                onClick={() => setShowSubmissions(false)}
                className="text-gray-400 hover:text-gray-700 font-bold text-sm px-2 py-1 rounded-lg hover:bg-gray-100"
              >
                ✕ Close
              </button>
            </div>

            {savedSubmissions.length === 0 ? (
              <p className="text-xs text-brand-neutral-muted py-6 text-center">No submissions recorded yet. Fill and submit the form above!</p>
            ) : (
              <div className="space-y-3">
                {savedSubmissions.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-brand-slate border border-brand-neutral-border text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-brand-neutral-dark">
                      <span>{item.firstName} {item.lastName} ({item.email})</span>
                      <span className="text-[10px] text-brand-neutral-muted">{item.timestamp}</span>
                    </div>
                    <div className="text-brand-blue font-semibold">
                      Role: {item.role} | Portfolio: {item.portfolioSize} {item.phone ? `| Phone: ${item.phone}` : ''}
                    </div>
                    {item.message && (
                      <p className="text-brand-neutral-muted italic pt-1 border-t border-brand-slate-accent">"{item.message}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-between items-center text-xs text-brand-neutral-muted border-t">
              <button 
                onClick={() => {
                  localStorage.removeItem('whatslandlord_inquiries');
                  setSavedSubmissions([]);
                }}
                className="text-red-600 hover:underline font-bold"
              >
                Clear Log
              </button>
              <button 
                onClick={() => setShowSubmissions(false)}
                className="px-4 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-brand-blue-dark"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
