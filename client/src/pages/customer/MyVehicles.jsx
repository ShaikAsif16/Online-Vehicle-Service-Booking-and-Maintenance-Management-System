import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { useNotifications } from '../../hooks/useNotifications';
import Modal from '../../components/common/Modal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Car, Plus, Edit2, Trash2, Shield, Fuel, Gauge, Calendar, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    type: 'car',
    registrationNumber: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    fuelType: 'Petrol',
    mileage: 0,
    color: '',
    notes: '',
  });

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getMyVehicles();
      setVehicles(data.vehicles || []);
    } catch (err) {
      addToast('Failed to load registered vehicles.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenAdd = () => {
    setSelectedVehicle(null);
    setFormData({
      type: 'car',
      registrationNumber: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      fuelType: 'Petrol',
      mileage: 0,
      color: '',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      type: vehicle.type,
      registrationNumber: vehicle.registrationNumber,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      fuelType: vehicle.fuelType,
      mileage: vehicle.mileage,
      color: vehicle.color || '',
      notes: vehicle.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.registrationNumber || !formData.brand || !formData.model || !formData.year) {
      addToast('Please fill out all required vehicle details.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedVehicle) {
        await vehicleService.updateVehicle(selectedVehicle._id, formData);
        addToast('Vehicle details updated successfully.', 'success');
      } else {
        await vehicleService.addVehicle(formData);
        addToast('New vehicle registered to your account.', 'success');
      }
      setModalOpen(false);
      fetchVehicles();
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedVehicle) return;
    setSubmitting(true);
    try {
      await vehicleService.deleteVehicle(selectedVehicle._id);
      addToast('Vehicle deleted successfully.', 'success');
      setDeleteModalOpen(false);
      fetchVehicles();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete vehicle.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading your registered garage..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
            My Registered Vehicles
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your personal garage fleet across cars, motorcycles, and scooters.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-automotive-orange to-automotive-darkOrange text-white font-extrabold text-xs shadow-glow-orange hover:opacity-95 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Vehicle</span>
        </button>
      </div>

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-3xl p-8 space-y-4">
          <Car className="w-14 h-14 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Garage is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't registered any vehicles yet. Add your car, motorcycle, or scooter to book
            expert service appointments.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-automotive-orange text-white text-xs font-bold"
          >
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={v._id}
              className="bg-dark-900 border border-dark-800 hover:border-automotive-orange/40 rounded-3xl p-6 transition-all duration-300 shadow-automotive flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-dark-800 mb-4">
                  <span className="text-xs font-mono font-bold text-white bg-dark-850 px-2.5 py-1 rounded-lg border border-dark-750 uppercase tracking-wider">
                    {v.registrationNumber}
                  </span>
                  <span className="text-[11px] font-bold capitalize text-automotive-orange bg-automotive-orange/10 px-2.5 py-0.5 rounded-full border border-automotive-orange/20">
                    {v.type}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center text-automotive-orange text-xl">
                    {v.type === 'motorcycle' ? '🏍' : v.type === 'scooter' ? '🛵' : '🚗'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {v.brand} {v.model}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manufacture Year: <strong className="text-slate-300">{v.year}</strong>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4">
                  <div className="p-2.5 rounded-xl bg-dark-850 border border-dark-750/70 flex items-center gap-2">
                    <Fuel className="w-3.5 h-3.5 text-automotive-orange" />
                    <span>{v.fuelType}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-dark-850 border border-dark-750/70 flex items-center gap-2">
                    <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{v.mileage?.toLocaleString('en-IN') || 0} km</span>
                  </div>
                </div>

                {v.color && (
                  <p className="text-[11px] text-slate-400 mb-1">
                    Color: <span className="text-slate-300 font-medium">{v.color}</span>
                  </p>
                )}
                {v.notes && (
                  <p className="text-[11px] text-slate-400 italic line-clamp-2">"{v.notes}"</p>
                )}
              </div>

              <div className="pt-4 border-t border-dark-800 flex items-center justify-between mt-4">
                <Link
                  to={`/customer/book?vehicle=${v._id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-automotive-orange hover:bg-automotive-darkOrange text-white text-xs font-bold transition shadow-glow-orange flex items-center gap-1"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Book Service</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(v)}
                    className="p-2 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white transition"
                    title="Edit Vehicle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVehicle(v);
                      setDeleteModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-dark-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedVehicle ? 'Edit Vehicle Details' : 'Register Vehicle to Fleet'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Vehicle Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-automotive-orange capitalize"
              >
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="scooter">Scooter</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">
                Registration Number *
              </label>
              <input
                type="text"
                required
                disabled={!!selectedVehicle}
                placeholder="e.g. TS09EA1024"
                value={formData.registrationNumber}
                onChange={(e) =>
                  setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })
                }
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-4 py-2 text-xs text-white uppercase placeholder-slate-400 focus:outline-none focus:border-automotive-orange disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Brand / Make *</label>
              <input
                type="text"
                required
                placeholder="e.g. Honda, Yamaha, TVS, BMW"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Model *</label>
              <input
                type="text"
                required
                placeholder="e.g. Civic ZX, R15 V4, Jupiter"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Manufacture Year *</label>
              <input
                type="number"
                required
                min={1980}
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Fuel Type</label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-automotive-orange"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Odometer Mileage (km)</label>
              <input
                type="number"
                min={0}
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Exterior Color</label>
            <input
              type="text"
              placeholder="e.g. Meteoroid Grey Metallic"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full bg-dark-850 border border-dark-750 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Notes / Known Quirks</label>
            <textarea
              rows={2}
              placeholder="e.g. Slight cold start clutch sound, synthetic oil preferred..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-dark-850 border border-dark-750 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-dark-800 text-slate-300 text-xs font-bold hover:bg-dark-750"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl bg-automotive-orange text-white text-xs font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition"
            >
              {submitting ? 'Saving...' : selectedVehicle ? 'Update Vehicle' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to remove ${selectedVehicle?.brand} ${selectedVehicle?.model} (${selectedVehicle?.registrationNumber}) from your account?`}
        confirmText="Delete Vehicle"
        isDanger={true}
        isLoading={submitting}
      />
    </div>
  );
};

export default MyVehicles;
