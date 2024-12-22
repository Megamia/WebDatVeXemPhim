const express = require("express");
const router = express.Router();
const db = require("../../config/db");

router.get("/", (req, res) => {
  const query =
    "SELECT sc.*, pc.ten_phong, p.ten_phim FROM suat_chieu sc JOIN phong_chieu pc ON pc.id = sc.id_phong JOIN phim p ON p.id_phim = sc.id_phim";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi khi lấy danh sách." });
    }
    res.status(200).json(results);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT sc.* FROM suat_chieu sc WHERE sc.id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi khi lấy danh sách." });
    }
    res.status(200).json(results);
  });
});

router.post("/add", (req, res) => {
  const { id_phim, id_phong, thoi_gian, gia, tinh_trang } = req.body;

  const giaNumeric = parseFloat(gia);

  const query = `
    INSERT INTO suat_chieu (id_phim, id_phong, thoi_gian, gia, tinh_trang) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [id_phim, id_phong, thoi_gian, giaNumeric, tinh_trang],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi thêm suất chiếu." });
      }
      res
        .status(200)
        .json({ message: "Thêm suất chiếu thành công!", id: results.insertId });
    }
  );
});

router.put("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { id_phim, id_phong, thoi_gian, gia, tinh_trang } = req.body;

  const giaNumeric = parseFloat(gia);

  const query = `
    UPDATE suat_chieu
    SET id_phim = ?, id_phong = ?, thoi_gian = ?, gia = ?, tinh_trang = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [id_phim, id_phong, thoi_gian, giaNumeric, tinh_trang, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi sửa suất chiếu." });
      }
      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy suất chiếu với ID này." });
      }
      res.status(200).json({ message: "Cập nhật suất chiếu thành công!" });
    }
  );
});

module.exports = router;
