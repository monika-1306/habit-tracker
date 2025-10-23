const mongoose = require('mongoose');

const dealDamageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  damage: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DealDamage', dealDamageSchema);