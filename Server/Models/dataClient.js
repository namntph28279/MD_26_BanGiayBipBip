const mongoose = require('mongoose');

const dataClient = new mongoose.Schema({
    client: {
        type: String,
    }
});

const CheckClientUser = mongoose.model('dataClient', dataClient);

module.exports = CheckClientUser;
