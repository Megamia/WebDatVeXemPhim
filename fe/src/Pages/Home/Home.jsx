import React from "react";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import "./Home.css";
import Slider1 from "../../Components/slider/Slider1";
import Slider2 from "../../Components/slider/Slider2";

const Home = () => {
  return (
    <div className="w-full bg-[#33173C] flex-col items-center flex">
      <Header />
      <div className="max-w-[1140px] w-full bg-[#140F29]">
        <Slider1 />
        <Slider2 id={1} />
        <Slider2 id={2} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
