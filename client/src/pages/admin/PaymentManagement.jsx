import React, { useState, useEffect } from 'react';
import { invoiceService } from '../../services/invoiceService';
import { paymentService } from '../../services/paymentService';
import { useNotifications } from '../../hooks/useNotifications';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CreditCard, Search, DollarSign, CheckCircle2, Clock, Check, Eye } from 'lucide-react';

const PaymentManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [manualPayModalOpen, setManualPayModalOpen] = useState(false);
  const [manualMethod, setManualMethod] = useState('Cash at Workshop');
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useNotifications();

  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getAllInvoices();
      setInvoices(data.invoices || []);
    } catch (err) {
      addToast('Failed to load financial invoices.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleMarkPaid = async () => {
    if (!selectedInvoice) return;
    setSubmitting(true);
    try {
      await invoiceService.updateInvoiceStatus(selectedInvoice._id, {
        paymentStatus: 'Paid',
        paymentMethod: manualMethod,
      });
      addToast(`Invoice ${selectedInvoice.invoiceNumber} recorded as Paid.`, 'success');
      setManualPayModalOpen(false);
      fetchInvoices();
    } catch (err) {
      addToast('Failed to record payment.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const totalCollected = invoices
    .filter((i) => i.paymentStatus === 'Paid')
    .reduce((a, b) => a + (b.totalAmount || 0), 0);

  const totalPending = invoices
    .filter((i) => i.paymentStatus === 'Unpaid')
    .reduce((a, b) => a + (b.totalAmount || 0), 0);

  const filtered = invoices.filter((i) => {
    const matchStatus = statusFilter === 'All' || i.paymentStatus === statusFilter;
    const s = searchQuery.toLowerCase();
    const matchSearch =
      i.invoiceNumber.toLowerCase().includes(s) ||
      (i.customer && i.customer.name.toLowerCase().includes(s)) ||
      (i.vehicle && i.vehicle.registrationNumber.toLowerCase().includes(s));
    return matchStatus && matchSearch;
  });

  if (loading) {
    return <LoadingSpinner text="Retrieving financial ledger & invoices..." />;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Invoices & Revenue Ledger
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Reconcile customer payments, audit simulated transactions, and monitor accounts
          receivable.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-dark-900 border border-dark-800 shadow-automotive space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Collected</span>
          <h3 className="text-2xl font-black text-emerald-400">
            {formatCurrency(totalCollected)}
          </h3>
          <p className="text-xs text-slate-400">
            {invoices.filter((i) => i.paymentStatus === 'Paid').length} settled invoice(s)
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-dark-900 border border-dark-800 shadow-automotive space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Pending Collection</span>
          <h3 className="text-2xl font-black text-rose-400">{formatCurrency(totalPending)}</h3>
          <p className="text-xs text-slate-400">
            {invoices.filter((i) => i.paymentStatus === 'Unpaid').length} awaiting payment
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-dark-900 border border-dark-800 shadow-automotive space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Average Service Bill</span>
          <h3 className="text-2xl font-black text-white">
            {formatCurrency(
              invoices.length > 0
                ? Math.round((totalCollected + totalPending) / invoices.length)
                : 0
            )}
          </h3>
          <p className="text-xs text-slate-400">Per vehicle work order</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by invoice number (INV-...), customer, or registration number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Paid', 'Unpaid'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
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

      {/* Invoices Table */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl overflow-hidden shadow-automotive">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-850/60 text-slate-400 uppercase text-[10px]">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Method</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/80">
              {filtered.map((inv) => (
                <tr key={inv._id} className="hover:bg-dark-850/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-automotive-orange">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {inv.customer?.name || 'Customer'}
                    <span className="block text-[11px] text-slate-400 font-normal">
                      {inv.customer?.phone}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {inv.vehicle?.brand} {inv.vehicle?.model}
                    <span className="block text-[10px] font-mono text-slate-400">
                      {inv.vehicle?.registrationNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {formatDate(inv.issueDate)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={inv.paymentStatus} />
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-300 text-[11px]">
                    {inv.paymentMethod || 'None'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-white text-sm">
                    {formatCurrency(inv.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setDetailsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white transition"
                        title="View Bill"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {inv.paymentStatus === 'Unpaid' && (
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setManualPayModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition flex items-center gap-1"
                          title="Record Cash Payment"
                        >
                          <Check className="w-3 h-3" />
                          <span>Record Paid</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Payment Record Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={manualPayModalOpen}
          onClose={() => setManualPayModalOpen(false)}
          title={`Record Payment for ${selectedInvoice.invoiceNumber}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-300">
              Confirm recording payment of{' '}
              <strong className="text-white">{formatCurrency(selectedInvoice.totalAmount)}</strong>{' '}
              for customer <strong className="text-white">{selectedInvoice.customer?.name}</strong>:
            </p>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Payment Method</label>
              <select
                value={manualMethod}
                onChange={(e) => setManualMethod(e.target.value)}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              >
                <option value="Cash at Workshop">Cash at Workshop Counter</option>
                <option value="Credit/Debit Card">Credit/Debit Card POS Terminal</option>
                <option value="UPI">Direct UPI QR Transfer</option>
                <option value="Net Banking">Direct Bank NEFT/RTGS</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-dark-800">
              <button
                type="button"
                onClick={() => setManualPayModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-dark-800 text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMarkPaid}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg"
              >
                {submitting ? 'Updating...' : 'Confirm Paid'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Invoice ${selectedInvoice.invoiceNumber}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Billed To
                </span>
                <p className="font-bold text-white mt-1">{selectedInvoice.customer?.name}</p>
                <p className="text-slate-400">{selectedInvoice.customer?.phone}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Vehicle
                </span>
                <p className="font-bold text-white mt-1">
                  {selectedInvoice.vehicle?.brand} {selectedInvoice.vehicle?.model}
                </p>
                <p className="font-mono text-automotive-orange font-bold">
                  {selectedInvoice.vehicle?.registrationNumber}
                </p>
              </div>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-dark-800 text-[10px] uppercase text-slate-400">
                  <th className="py-2 px-3">Item Description</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Rate</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {selectedInvoice.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 text-white font-medium">{item.description}</td>
                    <td className="py-2.5 px-3 text-center text-slate-300">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right text-slate-300">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-white font-bold">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 space-y-1.5 max-w-xs ml-auto">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-white">{formatCurrency(selectedInvoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18%):</span>
                <span className="text-white">{formatCurrency(selectedInvoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-white pt-2 border-t border-dark-750">
                <span>Grand Total:</span>
                <span className="text-emerald-400">
                  {formatCurrency(selectedInvoice.totalAmount)}
                </span>
              </div>
            </div>

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

export default PaymentManagement;
