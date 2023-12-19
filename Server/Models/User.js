const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    default: 1,
  },
  status: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now
  }, 
  block_reason:{
    type: String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
