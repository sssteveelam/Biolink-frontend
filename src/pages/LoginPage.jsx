import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import api from "../api/axiosConfig";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState(""); // State cho ô email
  const [password, setPassword] = useState(""); // State cho ô password
  const [loading, setLoading] = useState(false); // State để biết khi nào đang chờ API trả về
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate(); // Khởi tạo hook navigate

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trang bị reload khi submit form
    setLoading(true); // Báo là đang xử lý

    try {
      // Gọi API login của backend bằng axios
      // Quan trọng: Đảm bảo URL backend chính xác!
      const response = await api.post("/api/auth/login", {
        email: email,
        password: password,
      });
      setLoading(false); // Hết loading

      // --- Thêm dòng này để lưu token ---
      if (response.data && response.data.token) {
        login(response.data.token, response.data.user);
      }

      // Giờ có thể chuyển hướng người dùng
      navigate("/dashboard");
    } catch (err) {
      // Nếu API trả về lỗi (status 4xx, 5xx)
      setLoading(false); // Hết loading
      console.error(
        "Login error:",
        err.response ? err.response.data : err.message
      );

      toast.error(
        err.response?.data?.message || "Đã có lỗi xảy ra khi đăng nhập."
      );
    }
  };

  return (
    // Giữ nguyên background gradient
    <div className="flex justify-center items-center min-h-screen min-w-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="flex justify-center items-center min-h-screen ">
        {" "}
        {/* Thêm padding ngang nhỏ để form không bị dính sát cạnh màn hình nhỏ */}
        {/* Card đăng nhập */}
        {/* Tăng nhẹ padding, bo góc lớn hơn, tăng nhẹ độ mờ nền/border */}
        <div className="w-full max-w-md p-10 space-y-8 bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30">
          {/* Tiêu đề */}
          {/* Tăng kích thước chữ và khoảng cách dưới */}
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Đăng nhập vào Biolink
          </h2>

          {/* Form */}
          {/* Tăng nhẹ khoảng cách giữa các input */}
          <form className="space-y-7" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                // Tăng nhẹ độ sáng của label
                className="block text-sm font-medium text-gray-100 mb-1">
                Địa chỉ email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                // Tăng độ sáng placeholder, tinh chỉnh focus ring, thêm hiệu ứng transition
                className="block w-full px-4 py-2.5 border border-white/30 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 focus:border-transparent sm:text-sm bg-white/20 text-white transition duration-200 ease-in-out"
                placeholder="ban@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                // Tăng nhẹ độ sáng của label
                className="block text-sm font-medium text-gray-100 mb-1">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                // Tăng độ sáng placeholder, tinh chỉnh focus ring, thêm hiệu ứng transition
                className="block w-full px-4 py-2.5 border border-white/30 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 focus:border-transparent sm:text-sm bg-white/20 text-white transition duration-200 ease-in-out"
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>

            {/* Phần quên mật khẩu (vẫn đang comment) */}
            {/* <div className="flex items-center justify-end"> // Căn phải nếu muốn
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-200 hover:text-white transition duration-150 ease-in-out">
                Quên mật khẩu?
              </a>
            </div>
          </div> */}

            {/* Nút Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                // Thêm flex items-center justify-center nếu chưa có
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-white transition duration-150 ease-in-out disabled:opacity-60">
                {loading ? (
                  <>
                    {" "}
                    {/* Dùng Fragment để chứa cả spinner và text */}
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng nhập" // Chữ gốc khi không loading
                )}
              </button>
            </div>
          </form>

          {/* Link đăng ký */}
          <p className="text-sm text-center text-gray-100">
            Chưa có tài khoản?{" "}
            <Link // <-- Đổi từ <a> sang <Link>
              to="/register" // <-- Trỏ đến route /register
              className="font-semibold text-white hover:text-indigo-100 hover:underline transition duration-150 ease-in-out">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
