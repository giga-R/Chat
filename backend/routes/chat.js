const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Save message
router.post('/', async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  const message = new Message({ senderId, receiverId, content });
  await message.save();
  res.status(201).send('Message saved');
});

// Get messages between two users
router.get('/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await Message.find({
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 }
    ]
  }).sort('timestamp');
  res.json(messages);
});

module.exports = router;
