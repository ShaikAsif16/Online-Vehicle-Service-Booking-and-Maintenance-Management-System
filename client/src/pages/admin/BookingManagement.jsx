import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { mechanicService } from '../../services/mechanicService';
import { useNotifications } from '../../hooks/useNotifications';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  ClipboardList,
  Search,
  Filter,
  Check,
  X,
  UserCheck,
  Eye,
  Calendar,
  Clock,
  Car,
  User,
  AlertCircle,
} from 'lucide-react';

const BookingManagement = () => {
  const [searchParams] = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';

  const [bookings, setBookings] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedMechanicId, setSelectedMechanicId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useNotifications();

  const fetchData = async () => {
    try {
      const [bookingsRes, mechanicsRes] = await Promise.all([
        bookingService.getAllBookings(),
        mechanicService.getAllMechanics(),
      ]);
      setBookings(bookingsRes.bookings || []);
      setMechanics(mechanicsRes.mechanics || []);
    } catch (err) {
      addToast('Failed to load administrative bookings queue.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (booking) => {
    setSubmitting(true);
    try {
      await bookingService.updateBookingApproval(booking._id, 'approve');
      addToast(`Booking ${booking.bookingReference} confirmed! Customer notified.`, 'success');
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Approval failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectClick = (booking) => {
    setSelectedBooking(booking);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedBooking) return;
    setSubmitting(true);
    try {
      await bookingService.updateBookingApproval(
        selectedBooking._id,
        'reject',
        rejectReason || 'Workshop capacity exceeded for this timeslot.'
      );
      addToast(`Booking ${selectedBooking.bookingReference} rejected.`, 'info');
      setRejectModalOpen(false);
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Rejection failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignClick = (booking) => {
    setSelectedBooking(booking);
    setSelectedMechanicId(booking.assignedMechanic?._id || '');
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedBooking || !selectedMechanicId) {
      addToast('Please select a technician.', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      await bookingService.assignMechanic(selectedBooking._id, selectedMechanicId);
      addToast(
        `Technician assigned successfully to job ${selectedBooking.bookingReference}.`,
        'success'
      );
      setAssignModalOpen(false);
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to assign technician.', 'error');
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
    'Rejected',
  ];

  const filteredBookings = bookings.filter((b) => {
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    const s = searchQuery.toLowerCase();
    const matchSearch =
      b.bookingReference.toLowerCase().includes(s) ||
      (b.customer && b.customer.name.toLowerCase().includes(s)) ||
      (b.customer && b.customer.phone?.toLowerCase().includes(s)) ||
      (b.vehicle && b.vehicle.registrationNumber.toLowerCase().includes(s)) ||
      (b.service && b.service.name.toLowerCase().includes(s));
    return matchStatus && matchSearch;
  });

  if (loading) {
    return <LoadingSpinner text="Retrieving workshop reservations database..." />;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Service Bookings Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Approve customer appointments, assign master technicians, and oversee bay lifecycles.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bookings by Reference (BK-...), customer name, phone, or vehicle registration..."
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

      {/* Bookings Queue */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-3xl p-8 space-y-3">
          <ClipboardList className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Bookings</h3>
          <p className="text-xs text-slate-400">Try modifying your filter or search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-dark-900 border border-dark-800 hover:border-dark-700/80 rounded-2xl p-5 sm:p-6 transition shadow-automotive flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-bold text-automotive-orange bg-dark-850 px-2.5 py-1 rounded-lg border border-dark-750">
                    {b.bookingReference}
                  </span>
                  <StatusBadge status={b.status} />
                  <span className="text-xs text-slate-400">
                    Requested on {formatDate(b.createdAt)}
                  </span>
                </div>

                <div className="text-sm font-bold text-white flex flex-wrap items-center gap-2">
                  <span>
                    {b.vehicle?.brand} {b.vehicle?.model} ({b.vehicle?.registrationNumber})
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-automotive-orange">{b.service?.name}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Customer: <strong>{b.customer?.name}</strong> ({b.customer?.phone})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Slot: {formatDate(b.bookingDate)} • {b.timeSlot}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-automotive-orange" />
                    <span>
                      Tech:{' '}
                      <strong className="text-white">
                        {b.assignedMechanic?.name || 'Unassigned'}
                      </strong>
                    </span>
                  </div>
                </div>

                {b.complaints && (
                  <p className="text-[11px] text-slate-400 italic">
                    Customer Complaint: "{b.complaints}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-dark-800 self-end lg:self-center shrink-0">
                <button
                  onClick={() => {
                    setSelectedBooking(b);
                    setDetailsModalOpen(true);
                  }}
                  className="px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white text-xs font-bold border border-dark-700 transition"
                  title="Inspect Details"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>

                {/* If Pending: Approve / Reject */}
                {b.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(b)}
                      disabled={submitting}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleRejectClick(b)}
                      disabled={submitting}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {/* If Confirmed or can reassign: Assign Mechanic */}
                {['Confirmed', 'Mechanic Assigned'].includes(b.status) && (
                  <button
                    onClick={() => handleAssignClick(b)}
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-automotive-orange hover:bg-automotive-darkOrange text-white font-bold text-xs shadow-glow-orange transition flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{b.assignedMechanic ? 'Reassign Tech' : 'Assign Mechanic'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Reason Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Decline Service Booking"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-300">
            Please enter a reason for declining booking{' '}
            <strong className="text-white">{selectedBooking?.bookingReference}</strong>:
          </p>
          <textarea
            rows={3}
            placeholder="e.g. Workshop schedule fully allocated for heavy overhaul..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full bg-dark-850 border border-dark-750 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange"
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-dark-800">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-dark-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReject}
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              Confirm Decline
            </button>
          </div>
        </div>
      </Modal>

      {/* Assign Mechanic Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Master Technician to Job"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-300">
            Assign lead technician for{' '}
            <strong className="text-white">
              {selectedBooking?.vehicle?.brand} {selectedBooking?.vehicle?.model}
            </strong>{' '}
            ({selectedBooking?.service?.name}):
          </p>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Select Active Technician
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {mechanics.map((m) => {
                const isSelected = selectedMechanicId === m.user?._id;
                return (
                  <div
                    key={m._id}
                    onClick={() => setSelectedMechanicId(m.user?._id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-automotive-orange/15 border-automotive-orange shadow-sm'
                        : 'bg-dark-850 border-dark-750 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{m.user?.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        Specialization: {m.specialization?.join(', ')}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Workload
                      </span>
                      <span className="text-xs font-mono font-bold text-automotive-orange">
                        {m.activeJobs || 0} active job(s)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-dark-800">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-dark-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmAssign}
              disabled={submitting || !selectedMechanicId}
              className="px-5 py-2 rounded-xl bg-automotive-orange text-white font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition disabled:opacity-40"
            >
              {submitting ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Job Specification: ${selectedBooking.bookingReference}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-dark-850 border border-dark-750">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  Customer
                </span>
                <p className="font-bold text-white text-sm mt-0.5">
                  {selectedBooking.customer?.name}
                </p>
                <p className="text-slate-400">{selectedBooking.customer?.email}</p>
                <p className="text-slate-400">{selectedBooking.customer?.phone}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  Vehicle
                </span>
                <p className="font-bold text-white text-sm mt-0.5">
                  {selectedBooking.vehicle?.brand} {selectedBooking.vehicle?.model}
                </p>
                <p className="font-mono text-automotive-orange font-bold">
                  {selectedBooking.vehicle?.registrationNumber}
                </p>
                <p className="text-slate-400">
                  Mileage: {selectedBooking.vehicle?.mileage?.toLocaleString('en-IN')} km
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">
                Complaints & Directives
              </span>
              <p className="text-white">
                <strong>Complaints:</strong> {selectedBooking.complaints || 'None specified.'}
              </p>
              {selectedBooking.additionalInstructions && (
                <p className="text-slate-300">
                  <strong>Instructions:</strong> {selectedBooking.additionalInstructions}
                </p>
              )}
            </div>

            {selectedBooking.diagnosis && (
              <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-1">
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  Technician Diagnosis
                </span>
                <p className="text-slate-200">{selectedBooking.diagnosis}</p>
                {selectedBooking.repairNotes && (
                  <p className="text-slate-400 italic mt-1">
                    Notes: {selectedBooking.repairNotes}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-dark-800">
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-dark-800 text-slate-200 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookingManagement;
