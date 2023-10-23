const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  product_title: {
    type: String,
    required: true
  },
  product_image: {
    type: String,
    required: true
  }
});

const CartItem = mongoose.model('CartItem', CartItemSchema);

module.exports = CartItem;
