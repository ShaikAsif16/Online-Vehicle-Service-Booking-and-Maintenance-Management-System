import React, { useState, useEffect } from 'react';
import { mechanicService } from '../../services/mechanicService';
import { useNotifications } from '../../hooks/useNotifications';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Wrench, Plus, User, Star, Award, Shield, Phone, Mail, Edit3 } from 'lucide-react';

const MechanicManagement = () => {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // New Mechanic Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'Mechanic@123',
    phone: '',
    specialization: 'General Maintenance, Engine & Transmission',
    experienceYears: 4,
    status: 'available',
    certifications: 'ASE Certified Automotive Specialist',
  });

  const { addToast } = useNotifications();

  const fetchMechanics = async () => {
    try {
      const data = await mechanicService.getAllMechanics();
      setMechanics(data.mechanics || []);
    } catch (err) {
      addToast('Failed to load technician roster.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      password: 'Mechanic@123',
      phone: '',
      specialization: 'General Maintenance, Engine & Transmission',
      experienceYears: 4,
      status: 'available',
      certifications: 'ASE Certified Automotive Specialist',
    });
    setAddModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      addToast('Please fill out required fields.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const specArray = formData.specialization.split(',').map((s) => s.trim());
      const certArray = formData.certifications.split(',').map((s) => s.trim());

      await mechanicService.createMechanic({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        specialization: specArray,
        experienceYears: Number(formData.experienceYears),
        status: formData.status,
        certifications: certArray,
      });

      addToast('Technician account created successfully.', 'success');
      setAddModalOpen(false);
      fetchMechanics();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create technician.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEdit = (m) => {
    setSelectedMechanic(m);
    setEditModalOpen(true);
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedMechanic) return;
    setSubmitting(true);
    try {
      await mechanicService.updateMechanic(selectedMechanic._id, { status });
      addToast(`Status updated to ${status}.`, 'success');
      setEditModalOpen(false);
      fetchMechanics();
    } catch (err) {
      addToast('Update failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving technician personnel database..." />;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Master Technicians Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage certified workshop personnel, skill specializations, and bay workloads.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-automotive-orange text-white font-extrabold text-xs shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Technician</span>
        </button>
      </div>

      {/* Grid of Mechanics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mechanics.map((m) => (
          <div
            key={m._id}
            className="bg-dark-900 border border-dark-800 rounded-3xl p-6 shadow-automotive space-y-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-dark-800">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    m.status === 'available'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : m.status === 'busy'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {m.status.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{m.rating || 4.9}</span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 my-4">
                <div className="w-12 h-12 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center text-automotive-orange font-bold text-lg">
                  {m.user?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{m.user?.name}</h3>
                  <p className="text-xs text-slate-400">
                    Experience: <strong>{m.experienceYears} Years</strong>
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{m.user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{m.user?.phone}</span>
                </div>
              </div>

              {/* Specializations */}
              <div className="mt-4 pt-3 border-t border-dark-800 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Core Specialization:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {m.specialization?.map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-dark-850 text-slate-300 text-[10px] border border-dark-750 font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Workload Stats & Actions */}
            <div className="pt-4 border-t border-dark-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                  Active Jobs
                </span>
                <span className="text-sm font-bold text-white">{m.activeJobs || 0} in Bay</span>
              </div>

              <button
                onClick={() => handleOpenEdit(m)}
                className="px-3.5 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-bold border border-dark-700 transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Update Status</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Mechanic Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Master Technician"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Malhotra"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Contact Phone *</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 00015"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Account Email *</label>
              <input
                type="email"
                required
                placeholder="vikram.mechanic@autocare.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Years of Experience</label>
              <input
                type="number"
                min={0}
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">
              Specialization Categories (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Engine & Transmission, Brakes & Suspension"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Certifications</label>
            <input
              type="text"
              placeholder="e.g. ASE Certified Master Tech, Bosch Injection Certified"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-dark-800">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-dark-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-automotive-orange text-white font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition"
            >
              {submitting ? 'Creating...' : 'Register Technician'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Status Modal */}
      {selectedMechanic && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title={`Update Shift Status: ${selectedMechanic.user?.name}`}
          maxWidth="max-w-sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-300">Set the technician's current workshop availability:</p>
            <div className="grid grid-cols-3 gap-2">
              {['available', 'busy', 'on_leave'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateStatus(st)}
                  className={`p-3 rounded-xl border text-center capitalize font-bold transition ${
                    selectedMechanic.status === st
                      ? 'bg-automotive-orange text-white border-automotive-orange'
                      : 'bg-dark-850 border-dark-750 text-slate-300 hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MechanicManagement;
