const mongoose = require('mongoose');

const dataClient = new mongoose.Schema({
    noiDung: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', dataClient);

module.exports = Notification;
