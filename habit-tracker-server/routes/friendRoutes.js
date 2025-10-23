const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sendFriendRequest,
  acceptFriendRequest,
  getFriends
} = require('../controllers/friendController');

router.post('/request', protect, sendFriendRequest);
router.post('/accept', protect, acceptFriendRequest);
router.get('/list', protect, getFriends);

module.exports = router;