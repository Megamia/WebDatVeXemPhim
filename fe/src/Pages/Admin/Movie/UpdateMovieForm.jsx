import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateMovieForm = ({ movieId }) => {
  const [movie, setMovie] = useState({
    ten_phim: "",
    mo_ta: "",
    khoi_chieu: "",
    thoi_luong: "",
    trailer: "",
    ten_phu: "",
    gioi_han_do_tuoi: 0,
    poster: null,
    background: null,
  });

  useEffect(() => {
    // Lấy thông tin phim hiện tại để hiển thị
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/movies/${movieId}`
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin phim:", error);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeFile = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      // Kiểm tra xem có file được chọn không
      const file = files[0];
      const imageUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho ảnh mới
      setMovie((prev) => ({
        ...prev,
        [name]: file,
        [`${name}Preview`]: imageUrl, // Cập nhật URL tạm thời cho phần hiển thị ảnh
      }));
    } else {
      // Nếu không có file, giữ nguyên giá trị hiện tại mà không thay đổi
      setMovie((prev) => ({
        ...prev,
        [name]: prev[name], // Giữ giá trị cũ
        [`${name}Preview`]: prev[`${name}Preview`], // Giữ ảnh preview cũ
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("ten_phim", movie.ten_phim);
    formData.append("mo_ta", movie.mo_ta);
    formData.append("khoi_chieu", movie.khoi_chieu);
    formData.append("thoi_luong", movie.thoi_luong);
    formData.append("trailer", movie.trailer);
    formData.append("ten_phu", movie.ten_phu);
    formData.append("gioi_han_do_tuoi", movie.gioi_han_do_tuoi);

    // Kiểm tra và chỉ gửi file ảnh mới nếu người dùng đã chọn ảnh mới
    if (movie.poster && movie.poster instanceof File) {
      formData.append("poster", movie.poster);
    }
    if (movie.background && movie.background instanceof File) {
      formData.append("background", movie.background);
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/movies/update/${movieId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Phim đã được cập nhật!");
    } catch (error) {
      console.error("Lỗi khi cập nhật phim:", error);
      alert("Có lỗi xảy ra khi cập nhật phim.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-2">
      <input
        type="text"
        name="ten_phim"
        value={movie.ten_phim || ""} // Đảm bảo không bị undefined
        onChange={handleChange}
        placeholder="Tên phim"
        required
      />
      <textarea
        name="mo_ta"
        value={movie.mo_ta || ""} // Đảm bảo không bị undefined
        onChange={handleChange}
        placeholder="Mô tả"
        required
      />
      <input
        type="date"
        name="khoi_chieu"
        value={movie.khoi_chieu ? movie.khoi_chieu.split("T")[0] : ""} // Chỉ lấy phần ngày
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="thoi_luong"
        value={movie.thoi_luong || ""} // Đảm bảo không bị undefined
        onChange={handleChange}
        placeholder="Thời lượng"
        required
      />
      <input
        type="text"
        name="trailer"
        value={movie.trailer || ""} // Đảm bảo không bị undefined
        onChange={handleChange}
        placeholder="Trailer"
        required
      />
      <input
        type="text"
        name="ten_phu"
        value={movie.ten_phu || ""} // Đảm bảo không bị undefined
        onChange={handleChange}
        placeholder="Tên phụ"
        required
      />
      <input
        type="number"
        name="gioi_han_do_tuoi"
        value={movie.gioi_han_do_tuoi || ""} // Đảm bảo không bị undefined
        onChange={handleChange}
        placeholder="Giới hạn độ tuổi"
        required
      />

      {/* Hiển thị ảnh cũ hoặc ảnh mới nếu có */}
      {movie.poster && (
        <div>
          <h3>Poster Hiện Tại:</h3>
          <img
            src={
              movie.posterPreview ||
              `${process.env.REACT_APP_API_URL}${movie.poster}`
            } // Hiển thị ảnh mới nếu có, nếu không thì hiển thị ảnh cũ
            alt="Poster"
            width="200"
          />
          <p>
            {typeof movie.poster === "string"
              ? movie.poster.split("/").pop() // Nếu poster là chuỗi, lấy tên file từ đường dẫn
              : movie.poster.name}{" "}
            {/* Nếu poster là File object, hiển thị tên file */}
          </p>
        </div>
      )}

      <input
        type="file"
        name="poster"
        accept="image/*"
        onChange={handleChangeFile}
        id="poster"
        className="hidden"
      />
      <label
        htmlFor="poster"
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer w-[200px] hover:bg-blue-600"
      >
        Chọn file
      </label>

      {/* Hiển thị ảnh nền cũ hoặc ảnh mới nếu có */}
      {movie.background && (
        <div>
          <h3>Ảnh Nền Hiện Tại:</h3>
          <img
            src={
              movie.backgroundPreview ||
              `${process.env.REACT_APP_API_URL}${movie.background}`
            } // Hiển thị ảnh mới nếu có, nếu không thì hiển thị ảnh cũ
            alt="Background"
            width="200"
          />
          <p>
            {typeof movie.background === "string"
              ? movie.background.split("/").pop() // Nếu background là chuỗi, lấy tên file từ đường dẫn
              : movie.background.name}{" "}
            {/* Nếu background là File object, hiển thị tên file */}
          </p>
        </div>
      )}

      <input
        type="file"
        name="background"
        accept="image/*"
        onChange={handleChangeFile}
        id="background"
        className="hidden"
      />
      <label
        htmlFor="background"
        className="bg-blue-500 text-white px-4 py-2 rounded w-[200px] cursor-pointer hover:bg-blue-600"
      >
        Chọn file
      </label>

      <button type="submit">Cập nhật phim</button>
    </form>
  );
};

export default UpdateMovieForm;
