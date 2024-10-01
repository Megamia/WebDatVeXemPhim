import React from "react";
import Header from "../../Components/header/Header";
const Home = () => {
  return (
    <div className="w-full bg-blue-300 h-[1000px]">
      <Header />
      <div
        className="h-screen"
        style={{
          backgroundImage: `url('./img/testbackground.jpg')`,
          backgroundSize: "cover",
        }}
      ></div>
    </div>
  );
};

export default Home;
