import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm Link
import api from "../api/axiosConfig"; // Import instance axios đã cấu hình
import toast from "react-hot-toast";

export default function RegisterPage() {
  // Dùng một state object để quản lý các input cho gọn
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "", // Tên hiển thị (không bắt buộc)
    password: "",
  });

  const [passwordConfirm, setPasswordConfirm] = useState(""); // State riêng cho xác nhận mật khẩu
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

    // --- Kiểm tra phía Client trước khi gửi lên server ---
    if (formData.password !== passwordConfirm) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);

    try {
      // Gọi API register backend
      const response = await api.post("/api/auth/register", formData);

      console.log("Register Response:", response.data);
      setLoading(false);
      toast.success(
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

      toast.error(
        `${err.response?.data?.message} || "Đã có lỗi xảy ra khi đăng ký."`
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen min-w-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 px-4">
      <div className="w-full max-w-md p-10 space-y-6 bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Tạo tài khoản Biolink
        </h2>

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
              {loading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Đang xử lý...</span>
                </div>
              ) : (
                "Đăng ký"
              )}
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
