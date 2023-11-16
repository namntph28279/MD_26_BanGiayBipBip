const mongoose = require('mongoose');


const checkClientUser = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    client: {
        type: [{
            IdClient: String,
            status:String
        }],
        required: true
    }
});

const CheckClientUser = mongoose.model('checkClientUser', checkClientUser);

module.exports = CheckClientUser;
