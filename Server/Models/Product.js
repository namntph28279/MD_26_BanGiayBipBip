const mongoose = require('mongoose');
const useScheme = new mongoose.Schema({
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
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_quantityColor: {
        type: Number,
        required: true
    },
    product_category:{
        type: String
    },
    data_product:{
        type: Date,
        default: Date.now
    }
})
//câu lệnh tạo bảng
const Product = mongoose.model('product', useScheme);
module.exports = Product;
