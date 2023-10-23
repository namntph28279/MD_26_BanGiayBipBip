const mongoose = require('mongoose');

const favouriteItemSchema = new mongoose.Schema({
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
  product_title: {
    type: String,
    required: true
  },
  product_price: {
    type: Number,
    required: true
  },
  product_image: {
    type: String,
    required: true
  }
});

const FavouriteItem = mongoose.model('FavouriteItem', favouriteItemSchema);

module.exports = FavouriteItem;
