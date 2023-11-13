const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer_email: {
    type: String,
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  addresses: [{
    address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true
    },
    address: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }

  }],
  order_date: {
    type: Date,
    default: Date.now
  },
  status:{
    type: String,
    default: "none"
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
