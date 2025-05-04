import React, { useState, useContext, useEffect, useRef } from "react"; // Thêm useEffect, useRef
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff } from "lucide-react"; // Import icons cần thiết

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State để hiện/ẩn mật khẩu
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const emailInputRef = useRef(null); // Ref cho ô input email

  // Tự động focus vào ô email khi component mount
  useEffect(() => {
    document.title = "Login";

    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", { email, password });
      // Không cần setLoading(false) ở đây nếu navigate ngay lập tức

      if (response.data && response.data.token) {
        login(response.data.token, response.data.user); // Gọi hàm login từ context
        toast.success("Đăng nhập thành công!"); // Thông báo thành công
        navigate("/dashboard"); // Chuyển hướng sau khi login thành công
      } else {
        // Trường hợp API trả về 200 nhưng không có token/user (ít xảy ra)
        throw new Error("Dữ liệu trả về không hợp lệ.");
      }
    } catch (err) {
      setLoading(false); // Chỉ setLoading(false) khi có lỗi và cần ở lại trang
      console.error(
        "Login error:",
        err.response ? err.response.data : err.message
      );
      toast.error(
        err.response?.data?.message || "Email hoặc mật khẩu không đúng."
      ); // Thông báo lỗi cụ thể hơn nếu có
    }
  };

  return (
    // Loại bỏ div thừa, áp dụng gradient và flex trực tiếp vào đây
    <div className="flex justify-center items-center min-h-screen min-w-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-8">
      {" "}
      {/* Thêm py-8 */}
      {/* Card đăng nhập */}
      <div className="w-full max-w-md p-10 space-y-8 bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Đăng nhập Biolink
        </h2>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {" "}
          {/* Giảm space-y một chút */}
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-100 mb-1">
              Địa chỉ email
            </label>
            <input
              ref={emailInputRef} // Gán ref vào đây
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-4 py-2.5 border border-white/30 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 focus:border-transparent sm:text-sm bg-white/20 text-white transition duration-200 ease-in-out"
              placeholder="ban@email.com"
            />
          </div>
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-100 mb-1">
              Mật khẩu
            </label>
            {/* Thêm relative positioning cho div chứa input và nút */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // Thay đổi type dựa vào state
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                // Thêm padding phải để không bị che bởi nút
                className="block w-full pl-4 pr-10 py-2.5 border border-white/30 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 focus:border-transparent sm:text-sm bg-white/20 text-white transition duration-200 ease-in-out"
                placeholder="Nhập mật khẩu của bạn"
              />
              {/* Nút hiện/ẩn mật khẩu */}
              <button
                type="button" // Quan trọng: type="button" để không submit form
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-300 hover:text-white focus:outline-none focus:text-white rounded-r-lg"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="text-right text-sm mb-6">
            {" "}
            {/* Hoặc mb-4 */}
            <Link
              to="/forgot-password" // Link đến trang quên mật khẩu
              className="font-medium text-indigo-200 hover:text-white transition duration-150 ease-in-out">
              Quên mật khẩu?
            </Link>
          </div>
          {/* Nút Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              // Dùng icon Loader2, nhất quán style
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-white transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
              aria-busy={loading} // Thêm aria-busy cho accessibility
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />{" "}
                  {/* Dùng Loader2 */}
                  Đang xử lý...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </div>
        </form>

        {/* Link đăng ký */}
        <p className="text-sm text-center text-gray-100">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-semibold text-white hover:text-indigo-100 hover:underline transition duration-150 ease-in-out">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
