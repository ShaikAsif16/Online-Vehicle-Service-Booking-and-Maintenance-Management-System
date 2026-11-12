import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { useNotifications } from '../../hooks/useNotifications';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import {
  Activity,
  CheckCircle2,
  Clock,
  Car,
  User,
  Wrench,
  Package,
  Receipt,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

const TrackService = () => {
  const [searchParams] = useSearchParams();
  const bookingIdFromUrl = searchParams.get('id');

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToast } = useNotifications();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getMyBookings();
        const list = data.bookings || [];
        setBookings(list);

        if (bookingIdFromUrl) {
          const found = list.find((b) => b._id === bookingIdFromUrl);
          if (found) {
            setSelectedBooking(found);
          } else {
            // Fetch directly
            try {
              const direct = await bookingService.getBookingById(bookingIdFromUrl);
              setSelectedBooking(direct.booking);
            } catch (e) {
              console.error(e);
            }
          }
        } else if (list.length > 0) {
          // Default to first active or recent booking
          const active = list.find((b) =>
            ['In Progress', 'Mechanic Assigned', 'Confirmed', 'Pending'].includes(b.status)
          );
          setSelectedBooking(active || list[0]);
        }
      } catch (err) {
        addToast('Failed to load tracking data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [bookingIdFromUrl]);

  if (loading) {
    return <LoadingSpinner text="Connecting to workshop telemetry..." />;
  }

  if (!selectedBooking) {
    return (
      <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-3xl p-8 space-y-4">
        <Activity className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Booking Selected for Tracking</h3>
        <p className="text-xs text-slate-400">
          Select one of your bookings or schedule a new service appointment.
        </p>
        <Link
          to="/customer/book"
          className="inline-block px-5 py-2.5 rounded-xl bg-automotive-orange text-white text-xs font-bold"
        >
          Book a Service
        </Link>
      </div>
    );
  }

  // Stepper Stage Calculation
  const getStageIndex = (status) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Confirmed':
        return 2;
      case 'Mechanic Assigned':
        return 3;
      case 'In Progress':
      case 'Waiting for Parts':
        return 4;
      case 'Completed':
        return 5;
      case 'Cancelled':
      case 'Rejected':
        return -1;
      default:
        return 1;
    }
  };

  const currentStage = getStageIndex(selectedBooking.status);
  const isTerminated = ['Cancelled', 'Rejected'].includes(selectedBooking.status);

  const steps = [
    { title: 'Requested', desc: 'Appointment received' },
    { title: 'Confirmed', desc: 'Slot & bay reserved' },
    { title: 'Technician Assigned', desc: 'Lead tech assigned' },
    { title: 'In Progress', desc: 'Inspection & repair' },
    { title: 'Completed', desc: 'Tested & ready' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header & Booking Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Live Service Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time status updates and inspection logs from workshop bay.
          </p>
        </div>

        {/* Booking Dropdown if multiple exist */}
        {bookings.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Switch Booking:</span>
            <select
              value={selectedBooking._id}
              onChange={(e) => {
                const found = bookings.find((b) => b._id === e.target.value);
                if (found) setSelectedBooking(found);
              }}
              className="bg-dark-850 border border-dark-750 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-automotive-orange"
            >
              {bookings.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.bookingReference} - {b.vehicle?.brand} ({b.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 shadow-automotive space-y-8">
        {/* Booking Snapshot */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-dark-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-bold text-automotive-orange bg-dark-850 px-3 py-1 rounded-lg border border-dark-750">
                {selectedBooking.bookingReference}
              </span>
              <StatusBadge status={selectedBooking.status} />
            </div>
            <h2 className="text-xl font-bold text-white mt-2">
              {selectedBooking.vehicle?.brand} {selectedBooking.vehicle?.model} (
              {selectedBooking.vehicle?.registrationNumber})
            </h2>
            <p className="text-xs text-slate-400">
              Service: <strong className="text-slate-200">{selectedBooking.service?.name}</strong> •
              Scheduled for{' '}
              <strong className="text-slate-200">
                {formatDate(selectedBooking.bookingDate)} at {selectedBooking.timeSlot}
              </strong>
            </p>
          </div>

          {selectedBooking.status === 'Completed' && (
            <Link
              to="/customer/invoices"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs shadow-lg hover:opacity-95 transition flex items-center gap-2 self-start md:self-center"
            >
              <Receipt className="w-4 h-4" />
              <span>View & Pay Invoice</span>
            </Link>
          )}
        </div>

        {/* Visual Stepper */}
        {!isTerminated ? (
          <div className="py-4">
            <div className="grid grid-cols-5 gap-2 relative">
              {steps.map((st, idx) => {
                const stepNum = idx + 1;
                const isPassed = currentStage >= stepNum;
                const isCurrent = currentStage === stepNum;

                return (
                  <div key={idx} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        isCurrent
                          ? 'bg-automotive-orange text-white shadow-glow-orange ring-4 ring-orange-500/20'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-dark-800 text-slate-400 border border-dark-750'
                      }`}
                    >
                      {isPassed && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                    </div>
                    <span
                      className={`text-xs font-bold mt-2 ${
                        isCurrent ? 'text-automotive-orange' : isPassed ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {st.title}
                    </span>
                    <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                      {st.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>
              This service booking was marked as{' '}
              <strong className="text-white uppercase">{selectedBooking.status}</strong>. Reason:{' '}
              {selectedBooking.cancellationReason ||
                selectedBooking.rejectionReason ||
                'Declined or cancelled.'}
            </span>
          </div>
        )}

        {/* Technician & Diagnostic Telemetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dark-800">
          {/* Assigned Technician */}
          <div className="p-5 rounded-2xl bg-dark-850 border border-dark-750 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <User className="w-4 h-4 text-automotive-orange" />
              <span>Assigned Lead Technician</span>
            </div>
            {selectedBooking.assignedMechanic ? (
              <div className="flex items-center gap-3 pt-1">
                <div className="w-12 h-12 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-automotive-orange font-bold text-base">
                  {selectedBooking.assignedMechanic.name?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {selectedBooking.assignedMechanic.name}
                  </h4>
                  <p className="text-xs text-slate-400">Certified Automotive Specialist</p>
                  <p className="text-xs text-automotive-orange font-mono mt-0.5">
                    {selectedBooking.assignedMechanic.phone}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Awaiting bay supervisor technician assignment.
              </p>
            )}
          </div>

          {/* Diagnostic Observations */}
          <div className="p-5 rounded-2xl bg-dark-850 border border-dark-750 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Wrench className="w-4 h-4 text-automotive-orange" />
              <span>Technician Diagnostic Notes</span>
            </div>
            <p className="text-xs text-white leading-relaxed">
              {selectedBooking.diagnosis || 'Inspection diagnostics in progress in workshop bay.'}
            </p>
            {selectedBooking.repairNotes && (
              <div className="pt-2 border-t border-dark-750">
                <span className="text-[11px] font-bold text-slate-400 block mb-0.5">
                  Action Taken:
                </span>
                <p className="text-xs text-slate-300 italic">{selectedBooking.repairNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Spare Parts Installed */}
        {selectedBooking.partsUsed && selectedBooking.partsUsed.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Package className="w-4 h-4 text-automotive-orange" />
              <span>Spare Parts Installed During Service</span>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-dark-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Part Description</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800/60">
                  {selectedBooking.partsUsed.map((p, idx) => (
                    <tr key={idx} className="hover:bg-dark-850/50">
                      <td className="py-2.5 px-3 text-white font-medium">{p.partName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{p.partNumber}</td>
                      <td className="py-2.5 px-3 text-center text-slate-300">{p.quantity}</td>
                      <td className="py-2.5 px-3 text-right text-slate-300">
                        {formatCurrency(p.unitPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-white font-bold">
                        {formatCurrency(p.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Timeline Status History */}
        <div className="space-y-3 pt-4 border-t border-dark-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Clock className="w-4 h-4 text-automotive-orange" />
            <span>Audit Trail & Status History</span>
          </div>

          <div className="space-y-2">
            {selectedBooking.statusHistory?.map((hist, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-dark-850 border border-dark-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-automotive-orange" />
                  <span className="font-bold text-white">{hist.status}</span>
                  {hist.note && <span className="text-slate-400 italic">• "{hist.note}"</span>}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatDateTime(hist.changedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackService;
