import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { useNotifications } from '../../hooks/useNotifications';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { ClipboardList, Search, Play, Clock, Car, User, AlertCircle } from 'lucide-react';

const AssignedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { addToast } = useNotifications();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await bookingService.getMechanicAssignedJobs();
        setJobs(data.jobs || []);
      } catch (err) {
        addToast('Failed to load assigned jobs.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const statuses = ['All', 'Mechanic Assigned', 'In Progress', 'Waiting for Parts', 'Completed'];

  const filtered = jobs.filter((j) => {
    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    const s = searchQuery.toLowerCase();
    const matchSearch =
      j.bookingReference.toLowerCase().includes(s) ||
      (j.vehicle && j.vehicle.registrationNumber.toLowerCase().includes(s)) ||
      (j.vehicle && j.vehicle.brand.toLowerCase().includes(s)) ||
      (j.customer && j.customer.name.toLowerCase().includes(s));
    return matchStatus && matchSearch;
  });

  if (loading) {
    return <LoadingSpinner text="Retrieving assigned technician work orders..." />;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Assigned Workshop Jobs
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Work orders allocated to your technician station for diagnosis, parts installation, and
          road-testing.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Reference (BK-...), registration number, or client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
          />
        </div>

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

      {/* Jobs List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-3xl p-8 space-y-3">
          <ClipboardList className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Matching Service Orders</h3>
          <p className="text-xs text-slate-400">
            You do not have any jobs matching the selected criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((j) => (
            <div
              key={j._id}
              className="bg-dark-900 border border-dark-800 hover:border-dark-700/80 rounded-2xl p-5 sm:p-6 transition shadow-automotive flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-bold text-automotive-orange bg-dark-850 px-2.5 py-1 rounded-lg border border-dark-750">
                    {j.bookingReference}
                  </span>
                  <StatusBadge status={j.status} />
                  <span className="text-xs text-slate-400">Slot: {j.timeSlot}</span>
                </div>

                <div className="text-sm font-bold text-white">
                  {j.vehicle?.brand} {j.vehicle?.model} ({j.vehicle?.registrationNumber}) •{' '}
                  <span className="text-slate-300 font-semibold">{j.service?.name}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Customer: <strong>{j.customer?.name}</strong> ({j.customer?.phone})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Appointment Date: {formatDate(j.bookingDate)}</span>
                  </div>
                </div>

                {j.complaints && (
                  <p className="text-[11px] text-slate-400 italic">
                    Customer Complaint: "{j.complaints}"
                  </p>
                )}
              </div>

              <div className="pt-3 md:pt-0 border-t md:border-t-0 border-dark-800 self-end md:self-center shrink-0">
                <Link
                  to={`/mechanic/job/${j._id}`}
                  className="px-5 py-2.5 rounded-xl bg-automotive-orange hover:bg-automotive-darkOrange text-white font-extrabold text-xs shadow-glow-orange transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Open Job Console</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedJobs;
