const mongoose = require('mongoose');

const SizeSchema = new mongoose.Schema({
  colorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color',
    required: true,
  },
  size_quantity: {
    type: Number,
    required: true
  },
  size_name: {
    type: String,
    required: true
  }
});

const Size = mongoose.model('Size', SizeSchema);

module.exports = Size;