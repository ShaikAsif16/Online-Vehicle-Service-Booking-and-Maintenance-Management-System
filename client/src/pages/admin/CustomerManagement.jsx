import React, { useState, useEffect } from 'react';
import { userService } from '../../services/analyticsService';
import { useNotifications } from '../../hooks/useNotifications';
import Modal from '../../components/common/Modal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { Users, Search, Car, ClipboardList, ShieldAlert, Check, Ban, Eye } from 'lucide-react';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Customer Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);

  // Status toggle confirmation
  const [toggleModalOpen, setToggleModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useNotifications();

  const fetchCustomers = async () => {
    try {
      const data = await userService.getAllUsers({ role: 'customer' });
      setCustomers(data.users || []);
    } catch (err) {
      addToast('Failed to load customer records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleViewCustomer = async (user) => {
    setSelectedUser(user);
    setLoadingDetails(true);
    setModalOpen(true);
    try {
      const data = await userService.getUserById(user._id);
      setCustomerDetails(data);
    } catch (err) {
      addToast('Failed to load full customer history.', 'error');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleStatus = (user) => {
    setSelectedUser(user);
    setToggleModalOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      await userService.toggleUserStatus(selectedUser._id);
      addToast(
        `Customer account ${selectedUser.isActive ? 'deactivated' : 'activated'} successfully.`,
        'success'
      );
      setToggleModalOpen(false);
      fetchCustomers();
    } catch (err) {
      addToast('Status update failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = customers.filter((c) => {
    const s = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s) ||
      (c.phone && c.phone.includes(s))
    );
  });

  if (loading) {
    return <LoadingSpinner text="Retrieving customer database..." />;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Customer Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Search registered clientele, inspect vehicle fleets, and review booking activity.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 sm:p-5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, email address, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl overflow-hidden shadow-automotive">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-850/60 text-slate-400 uppercase text-[10px]">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4 text-center">Vehicles</th>
                <th className="py-3.5 px-4 text-center">Bookings</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/80">
              {filtered.map((c) => (
                <tr key={c._id} className="hover:bg-dark-850/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center text-automotive-orange font-bold text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{c.name}</h4>
                        <p className="text-[11px] text-slate-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono">{c.phone}</td>
                  <td className="py-3.5 px-4 text-slate-300">{c.address?.city || 'Hyderabad'}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-dark-800 text-slate-200 font-bold border border-dark-750">
                      {c.vehicleCount || 0}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-dark-800 text-slate-200 font-bold border border-dark-750">
                      {c.bookingCount || 0}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewCustomer(c)}
                        className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white transition"
                        title="View Full Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className={`p-1.5 rounded-lg transition ${
                          c.isActive
                            ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                        title={c.isActive ? 'Suspend Customer' : 'Activate Customer'}
                      >
                        {c.isActive ? <Ban className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Full Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Customer Profile: ${selectedUser.name}`}
          maxWidth="max-w-3xl"
        >
          {loadingDetails || !customerDetails ? (
            <LoadingSpinner text="Loading customer vehicles & history..." />
          ) : (
            <div className="space-y-6 text-xs">
              <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Email</span>
                  <p className="font-bold text-white mt-0.5 truncate">{selectedUser.email}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Phone</span>
                  <p className="font-bold text-white mt-0.5">{selectedUser.phone}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Address</span>
                  <p className="font-bold text-white mt-0.5 truncate">
                    {selectedUser.address?.street || 'N/A'}, {selectedUser.address?.city}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Registration Date
                  </span>
                  <p className="font-bold text-white mt-0.5">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>

              {/* Registered Vehicles */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-automotive-orange" />
                  <span>Registered Garage ({customerDetails.vehicles?.length || 0})</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customerDetails.vehicles?.map((v) => (
                    <div
                      key={v._id}
                      className="p-3 rounded-xl bg-dark-850 border border-dark-750 flex items-center justify-between"
                    >
                      <div>
                        <h5 className="font-bold text-white">
                          {v.brand} {v.model} ({v.year})
                        </h5>
                        <p className="text-[11px] font-mono text-automotive-orange">
                          {v.registrationNumber} • {v.fuelType}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-dark-800 text-slate-300">
                        {v.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-automotive-orange" />
                  <span>Service Appointments ({customerDetails.bookings?.length || 0})</span>
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {customerDetails.bookings?.map((b) => (
                    <div
                      key={b._id}
                      className="p-3 rounded-xl bg-dark-850 border border-dark-750 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-automotive-orange">
                            {b.bookingReference}
                          </span>
                          <StatusBadge status={b.status} />
                        </div>
                        <p className="text-slate-300 mt-0.5">
                          {b.service?.name} on {formatDate(b.bookingDate)}
                        </p>
                      </div>
                      <span className="text-white font-bold">
                        ₹{b.totalCost?.toLocaleString('en-IN') || b.estimatedCost}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Toggle Status Confirmation Modal */}
      <ConfirmationModal
        isOpen={toggleModalOpen}
        onClose={() => setToggleModalOpen(false)}
        onConfirm={handleConfirmToggle}
        title="Toggle Account Access"
        message={`Are you sure you want to ${
          selectedUser?.isActive ? 'deactivate' : 'activate'
        } ${selectedUser?.name}'s account?`}
        confirmText={selectedUser?.isActive ? 'Deactivate' : 'Activate'}
        isDanger={selectedUser?.isActive}
        isLoading={submitting}
      />
    </div>
  );
};

export default CustomerManagement;
