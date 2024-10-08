import React, { useState, useEffect } from "react";
import axios from "axios";

const Slider2 = ({ id }) => {
  const [movies, setMovies] = useState([]);
  const type = [
    {
      id: 1,
      name: "Đang chiếu",
    },
    { id: 2, name: "Sắp chiếu" },
  ];

  const matchingType = type.find((item) => item.id === id);

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
  return (
    <div className="px-8 pt-8 now-showing text-white ">
      <h1 className="text-left text-4xl mb-8">
        {matchingType ? matchingType.name : "ID not found"}
      </h1>
      <div className="flex space-x-4">
        {movies.slice(0, 5).map((movie, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 w-[350px] rounded-lg justify-between flex flex-col text-left "
          >
            <img
              src={`${process.env.REACT_APP_API_URL}${movie.poster}`}
              alt={movie.alt}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl mb-2 line-clamp-2">{movie.ten_phim}</h2>
            <p className="text-yellow-400 mb-4">
              <i className="fas fa-star"></i> {movie.rating}
            </p>
            <button className="border border-white py-2 px-4 rounded-lg hover:bg-white hover:text-black transition">
              BOOK NOW
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider2;
