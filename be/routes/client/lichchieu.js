const express = require("express");
const router = express.Router();
const db = require("../../config/db");

// router.get("/", (req, res) => {
//   db.query("SELECT * FROM suat_chieu", (err, results) => {
//     if (err) {
//       console.error("Lỗi khi lấy danh sách:", err);
//       return res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
//     }
//     res.json(results);
//   });
// });

router.get("/:id", (req, res) => {
  const movieId = req.params.id;
  const query = `SELECT * FROM suat_chieu WHERE id_phim = ?`;
  db.query(query, [movieId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy lịch chiếu:", err.sqlMessage);
      return res.status(500).json({ message: "Lỗi khi lấy lịch chiếu." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Lịch chiếu không tồn tại." });
    }
    res.status(200).json(results);
  });
});
module.exports = router;
