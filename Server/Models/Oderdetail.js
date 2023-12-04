const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
        img_product: {
            type: String,
            required: true
        },
        name_Product: {
            type: String,
            required: true
        },
        name_Size: {
            type: String,
            required: true
        },
        name_Price: {
            type: String,
            required: true
        },
        name_Color: {
            type: String,
            required: true
        },
        quantityProduct: {
            type: String,
            required: true
        }

    }],
    order_date: {
        type: Date,
        default: Date.now
    },
    total_amount: {
        type: Number,
        default: 0
    },
    userName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },

    total_product: {
        type: String,
        required: true
    },
    total_insurance_amount: {
        type: String,
        required: true
    },
    total_shipping_fee: {
        type: String,
        required: true
    },

    total_All: {
        type: String,
        required: true
    },
    total_quantity: {
        type: String,
        required: true
    },
    lyDoHuyDon: {
        type: String,
    },
    status: {
        type: Number,
        default: 0
    },


});

const Oderdetail = mongoose.model('OrderDetail', orderSchema);

module.exports = Oderdetail;