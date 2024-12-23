const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
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

    if (token == null) {
      return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ message: "Error verifying token" });
  }
};

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const query = "SELECT * FROM Users WHERE userid = ?";

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const userInfoFromDB = results[0];

      const isAdmin = userInfoFromDB["userid"] === 1;

      const response = {
        message: isAdmin ? "User is Admin" : "User isn't Admin",
        userInfo: {
          ...userInfoFromDB,
          isAdmin,
        },
      };

      return res.json({ role: isAdmin, data: response });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update thêm
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { userId } = req.user;

    if (!username || !email || !password || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const checkUserExistsQuery = `
      SELECT * FROM Users WHERE userid = ?
    `;
    db.query(checkUserExistsQuery, [userId], async (err, userResults) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        UPDATE Users 
        SET username = ?, email = ?, password = ? 
        WHERE userid = ?
      `;

      db.query(
        query,
        [username, email, hashedPassword, userId],
        (err, results) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Internal server error" });
          }

          if (results.changedRows > 0 || results.affectedRows > 0) {
            return res.status(200).json({
              message: "User information has been updated successfully",
            });
          } else {
            return res.status(400).json({
              message: "No changes detected in user information",
            });
          }
        }
      );
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
