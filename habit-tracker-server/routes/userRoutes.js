const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  getMyBadges,
  updateUserProfile,
  updateAvatar
} = require('../controllers/userController');
const User = require('../models/User');

const router = express.Router();

// Multer config for avatar uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Public routes
router.post('/register', registerUser);

router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.get('/badges', protect, getMyBadges);
router.put('/profile', protect, updateUserProfile);
router.put('/avatar', protect, updateAvatar);

// Upload avatar via file
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: 'Avatar uploaded successfully', avatar: user.avatar });
  } catch (error) {
    console.error('Avatar upload error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;