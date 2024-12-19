import React from "react";
import { LuLayoutGrid } from "react-icons/lu";
import { Breadcrumb } from "antd";
import { PiCaretRightThin } from "react-icons/pi";
import { FiShoppingBag } from "react-icons/fi";
import { BsCreditCard } from "react-icons/bs";
import { HiInbox } from "react-icons/hi2";

const BuyTicketsNav = ({ active }) => {
  return (
    <div className="p-2 bg-gray-100 w-full flex justify-center">
      <Breadcrumb
        className="p-2"
        separator={
          <PiCaretRightThin className="text-gray-500 font-extralight mx-5 text-[40px]" />
        }
        items={[
          {
            title: (
              <div
                className={`flex flex-col items-center text-[17px] ${
                  active === "chon-ghe" ? "text-red-500" : "text-gray-500"
                }`}
              >
                <LuLayoutGrid />
                Chọn ghế
              </div>
            ),
          },
          {
            title: (
              <div
                className={`flex flex-col items-center text-[17px] ${
                  active === "thanh-toan" ? "text-red-500" : "text-gray-500"
                }`}
              >
                <BsCreditCard />
                Thanh toán
              </div>
            ),
          },
          {
            title: (
              <div
                className={`flex flex-col items-center text-[17px] ${
                  active === "thong-tin-ve" ? "text-red-500" : "text-gray-500"
                }`}
              >
                <HiInbox />
                Thông tin vé
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default BuyTicketsNav;
