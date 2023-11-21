const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  colorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color',
    required: true,
  },
  color:{
    type: String,
    required: true,
  },
  sizeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Size',
    required: true,
  },
  size:{
    type: String,
    required: true,
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
});

const CartItem = mongoose.model('CartItem', CartItemSchema);

module.exports = CartItem;
