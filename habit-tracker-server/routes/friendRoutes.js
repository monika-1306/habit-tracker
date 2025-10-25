const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sendFriendRequest,
  acceptFriendRequest,
  getFriends
} = require('../controllers/friendController');

// ✅ Send a friend request
router.post('/request', protect, sendFriendRequest);

// ✅ Accept a friend request
router.post('/accept', protect, acceptFriendRequest);

// ✅ Get list of accepted friends
router.get('/list', protect, getFriends);

module.exports = router;