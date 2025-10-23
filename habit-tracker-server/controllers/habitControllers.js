const Habit = require('../models/Habit');
const User = require('../models/User');

// Get all habits for the logged-in user
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new habit with optional category
const createHabit = async (req, res) => {
  try {
    const { title, category } = req.body;

    const habit = new Habit({
      user: req.user._id,
      title,
      category,
      streak: 0,
      completedDates: []
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Complete a habit and update streak, XP, gear, and calendar
const completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    const user = await User.findById(req.user._id);

    if (!habit || !user) {
      return res.status(404).json({ error: 'Habit or user not found' });
    }

    const today = new Date().toDateString();
    const last = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;

    // Streak logic
    if (last === today) {
      return res.status(400).json({ error: 'Habit already completed today' });
    } else if (last === new Date(Date.now() - 86400000).toDateString()) {
      habit.streak += 1; // continued streak
    } else {
      habit.streak = 1; // reset streak
    }

    habit.lastCompleted = new Date();
    habit.completedDates.push(new Date()); // ✅ calendar tracking

    // XP logic
    user.xp += 10;
    if (user.xp >= 100) {
      user.level += 1;
      user.xp = 0;

      // ✅ Gear unlock logic
      if (user.level === 5 && !user.gear.includes('helmet')) {
        user.gear.push('helmet');
      }

      // ✅ Badge reward
      user.badges.push(`Level ${user.level} Achiever`);
    }

    await habit.save();
    await user.save();

    res.status(200).json({
      message: 'Habit completed!',
      habitId: habit._id,
      streak: habit.streak,
      lastCompleted: habit.lastCompleted,
      xp: user.xp,
      level: user.level,
      badges: user.badges,
      gear: user.gear
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getHabits,
  createHabit,
  completeHabit
};