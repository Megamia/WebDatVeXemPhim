const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy danh sách users:', err);
      return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' });
    }
    res.json(results);
  });
});

// router.post('/', (req, res) => {
//   const { name, email } = req.body;
//   db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
//     if (err) {
//       console.error('Lỗi khi thêm user:', err);
//       return res.status(500).json({ message: 'Lỗi khi thêm user' });
//     }
//     res.status(201).json({ message: 'User đã được thêm', userId: result.insertId });
//   });
// });

module.exports = router;
