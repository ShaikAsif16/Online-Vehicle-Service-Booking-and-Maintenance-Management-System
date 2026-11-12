import React, { useState, useEffect } from 'react';
import { serviceService } from '../../services/serviceService';
import { useNotifications } from '../../hooks/useNotifications';
import Modal from '../../components/common/Modal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import { Wrench, Plus, Edit2, Trash2, Clock, CheckCircle2 } from 'lucide-react';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    name: '',
    category: 'General Maintenance',
    description: '',
    basePrice: 1500,
    estimatedDurationMinutes: 60,
    applicableVehicleTypes: ['car', 'motorcycle', 'scooter'],
    includedTasks: '',
  });

  const fetchServices = async () => {
    try {
      const data = await serviceService.getAllServices();
      setServices(data.services || []);
    } catch (err) {
      addToast('Failed to load services catalog.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setSelectedService(null);
    setFormData({
      name: '',
      category: 'General Maintenance',
      description: '',
      basePrice: 1500,
      estimatedDurationMinutes: 60,
      applicableVehicleTypes: ['car', 'motorcycle', 'scooter'],
      includedTasks: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (s) => {
    setSelectedService(s);
    setFormData({
      name: s.name,
      category: s.category,
      description: s.description,
      basePrice: s.basePrice,
      estimatedDurationMinutes: s.estimatedDurationMinutes,
      applicableVehicleTypes: s.applicableVehicleTypes,
      includedTasks: s.includedTasks?.join('\n') || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.description || !formData.basePrice) {
      addToast('Please provide all mandatory service package details.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const tasksArray = formData.includedTasks
        ? formData.includedTasks.split('\n').filter((t) => t.trim().length > 0)
        : [];

      const payload = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        basePrice: Number(formData.basePrice),
        estimatedDurationMinutes: Number(formData.estimatedDurationMinutes),
        applicableVehicleTypes: formData.applicableVehicleTypes,
        includedTasks: tasksArray,
      };

      if (selectedService) {
        await serviceService.updateService(selectedService._id, payload);
        addToast('Service package updated successfully.', 'success');
      } else {
        await serviceService.createService(payload);
        addToast('New service package added to workshop catalog.', 'success');
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedService) return;
    setSubmitting(true);
    try {
      await serviceService.deleteService(selectedService._id);
      addToast('Service package deactivated.', 'success');
      setDeleteModalOpen(false);
      fetchServices();
    } catch (err) {
      addToast('Failed to delete service.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving workshop services catalog..." />;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Service Packages Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Define labor pricing, task checklists, and target duration per maintenance offering.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-automotive-orange text-white font-extrabold text-xs shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service Package</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div
            key={s._id}
            className="bg-dark-900 border border-dark-800 rounded-3xl p-6 shadow-automotive space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-dark-800">
                <span className="text-[10px] font-bold text-automotive-orange bg-dark-850 px-2.5 py-0.5 rounded border border-dark-750 uppercase">
                  {s.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {s.estimatedDurationMinutes} mins
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-3">{s.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {s.description}
              </p>

              {/* Tasks preview */}
              <div className="mt-4 pt-3 border-t border-dark-800 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Checklist Items ({s.includedTasks?.length || 0}):
                </span>
                {s.includedTasks?.slice(0, 2).map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-dark-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Base Labor Rate
                </span>
                <span className="text-lg font-black text-white">{formatCurrency(s.basePrice)}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-2 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white transition"
                  title="Edit Package"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setSelectedService(s);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 rounded-lg bg-dark-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                  title="Deactivate Package"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedService ? 'Edit Service Package' : 'Create New Service Package'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Service Package Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Laser Wheel Alignment & Balancing"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              >
                <option value="General Maintenance">General Maintenance</option>
                <option value="Engine & Transmission">Engine & Transmission</option>
                <option value="Brakes & Suspension">Brakes & Suspension</option>
                <option value="Electrical & Diagnostics">Electrical & Diagnostics</option>
                <option value="AC & Climate Control">AC & Climate Control</option>
                <option value="Tires & Wheels">Tires & Wheels</option>
                <option value="Body & Detailing">Body & Detailing</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Base Price (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Duration (Minutes) *</label>
              <input
                type="number"
                required
                min={15}
                value={formData.estimatedDurationMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedDurationMinutes: e.target.value })
                }
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Package Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Detailed description of the diagnostic and maintenance procedure..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-dark-850 border border-dark-750 rounded-xl p-3 text-white focus:outline-none focus:border-automotive-orange"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">
              Checklist Tasks Included (1 task per line)
            </label>
            <textarea
              rows={3}
              placeholder="e.g.&#10;Full multi-point chassis inspection&#10;Bleed hydraulic brake fluid&#10;Resurface rotor friction disks"
              value={formData.includedTasks}
              onChange={(e) => setFormData({ ...formData, includedTasks: e.target.value })}
              className="w-full bg-dark-850 border border-dark-750 rounded-xl p-3 text-white focus:outline-none focus:border-automotive-orange"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-dark-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-dark-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-automotive-orange text-white font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition"
            >
              {submitting ? 'Saving...' : selectedService ? 'Update Package' : 'Save Package'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Deactivate Service Package"
        message={`Are you sure you want to deactivate package "${selectedService?.name}"?`}
        confirmText="Deactivate"
        isDanger={true}
        isLoading={submitting}
      />
    </div>
  );
};

export default ServiceManagement;
