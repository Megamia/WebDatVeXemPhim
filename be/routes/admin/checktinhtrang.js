
const db = require("../../config/db");

const checkAndUpdateSuatChieu = () => {
    const query = "SELECT * FROM suat_chieu WHERE thoi_gian < NOW() AND tinh_trang = 0";
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Lỗi khi truy vấn dữ liệu suất chiếu:", err);
        return;
      }
  
      if (results.length > 0) {
        // Duyệt qua tất cả các suất chiếu đã qua và cập nhật tình trạng
        results.forEach((suatChieu) => {
          const updateQuery = `
            UPDATE suat_chieu
            SET tinh_trang = 2
            WHERE id = ?
          `;
          db.query(updateQuery, [suatChieu.id], (updateErr, updateResults) => {
            if (updateErr) {
              console.error("Lỗi khi cập nhật tình trạng suất chiếu:", updateErr);
            } else {
              console.log(`Đã cập nhật tình trạng suất chiếu với ID: ${suatChieu.id}`);
            }
          });
        });
      } else {
        console.log("Không có suất chiếu nào cần cập nhật tình trạng.");
      }
    });
  };
  
  module.exports = { checkAndUpdateSuatChieu };
  