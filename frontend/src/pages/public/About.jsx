import React from 'react';
import { ShieldCheck, Award, Wrench, Users, CheckCircle, Cpu, Clock } from 'lucide-react';

const About = () => {
  return (
    <div className="py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-automotive-orange bg-automotive-orange/10 px-3 py-1 rounded-full border border-automotive-orange/20">
          WHO WE ARE
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Pioneering Digital Workshop Management
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Founded with a commitment to eliminate ambiguity in automotive repairs, AutoCare Pro unites
          state-of-the-art telemetry diagnostics, factory-certified master technicians, and a
          fully transparent digital customer portal.
        </p>
      </div>

      {/* Facilities & Standards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-automotive-orange/10 border border-automotive-orange/30 flex items-center justify-center text-automotive-orange">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Digital OBD-II Telemetry</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We employ dealer-grade electronic scan tools capable of communicating across CAN-bus,
            powertrain controllers, and hybrid battery management systems.
          </p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Master Certified Techs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every vehicle is handled by specialized technicians with minimum 5+ years experience
            and ASE/Bosch certifications in high-precision mechanics.
          </p>
        </div>

        <div className="bg-dark-900 border border-dark-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Zero Counterfeit Spares</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All lubricants, brake pads, filters, and electrical parts are sealed OEM components
            sourced directly from authorized automotive distributors.
          </p>
        </div>
      </div>

      {/* Workshop Bay Capacities */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Space_Grotesk']">
              High-Capacity Multi-Bay Facility
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our 12,000 sq.ft. facility houses dedicated diagnostic bays, hydraulic two-post
              lifts, 3D laser wheel aligners, and automated climate control recovery stations.
            </p>
            <ul className="space-y-2.5 pt-2 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-automotive-orange" />
                <span>3 Dedicated High-Throughput Quick Service Bays</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-automotive-orange" />
                <span>Clean-room engine & gearbox assembly bay</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-automotive-orange" />
                <span>Motorcycle & Scooter designated servicing stations</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-850 border border-dark-750 p-5 rounded-2xl text-center">
              <span className="text-3xl font-black text-white">15,000+</span>
              <p className="text-xs text-slate-400 mt-1">Vehicles Serviced</p>
            </div>
            <div className="bg-dark-850 border border-dark-750 p-5 rounded-2xl text-center">
              <span className="text-3xl font-black text-automotive-orange">99.2%</span>
              <p className="text-xs text-slate-400 mt-1">On-Time Delivery</p>
            </div>
            <div className="bg-dark-850 border border-dark-750 p-5 rounded-2xl text-center">
              <span className="text-3xl font-black text-emerald-400">100%</span>
              <p className="text-xs text-slate-400 mt-1">Digital Invoicing</p>
            </div>
            <div className="bg-dark-850 border border-dark-750 p-5 rounded-2xl text-center">
              <span className="text-3xl font-black text-blue-400">24/7</span>
              <p className="text-xs text-slate-400 mt-1">Status Access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
