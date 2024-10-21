import React from "react";
import { NavLink } from "react-router-dom";

const MovieNav = ({ id, active }) => {
  return (
    <div className="text-white p-2 bg-[#33173C]">
      <ul className=" flex justify-start gap-3 ">
        <li className={`hover:text-[#d0ddef] p-2 ${active === 'phim' ? 'border-b-2 border-[#d0ddef]' : ''}`} >
          <NavLink className="" to={`/phim/${id}`}>
            Thông tin phim
          </NavLink>
        </li>
        <li className={`hover:text-[#d0ddef] p-2 ${active === 'lich-chieu' ? 'border-b-2 border-[#d0ddef]' : ''}`}>
          <NavLink className="" to={`/lich-chieu/${id}`}>
            Lịch chiếu
          </NavLink>
        </li>
        <li className={`hover:text-[#d0ddef] p-2 ${active === 'danh-gia' ? 'border-b-2 border-[#d0ddef]' : ''}`}>
          <NavLink className="" to={`/phim/${id}`}>
            Đánh giá
          </NavLink>
        </li>
        <li className={`hover:text-[#d0ddef] p-2 ${active === 'mua-ve' ? 'border-b-2 border-[#d0ddef]' : ''}`}>
          <NavLink className="" to={`/phim/${id}`}>
            Mua vé
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default MovieNav;
