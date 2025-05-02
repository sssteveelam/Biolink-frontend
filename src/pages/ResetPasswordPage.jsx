// src/pages/ResetPasswordPage.jsx (Ví dụ cơ bản)
import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig"; //
import toast from "react-hot-toast";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Loader2, KeyRound } from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams(); // Lấy token từ URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Để báo lỗi nếu token không hợp lệ ngay từ đầu
  const [success, setSuccess] = useState(false); // Để hiển thị thông báo thành công

  // (Tùy chọn) Bạn có thể thêm bước kiểm tra token hợp lệ ngay khi load trang
  // useEffect(() => {
  //   const verifyToken = async () => {
  //     try {
  //       // Có thể tạo 1 API riêng để check token nhanh, hoặc dựa vào lỗi của API reset
  //       // await api.get(`/api/auth/verify-reset-token/${token}`);
  //     } catch (err) {
  //       setError('Token không hợp lệ hoặc đã hết hạn.');
  //       toast.error('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
  //     }
  //   };
  //   if (token) {
  //     verifyToken();
  //   } else {
  //      setError('Không tìm thấy token đặt lại mật khẩu.');
  //   }
  // }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi cũ

    if (password.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== passwordConfirm) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    setLoading(true);

    try {
      // Gọi API backend để đặt lại mật khẩu
      await api.post(`/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      toast.success("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.");
      // Tự động chuyển hướng sau vài giây
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error(
        "Reset Password Error:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response?.data?.message ||
          "Đặt lại mật khẩu thất bại. Link có thể đã hết hạn."
      );
      toast.error(
        err.response?.data?.message ||
          "Đặt lại mật khẩu thất bại. Link có thể đã hết hạn."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-500 px-4">
      <div className="w-full max-w-md p-10 space-y-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Đặt Lại Mật Khẩu
        </h2>

        {/* Hiển thị nếu thành công */}
        {success ? (
          <div
            className="bg-green-100/30 border border-green-400/50 text-green-900 px-4 py-3 rounded-lg text-sm text-center"
            role="alert">
            Đặt lại mật khẩu thành công! Bạn sẽ được chuyển đến trang đăng nhập
            sau giây lát.
            <p className="mt-2">
              <Link
                to="/login"
                className="font-semibold text-white hover:text-indigo-100 hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        ) : error /* Hiển thị nếu có lỗi token ban đầu */ ? (
          <div
            className="bg-red-100/30 border border-red-400/50 text-red-900 px-4 py-3 rounded-lg text-sm text-center"
            role="alert">
            {error}
            <p className="mt-2">
              <Link
                to="/forgot-password"
                className="font-semibold text-white hover:text-indigo-100 hover:underline">
                Yêu cầu link mới
              </Link>
            </p>
          </div>
        ) : (
          /* Hiển thị form nếu chưa thành công và không có lỗi token ban đầu */
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-100 mb-1">
                Mật khẩu mới
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="block w-full px-4 py-2.5 border border-white/30 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm bg-white/20 text-white"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>
            <div>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-100 mb-1">
                Xác nhận mật khẩu mới
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
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-white transition disabled:opacity-60"
                aria-busy={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" /> Đang cập
                    nhật...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-5 w-5" /> Đặt lại mật khẩu
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
