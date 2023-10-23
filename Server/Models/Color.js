const mongoose = require('mongoose');

const ColorSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  color_name: {
    type: String,
    required: true
  },
  color_image: {
    type: String,
    required: true
  }
}); 

const Color = mongoose.model('Colors', ColorSchema);

module.exports = Color;