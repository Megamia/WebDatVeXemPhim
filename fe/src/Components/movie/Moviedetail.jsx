import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa";
import { FiCalendar, FiThumbsUp, FiUserCheck } from "react-icons/fi";
import { FaRegClock } from "react-icons/fa6";
import { Rate, Modal, Flex } from "antd";
import Cookies from "js-cookie";
import VideoModal from "../trailer/VideoModal";

const Moviedetail = ({ id }) => {
  const [movie, setMovie] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [like, setLike] = useState(false);
  const [isModalOpenModal, setIsModalOpenModal] = useState(false);
  const [rate, setRate] = useState(3);
  const [userRating, setUserRating] = useState(false);
  const [checkRate, setCheckRate] = useState(3);
  const [rating, setRating] = useState(0);
  const [dataActor, setDataActor] = useState("");
  const [dataDirector, setDataDirector] = useState("");
  const [dataCategory, setDataCategory] = useState("");
  const [dataManufacturer, setDataManufacturer] = useState("");

  const desc = ["terrible", "bad", "normal", "good", "wonderful"];

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
          setLike(true);
        } else {
          setLike(false);
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
        setLike(true);
      } else {
        setLike(false);
      }
    } catch (e) {
      console.log("Error:", e);
    }
  };
  const handleOpenRate = () => {
    setIsModalOpenModal(true);
  };
  const handleCloseRate = () => {
    setIsModalOpenModal(false);
  };
  const handleSetRate = async () => {
    const storedToken = Cookies.get("token");

    if (!storedToken) {
      console.log("No token found.");
      return;
    }

    if (typeof rate !== "number" || rate < 1 || rate > 5) {
      console.log("Invalid rating value.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/danh-gia/${id}`,
        {
          rating: rate,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      if (response.data.status === 1) {
        setIsModalOpenModal(false);
        setUserRating(true)
      }
      fetchDataRating();
    } catch (e) {
      console.error("Error: ", e.response ? e.response.data : e.message);
    }
  };

  const test = (value) => {
    if (value === 0) {
      return;
    }
    setRate(value);
  };

  const fetchUserRating = async () => {
    const storedToken = Cookies.get("token");

    if (!storedToken) {
      console.log("No token found.");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/danh-gia/${id}/user`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      fetchDataRating();
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const fetchDataRating = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/danh-gia/${id}`
      );

      if (response.data.status === 1) {
        setRating(Math.floor(response.data.data.percentageAbove3));
        setUserRating(true);
      }
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/movies/${id}`
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phim:", error);
      }
    };
    fetchDataLike();
    fetchMovies();
    fetchDataRating();
    fetchUserRating();
    fetchDataMovies();
  }, [id]);

  const fetchDataMovies = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/artist/${id}`
      );
      const dienVien = response.data.dien_vien.map(dv => dv.ten).join(', ');
      setDataActor(dienVien);
      const daoDien = response.data.dao_dien.map(dv => dv.ten).join(', ');
      setDataDirector(daoDien);
      const nhaSanXuat = response.data.nha_san_xuat.map(dv => dv.ten).join(', ');
      setDataManufacturer(nhaSanXuat);
      const theLoai = response.data.the_loai.map(dv => dv.ten).join(', ');
      setDataCategory(theLoai);
    } catch (e) {
      console.log("Error: ", e);

    }
  }

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
                    <span className={like ? "text-red-500" : ""}>
                      {like ? "Đã thích" : "Thích"}
                    </span>
                  </div>
                  <div
                    onClick={handleOpenRate}
                    className="flex gap-1 text-[13px] items-center justify-center cursor-pointer text-[#283e59] py-1 px-2 rounded-[3px] bg-[#edf2f9] hover:bg-[#d0ddef]"
                  >
                    <FaStar className={userRating ? "text-red-500" : ""} />
                    <span className={userRating ? "text-red-500" : ""}>
                      {userRating ? "Đã đánh giá" : "Đánh giá"}
                    </span>
                  </div>
                  <Modal
                    open={isModalOpenModal}
                    onOk={handleSetRate}
                    onCancel={handleCloseRate}
                  >
                    <Flex className="gap-[10px]">
                      <Rate value={rate} tooltips={desc} onChange={test} />
                      <span className="ant-rate-text">{desc[rate - 1]}</span>
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
                    <span className="font-thin">{rating ? rating : 0}%</span>
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
              <Flex vertical gap={10} className="w-2/5 px-3 text-[15px] ">
                <p>
                  <strong>Diễn viên</strong>
                  <br />
                  <span className="text-red-400 font-bold">{dataActor ? dataActor : "Null"}</span>
                </p>
                <p>
                  <strong>Đạo diễn</strong>
                  <br />
                  <span className="text-red-400 font-bold">{dataDirector ? dataDirector : "Null"}</span>
                </p>
                <p>
                  <strong>Nhà sản xuất</strong>
                  <br />
                  <span className="text-red-400 font-bold">{dataManufacturer ? dataManufacturer : "Null"}</span>
                </p>
                <p>
                  <strong>Thể loại</strong>
                  <br />
                  <span className="text-red-400 font-bold">{dataCategory ? dataCategory : "Null"}</span>
                </p>
              </Flex>
            </div>
          </div>
        </div>
        <div className="bg-black bg-opacity-70 absolute top-0 left-0 w-full h-full"></div>
      </div>
      <VideoModal isOpen={isModalOpen} onClose={closeModal} videoId={videoId} />
    </div>
  );
};

export default Moviedetail;
