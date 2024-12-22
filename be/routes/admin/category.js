const express = require("express");
const router = express.Router();
const db = require("../../config/db"); // Import kết nối MySQL

router.get("/", (req, res) => {
  const query = "SELECT * FROM the_loai"; // Câu lệnh SQL lấy tất cả phim
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi khi lấy danh sách." });
    }
    res.status(200).json(results); // Phản hồi danh sách phim
  });
});

router.get("/:id", (req, res) => {
  const Id = req.params.id; // Lấy ID phim từ tham số URL
  const query = "SELECT * FROM the_loai WHERE id = ?"; // Câu lệnh SQL lấy thông tin phim theo ID

  db.query(query, [Id], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy thông tin:", err.sqlMessage); // Log lỗi
      return res.status(500).json({ message: "Lỗi khi lấy thông tin." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Thông tin không tồn tại." }); // Nếu không tìm thấy phim
    }

    res.status(200).json(results[0]); // Phản hồi thông tin phim
  });
});
// Route thêm mới product và upload ảnh
router.post("/add", (req, res) => {
  const { ten } = req.body;
  const query = "INSERT INTO the_loai (ten) VALUES (?)";

  db.query(query, [ten], (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm :", err.sqlMessage); // Log lỗi cụ thể
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Đã tồn tại." }); // Mã trạng thái 409: Conflict
      }
      return res
        .status(500)
        .json({ message: "Lỗi khi thêm : " + err.sqlMessage }); // Phản hồi lỗi với thông điệp cụ thể
    }

    console.log("Đã được thêm:", result); // Log kết quả thành công
    res.status(201).json({
      message: "Đã được thêm!",
      Id: result.insertId,
    });
  });
});

router.put("/update/:id", (req, res) => {
  const Id = req.params.id; // Lấy id từ tham số
  const { ten } = req.body;
  const queryUpdate = "UPDATE the_loai SET ten = ? WHERE id = ?";

  db.query(queryUpdate, [ten, Id], (err, result) => {
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
  const Id = req.params.id; // Lấy id từ tham số
  const queryDelete = "DELETE FROM the_loai WHERE id = ?"; // Correct query for DELETE

  db.query(queryDelete, [Id], (err, result) => { // Use queryDelete instead of queryUpdate
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
