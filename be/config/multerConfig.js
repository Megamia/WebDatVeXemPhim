const multer = require('multer');
const path = require('path');

// Hàm tạo cấu hình multer với thư mục lưu trữ động
const createMulterConfig = (folder) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folder}/`); // Thư mục lưu trữ động
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Tên file theo timestamp
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép file ảnh!'));
    }
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // Giới hạn file ảnh 5MB
  });
};

module.exports = createMulterConfig;
