import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { useNotifications } from '../../hooks/useNotifications';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ClipboardList,
  Clock,
  Car,
  Search,
  Filter,
  XCircle,
  Eye,
  Calendar,
  AlertCircle,
} from 'lucide-react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cancel Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useNotifications();

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      addToast('Failed to load your service bookings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    setSubmitting(true);
    try {
      await bookingService.cancelBooking(selectedBooking._id, cancelReason);
      addToast('Booking cancelled successfully.', 'success');
      setCancelModalOpen(false);
      fetchBookings();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to cancel booking.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const statuses = [
    'All',
    'Pending',
    'Confirmed',
    'Mechanic Assigned',
    'In Progress',
    'Waiting for Parts',
    'Completed',
    'Cancelled',
  ];

  const filteredBookings = bookings.filter((b) => {
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    const s = searchQuery.toLowerCase();
    const matchSearch =
      b.bookingReference.toLowerCase().includes(s) ||
      (b.vehicle && b.vehicle.registrationNumber.toLowerCase().includes(s)) ||
      (b.vehicle && b.vehicle.brand.toLowerCase().includes(s)) ||
      (b.service && b.service.name.toLowerCase().includes(s));
    return matchStatus && matchSearch;
  });

  if (loading) {
    return <LoadingSpinner text="Retrieving booking history..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
            My Service Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            View booking lifecycle, track bay progress, and manage reservations.
          </p>
        </div>

        <Link
          to="/customer/book"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-automotive-orange to-automotive-darkOrange text-white font-extrabold text-xs shadow-glow-orange hover:opacity-95 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>New Appointment</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Reference (BK-...), registration number, or service name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                statusFilter === st
                  ? 'bg-automotive-orange text-white border-automotive-orange shadow-glow-orange'
                  : 'bg-dark-850 text-slate-400 border-dark-750 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-3xl p-8 space-y-3">
          <ClipboardList className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Bookings</h3>
          <p className="text-xs text-slate-400">
            {searchQuery || statusFilter !== 'All'
              ? 'Try changing the status filter or search query.'
              : 'You have not scheduled any service appointments yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const canCancel = ['Pending', 'Confirmed'].includes(b.status);

            return (
              <div
                key={b._id}
                className="bg-dark-900 border border-dark-800 hover:border-dark-700/80 rounded-2xl p-5 transition-all shadow-automotive flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-automotive-orange bg-dark-850 px-2.5 py-1 rounded-lg border border-dark-750">
                      {b.bookingReference}
                    </span>
                    <StatusBadge status={b.status} />
                    <span className="text-[11px] text-slate-400">
                      Booked on {formatDate(b.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold text-white">
                    <span>
                      {b.vehicle?.brand} {b.vehicle?.model} ({b.vehicle?.registrationNumber})
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-300 font-semibold">{b.service?.name}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(b.bookingDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.timeSlot}</span>
                    </div>
                    {b.assignedMechanic && (
                      <span className="text-slate-300">
                        Technician: <strong className="text-white">{b.assignedMechanic.name}</strong>
                      </span>
                    )}
                  </div>

                  {b.complaints && (
                    <p className="text-[11px] text-slate-400 italic">
                      Complaints: "{b.complaints}"
                    </p>
                  )}
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-dark-800 self-end md:self-center shrink-0">
                  <div className="text-right hidden sm:block mr-2">
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                      Total Cost
                    </span>
                    <span className="text-base font-extrabold text-white">
                      {formatCurrency(b.totalCost || b.estimatedCost)}
                    </span>
                  </div>

                  <Link
                    to={`/customer/track?id=${b._id}`}
                    className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-white text-xs font-bold border border-dark-700 transition flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Track Status</span>
                  </Link>

                  {canCancel && (
                    <button
                      onClick={() => handleCancelClick(b)}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel booking ${selectedBooking?.bookingReference}? Your reserved workshop bay slot will be released.`}
        confirmText="Confirm Cancellation"
        isDanger={true}
        isLoading={submitting}
      />
    </div>
  );
};

export default MyBookings;
