import React, { useState, useEffect } from "react";
import Footer from '../../../Components/footer/Footer';
import Header from '../../../Components/header/Header';
import { Flex, Input } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    const [username, setUsername] = useState("");
    const [editUsername, setEditUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [email, setEmail] = useState("");
    const [editEmail, setEditEmail] = useState("");

    const Logout = () => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/")
    }

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
    const handleUpdate = () => {
        const storedToken = Cookies.get("token");
    
        axios
            .post(
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
            )
            .then((response) => {
                setEditUsername(username);
                setEditEmail(email);
                fetchData();
                Swal.fire({
                    text: "Sửa thông tin thành công",
                    icon: "success",
                });
                // alert("Sửa thông tin thành công");
            })
            .catch((error) => {
                console.error("Lỗi khi cập nhật thông tin:", error);
                Swal.fire({
                    text: "Sửa thông tin thất bại",
                    icon: "error",
                });
                // alert("Sửa thông tin thất bại");
            });
    };
    

    return (
        <div className=" w-full min-h-screen bg-[#33173C] flex-col items-center flex">
            <Header />
            <Flex className=" max-w-[1140px] flex-1 mt-[110px] mb-[10px] w-full bg-[#140F29] border-[1px] border-white">
                <Flex vertical className='border-white border-r-[1px] w-[350px] items-center p-[20px]'>
                    <img
                        src="../../img/03ebd625cc0b9d636256ecc44c0ea324.png"
                        alt="?"
                        className="w-[50%]"
                    />
                    <span className='text-[25px] text-white'>Username: {editUsername}</span>
                    <span className='text-[25px] text-white'>Email: {editEmail}</span>
                </Flex>
                <Flex vertical className='flex-1 p-[20px]'>
                    <Flex align='center'>
                        <span className='text-white text-[30px] w-[300px] text-left '>
                            Username:
                        </span>
                        <Input placeholder='Tên tài khoản' value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Flex>
                    <Flex align='center'>
                        <span className='text-white text-[30px] w-[300px] text-left '>
                            New password:
                        </span>
                        <Input type="password" placeholder='Mật khẩu mới' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </Flex><Flex align='center'>
                        <span className='text-white text-[30px] w-[300px] text-left '>
                            Email:
                        </span>
                        <Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Flex>
                    <Flex gap={30} className="flex-1 justify-center items-center">
                        <button onClick={Logout} className=" text-white text-[30px] bg-green-500 p-[10px] rounded-lg hover:bg-red-500 ">Đăng xuất</button>
                        <button onClick={handleUpdate} className=" text-white text-[30px] bg-green-500 p-[10px] rounded-lg hover:bg-red-500 ">Cập nhật</button>
                    </Flex>
                </Flex>
            </Flex>
            <Footer className="bottom-0 absolute w-full justify-center" />
        </div>
    );
}

export default Profile;