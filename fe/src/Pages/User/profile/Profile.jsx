import React, { useState, useEffect } from "react";
import Footer from "../../../Components/footer/Footer";
import Header from "../../../Components/header/Header";
import { Flex, Input } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import DetailProfile from "./Swap/DetailProfile";
import Test3 from "./Swap/test3";
import Favorite from "./Swap/Favorite";

const Profile = () => {
  const [user, setUser] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPage, setCurrentPage] = useState("DetailProfile");

  const renderPage = () => {
    switch (currentPage) {
      //   case "Profile":
      //     return <Profile fetchData={fetchData} />;
      case "DetailProfile":
        return <DetailProfile reloadData={fetchData} />;
      case "Favorite":
        return <Favorite />;
      case "Admin":
        return <Test3 />;
      default:
        return null;
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const storedToken = Cookies.get("token");
    if (!storedToken) {
      Swal.fire({
        title: "Bạn chưa đăng nhập!",
        icon: "warning",
      });
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ho-so`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const { userInfo } = response.data;
      setUser(userInfo);
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Swal.fire({
        title: "Lỗi khi tải dữ liệu!",
        icon: "error",
      });
    }
  };

  return (
    <div className=" w-full min-h-screen bg-[#33173C] flex-col items-center flex">
      <Header />
      <Flex className=" max-w-[1140px] flex-1 mt-[110px] mb-[10px] w-full bg-[#140F29] border-[1px] border-white">
        <Flex
          vertical
          className=" min-h-[600px] border-white border-r-[1px] w-[300px] items-center "
        >
          <Flex vertical className="items-center p-[20px]">
            <img
              src="../../img/03ebd625cc0b9d636256ecc44c0ea324.png"
              alt="?"
              className="w-[50%]"
            />
            <span className="text-[25px] text-white">Username: {username}</span>
            <span className="text-[25px] text-white">Email: {email}</span>
          </Flex>
          <Flex vertical className=" flex-1 w-full text-center">
            <button
              onClick={() => handlePageChange("DetailProfile")}
              className="text-white text-[20px] hover:bg-blue-500 p-[20px]"
            >
              Thông tin tài khoản
            </button>
            <button
              onClick={() => handlePageChange("Favorite")}
              className="text-white text-[20px] hover:bg-blue-500 p-[20px]"
            >
              Favorite
            </button>
            <button
              onClick={() => handlePageChange("Admin")}
              className="text-white text-[20px] hover:bg-blue-500 p-[20px]"
            >
              Admin
            </button>
          </Flex>
        </Flex>
        <Flex className="flex-1">{renderPage()}</Flex>
      </Flex>
      <Footer className="bottom-0 absolute w-full justify-center" />
    </div>
  );
};

export default Profile;
