const express = require('express');
const { getBossStatus, dealDamage } = require('../controllers/bossController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Get current boss status (HP, damage, team)
router.get('/', protect, getBossStatus);

// ✅ Deal damage to the boss
router.post('/attack', protect, dealDamage);

module.exports = router;