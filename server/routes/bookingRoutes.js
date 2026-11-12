const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public or protected route for checking slot availability
router.get('/available-slots', getAvailableSlots);

// Protected routes
router.use(protect);

// Customer routes
router.post('/', createBooking);
router.get('/my', getMyBookings);
router.put('/:id/cancel', cancelBooking);

// Mechanic routes
router.get('/mechanic/assigned', authorize('mechanic', 'admin'), getMechanicAssignedJobs);
router.put('/:id/progress', authorize('mechanic', 'admin'), updateServiceProgress);

// Admin routes
router.get('/', authorize('admin'), getAllBookings);
router.put('/:id/approval', authorize('admin'), updateBookingApproval);
router.put('/:id/assign-mechanic', authorize('admin'), assignMechanic);

// General route by ID (with role checks inside controller)
router.get('/:id', getBookingById);

module.exports = router;
