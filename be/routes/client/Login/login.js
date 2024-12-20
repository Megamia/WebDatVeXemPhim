const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const jwt = require('jsonwebtoken');
const secretKey = 'as63d1265qw456q41rf32ds1g85456e1r32w1r56qr41_qwe1qw56e42a30s0'; 

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({
          status: 1,
          message: "Vui lòng nhập đầy đủ username và password",
        });
    }

    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy danh sách users:", err);
        return res
          .status(500)
          .json({ status: 1, message: "Lỗi khi lấy dữ liệu" });
      }

      if (results.length === 0) {
        return res.json({ status: 0, message: "Sai username hoặc password" });
      }
      const token = jwt.sign(
        { username: results[0].username, userId: results[0].userid },
        secretKey,
        { expiresIn: "1h" }
      );
      res.json({ status: 1, data: results, token: token });
    });
  } catch (error) {
    console.error("Lỗi kết nối:", error);
    res.status(500).json({ message: "Error connecting to SQL Server" });
  }
});

module.exports = router;
