import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { inventoryService } from '../../services/inventoryService';
import { useNotifications } from '../../hooks/useNotifications';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Wrench,
  Car,
  User,
  Clock,
  CheckCircle2,
  Package,
  Plus,
  Trash2,
  Save,
  AlertTriangle,
  Play,
  ArrowLeft,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useNotifications();

  const [booking, setBooking] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Workbench Form State
  const [jobStatus, setJobStatus] = useState('In Progress');
  const [diagnosis, setDiagnosis] = useState('');
  const [repairNotes, setRepairNotes] = useState('');
  const [laborCost, setLaborCost] = useState(0);
  const [selectedPartsUsed, setSelectedPartsUsed] = useState([]);

  // Part Selector Modal
  const [partToAdd, setPartToAdd] = useState('');
  const [partQty, setPartQty] = useState(1);
  const [completeConfirmModal, setCompleteConfirmModal] = useState(false);

  const fetchJobData = async () => {
    try {
      const [bookingRes, inventoryRes] = await Promise.all([
        bookingService.getBookingById(id),
        inventoryService.getInventoryParts(),
      ]);

      const b = bookingRes.booking;
      setBooking(b);
      setInventory(inventoryRes.parts || []);

      setJobStatus(b.status === 'Mechanic Assigned' ? 'In Progress' : b.status);
      setDiagnosis(b.diagnosis || '');
      setRepairNotes(b.repairNotes || '');
      setLaborCost(b.laborCost || b.service?.basePrice || 0);

      // Prepopulate parts used if existing
      if (b.partsUsed && b.partsUsed.length > 0) {
        setSelectedPartsUsed(
          b.partsUsed.map((p) => ({
            partId: p.part?._id || p.part,
            partName: p.partName,
            partNumber: p.partNumber,
            quantity: p.quantity,
            unitPrice: p.unitPrice,
            totalPrice: p.totalPrice,
          }))
        );
      }
    } catch (err) {
      addToast('Failed to load job details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobData();
  }, [id]);

  const handleAddPart = () => {
    if (!partToAdd) {
      addToast('Please select a spare part to requisition.', 'warning');
      return;
    }

    const partObj = inventory.find((p) => p._id === partToAdd);
    if (!partObj) return;

    if (partObj.stockQuantity < Number(partQty)) {
      addToast(
        `Insufficient inventory stock! Available: ${partObj.stockQuantity}, Requested: ${partQty}`,
        'error'
      );
      return;
    }

    const qty = Number(partQty) || 1;
    const itemTotal = partObj.sellingPrice * qty;

    setSelectedPartsUsed((prev) => [
      ...prev,
      {
        partId: partObj._id,
        partName: partObj.name,
        partNumber: partObj.partNumber,
        quantity: qty,
        unitPrice: partObj.sellingPrice,
        totalPrice: itemTotal,
      },
    ]);

    setPartToAdd('');
    setPartQty(1);
    addToast(`Added ${partObj.name} to job sheet.`, 'info');
  };

  const handleRemovePart = (index) => {
    setSelectedPartsUsed((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveProgress = async (finalStatus = jobStatus) => {
    setSubmitting(true);
    try {
      await bookingService.updateServiceProgress(booking._id, {
        status: finalStatus,
        diagnosis,
        repairNotes,
        laborCost,
        partsUsed: selectedPartsUsed.map((p) => ({
          partId: p.partId,
          quantity: p.quantity,
        })),
      });

      addToast(
        finalStatus === 'Completed'
          ? 'Service job completed! Invoice and maintenance record created.'
          : 'Service progress saved to workshop telemetry.',
        'success'
      );

      if (finalStatus === 'Completed') {
        navigate('/mechanic/completed');
      } else {
        fetchJobData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update service order.', 'error');
    } finally {
      setSubmitting(false);
      setCompleteConfirmModal(false);
    }
  };

  if (loading || !booking) {
    return <LoadingSpinner text="Connecting to vehicle diagnostic telemetry..." />;
  }

  const partsTotal = selectedPartsUsed.reduce((sum, p) => sum + p.totalPrice, 0);
  const grandTotal = Number(laborCost) + partsTotal;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Bar with Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/mechanic/assigned"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assigned Jobs</span>
        </Link>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <StatusBadge status={booking.status} />
          <span className="font-mono text-xs font-bold text-automotive-orange bg-dark-850 px-2.5 py-1 rounded-lg border border-dark-750">
            {booking.bookingReference}
          </span>
        </div>
      </div>

      {/* Vehicle and Customer Header Card */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 shadow-automotive space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-dark-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Vehicle Under Inspection
            </span>
            <h1 className="text-2xl font-black text-white mt-1">
              {booking.vehicle?.brand} {booking.vehicle?.model} ({booking.vehicle?.year})
            </h1>
            <p className="text-xs font-mono text-automotive-orange font-bold mt-0.5">
              Registration: {booking.vehicle?.registrationNumber} • {booking.vehicle?.fuelType} •{' '}
              {booking.vehicle?.mileage?.toLocaleString('en-IN')} km
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750 text-xs sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Customer Details
            </span>
            <p className="font-bold text-white text-sm mt-0.5">{booking.customer?.name}</p>
            <p className="text-slate-400 font-mono">{booking.customer?.phone}</p>
            <p className="text-slate-400">{booking.customer?.email}</p>
          </div>
        </div>

        {/* Complaints Box */}
        <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750 text-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-automotive-orange">
            Customer Stated Complaints & Symptoms
          </span>
          <p className="text-white font-medium">
            "{booking.complaints || 'No specific complaints noted; standard scheduled inspection.'}"
          </p>
          {booking.additionalInstructions && (
            <p className="text-slate-400 italic pt-1">
              Notes: {booking.additionalInstructions}
            </p>
          )}
        </div>
      </div>

      {/* Technician Diagnostic Workbench */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 shadow-automotive space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-dark-800">
          <div>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
              Service Operations Console
            </h3>
            <p className="text-xs text-slate-400">
              Record diagnosis, repair notes, and adjust job stage
            </p>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Job Stage:</span>
            <select
              value={jobStatus}
              onChange={(e) => setJobStatus(e.target.value)}
              className="bg-dark-850 border border-dark-750 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-automotive-orange"
            >
              <option value="In Progress">In Progress (Active Work)</option>
              <option value="Waiting for Parts">Waiting for Parts</option>
              <option value="Completed">Completed (Final Quality Check)</option>
            </select>
          </div>
        </div>

        {/* Diagnosis & Repair Notes Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">
              Diagnostic Telemetry & Findings *
            </label>
            <textarea
              rows={4}
              placeholder="e.g. Scanned OBD-II DTC codes: None found. Measured front brake rotor thickness at 22.4mm (within spec). Friction pads worn to 2mm."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full bg-dark-850 border border-dark-750 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Repair Actions Conducted *</label>
            <textarea
              rows={4}
              placeholder="e.g. Dismantled front caliper assemblies, deglazed rotors, installed Brembo ceramic brake pads, bled lines with DOT 4 synthetic fluid."
              value={repairNotes}
              onChange={(e) => setRepairNotes(e.target.value)}
              className="w-full bg-dark-850 border border-dark-750 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange"
            />
          </div>
        </div>

        {/* Spare Parts Requisition Sub-panel */}
        <div className="pt-6 border-t border-dark-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-automotive-orange" />
                <span>Spare Parts Requisition & Installation</span>
              </h4>
              <p className="text-xs text-slate-400">
                Installed parts are logged to the invoice and deducted from workshop inventory.
              </p>
            </div>
          </div>

          {/* Add Part Controls */}
          <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full sm:w-auto">
              <select
                value={partToAdd}
                onChange={(e) => setPartToAdd(e.target.value)}
                className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-automotive-orange"
              >
                <option value="">-- Choose Spare Part from Workshop Inventory --</option>
                {inventory.map((item) => (
                  <option key={item._id} value={item._id} disabled={item.stockQuantity <= 0}>
                    {item.name} ({item.partNumber}) - {formatCurrency(item.sellingPrice)} [Stock:{' '}
                    {item.stockQuantity} {item.unit}]
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="number"
                min={1}
                max={10}
                value={partQty}
                onChange={(e) => setPartQty(e.target.value)}
                className="w-20 bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-automotive-orange text-center"
              />
              <button
                type="button"
                onClick={handleAddPart}
                className="px-4 py-2 rounded-xl bg-automotive-orange hover:bg-automotive-darkOrange text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Fit Part</span>
              </button>
            </div>
          </div>

          {/* Parts Used Table */}
          {selectedPartsUsed.length > 0 && (
            <div className="overflow-x-auto custom-scrollbar border border-dark-800 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-dark-800 bg-dark-850/50 text-[10px] text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Part Description</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800">
                  {selectedPartsUsed.map((p, idx) => (
                    <tr key={idx} className="hover:bg-dark-850/40">
                      <td className="py-2.5 px-3 text-white font-medium">{p.partName}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{p.partNumber}</td>
                      <td className="py-2.5 px-3 text-center text-slate-300 font-bold">
                        {p.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-300">
                        {formatCurrency(p.unitPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-white font-bold">
                        {formatCurrency(p.totalPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemovePart(idx)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Cost Summary & Final Actions */}
        <div className="pt-6 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Labor & Diagnostics
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-slate-400">₹</span>
                <input
                  type="number"
                  min={0}
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                  className="w-24 bg-dark-850 border border-dark-750 rounded-lg px-2 py-1 text-xs text-white font-bold focus:outline-none focus:border-automotive-orange"
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Installed Parts Total
              </span>
              <span className="text-sm font-bold text-white mt-1 block">
                {formatCurrency(partsTotal)}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Estimated Order Bill
              </span>
              <span className="text-base font-black text-emerald-400 mt-0.5 block">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSaveProgress(jobStatus)}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-bold border border-dark-700 transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-automotive-orange" />
              <span>Save Progress</span>
            </button>

            {booking.status !== 'Completed' && (
              <button
                type="button"
                onClick={() => setCompleteConfirmModal(true)}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-extrabold shadow-lg hover:opacity-95 transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Work Completed</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Completion Confirmation Modal */}
      <ConfirmationModal
        isOpen={completeConfirmModal}
        onClose={() => setCompleteConfirmModal(false)}
        onConfirm={() => handleSaveProgress('Completed')}
        title="Complete Service Order"
        message={`Are you ready to mark job ${booking.bookingReference} as Completed? This action will generate the final invoice, record this in the vehicle's permanent maintenance history, and notify the customer that their vehicle is ready.`}
        confirmText="Confirm Service Complete"
        isLoading={submitting}
      />
    </div>
  );
};

export default JobDetails;
