import React, { useState, useEffect } from "react";
import { Flex, Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const DetailProfile = ({ reloadData }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [username, setUsername] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const Logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
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
      const { userInfo } = response.data.data;
      setUser(userInfo);
      setUsername(userInfo.username);
      setEmail(userInfo.email);
      if (editUsername.length === 0 && editEmail.length === 0) {
        setEditUsername(userInfo.username);
        setEditEmail(userInfo.email);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Swal.fire({
        title: "Lỗi khi tải dữ liệu!",
        icon: "error",
      });
    }
  };

  const handleUpdate = async () => {
    const storedToken = Cookies.get("token");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ho-so`,
        {
          username: username,
          email: email,
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      setEditUsername(username);
      setEditEmail(email);

      Swal.fire({
        title: "Cập nhật thành công!",
        icon: "success",
      });
      reloadData();
    } catch (error) {
      console.error("Error updating user data:", error);
      Swal.fire({
        title: "Có lỗi xảy ra khi cập nhật!",
        icon: "error",
      });
    }
  };

  return (
    <Flex vertical className="flex-1 p-[20px]">
      <Flex align="center">
        <span className="text-white text-[30px] w-[300px] text-left ">
          Username:
        </span>
        <Input
          placeholder="Tên tài khoản"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Flex>
      <Flex align="center">
        <span className="text-white text-[30px] w-[300px] text-left ">
          New password:
        </span>
        <Input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Flex>
      <Flex align="center">
        <span className="text-white text-[30px] w-[300px] text-left ">
          Email:
        </span>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Flex>
      <Flex gap={30} className="flex-1 justify-center items-center">
        <button
          onClick={Logout}
          className=" text-white text-[30px] bg-green-500 p-[10px] rounded-lg hover:bg-red-500 "
        >
          Đăng xuất
        </button>
        <button
          onClick={handleUpdate}
          className=" text-white text-[30px] bg-green-500 p-[10px] rounded-lg hover:bg-red-500 "
        >
          Cập nhật
        </button>
      </Flex>
    </Flex>
  );
};

export default DetailProfile;
