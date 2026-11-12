const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
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
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    serviceName: {
      type: String,
      required: true,
    },
    serviceDate: {
      type: Date,
      default: Date.now,
    },
    mileageAtService: {
      type: Number,
      default: 0,
    },
    diagnosis: {
      type: String,
      default: '',
    },
    repairNotes: {
      type: String,
      default: '',
    },
    partsReplaced: [
      {
        partName: String,
        partNumber: String,
        quantity: Number,
        price: Number,
      },
    ],
    laborCost: {
      type: Number,
      default: 0,
    },
    partsCost: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    nextServiceRecommendedDate: {
      type: Date,
    },
    nextServiceMileage: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
