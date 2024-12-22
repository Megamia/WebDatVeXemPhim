const express = require("express");
const router = express.Router();
const db = require("../../config/db");

router.get("/:id/:code", async (req, res) => {
  const { id, code } = req.params;
  const query = `
      SELECT *
      FROM trang_thai_cho_ngoi ttcn
      WHERE ttcn.code = ? AND ttcn.id_suat_chieu = ?
    `;

  try {
    const [results] = await db.promise().query(query, [code, id]);

    if (results.length > 0) {
      // Mã đã tồn tại
      return res.status(200).json({
        exists: true,
        message: "Code đã tồn tại.",
        data: results,
      });
    } else {
      // Mã không tồn tại
      return res.status(200).json({
        exists: false,
        message: "Code không tồn tại.",
      });
    }
  } catch (err) {
    console.error("Lỗi khi lấy thông tin thanh toán:", err.sqlMessage);
    res.status(500).json({ message: "Lỗi khi lấy thông tin thanh toán." });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { name, email, phone, seats, suatchieu, code } = req.body;

    if (!seats || !Array.isArray(seats)) {
      return res.status(400).json({ error: "Seats must be an array." });
    }
    const values = seats.map((seatId) => [
      suatchieu,
      seatId,
      name,
      phone,
      email,
      code,
    ]);

    const query = `
      INSERT INTO trang_thai_cho_ngoi (id_suat_chieu, id_cho_ngoi, ho_ten, sdt, email, code)
      VALUES ?
    `;
    await db.promise().query(query, [values]);

    res.status(201).json({ message: "Tickets added successfully!" });
  } catch (error) {
    console.error(
      "Error inserting tickets:",
      error.sqlMessage || error.message
    );
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/:code", (req, res) => {
  const code = req.params.code;
  const query = `SELECT ttcn.*, sc.thoi_gian, pc.ten_phong, p.ten_phim, sc.gia, cn.ten
  FROM trang_thai_cho_ngoi ttcn
  JOIN suat_chieu sc ON sc.id = ttcn.id_suat_chieu
  JOIN cho_ngoi cn ON cn.id = ttcn.id_cho_ngoi
  JOIN phim p ON p.id_phim = sc.id_phim
  JOIN phong_chieu pc ON pc.id = sc.id_phong
  WHERE code = ?`;
  db.query(query, [code], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy thông tin vé:", err.sqlMessage);
      return res.status(500).json({ message: "Lỗi khi lấy thông tin vé." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Vé không tồn tại." });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
