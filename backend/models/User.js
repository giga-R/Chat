const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  token: String  // ⬅ Add this line
});

module.exports = mongoose.model('User', userSchema);
