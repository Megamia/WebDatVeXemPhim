import React, { useEffect, useState } from "react";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import { useParams } from "react-router-dom";
import BuyTicketsNav from "../../Components/nav/BuyTicketsNav";
import axios from "axios";

const Pay = () => {
  const { id } = useParams();
  const [suatchieu, setSuatchieu] = useState([]);
  const [chongoi, setChongoi] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [navative, setNavative] = useState("chon-ghe");
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/suat-chieu/${id}`
        );
        console.log("Dữ liệu chỗ ngồi:", response.data);
        setSuatchieu(response.data.suat_chieu);
        setChongoi(response.data.danh_sach_ghe);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chỗ ngồi:", error);
      }
    };

    fetchMovies();
  }, [id]);

  const handleSeatSelect = (seat) => {
    if (selectedSeats.includes(seat.id_ghe)) {
      // Bỏ chọn ghế nếu đã chọn trước đó
      const updatedSeats = selectedSeats.filter((id) => id !== seat.id_ghe);
      setSelectedSeats(updatedSeats);
      setTotalPrice(updatedSeats.length * suatchieu.gia);
    } else if (selectedSeats.length < 8) {
      // Chọn ghế mới nếu chưa đạt giới hạn 8 ghế
      const updatedSeats = [...selectedSeats, seat.id_ghe];
      setSelectedSeats(updatedSeats);
      setTotalPrice(updatedSeats.length * suatchieu.gia);
    }
  };

  return (
    <div className="w-full bg-[#33173C] flex-col items-center flex">
      <Header />
      <div className="max-w-[1140px] w-full relative mt-[100px]">
        <div className="text-white bg-gray-100 rounded-md w-full overflow-hidden my-5">
          <BuyTicketsNav active={navative} />
          <div className="flex bg-gray-100 text-black">
            <div className="flex-1 seat-selection px-3">
              <div className="chu-thich flex legend w-full justify-center">
                <div>
                  <span className="selected"></span>
                  <p>Ghế bạn chọn</p>
                </div>
                <div>
                  <span className="unavailable"></span>
                  <p>Không thể chọn</p>
                </div>
                <div>
                  <span className="seat-area-1 taken"></span>
                  <p>Đã bán</p>
                </div>
              </div>
              <div className="man-hinh bg-gray-400 p-1 mb-3 ml-9">
                <h1>MÀN HÌNH</h1>
              </div>
              <div className="cho-ngoi flex">
                <div className="flex flex-col gap-2 w-[30px] seat-ab">
                  {["A", "B", "C", "D", "E", "F", "G", "H"].map((char) => (
                    <div key={char} className="seat-row">
                      <span className="seat-abc">{char}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  {["A", "B", "C", "D", "E", "F", "G", "H"].map((char) => (
                    <div key={char} className="seat-row">
                      {chongoi
                        ?.filter((seat) => seat.ten_ghe.startsWith(char))
                        .map((seat) => (
                          <div
                            key={seat.id_ghe}
                            className={`seat ${
                              seat.da_mua ? "seat-taken" : ""
                            } ${
                              selectedSeats.includes(seat.id_ghe)
                                ? "seat-selected"
                                : ""
                            }`}
                            onClick={() =>
                              !seat.da_mua && handleSeatSelect(seat)
                            } // Kiểm tra nếu ghế chưa được mua
                          >
                            {seat.ten_ghe}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-1/3 bg-gray-100 px-3 flex">
              <div className=" my-3 flex-1">
                <div className="rounded-md bg-white p-4 text-left font-thin mb-6">
                  <p className="text-[15px] capitalize truncate">
                    {suatchieu.ten_phim}
                  </p>
                  <p className="text-[15px] truncate">
                    Suất{" "}
                    <span className="font-bold">
                      {new Date(suatchieu.thoi_gian).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                  <p className="text-[15px] truncate">
                    Phòng chiếu{" "}
                    <span className="font-bold">{suatchieu.ten_phong}</span>
                    {" - "}Ghế <span>...</span>
                  </p>
                </div>
                <div className="p-6 bg-white rounded-md text-left mb-6">
                  <h6 className="text-[10px] font-bold text-[#95aac9]">
                    TỔNG ĐƠN HÀNG
                  </h6>
                  <span>{totalPrice} ₫</span>
                </div>
                <div className="flex gap-5">
                  <div className="flex-1 p-2 bg-gray-800 rounded-md text-white">
                    <a href="#">Tiếp tục</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pay;
