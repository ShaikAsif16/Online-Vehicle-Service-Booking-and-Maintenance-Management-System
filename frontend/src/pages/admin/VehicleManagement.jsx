import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { useNotifications } from '../../hooks/useNotifications';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Car, Search, Filter, Fuel, Gauge, User, Shield } from 'lucide-react';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [fuelFilter, setFuelFilter] = useState('All');

  const { addToast } = useNotifications();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getAllVehicles();
        setVehicles(data.vehicles || []);
      } catch (err) {
        addToast('Failed to load vehicle fleet database.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const types = ['All', 'supercar', 'hypercar', 'car', 'motorcycle', 'scooter'];
  const fuelTypes = ['All', 'Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];

  const filtered = vehicles.filter((v) => {
    const matchType = typeFilter === 'All' || v.type === typeFilter;
    const matchFuel = fuelFilter === 'All' || v.fuelType === fuelFilter;
    const s = searchQuery.toLowerCase();
    const matchSearch =
      v.registrationNumber.toLowerCase().includes(s) ||
      v.brand.toLowerCase().includes(s) ||
      v.model.toLowerCase().includes(s) ||
      (v.owner && v.owner.name.toLowerCase().includes(s));
    return matchType && matchFuel && matchSearch;
  });

  if (loading) {
    return <LoadingSpinner text="Retrieving vehicle fleet registry..." />;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Vehicle Fleet Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          All client registered supercars, hypercars, and high-performance exotics in the workshop database.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by registration number, brand, model, or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Type:</span>
            <div className="flex items-center bg-dark-850 p-1 rounded-xl border border-dark-750">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition ${
                    typeFilter === t
                      ? 'bg-automotive-orange text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Fuel:</span>
            <div className="flex items-center bg-dark-850 p-1 rounded-xl border border-dark-750 overflow-x-auto">
              {fuelTypes.map((f) => (
                <button
                  key={f}
                  onClick={() => setFuelFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    fuelFilter === f
                      ? 'bg-automotive-orange text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Vehicles */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-3xl p-8 space-y-3">
          <Car className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Vehicles</h3>
          <p className="text-xs text-slate-400">Try modifying your filter parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => (
            <div
              key={v._id}
              className="bg-dark-900 border border-dark-800 rounded-3xl p-6 shadow-automotive space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-dark-800">
                <span className="font-mono text-xs font-bold text-automotive-orange bg-dark-850 px-2.5 py-1 rounded-lg border border-dark-750">
                  {v.registrationNumber}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    v.type === 'hypercar'
                      ? 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30'
                      : v.type === 'supercar'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      : 'text-slate-300 bg-dark-800 border-dark-750'
                  }`}
                >
                  {v.type}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center text-automotive-orange text-2xl">
                  {v.type === 'hypercar' ? '🚀' : v.type === 'supercar' ? '🏎️' : v.type === 'motorcycle' ? '🏍' : '🚗'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {v.brand} {v.model}
                  </h3>
                  <p className="text-xs text-slate-400">Manufactured in {v.year}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-dark-850 border border-dark-750 flex items-center gap-2">
                  <Fuel className="w-3.5 h-3.5 text-automotive-orange" />
                  <span>{v.fuelType}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-dark-850 border border-dark-750 flex items-center gap-2">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{v.mileage?.toLocaleString('en-IN') || 0} km</span>
                </div>
              </div>

              {/* Owner info */}
              <div className="pt-3 border-t border-dark-800 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Registered Owner
                  </span>
                  <span className="font-bold text-white">{v.owner?.name || 'Client'}</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{v.owner?.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
