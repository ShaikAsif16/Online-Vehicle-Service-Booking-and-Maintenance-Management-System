const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer reference is required'],
      index: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle reference is required'],
      index: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service reference is required'],
    },
    bookingDate: {
      type: String, // Stored as ISO YYYY-MM-DD for straightforward slot conflict lookup
      required: [true, 'Appointment date is required'],
      index: true,
    },
    timeSlot: {
      type: String,
      required: [true, 'Appointment time slot is required'],
      index: true,
    },
    complaints: {
      type: String,
      default: '',
      trim: true,
    },
    additionalInstructions: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Rejected',
        'Mechanic Assigned',
        'In Progress',
        'Waiting for Parts',
        'Completed',
        'Cancelled',
      ],
      default: 'Pending',
      index: true,
    },
    assignedMechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    estimatedCost: {
      type: Number,
      required: true,
      default: 0,
    },
    laborCost: {
      type: Number,
      default: 0,
    },
    partsCost: {
      type: Number,
      default: 0,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    estimatedCompletionDate: {
      type: Date,
      default: null,
    },
    actualCompletionDate: {
      type: Date,
      default: null,
    },
    diagnosis: {
      type: String,
      default: '',
    },
    repairNotes: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    partsUsed: [
      {
        part: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'SparePart',
        },
        partName: String,
        partNumber: String,
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        unitPrice: {
          type: Number,
          default: 0,
        },
        totalPrice: {
          type: Number,
          default: 0,
        },
      },
    ],
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        note: {
          type: String,
          default: '',
        },
      },
    ],
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to help double booking checks
bookingSchema.index({ vehicle: 1, bookingDate: 1, timeSlot: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
