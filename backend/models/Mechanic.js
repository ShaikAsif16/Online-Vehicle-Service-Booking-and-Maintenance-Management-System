const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: [String],
      default: ['General Maintenance'],
    },
    experienceYears: {
      type: Number,
      default: 2,
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'busy', 'on_leave'],
      default: 'available',
    },
    currentWorkload: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    certifications: {
      type: [String],
      default: [],
    },
    emergencyContact: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Mechanic', mechanicSchema);
