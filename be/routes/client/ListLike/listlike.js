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

router.get("/", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user; // Lấy userId từ token

        const getFavoritesQuery = `
        SELECT p.id_phim, p.ten_phim, p.mo_ta, p.poster, p.background
        FROM phim p
        JOIN yeu_thich y ON p.id_phim = y.id_phim
        WHERE y.userid = ?;
        `;

        const [favorites] = await db
            .promise()
            .query(getFavoritesQuery, [userId]);
        res.json({
            status: 1,
            message: "Danh sách phim yêu thích",
            data: favorites,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách phim yêu thích:", error);
        res.status(500).json({ error: "Lỗi máy chủ nội bộ." });
    }
});

module.exports = router;
