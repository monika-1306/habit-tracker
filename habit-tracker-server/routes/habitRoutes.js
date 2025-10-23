const express = require('express');
const { getHabits, createHabit, completeHabit } = require('../controllers/habitControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.route('/').get(protect, getHabits).post(protect, createHabit);
router.post('/:id/complete', protect, completeHabit);


module.exports = router;