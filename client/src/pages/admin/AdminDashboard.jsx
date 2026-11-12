import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Users,
  Car,
  ClipboardList,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Wrench,
  Package,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#ff6200', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsService.getAdminDashboardStats();
        setData(res);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !data) {
    return <LoadingSpinner text="Aggregating workshop telemetry & revenue charts..." />;
  }

  const { overview, charts, recentBookings } = data;

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-dark-750 shadow-automotive">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-automotive-orange bg-automotive-orange/15 px-2.5 py-0.5 rounded-md border border-automotive-orange/30">
            SYSTEM CONTROL & AUDIT
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk'] mt-1">
            Workshop Operations Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Live monitoring of service bays, mechanic workloads, inventory alerts, and revenue.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/bookings"
            className="px-4 py-2.5 rounded-xl bg-automotive-orange text-white text-xs font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Manage Bookings</span>
          </Link>
          <Link
            to="/admin/reports"
            className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-bold border border-dark-700 transition"
          >
            Export Reports
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(overview.totalRevenue)}
          icon={DollarSign}
          trend="up"
          change={`+${formatCurrency(overview.pendingRevenue)} pending`}
        />
        <StatCard
          title="Total Bookings"
          value={overview.totalBookings}
          icon={ClipboardList}
          subtitle={`${overview.pendingBookings} pending approval`}
        />
        <StatCard
          title="Registered Fleet"
          value={overview.totalVehicles}
          icon={Car}
          subtitle={`Across ${overview.totalCustomers} registered customers`}
        />
        <StatCard
          title="Lead Technicians"
          value={overview.totalMechanics}
          icon={Wrench}
          subtitle={`${overview.inProgressBookings} jobs in bays`}
        />
      </div>

      {/* Low Stock Alert if any */}
      {overview.lowStockPartsCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-amber-300 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Inventory Warning:</strong> {overview.lowStockPartsCount} spare part SKU(s)
              have dropped below their minimum safe threshold.
            </span>
          </div>
          <Link
            to="/admin/inventory"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs shrink-0 hover:bg-amber-400 transition"
          >
            Inspect Inventory
          </Link>
        </div>
      )}

      {/* Visual Analytics Charts Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Revenue Progression Area Chart */}
        <div className="lg:col-span-8 bg-dark-900 border border-dark-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                Revenue & Bookings Trend (Last 6 Months)
              </h3>
              <p className="text-xs text-slate-400">Monthly billing progression and volume</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-automotive-orange" />
                Revenue (₹)
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6200" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ff6200" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141820',
                    borderColor: '#2a3144',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ff6200"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Breakdown (Pie Chart) */}
        <div className="lg:col-span-4 bg-dark-900 border border-dark-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Status Distribution
            </h3>
            <p className="text-xs text-slate-400">Current service pipeline breakdown</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.statusBreakdown.filter((s) => s.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {charts.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141820',
                    borderColor: '#2a3144',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-dark-800">
            {charts.statusBreakdown
              .filter((s) => s.value > 0)
              .map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-slate-400 truncate">{item.name}:</span>
                  <span className="font-bold text-white">{item.value}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Popular Services & Recent Bookings Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Popular Service Packages Bar Chart */}
        <div className="lg:col-span-5 bg-dark-900 border border-dark-800 rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Top Service Categories
            </h3>
            <p className="text-xs text-slate-400">Demand volume by service package</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.topServices} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis
                  dataKey="_id"
                  type="category"
                  stroke="#64748b"
                  width={110}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141820',
                    borderColor: '#2a3144',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                  formatter={(val, name) => [val, 'Completed Bookings']}
                />
                <Bar dataKey="count" fill="#ff6200" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Service Operations Queue */}
        <div className="lg:col-span-7 bg-dark-900 border border-dark-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                Active Operations Queue
              </h3>
              <p className="text-xs text-slate-400">Recent reservations awaiting bay action</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-bold text-automotive-orange hover:underline flex items-center gap-1"
            >
              <span>All Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentBookings.slice(0, 5).map((b) => (
              <div
                key={b._id}
                className="p-3.5 rounded-2xl bg-dark-850 border border-dark-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-automotive-orange">
                      {b.bookingReference}
                    </span>
                    <StatusBadge status={b.status} />
                  </div>
                  <h4 className="font-bold text-white mt-1">
                    {b.vehicle?.brand} {b.vehicle?.model} • {b.service?.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Customer: <strong className="text-slate-300">{b.customer?.name}</strong> •{' '}
                    {formatDate(b.bookingDate)} ({b.timeSlot})
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Link
                    to={`/admin/bookings?search=${b.bookingReference}`}
                    className="px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-200 font-bold border border-dark-700 transition"
                  >
                    Action
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
