const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Service = require('../models/Service');
const User = require('../models/User');
const Mechanic = require('../models/Mechanic');
const SparePart = require('../models/SparePart');
const Invoice = require('../models/Invoice');
const ServiceRecord = require('../models/ServiceRecord');
const Notification = require('../models/Notification');

// Helper to generate reference code
const generateBookingReference = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `BK-${dateStr}-${randomStr}`;
};

// Available time slots in workshop
const AVAILABLE_TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
];

// @desc    Get available time slots for a given date
// @route   GET /api/bookings/available-slots
// @access  Public / Private
const getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date query parameter is required (YYYY-MM-DD)' });
    }

    // Capacity per slot is 3 workshop bays
    const MAX_CAPACITY_PER_SLOT = 3;

    const existingBookings = await Booking.find({
      bookingDate: date,
      status: { $nin: ['Cancelled', 'Rejected'] },
    });

    const slotCounts = {};
    AVAILABLE_TIME_SLOTS.forEach((slot) => {
      slotCounts[slot] = 0;
    });

    existingBookings.forEach((b) => {
      if (slotCounts[b.timeSlot] !== undefined) {
        slotCounts[b.timeSlot] += 1;
      }
    });

    const slots = AVAILABLE_TIME_SLOTS.map((slot) => {
      const bookedCount = slotCounts[slot] || 0;
      return {
        slot,
        bookedCount,
        available: bookedCount < MAX_CAPACITY_PER_SLOT,
        remainingBays: Math.max(0, MAX_CAPACITY_PER_SLOT - bookedCount),
      };
    });

    res.status(200).json({
      success: true,
      date,
      slots,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new booking (Customer)
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = async (req, res, next) => {
  try {
    const {
      vehicleId,
      serviceId,
      bookingDate,
      timeSlot,
      complaints,
      additionalInstructions,
    } = req.body;

    if (!vehicleId || !serviceId || !bookingDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicle, service, appointment date, and time slot.',
      });
    }

    // 1. Verify vehicle belongs to user
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      owner: req.user._id,
      isActive: true,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Selected vehicle not found or does not belong to your account.',
      });
    }

    // 2. Verify service
    const service = await Service.findOne({ _id: serviceId, isActive: true });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Selected service package is not active or available.',
      });
    }

    // 3. Double booking prevention: Check if same vehicle already has active booking on that date & slot
    const duplicateVehicleBooking = await Booking.findOne({
      vehicle: vehicleId,
      bookingDate,
      timeSlot,
      status: { $nin: ['Cancelled', 'Rejected'] },
    });

    if (duplicateVehicleBooking) {
      return res.status(400).json({
        success: false,
        message: `This vehicle already has an appointment booked for ${bookingDate} at ${timeSlot}.`,
      });
    }

    // Check workshop capacity for this slot
    const slotBookingsCount = await Booking.countDocuments({
      bookingDate,
      timeSlot,
      status: { $nin: ['Cancelled', 'Rejected'] },
    });

    if (slotBookingsCount >= 3) {
      return res.status(400).json({
        success: false,
        message: `All service bays are fully booked for ${bookingDate} at ${timeSlot}. Please select another time slot.`,
      });
    }

    // 4. Generate reference & create booking
    const bookingReference = generateBookingReference();

    const booking = await Booking.create({
      bookingReference,
      customer: req.user._id,
      vehicle: vehicleId,
      service: serviceId,
      bookingDate,
      timeSlot,
      complaints: complaints || '',
      additionalInstructions: additionalInstructions || '',
      status: 'Pending',
      estimatedCost: service.basePrice,
      laborCost: service.basePrice,
      totalCost: service.basePrice,
      statusHistory: [
        {
          status: 'Pending',
          changedAt: new Date(),
          changedBy: req.user._id,
          note: 'Booking requested by customer.',
        },
      ],
    });

    // Notify customer
    await Notification.create({
      recipient: req.user._id,
      title: 'Booking Request Received',
      message: `Your appointment request ${bookingReference} for ${vehicle.brand} ${vehicle.model} on ${bookingDate} (${timeSlot}) is pending workshop confirmation.`,
      type: 'booking',
      relatedId: booking._id,
    });

    const populated = await Booking.findById(booking._id)
      .populate('vehicle')
      .populate('service');

    res.status(201).json({
      success: true,
      message: 'Service appointment booked successfully!',
      booking: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer's bookings
// @route   GET /api/bookings/my
// @access  Private (Customer)
const getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = { customer: req.user._id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('vehicle')
      .populate('service')
      .populate('assignedMechanic', 'name phone email')
      .populate('invoice')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('vehicle')
      .populate('service')
      .populate('assignedMechanic', 'name phone email')
      .populate('partsUsed.part')
      .populate('invoice')
      .populate('statusHistory.changedBy', 'name role');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Role check: customer can only view their own
    if (
      req.user.role === 'customer' &&
      booking.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    // If mechanic, can only view if assigned to them or unassigned
    if (
      req.user.role === 'mechanic' &&
      booking.assignedMechanic &&
      booking.assignedMechanic._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this job.' });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking (Customer)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer)
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('vehicle');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    // Can only cancel if Pending or Confirmed
    if (!['Pending', 'Confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Booking cannot be cancelled once it is in '${booking.status}' status.`,
      });
    }

    booking.status = 'Cancelled';
    booking.cancellationReason = reason || 'Cancelled by customer';
    booking.statusHistory.push({
      status: 'Cancelled',
      changedAt: new Date(),
      changedBy: req.user._id,
      note: reason || 'Booking cancelled by customer',
    });

    await booking.save();

    await Notification.create({
      recipient: req.user._id,
      title: 'Booking Cancelled',
      message: `Your booking ${booking.bookingReference} has been cancelled.`,
      type: 'booking',
      relatedId: booking._id,
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
const getAllBookings = async (req, res, next) => {
  try {
    const { status, date, mechanicId, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (date) query.bookingDate = date;
    if (mechanicId) query.assignedMechanic = mechanicId;

    let bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate('vehicle')
      .populate('service')
      .populate('assignedMechanic', 'name phone email')
      .populate('invoice')
      .sort('-createdAt');

    if (search) {
      const s = search.toLowerCase();
      bookings = bookings.filter((b) => {
        return (
          b.bookingReference.toLowerCase().includes(s) ||
          (b.customer && b.customer.name.toLowerCase().includes(s)) ||
          (b.vehicle && b.vehicle.registrationNumber.toLowerCase().includes(s)) ||
          (b.vehicle && b.vehicle.brand.toLowerCase().includes(s))
        );
      });
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject booking (Admin)
// @route   PUT /api/bookings/:id/approval
// @access  Private (Admin)
const updateBookingApproval = async (req, res, next) => {
  try {
    const { action, reason } = req.body; // action: 'approve' or 'reject'
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('vehicle');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Only bookings with 'Pending' status can be approved or rejected. Current status is '${booking.status}'.`,
      });
    }

    if (action === 'approve') {
      booking.status = 'Confirmed';
      booking.statusHistory.push({
        status: 'Confirmed',
        changedAt: new Date(),
        changedBy: req.user._id,
        note: 'Booking confirmed by service manager.',
      });

      await Notification.create({
        recipient: booking.customer._id,
        title: 'Booking Confirmed!',
        message: `Your service appointment ${booking.bookingReference} for ${booking.vehicle.brand} ${booking.vehicle.model} on ${booking.bookingDate} has been confirmed.`,
        type: 'booking',
        relatedId: booking._id,
      });
    } else if (action === 'reject') {
      booking.status = 'Rejected';
      booking.rejectionReason = reason || 'Declined by service center.';
      booking.statusHistory.push({
        status: 'Rejected',
        changedAt: new Date(),
        changedBy: req.user._id,
        note: reason || 'Booking rejected by service manager.',
      });

      await Notification.create({
        recipient: booking.customer._id,
        title: 'Booking Update: Declined',
        message: `Your booking request ${booking.bookingReference} could not be confirmed. Reason: ${reason || 'Schedule capacity exceeded.'}`,
        type: 'booking',
        relatedId: booking._id,
      });
    } else {
      return res.status(400).json({ success: false, message: "Action must be 'approve' or 'reject'" });
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking has been ${action === 'approve' ? 'confirmed' : 'rejected'}.`,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign mechanic to booking (Admin)
// @route   PUT /api/bookings/:id/assign-mechanic
// @access  Private (Admin)
const assignMechanic = async (req, res, next) => {
  try {
    const { mechanicId } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('customer')
      .populate('vehicle')
      .populate('service');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (['Completed', 'Cancelled', 'Rejected'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot assign mechanic to a booking with status '${booking.status}'.`,
      });
    }

    const mechanicUser = await User.findOne({ _id: mechanicId, role: 'mechanic', isActive: true });
    if (!mechanicUser) {
      return res.status(404).json({ success: false, message: 'Mechanic not found or inactive.' });
    }

    // Previous mechanic workload decrement if reassigning
    if (booking.assignedMechanic && booking.assignedMechanic.toString() !== mechanicId) {
      await Mechanic.findOneAndUpdate(
        { user: booking.assignedMechanic },
        { $inc: { currentWorkload: -1 } }
      );
    }

    // New mechanic workload increment
    await Mechanic.findOneAndUpdate(
      { user: mechanicId },
      { $inc: { currentWorkload: 1 } },
      { upsert: true }
    );

    booking.assignedMechanic = mechanicId;
    booking.status = 'Mechanic Assigned';
    booking.statusHistory.push({
      status: 'Mechanic Assigned',
      changedAt: new Date(),
      changedBy: req.user._id,
      note: `Mechanic ${mechanicUser.name} assigned to this service order.`,
    });

    await booking.save();

    // Notify customer
    await Notification.create({
      recipient: booking.customer._id,
      title: 'Mechanic Assigned',
      message: `Lead technician ${mechanicUser.name} has been assigned to your vehicle ${booking.vehicle.registrationNumber}.`,
      type: 'mechanic_assigned',
      relatedId: booking._id,
    });

    // Notify mechanic
    await Notification.create({
      recipient: mechanicUser._id,
      title: 'New Service Job Assigned',
      message: `You have been assigned job ${booking.bookingReference} for ${booking.vehicle.brand} ${booking.vehicle.model} (${booking.service.name}).`,
      type: 'service_update',
      relatedId: booking._id,
    });

    res.status(200).json({
      success: true,
      message: `Mechanic ${mechanicUser.name} assigned successfully.`,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs assigned to current mechanic
// @route   GET /api/bookings/mechanic/assigned
// @access  Private (Mechanic)
const getMechanicAssignedJobs = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = { assignedMechanic: req.user._id };

    if (status) {
      query.status = status;
    }

    const jobs = await Booking.find(query)
      .populate('customer', 'name email phone address')
      .populate('vehicle')
      .populate('service')
      .populate('partsUsed.part')
      .sort('-updatedAt');

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mechanic updates service progress & details
// @route   PUT /api/bookings/:id/progress
// @access  Private (Mechanic / Admin)
const updateServiceProgress = async (req, res, next) => {
  try {
    const {
      status, // 'In Progress', 'Waiting for Parts', 'Completed'
      diagnosis,
      repairNotes,
      estimatedCompletionDate,
      partsUsed, // array of { partId, quantity }
      laborCost,
    } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate('customer')
      .populate('vehicle')
      .populate('service');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // If mechanic, verify assignment
    if (
      req.user.role === 'mechanic' &&
      (!booking.assignedMechanic || booking.assignedMechanic.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this service job.' });
    }

    if (diagnosis !== undefined) booking.diagnosis = diagnosis;
    if (repairNotes !== undefined) booking.repairNotes = repairNotes;
    if (estimatedCompletionDate) booking.estimatedCompletionDate = new Date(estimatedCompletionDate);
    if (laborCost !== undefined) {
      booking.laborCost = Number(laborCost);
    }

    // Process parts used
    if (Array.isArray(partsUsed) && partsUsed.length > 0) {
      let partsCostTotal = 0;
      const formattedParts = [];

      for (const item of partsUsed) {
        const part = await SparePart.findById(item.partId);
        if (!part) {
          return res.status(404).json({ success: false, message: `Part with ID ${item.partId} not found` });
        }
        const qty = Number(item.quantity) || 1;
        if (part.stockQuantity < qty) {
          return res.status(400).json({
            success: false,
            message: `Insufficient inventory for part '${part.name}'. Available: ${part.stockQuantity}, Requested: ${qty}`,
          });
        }

        // Deduct inventory stock
        part.stockQuantity -= qty;
        await part.save();

        const itemTotal = part.sellingPrice * qty;
        partsCostTotal += itemTotal;

        formattedParts.push({
          part: part._id,
          partName: part.name,
          partNumber: part.partNumber,
          quantity: qty,
          unitPrice: part.sellingPrice,
          totalPrice: itemTotal,
        });
      }

      booking.partsUsed = formattedParts;
      booking.partsCost = partsCostTotal;
    }

    // Recompute total cost
    booking.totalCost = (booking.laborCost || booking.service.basePrice) + (booking.partsCost || 0);

    // Status transition validation
    if (status && status !== booking.status) {
      const allowedTransitions = ['In Progress', 'Waiting for Parts', 'Completed'];
      if (!allowedTransitions.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Mechanic can only transition job to: ${allowedTransitions.join(', ')}`,
        });
      }

      booking.status = status;
      booking.statusHistory.push({
        status,
        changedAt: new Date(),
        changedBy: req.user._id,
        note: repairNotes || `Service status updated to ${status} by ${req.user.name}`,
      });

      // If marked Completed:
      if (status === 'Completed') {
        booking.actualCompletionDate = new Date();

        // Decrement mechanic workload
        if (booking.assignedMechanic) {
          await Mechanic.findOneAndUpdate(
            { user: booking.assignedMechanic },
            { $inc: { currentWorkload: -1 } }
          );
        }

        // 1. Generate Invoice automatically
        const invoiceNumber = `INV-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
        const invoiceItems = [
          {
            description: `Labor & Base Service: ${booking.service.name}`,
            quantity: 1,
            unitPrice: booking.laborCost || booking.service.basePrice,
            amount: booking.laborCost || booking.service.basePrice,
            type: 'labor',
          },
        ];

        if (booking.partsUsed && booking.partsUsed.length > 0) {
          booking.partsUsed.forEach((p) => {
            invoiceItems.push({
              description: `Part: ${p.partName} (${p.partNumber})`,
              quantity: p.quantity,
              unitPrice: p.unitPrice,
              amount: p.totalPrice,
              type: 'part',
            });
          });
        }

        const subtotal = invoiceItems.reduce((acc, curr) => acc + curr.amount, 0);
        const taxRate = 18;
        const taxAmount = Math.round((subtotal * taxRate) / 100);
        const totalAmount = subtotal + taxAmount;

        const invoice = await Invoice.create({
          invoiceNumber,
          booking: booking._id,
          customer: booking.customer._id,
          vehicle: booking.vehicle._id,
          items: invoiceItems,
          subtotal,
          taxRate,
          taxAmount,
          totalAmount,
          paymentStatus: 'Unpaid',
        });

        booking.invoice = invoice._id;

        // 2. Create ServiceRecord in Maintenance History
        await ServiceRecord.create({
          vehicle: booking.vehicle._id,
          booking: booking._id,
          customer: booking.customer._id,
          mechanic: req.user._id,
          serviceName: booking.service.name,
          mileageAtService: booking.vehicle.mileage || 0,
          diagnosis: booking.diagnosis,
          repairNotes: booking.repairNotes,
          partsReplaced: booking.partsUsed.map((p) => ({
            partName: p.partName,
            partNumber: p.partNumber,
            quantity: p.quantity,
            price: p.unitPrice,
          })),
          laborCost: booking.laborCost || booking.service.basePrice,
          partsCost: booking.partsCost || 0,
          totalAmount,
          nextServiceRecommendedDate: new Date(+new Date() + 90 * 24 * 60 * 60 * 1000), // 3 months
          nextServiceMileage: (booking.vehicle.mileage || 0) + 5000,
        });

        // 3. Notify customer
        await Notification.create({
          recipient: booking.customer._id,
          title: 'Service Complete & Vehicle Ready!',
          message: `Good news! Your vehicle ${booking.vehicle.brand} ${booking.vehicle.model} (${booking.vehicle.registrationNumber}) has been serviced and inspected. Invoice ${invoiceNumber} is ready for payment.`,
          type: 'service_update',
          relatedId: booking._id,
        });
      } else {
        // Normal progress update notification
        await Notification.create({
          recipient: booking.customer._id,
          title: `Service Update: ${status}`,
          message: `Your vehicle service ${booking.bookingReference} is now ${status}. Notes: ${repairNotes || 'Work is proceeding.'}`,
          type: 'service_update',
          relatedId: booking._id,
        });
      }
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate('vehicle')
      .populate('service')
      .populate('assignedMechanic', 'name phone email')
      .populate('partsUsed.part')
      .populate('invoice');

    res.status(200).json({
      success: true,
      message: 'Service details and progress updated successfully.',
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableSlots,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingApproval,
  assignMechanic,
  getMechanicAssignedJobs,
  updateServiceProgress,
};
