import React from "react";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import { useParams } from "react-router-dom";
import BuyTicketsNav from "../../Components/nav/BuyTicketsNav";

const BuyTickets = () => {
  const { id } = useParams();
  return (
    <div className="w-full bg-[#33173C] flex-col items-center flex">
      <Header />
      <div className="max-w-[1140px] w-full relative">
        <div className="mt-[100px] text-white w-full">
          <BuyTicketsNav active="chon-ghe"/>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuyTickets;
