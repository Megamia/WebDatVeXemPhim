import React, { useState, useEffect } from "react";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import { useParams, useNavigate } from "react-router-dom";
import Moviedetail from "../../Components/movie/Moviedetail";
import MovieNav from "../../Components/nav/MovieNav";
import axios from "axios";

const MovieShowtimes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lichchieu, setLichchieu] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const getNext7Days = () => {
    const days = [];
    const currentDate = new Date();

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);
      days.push(nextDate);
    }

    return days;
  };
  const days = getNext7Days();
  const weekDays = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/lich-chieu/${id}`
        );
        setLichchieu(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phim:", error);
      }
    };

    fetchMovies();
  }, [id]);

  const handleButtonClick = (id) => {
    navigate(`/mua-ve/${id}`);
  };
  return (
    <div className="w-full bg-[#33173C] flex-col items-center flex">
      <Header />
      <div className="max-w-[1140px] w-full bg-[#0b0b2f] relative mb-[30px]">
        <Moviedetail id={id} />
        <MovieNav id={id} active="lich-chieu" />
        <div className="h-[400px]">
          <div className="flex p-3 w-full flex-col">
            <ul className="flex w-full text-white rounded-md overflow-hidden">
              {days.map((date, index) => (
                <li
                  key={index}
                  className={`py-4 px-10 flex-1 ${
                    selectedDateIndex === index ? "bg-gray-800" : "bg-gray-700"
                  } hover:bg-gray-800 cursor-pointer`}
                  onClick={() => setSelectedDateIndex(index)}
                >
                  <strong className="text-[20px] font-thin">{`${date.getDate()}/${
                    date.getMonth() + 1
                  }`}</strong>
                  <br />
                  <span className="text-[15px]">{weekDays[date.getDay()]}</span>
                </li>
              ))}
            </ul>
            <ul className="flex flex-wrap gap-2 pt-2">
              {lichchieu.map((lichchieu) => {
                const isDisabled = false;
                return (
                  <button
                    key={lichchieu.id}
                    disabled={isDisabled}
                    onClick={() => handleButtonClick(lichchieu.id)} // Sự kiện chuyển trang
                    className={`p-2 rounded-md 
                      ${
                        isDisabled
                          ? "bg-gray-400"
                          : "bg-white hover:bg-gray-200"
                      }
                    `}
                  >
                    <li>
                      {new Date(lichchieu.thoi_gian).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </li>
                  </button>
                );
              })}
            </ul>
          </div>
          <div></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieShowtimes;
