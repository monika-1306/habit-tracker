const mongoose = require('mongoose');

const bossSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    hp: {
      type: Number,
      default: 1000
    },
    damage: {
      type: Number,
      default: 0
    },
    team: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Boss', bossSchema);