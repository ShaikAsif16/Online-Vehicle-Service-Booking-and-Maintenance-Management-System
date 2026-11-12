const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// @desc    Get all vehicles belonging to the logged-in customer
// @route   GET /api/vehicles/my
// @access  Private (Customer)
const getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id, isActive: true }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new vehicle
// @route   POST /api/vehicles
// @access  Private (Customer/Admin)
const addVehicle = async (req, res, next) => {
  try {
    const {
      type,
      registrationNumber,
      brand,
      model,
      year,
      fuelType,
      mileage,
      color,
      notes,
    } = req.body;

    if (!registrationNumber || !brand || !model || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide registration number, brand, model, and year.',
      });
    }

    const regUpper = registrationNumber.trim().toUpperCase();
    const existing = await Vehicle.findOne({ registrationNumber: regUpper });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A vehicle with registration number ${regUpper} is already registered.`,
      });
    }

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      type: type || 'car',
      registrationNumber: regUpper,
      brand: brand.trim(),
      model: model.trim(),
      year: Number(year),
      fuelType: fuelType || 'Petrol',
      mileage: Number(mileage) || 0,
      color: color || '',
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully.',
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('owner', 'name email phone');
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Role check: customer can only view their own vehicle unless admin/mechanic
    if (
      req.user.role === 'customer' &&
      vehicle.owner._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this vehicle' });
    }

    res.status(200).json({ success: true, vehicle });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Owner / Admin)
const updateVehicle = async (req, res, next) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (
      req.user.role === 'customer' &&
      vehicle.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this vehicle' });
    }

    const { brand, model, year, fuelType, mileage, color, notes, type } = req.body;
    if (brand) vehicle.brand = brand.trim();
    if (model) vehicle.model = model.trim();
    if (year) vehicle.year = Number(year);
    if (fuelType) vehicle.fuelType = fuelType;
    if (mileage !== undefined) vehicle.mileage = Number(mileage);
    if (color !== undefined) vehicle.color = color;
    if (notes !== undefined) vehicle.notes = notes;
    if (type) vehicle.type = type;

    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle details updated successfully.',
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Owner / Admin)
const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (
      req.user.role === 'customer' &&
      vehicle.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this vehicle' });
    }

    // Check if vehicle has any active bookings
    const activeBooking = await Booking.findOne({
      vehicle: vehicle._id,
      status: { $in: ['Pending', 'Confirmed', 'Mechanic Assigned', 'In Progress', 'Waiting for Parts'] },
    });

    if (activeBooking) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete vehicle with active service bookings in progress.',
      });
    }

    vehicle.isActive = false;
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vehicles across system (Admin)
// @route   GET /api/vehicles
// @access  Private (Admin)
const getAllVehicles = async (req, res, next) => {
  try {
    const { search, type, fuelType } = req.query;
    let query = { isActive: true };

    if (type) query.type = type;
    if (fuelType) query.fuelType = fuelType;
    if (search) {
      query.$or = [
        { registrationNumber: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    const vehicles = await Vehicle.find(query)
      .populate('owner', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyVehicles,
  addVehicle,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getAllVehicles,
};
