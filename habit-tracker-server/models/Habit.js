const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  category: String,
  streak: { type: Number, default: 0 },
  lastCompleted: Date,
  completedDates: { type: [Date], default: [] }


});

module.exports = mongoose.model('Habit', habitSchema);