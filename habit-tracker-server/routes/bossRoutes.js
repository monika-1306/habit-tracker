const express = require('express');
const { getBossStatus, dealDamage } = require('../controllers/bossController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', protect, getBossStatus);
router.post('/attack', protect, dealDamage);

module.exports = router;