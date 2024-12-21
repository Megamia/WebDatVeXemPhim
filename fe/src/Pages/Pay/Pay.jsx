import React, { useEffect, useState } from "react";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import BuyTicketsNav from "../../Components/nav/BuyTicketsNav";
import axios from "axios";
import { Table, Radio, Flex, Input, message } from "antd";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Pay = () => {
  const navigate = useNavigate();
  const [navative, setNavative] = useState("thanh-toan");
  const [value, setValue] = useState(2);
  const location = useLocation();
  const { code, seats, totalPrice, suatchieu } = location.state || {};
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [showPayPal, setShowPayPal] = useState(false);

  useEffect(() => {
    // Chặn nút back của trình duyệt
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.go(1); // Điều này sẽ ngăn chặn quay lại trang trước
    };

    // Cleanup để bỏ chặn khi component bị gỡ bỏ
    return () => {
      window.onpopstate = null;
    };
  }, []);

  const onChangeRadio = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const handleInputChange = (field, value) => {
    if (field === "name") {
      setname(value);
    } else if (field === "email") {
      setemail(value);
    } else if (field === "phone") {
      setphone(value);
    }

    sessionStorage.setItem(field, value);
  };

  const handleCommit = async () => {
    if (!name || !email || !phone) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(email)) {
      message.error("Định dạng email không hợp lệ.");
      return;
    }

    if (!phoneRegex.test(phone)) {
      message.error("Số điện thoại không hợp lệ.");
      return;
    }
    handleInputChange();
    setShowPayPal(true); // Hiển thị PayPal button khi thông tin hợp lệ
  };

  const handleInputFocus = () => {
    setShowPayPal(false); // Ẩn PayPal button khi click vào input
  };

  const handleSubmit = async () => {
    try {
      const requestData = {
        name: name,
        email: email,
        phone: phone,
        seats: seats,
        totalPrice: totalPrice,
        suatchieu: suatchieu,
        code: code,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/thanh-toan/add`,
        requestData
      );
      if (response.data.message) {
        // Nếu có, hiển thị thông báo thành công
        alert(response.data.message);
      } else {
        // Nếu không, hiển thị thông báo thất bại
        alert("Thêm dữ liệu vào SQL thất bại.");
      }
    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi thêm dữ liệu vào SQL: ", error);
      alert("Đã xảy ra lỗi khi thêm dữ liệu vào SQL.");
    }
  };

  const initialOptions = {
    clientId:
      "Ac9K4i7QCNP72Tt9H5W02MjClbQxKDPTLQGMjkltRGInHipe139bwdFZILDbE1PyDm90A5HnHNupLrf_",
    currency: "USD",
    intent: "capture",
  };

  const dataSource = [
    {
      key: "1",
      mota: "Ghế",
      count: seats.length,
      price: totalPrice + " $",
    },
    {
      key: "2",
      mota: "Tổng",
      price: totalPrice + " $",
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

  useEffect(() => {
    // Lấy giá trị từ sessionStorage khi component mount
    const storedName = sessionStorage.getItem("name");
    const storedEmail = sessionStorage.getItem("email");
    const storedPhone = sessionStorage.getItem("phone");

    if (storedName) setname(storedName);
    if (storedEmail) setemail(storedEmail);
    if (storedPhone) setphone(storedPhone);
  }, []);

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
                  onChange={onChangeRadio}
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
                  <Input
                    size="large"
                    placeholder="Họ và tên"
                    value={name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onFocus={handleInputFocus}
                  />
                  <span>Email</span>
                  <Input
                    size="large"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onFocus={handleInputFocus}
                  />
                  <span>Số điện thoại</span>
                  <Input
                    size="large"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onFocus={handleInputFocus}
                  />
                </Flex>
              </div>
            </Flex>
            <div className="w-1/3 bg-gray-100 px-3 flex">
              <div className="flex-1">
                <div className="p-6 bg-white rounded-md text-left mb-6">
                  <h6 className="text-[10px] font-bold text-[#95aac9]">
                    TỔNG ĐƠN HÀNG
                  </h6>
                  <span>{totalPrice} $</span>
                </div>
                <div className="p-6 bg-white rounded-md text-left mb-6">
                  <h6 className="">
                    Vé đã mua không thể đổi hoặc hoàn tiền. Mã vé sẽ được gửi 01
                    lần qua số điện thoại và email đã nhập. Vui lòng kiểm tra
                    lại thông tin trước khi tiếp tục.
                  </h6>
                </div>
                <div className="flex gap-5">
                  <div className="flex-1 p-2 bg-gray-800 rounded-md text-white">
                    {showPayPal == true ? (
                      <PayPalScriptProvider options={initialOptions}>
                        <PayPalButtons
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: totalPrice.toString(),
                                  },
                                  payee: {
                                    email_address:
                                      "sb-duksl29334917@business.example.com",
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={async (data, actions) => {
                            try {
                              const order = await actions.order.capture();
                              console.log("Thanh toán thành công:", order);
                              navigate(`/thong-tin-ve/${code}`);
                              alert("Thanh toán thành công");
                              handleSubmit();
                            } catch (error) {
                              console.error("Lỗi khi thanh toán", error);
                              alert("Thanh toán thất bại");
                            }
                          }}
                          onCancel={() => alert("Thanh toán đã bị hủy")}
                        />
                      </PayPalScriptProvider>
                    ): (<button onClick={handleCommit}>Thanh toán</button>)}
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
