import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import api from "../api/axiosConfig";

export default function LoginPage() {
  const [email, setEmail] = useState(""); // State cho ô email
  const [password, setPassword] = useState(""); // State cho ô password
  const [error, setError] = useState(null); // State để hiển thị lỗi nếu có
  const [loading, setLoading] = useState(false); // State để biết khi nào đang chờ API trả về
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate(); // Khởi tạo hook navigate

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trang bị reload khi submit form
    setError(null); // Xóa lỗi cũ trước khi gọi API mới
    setLoading(true); // Báo là đang xử lý

    try {
      // Gọi API login của backend bằng axios
      // Quan trọng: Đảm bảo URL backend chính xác!
      const response = await api.post("/api/auth/login", {
        email: email,
        password: password,
      });
      // Nếu API trả về thành công (status 2xx)
      console.log("Login Response:", response.data); // In ra data trả về (có token)
      setLoading(false); // Hết loading

      // -0----------------------------------------
      // --- Thêm dòng này để lưu token ---
      if (response.data && response.data.token) {
        login(response.data.token, response.data.user);
        console.log("Token saved to localStorage:", response.data.token);
      }
      // -0----------------------------------------

      // --- Các bước xử lý sau khi login thành công (Sẽ làm kỹ hơn ở các bước sau) ---

      // 1. Lưu token vào đâu đó (ví dụ: localStorage) để dùng cho các request sau
      // localStorage.setItem('authToken', response.data.token);
      // console.log("Token saved to localStorage");

      // 2. Cập nhật trạng thái đăng nhập toàn cục (ví dụ: dùng Context API)
      // setUser(response.data.user); // Giả sử có hàm setUser từ Context

      // 3. Chuyển hướng người dùng đến trang Dashboard (ví dụ)
      // navigate('/dashboard');

      // Tạm thời chỉ hiện alert để biết thành công
      //alert("Đăng nhập thành công! Kiểm tra Console để xem token.");
      // -0----------------------------------------

      // Giờ có thể chuyển hướng người dùng
      console.log("Navigating to dashboard...");
      navigate("/dashboard");
    } catch (err) {
      // Nếu API trả về lỗi (status 4xx, 5xx)
      setLoading(false); // Hết loading
      console.error(
        "Login error:",
        err.response ? err.response.data : err.message
      );

      // Lấy message lỗi từ response của backend (nếu có) để hiển thị
      setError(
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
            <p className="text-sm text-center text-gray-100">
              Chưa có tài khoản?{" "}
              <Link // <-- Đổi từ <a> sang <Link>
                to="/register" // <-- Trỏ đến route /register
                className="font-semibold text-white hover:text-indigo-100 hover:underline transition duration-150 ease-in-out">
                Đăng ký ngay
              </Link>
            </p>

            {/* Nút Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                // Tăng padding, sử dụng gradient nhẹ cho nút, bo góc lớn hơn, hiệu ứng transition
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-white transition duration-150 ease-in-out">
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </div>
          </form>

          {/* Hiển thị lỗi */}
          {error && (
            <p className="mb-4 text-sm text-center text-red-600 bg-red-100 p-2 rounded-md">
              {error}
            </p>
          )}

          {/* Link đăng ký */}
          <p className="text-sm text-center text-gray-100">
            Chưa có tài khoản?{" "}
            <a
              href="#"
              // Làm link nổi bật hơn, có thể thêm gạch chân khi hover
              className="font-semibold text-white hover:text-indigo-100 hover:underline transition duration-150 ease-in-out">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
