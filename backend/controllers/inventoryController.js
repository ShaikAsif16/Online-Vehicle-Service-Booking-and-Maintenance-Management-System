const SparePart = require('../models/SparePart');

// @desc    Get all spare parts (Admin & Mechanic)
// @route   GET /api/inventory
// @access  Private (Admin, Mechanic)
const getInventoryParts = async (req, res, next) => {
  try {
    const { category, search, lowStock } = req.query;
    let query = { isActive: true };

    if (category) query.category = category;
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$stockQuantity', '$minThreshold'] };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { partNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const parts = await SparePart.find(query).sort('name');

    const lowStockCount = await SparePart.countDocuments({
      isActive: true,
      $expr: { $lte: ['$stockQuantity', '$minThreshold'] },
    });

    res.status(200).json({
      success: true,
      count: parts.length,
      lowStockCount,
      parts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new spare part (Admin)
// @route   POST /api/inventory
// @access  Private (Admin)
const addPart = async (req, res, next) => {
  try {
    const {
      partNumber,
      name,
      category,
      costPrice,
      sellingPrice,
      stockQuantity,
      minThreshold,
      unit,
      compatibleVehicleTypes,
      location,
      supplier,
    } = req.body;

    if (!partNumber || !name || !category || costPrice === undefined || sellingPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide part number, name, category, cost price, and selling price.',
      });
    }

    const existing = await SparePart.findOne({ partNumber: partNumber.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Part with SKU/Number ${partNumber} already exists in inventory.`,
      });
    }

    const part = await SparePart.create({
      partNumber: partNumber.trim().toUpperCase(),
      name: name.trim(),
      category,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      stockQuantity: Number(stockQuantity) || 0,
      minThreshold: Number(minThreshold) || 5,
      unit: unit || 'pcs',
      compatibleVehicleTypes: compatibleVehicleTypes || ['car', 'motorcycle', 'scooter'],
      location: location || 'Bin-A1',
      supplier: supplier || 'OEM Parts Distribution Ltd.',
    });

    res.status(201).json({
      success: true,
      message: 'Spare part added to inventory.',
      part,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update spare part / adjust stock
// @route   PUT /api/inventory/:id
// @access  Private (Admin, Mechanic can adjust stock)
const updatePart = async (req, res, next) => {
  try {
    const part = await SparePart.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ success: false, message: 'Spare part not found' });
    }

    const {
      name,
      category,
      costPrice,
      sellingPrice,
      stockQuantity,
      minThreshold,
      unit,
      compatibleVehicleTypes,
      location,
      supplier,
    } = req.body;

    if (name) part.name = name.trim();
    if (category) part.category = category;
    if (costPrice !== undefined) part.costPrice = Number(costPrice);
    if (sellingPrice !== undefined) part.sellingPrice = Number(sellingPrice);
    if (stockQuantity !== undefined) part.stockQuantity = Number(stockQuantity);
    if (minThreshold !== undefined) part.minThreshold = Number(minThreshold);
    if (unit) part.unit = unit;
    if (compatibleVehicleTypes) part.compatibleVehicleTypes = compatibleVehicleTypes;
    if (location) part.location = location;
    if (supplier) part.supplier = supplier;

    await part.save();

    res.status(200).json({
      success: true,
      message: 'Spare part inventory updated successfully.',
      part,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete spare part (Admin)
// @route   DELETE /api/inventory/:id
// @access  Private (Admin)
const deletePart = async (req, res, next) => {
  try {
    const part = await SparePart.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ success: false, message: 'Spare part not found' });
    }

    part.isActive = false;
    await part.save();

    res.status(200).json({
      success: true,
      message: 'Spare part removed from active inventory.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInventoryParts,
  addPart,
  updatePart,
  deletePart,
};
