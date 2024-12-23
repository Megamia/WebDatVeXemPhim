import React, { useState, useEffect } from "react";
import Header from "../../../Components/header/Header";
import Footer from "../../../Components/footer/Footer";
import AdminMenu from "../../../Components/menu/AdminMenu";
import axios from "axios";
import AddMovieForm from "./AddMovieForm";
import UpdateMovieForm from "./UpdateMovieForm";
import ArtistTable from "../Artist/ArtistTable";

import {
  Form,
  Input,
  Popconfirm,
  Table,
  Typography,
  Button,
  Modal,
  Flex,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./../Admin.css";

const MovieList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalADDVisible, setIsModalADDVisible] = useState(false);
  const [isModalEDITVisible, setIsModalEDITVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState(0);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleCloseModal = () => {
    setIsModalEDITVisible(false);
    setIsModalADDVisible(false);
    fetchMovie();
  };

  const fetchMovie = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/movies`
      );
      const formattedData = response.data.map((item, index) => ({
        ...item,
        key: item.id_phim || index.toString(),
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

  const filteredData = data.filter((item) =>
    item.ten_phim.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Poter",
      width: "10%",
      render: (_, record) => {
        return (
          <div className="inline-block">
            <img
              src={`${process.env.REACT_APP_API_URL}${record.poster}`}
              alt={record.ten_phim}
              className="w-full object-cover rounded-md border"
            />
          </div>
        );
      },
    },
    {
      title: "Tên Phim",
      dataIndex: "ten_phim",
      width: "25%",
    },
    {
      title: "Tên Phụ",
      dataIndex: "ten_phu",
      width: "25%",
    },
    {
      title: "Thời Lượng (Phút)",
      dataIndex: "thoi_luong",
      width: "12%",
    },
    {
      title: "Khởi Chiếu",
      dataIndex: "khoi_chieu",
      width: "10%",
      render: (_, record) => {
        return (
          <span>
            {new Date(record.khoi_chieu || "").toLocaleString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
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
      width: "15%",
      render: (_, record) => {
        return (
          <div className="flex flex-col gap-1">
            <span>
              <Typography.Link
                onClick={() => {
                  setIsModalEDITVisible(true);
                  setSelected(record.id_phim);
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
            <AddMovieForm onAddSuccess={handleCloseModal} />
          </Modal>
          <Modal
            title="Chỉnh sửa phim"
            visible={isModalEDITVisible}
            onCancel={() => setIsModalEDITVisible(false)}
            footer={null}
          >
            <UpdateMovieForm
              movieId={selected}
              onUpdateSuccess={handleCloseModal}
            />
          </Modal>
          <Form form={form} component={false}>
            <Table
              expandable={{
                expandedRowRender: (record) => (
                  <ArtistTable movieId={record.id_phim} />
                ),
                rowExpandable: (record) => !!record.id_phim, 
              }}
              bordered={true}
              loading={loading}
              title={() => (
                <div className="text-lg font-bold text-center relative">
                  <Button
                    type="primary"
                    className="absolute left-0"
                    onClick={() => setIsModalADDVisible(true)}
                  >
                    Thêm mới
                  </Button>
                  Danh sách phim
                  <Flex gap={10} className="absolute right-0 top-0">
                    <SearchOutlined className="text-[20px]" />
                    <Input
                      placeholder="Tìm kiếm phim..."
                      value={searchText}
                      onChange={handleSearchChange}
                      className="w-[300px]"
                    />
                  </Flex>
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

export default MovieList;
