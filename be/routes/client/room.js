const express = require("express");
const router = express.Router();
const db = require("../../config/db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM phong_chieu", (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách:", err);
      return res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
    }
    res.json(results);
  });
});

router.get("/:id", (req, res) => {
  const roomId = req.params.id;
  const query = `
    SELECT 
      phong_chieu.ten_phong AS ten_phong, 
      cho_ngoi.ten AS cho_ngoi, 
      cho_ngoi.id AS id
    FROM phong_chieu
    LEFT JOIN cho_ngoi ON phong_chieu.id = cho_ngoi.id_phong
    WHERE phong_chieu.id = ?`;

  db.query(query, [roomId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy thông tin phòng:", err.sqlMessage);
      return res.status(500).json({ message: "Lỗi khi lấy thông tin phòng." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Phòng không tồn tại." });
    }
    const tenPhong = results[0].ten_phong;
    const danhSachChoNgoi = results.map((row) => ({
      ten: row.cho_ngoi,
      id: row.id,
    }));

    res.status(200).json({ ten_phong: tenPhong, cho_ngoi: danhSachChoNgoi });
  });
});
module.exports = router;
