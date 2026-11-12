import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../../services/maintenanceService';
import { vehicleService } from '../../services/vehicleService';
import { useNotifications } from '../../hooks/useNotifications';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { History, Car, Wrench, Calendar, Gauge, CheckCircle, Package } from 'lucide-react';

const MaintenanceHistory = () => {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('All');
  const [loading, setLoading] = useState(true);

  const { addToast } = useNotifications();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, maintenanceRes] = await Promise.all([
          vehicleService.getMyVehicles(),
          maintenanceService.getMyMaintenanceHistory(),
        ]);
        setVehicles(vehiclesRes.vehicles || []);
        setRecords(maintenanceRes.records || []);
      } catch (err) {
        addToast('Failed to load maintenance records.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRecords =
    selectedVehicleId === 'All'
      ? records
      : records.filter((r) => r.vehicle?._id === selectedVehicleId);

  if (loading) {
    return <LoadingSpinner text="Retrieving digital maintenance logs..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Vehicle Maintenance Logbook
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Certified historical logs, odometer telemetry, and next service advisory.
          </p>
        </div>

        {vehicles.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Filter Vehicle:</span>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="bg-dark-850 border border-dark-750 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-automotive-orange"
            >
              <option value="All">All Vehicles ({records.length} logs)</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.brand} {v.model} ({v.registrationNumber})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filteredRecords.length === 0 ? (
        <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-3xl p-8 space-y-3">
          <History className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Maintenance Records Found</h3>
          <p className="text-xs text-slate-400">
            Maintenance log entries are generated automatically as soon as workshop services are
            completed.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRecords.map((r) => (
            <div
              key={r._id}
              className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 shadow-automotive space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center text-automotive-orange font-bold text-xl">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{r.serviceName}</h3>
                    <p className="text-xs text-slate-400">
                      Vehicle:{' '}
                      <strong className="text-slate-200">
                        {r.vehicle?.brand} {r.vehicle?.model} ({r.vehicle?.registrationNumber})
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Service Date
                    </span>
                    <span className="text-xs font-bold text-white">{formatDate(r.serviceDate)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Total Billed
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      {formatCurrency(r.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specs & Diagnostics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                    <Gauge className="w-4 h-4 text-automotive-orange" />
                    <span>Odometer Reading</span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {r.mileageAtService?.toLocaleString('en-IN') || 0} km
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Next Recommended Service</span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {formatDate(r.nextServiceRecommendedDate)} (or ~
                    {r.nextServiceMileage?.toLocaleString('en-IN')} km)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                    <span>Supervising Technician</span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {r.mechanic?.name || 'Chief Master Technician'}
                  </p>
                </div>
              </div>

              {/* Diagnosis and Notes */}
              <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750 text-xs space-y-2">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Diagnosis & Resolution
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Findings:</strong> {r.diagnosis || 'Standard periodic scheduled overhaul.'}
                </p>
                {r.repairNotes && (
                  <p className="text-slate-400 italic">
                    <strong>Work Conducted:</strong> {r.repairNotes}
                  </p>
                )}
              </div>

              {/* Parts replaced table */}
              {r.partsReplaced && r.partsReplaced.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-automotive-orange" />
                    <span>Parts Replaced</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {r.partsReplaced.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-dark-850 border border-dark-750 text-xs text-white"
                      >
                        {p.partName} ({p.quantity}x) • {formatCurrency(p.price)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceHistory;
