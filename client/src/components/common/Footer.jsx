import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin, Clock, ShieldCheck, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-950 border-t border-dark-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-automotive-orange flex items-center justify-center text-white shadow-glow-orange">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
                AUTOCARE <span className="text-automotive-orange">PRO</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Next-generation digital automotive service hub providing OEM-grade maintenance,
              certified technicians, transparent pricing, and real-time repair tracking for cars,
              motorcycles, and scooters.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Multi-Brand Workshop</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Award className="w-4 h-4 text-automotive-orange" />
              <span>100% Genuine OEM Spares Guaranteed</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-automotive-orange pl-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-automotive-orange transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-automotive-orange transition">
                  All Service Packages
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-automotive-orange transition">
                  Workshop Heritage & Standards
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-automotive-orange transition">
                  Workshop Locations & Support
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-automotive-orange transition">
                  Customer Portal Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-automotive-orange transition">
                  Register Vehicle Today
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Hours & Hotline */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-automotive-orange pl-3">
              Operating Hours
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-automotive-orange shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Monday - Saturday</p>
                  <p className="text-slate-400">08:30 AM - 07:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Sunday</p>
                  <p className="text-slate-400">09:30 AM - 02:00 PM (Emergency Diagnostics only)</p>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-dark-900 border border-dark-750">
                <p className="text-[11px] font-bold text-automotive-orange uppercase tracking-wider">
                  24/7 Breakdown Assistance
                </p>
                <p className="text-white text-sm font-black mt-0.5">+91 1800-425-AUTO</p>
              </div>
            </div>
          </div>

          {/* Workshop Center */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-automotive-orange pl-3">
              Master Workshop
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-automotive-orange shrink-0 mt-0.5" />
                <p>100 Automotive Hub, Phase II Hi-Tech Industrial Corridor, Hyderabad, 500081</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-automotive-orange shrink-0" />
                <p>+91 (040) 2988-7700</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-automotive-orange shrink-0" />
                <p>service@autocarepro.internal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-dark-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} AutoCare Pro Systems. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Academic B.Tech Capstone Project • AI & ML Engineering</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
