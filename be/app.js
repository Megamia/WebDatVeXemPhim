const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;

app.use(express.json()); // Để xử lý JSON request body
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const path = require("path");

// Cho phép truy cập các file tĩnh
app.use(
  "/uploads/posters/",
  express.static(path.join(__dirname, "uploads/posters/"))
);
app.use(
  "/uploads/backgrounds/",
  express.static(path.join(__dirname, "uploads/backgrounds/"))
);

// Import routes
const userRoutes = require("./routes/client/user");
const movieRoutes = require("./routes/admin/movie");
const roomRoutes = require("./routes/client/room");
const lichchieuRoutes = require("./routes/client/lichchieu");
const suatchieuRoutes = require("./routes/client/suatchieu");
const thanhtoanRoutes = require("./routes/client/thanhtoan");
const theloaiRoutes = require("./routes/admin/category");
const nghesiRoutes = require("./routes/admin/artist");
const dotuoiRoutes = require("./routes/admin/AgeLimit");
const artistRoutes = require("./routes/admin/artistNmovie");
const suatchieuadminRoutes = require("./routes/admin/movieschedule");
const { checkAndUpdateSuatChieu } = require("./routes/admin/checktinhtrang");
const dangnhapRoutes = require("./routes/client/Login/login");
const dangkyRoutes = require("./routes/client/Signup/signup");
const hosoRoutes = require("./routes/client/Profile/profile");
const yeuthichRoutes = require("./routes/client/Like/like");
const listyeuthichRoutes = require("./routes/client/ListLike/listlike");
const danhgiaRoutes = require("./routes/client/Rate/rate");

app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/lich-chieu", lichchieuRoutes);
app.use("/api/suat-chieu", suatchieuRoutes);
app.use("/api/thanh-toan", thanhtoanRoutes);
app.use("/api/the-loai", theloaiRoutes);
app.use("/api/nghe-si", nghesiRoutes);
app.use("/api/admin/do-tuoi", dotuoiRoutes);
app.use("/api/admin/artist", artistRoutes);
app.use("/api/admin/suat-chieu", suatchieuadminRoutes);
checkAndUpdateSuatChieu();
setInterval(checkAndUpdateSuatChieu, 10 * 60 * 1000);
app.use("/api/dang-nhap", dangnhapRoutes);
app.use("/api/dang-ky", dangkyRoutes);
app.use("/api/ho-so", hosoRoutes);
app.use("/api/yeu-thich", yeuthichRoutes);
app.use("/api/list-yeu-thich", listyeuthichRoutes);
app.use("/api/danh-gia", danhgiaRoutes);
// Chạy server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
