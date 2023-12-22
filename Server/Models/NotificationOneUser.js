const mongoose = require('mongoose');

const dataClient = new mongoose.Schema({
    userName:{
        type: String,
    },
    noiDung: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const NotificationOneUser = mongoose.model('NotificationOneUser', dataClient);

module.exports = NotificationOneUser;
