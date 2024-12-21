const express = require("express");
const router = express.Router();
const db = require("../../config/db");

router.get("/:id", (req, res) => {
  const Id = req.params.id;

  const queries = {
    dien_vien: `SELECT ns.* 
                  FROM nghe_sy ns 
                  JOIN dien_vien_trong_phim dvtp ON dvtp.id_dien_vien = ns.id
                  WHERE dvtp.id_phim = ?`,
    dao_dien: `SELECT ns.* 
                 FROM nghe_sy ns 
                 JOIN dao_dien_phim ddp ON ddp.id_dao_dien = ns.id
                 WHERE ddp.id_phim = ?`,
    nha_san_xuat: `SELECT ns.* 
                     FROM nghe_sy ns 
                     JOIN nha_san_xuat_phim nsxp ON nsxp.id_nha_san_xuat = ns.id
                     WHERE nsxp.id_phim = ?`,
    the_loai: `SELECT tl.* 
                FROM the_loai tl 
                JOIN the_loai_phim tlp ON tlp.id_the_loai = tl.id
                WHERE tlp.id_phim = ?`,
  };

  const results = {};

  const promises = Object.entries(queries).map(
    ([key, query]) =>
      new Promise((resolve, reject) => {
        db.query(query, [Id], (err, result) => {
          if (err) return reject(err);
          results[key] = result; // Lưu kết quả
          resolve();
        });
      })
  );

  // Đợi tất cả các truy vấn hoàn thành
  Promise.all(promises)
    .then(() => {
      res.status(200).json(results);
    })
    .catch((err) => {
      res.status(500).json({ message: "Lỗi khi lấy dữ liệu.", error: err });
    });
});

router.post("/add", (req, res) => {
  const { movieId, type, id } = req.body;

  let tableName = "";
  if (type === "dien_vien") tableName = "dien_vien_trong_phim";
  if (type === "dao_dien") tableName = "dao_dien_phim";
  if (type === "nha_san_xuat") tableName = "nha_san_xuat_phim";
  if (type === "the_loai") tableName = "the_loai_phim";

  const query = `INSERT INTO ${tableName} (id_phim, id_${type}) VALUES (?, ?)`;

  db.query(query, [movieId, id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Lỗi khi thêm dữ liệu", error: err });
    }
    res.status(200).json({ message: "Thêm thành công", result });
  });
});

router.delete("/delete", (req, res) => {
    const { movieId, type, id } = req.body;
  
    let tableName = "";
    if (type === "dien_vien") tableName = "dien_vien_trong_phim";
    if (type === "dao_dien") tableName = "dao_dien_phim";
    if (type === "nha_san_xuat") tableName = "nha_san_xuat_phim";
    if (type === "the_loai") tableName = "the_loai_phim";
  
    // Câu lệnh DELETE để xóa dữ liệu
    const query = `DELETE FROM ${tableName} WHERE id_phim = ? AND id_${type} = ?`;
  
    db.query(query, [movieId, id], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Lỗi khi xóa dữ liệu", error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy dữ liệu để xóa" });
      }
      res.status(200).json({ message: "Xóa thành công", result });
    });
  });  

module.exports = router;
