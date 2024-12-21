const express = require("express");
const router = express.Router();
const db = require("../../config/db"); 

router.get("/", (req, res) => {
  const query = "SELECT * FROM gioi_han_do_tuoi"; 
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi khi lấy danh sách." });
    }
    res.status(200).json(results); 
  });
});

module.exports = router;
