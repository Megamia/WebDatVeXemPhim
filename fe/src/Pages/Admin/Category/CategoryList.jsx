import React, { useState, useEffect } from "react";
import Header from "../../../Components/header/Header";
import AdminMenu from "../../../Components/menu/AdminMenu";
import Footer from "../../../Components/footer/Footer";
import axios from "axios";
import {
  Form,
  Input,
  InputNumber,
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

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const CategoryList = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDT, setNewDT] = useState({ ten: "" });
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const fetchMovie = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/the-loai`
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

  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      id: "",
      ten: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        const updatedItem = { ...item, ...row };

        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/the-loai/update/${item.id}`,
          updatedItem
        );

        newData.splice(index, 1, updatedItem);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      alert("Lưu dữ liệu thất bại. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (key) => {
    try {
      const updatedData = data.filter((item) => item.key !== key);

      // Tìm phần tử bị xóa theo `key`
      const deletedItem = data.find((item) => item.key === key);

      if (deletedItem) {
        // Gửi yêu cầu xóa đến server
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/api/the-loai/delete/${deletedItem.id}`
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

  const handleAdd = async () => {
    try {
      const newData = { ...newDT };
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/the-loai/add`,
        newData
      );

      fetchMovie();
      setNewDT({ ten: "" });
      setIsModalVisible(false); // Close modal after adding
      alert("Thêm mới thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm mới:", error);
      alert("Không thể thêm mới. Vui lòng thử lại.");
    }
  };

  const filteredData = data.filter((item) =>
    item.ten.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Id Thể Loại",
      dataIndex: "id",
      editable: false,
    },
    {
      title: "Tên Thể Loại",
      dataIndex: "ten",
      editable: true,
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              <EditOutlined /> Edit
            </Typography.Link>
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
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div className="w-full bg-[#33173C] flex-col items-center flex">
      <Header />
      <div className="max-w-[1140px] w-full bg-[#140F29] flex mt-[100px]">
        <AdminMenu />
        <div className="p-4 bg-gray-300 w-full">
          <Modal
            title="Thêm mới thể loại"
            visible={isModalVisible}
            onOk={handleAdd}
            onCancel={() => setIsModalVisible(false)}
            okText="Thêm"
            cancelText="Hủy"
          >
            <Form layout="vertical">
              <Form.Item label="Tên thể loại">
                <Input
                  value={newDT.ten}
                  onChange={(e) =>
                    setNewDT({
                      ...newDT,
                      ten: e.target.value,
                    })
                  }
                  placeholder="Nhập tên thể loại"
                />
              </Form.Item>
            </Form>
          </Modal>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered={true}
              loading={loading}
              title={() => (
                <div className="text-lg font-bold text-center relative">
                  <Button
                    type="primary"
                    className="absolute left-0"
                    onClick={() => setIsModalVisible(true)}
                  >
                    Thêm mới
                  </Button>
                  Danh sách thể loại
                  <Flex gap={10} className="absolute right-0 top-0">
                    <SearchOutlined className="text-[20px]" />
                    <Input
                      placeholder="Tìm kiếm thể loại..."
                      value={searchText}
                      onChange={handleSearchChange}
                      className="w-[300px]"
                    />
                  </Flex>
                </div>
              )}
              dataSource={filteredData}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                onChange: cancel,
              }}
            />
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryList;
