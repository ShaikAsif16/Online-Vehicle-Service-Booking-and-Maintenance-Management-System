const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vehicle owner is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['supercar', 'hypercar', 'car', 'motorcycle', 'scooter'],
      required: [true, 'Vehicle type is required (supercar, hypercar, car, motorcycle, or scooter)'],
      default: 'supercar',
    },
    registrationNumber: {
      type: String,
      required: [true, 'Vehicle registration number is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand/Manufacturer is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Vehicle model name is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Manufacture year is required'],
      min: [1980, 'Year must be 1980 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      default: 'Petrol',
    },
    mileage: {
      type: Number,
      default: 0,
      min: [0, 'Mileage cannot be negative'],
    },
    color: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
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

module.exports = mongoose.model('Vehicle', vehicleSchema);
