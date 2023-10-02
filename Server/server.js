const express = require('express');
const mongoose = require('mongoose');
const useController = require('./Controllers/Controller')
const app = express();

// Kết nối tới MongoDB
mongoose.connect('mongodb+srv://namnguyen:Nam280103@cluster0.zyd4ou2.mongodb.net/DB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Tiếp tục khởi chạy server sau khi kết nối thành công
    app.listen(9999, () => {
      console.log('Server started on port 9999');
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });


app.use(useController);



