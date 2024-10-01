import React, { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  return (
    <footer className="bg-[#0b0b2f] max-w-[1140px] h-[168px] w-full text-white py-8 text-left">
      <div className="flex justify-between px-5 relative h-full">
        <div className="text-sm flex items-end">
          <p className="">© 2022 TICKET FLICKS PVT LMT</p>
        </div>
        <div className="h-full flex items-start">
          <button
            className="flex items-center z-10 mb-2 lg:hidden"
            onClick={toggleMenu}
          >
            <IoMdMenu className="text-[35px]" />
          </button>
          <div
            className={`${
              isMenuOpen ? "flex" : "hidden"
            } lg:flex md:space-x-10 space-x-5 lg:relative absolute right-[15px] top-0 lg:bg-transparent bg-black lg:bg-opacity-100 bg-opacity-75 lg:p-0 p-2`}
          >
            <div className="w-[100px] md:w-auto">
              <h3 className="font-semibold mb-2 border-b-[1px] w-[30px] whitespace-nowrap">More</h3>
              <ul>
                <li><NavLink to='#'>About us</NavLink></li>
                <li><NavLink to='#'>Privacy policy</NavLink></li>
                <li className="text-ellipsis whitespace-nowrap overflow-hidden"><NavLink to='#'>Terms and condition</NavLink></li>
              </ul>
            </div>
            <div className="w-[100px] md:w-auto">
              <h3 className="font-semibold mb-2 border-b-[1px] w-[60px] whitespace-nowrap">Help center</h3>
              <ul>
                <li><NavLink to='#'>FAQ</NavLink></li>
                <li><NavLink to='#'>Help</NavLink></li>
                <li className="text-ellipsis whitespace-nowrap overflow-hidden"><NavLink to='#'>Customer care</NavLink></li>
              </ul>
            </div>
            <div className="w-[140px] md:w-auto">
              <h3 className="font-semibold mb-2 border-b-[1px] w-[50px] whitespace-nowrap">Contact us</h3>
              <ul>
                <li>1700 566 655</li>
                <li>1700 766 677</li>
                <li className="text-ellipsis whitespace-nowrap overflow-hidden">ticketflicks@email.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
