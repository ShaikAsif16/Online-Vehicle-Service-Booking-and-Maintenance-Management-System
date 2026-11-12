const ServiceRecord = require('../models/ServiceRecord');
const Vehicle = require('../models/Vehicle');

// @desc    Get customer's vehicle maintenance history
// @route   GET /api/maintenance/my
// @access  Private (Customer)
const getMyMaintenanceHistory = async (req, res, next) => {
  try {
    const { vehicleId } = req.query;
    let query = { customer: req.user._id };

    if (vehicleId) query.vehicle = vehicleId;

    const records = await ServiceRecord.find(query)
      .populate('vehicle')
      .populate('mechanic', 'name phone email')
      .populate('booking')
      .sort('-serviceDate');

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get maintenance history for a specific vehicle (Admin / Mechanic)
// @route   GET /api/maintenance/vehicle/:vehicleId
// @access  Private
const getVehicleMaintenanceHistory = async (req, res, next) => {
  try {
    const records = await ServiceRecord.find({ vehicle: req.params.vehicleId })
      .populate('vehicle')
      .populate('mechanic', 'name phone email')
      .populate('booking')
      .sort('-serviceDate');

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyMaintenanceHistory,
  getVehicleMaintenanceHistory,
};
