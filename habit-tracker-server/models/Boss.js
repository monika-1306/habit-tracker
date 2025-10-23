const mongoose = require('mongoose');

const bossSchema = new mongoose.Schema({
  name: String,
  hp: Number,
  damage: Number,
  team: [String]
});

module.exports = mongoose.model('Boss', bossSchema);