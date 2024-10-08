const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(express.json()); // Để xử lý JSON request body
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const path = require('path');

// Cho phép truy cập các file tĩnh
app.use('/uploads/posters/', express.static(path.join(__dirname, 'uploads/posters/')));
app.use('/uploads/backgrounds/', express.static(path.join(__dirname, 'uploads/backgrounds/')));

// Import routes
const userRoutes = require('./routes/client/user');
const movieRoutes = require('./routes/admin/movie')
// Sử dụng route cho user
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);

// Chạy server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
