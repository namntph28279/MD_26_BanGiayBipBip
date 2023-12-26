const express = require('express');
const mongoose = require('mongoose');
const useController = require('./Controllers/Controller')
const websever = require('./Controllers/Websever')
const app = express();
var socket = require('socket.io');
app.use(express.static(__dirname + "/Images"))
app.use(express.static(__dirname + "/CSS"))

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
// Kết nối tới MongoDB
mongoose.connect('mongodb+srv://namnguyen:Nam280103@cluster0.zyd4ou2.mongodb.net/DB?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
        // Tiếp tục khởi chạy server sau khi kết nối thành công
        var server = app.listen(server_port, server_host, function() {
            console.log('Listening on port %d', server_port)
        });
        var io = socket(server);

        io.on("connection", function(socket) {
            console.log("Có kết nối: " + socket.id)
            socket.on("client-send", function() {
                console.log("Server nhận được")
                io.sockets.emit("server-send",data)
            })
        })
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
    });



app.use(useController);
app.use(websever)