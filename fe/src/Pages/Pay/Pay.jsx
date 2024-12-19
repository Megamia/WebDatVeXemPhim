import React, { useEffect, useState } from "react";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import { useParams, useLocation  } from "react-router-dom";
import BuyTicketsNav from "../../Components/nav/BuyTicketsNav";
import axios from "axios";
import { Table, Radio, Flex, Input } from "antd";

const Pay = () => {
  const [navative, setNavative] = useState("thanh-toan");
  const [value, setValue] = useState(1);
  const location = useLocation();  // Lấy state từ location
  const { seats, totalPrice } = location.state || {};  // Kiểm tra nếu state tồn tại

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const dataSource = [
    {
      key: "1",
      mota: "Ghế",
      count: seats.length,
      price: totalPrice + " đ",
    },
    {
      key: "2",
      mota: "Tổng",
      price: totalPrice + " đ",
    },
  ];

  const columns = [
    {
      title: "MÔ TẢ",
      dataIndex: "mota",
      key: "mota",
    },
    {
      title: "SỐ LƯỢNG",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "THÀNH TIỀN",
      dataIndex: "price",
      key: "price",
    },
  ];

  return (
    <div className="w-full bg-[#33173C] flex-col items-center flex">
      <Header />
      <div className="max-w-[1140px] w-full relative mt-[100px]">
        <div className="text-white bg-gray-100 rounded-md w-full overflow-hidden my-5">
          <BuyTicketsNav active={navative} />
          <div className="flex bg-gray-100 text-black mb-5">
            <Flex vertical gap={30} className="mx-3 text-left flex-1">
              <div className="rounded-md overflow-hidden ">
                <div className="p-4 bg-gray-200 text-[#95B1D7]">
                  Tóm tắt đơn hàng
                </div>
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  className="flex-1"
                  pagination={false}
                />
              </div>
              <div className="bg-white rounded-md overflow-hidden">
                <div className="p-4 bg-gray-200 text-[#95B1D7]">
                  Hình thức thanh toán
                </div>
                <Radio.Group
                  className="p-3"
                  onChange={onChange}
                  size="large"
                  value={value}
                >
                  <Radio.Button value={1}>
                    <div className="flex">
                      <img
                        className="w-[30px] object-contain pr-1"
                        src="https://cdn.moveek.com/bundles/ornweb/img/momo-icon.png"
                      />
                      <span>Ví MoMo</span>
                    </div>
                  </Radio.Button>
                  <Radio.Button value={2}>
                    <div className="flex">
                      <img
                        className="w-[30px] object-contain pr-1"
                        src="https://cdn.dativery.com/cdn/logos/channels/resized/paypal-256.png"
                      />
                      <span>PayPal</span>
                    </div>
                  </Radio.Button>
                </Radio.Group>
              </div>
              <div className="rounded-md overflow-hidden bg-white">
                <div className="p-4 bg-gray-200 text-[#95B1D7]">
                  Thông tin cá nhân
                </div>
                <Flex vertical gap={10} className="p-4">
                  <span>Họ và tên</span>
                  <Input size="large" placeholder="Họ và tên"/>
                  <span>Email</span>
                  <Input size="large" placeholder="Email" />
                  <span>Số điện thoại</span>
                  <Input size="large" placeholder="Số điện thoại" />
                </Flex>
              </div>
            </Flex>
            <div className="w-1/3 bg-gray-100 px-3 flex">
              <div className="flex-1">
                <div className="p-6 bg-white rounded-md text-left mb-6">
                  <h6 className="text-[10px] font-bold text-[#95aac9]">
                    TỔNG ĐƠN HÀNG
                  </h6>
                  <span>{totalPrice} ₫</span>
                </div>
                <div className="p-6 bg-white rounded-md text-left mb-6">
                  <h6 className="">
                  Vé đã mua không thể đổi hoặc hoàn tiền.
                  Mã vé sẽ được gửi 01 lần qua số điện thoại và email đã nhập. Vui lòng kiểm tra lại thông tin trước khi tiếp tục.
                  </h6>
                </div>
                <div className="flex gap-5">
                  <div className="flex-1 p-2 bg-gray-800 rounded-md text-white">
                    <a href="#">Thanh toán</a>
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
