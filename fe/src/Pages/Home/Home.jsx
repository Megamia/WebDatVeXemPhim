import React from "react";
import Header from "../../Components/header/Header";
const Home = () => {
  return (
    <div className="w-full bg-blue-300 flex justify-center">
      <Header />
      <div className="max-w-[1140px] w-full">
        <div
          className="w-full h-[700px]"
          style={{
            backgroundImage: `url('./img/testbackground.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="bg-blue-300 w-full h-[500px]" />
      </div>
    </div>
  );
};

export default Home;
