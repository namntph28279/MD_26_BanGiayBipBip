const mongoose = require('mongoose');


const chatShopSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName:{
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    date:{
        type: Date,
        default: Date.now
    },
    content: {
        type: [{
            beLong: String,
            conTenMain:String,
            timestamp: {
                type: Date,
                default: Date.now,
            },
        }],
        required: true
    }
});

const chatShop = mongoose.model('ChatShop', chatShopSchema);

module.exports = chatShop;
