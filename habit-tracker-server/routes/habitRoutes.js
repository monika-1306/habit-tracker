const express = require('express');
const {
  getHabits,
  createHabit,
  completeHabit
} = require('../controllers/habitControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Get all habits / Create a new habit
router.route('/')
  .get(protect, getHabits)
  .post(protect, createHabit);

// ✅ Complete a habit and update streak, XP, gear, calendar
router.post('/:id/complete', protect, completeHabit);

module.exports = router;