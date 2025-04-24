import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm Link
import api from "../api/axiosConfig"; // Import instance axios đã cấu hình

export default function RegisterPage() {
  // Dùng một state object để quản lý các input cho gọn
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "", // Tên hiển thị (không bắt buộc)
    password: "",
  });

  const [passwordConfirm, setPasswordConfirm] = useState(""); // State riêng cho xác nhận mật khẩu
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State cho thông báo thành công
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Hàm xử lý khi input thay đổi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccessMessage("");

    // --- Kiểm tra phía Client trước khi gửi lên server ---
    if (formData.password !== passwordConfirm) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp!");
      return; // Dừng lại nếu không khớp
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    // Thêm các validation khác nếu cần (vd: username format)

    setLoading(true);

    try {
      // Gọi API register backend
      const response = await api.post("/api/auth/register", formData);

      console.log("Register Response:", response.data);
      setLoading(false);
      setSuccessMessage(
        "Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập."
      );

      // Reset form sau khi thành công
      setFormData({ username: "", email: "", name: "", password: "" });
      setPasswordConfirm("");

      // Tự động chuyển sang trang Login sau vài giây
      setTimeout(() => {
        navigate("/login");
      }, 2500); // Chờ 2.5 giây
    } catch (err) {
      setLoading(false);
      console.error(
        "Register Error:",
        err.response ? err.response.data : err.message
      );
      // Hiển thị lỗi từ backend (ví dụ: trùng username/email)
      setError(err.response?.data?.message || "Đã có lỗi xảy ra khi đăng ký.");
      console.error("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen min-w-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 px-4">
      <div className="w-full max-w-md p-10 space-y-6 bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Tạo tài khoản Biolink
        </h2>

        {/* Thông báo lỗi hoặc thành công */}
        {error && (
          <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-md">
            {error}
          </p>
        )}
        {successMessage && (
          <p className="text-sm text-center text-green-700 bg-green-100 p-3 rounded-md">
            {successMessage}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-100 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username" // name phải khớp key trong formData
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              minLength="3"
              className="block w-full px-4 py-2.5 border border-white/30 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm bg-white/20 text-white"
              placeholder="Tên đăng nhập (vd: huytest)"
            />
          </div>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-100 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full px-4 py-2.5 border border-white/30 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm bg-white/20 text-white"
              placeholder="Địa chỉ email của bạn"
            />
          </div>
          {/* Name (Optional) */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-100 mb-1">
              Tên hiển thị (Tùy chọn)
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-4 py-2.5 border border-white/30 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm bg-white/20 text-white"
              placeholder="Tên bạn muốn hiển thị"
            />
          </div>
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-100 mb-1">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="block w-full px-4 py-2.5 border border-white/30 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm bg-white/20 text-white"
              placeholder="Tối thiểu 6 ký tự"
            />
          </div>
          {/* Confirm Password */}
          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium text-gray-100 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              minLength="6"
              className="block w-full px-4 py-2.5 border border-white/30 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm bg-white/20 text-white"
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          {/* Nút Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-white transition duration-150 ease-in-out disabled:opacity-60">
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </div>
        </form>

        {/* Link quay lại Login */}
        <p className="text-sm text-center text-gray-100">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-semibold text-white hover:text-indigo-100 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
