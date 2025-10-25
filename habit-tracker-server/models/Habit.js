const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      default: 'General'
    },
    streak: {
      type: Number,
      default: 0
    },
    lastCompleted: {
      type: Date
    },
    completedDates: {
      type: [Date],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Habit', habitSchema);