const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
    },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, required: true },
        amount: { type: Number, required: true },
        type: {
          type: String,
          enum: ['labor', 'part', 'inspection', 'diagnostic', 'fee'],
          default: 'labor',
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    taxRate: {
      type: Number,
      default: 18, // 18% GST standard automotive service tax
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid', 'Refunded', 'Cancelled'],
      default: 'Unpaid',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Credit/Debit Card', 'UPI', 'Net Banking', 'Cash at Workshop', 'Simulated Gateway', 'None'],
      default: 'None',
    },
    paidAt: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: 'Thank you for choosing AutoCare Pro Workshop. Warranty valid for 30 days or 1,000 km.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
