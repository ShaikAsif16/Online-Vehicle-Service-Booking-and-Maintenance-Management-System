import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  ShieldCheck,
  Calendar,
  Clock,
  Car,
  ChevronRight,
  Star,
  CheckCircle2,
  Cpu,
  Disc,
  Wind,
  Compass,
  ArrowRight,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { serviceService } from '../../services/serviceService';
import { formatCurrency } from '../../utils/formatters';

const Home = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAllServices();
        setFeaturedServices(data.services.slice(0, 6));
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Background Ambient Glow & Grid Pattern */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-automotive-orange/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-mesh-pattern opacity-30 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-850 border border-automotive-orange/40 text-automotive-orange text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Automotive Service Hub</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] font-['Space_Grotesk']">
                Precision Care for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-automotive-orange to-amber-500">
                  Maximum Performance
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Book factory-certified maintenance for your supercar, hypercar, or exotic high-performance vehicle.
                Enjoy real-time workshop bay tracking, certified technician diagnostics, 100% genuine
                OEM parts, and transparent itemized invoicing.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/customer/book"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-automotive-orange to-automotive-darkOrange text-white font-extrabold text-sm shadow-glow-orange hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Service Appointment</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/services"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-dark-850 hover:bg-dark-800 text-white font-bold text-sm border border-dark-700 hover:border-slate-500 transition flex items-center justify-center gap-2"
                >
                  <span>Explore Service Packages</span>
                </Link>
              </div>

              {/* Key Trust Badges */}
              <div className="pt-8 border-t border-dark-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <h4 className="text-2xl font-black text-white tracking-tight">40+</h4>
                  <p className="text-xs text-slate-400 font-medium">Point Inspection Audit</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white tracking-tight">100%</h4>
                  <p className="text-xs text-slate-400 font-medium">Genuine OEM Spares</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white tracking-tight">4.9 ★</h4>
                  <p className="text-xs text-slate-400 font-medium">Customer Rating</p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl p-1 bg-gradient-to-b from-dark-700 via-dark-800 to-dark-900 shadow-automotive-lg">
                  <div className="rounded-[22px] bg-dark-900 p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-dark-800 pb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Workshop Bay Live Status
                        </span>
                      </div>
                      <span className="text-xs font-mono text-automotive-orange bg-automotive-orange/10 px-2.5 py-1 rounded-md border border-automotive-orange/20">
                        Bay 01 Active
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-automotive-orange">
                          <Car className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 font-medium">Current Service</p>
                          <h4 className="text-sm font-bold text-white">Full Synthetic Periodic Service</h4>
                          <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Diagnostics Complete
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-automotive-orange">
                          <Cpu className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 font-medium">Telemetry Scan</p>
                          <h4 className="text-sm font-bold text-white">OBD-II ECU Digital Health</h4>
                          <div className="w-full bg-dark-750 rounded-full h-1.5 mt-2">
                            <div className="bg-automotive-orange h-1.5 rounded-full w-4/5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-gradient-to-r from-dark-800 to-dark-850 p-4 border border-dark-700 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Assigned Master Tech</p>
                        <p className="text-sm font-bold text-white">Marcus Vance (ASE Certified)</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20">
                        In Progress
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES CATALOG SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-automotive-orange bg-automotive-orange/10 px-3 py-1 rounded-full border border-automotive-orange/20">
            ENGINEERING EXCELLENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Comprehensive Workshop Packages
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From routine multi-point maintenance to advanced drivetrain overhaul, our bays are
            equipped with high-precision calibrated instruments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <div
              key={service._id}
              className="bg-dark-900 border border-dark-800 hover:border-automotive-orange/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-automotive flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-automotive-orange uppercase tracking-wider bg-dark-850 px-2.5 py-1 rounded-lg border border-dark-750">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{service.estimatedDurationMinutes} mins</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-automotive-orange transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {service.description}
                </p>

                <div className="mt-4 pt-4 border-t border-dark-800 space-y-2">
                  {service.includedTasks?.slice(0, 3).map((task, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-dark-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Starting From
                  </span>
                  <span className="text-xl font-extrabold text-white">
                    {formatCurrency(service.basePrice)}
                  </span>
                </div>
                <Link
                  to={`/customer/book?service=${service._id}`}
                  className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-automotive-orange text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Book Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-automotive-orange hover:text-orange-400 transition"
          >
            <span>View All Service Categories & Diagnostics</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="bg-dark-900/60 border-y border-dark-800/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-automotive-orange bg-automotive-orange/10 px-3 py-1 rounded-full border border-automotive-orange/20">
              SEAMLESS PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Space_Grotesk']">
              How AutoCare Pro Works
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Book and track your vehicle maintenance in four straightforward digital steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-dark-950 border border-dark-750/80 rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-2xl bg-automotive-orange/10 border border-automotive-orange/30 text-automotive-orange font-black text-lg flex items-center justify-center mb-5">
                01
              </div>
              <h4 className="text-base font-bold text-white mb-2">Register Vehicle & Service</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add your car, motorcycle, or scooter with registration details, odometer mileage, and
                pick desired maintenance packages.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-dark-950 border border-dark-750/80 rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-2xl bg-automotive-orange/10 border border-automotive-orange/30 text-automotive-orange font-black text-lg flex items-center justify-center mb-5">
                02
              </div>
              <h4 className="text-base font-bold text-white mb-2">Choose Bay Date & Time</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select from live available workshop bays. Our conflict prevention algorithm ensures zero
                overcrowding and no waiting.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-dark-950 border border-dark-750/80 rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-2xl bg-automotive-orange/10 border border-automotive-orange/30 text-automotive-orange font-black text-lg flex items-center justify-center mb-5">
                03
              </div>
              <h4 className="text-base font-bold text-white mb-2">Track Service Live</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor status from inspection and diagnosis to parts assembly. Direct communication
                with your assigned certified mechanic.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-dark-950 border border-dark-750/80 rounded-2xl p-6 relative">
              <div className="w-12 h-12 rounded-2xl bg-automotive-orange/10 border border-automotive-orange/30 text-automotive-orange font-black text-lg flex items-center justify-center mb-5">
                04
              </div>
              <h4 className="text-base font-bold text-white mb-2">Digital Invoice & Pickup</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive an itemized digital invoice, complete your payment seamlessly, and collect your
                perfectly serviced vehicle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-automotive-orange bg-automotive-orange/10 px-3 py-1 rounded-full border border-automotive-orange/20">
              UNCOMPROMISING INTEGRITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Space_Grotesk']">
              Why Discerning Drivers Trust AutoCare Pro
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              We eliminate traditional automotive service uncertainty. Every bolt torqued, filter
              exchanged, and diagnosis performed is logged transparently to your digital maintenance log.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Guaranteed OEM Spare Parts</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct factory sourcing with barcodes, warranty certification, and zero counterfeit risk.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-automotive-orange/10 border border-automotive-orange/30 flex items-center justify-center text-automotive-orange shrink-0 mt-0.5">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Certified Lead Technicians</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    ASE and Bosch certified technicians dedicated specifically to your vehicle make and model.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Disc className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Transparent Itemized Pricing</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    No surprise charges. Pre-approved labor costs and exact component invoices before work proceeds.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-dark-900 border border-dark-800 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "The real-time tracking stepper is phenomenal. I knew exactly when Marcus started working
                on my BMW brake calipers and received the digital invoice before pickup. Absolutely unmatched
                service."
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-dark-800 text-xs">
                <span className="font-bold text-white">David Reynolds</span>
                <span className="text-slate-400">BMW 330i M Sport Owner</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-dark-900 border border-dark-800 space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Had my Hyundai Creta's AC serviced. Elena discovered a low refrigerant leak and cleaned
                the cabin pollen filter in under 2 hours. Cools like a brand new car now!"
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-dark-800 text-xs">
                <span className="font-bold text-white">Priya Sharma</span>
                <span className="text-slate-400">Hyundai Creta Owner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-automotive-orange/40 p-8 sm:p-12 shadow-automotive-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
              Ready to Service Your Vehicle?
            </h3>
            <p className="text-slate-300 text-sm max-w-xl">
              Create your account in 30 seconds or browse available workshop bay slots for today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-automotive-orange text-white font-extrabold text-sm shadow-glow-orange hover:bg-automotive-darkOrange transition"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 font-bold text-sm border border-dark-700 transition"
            >
              Contact Workshop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
