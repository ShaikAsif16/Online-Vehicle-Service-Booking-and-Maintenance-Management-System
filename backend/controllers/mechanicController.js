const Mechanic = require('../models/Mechanic');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all mechanics with user details and current workload
// @route   GET /api/mechanics
// @access  Private (Admin)
const getAllMechanics = async (req, res, next) => {
  try {
    const mechanics = await Mechanic.find()
      .populate('user', 'name email phone avatar isActive createdAt')
      .sort('-createdAt');

    // Also get active booking counts for each mechanic
    const mechanicsWithStats = await Promise.all(
      mechanics.map(async (m) => {
        const activeJobs = await Booking.countDocuments({
          assignedMechanic: m.user ? m.user._id : null,
          status: { $in: ['Mechanic Assigned', 'In Progress', 'Waiting for Parts'] },
        });

        const completedJobs = await Booking.countDocuments({
          assignedMechanic: m.user ? m.user._id : null,
          status: 'Completed',
        });

        return {
          ...m.toObject(),
          activeJobs,
          completedJobs,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: mechanicsWithStats.length,
      mechanics: mechanicsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new mechanic (Admin)
// @route   POST /api/mechanics
// @access  Private (Admin)
const createMechanic = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      experienceYears,
      status,
      certifications,
    } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and phone number are required.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: 'mechanic',
    });

    const mechanic = await Mechanic.create({
      user: user._id,
      specialization: specialization || ['General Maintenance'],
      experienceYears: Number(experienceYears) || 2,
      status: status || 'available',
      certifications: certifications || ['Automotive Service Excellence (ASE) Certified'],
    });

    const populated = await Mechanic.findById(mechanic._id).populate('user', 'name email phone role');

    res.status(201).json({
      success: true,
      message: 'Mechanic account created successfully.',
      mechanic: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update mechanic status or details
// @route   PUT /api/mechanics/:id
// @access  Private (Admin / Mechanic)
const updateMechanic = async (req, res, next) => {
  try {
    const mechanic = await Mechanic.findById(req.params.id);
    if (!mechanic) {
      return res.status(404).json({ success: false, message: 'Mechanic not found' });
    }

    const { status, specialization, experienceYears, rating, certifications } = req.body;

    if (status) mechanic.status = status;
    if (specialization) mechanic.specialization = specialization;
    if (experienceYears !== undefined) mechanic.experienceYears = Number(experienceYears);
    if (rating !== undefined && req.user.role === 'admin') mechanic.rating = Number(rating);
    if (certifications) mechanic.certifications = certifications;

    await mechanic.save();

    const populated = await Mechanic.findById(mechanic._id).populate('user', 'name email phone avatar');

    res.status(200).json({
      success: true,
      message: 'Mechanic profile updated successfully.',
      mechanic: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current mechanic's own profile & assigned jobs summary
// @route   GET /api/mechanics/my-profile
// @access  Private (Mechanic)
const getMyMechanicProfile = async (req, res, next) => {
  try {
    const mechanic = await Mechanic.findOne({ user: req.user._id }).populate(
      'user',
      'name email phone avatar'
    );

    if (!mechanic) {
      return res.status(404).json({ success: false, message: 'Mechanic profile not found.' });
    }

    const activeCount = await Booking.countDocuments({
      assignedMechanic: req.user._id,
      status: { $in: ['Mechanic Assigned', 'In Progress', 'Waiting for Parts'] },
    });

    const completedCount = await Booking.countDocuments({
      assignedMechanic: req.user._id,
      status: 'Completed',
    });

    res.status(200).json({
      success: true,
      mechanic,
      stats: {
        activeJobs: activeCount,
        completedJobs: completedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMechanics,
  createMechanic,
  updateMechanic,
  getMyMechanicProfile,
};
