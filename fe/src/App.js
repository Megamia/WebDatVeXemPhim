import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Home from "./Pages/Home/Home";
import MovieInfor from "./Pages/Movie/MovieInfor";
import MovieShowtimes from "./Pages/Movie/MovieShowtimes";
import BuyTickets from "./Pages/BuyTickets/BuyTickets";
import Pay from "./Pages/Pay/Pay";
import TicketInfo from "./Pages/TicketInfo/TicketInfo";
import CategoryList from "./Pages/Admin/Category/CategoryList";
import MovieList from "./Pages/Admin/Movie/MovieList";
import ArtistList from "./Pages/Admin/Artist/ArtistList";
import MovieSchedule from "./Pages/Admin/MovieSchedule/MovieSchedule";
import Login from "./Pages/User/login/Login";
import Profile from "./Pages/User/profile/Profile";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";

function App() {
  const [checkAdmin, setCheckAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleContextMenu = (e) => e.preventDefault();

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = Cookies.get("token");
      if (!storedToken) {
        Swal.fire({ title: "Bạn chưa đăng nhập!", icon: "warning" });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/ho-so`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        const isAdmin = response.data.role === true;
        setCheckAdmin(isAdmin);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Swal.fire({ title: "Lỗi khi tải dữ liệu!", icon: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App" onContextMenu={handleContextMenu}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/phim/" element={<MovieInfor />} />
          <Route path="/phim/:id" element={<MovieInfor />} />
          <Route path="/lich-chieu/:id" element={<MovieShowtimes />} />
          <Route path="/mua-ve/:id" element={<BuyTickets />} />
          <Route path="/thanh-toan/:code" element={<Pay />} />
          <Route path="/thong-tin-ve/:code" element={<TicketInfo />} />
          <Route path="/dang-nhap/" element={<Login />} />
          <Route path="/ho-so/" element={<Profile />} />
          <Route
            path="/admin/the-loai"
            element={
              <ProtectedRoute
                element={<CategoryList />}
                condition={checkAdmin}
              />
            }
          />
          <Route
            path="/admin/phim"
            element={
              <ProtectedRoute element={<MovieList />} condition={checkAdmin} />
            }
          />
          <Route
            path="/admin/nghe-si"
            element={
              <ProtectedRoute element={<ArtistList />} condition={checkAdmin} />
            }
          />
          <Route
            path="/admin/suat-chieu"
            element={
              <ProtectedRoute
                element={<MovieSchedule />}
                condition={checkAdmin}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

const ProtectedRoute = ({ element, condition }) => {
  const navigate = useNavigate();
  console.log("con: ", condition);

  useEffect(() => {
    if (condition === false || condition === undefined) {
      Swal.fire({
        title: "Bạn không có quyền truy cập!",
        text: "Vui lòng đăng nhập với quyền admin.",
        icon: "warning",
        confirmButtonText: "Đăng nhập",
      }).then(() => {
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/dang-nhap");
        return null;
      });
    }
  }, [condition, navigate]);

  return element;
};

export default App;
