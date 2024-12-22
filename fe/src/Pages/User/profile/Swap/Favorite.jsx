import React, { useState, useEffect } from "react";
import { Flex } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Favorite = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [username, setUsername] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [email, setEmail] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    fetchData();
    fetchDataLike();
  }, []);

  const fetchData = async () => {
    const storedToken = Cookies.get("token");
    if (!storedToken) {
      Swal.fire({
        title: "Bạn chưa đăng nhập!",
        icon: "warning",
      });
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ho-so`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const { userInfo } = response.data;
      setUser(userInfo);
      setUsername(userInfo.username);
      setEmail(userInfo.email);
      if (!editUsername && !editEmail) {
        setEditUsername(userInfo.username);
        setEditEmail(userInfo.email);
      }
    } catch (error) {
      console.error(
        "Error fetching user profile:",
        error.response?.data || error
      );
      Swal.fire({
        title: "Lỗi khi tải dữ liệu!",
        text: error.response?.data?.message || "Vui lòng thử lại.",
        icon: "error",
      });
    }
  };

  const fetchDataLike = async () => {
    const storedToken = Cookies.get("token");

    if (!storedToken) {
      console.log("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/list-yeu-thich`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      if (response.data.status === 1) {
        setFavoriteMovies(response.data.data || []);
      } else {
        setFavoriteMovies([]);
      }
    } catch (error) {
      console.error(
        "Error fetching favorite movies:",
        error.response?.data || error
      );
      Swal.fire({
        title: "Lỗi khi tải danh sách yêu thích!",
        text: error.response?.data?.message || "Vui lòng thử lại.",
        icon: "error",
      });
    }
  };

  return (
    <Flex vertical className="flex-1 p-[20px]">
      <h2 className="text-white text-[30px] mb-[20px] text-left">
        Phim yêu thích:
      </h2>
      <div className="w-full  overflow-y-auto">
        {favoriteMovies.length > 0 ? (
          <>
            <div className="flex gap-[10px] items-center mb-[10px] bg-[#2E2E3E] p-[10px] rounded-lg">
              <h3 className="text-[20px] text-white font-bold w-[30%]">
                Tên phim
              </h3>
              <h3 className="text-[20px] text-white font-bold flex-1">Mô tả</h3>
              <h3 className="text-[20px] text-white font-bold w-[100px] text-center">
                Hình ảnh
              </h3>
            </div>
            {favoriteMovies.map((movie) => (
              <a
                key={movie.id_phim}
                href={`/phim/${movie.id_phim}`}
                className="block mb-[20px] p-[10px] bg-[#1E1E2E] rounded-lg hover:bg-[#34344A] transition-colors"
                rel="noopener noreferrer"
              >
                <div className="flex gap-[10px] items-start">
                  <h3 className="text-[20px] text-white font-bold w-[30%]">
                    {movie.ten_phim}
                  </h3>
                  <div className="flex-1">
                    <p className="text-[16px] text-white">{movie.mo_ta}</p>
                  </div>
                  <img
                    src={`${process.env.REACT_APP_API_URL}${movie.poster}`}
                    alt={movie.poster}
                    className="w-[100px] h-[150px] object-cover"
                  />
                </div>
              </a>
            ))}
          </>
        ) : (
          <p className="text-white">Chưa có phim yêu thích nào.</p>
        )}
      </div>
    </Flex>
  );
};
export default Favorite;
