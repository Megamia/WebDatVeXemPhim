import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, message } from "antd";

const MovieScheduleEdit = ({ onUpdateSuccess, Id }) => {
  const [room, setRoom] = useState([]);
  const [movie, setMovie] = useState([]);
  const [suatchieu, setSuatchieu] = useState({
    id_phong: "",
    id_phim: "",
    gia: "",
    thoi_gian: "",
    tinh_trang: 0,
  });

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/movies`
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phim:", error);
      }
    };

    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/rooms`
        );
        setRoom(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phòng:", error);
      }
    };

    const fetchSuatChieu = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/suat-chieu/${Id}`
        );
        const data = response.data;
        if (data && data.length > 0) {
          const suatChieuData = data[0]; // Lấy phần tử đầu tiên trong mảng
          setSuatchieu({
            id_phong: suatChieuData.id_phong || "",
            id_phim: suatChieuData.id_phim || "",
            gia: suatChieuData.gia || "",
            thoi_gian: suatChieuData.thoi_gian || "",
            tinh_trang: suatChieuData.tinh_trang ?? 0,
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu suất chiếu:", error);
      }
    };

    fetchSuatChieu();
    fetchMovie();
    fetchRoom();
  }, [Id]);

  const formatDateForInput = (date) => {
    const localDate = new Date(date); // Convert the string to a Date object
    const year = localDate.getFullYear();
    const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
    const day = localDate.getDate().toString().padStart(2, "0");
    const hours = localDate.getHours().toString().padStart(2, "0");
    const minutes = localDate.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuatchieu((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/suat-chieu/edit/${Id}`,
        suatchieu
      );
      message.success("Đã cập nhật suất chiếu thành công!");
      onUpdateSuccess();
    } catch (error) {
      console.error("Lỗi khi thêm/sửa suất chiếu:", error);
      message.error("Có lỗi khi thêm/sửa suất chiếu.");
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().slice(0, 16);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-lg"
    >
      <h1 className="text-3xl font-semibold text-center mb-6">
        Chỉnh Sửa Suất Chiếu
      </h1>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Phim
        </label>
        <Select
          showSearch
          value={suatchieu.id_phim || undefined}
          onChange={(value) =>
            setSuatchieu((prev) => ({ ...prev, id_phim: value }))
          }
          className="w-full"
          placeholder="Chọn phim"
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {movie.map((item) => (
            <Select.Option key={item.id_phim} value={item.id_phim}>
              {item.ten_phim}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Phòng
        </label>
        <Select
          showSearch
          value={suatchieu.id_phong || undefined}
          onChange={(value) =>
            setSuatchieu((prev) => ({ ...prev, id_phong: value }))
          }
          className="w-full"
          placeholder="Chọn phòng"
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {room.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.ten_phong}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Giá ($)
        </label>
        <input
          type="number"
          name="gia"
          value={suatchieu.gia || ""}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Nhập giá"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Thời Gian
        </label>
        <input
          type="datetime-local"
          name="thoi_gian"
          value={suatchieu.thoi_gian ? formatDateForInput(suatchieu.thoi_gian) : ""}
          onChange={handleInputChange}
          min={tomorrowDate}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
      >
        Cập Nhật Suất Chiếu
      </button>
    </form>
  );
};

export default MovieScheduleEdit;
