const Friend = require('../models/Friend');
const User = require('../models/User');

const sendFriendRequest = async (req, res) => {
  const { recipientEmail } = req.body;
  const recipient = await User.findOne({ email: recipientEmail });
  if (!recipient) return res.status(404).json({ error: 'User not found' });

  const existing = await Friend.findOne({
    requester: req.user._id,
    recipient: recipient._id
  });

  if (existing) return res.status(400).json({ error: 'Request already sent' });

  const request = new Friend({ requester: req.user._id, recipient: recipient._id });
  await request.save();
  res.status(201).json({ message: 'Friend request sent' });
};

const acceptFriendRequest = async (req, res) => {
  const { requesterId } = req.body;
  const request = await Friend.findOne({
    requester: requesterId,
    recipient: req.user._id,
    status: 'pending'
  });

  if (!request) return res.status(404).json({ error: 'Request not found' });

  request.status = 'accepted';
  await request.save();
  res.status(200).json({ message: 'Friend request accepted' });
};

const getFriends = async (req, res) => {
  const friends = await Friend.find({
    $or: [
      { requester: req.user._id, status: 'accepted' },
      { recipient: req.user._id, status: 'accepted' }
    ]
  }).populate('requester recipient', 'name email avatar');

  res.json(friends);
};

module.exports = { sendFriendRequest, acceptFriendRequest, getFriends };