const mongoose = require('mongoose');

const sparePartSchema = new mongoose.Schema(
  {
    partNumber: {
      type: String,
      required: [true, 'Part number/SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Part name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Filters & Fluids',
        'Braking System',
        'Engine & Exhaust',
        'Electrical & Lighting',
        'Suspension & Steering',
        'Tires & Accessories',
        'Transmission',
      ],
      required: true,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },
    minThreshold: {
      type: Number,
      default: 5,
    },
    unit: {
      type: String,
      default: 'pcs',
    },
    compatibleVehicleTypes: {
      type: [String],
      enum: ['car', 'motorcycle', 'scooter'],
      default: ['car', 'motorcycle', 'scooter'],
    },
    location: {
      type: String,
      default: 'Bin-A1',
    },
    supplier: {
      type: String,
      default: 'OEM Parts Distribution Ltd.',
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

module.exports = mongoose.model('SparePart', sparePartSchema);
