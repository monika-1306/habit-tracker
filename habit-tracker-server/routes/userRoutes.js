const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

const {
  registerUser,
  loginUser,
  getUserProfile,     
  getMyBadges,
  updateUserProfile,
  updateAvatar
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);    
router.get('/badges', protect, getMyBadges);
router.put('/profile', protect, updateUserProfile);
router.put('/avatar', protect, updateAvatar);
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  const user = await User.findById(req.user._id);
  user.avatar = `/uploads/${req.file.filename}`;
  await user.save();
  res.json({ avatar: user.avatar });
});


module.exports = router;
