const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      enum: [
        'General Maintenance',
        'Engine & Transmission',
        'Brakes & Suspension',
        'Electrical & Diagnostics',
        'Tires & Wheels',
        'AC & Climate Control',
        'Body & Detailing',
      ],
      required: [true, 'Service category is required'],
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Service base price is required'],
      min: [0, 'Base price cannot be negative'],
    },
    estimatedDurationMinutes: {
      type: Number,
      required: [true, 'Estimated duration in minutes is required'],
      min: [15, 'Estimated duration must be at least 15 minutes'],
    },
    applicableVehicleTypes: {
      type: [String],
      enum: ['car', 'motorcycle', 'scooter'],
      default: ['car', 'motorcycle', 'scooter'],
    },
    includedTasks: {
      type: [String],
      default: [],
    },
    icon: {
      type: String,
      default: 'Wrench',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
