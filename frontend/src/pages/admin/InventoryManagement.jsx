import React, { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { useNotifications } from '../../hooks/useNotifications';
import Modal from '../../components/common/Modal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle,
} from 'lucide-react';

const InventoryManagement = () => {
  const [parts, setParts] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    partNumber: '',
    name: '',
    category: 'Filters & Fluids',
    costPrice: 500,
    sellingPrice: 850,
    stockQuantity: 20,
    minThreshold: 5,
    unit: 'pcs',
    location: 'Aisle 1 - Shelf A',
    supplier: 'OEM Automotive Distributors Ltd.',
  });

  const fetchParts = async () => {
    try {
      const data = await inventoryService.getInventoryParts({
        lowStock: lowStockFilter ? 'true' : undefined,
      });
      setParts(data.parts || []);
      setLowStockCount(data.lowStockCount || 0);
    } catch (err) {
      addToast('Failed to load inventory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, [lowStockFilter]);

  const handleOpenAdd = () => {
    setSelectedPart(null);
    setFormData({
      partNumber: '',
      name: '',
      category: 'Filters & Fluids',
      costPrice: 500,
      sellingPrice: 850,
      stockQuantity: 20,
      minThreshold: 5,
      unit: 'pcs',
      location: 'Aisle 1 - Shelf A',
      supplier: 'OEM Automotive Distributors Ltd.',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setSelectedPart(p);
    setFormData({
      partNumber: p.partNumber,
      name: p.name,
      category: p.category,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      stockQuantity: p.stockQuantity,
      minThreshold: p.minThreshold,
      unit: p.unit || 'pcs',
      location: p.location || 'Aisle 1',
      supplier: p.supplier || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partNumber || !formData.name || !formData.category) {
      addToast('Please fill out all required part details.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedPart) {
        await inventoryService.updatePart(selectedPart._id, formData);
        addToast('Spare part inventory updated.', 'success');
      } else {
        await inventoryService.addPart(formData);
        addToast('New spare part cataloged into inventory.', 'success');
      }
      setModalOpen(false);
      fetchParts();
    } catch (err) {
      addToast(err.response?.data?.message || 'Inventory operation failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPart) return;
    setSubmitting(true);
    try {
      await inventoryService.deletePart(selectedPart._id);
      addToast('Spare part removed from active inventory.', 'success');
      setDeleteModalOpen(false);
      fetchParts();
    } catch (err) {
      addToast('Failed to delete part.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'All',
    'Filters & Fluids',
    'Braking System',
    'Engine & Exhaust',
    'Electrical & Lighting',
    'Suspension & Steering',
    'Tires & Accessories',
    'Transmission',
  ];

  const filtered = parts.filter((p) => {
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    const s = searchQuery.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(s) ||
      p.partNumber.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s);
    return matchCat && matchSearch;
  });

  if (loading) {
    return <LoadingSpinner text="Connecting to workshop spare parts inventory..." />;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
            Spare Parts Inventory & Stock
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time stock valuation, OEM SKUs, bin locations, and minimum threshold alerts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-automotive-orange text-white font-extrabold text-xs shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Spare Part</span>
        </button>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-amber-300 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Threshold Alert:</strong> {lowStockCount} part(s) are at or below minimum
              operating quantities. Reordering recommended.
            </span>
          </div>
          <button
            onClick={() => setLowStockFilter(!lowStockFilter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
              lowStockFilter
                ? 'bg-amber-400 text-dark-950 font-black'
                : 'bg-dark-800 text-amber-300 border border-amber-500/40 hover:bg-dark-750'
            }`}
          >
            {lowStockFilter ? 'Showing Low Stock (Clear)' : 'Filter Low Stock Only'}
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search parts by name, SKU (e.g. OIL-SYN, BRK-PAD), or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-automotive-orange transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                categoryFilter === c
                  ? 'bg-automotive-orange text-white border-automotive-orange shadow-glow-orange'
                  : 'bg-dark-850 text-slate-400 border-dark-750 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl overflow-hidden shadow-automotive">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-850/60 text-slate-400 uppercase text-[10px]">
                <th className="py-3.5 px-4">Part Description</th>
                <th className="py-3.5 px-4">SKU / Number</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4 text-center">In Stock</th>
                <th className="py-3.5 px-4 text-right">Selling Price</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/80">
              {filtered.map((p) => {
                const isLow = p.stockQuantity <= p.minThreshold;
                return (
                  <tr key={p._id} className="hover:bg-dark-850/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white max-w-xs truncate">{p.name}</td>
                    <td className="py-3.5 px-4 font-mono text-automotive-orange font-bold">
                      {p.partNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{p.category}</td>
                    <td className="py-3.5 px-4 text-slate-400">{p.location || 'Bin A-1'}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          isLow
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                            : 'bg-dark-800 text-slate-200 border border-dark-750'
                        }`}
                      >
                        {p.stockQuantity} {p.unit || 'pcs'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-white">
                      {formatCurrency(p.sellingPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-300 hover:text-white transition"
                          title="Edit Stock"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPart(p);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-dark-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                          title="Deactivate SKU"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Part Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedPart ? 'Update Inventory SKU' : 'Catalog New Spare Part'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Part Number / SKU *</label>
              <input
                type="text"
                required
                disabled={!!selectedPart}
                placeholder="e.g. BRK-PAD-CER-01"
                value={formData.partNumber}
                onChange={(e) =>
                  setFormData({ ...formData, partNumber: e.target.value.toUpperCase() })
                }
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white uppercase focus:outline-none focus:border-automotive-orange disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              >
                <option value="Filters & Fluids">Filters & Fluids</option>
                <option value="Braking System">Braking System</option>
                <option value="Engine & Exhaust">Engine & Exhaust</option>
                <option value="Electrical & Lighting">Electrical & Lighting</option>
                <option value="Suspension & Steering">Suspension & Steering</option>
                <option value="Tires & Accessories">Tires & Accessories</option>
                <option value="Transmission">Transmission</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Part Name / Brand Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. Brembo Ceramic High-Performance Front Brake Pad Set"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Cost Price (₹)</label>
              <input
                type="number"
                min={0}
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Stock Quantity *</label>
              <input
                type="number"
                required
                min={0}
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Min Threshold</label>
              <input
                type="number"
                min={1}
                value={formData.minThreshold}
                onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Warehouse / Bay Location</label>
              <input
                type="text"
                placeholder="e.g. Aisle 3 - Shelf D"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">OEM Supplier Name</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>
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
              {submitting ? 'Saving...' : selectedPart ? 'Update Inventory' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Spare Part SKU"
        message={`Are you sure you want to deactivate SKU ${selectedPart?.partNumber} (${selectedPart?.name})?`}
        confirmText="Remove SKU"
        isDanger={true}
        isLoading={submitting}
      />
    </div>
  );
};

export default InventoryManagement;
