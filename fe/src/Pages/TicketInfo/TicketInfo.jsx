import React, { useEffect, useState } from "react";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import { useParams } from "react-router-dom";
import BuyTicketsNav from "../../Components/nav/BuyTicketsNav";
import axios from "axios";
import { Flex, Input } from "antd";
import Barcode from "react-barcode";

const TicketInfo = () => {
  const { code } = useParams();
  const [navative, setNavative] = useState("thong-tin-ve");
  const [ve, setVe] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/thanh-toan/${code}`
        );
        setVe(response.data);
        console.log("Dữ liệu vé:", response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin vé:", error);
      }
    };
    fetchMovies();
  }, [code]);

  return (
    <div className="w-full bg-[#33173C] flex-col items-center flex">
      <Header />
      <div className="max-w-[1140px] w-full relative mt-[100px]">
        <div className="text-white bg-gray-100 rounded-md w-full overflow-hidden my-5">
          <BuyTicketsNav active={navative} />
          <div className="flex bg-gray-100 text-black mb-5">
            <Flex vertical gap={30} className="mx-3 text-left flex-1">
              <div className="rounded-md overflow-hidden bg-white">
                <div className="p-4 bg-gray-200 text-[#95B1D7]">
                  Thông tin cá nhân
                </div>
                <Flex vertical gap={10} className="p-4">
                  <span>Họ và tên</span>
                  <Input
                    size="large"
                    placeholder="Họ và tên"
                    disabled
                    value={ve[0]?.ho_ten || ""}
                  />
                  <span>Email</span>
                  <Input
                    size="large"
                    placeholder="Email"
                    disabled
                    value={ve[0]?.email || ""}
                  />
                  <span>Số điện thoại</span>
                  <Input
                    size="large"
                    placeholder="Số điện thoại"
                    disabled
                    value={ve[0]?.sdt || ""}
                  />
                </Flex>
              </div>
            </Flex>
            <div className="w-1/3 bg-gray-100 px-3 flex">
              <div className="rounded-md overflow-hidden bg-white flex-1">
                <div className="p-4 bg-gray-200 text-[#95B1D7]">
                  Thông tin vé
                </div>
                <Flex vertical className="p-4">
                  <p className="font-bold text-[20px]">
                    {ve[0]?.ten_phim || ""}
                  </p>
                  <p>
                    <span>Phòng: </span>
                    <span>{ve[0]?.ten_phong || ""}</span>
                  </p>
                  <p>
                    <span>Thời gian: </span>
                    <span>
                      {new Date(ve[0]?.thoi_gian || "").toLocaleString(
                        "vi-VN",
                        {
                          timeZone: "Asia/Ho_Chi_Minh",
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        }
                      )}
                    </span>
                  </p>
                  <p>
                    <span>Tổng tiền: </span>
                    <span>
                      {ve.length > 0
                        ? ve
                            .reduce((total, item) => total + item.gia, 0)
                            .toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "USD",
                            })
                        : "Loading..."}
                    </span>
                  </p>
                  <p>
                    <span>Ghế: </span>
                    <span>
                      {ve.length > 0
                        ? ve.map((ve) => (
                            <span className="font-bold">{ve.ten}, </span>
                          ))
                        : "Loading..."}
                    </span>
                  </p>
                </Flex>
              </div>
            </div>
            <div className="w-1/3 bg-gray-100 px-3 flex">
              <div className="rounded-md overflow-hidden bg-white flex-1">
                <div className="p-4 bg-gray-200 text-[#95B1D7]">Mã vé</div>
                <Flex vertical className="p-4">
                  <p className="text-[30px]">{ve[0]?.code || ""}</p>
                  {/* Hiển thị mã vạch */}
                  <div className="barcode">
                    <Barcode
                      value={ve[0]?.code || ""}
                      width={2} // Độ rộng của các thanh mã vạch
                      height={100} // Chiều cao của mã vạch
                      displayValue={true} // Hiển thị giá trị dưới mã vạch
                      fontSize={20} // Kích thước font của văn bản dưới mã vạch
                      background="#ffffff" // Màu nền
                      lineColor="#000000" // Màu các thanh mã vạch
                    />
                  </div>
                </Flex>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TicketInfo;
