import React, { useState, useEffect } from "react";
import Header from "../../../Components/header/Header";
import Footer from "../../../Components/footer/Footer";
import AdminMenu from "../../../Components/menu/AdminMenu";
import axios from "axios";
import MovieScheduleADD from "./MovieScheduleADD";
import MovieScheduleEdit from "./MovieScheduleEdit";

import {
  Form,
  Input,
  Popconfirm,
  Table,
  Typography,
  Button,
  Modal,
  Select,
  Flex,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./../Admin.css";

const { Option } = Select;

const MovieSchedule = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalADDVisible, setIsModalADDVisible] = useState(false);
  const [isModalEDITVisible, setIsModalEDITVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState(0);
  const [statusFilter, setStatusFilter] = useState(null); // Trạng thái lọc

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value); // Cập nhật trạng thái lọc
  };

  const handleCloseModal = () => {
    setIsModalEDITVisible(false);
    setIsModalADDVisible(false);
    fetchMovie();
  };

  const fetchMovie = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/suat-chieu`
      );
      const formattedData = response.data.map((item, index) => ({
        ...item,
        key: item.id || index.toString(),
      }));
      setData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin:", error);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, []);

  const handleDelete = async (key) => {
    try {
      const updatedData = data.filter((item) => item.key !== key);

      // Tìm phần tử bị xóa theo `key`
      const deletedItem = data.find((item) => item.key === key);

      if (deletedItem) {
        // Gửi yêu cầu xóa đến server
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/nghe-si/delete/${deletedItem.id}`
        );
      }

      // Cập nhật lại state sau khi xóa
      setData(updatedData);
      alert("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Không thể xóa. Vui lòng thử lại sau.");
    }
  };

  const filteredData = data.filter((item) => {
    const statusMatch =
      statusFilter === null || item.tinh_trang === statusFilter;

    const localTime = item.thoi_gian
      ? new Date(item.thoi_gian || "").toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

    const phimMatch = (item.ten_phim ? String(item.ten_phim) : "")
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const phongMatch = (item.ten_phong ? String(item.ten_phong) : "")
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const timeMatch = localTime
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return (phimMatch || timeMatch || phongMatch) && statusMatch; // Điều kiện lọc theo trạng thái và tìm kiếm
  });

  const columns = [
    {
      title: "Tên Phim",
      dataIndex: "ten_phim",
      width: "20%",
    },
    {
      title: "Tên Phòng",
      dataIndex: "ten_phong",
      width: "5%",
    },
    {
      title: "Trạng Thái",
      dataIndex: "tinh_trang",
      width: "10%",
      render: (_, record) => {
        switch (record.tinh_trang) {
          case 0:
            return <span className="text-gray-400 font-bold">Chưa Chiếu</span>;
          case 1:
            return <span className="text-green-400 font-bold">Đang Chiếu</span>;
          case 2:
            return <span className="text-red-400 font-bold">Đã Kết Thúc</span>;
          default:
            return <span>Không xác định</span>;
        }
      },
    },
    {
      title: "Giá Vé",
      dataIndex: "gia",
      width: "5%",
      render: (_, record) => {
        return <span>{record.gia} $</span>;
      },
    },
    {
      title: "Thời Gian",
      dataIndex: "thoi_gian",
      width: "5%",
      render: (_, record) => {
        return (
          <span>
            {new Date(record.thoi_gian || "").toLocaleString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "operation",
      width: "10%",
      render: (_, record) => {
        return (
          <div className="flex flex-col gap-1">
            <span>
              <Typography.Link
                onClick={() => {
                  setIsModalEDITVisible(true);
                  setSelected(record.id);
                }}
                style={{ marginRight: 8 }}
              >
                <EditOutlined /> Edit
              </Typography.Link>
            </span>
            <span>
              <Popconfirm
                title="Are you sure you want to delete?"
                onConfirm={() => handleDelete(record.key)} // Hàm xử lý xóa
                okText="Yes"
                cancelText="No"
              >
                <Typography.Link
                  style={{ color: "red" }}
                  className="hover:opacity-50"
                >
                  <DeleteOutlined /> Delete
                </Typography.Link>
              </Popconfirm>
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full bg-[#33173C] flex-col items-center flex">
      <Header />
      <div className="max-w-[1140px] w-full bg-[#140F29] flex mt-[100px]">
        <AdminMenu />
        <div className="p-4 bg-gray-300 w-full">
          <Modal
            visible={isModalADDVisible}
            onCancel={() => setIsModalADDVisible(false)}
            footer={null}
          >
            <MovieScheduleADD onAddSuccess={handleCloseModal} />
          </Modal>
          <Modal
            title="Chỉnh sửa phim"
            visible={isModalEDITVisible}
            onCancel={() => setIsModalEDITVisible(false)}
            footer={null}
          >
            <MovieScheduleEdit
              Id={selected}
              onUpdateSuccess={handleCloseModal}
            />
          </Modal>
          <Form form={form} component={false}>
            <Table
              bordered={true}
              loading={loading}
              title={() => (
                <div>
                  <span className="text-[25px] font-bold">
                    Danh sách suất phim
                  </span>
                  <div className="text-lg font-bold text-center relative mt-2">
                    <Button
                      type="primary"
                      className="absolute left-0"
                      onClick={() => setIsModalADDVisible(true)}
                    >
                      Thêm mới
                    </Button>
                    .
                    <Flex gap={10} className="absolute right-0 top-0">
                      <SearchOutlined className="text-[20px]" />
                      <Input
                        placeholder="Tìm kiếm phim..."
                        value={searchText}
                        onChange={handleSearchChange}
                        className="w-[300px]"
                      />
                      <Select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="w-[150px]"
                        placeholder="Lọc trạng thái"
                      >
                        <Option value={null}>Tất cả</Option>
                        <Option value={0}>Chưa Chiếu</Option>
                        <Option value={1}>Đang Chiếu</Option>
                        <Option value={2}>Đã Kết Thúc</Option>
                      </Select>
                    </Flex>
                  </div>
                </div>
              )}
              dataSource={filteredData}
              columns={columns}
              rowClassName="editable-row"
            />
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieSchedule;
