const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secretKey =
  "as63d1265qw456q41rf32ds1g85456e1r32w1r56qr41_qwe1qw56e42a30s0";

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ message: "Error verifying token" });
  }
};

router.get("/:id", async (req, res) => {
  try {
    const movieId = parseInt(req.params.id, 10);

    const ratingQuery = `SELECT rating FROM danh_gia WHERE id_phim = ?`;
    const [ratings] = await db.promise().query(ratingQuery, [movieId]);

    if (ratings.length > 0) {
      const ratingsAbove3 = ratings.filter(
        (rating) => Number(rating.rating) > 3
      ).length;
      const totalRatings = ratings.length;

      const percentageAbove3 = Math.floor((ratingsAbove3 / totalRatings) * 100);

      return res.json({
        status: 1,
        message: "Có dữ liệu đánh giá phim",
        data: {
          totalRatings,
          ratingsAbove3,
          percentageAbove3,
        },
      });
    } else {
      return res.json({
        status: 0,
        message: "Không có dữ liệu đánh giá của phim",
      });
    }
  } catch (error) {
    console.error("Lỗi máy chủ:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
  }
});

router.get("/:id/user", authenticateToken, async (req, res) => {
  try {
    const movieId = parseInt(req.params.id, 10);
    const { userId } = req.user;

    const ratingQuery = `SELECT rating FROM danh_gia WHERE userid =? AND id_phim = ?`;
    const [existingUser] = await db
      .promise()
      .query(ratingQuery, [userId, movieId]);

    if (existingUser.length > 0) {
      return res.json({
        status: 1,
        message: "Người dùng đã đánh giá bộ phim này",
      });
    } else {
      return res.json({
        status: 0,
        message: "Người dùng chưa đánh giá bộ phim này",
      });
    }
  } catch (error) {
    console.error("Lỗi máy chủ:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
  }
});

router.post("/:id", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { rating } = req.body;
    const movieId = parseInt(req.params.id, 10);

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const checkMovieQuery = `SELECT * FROM danh_gia WHERE userid = ? AND id_phim = ?`;
    const [existingUser] = await db
      .promise()
      .query(checkMovieQuery, [userId, movieId]);

    if (existingUser.length > 0) {
      return res.json({
        status: 0,
        message: "Người dùng đã đánh giá phim này",
      });
    } else {
      const insertMovieQuery = `INSERT INTO danh_gia (userid, id_phim, rating) VALUES (?, ?, ?)`;
      await db.promise().query(insertMovieQuery, [userId, movieId, rating]);

      res.json({
        status: 1,
        desc: "insert",
        message: `Người dùng với id ${userId} đã thêm đánh giá ${rating} cho phim có id ${movieId} thành công.`,
      });
    }
  } catch (error) {
    console.error("Lỗi máy chủ:", error);
    res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
  }
});

module.exports = router;
