const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const jwt = require("jsonwebtoken");

const secretKey =
  "as63d1265qw456q41rf32ds1g85456e1r32w1r56qr41_qwe1qw56e42a30s0";

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (token == null) {
      return res.sendStatus(401);
    }

    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(403).json({ message: "Token is invalid or expired." });
  }
};

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const movieId = parseInt(req.params.id, 10);

    const checkMovieQuery = `SELECT * FROM yeu_thich WHERE userid = ? AND id_phim = ?`;
    const [existingUser] = await db
      .promise()
      .query(checkMovieQuery, [userId, movieId]);

    if (existingUser.length === 0) {
      return res.json({ status: 0, message: "Movie not found in favorites" });
    }

    res.json({
      status: 1,
      desc: "data",
      data: existingUser,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
  }
});

router.post("/:id", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const movieId = parseInt(req.params.id, 10);

    const checkMovieQuery = `SELECT * FROM yeu_thich WHERE userid = ? AND id_phim = ?`;
    const [existingUser] = await db
      .promise()
      .query(checkMovieQuery, [userId, movieId]);

    if (existingUser.length > 0) {
      const deleteMovieQuery = `DELETE FROM yeu_thich WHERE userid = ? AND id_phim = ?`;
      await db.promise().query(deleteMovieQuery, [userId, movieId]);

      res.json({
        status: 1,
        desc: "delete",
        message: "Đã xóa bộ phim khỏi danh sách yêu thích.",
      });
    } else {
      const insertMovieQuery = `INSERT INTO yeu_thich (userid, id_phim) VALUES (?, ?)`;
      await db.promise().query(insertMovieQuery, [userId, movieId]);

      res.json({
        status: 1,
        desc: "insert",
        message: "Đã thêm bộ phim vào danh sách yêu thích.",
      });
    }
  } catch (error) {
    console.error("Lỗi máy chủ:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
  }
});

module.exports = router;
