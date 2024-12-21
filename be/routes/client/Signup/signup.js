const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
    const [existingUser] = await new Promise((resolve, reject) => {
      db.query(checkUserQuery, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (existingUser) {
      return res.json({ status: 0, message: "Tài khoản người dùng đã tồn tại." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    await new Promise((resolve, reject) => {
      db.query(insertUserQuery, [username, email, hashedPassword], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    res.json({
      status: 1,
      state: true,
      message: "Đăng ký thành công.",
    });
  } catch (error) {
    console.error("Lỗi máy chủ:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
  }
});

module.exports = router;
