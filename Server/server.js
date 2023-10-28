const express = require('express');
const mongoose = require('mongoose');
const useController = require('./Controllers/Controller')
const websever = require('./Controllers/Websever')
const app = express();

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
    app.listen(server_port, server_host, function() {
      console.log('Listening on port %d', server_port)
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });



app.use(useController);
app.use(websever)



