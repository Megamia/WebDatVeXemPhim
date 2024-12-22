import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { Select } from "antd";

const AddMovieForm = ({ onAddSuccess }) => {
  const [poster, setPoster] = useState(null);
  const [background, setBackground] = useState(null);
  const [ageLimits, setAgeLimits] = useState([]);
  const [movie, setMovie] = useState({
    ten_phim: "",
    mo_ta: "",
    khoi_chieu: "",
    thoi_luong: "",
    trailer: "",
    ten_phu: "",
    gioi_han_do_tuoi: "",
  });

  useEffect(() => {
    const fetchAgeLimits = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/do-tuoi`
        );
        setAgeLimits(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giới hạn độ tuổi:", error);
      }
    };

    fetchAgeLimits();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("poster", poster);
    formData.append("background", background);
    Object.keys(movie).forEach((key) => {
      formData.append(key, movie[key]);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/movies/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Thiết lập kiểu nội dung
          },
        }
      );

      console.log("Phim đã được thêm:", response.data);
      alert("Phim đã được thêm thành công!");
      onAddSuccess();
    } catch (error) {
      if (error.response) {
        // Yêu cầu đã được gửi và server đã trả về mã trạng thái ngoài 2xx
        console.error("Lỗi từ server:", error.response.data.message);
        alert("Có lỗi khi thêm phim: " + error.response.data.message);
      } else if (error.request) {
        // Yêu cầu đã được gửi nhưng không nhận được phản hồi
        console.error("Không nhận được phản hồi:", error.request);
        alert("Lỗi kết nối với server.");
      } else {
        // Có lỗi khác xảy ra
        console.error("Lỗi khi thiết lập yêu cầu:", error.message);
        alert("Lỗi khi thêm phim: " + error.message);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-lg"
    >
      <h1 className="text-3xl font-semibold text-center mb-6">Thêm Phim Mới</h1>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Tên Phim
        </label>
        <input
          type="text"
          name="ten_phim"
          value={movie.ten_phim}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Nhập tên phim"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Mô Tả
        </label>
        <textarea
          name="mo_ta"
          value={movie.mo_ta}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Nhập mô tả phim"
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Ngày Khởi Chiếu
        </label>
        <input
          type="date"
          name="khoi_chieu"
          value={movie.khoi_chieu}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Thời Lượng (phút)
        </label>
        <input
          type="number"
          name="thoi_luong"
          value={movie.thoi_luong}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Nhập thời lượng phim"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Trailer
        </label>
        <input
          type="url"
          name="trailer"
          value={movie.trailer}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Nhập link trailer"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Tên Phụ
        </label>
        <input
          type="text"
          name="ten_phu"
          value={movie.ten_phu}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Nhập tên phụ"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Giới Hạn Độ Tuổi
        </label>
        <Select
          value={movie.gioi_han_do_tuoi} // Giá trị hiện tại của độ tuổi
          onChange={(value) =>
            handleInputChange({ target: { name: "gioi_han_do_tuoi", value } })
          }
          className="w-full"
          placeholder="Chọn giới hạn độ tuổi"
        >
          {ageLimits.map((ageLimit) => (
            <Select.Option key={ageLimit.id} value={ageLimit.id}>
              {ageLimit.mo_ta}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Poster
        </label>
        <input
          type="file"
          name="poster"
          onChange={(e) => handleFileChange(e, setPoster)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Background
        </label>
        <input
          type="file"
          name="background"
          onChange={(e) => handleFileChange(e, setBackground)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
      >
        Thêm Phim
      </button>
    </form>
  );
};

export default AddMovieForm;
