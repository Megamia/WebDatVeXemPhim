import {
  UnorderedListOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ScheduleOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Thêm useLocation

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("Quản lý thể loại", "1", <UnorderedListOutlined />),
  getItem("Quản lý phim", "2", <VideoCameraOutlined />),
  getItem("Quản lý nghệ sĩ", "3", <UserOutlined />),
  getItem("Quản lý suất chiếu", "4", <ScheduleOutlined />),
  getItem("Quản lý vé", "5", <BarcodeOutlined />),
];

const AdminMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const onClick = (e) => {
    if (e.key === "1") {
      navigate("/admin/the-loai");
    } else if (e.key === "2") {
      navigate("/admin/phim");
    } else if (e.key === "3") {
      navigate("/admin/nghe-si");
    } else if (e.key === "4") {
      navigate("/admin/suat-chieu");
    } else if (e.key === "5") {
      navigate("/admin/ve");
    }
  };

  // Lấy key của menu dựa trên URL hiện tại
  const getActiveKey = () => {
    if (location.pathname === "/admin/the-loai") {
      return "1";
    } else if (location.pathname === "/admin/phim") {
      return "2";
    } else if (location.pathname === "/admin/nghe-si") {
      return "3";
    } else if (location.pathname === "/admin/suat-chieu") {
      return "4";
    } else if (location.pathname === "/admin/ve") {
      return "5";
    }
    return ""; // Mặc định không có mục nào active
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className=" bg-white">
      <div className="p-3 gap-2 flex items-center">
        <Button type="primary" onClick={toggleCollapsed}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
      <Menu
        theme={"light"}
        onClick={onClick}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        selectedKeys={[getActiveKey()]} // Sử dụng getActiveKey để xác định mục active
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};

export default AdminMenu;
