// src/pages/ForgotPasswordPage.jsx
import React, { useState, useEffect } from "react"; // <<< Thêm useEffect
import api from "../api/axiosConfig";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Thêm useEffect để đặt title
  useEffect(() => {
    document.title = "Quên Mật khẩu - Biolink";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/api/auth/forgot-password", { email });
      setMessage(
        "Nếu email bạn cung cấp tồn tại trong hệ thống, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu."
      );
      setEmail("");
      toast.success("Yêu cầu đã được gửi đi.");
    } catch (err) {
      console.error(
        "Forgot Password Error:",
        err.response ? err.response.data : err.message
      );
      setMessage(
        "Nếu email bạn cung cấp tồn tại trong hệ thống, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu."
      );
      // Không nên toast error chi tiết ở đây vì lý do bảo mật
      // Có thể log lỗi ra console thôi
    } finally {
      setLoading(false);
    }
  };

  return (
    // Giữ nguyên flex container và gradient nền
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 px-4 py-8">
      {" "}
      {/* Thêm py-8 */}
      {/* Card nội dung: điều chỉnh padding và space */}
      <div className="w-full max-w-md p-6 sm:p-8 md:p-10 space-y-5 md:space-y-6 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30">
        {" "}
        {/* p, space-y responsive */}
        {/* Tiêu đề: điều chỉnh size chữ và margin */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4 md:mb-6">
          {" "}
          {/* text size, margin bottom responsive */}
          Quên Mật Khẩu
        </h2>
        {/* Mô tả: điều chỉnh margin */}
        <p className="text-center text-gray-100 text-sm mb-4 md:mb-6">
          {" "}
          {/* margin bottom responsive */}
          Nhập địa chỉ email của bạn để nhận hướng dẫn đặt lại mật khẩu.
        </p>
        {message ? (
          <div
            className="bg-green-100/30 border border-green-400/50 text-green-900 px-4 py-3 rounded-lg text-sm text-center"
            role="alert">
            {message}
          </div>
        ) : (
          // Form: điều chỉnh space-y
          <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
            {" "}
            {/* space-y responsive */}
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
                // Input style giữ nguyên, đã có sm:text-sm là ổn
                className="block w-full px-4 py-2.5 border border-white/30 rounded-lg shadow-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm bg-white/20 text-white"
                placeholder="ban@email.com"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                // Button style giữ nguyên
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
        {/* Link quay lại: điều chỉnh padding top */}
        <p className="text-sm text-center text-gray-100 pt-3 md:pt-4">
          {" "}
          {/* padding top responsive */}
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
