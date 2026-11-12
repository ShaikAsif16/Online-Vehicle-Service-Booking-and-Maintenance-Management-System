import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { vehicleService } from '../../services/vehicleService';
import { serviceService } from '../../services/serviceService';
import { bookingService } from '../../services/bookingService';
import { useNotifications } from '../../hooks/useNotifications';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Car,
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Plus,
} from 'lucide-react';

const BookService = () => {
  const [searchParams] = useSearchParams();
  const preSelectedVehicleId = searchParams.get('vehicle');
  const preSelectedServiceId = searchParams.get('service');

  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('');
  const [complaints, setComplaints] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  const { addToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [vehiclesRes, servicesRes] = await Promise.all([
          vehicleService.getMyVehicles(),
          serviceService.getAllServices(),
        ]);
        setVehicles(vehiclesRes.vehicles || []);
        setServices(servicesRes.services || []);

        if (preSelectedVehicleId && vehiclesRes.vehicles) {
          const v = vehiclesRes.vehicles.find((x) => x._id === preSelectedVehicleId);
          if (v) setSelectedVehicle(v);
        }

        if (preSelectedServiceId && servicesRes.services) {
          const s = servicesRes.services.find((x) => x._id === preSelectedServiceId);
          if (s) setSelectedService(s);
        }
      } catch (err) {
        addToast('Failed to load booking prerequisite options.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [preSelectedVehicleId, preSelectedServiceId]);

  // Fetch available slots whenever bookingDate changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!bookingDate) return;
      setLoadingSlots(true);
      try {
        const data = await bookingService.getAvailableSlots(bookingDate);
        setSlots(data.slots || []);
      } catch (err) {
        addToast('Failed to check slot availability for selected date.', 'error');
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [bookingDate]);

  const handleSubmitBooking = async () => {
    if (!selectedVehicle || !selectedService || !bookingDate || !selectedSlot) {
      addToast('Please complete all booking steps.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookingService.createBooking({
        vehicleId: selectedVehicle._id,
        serviceId: selectedService._id,
        bookingDate,
        timeSlot: selectedSlot,
        complaints,
        additionalInstructions,
      });

      addToast('Service appointment booked successfully!', 'success');
      navigate(`/customer/track?id=${res.booking._id}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit booking.', 'error');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Initializing service scheduler..." />;
  }

  // Filter services by vehicle type (Supercars & Hypercars inherit sports car packages)
  const availableServices = selectedVehicle
    ? services.filter(
        (s) =>
          s.applicableVehicleTypes.includes(selectedVehicle.type) ||
          ((selectedVehicle.type === 'supercar' || selectedVehicle.type === 'hypercar') &&
            s.applicableVehicleTypes.includes('car'))
      )
    : services;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Schedule Service Appointment
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Book factory-calibrated maintenance with real-time bay allocation.
        </p>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="grid grid-cols-4 gap-2 border-b border-dark-800 pb-4">
        {[
          { num: 1, title: 'Vehicle', subtitle: selectedVehicle ? selectedVehicle.model : 'Select' },
          { num: 2, title: 'Service', subtitle: selectedService ? selectedService.name : 'Select' },
          { num: 3, title: 'Date & Slot', subtitle: selectedSlot ? `${bookingDate}` : 'Select' },
          { num: 4, title: 'Review', subtitle: 'Confirm' },
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => s.num < step && setStep(s.num)}
            className={`flex flex-col items-center text-center cursor-pointer transition ${
              step === s.num
                ? 'text-automotive-orange'
                : step > s.num
                ? 'text-emerald-400'
                : 'text-slate-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 border ${
                step === s.num
                  ? 'bg-automotive-orange text-white border-automotive-orange shadow-glow-orange'
                  : step > s.num
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-dark-850 text-slate-400 border-dark-750'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <span className="text-xs font-bold">{s.title}</span>
            <span className="text-[10px] text-slate-400 truncate max-w-[100px]">{s.subtitle}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: SELECT VEHICLE */}
      {step === 1 && (
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Step 1: Choose Vehicle for Service</h3>
              <p className="text-xs text-slate-400">Select which vehicle requires maintenance</p>
            </div>
            <Link
              to="/customer/vehicles"
              className="text-xs text-automotive-orange hover:underline font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle</span>
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <div className="p-8 text-center bg-dark-850 rounded-2xl border border-dark-750 space-y-3">
              <Car className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-300">You haven't registered any vehicle yet.</p>
              <Link
                to="/customer/vehicles"
                className="inline-block px-4 py-2 rounded-xl bg-automotive-orange text-white text-xs font-bold"
              >
                Register a Vehicle First
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vehicles.map((v) => (
                <div
                  key={v._id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    selectedVehicle?._id === v._id
                      ? 'bg-automotive-orange/10 border-automotive-orange shadow-automotive'
                      : 'bg-dark-850 border-dark-750 hover:border-slate-600'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-automotive-orange text-2xl shrink-0">
                    {v.type === 'hypercar' ? '🚀' : v.type === 'supercar' ? '🏎️' : v.type === 'motorcycle' ? '🏍' : '🚗'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono uppercase bg-dark-800 px-2 py-0.5 rounded text-automotive-orange font-bold">
                        {v.registrationNumber}
                      </span>
                      <span
                        className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                          v.type === 'hypercar'
                            ? 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30'
                            : v.type === 'supercar'
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                            : 'text-slate-400 bg-dark-800 border-dark-700'
                        }`}
                      >
                        {v.type}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1 truncate">
                      {v.brand} {v.model}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {v.year} • {v.fuelType} • {v.mileage?.toLocaleString('en-IN')} km
                    </p>
                  </div>
                  {selectedVehicle?._id === v._id && (
                    <div className="w-6 h-6 rounded-full bg-automotive-orange text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-dark-800">
            <button
              onClick={() => {
                if (!selectedVehicle) {
                  addToast('Please select a vehicle to proceed.', 'warning');
                  return;
                }
                setStep(2);
              }}
              disabled={!selectedVehicle}
              className="px-6 py-2.5 rounded-xl bg-automotive-orange text-white text-xs font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center gap-2 disabled:opacity-40"
            >
              <span>Continue to Service Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT SERVICE */}
      {step === 2 && (
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in">
          <div>
            <h3 className="text-lg font-bold text-white">Step 2: Select Service Package</h3>
            <p className="text-xs text-slate-400">
              Showing packages tailored for your{' '}
              <strong className="text-white capitalize">{selectedVehicle?.type}</strong> (
              {selectedVehicle?.brand} {selectedVehicle?.model})
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableServices.map((service) => (
              <div
                key={service._id}
                onClick={() => setSelectedService(service)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedService?._id === service._id
                    ? 'bg-automotive-orange/10 border-automotive-orange shadow-automotive'
                    : 'bg-dark-850 border-dark-750 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-automotive-orange bg-dark-800 px-2 py-0.5 rounded">
                      {service.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {service.estimatedDurationMinutes} mins
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{service.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-dark-750 flex items-center justify-between">
                  <span className="text-base font-extrabold text-white">
                    {formatCurrency(service.basePrice)}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-lg ${
                      selectedService?._id === service._id
                        ? 'bg-automotive-orange text-white'
                        : 'bg-dark-800 text-slate-300'
                    }`}
                  >
                    {selectedService?._id === service._id ? 'Selected' : 'Select'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-dark-800">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-dark-800 text-slate-300 text-xs font-bold hover:bg-dark-750 transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (!selectedService) {
                  addToast('Please select a service package.', 'warning');
                  return;
                }
                setStep(3);
              }}
              disabled={!selectedService}
              className="px-6 py-2.5 rounded-xl bg-automotive-orange text-white text-xs font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center gap-2 disabled:opacity-40"
            >
              <span>Continue to Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECT DATE & TIME SLOT */}
      {step === 3 && (
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in">
          <div>
            <h3 className="text-lg font-bold text-white">Step 3: Appointment Date & Bay Slot</h3>
            <p className="text-xs text-slate-400">
              Live capacity check across workshop diagnostic and lift bays.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Appointment Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={(e) => {
                    setBookingDate(e.target.value);
                    setSelectedSlot('');
                  }}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-automotive-orange"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Workshop Bay Slots for {formatDate(bookingDate)}
              </label>

              {loadingSlots ? (
                <div className="p-4 bg-dark-850 rounded-xl text-center text-xs text-slate-400 animate-pulse">
                  Checking bay capacities...
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                  {slots.map((s) => (
                    <button
                      key={s.slot}
                      type="button"
                      disabled={!s.available}
                      onClick={() => setSelectedSlot(s.slot)}
                      className={`w-full p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition ${
                        !s.available
                          ? 'bg-dark-850/40 border-dark-800 text-slate-400 cursor-not-allowed opacity-50'
                          : selectedSlot === s.slot
                          ? 'bg-automotive-orange/15 border-automotive-orange text-white font-bold'
                          : 'bg-dark-850 border-dark-750 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-automotive-orange" />
                        <span>{s.slot}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          !s.available
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {s.available ? `${s.remainingBays} Bay(s) Open` : 'Full'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-dark-800">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-dark-800 text-slate-300 text-xs font-bold hover:bg-dark-750 transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (!selectedSlot) {
                  addToast('Please select an available workshop time slot.', 'warning');
                  return;
                }
                setStep(4);
              }}
              disabled={!selectedSlot}
              className="px-6 py-2.5 rounded-xl bg-automotive-orange text-white text-xs font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center gap-2 disabled:opacity-40"
            >
              <span>Continue to Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & CONFIRM */}
      {step === 4 && (
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in">
          <div>
            <h3 className="text-lg font-bold text-white">Step 4: Complaints & Booking Review</h3>
            <p className="text-xs text-slate-400">
              Provide technician instructions and verify appointment details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Complaints or Specific Symptoms
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Brake squealing at low speed, engine vibration at idle, AC cooling takes too long..."
                  value={complaints}
                  onChange={(e) => setComplaints(e.target.value)}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Additional Notes / Preferences
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Call before replacing any parts above ₹2,000, please inspect tire wear..."
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange"
                />
              </div>
            </div>

            {/* Summary Review Card */}
            <div className="p-5 rounded-2xl bg-dark-850 border border-dark-750 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-automotive-orange border-b border-dark-750 pb-2">
                Appointment Summary
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="text-white font-bold">
                    {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.registrationNumber})
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="text-white font-bold">{selectedService.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Est. Duration:</span>
                  <span className="text-white font-bold">
                    {selectedService.estimatedDurationMinutes} minutes
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Appointment Date:</span>
                  <span className="text-white font-bold">{formatDate(bookingDate)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Time Slot:</span>
                  <span className="text-automotive-orange font-bold">{selectedSlot}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-dark-750 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Est. Base Price:</span>
                <span className="text-xl font-black text-white">
                  {formatCurrency(selectedService.basePrice)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                * Any required spare parts will be confirmed with you before fitting.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-dark-800">
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl bg-dark-800 text-slate-300 text-xs font-bold hover:bg-dark-750 transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleSubmitBooking}
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-automotive-orange to-automotive-darkOrange text-white text-xs font-extrabold shadow-glow-orange hover:opacity-95 transition flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Confirming Appointment...' : 'Submit & Book Appointment'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookService;
