const express = require('express');
const router = express.Router();
const {
  getMyInvoices,
  getInvoiceById,
  getAllInvoices,
  updateInvoiceStatus,
} = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/my', getMyInvoices);
router.get('/', authorize('admin'), getAllInvoices);
router.get('/:id', getInvoiceById);
router.put('/:id/status', authorize('admin'), updateInvoiceStatus);

module.exports = router;
