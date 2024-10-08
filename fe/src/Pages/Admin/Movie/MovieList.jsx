import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateMovieForm from "./UpdateMovieForm";
import AddMovieForm from "./AddMovieForm";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [openAddForm, setOpenAddForm] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/movies`); // Thay đổi URL nếu cần
        setMovies(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phim:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleUpdateClick = (movieId) => {
    setSelectedMovieId(movieId); // Lưu ID phim đã chọn để cập nhật
  };

  const handleCloseUpdateForm = () => {
    setSelectedMovieId(null); // Đóng form cập nhật
  };

  const handleAddClick = () => {
    setOpenAddForm(true); // Lưu ID phim đã chọn để cập nhật
  };

  const handleCloseAddForm = () => {
    setOpenAddForm(false); // Đóng form cập nhật
  };

  return (
    <div className="bg-white text-left">
      <h1 className="text-center">Danh Sách Phim</h1>
      <button onClick={handleAddClick} className="text-blue-400">Thêm phim mới</button>
      {openAddForm && (
        <div className="bg-gray-300">
          <button onClick={handleCloseAddForm} className="text-red-400">Đóng</button>
          <AddMovieForm />
        </div>
      )}
      <ul className="p-2">
        {movies.map((movie) => (
          <li key={movie.id_phim} className="flex gap-3">
            <h2>{movie.ten_phim}</h2>
            <p>{movie.mo_ta}</p>
            <button onClick={() => handleUpdateClick(movie.id_phim)} className="text-blue-400">
              Cập nhật phim
            </button>
          </li>
        ))}
      </ul>
      {selectedMovieId && (
        <div className="bg-gray-300">
          <h2 className="text-center">Cập nhật phim</h2>
          <button onClick={handleCloseUpdateForm}  className="text-red-400">Đóng</button>
          <UpdateMovieForm movieId={selectedMovieId} />
        </div>
      )}
    </div>
  );
};

export default MovieList;
