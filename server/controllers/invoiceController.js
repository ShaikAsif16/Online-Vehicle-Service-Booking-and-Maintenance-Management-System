const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get customer's invoices
// @route   GET /api/invoices/my
// @access  Private (Customer)
const getMyInvoices = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = { customer: req.user._id };

    if (status) query.paymentStatus = status;

    const invoices = await Invoice.find(query)
      .populate('vehicle')
      .populate({
        path: 'booking',
        populate: { path: 'service' },
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('vehicle')
      .populate({
        path: 'booking',
        populate: [
          { path: 'service' },
          { path: 'assignedMechanic', select: 'name email phone' },
        ],
      });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (
      req.user.role === 'customer' &&
      invoice.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this invoice' });
    }

    res.status(200).json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all invoices (Admin)
// @route   GET /api/invoices
// @access  Private (Admin)
const getAllInvoices = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) query.paymentStatus = status;

    let invoices = await Invoice.find(query)
      .populate('customer', 'name email phone')
      .populate('vehicle')
      .populate({
        path: 'booking',
        populate: { path: 'service' },
      })
      .sort('-createdAt');

    if (search) {
      const s = search.toLowerCase();
      invoices = invoices.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(s) ||
          (inv.customer && inv.customer.name.toLowerCase().includes(s)) ||
          (inv.vehicle && inv.vehicle.registrationNumber.toLowerCase().includes(s))
      );
    }

    res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update invoice status manually (Admin)
// @route   PUT /api/invoices/:id/status
// @access  Private (Admin)
const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    if (paymentStatus) invoice.paymentStatus = paymentStatus;
    if (paymentMethod) invoice.paymentMethod = paymentMethod;

    if (paymentStatus === 'Paid' && !invoice.paidAt) {
      invoice.paidAt = new Date();
    }

    await invoice.save();

    res.status(200).json({
      success: true,
      message: 'Invoice status updated successfully.',
      invoice,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyInvoices,
  getInvoiceById,
  getAllInvoices,
  updateInvoiceStatus,
};
