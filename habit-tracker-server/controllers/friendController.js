const Friend = require('../models/Friend');
const User = require('../models/User');

const sendFriendRequest = async (req, res) => {
  try {
    const { recipientEmail } = req.body;
    if (!recipientEmail) return res.status(400).json({ error: 'Recipient email is required' });

    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) return res.status(404).json({ error: 'User not found' });

    // Prevent duplicate requests in either direction
    const existing = await Friend.findOne({
      $or: [
        { requester: req.user._id, recipient: recipient._id },
        { requester: recipient._id, recipient: req.user._id }
      ]
    });

    if (existing) return res.status(400).json({ error: 'Friend request already exists' });

    const request = new Friend({
      requester: req.user._id,
      recipient: recipient._id,
      status: 'pending'
    });

    await request.save();
    res.status(201).json({ message: 'Friend request sent' });
  } catch (err) {
    console.error('Error sending friend request:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    if (!requesterId) return res.status(400).json({ error: 'Requester ID is required' });

    const request = await Friend.findOne({
      requester: requesterId,
      recipient: req.user._id,
      status: 'pending'
    });

    if (!request) return res.status(404).json({ error: 'Friend request not found' });

    request.status = 'accepted';
    await request.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('Error accepting friend request:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getFriends = async (req, res) => {
  try {
    const friends = await Friend.find({
      $or: [
        { requester: req.user._id, status: 'accepted' },
        { recipient: req.user._id, status: 'accepted' }
      ]
    }).populate('requester recipient', 'name email avatar');

    res.json(friends);
  } catch (err) {
    console.error('Error fetching friends:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  getFriends
};