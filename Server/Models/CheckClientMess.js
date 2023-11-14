const mongoose = require('mongoose');


const checkClientMess = new mongoose.Schema({
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

const CheckClientMess = mongoose.model('checkClientMess', checkClientMess);

module.exports = CheckClientMess;
