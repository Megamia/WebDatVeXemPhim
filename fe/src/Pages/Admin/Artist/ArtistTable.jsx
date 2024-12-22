import { Popconfirm, Table, Button, Modal, Select, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ArtistTable = ({ movieId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const [isModalTLVisible, setIsModalTLVisible] = useState(false);
  const [TL, setTL] = useState([]);
  const [loadingTL, setLoadingTL] = useState(false);
  const [type, setType] = useState("");
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/artist/${movieId}`
      );
      const apiData = response.data;

      // Chuyển đổi dữ liệu thành dạng phù hợp
      const mergedData = [
        {
          key: "1",
          dien_vien: apiData.dien_vien,
          dao_dien: apiData.dao_dien,
          nha_san_xuat: apiData.nha_san_xuat,
          the_loai: apiData.the_loai,
        },
      ];
      setData(mergedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showAddModal = (type) => {
    setType(type);
    setIsModalVisible(true);
    setLoadingArtists(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/nghe-si`)
      .then((response) => {
        setArtists(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách nghệ sĩ:", error);
        message.error("Lỗi khi lấy danh sách nghệ sĩ.");
      })
      .finally(() => {
        setLoadingArtists(false);
      });
  };

  const showAddTLModal = (type) => {
    setType(type);
    setIsModalTLVisible(true);
    setLoadingTL(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/the-loai`)
      .then((response) => {
        setTL(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách:", error);
        message.error("Lỗi khi lấy danh sách.");
      })
      .finally(() => {
        setLoadingTL(false);
      });
  };

  const handleDelete = async (type, id) => {
    try {
      // Gửi yêu cầu xóa đến backend
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/artist/delete`,
        {
          data: {
            movieId,
            type,
            id,
          },
        }
      );

      if (response.status === 200) {
        message.success("Xóa thành công.");
        fetchData();
      } else {
        console.error("Xóa không thành công:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
    }
  };

  const handleAdd = async () => {
    if (selectedArtistId) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/admin/artist/add`,
          {
            movieId,
            type,
            id: selectedArtistId,
          }
        );
        fetchData();
        message.success("Thêm thành công.");
        setIsModalVisible(false);
        setSelectedArtistId(null);
        setIsModalTLVisible(false);
      } catch (error) {
        console.error("Lỗi khi thêm dữ liệu:", error);
        message.error("Lỗi khi thêm dữ liệu.");
      }
    } else {
      message.warning("Vui lòng chọn một nghệ sĩ.");
    }
  };

  const renderList = (items, type) => (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between mb-2 bg-gray-100 p-2 rounded"
        >
          <span>{item.ten}</span>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(type, item.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger size="small">
              X
            </Button>
          </Popconfirm>
        </div>
      ))}
      <Button
        type="dashed"
        block
        onClick={() => showAddModal(type)}
        className="mt-2"
      >
        + Thêm
      </Button>
    </div>
  );

  const renderListTL = (items, type) => (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between mb-2 bg-gray-100 p-2 rounded"
        >
          <span>{item.ten}</span>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(type, item.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger size="small">
              X
            </Button>
          </Popconfirm>
        </div>
      ))}
      <Button
        type="dashed"
        block
        onClick={() => showAddTLModal(type)}
        className="mt-2"
      >
        + Thêm
      </Button>
    </div>
  );

  const columns = [
    {
      title: "Diễn Viên",
      dataIndex: "dien_vien",
      key: "dien_vien",
      render: (_, record) => renderList(record.dien_vien, "dien_vien"),
    },
    {
      title: "Đạo Diễn",
      dataIndex: "dao_dien",
      key: "dao_dien",
      render: (_, record) => renderList(record.dao_dien, "dao_dien"),
    },
    {
      title: "Nhà Sản Xuất",
      dataIndex: "nha_san_xuat",
      key: "nha_san_xuat",
      render: (_, record) => renderList(record.nha_san_xuat, "nha_san_xuat"),
    },
    {
      title: "Thể Loại",
      dataIndex: "the_loai",
      key: "the_loai",
      render: (_, record) => renderListTL(record.the_loai, "the_loai"),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
      />

      {/* Modal để chọn nghệ sĩ */}
      <Modal
        title="Chọn Nghệ Sĩ"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAdd}
      >
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Chọn nghệ sĩ"
          optionFilterProp="children"
          onChange={(value) => setSelectedArtistId(value)}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          loading={loadingArtists}
        >
          {artists.map((artist) => (
            <Select.Option key={artist.id} value={artist.id}>
              {artist.ten}
            </Select.Option>
          ))}
        </Select>
      </Modal>
      <Modal
        title="Chọn Thể Loại"
        visible={isModalTLVisible}
        onCancel={() => setIsModalTLVisible(false)}
        onOk={handleAdd}
      >
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Chọn thể loại"
          optionFilterProp="children"
          onChange={(value) => setSelectedArtistId(value)}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          loading={loadingTL}
        >
          {TL.map((artist) => (
            <Select.Option key={artist.id} value={artist.id}>
              {artist.ten}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default ArtistTable;
