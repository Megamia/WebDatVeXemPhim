import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import MovieInfor from "./Pages/Movie/MovieInfor";
import MovieShowtimes from "./Pages/Movie/MovieShowtimes";
import BuyTickets from "./Pages/BuyTickets/BuyTickets";
import Pay from "./Pages/Pay/Pay";
import Login from "./Pages/User/login/Login";
import Profile from "./Pages/User/profile/Profile";
// import DetailProfile from "./Pages/User/profile/Swap/DetailProfile";

function App() {
  const handleContextMenu = (e) => {
    e.preventDefault();
  };
  return (
    <div className="App " onContextMenu={handleContextMenu}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/phim/" element={<MovieInfor />} />
          <Route path="/phim/:id" element={<MovieInfor />} />
          <Route path="/lich-chieu/:id" element={<MovieShowtimes />} />
          <Route path="/mua-ve/:id" element={<BuyTickets />} />
          <Route path="/thanh-toan/:id" element={<Pay />} />
          <Route path="/dang-nhap/" element={<Login />} />
          <Route path="/ho-so/" element={<Profile />} />
          {/* <Route path="/test1/" element={<Test1 />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
