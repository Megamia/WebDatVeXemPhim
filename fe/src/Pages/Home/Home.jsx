import React from "react";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import "./Home.css";
import { NavLink } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

const Home = () => {
  const movies = [
    {
      title: "Spiderman Across The Spider-verse",
      rating: "9.6/10",
      image:
        "https://placehold.co/200x300?text=Spiderman+Across+The+Spider-verse",
      alt: "Spiderman Across The Spider-verse movie poster",
    },
    {
      title: "Captain America Civil War",
      rating: "8.6/10",
      image: "https://placehold.co/200x300?text=Captain+America+Civil+War",
      alt: "Captain America Civil War movie poster",
    },
    {
      title: "Interstellar",
      rating: "8.6/10",
      image: "https://placehold.co/200x300?text=Interstellar",
      alt: "Interstellar movie poster",
    },
    {
      title: "Godzil V/S Kong",
      rating: "8.6/10",
      image: "https://placehold.co/200x300?text=Godzil+V/S+Kong",
      alt: "Godzil V/S Kong movie poster",
    },
    {
      title: "John Wick Chapter 4",
      rating: "8.6/10",
      image: "https://placehold.co/200x300?text=John+Wick+Chapter+4",
      alt: "John Wick Chapter 4 movie poster",
    },
  ];
  return (
    <div className="w-full bg-[#33173C] flex-col items-center flex">
      <Header />
      <div className="max-w-[1140px] w-full bg-[#140F29]">
        <div className="background-image slider">
          <div className="overlay flex text-left">
            <div className="">
              <div className="text-white mb-4 w-[300px]">
                <span className="text-gray-400">
                  NOW PLAYING | SELECT THEATERS
                </span>
                <h1 className="text-2xl font-bold">
                  Spider-Man: Across The Spider-verse
                </h1>
              </div>
              <div className="flex items-center mb-4">
                <button className="flex items-center bg-purple-600 text-white px-4 py-2 rounded mr-4 gap-2">
                  <FaPlay />
                  <NavLink to="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
                    TRAILER
                  </NavLink>
                </button>
                <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded">
                  GET TICKETS
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <img
                src="https://placehold.co/100x150"
                alt="Spider-Man: Across The Spider-verse poster"
                className="movie-poster"
              />
              <img
                src="https://placehold.co/100x150"
                alt="Captain America: Civil War poster"
                className="movie-poster"
              />
              <img
                src="https://placehold.co/100x150"
                alt="Interstellar poster"
                className="movie-poster"
              />
              <img
                src="https://placehold.co/100x150"
                alt="Godzilla vs. Kong poster"
                className="movie-poster"
              />
              <img
                src="https://placehold.co/100x150"
                alt="John Wick: Chapter 4 poster"
                className="movie-poster"
              />
              <img
                src="https://placehold.co/100x150"
                alt="Life of Pi poster"
                className="movie-poster"
              />
              <img
                src="https://placehold.co/100x150"
                alt="Avatar poster"
                className="movie-poster"
              />
            </div>
          </div>
        </div>
        <div className="p-8 now-showing text-white ">
          <h1 className="text-left text-4xl mb-8">Now showing</h1>
          <div className="flex space-x-4">
            {movies.map((movie, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 w-[350px] rounded-lg justify-between flex flex-col text-left "
              >
                <img
                  src={movie.image}
                  alt={movie.alt}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl mb-2">{movie.title}</h2>
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
        <div className="bg-[#33173C] w-full h-[700px]" />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
