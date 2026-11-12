import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

const Contact = () => {
  const { addToast } = useNotifications();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleModel: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      addToast('Please fill out all mandatory contact fields.', 'warning');
      return;
    }
    setSubmitted(true);
    addToast('Your inquiry has been dispatched to our service desk.', 'success');
  };

  return (
    <div className="py-12 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-automotive-orange bg-automotive-orange/10 px-3 py-1 rounded-full border border-automotive-orange/20">
          GET IN TOUCH
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Workshop Operations & Support
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Need custom diagnostics, fleet management consultations, or emergency breakdown advice?
          Reach our master service desk directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
              Workshop Contact Info
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-automotive-orange/10 border border-automotive-orange/30 flex items-center justify-center text-automotive-orange shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Main Facility</h4>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    Plot 100, Hi-Tech Automotive Hub, Industrial Corridor Phase II,
                    Hyderabad, Telangana - 500081
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-automotive-orange/10 border border-automotive-orange/30 flex items-center justify-center text-automotive-orange shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Direct Phone</h4>
                  <p className="text-slate-400 mt-1">+91 (040) 2988-7700 / +91 98765 00001</p>
                  <p className="text-automotive-orange font-bold mt-0.5">24/7 Hotline: 1800-425-AUTO</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-automotive-orange/10 border border-automotive-orange/30 flex items-center justify-center text-automotive-orange shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Email Inquiries</h4>
                  <p className="text-slate-400 mt-1">support@autocarepro.internal</p>
                  <p className="text-slate-400">service@autocarepro.internal</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-automotive-orange/10 border border-automotive-orange/30 flex items-center justify-center text-automotive-orange shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Operating Shifts</h4>
                  <p className="text-slate-400 mt-1">Monday - Saturday: 08:30 AM – 07:00 PM</p>
                  <p className="text-slate-400">Sunday: 09:30 AM – 02:00 PM (Emergency diagnostic)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-7">
          <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8 sm:p-10 shadow-automotive">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Dispatched!</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Thank you for contacting AutoCare Pro. Our service advisor will review your vehicle
                  inquiry and contact you within 2 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-dark-800 text-slate-200 text-xs font-bold border border-dark-700 hover:bg-dark-750 transition"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Send Us an Inquiry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Turner"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-dark-850 border border-dark-750 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-dark-850 border border-dark-750 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-dark-850 border border-dark-750 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Vehicle Model (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Honda Civic / Yamaha R15"
                      value={formData.vehicleModel}
                      onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                      className="w-full bg-dark-850 border border-dark-750 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Detailed Message or Issue *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe symptoms, noise, warning lights, or requested services..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-dark-850 border border-dark-750 rounded-xl p-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-automotive-orange to-automotive-darkOrange text-white font-extrabold text-sm shadow-glow-orange hover:opacity-95 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Service Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
