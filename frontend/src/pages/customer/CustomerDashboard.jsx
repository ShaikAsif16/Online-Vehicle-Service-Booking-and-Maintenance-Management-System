import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { vehicleService } from '../../services/vehicleService';
import { bookingService } from '../../services/bookingService';
import { invoiceService } from '../../services/invoiceService';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Car,
  CalendarCheck,
  CheckCircle2,
  Receipt,
  Plus,
  ArrowRight,
  Activity,
  AlertTriangle,
  Clock,
  Wrench,
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [vehiclesRes, bookingsRes, invoicesRes] = await Promise.all([
          vehicleService.getMyVehicles(),
          bookingService.getMyBookings(),
          invoiceService.getMyInvoices(),
        ]);
        setVehicles(vehiclesRes.vehicles || []);
        setBookings(bookingsRes.bookings || []);
        setInvoices(invoicesRes.invoices || []);
      } catch (err) {
        console.error('Failed to load customer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your vehicle dashboard..." />;
  }

  const activeBookings = bookings.filter((b) =>
    ['Pending', 'Confirmed', 'Mechanic Assigned', 'In Progress', 'Waiting for Parts'].includes(
      b.status
    )
  );

  const completedServices = bookings.filter((b) => b.status === 'Completed');
  const unpaidInvoices = invoices.filter((inv) => inv.paymentStatus === 'Unpaid');
  const latestActiveBooking = activeBookings[0] || null;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-dark-750 shadow-automotive">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
              Welcome, {user?.name}!
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-automotive-orange/20 text-automotive-orange border border-automotive-orange/30">
              Customer Portal
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your registered fleet, schedule workshop bays, and review service telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/customer/vehicles"
            className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 border border-dark-700 text-xs font-bold text-white transition flex items-center gap-1.5"
          >
            <Car className="w-4 h-4 text-automotive-orange" />
            <span>My Vehicles</span>
          </Link>
          <Link
            to="/customer/book"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-automotive-orange to-automotive-darkOrange text-white text-xs font-extrabold shadow-glow-orange hover:opacity-95 transition flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Service</span>
          </Link>
        </div>
      </div>

      {/* Unpaid Invoice Alert Banner */}
      {unpaidInvoices.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-rose-200">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">
                You have {unpaidInvoices.length} completed service invoice(s) awaiting payment.
              </p>
              <p className="text-xs text-rose-300/80">
                Invoice {unpaidInvoices[0].invoiceNumber} total:{' '}
                <strong>{formatCurrency(unpaidInvoices[0].totalAmount)}</strong>
              </p>
            </div>
          </div>
          <Link
            to="/customer/invoices"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition shrink-0"
          >
            Pay Invoice Now (Simulated)
          </Link>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Registered Vehicles"
          value={vehicles.length}
          icon={Car}
          subtitle="Cars, Motorcycles, Scooters"
        />
        <StatCard
          title="Active Appointments"
          value={activeBookings.length}
          icon={CalendarCheck}
          subtitle="Currently in pipeline"
        />
        <StatCard
          title="Completed Services"
          value={completedServices.length}
          icon={CheckCircle2}
          subtitle="All maintenance records"
        />
        <StatCard
          title="Pending Invoices"
          value={unpaidInvoices.length}
          icon={Receipt}
          subtitle={
            unpaidInvoices.length > 0
              ? `${formatCurrency(unpaidInvoices.reduce((a, b) => a + b.totalAmount, 0))} due`
              : 'All invoices settled'
          }
        />
      </div>

      {/* Active Service Tracker Highlight */}
      {latestActiveBooking && (
        <div className="p-6 rounded-3xl bg-dark-900 border border-automotive-orange/40 shadow-automotive relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-automotive-orange/5 blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-automotive-orange/10 border border-automotive-orange/30 flex items-center justify-center text-automotive-orange">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-automotive-orange">
                  Live Workshop Telemetry
                </span>
                <h3 className="text-lg font-bold text-white">
                  {latestActiveBooking.vehicle?.brand} {latestActiveBooking.vehicle?.model} (
                  {latestActiveBooking.vehicle?.registrationNumber})
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={latestActiveBooking.status} />
              <Link
                to={`/customer/track?id=${latestActiveBooking._id}`}
                className="px-4 py-2 rounded-xl bg-automotive-orange text-white text-xs font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center gap-1.5"
              >
                <span>Track Full Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-750">
              <span className="text-slate-400 block mb-1">Service Type</span>
              <span className="font-bold text-white text-sm">
                {latestActiveBooking.service?.name}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-750">
              <span className="text-slate-400 block mb-1">Scheduled Bay Slot</span>
              <span className="font-bold text-white text-sm">
                {formatDate(latestActiveBooking.bookingDate)} • {latestActiveBooking.timeSlot}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-750">
              <span className="text-slate-400 block mb-1">Assigned Technician</span>
              <span className="font-bold text-white text-sm">
                {latestActiveBooking.assignedMechanic?.name || 'Awaiting Assignment'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Recent Bookings & Vehicles Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-7 bg-dark-900 border border-dark-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Recent Service Appointments
            </h3>
            <Link
              to="/customer/bookings"
              className="text-xs font-bold text-automotive-orange hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <Wrench className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-400">No service bookings created yet.</p>
              <Link
                to="/customer/book"
                className="inline-block px-4 py-2 rounded-xl bg-automotive-orange text-white text-xs font-bold"
              >
                Schedule Your First Service
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 4).map((b) => (
                <div
                  key={b._id}
                  className="p-4 rounded-2xl bg-dark-850 border border-dark-750/70 hover:border-dark-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-automotive-orange">
                        {b.bookingReference}
                      </span>
                      <StatusBadge status={b.status} />
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {b.vehicle?.brand} {b.vehicle?.model} • {b.service?.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {formatDate(b.bookingDate)} at {b.timeSlot}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      to={`/customer/track?id=${b._id}`}
                      className="px-3 py-1.5 rounded-lg bg-dark-750 hover:bg-dark-700 text-slate-200 text-xs font-semibold transition"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vehicles Quick Snapshot */}
        <div className="lg:col-span-5 bg-dark-900 border border-dark-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Your Registered Garage
            </h3>
            <Link
              to="/customer/vehicles"
              className="text-xs font-bold text-automotive-orange hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle</span>
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <Car className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-400">No vehicles registered to your account.</p>
              <Link
                to="/customer/vehicles"
                className="inline-block px-4 py-2 rounded-xl bg-automotive-orange text-white text-xs font-bold"
              >
                Register a Vehicle
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {vehicles.map((v) => (
                <div
                  key={v._id}
                  className="p-3.5 rounded-2xl bg-dark-850 border border-dark-750 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-automotive-orange font-bold text-xs uppercase">
                      {v.type === 'motorcycle' ? '🏍' : v.type === 'scooter' ? '🛵' : '🚗'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {v.brand} {v.model} ({v.year})
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400">
                        {v.registrationNumber} • {v.fuelType}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/customer/book?vehicle=${v._id}`}
                    className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-automotive-orange text-white text-[11px] font-bold transition"
                  >
                    Book
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
