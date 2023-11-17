const mongoose = require('mongoose');

const orderStatus = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  condition: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    default: ""
  }
});

const OrderStatus = mongoose.model('OrderStatus', orderStatus);

module.exports = OrderStatus;