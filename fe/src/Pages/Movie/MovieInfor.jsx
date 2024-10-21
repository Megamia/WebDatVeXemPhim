import React from "react";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import { useParams } from "react-router-dom";
import Moviedetail from "../../Components/movie/Moviedetail";
import MovieNav from "../../Components/nav/MovieNav";

const MovieInfor = () => {
  const { id } = useParams();
  return (
    <div className="w-full bg-[#33173C] flex-col items-center flex">
      <Header />
      <div className="max-w-[1140px] w-full bg-[#140F29] relative mb-[30px]">
        <Moviedetail id={id} />
        <MovieNav id={id} active='phim'/>
        <div className="h-[400px]"></div>
        
      </div>
      <Footer />
    </div>
  );
};

export default MovieInfor;
