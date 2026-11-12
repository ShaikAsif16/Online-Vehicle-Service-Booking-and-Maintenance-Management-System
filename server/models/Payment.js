const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentMethod: {
      type: String,
      enum: ['Credit/Debit Card', 'UPI', 'Net Banking', 'Cash at Workshop', 'Simulated Gateway'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Successful', 'Failed', 'Refunded'],
      default: 'Successful',
    },
    gatewayDetails: {
      gatewayName: { type: String, default: 'Simulated Sandbox Gateway (Academic Evaluation)' },
      simulatedAuthCode: { type: String, default: '' },
      cardLast4: { type: String, default: '' },
      upiId: { type: String, default: '' },
      bankName: { type: String, default: '' },
      receiptUrl: { type: String, default: '' },
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
