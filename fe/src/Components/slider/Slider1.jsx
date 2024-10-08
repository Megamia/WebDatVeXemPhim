import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

const Slider1 = () => {
  const [movies, setMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null); // Sử dụng useRef để lưu giá trị slideInterval

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/movies`
        );
        setMovies(response.data.slice(0, 7)); // Chỉ lấy 7 phim đầu tiên
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phim:", error);
      }
    };

    fetchMovies();
  }, []);

  // Hàm thiết lập lại interval
  const resetAutoSlide = () => {
    clearInterval(slideInterval.current); // Xóa interval cũ
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % movies.length);
    }, 5000); // 5 giây
  };

  // Tự động chuyển slide sau mỗi 5 giây
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % movies.length);
    }, 5000); // 5 giây

    // Xóa interval khi component unmount
    return () => clearInterval(slideInterval.current);
  }, [movies.length]);

  // Hàm xử lý khi click vào slider-item
  const handleSlideClick = (index) => {
    setCurrentSlide(index);
    resetAutoSlide(); // Sau khi người dùng click, tiếp tục tự động chuyển slide
  };

  return (
    <div className="slider relative">
      <div className="relative">
        {movies.length > 0 && (
          <>
            <img
              src={`${process.env.REACT_APP_API_URL}${movies[currentSlide].background}`}
              alt={movies[currentSlide].ten_phim}
              className="w-full h-[700px] object-cover"
            />
            <div className="bg-black absolute bg-opacity-10 w-full h-full top-0 left-0" />
          </>
        )}
      </div>
      <div className="overlay flex text-left absolute bottom-0 w-full">
        {movies.length > 0 && (
          <div className="active-slider flex flex-col justify-between">
            <div className="text-white mb-4 w-[300px]">
              <span className="text-gray-400">
                NOW PLAYING | SELECT THEATERS
              </span>
              <h1 className="text-2xl font-bold line-clamp-2">
                {movies[currentSlide].ten_phim}
              </h1>
            </div>
            <div className="flex items-center">
              <button className="flex items-center bg-purple-600 text-white px-4 py-2 rounded mr-4 gap-2">
                <FaPlay />
                <NavLink to={`${movies[currentSlide].trailer}`}>
                  TRAILER
                </NavLink>
              </button>
              <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded">
                GET TICKETS
              </button>
            </div>
          </div>
        )}
        <div className="flex space-x-4 justify-evenly">
          {movies.map((movie, index) => (
            <div
              key={index}
              onClick={() => handleSlideClick(index)}
              className="relative rounded-md group"
            >
              <img
                src={`${process.env.REACT_APP_API_URL}${movie.poster}`}
                alt={movie.ten_phim}
                className={`movie-poster cursor-pointer rounded-md  ${
                  index === currentSlide ? "active" : ""
                }`}
              />
              <div
                className={`absolute bg-black top-0 left-0 w-full h-full ${
                  index === currentSlide ? "bg-opacity-0" : "bg-opacity-25"
                }`}
              />
              <div className="absolute left-[50%] translate-x-[-50%] top-[-30px] w-[150px] justify-center bg-white group-hover:flex hidden rounded-md">
                <span className="truncate px-1">{movie.ten_phim}</span>{" "}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider1;
