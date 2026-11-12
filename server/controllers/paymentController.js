const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

// @desc    Process simulated payment for an invoice (Customer)
// @route   POST /api/payments/process-simulated
// @access  Private (Customer)
const processSimulatedPayment = async (req, res, next) => {
  try {
    const { invoiceId, paymentMethod, paymentDetails } = req.body;

    if (!invoiceId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide invoice ID and selected payment method.',
      });
    }

    const invoice = await Invoice.findById(invoiceId).populate('booking');
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    if (invoice.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to pay this invoice.' });
    }

    if (invoice.paymentStatus === 'Paid') {
      return res.status(400).json({ success: false, message: 'This invoice has already been paid.' });
    }

    // Generate unique simulated transaction ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const transactionId = `TXN-SIM-${dateStr}-${rand}`;

    const authCode = `SIM-AUTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const payment = await Payment.create({
      transactionId,
      invoice: invoice._id,
      booking: invoice.booking._id,
      customer: req.user._id,
      amount: invoice.totalAmount,
      currency: 'INR',
      paymentMethod,
      status: 'Successful',
      gatewayDetails: {
        gatewayName: 'Simulated Sandbox Gateway (Academic Evaluation Mode)',
        simulatedAuthCode: authCode,
        cardLast4: paymentDetails?.cardLast4 || '4242',
        upiId: paymentDetails?.upiId || '',
        bankName: paymentDetails?.bankName || '',
        receiptUrl: `/invoices/${invoice._id}`,
      },
      paidAt: new Date(),
    });

    // Update invoice status
    invoice.paymentStatus = 'Paid';
    invoice.paymentMethod = paymentMethod;
    invoice.paidAt = new Date();
    await invoice.save();

    // Create confirmation notification
    await Notification.create({
      recipient: req.user._id,
      title: 'Payment Successful (Simulated)',
      message: `Your payment of ₹${invoice.totalAmount.toLocaleString('en-IN')} for Invoice ${invoice.invoiceNumber} was processed successfully (Txn: ${transactionId}).`,
      type: 'payment',
      relatedId: invoice._id,
    });

    res.status(200).json({
      success: true,
      message: 'Simulated payment processed successfully.',
      payment,
      invoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private (Admin)
const getAllPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('customer', 'name email phone')
      .populate('invoice', 'invoiceNumber totalAmount')
      .populate({
        path: 'booking',
        populate: { path: 'vehicle' },
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single payment receipt
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('invoice')
      .populate('booking');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    if (
      req.user.role === 'customer' &&
      payment.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this receipt' });
    }

    res.status(200).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processSimulatedPayment,
  getAllPayments,
  getPaymentById,
};
