const express = require('express');
const app = express();
const port = 4000;

app.use(express.json()); // Để xử lý JSON request body

// Import routes
const userRoutes = require('./routes/user');

// Sử dụng route cho user
app.use('/users', userRoutes);

// Chạy server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
