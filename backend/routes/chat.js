const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const newMsg = new Message({ senderId, receiverId, content });
    await newMsg.save();
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ error: 'Message save failed' });
  }
});

// Fetch messages between two users
router.get('/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const msgs = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort({ timestamp: 1 });

    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: 'Message fetch failed' });
  }
});

module.exports = router;
