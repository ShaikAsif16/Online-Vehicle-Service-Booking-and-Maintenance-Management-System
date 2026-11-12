import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { serviceService } from '../../services/serviceService';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Wrench,
  Clock,
  Car,
  Search,
  Filter,
  CheckCircle2,
  ChevronRight,
  Shield,
} from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'General Maintenance',
    'Engine & Transmission',
    'Brakes & Suspension',
    'Electrical & Diagnostics',
    'AC & Climate Control',
    'Tires & Wheels',
    'Body & Detailing',
  ];

  const vehicleTypes = ['All', 'car', 'motorcycle', 'scooter'];

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await serviceService.getAllServices();
        setServices(data.services || []);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((s) => {
    const matchCat = categoryFilter === 'All' || s.category === categoryFilter;
    const matchType = typeFilter === 'All' || s.applicableVehicleTypes.includes(typeFilter);
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  return (
    <div className="py-12 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-extrabold uppercase tracking-widest text-automotive-orange bg-automotive-orange/10 px-3 py-1 rounded-full border border-automotive-orange/20">
          FACTORY-SPECIFIED CATALOG
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Vehicle Service Packages
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Transparent pricing, pre-defined labor hours, and certified checklist audits for cars,
          motorcycles, and scooters.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by package name or description (e.g. Brake, Synthetic, AC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
            />
          </div>

          {/* Vehicle Type Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Type:</span>
            <div className="flex items-center bg-dark-850 p-1 rounded-xl border border-dark-750">
              {vehicleTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                    typeFilter === type
                      ? 'bg-automotive-orange text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                categoryFilter === cat
                  ? 'bg-white text-dark-950 border-white shadow'
                  : 'bg-dark-850 text-slate-400 border-dark-750 hover:text-white hover:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <LoadingSpinner text="Retrieving service packages catalog..." />
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-3xl p-8">
          <Wrench className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Matching Service Packages</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search criteria or selected categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
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
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-4 pt-4 border-t border-dark-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tasks Included:
                  </span>
                  {service.includedTasks?.map((task, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Supported:
                  </span>
                  {service.applicableVehicleTypes.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-dark-800 text-slate-300 border border-dark-700"
                    >
                      {t}
                    </span>
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
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-automotive-orange to-automotive-darkOrange text-white text-xs font-bold transition shadow-glow-orange flex items-center gap-1.5"
                >
                  <span>Book Appointment</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
