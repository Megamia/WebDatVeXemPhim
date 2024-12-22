const express = require("express");
const router = express.Router();
const createMulterConfig = require("../../config/multerConfig"); // Import hàm cấu hình multer
const db = require("../../config/db"); // Import kết nối MySQL
const multer = require("multer");
const fs = require("fs");

router.get("/", (req, res) => {
  const query = "SELECT * FROM phim"; // Câu lệnh SQL lấy tất cả phim
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi khi lấy danh sách phim." });
    }
    res.status(200).json(results); // Phản hồi danh sách phim
  });
});

router.get("/:id", (req, res) => {
  const movieId = req.params.id; // Lấy ID phim từ tham số URL
  const query = "SELECT * FROM phim WHERE id_phim = ?";

  db.query(query, [movieId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy thông tin phim:", err.sqlMessage); // Log lỗi
      return res.status(500).json({ message: "Lỗi khi lấy thông tin phim." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Phim không tồn tại." }); // Nếu không tìm thấy phim
    }

    res.status(200).json(results[0]); // Phản hồi thông tin phim
  });
});

// Sử dụng multer với thư mục 'products'
const uploadMovie = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "poster") {
        cb(null, "uploads/posters/"); // Lưu vào thư mục 'posters'
      } else if (file.fieldname === "background") {
        cb(null, "uploads/backgrounds/"); // Lưu vào thư mục 'backgrounds'
      } else {
        cb(new Error("Loại file không được hỗ trợ!"));
      }
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname); // Tên file unique với timestamp
    },
  }),
});

// Route thêm mới product và upload ảnh
router.post(
  "/add",
  uploadMovie.fields([
    { name: "poster", maxCount: 1 }, // Ảnh poster
    { name: "background", maxCount: 1 }, // Ảnh background
  ]),
  (req, res) => {
    const {
      ten_phim,
      mo_ta,
      khoi_chieu,
      thoi_luong,
      trailer,
      ten_phu,
      gioi_han_do_tuoi,
    } = req.body;

    const poster = req.files["poster"] ? req.files["poster"][0].filename : null;
    const background = req.files["background"]
      ? req.files["background"][0].filename
      : null;

    const posterPath = poster ? `/uploads/posters/${poster}` : null;
    const backgroundPath = background
      ? `/uploads/backgrounds/${background}`
      : null;

    const query =
      "INSERT INTO phim (ten_phim, mo_ta, khoi_chieu, thoi_luong, trailer, ten_phu, poster, background, gioi_han_do_tuoi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(
      query,
      [
        ten_phim,
        mo_ta,
        khoi_chieu,
        thoi_luong,
        trailer,
        ten_phu,
        posterPath,
        backgroundPath,
        gioi_han_do_tuoi,
      ],
      (err, result) => {
        if (err) {
          console.error("Lỗi khi thêm phim:", err.sqlMessage); // Log lỗi cụ thể

          // Kiểm tra loại lỗi để trả về mã trạng thái phù hợp
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Phim đã tồn tại." }); // Mã trạng thái 409: Conflict
          }

          return res
            .status(500)
            .json({ message: "Lỗi khi thêm phim: " + err.sqlMessage }); // Phản hồi lỗi với thông điệp cụ thể
        }

        console.log("Phim đã được thêm:", result); // Log kết quả thành công
        res.status(201).json({
          message: "Phim đã được thêm!",
          movieId: result.insertId,
        });
      }
    );
  }
);

router.put(
  "/update/:id",
  uploadMovie.fields([
    { name: "poster", maxCount: 1 }, // Ảnh poster
    { name: "background", maxCount: 1 }, // Ảnh background
  ]),
  (req, res) => {
    const movieId = req.params.id; // Lấy id từ tham số
    const {
      ten_phim,
      mo_ta,
      khoi_chieu,
      thoi_luong,
      trailer,
      ten_phu,
      gioi_han_do_tuoi,
    } = req.body;

    // Kiểm tra giá trị gioi_han_do_tuoi
    if (!gioi_han_do_tuoi) {
      return res
        .status(400)
        .json({ message: "Giới hạn độ tuổi không được để trống." });
    }

    // Truy vấn để lấy file cũ từ cơ sở dữ liệu
    const querySelect = "SELECT poster, background FROM phim WHERE id_phim = ?";
    db.query(querySelect, [movieId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi lấy thông tin phim." });
      }

      const oldPoster = results[0]?.poster;
      const oldBackground = results[0]?.background;

      // Xác định tệp poster và background mới
      const poster = req.files["poster"]
        ? req.files["poster"][0].filename
        : null; // Không có giá trị nếu không có tệp mới

      const background = req.files["background"]
        ? req.files["background"][0].filename
        : null; // Không có giá trị nếu không có tệp mới

      // Chỉ xóa tệp cũ nếu có tệp mới được tải lên
      if (req.files["poster"] && oldPoster) {
        fs.unlink(`uploads/posters/${oldPoster.split("/").pop()}`, (err) => {
          if (err) console.error("Lỗi khi xóa poster cũ:", err);
        });
      }

      if (req.files["background"] && oldBackground) {
        fs.unlink(
          `uploads/backgrounds/${oldBackground.split("/").pop()}`,
          (err) => {
            if (err) console.error("Lỗi khi xóa background cũ:", err);
          }
        );
      }

      // Xây dựng đường dẫn chính xác cho poster và background
      const posterPath = poster ? `/uploads/posters/${poster}` : oldPoster; // Sử dụng oldPoster nếu không có poster mới
      const backgroundPath = background
        ? `/uploads/backgrounds/${background}`
        : oldBackground; // Sử dụng oldBackground nếu không có background mới

      // Truy vấn để cập nhật phim
      const queryUpdate =
        "UPDATE phim SET ten_phim = ?, mo_ta = ?, khoi_chieu = ?, thoi_luong = ?, trailer = ?, ten_phu = ?, poster = ?, background = ?, gioi_han_do_tuoi = ? WHERE id_phim = ?";

      db.query(
        queryUpdate,
        [
          ten_phim,
          mo_ta,
          khoi_chieu,
          thoi_luong,
          trailer,
          ten_phu,
          posterPath,
          backgroundPath,
          gioi_han_do_tuoi,
          movieId,
        ],
        (err, result) => {
          if (err) {
            console.error("Lỗi khi cập nhật phim:", err.sqlMessage);
            return res
              .status(500)
              .json({ message: "Lỗi khi cập nhật phim: " + err.sqlMessage });
          }

          console.log("Phim đã được cập nhật:", result);
          res.status(200).json({ message: "Phim đã được cập nhật!" });
        }
      );
    });
  }
);

module.exports = router;
