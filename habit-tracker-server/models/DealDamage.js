const mongoose = require('mongoose');

const dealDamageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    damage: {
      type: Number,
      required: true,
      min: 1
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('DealDamage', dealDamageSchema);