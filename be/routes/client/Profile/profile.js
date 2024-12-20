const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const jwt = require("jsonwebtoken");
const sql = require("mssql");

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
      return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
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
    const userInfo = req.user;
    const { username } = userInfo;
    const query = "SELECT * FROM Users WHERE username = ?";

    db.query(query, [username], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      const userInfoFromDB = results[0];
      const isAdmin = userInfoFromDB["userid"];

      const response = {
        message: isAdmin === 1 ? "User is Admin" : "User isn't Admin",
        userInfo: {
          ...userInfoFromDB,
          isAdmin,
        },
      };

      return res.status(200).json(response);
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
    const { userid } = req.user;
    const query = `UPDATE Users 
         SET username = @username,  email = @email, password = @password
         WHERE userid = @userid`;
    db.query(query, [username, email, password,userid], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Can't update" });
      }
    });
    // await pool
    //   .request()
    //   .input("username", sql.NVarChar, username)
    //   .input("fullname", sql.NVarChar, fullname)
    //   .input("email", sql.NVarChar, email)
    //   .input("password", sql.NVarChar, password)
    //   .input("phone", sql.NVarChar, phone)
    //   .input("userid", sql.Int, userId)
    //   .query(
    //     `UPDATE Users
    //      SET username = @username, fullname = @fullname, email = @email, password = @password, phone = @phone
    //      WHERE userid = @userid`
    //   );

    res
      .status(200)
      .json({ message: "User information has been updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//update thêm

module.exports = router;
