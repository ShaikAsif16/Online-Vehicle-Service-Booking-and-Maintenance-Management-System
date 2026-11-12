const Service = require('../models/Service');

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res, next) => {
  try {
    const { category, vehicleType, search } = req.query;
    let query = { isActive: true };

    if (category) query.category = category;
    if (vehicleType) query.applicableVehicleTypes = vehicleType;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await Service.find(query).sort('category name');
    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service (Admin)
// @route   POST /api/services
// @access  Private (Admin)
const createService = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      basePrice,
      estimatedDurationMinutes,
      applicableVehicleTypes,
      includedTasks,
      icon,
    } = req.body;

    if (!name || !category || !description || basePrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, category, description, and base price.',
      });
    }

    const service = await Service.create({
      name,
      category,
      description,
      basePrice: Number(basePrice),
      estimatedDurationMinutes: Number(estimatedDurationMinutes) || 60,
      applicableVehicleTypes: applicableVehicleTypes || ['car', 'motorcycle', 'scooter'],
      includedTasks: Array.isArray(includedTasks) ? includedTasks : [],
      icon: icon || 'Wrench',
    });

    res.status(201).json({
      success: true,
      message: 'Service package created successfully.',
      service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service (Admin)
// @route   PUT /api/services/:id
// @access  Private (Admin)
const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const {
      name,
      category,
      description,
      basePrice,
      estimatedDurationMinutes,
      applicableVehicleTypes,
      includedTasks,
      icon,
      isActive,
    } = req.body;

    if (name) service.name = name;
    if (category) service.category = category;
    if (description) service.description = description;
    if (basePrice !== undefined) service.basePrice = Number(basePrice);
    if (estimatedDurationMinutes !== undefined)
      service.estimatedDurationMinutes = Number(estimatedDurationMinutes);
    if (applicableVehicleTypes) service.applicableVehicleTypes = applicableVehicleTypes;
    if (includedTasks) service.includedTasks = includedTasks;
    if (icon) service.icon = icon;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service (soft delete or toggle status)
// @route   DELETE /api/services/:id
// @access  Private (Admin)
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    service.isActive = false;
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service deactivated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
