import React, { useState, useEffect } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
// import NotificationModal from "./NotificationModal";
import axios from "axios";
import styles from "./style.module.scss";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../Components/header/Header";
import Footer from "../../../Components/footer/Footer";
// import { FaFacebookF } from "react-icons/fa";
const Login = () => {
  const navigate = useNavigate();

  const [User, setUser] = useState("");
  const [Password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [fullname, setFullName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState("");

  const dangkythanhcong = () => {
    toast.success("Đăng ký thành công", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const dangkythatbai = () => {
    toast.error("Đăng ký thất bại", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };



  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);

  //LOGIN//
  const handleUserChange = (event) => {
    setUser(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/dang-nhap`,
        {
          username: User,
          password: Password,
        }
      );

      if (response.status === 200) {
        const token = response.data.token;
        const d = new Date();
        d.setTime(d.getTime() + 1 * 60 * 60 * 1000); // 1 giờ
        const expires = "expires=" + d.toUTCString();
        document.cookie = `token=${token}; ${expires}; path=/; secure;`;
        // localStorage.setItem("isLoggedIn", "true");
        // setIsLoggedIn(true);
        // dangnhapthanhcong();
        // await delay(2000);
        Swal.fire({
          title: "Đăng nhập thành công!",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.scrollTo(0, 0);
            navigate("/");
          }
        });
        return;
      }

      setIsLoggedIn(false);
      // danhnhapthatbai();
      Swal.fire("Đăng nhập thất bại!");
    } catch (error) {
      console.error("Error querying the database:", error);
      setIsLoggedIn(false);
      // danhnhapthatbai();
      Swal.fire({
        title: "Đăng nhập thất bại!",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          return;
        }
      });
    }
  };

  //SIGNUP//
  const handleSignup = async (event) => {
    if (
      !fullname.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !phone.trim()
    ) {
      setErrors("Vui lòng điền vào trường này");
      return;
    }
    event.preventDefault();

    if (username === "admin") {
      alert("Không được đăng kí với username=admin");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/signup`,
        {
          username,
          fullname,
          email,
          password,
          phone,
        }
      );

      console.log("Signup successful:", response.data);
      dangkythanhcong();
      handleLoginClick();
    } catch (error) {
      console.error("Error signing up:", error);
      dangkythatbai();
    }
  };
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  const handleLoginClick = () => {
    setIsSignUpActive(false);
  };
  return (
    <>
      <div className=" w-full bg-[#33173C] flex-col items-center flex">
        <Header />
        <div className=" flex flex-1 items-center justify-center bg-[#141414] mt-[100px]">
          <div
            className={`container ${isSignUpActive ? "right-panel-active" : ""
              }`}
          >
            <div className="form-container  sign-up-container ">
              <form
                action="#"
                className="bg-[#141414] flex items-center justify-center flex-col px-[50px] h-full text-center signup"
              >
                <h1 className="font-bold m-0 text-white">Create Account</h1>
                <div className="social-container">
                  <a
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className={`social ${styles.fb}`}
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>

                  <a
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className={`social ${styles.gg}`}
                  >
                    <i className="fab fa-google-plus-g"></i>
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className={`social ${styles.lk}`}
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
                <span className="text-[15px] mb-[10px] text-white">
                  or use your email for registration
                </span>
                <input
                  type="text"
                  name="fullname"
                  value={fullname}
                  className="inputUser"
                  placeholder="Tên đầy đủ"
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  name="username"
                  value={username}
                  className="inputUser"
                  placeholder="Tên tài khoản"
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={password}
                  className="inputUser"
                  placeholder="Mật khẩu"
                  onChange={(e) => setpassword(e.target.value)}
                  required
                />

                <input
                  type="email"
                  name="email"
                  value={email}
                  className="inputUser"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="text"
                  name="phone"
                  value={phone}
                  className="inputUser"
                  placeholder="Số điện thoại"
                  pattern="[0-9]*"
                  onChange={(e) => setPhone(e.target.value)}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                  required
                />

                <input
                  type="submit"
                  value="Đăng ký"
                  onClick={handleSignup}
                  className="cursor-pointer rounded-full border border-solid border-red-500 bg-red-500 text-white text-xs font-bold py-3 px-12 tracking-wide uppercase transition-transform duration-80 ease-in"
                />
              </form>
            </div>
            <div className="form-container sign-in-container">
              <form
                action="#"
                className="bg-[#141414] flex items-center justify-center flex-col px-[50px] h-full text-center login"
              >
                <h1 className="font-bold m-0 text-white">Sign in</h1>
                <div className="social-container">
                  <a
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className={`social ${styles.fb}`}
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className={`social ${styles.gg}`}
                  >
                    <i className="fab fa-google-plus-g"></i>
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className={`social ${styles.lk}`}
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
                <span className="text-[15px] mb-[10px] text-white">
                  or use your account
                </span>
                <input
                  type="text"
                  value={User}
                  onChange={handleUserChange}
                  placeholder="Tên đăng nhập"
                  className="inputUser border-gray-300 text-black"
                />
                <input
                  type="password"
                  value={Password}
                  onChange={handlePasswordChange}
                  placeholder="Mật khẩu"
                  className="inputUser border-gray-300 text-black"
                />
                <a
                  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  className="mb-[10px] text-white"
                >
                  Forgot your password?
                </a>
                <input
                  type="submit"
                  value="Đăng nhập"
                  onClick={handleLogin}
                  className="cursor-pointer rounded-full border border-solid border-red-500 bg-red-500 text-white text-xs font-bold py-3 px-12 tracking-wide uppercase transition-transform duration-80 ease-in"
                />
              </form>
            </div>
            <div className="overlayLogin-container">
              <div className="overlayLogin">
                <div className="overlayLogin-panel overlayLogin-left welcome">
                  <h1 className="font-bold m-0">Welcome Back!</h1>
                  <p className="text-sm font-light leading-5 tracking-wider my-20">
                    To keep connected with us please login with your
                    personal info
                  </p>
                  <button
                    className=" bg-red-500 border-red-500 text-white font-bold text-xs uppercase py-3 px-12 rounded-full border border-solid  transition-transform duration-80 ease-in focus:outline-none active:scale-95"
                    onClick={handleLoginClick}
                  >
                    Sign In
                  </button>
                </div>
                <div className="overlayLogin-panel overlayLogin-right hello">
                  <h1 className="font-bold m-0">Hello, Friend!</h1>
                  <p className="text-sm font-light leading-5 tracking-wider my-20">
                    Enter your personal details and start journey with us
                  </p>
                  <button
                    className=" bg-red-500 border-red-500 text-white font-bold text-xs uppercase py-3 px-12 rounded-full border border-solid  transition-transform duration-80 ease-in focus:outline-none active:scale-95"
                    onClick={handleSignUpClick}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
