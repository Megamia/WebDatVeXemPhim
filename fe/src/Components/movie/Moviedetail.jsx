import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa";
import { FiCalendar, FiThumbsUp, FiUserCheck } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa6";
import { Rate, Modal, Flex } from 'antd';
import Cookies from "js-cookie";
import VideoModal from "../trailer/VideoModal";

const Moviedetail = ({ id }) => {
  const [movie, setMovie] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [like, setLike] = useState(false);
  const [rate, setRate] = useState(false);
  const [value, setValue] = useState("3");
  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

  const isLoggedIn = document.cookie.includes("token=");
  const openModal = (id) => {
    setVideoId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setVideoId("");
  };

  const handleLike = async () => {
    const storedToken = Cookies.get("token");

    if (!isLoggedIn) {
      alert("Phải đăng nhập trước");
      return;
    }

    setLike((like) => !like);

    try {

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/yeu-thich/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.data.status === 1) {
        if (response.data.desc === "insert") {
          console.log("Thêm thành công");
          setLike(true)
        } else {
          console.log("Xóa thành công");
          setLike(false)
        }
      } else {
        console.log("Có lỗi xảy ra");
      }
    } catch (e) {
      console.log("Error: ", e);
      alert("Có lỗi xảy ra khi thực hiện hành động yêu thích");
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
        `${process.env.REACT_APP_API_URL}/api/yeu-thich/${id}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.data.status === 1) {
        setLike(true)
      } else {
        setLike(false)
      }
    } catch (e) {
      console.log("Error:", e);
    }
  };


  const handleRate = () => {
    setRate(rate => !rate);
  }

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/movies/${id}`
        );
        setMovie(response.data);;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phim:", error);
      }
    };
    fetchDataLike();
    fetchMovies();
  }, [id]);

  return (
    <div className="relative">
      <div
        className="w-full pt-[100px]"
        style={{
          backgroundImage: `url(${process.env.REACT_APP_API_URL}${movie.background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative bg-transparent flex z-10 justify-between p-3 w-full h-full">
          <div className="max-w-[20%] inline-block p-3">
            <img
              src={`${process.env.REACT_APP_API_URL}${movie.poster}`}
              alt={movie.ten_phim}
              className="w-full object-cover rounded-md border"
            />
          </div>
          <div className="h-full w-full p-3 text-left text-white">
            <div className="mb-3 w-full">
              <h1 className="text-[26px] font-medium capitalize truncate mb-0">
                {movie.ten_phim}
              </h1>
              <p className="text-[#95aac9] text-[15px]">{movie.ten_phu}</p>
            </div>
            <div className="w-full gap-3 flex">
              <div className="flex-1">
                <div className="mb-3 flex gap-1">
                  <div
                    onClick={handleLike}
                    className="flex gap-1 text-[13px] items-center justify-center cursor-pointer text-[#283e59] py-1 px-2 rounded-[3px] bg-[#edf2f9] hover:bg-[#d0ddef]"
                  >
                    <FaHeart className={like ? "text-red-500" : ""} />
                    <span className={like ? "text-red-500" : ""}>{like ? "Đã thích" : "Thích"}</span>
                  </div>
                  <div
                    onClick={handleRate}
                    className="flex gap-1 text-[13px] items-center justify-center cursor-pointer text-[#283e59] py-1 px-2 rounded-[3px] bg-[#edf2f9] hover:bg-[#d0ddef]"
                  >
                    <FaStar /> Đánh giá
                  </div>
                  <Modal open={rate} onOk={handleRate} onCancel={handleRate} >
                    <Flex className="gap-[10px]">
                      <Rate value={value} tooltips={desc} onChange={setValue} />
                      <span className="ant-rate-text">{desc[value - 1]}</span>
                    </Flex>
                  </Modal>
                  <NavLink
                    to={`/trailer/${movie.id_phim}`}
                    onClick={(e) => {
                      e.preventDefault();
                      openModal(movie.trailer.split("v=")[1]);
                    }}
                    className="flex gap-1 text-[13px] items-center justify-center hover:text-[#283e59] text-[#edf2f9] py-1 px-2 rounded-[3px] bg-transparent hover:bg-[#d0ddef] border"
                  >
                    Trailer
                  </NavLink>
                  <NavLink
                    href="#"
                    className="flex gap-1 text-[13px] items-center justify-center text-[#edf2f9] py-1 px-2 rounded-[3px] hover:bg-red-600 bg-red-500"
                  >
                    Mua vé
                  </NavLink>
                </div>
                <p className="mb-3 text-[15px] text-justify">{movie.mo_ta}</p>
                <div className="text-[15px] font-normal flex justify-between items-start">
                  <div>
                    <strong className="gap-1 flex justify-center items-center">
                      <FiThumbsUp className="text-[17px]" />
                      <span>Hài lòng</span>
                    </strong>
                    <span className="font-thin">93%</span>
                  </div>
                  <div>
                    <strong className="gap-1">
                      <FiCalendar className="text-[17px] mb-1" />
                      <span>Khởi chiếu</span>
                    </strong>
                    <br />
                    <span className="font-thin">
                      {new Date(movie.khoi_chieu).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="">
                    <strong className="gap-1">
                      <FaRegClock className="text-[17px] mb-1" />
                      <span>Thời lượng</span>
                    </strong>
                    <br />
                    <span className="font-thin">{movie.thoi_luong} phút</span>
                  </div>
                  <div>
                    <strong className="">
                      <FiUserCheck className="text-[17px] mb-1" />
                      <span>Giới hạn tuổi</span>
                    </strong>
                    <br />
                    <span className="font-thin">{movie.gioi_han_do_tuoi}</span>
                  </div>
                </div>
              </div>
              <div className="w-2/5 px-3 text-[15px]">
                <p>
                  <strong>Diễn viên</strong>
                  <br />
                  <span>List</span>
                </p>
                <p>
                  <strong>Đạo diễn</strong>
                  <br />
                  <span>List</span>
                </p>
                <p>
                  <strong>Nhà sản xuất</strong>
                  <br />
                  <span>List</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-black bg-opacity-70 absolute top-0 left-0 w-full h-full"></div>
      </div>
      <VideoModal isOpen={isModalOpen} onClose={closeModal} videoId={videoId} />
    </div >
  );
};

export default Moviedetail;
