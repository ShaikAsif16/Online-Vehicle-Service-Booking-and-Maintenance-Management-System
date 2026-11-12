import React, { useState, useEffect } from 'react';
import { invoiceService } from '../../services/invoiceService';
import { paymentService } from '../../services/paymentService';
import { useNotifications } from '../../hooks/useNotifications';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Receipt,
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  AlertCircle,
  QrCode,
} from 'lucide-react';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const { addToast } = useNotifications();

  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getMyInvoices();
      setInvoices(data.invoices || []);
    } catch (err) {
      addToast('Failed to load invoices.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleOpenDetails = (inv) => {
    setSelectedInvoice(inv);
    setDetailsModalOpen(true);
  };

  const handleOpenPay = (inv) => {
    setSelectedInvoice(inv);
    setPaymentMethod('Credit/Debit Card');
    setPayModalOpen(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedInvoice) return;
    setSubmittingPayment(true);
    try {
      const res = await paymentService.processSimulatedPayment({
        invoiceId: selectedInvoice._id,
        paymentMethod,
        paymentDetails: {
          cardLast4: '4242',
          upiId: 'alex@okhdfcbank',
          bankName: 'HDFC Bank',
        },
      });

      addToast(
        `Payment successful! Transaction ID: ${res.payment?.transactionId}`,
        'success',
        6000
      );
      setPayModalOpen(false);
      setDetailsModalOpen(false);
      fetchInvoices();
    } catch (err) {
      addToast(err.response?.data?.message || 'Payment simulation failed.', 'error');
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving digital invoices..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Service Invoices & Billing
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Transparent itemized bills with pre-approved labor and OEM parts itemization.
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-3xl p-8 space-y-3">
          <Receipt className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Invoices Yet</h3>
          <p className="text-xs text-slate-400">
            Digital invoices are generated automatically as soon as your vehicle service is completed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <div
              key={inv._id}
              className="bg-dark-900 border border-dark-800 hover:border-dark-700/80 rounded-2xl p-5 sm:p-6 transition shadow-automotive flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-bold text-automotive-orange bg-dark-850 px-2.5 py-1 rounded-lg border border-dark-750">
                    {inv.invoiceNumber}
                  </span>
                  <StatusBadge status={inv.paymentStatus} />
                  <span className="text-xs text-slate-400">Issued: {formatDate(inv.issueDate)}</span>
                </div>

                <div className="text-sm font-bold text-white">
                  {inv.vehicle?.brand} {inv.vehicle?.model} ({inv.vehicle?.registrationNumber}) •{' '}
                  <span className="text-slate-300 font-semibold">{inv.booking?.service?.name}</span>
                </div>

                <p className="text-xs text-slate-400">
                  {inv.items?.length || 1} line item(s) • Subtotal: {formatCurrency(inv.subtotal)} +
                  18% GST ({formatCurrency(inv.taxAmount)})
                </p>
              </div>

              {/* Amount and Actions */}
              <div className="flex items-center gap-4 border-t sm:border-t-0 border-dark-800 pt-3 sm:pt-0 self-end sm:self-center shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Total Amount
                  </span>
                  <span className="text-xl font-black text-white">
                    {formatCurrency(inv.totalAmount)}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenDetails(inv)}
                  className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-bold border border-dark-700 transition"
                >
                  View Bill
                </button>

                {inv.paymentStatus === 'Unpaid' ? (
                  <button
                    onClick={() => handleOpenPay(inv)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-extrabold text-xs shadow-lg hover:opacity-95 transition flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay Now</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Paid</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          title={`Invoice ${selectedInvoice.invoiceNumber}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Invoice Top Details */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-2xl bg-dark-850 border border-dark-750">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Billed To</span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {selectedInvoice.customer?.name}
                </h4>
                <p className="text-slate-400">{selectedInvoice.customer?.email}</p>
                <p className="text-slate-400">{selectedInvoice.customer?.phone}</p>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Vehicle Serviced</span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {selectedInvoice.vehicle?.brand} {selectedInvoice.vehicle?.model}
                </h4>
                <p className="font-mono text-automotive-orange font-bold">
                  {selectedInvoice.vehicle?.registrationNumber}
                </p>
                <p className="text-slate-400">Date: {formatDate(selectedInvoice.issueDate)}</p>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Itemized Service Breakdown
              </h4>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-dark-750 text-[10px] text-slate-400 uppercase">
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Rate</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800">
                  {selectedInvoice.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-dark-850/40">
                      <td className="py-2.5 px-3 text-white font-medium">{item.description}</td>
                      <td className="py-2.5 px-3 uppercase text-[10px] text-automotive-orange font-bold">
                        {item.type}
                      </td>
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
            </div>

            {/* Calculations */}
            <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750 space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-white font-semibold">
                  {formatCurrency(selectedInvoice.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18%):</span>
                <span className="text-white font-semibold">
                  {formatCurrency(selectedInvoice.taxAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-dark-750">
                <span>Grand Total:</span>
                <span className="text-emerald-400">
                  {formatCurrency(selectedInvoice.totalAmount)}
                </span>
              </div>
            </div>

            {/* Payment Status Bar */}
            <div className="p-3 rounded-xl bg-dark-950 border border-dark-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Payment Status
                </span>
                <StatusBadge status={selectedInvoice.paymentStatus} />
              </div>

              {selectedInvoice.paymentStatus === 'Paid' ? (
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Payment Method</span>
                  <span className="text-xs font-bold text-emerald-400">
                    {selectedInvoice.paymentMethod}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setDetailsModalOpen(false);
                    handleOpenPay(selectedInvoice);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition"
                >
                  Pay Invoice Now
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Simulated Payment Gateway Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          title="Simulated Payment Gateway (Academic Evaluation Mode)"
          maxWidth="max-w-md"
        >
          <div className="space-y-5 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Simulated Sandbox Environment</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-300/80">
                This transaction simulates payment processing for local evaluation. No real financial
                charges will occur. All records persist to the database.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block">Invoice Number</span>
                <span className="text-sm font-bold text-white">
                  {selectedInvoice.invoiceNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Payable Amount</span>
                <span className="text-xl font-black text-emerald-400">
                  {formatCurrency(selectedInvoice.totalAmount)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Select Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Credit/Debit Card', 'UPI', 'Net Banking'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-xl border text-center transition font-bold text-xs ${
                      paymentMethod === method
                        ? 'bg-automotive-orange/20 border-automotive-orange text-white'
                        : 'bg-dark-850 border-dark-750 text-slate-400 hover:text-white'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Dummy Input based on method */}
            {paymentMethod === 'Credit/Debit Card' && (
              <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2 text-[11px]">
                <p className="text-slate-400 font-medium">Test Card Preloaded:</p>
                <div className="font-mono text-white text-xs tracking-wider">
                  •••• •••• •••• 4242 &nbsp;|&nbsp; 12/28 &nbsp;|&nbsp; CVV 123
                </div>
              </div>
            )}

            {paymentMethod === 'UPI' && (
              <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2 text-[11px]">
                <p className="text-slate-400 font-medium">Simulated VPA / UPI ID:</p>
                <div className="font-mono text-white text-xs">alex@okhdfcbank (Verified)</div>
              </div>
            )}

            {paymentMethod === 'Net Banking' && (
              <div className="p-3.5 rounded-xl bg-dark-850 border border-dark-750 space-y-2 text-[11px]">
                <p className="text-slate-400 font-medium">Simulated Clearing Bank:</p>
                <div className="font-mono text-white text-xs">HDFC Institutional Gateway</div>
              </div>
            )}

            <button
              onClick={handleProcessPayment}
              disabled={submittingPayment}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-extrabold text-sm shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {submittingPayment
                  ? 'Authorizing Sandbox Gateway...'
                  : `Authorize Payment of ${formatCurrency(selectedInvoice.totalAmount)}`}
              </span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Invoices;
