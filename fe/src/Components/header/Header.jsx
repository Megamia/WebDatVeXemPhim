import React, { useState  } from "react";
import { FiSearch } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { FaUser, FaAngleDown } from "react-icons/fa";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { IoMdMenu } from "react-icons/io";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  return (
    <div className="bg-black bg-opacity-45 w-full flex justify-center pt-[20px] absolute z-20">
      <div className="max-w-[1140px] w-full bg-transparent h-full flex justify-between items-end px-3">
        <div className="h-full w-[100px] flex justify-center items-center mb-2">
          <img className="w-[80px]" src="./img/logowebsite.png" alt="logo" />
        </div>
        <div className="flex gap-5 text-[20px] justify-center items-center text-white">
          <div className="relative group flex items-center">
            <button className="mb-3 flex items-center gap-1">
              <FiSearch className="absolute top-[5px] left-[-22px] group-focus-within:translate-x-[29px] group-focus-within:top-[7px] group-focus-within:text-black text-[20px] text-white" />
              <span className="group-focus-within:hidden">Tìm kiếm</span>
            </button>
            <div className="hidden mb-2 group-focus-within:flex gap-1 items-center text-black bg-white py-1 px-2 rounded-[20px]">
              <input
                className="bg-transparent outline-none md:w-[350px] w-[150px] text-[17px] ml-6"
                placeholder="Tìm kiếm"
              />
            </div>
          </div>
          <NavLink className="mb-3 hidden sm:flex whitespace-nowrap" to="#">
            Trang chủ
          </NavLink>
          <div className="flex items-center">
            <button className="flex items-center mb-2 lg:hidden" onClick={toggleMenu}>
              <IoMdMenu className="text-[35px]" />
            </button>
            <div
              className={`${
                isMenuOpen ? "block" : "hidden"
              } absolute lg:relative right-9 lg:right-0 lg:p-0 p-3 lg:bg-transparent bg-black lg:top-0 top-[101px] gap-5 lg:flex`}
            >
              <NavLink className="lg:mb-3 mb-0 whitespace-nowrap" to="#">
                Lịch chiếu
              </NavLink>
              <div className="relative group pb-0 lg:pb-3">
                <button className="dropdown flex items-center gap-1">
                  Phim <FaAngleDown className="text-[20px] text-white" />
                </button>
                <div className="dropdown-content right-0 lg:mt-3 text-left hidden absolute bg-white group-hover:block">
                  <NavLink
                    to="#"
                    className="block px-4 py-1 whitespace-nowrap text-black"
                  >
                    Đang chiếu
                  </NavLink>
                  <NavLink
                    to="#"
                    className="block px-4 py-1 whitespace-nowrap text-black"
                  >
                    Sắp chiếu
                  </NavLink>
                  <NavLink
                    to="#"
                    className="block px-4 py-1 whitespace-nowrap text-black"
                  >
                    Phim tháng ../..
                  </NavLink>
                </div>
              </div>
              <NavLink
                className="lg:mb-3 pb-0 whitespace-nowrap flex items-center gap-1"
                to="#"
              >
                <AiOutlineQuestionCircle className="text-[20px] text-white" />
                Hỗ trợ
              </NavLink>
            </div>
          </div>
          <NavLink className="mb-3" to="#">
            <FaUser className="text-white text-[25px] mx-2" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;
