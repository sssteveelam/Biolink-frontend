// src/pages/ForgotPasswordPage.jsx (Ví dụ cơ bản)
import React, { useState } from "react";
import api from "../api/axiosConfig"; //
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // Để hiển thị thông báo sau khi gửi

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Xóa thông báo cũ

    try {
      await api.post("/api/auth/forgot-password", { email }); // Gọi API backend
      setMessage(
        "Nếu email bạn cung cấp tồn tại trong hệ thống, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu."
      );
      setEmail(""); // Xóa email sau khi gửi
      toast.success("Yêu cầu đã được gửi đi.");
    } catch (err) {
      console.error(
        "Forgot Password Error:",
        err.response ? err.response.data : err.message
      );
      // Không nên báo lỗi chi tiết về email có tồn tại hay không vì lý do bảo mật
      // Chỉ hiển thị thông báo chung
      setMessage(
        "Nếu email bạn cung cấp tồn tại trong hệ thống, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu."
      );
      // Hoặc có thể dùng toast.error nếu muốn phân biệt rõ
      // toast.error(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 px-4">
      <div className="w-full max-w-md p-10 space-y-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Quên Mật Khẩu
        </h2>
        <p className="text-center text-gray-100 text-sm mb-6">
          Nhập địa chỉ email của bạn để nhận hướng dẫn đặt lại mật khẩu.
        </p>

        {message ? (
          <div
            className="bg-green-100/30 border border-green-400/50 text-green-900 px-4 py-3 rounded-lg text-sm text-center"
            role="alert">
            {message}
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
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
                className="block w-full px-4 py-2.5 border border-white/30 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm bg-white/20 text-white"
                placeholder="ban@email.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/10 focus:ring-white transition disabled:opacity-60"
                aria-busy={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" /> Đang
                    gửi...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-5 w-5" /> Gửi yêu cầu
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <p className="text-sm text-center text-gray-100 pt-4">
          Nhớ mật khẩu rồi?{" "}
          <Link
            to="/login"
            className="font-semibold text-white hover:text-indigo-100 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
