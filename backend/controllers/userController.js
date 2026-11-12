const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

// @desc    Get all users / customers (Admin)
// @route   GET /api/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, isActive } = req.query;
    let query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort('-createdAt');

    // Count vehicles for each user
    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const vehicleCount = await Vehicle.countDocuments({ owner: u._id, isActive: true });
        const bookingCount = await Booking.countDocuments({ customer: u._id });
        return {
          ...u.toObject(),
          vehicleCount,
          bookingCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithCounts.length,
      users: usersWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user with vehicles & bookings
// @route   GET /api/users/:id
// @access  Private (Admin)
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const vehicles = await Vehicle.find({ owner: user._id, isActive: true });
    const bookings = await Booking.find({ customer: user._id })
      .populate('vehicle')
      .populate('service')
      .populate('assignedMechanic', 'name phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      user,
      vehicles,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status (Admin)
// @route   PUT /api/users/:id/status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  toggleUserStatus,
};
