import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { bookingService } from '../../services/bookingService';
import { invoiceService } from '../../services/invoiceService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { BarChart3, Download, Printer, Calendar, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

const ReportsAnalytics = () => {
  const [data, setData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [statsRes, bookingsRes, invoicesRes] = await Promise.all([
          analyticsService.getAdminDashboardStats(),
          bookingService.getAllBookings(),
          invoiceService.getAllInvoices(),
        ]);
        setData(statsRes);
        setBookings(bookingsRes.bookings || []);
        setInvoices(invoicesRes.invoices || []);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  const handleExportCSV = () => {
    if (bookings.length === 0) return;

    const headers = [
      'Booking Reference',
      'Date',
      'Customer',
      'Phone',
      'Vehicle',
      'Registration',
      'Service',
      'Technician',
      'Status',
      'Total Amount (INR)',
    ];

    const rows = bookings.map((b) => [
      b.bookingReference,
      b.bookingDate,
      `"${b.customer?.name || ''}"`,
      b.customer?.phone || '',
      `"${b.vehicle?.brand || ''} ${b.vehicle?.model || ''}"`,
      b.vehicle?.registrationNumber || '',
      `"${b.service?.name || ''}"`,
      `"${b.assignedMechanic?.name || 'Unassigned'}"`,
      b.status,
      b.totalCost || b.estimatedCost || 0,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `AutoCare_Pro_Service_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !data) {
    return <LoadingSpinner text="Compiling academic project report metrics..." />;
  }

  const { overview, charts } = data;

  return (
    <div className="space-y-8 print:text-black">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Operations & Financial Audit Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Comprehensive audit metrics, service volume reconciliation, and exportable ledger.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 print:hidden">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-bold border border-dark-700 transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-automotive-orange text-white text-xs font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Audit Summary Box */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 text-center space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Service Orders</span>
          <p className="text-3xl font-black text-white">{overview.totalBookings}</p>
        </div>
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 text-center space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Total Revenue Billed</span>
          <p className="text-3xl font-black text-emerald-400">
            {formatCurrency(overview.totalRevenue + overview.pendingRevenue)}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 text-center space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Active Customer Base</span>
          <p className="text-3xl font-black text-white">{overview.totalCustomers}</p>
        </div>
        <div className="p-5 rounded-2xl bg-dark-900 border border-dark-800 text-center space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Workshop bays utilization</span>
          <p className="text-3xl font-black text-automotive-orange">
            {Math.round((overview.inProgressBookings / (3 * 7)) * 100)}%
          </p>
        </div>
      </div>

      {/* Printable Report Ledger */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 shadow-automotive space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-dark-800">
          <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
            Master Service Orders Ledger ({bookings.length} Records)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Generated: {new Date().toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-dark-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Ref Code</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Package</th>
                <th className="py-2.5 px-3">Assigned Tech</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Billed (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/80">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-dark-850/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-automotive-orange">
                    {b.bookingReference}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{formatDate(b.bookingDate)}</td>
                  <td className="py-2.5 px-3 font-medium text-white">{b.customer?.name}</td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {b.vehicle?.brand} {b.vehicle?.model} ({b.vehicle?.registrationNumber})
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 truncate max-w-xs">{b.service?.name}</td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {b.assignedMechanic?.name || 'Unassigned'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold">{b.status}</td>
                  <td className="py-2.5 px-3 text-right font-black text-white">
                    {formatCurrency(b.totalCost || b.estimatedCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
