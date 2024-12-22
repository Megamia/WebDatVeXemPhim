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
        const { userId } = req.user;
        const query = "SELECT * FROM Users WHERE userid = ?";

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const userInfoFromDB = results[0];
            const isAdmin = userInfoFromDB["isAdmin"];

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
        const { userId } = req.user;

        if (!username || !email || !password || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

<<<<<<< HEAD
        // Kiểm tra xem người dùng có tồn tại trong cơ sở dữ liệu không
        const checkUserExistsQuery = `
      SELECT * FROM Users WHERE userid = ?
    `;
        db.query(checkUserExistsQuery, [userId], (err, userResults) => {
            if (err) {
                console.error("Database error:", err);
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }

            if (userResults.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            // Tiến hành cập nhật thông tin người dùng
            const query = `
=======
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
>>>>>>> 44fd4e0b884479c13b8d1afa3e994b2a79a2e3a2
        UPDATE Users 
        SET username = ?, email = ?, password = ? 
        WHERE userid = ?
      `;

<<<<<<< HEAD
            db.query(
                query,
                [username, email, password, userId],
                (err, results) => {
                    if (err) {
                        console.error("Database error:", err);
                        return res
                            .status(500)
                            .json({ message: "Internal server error" });
                    }

                    // Kiểm tra số dòng bị ảnh hưởng và thay đổi thực sự
                    if (results.changedRows > 0 || results.affectedRows > 0) {
                        return res.status(200).json({
                            message:
                                "User information has been updated successfully",
                        });
                    } else {
                        // Nếu không có thay đổi nhưng dữ liệu đã tồn tại
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
=======
      db.query(query, [username, email, hashedPassword, userId], (err, results) => {
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
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
>>>>>>> 44fd4e0b884479c13b8d1afa3e994b2a79a2e3a2
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
//update thêm

module.exports = router;
