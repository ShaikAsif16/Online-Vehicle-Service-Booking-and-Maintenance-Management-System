const express = require('express');
const router = express.Router();
const {
  processSimulatedPayment,
  getAllPayments,
  getPaymentById,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/process-simulated', processSimulatedPayment);
router.get('/', authorize('admin'), getAllPayments);
router.get('/:id', getPaymentById);

module.exports = router;
