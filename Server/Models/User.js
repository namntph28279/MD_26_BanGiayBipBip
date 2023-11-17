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
  status: {
    type: Boolean,
<<<<<<< HEAD
    default: false 
  },
  role: {
    type: Number,
    default: 1
=======
    default: false,
  },
  role:{
    type: Number,
    default: 1,
>>>>>>> d95301213b4124b8654aee3808ba5ca8b4778567
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
