const express = require("express");
const router = express.Router();
const db = require("../../config/db"); 

router.get("/", (req, res) => {
  const query = "SELECT * FROM nghe_sy"; 
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi khi lấy danh sách." });
    }
    res.status(200).json(results); 
  });
});

router.get("/:id", (req, res) => {
  const Id = req.params.id; 
  const query = "SELECT * FROM nghe_sy WHERE id = ?"; 

  db.query(query, [Id], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy thông tin:", err.sqlMessage); // 
      return res.status(500).json({ message: "Lỗi khi lấy thông tin." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Thông tin không tồn tại." }); 
    }

    res.status(200).json(results[0]); 
  });
});

router.post("/add", (req, res) => {
  const { ten, mo_ta } = req.body;
  const query = "INSERT INTO nghe_sy (ten, mo_ta) VALUES (?,?)";

  db.query(query, [ten,mo_ta], (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm :", err.sqlMessage); 
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Đã tồn tại." }); 
      }
      return res
        .status(500)
        .json({ message: "Lỗi khi thêm : " + err.sqlMessage });
    }

    console.log("Đã được thêm:", result); 
    res.status(201).json({
      message: "Đã được thêm!",
      Id: result.insertId,
    });
  });
});

router.put("/update/:id", (req, res) => {
  const Id = req.params.id; 
  const { ten, mo_ta } = req.body;
  const queryUpdate = "UPDATE nghe_sy SET ten = ?, mo_ta=? WHERE id = ?";

  db.query(queryUpdate, [ten, mo_ta, Id], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật:", err.sqlMessage);
      return res
        .status(500)
        .json({ message: "Lỗi khi cập nhật: " + err.sqlMessage });
    }

    console.log("Đã được cập nhật:", result);
    res.status(200).json({ message: "Đã được cập nhật!" });
  });
});

router.delete("/delete/:id", (req, res) => {
  const Id = req.params.id; 
  const queryDelete = "DELETE FROM nghe_sy WHERE id = ?"; 

  db.query(queryDelete, [Id], (err, result) => { 
    if (err) {
      console.error("Lỗi khi xóa:", err.sqlMessage);
      return res
        .status(500)
        .json({ message: "Lỗi khi xóa: " + err.sqlMessage });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy để xóa!" });
    }

    console.log("Đã xóa thành công:", result);
    res.status(200).json({ message: "Đã xóa thành công!" });
  });
});


module.exports = router;
