const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRETX;

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword, phone });
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    newUser.token = token;
    await newUser.save();

    res.status(201).json({ token, user: { id: newUser._id, fullName, email } });
  } catch (err) {
    res.status(500).json('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json('Invalid credentials');

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    user.token = token;
    await user.save();

    res.json({ token, user: { id: user._id, fullName: user.fullName, email } });
  } catch (err) {
    res.status(500).json('Server error');
  }
});
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'fullName email avatar');
    const usersWithId = users.map(user => ({
      id: user._id.toString(), // convert MongoDB _id to string id
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar || user.fullName[0]
    }));
    res.json(usersWithId);
  } catch (err) {
    res.status(500).json('Server error');
  }
});



router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRETX);
    const user = await User.findById(decoded.id).select('id fullName email avatar');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar || user.fullName[0]
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Invalid token or server error' });
  }
});
module.exports = router;
