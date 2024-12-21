const express = require("express");
const router = express.Router();
const db = require("../../config/db");


router.get("/", (req, res) => {
  db.query("SELECT * FROM suat_chieu", (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách:", err);
      return res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
    }
    res.json(results);
  });
});

router.get("/:id_suat_chieu", async (req, res) => {
  const { id_suat_chieu } = req.params;

  const query = `
    SELECT
      c.id AS id_ghe, 
      c.ten AS ten_ghe, 
      t.ho_ten, 
      t.email, 
      t.sdt,
      sc.id_phong,
      p.ten_phong AS ten_phong, 
      phim.ten_phim AS ten_phim, 
      sc.*
    FROM suat_chieu sc
    JOIN phong_chieu p ON sc.id_phong = p.id
    JOIN phim ON sc.id_phim = phim.id_phim
    JOIN cho_ngoi c ON sc.id_phong = c.id_phong
    LEFT JOIN trang_thai_cho_ngoi t 
      ON c.id = t.id_cho_ngoi AND t.id_suat_chieu = ?
    WHERE sc.id = ?
  `;

  try {
    const [results] = await db
      .promise()
      .query(query, [id_suat_chieu, id_suat_chieu]);

    // Xử lý danh sách ghế
    const danhSachGhe = results.map((ghe) => ({
      id_ghe: ghe.id_ghe,
      ten_ghe: ghe.ten_ghe,
      da_mua: ghe.ho_ten ? true : false, // Nếu có họ tên người mua, ghế đã được mua
      thong_tin_nguoi_mua: ghe.ho_ten
        ? {
            ten: ghe.ho_ten,
            email: ghe.email,
            sdt: ghe.sdt,
          }
        : null,
    }));

    // Thêm thông tin suất chiếu
    const suatChieuInfo = {
      id: id_suat_chieu || "",
      ten_phong: results[0]?.ten_phong || "",
      ten_phim: results[0]?.ten_phim || "",
      gia: results[0]?.gia || 0,
      thoi_gian: results[0]?.thoi_gian || "",
    };

    res
      .status(200)
      .json({ suat_chieu: suatChieuInfo, danh_sach_ghe: danhSachGhe });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin ghế:", err.sqlMessage);
    res.status(500).json({ message: "Lỗi khi lấy thông tin ghế." });
  }
});

module.exports = router;
