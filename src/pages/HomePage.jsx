// src/pages/HomePage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ThreeBackground from "../components/home/ThreeBackground"; // <<< Import component 3D
import {
  Zap,
  UserPlus,
  Link as LinkLucide,
  Palette,
  Share2,
  BarChart2,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Github,
  User, // <<< Import tất cả icon cần dùng
} from "lucide-react";

export default function HomePage() {
  useEffect(() => {
    document.title = "Biolink - Tạo trang liên kết cá nhân của bạn";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      {/* Background 3D */}
      <ThreeBackground /> {/* <<< Render component 3D */}
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 backdrop-blur-sm bg-opacity-80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold text-indigo-600">
              <img src="/logo/logo-rebg.png" className="w-7 h-7" />{" "}
              {/* <<< Icon React */}
              <span>Biolink</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-sm hover:shadow-md">
                Đăng ký miễn phí
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="flex-grow flex items-center relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center hero-content">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Một liên kết. <span className="gradient-text">Vô vàn</span> khả
            năng.
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Tạo trang Biolink cá nhân của riêng bạn miễn phí. Tập hợp tất cả
            liên kết quan trọng, mạng xã hội, dự án của bạn vào một nơi duy
            nhất.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg transform hover:scale-105 pulse">
            Bắt đầu miễn phí
            <UserPlus className="inline-block w-5 h-5 ml-2 mb-0.5" />{" "}
            {/* <<< Icon React */}
          </Link>
          {/* Floating Elements (giữ nguyên hoặc xóa nếu đã có background 3D) */}
          {/* <div className="mt-16 flex justify-center space-x-8"> ... </div> */}
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-white relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tại sao chọn Biolink?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="feature-card text-center p-6 bg-white rounded-xl border border-gray-100 hover:border-transparent transition duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 text-indigo-600 rounded-full">
                <LinkLucide className="w-6 h-6" /> {/* <<< Icon React */}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Quản lý Link dễ dàng
              </h3>
              <p className="text-sm text-gray-600">
                Thêm, sửa, xóa và sắp xếp tất cả các liên kết quan trọng của bạn
                một cách trực quan.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="feature-card text-center p-6 bg-white rounded-xl border border-gray-100 hover:border-transparent transition duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-purple-100 text-purple-600 rounded-full">
                <Palette className="w-6 h-6" /> {/* <<< Icon React */}
              </div>
              <h3 className="text-lg font-semibold mb-2">Tùy biến Giao diện</h3>
              <p className="text-sm text-gray-600">
                Lựa chọn màu sắc, hình nền, kiểu nút để tạo trang profile mang
                đậm dấu ấn cá nhân.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="feature-card text-center p-6 bg-white rounded-xl border border-gray-100 hover:border-transparent transition duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-pink-100 text-pink-600 rounded-full">
                <Share2 className="w-6 h-6" /> {/* <<< Icon React */}
              </div>
              <h3 className="text-lg font-semibold mb-2">Chia sẻ Đơn giản</h3>
              <p className="text-sm text-gray-600">
                Dễ dàng chia sẻ trang Biolink của bạn với mọi người qua link
                trực tiếp hoặc mã QR.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="feature-card text-center p-6 bg-white rounded-xl border border-gray-100 hover:border-transparent transition duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-green-100 text-green-600 rounded-full">
                <BarChart2 className="w-6 h-6" /> {/* <<< Icon React */}
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Thống kê Lượt click
              </h3>
              <p className="text-sm text-gray-600">
                Theo dõi hiệu quả các liên kết của bạn với số liệu thống kê lượt
                click chi tiết.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Demo Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Trang cá nhân <span className="gradient-text">độc đáo</span> của
                bạn
              </h2>
              <p className="text-gray-600 mb-6">
                Tạo một trang cá nhân đẹp mắt với nhiều tùy chọn tùy biến. Thêm
                hình ảnh, video, liên kết mạng xã hội và nhiều hơn nữa.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />{" "}
                  {/* <<< Icon React */}
                  <span className="text-gray-700">Hơn 50 mẫu thiết kế</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />{" "}
                  {/* <<< Icon React */}
                  <span className="text-gray-700">
                    Tùy chỉnh màu sắc và phông chữ
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />{" "}
                  {/* <<< Icon React */}
                  <span className="text-gray-700">Hỗ trợ hình nền động</span>
                </li>
              </ul>
            </div>
            {/* Phần Demo Profile (giữ nguyên cấu trúc HTML, thay icon) */}
            <div className="md:w-1/2 relative">
              <div className="bg-white p-4 rounded-xl shadow-xl transform rotate-1">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600" />{" "}
                      {/* <<< Icon React */}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold">Nguyễn Văn A</h3>
                      <p className="text-sm opacity-80">Nội dung sáng tạo</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <a
                      href="#"
                      className="block bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition flex items-center">
                      <Instagram className="w-4 h-4 mr-2" />{" "}
                      {/* <<< Icon React */}
                      Instagram
                    </a>
                    <a
                      href="#"
                      className="block bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition flex items-center">
                      <svg className="w-4 h-4 mr-2" /*...*/>
                        {" "}
                        {/* Giữ lại SVG Youtube nếu Lucide không có */}{" "}
                      </svg>
                      YouTube
                    </a>
                    <a
                      href="#"
                      className="block bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition flex items-center">
                      <Github className="w-4 h-4 mr-2" /> {/* <<< Icon React */}
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 to-purple-800 text-white">
        {/* ... nội dung CTA ... */}
      </section>
      {/* Footer */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Sẵn sàng tạo trang Biolink của bạn?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Mọi người đã sử dụng Biolink để kết nối với khán giả của họ. Hãy
            tham gia ngay hôm nay!
          </p>
          <a
            href="/register"
            className="inline-block px-8 py-3 text-lg font-semibold text-indigo-700 bg-white rounded-lg hover:bg-gray-100 transition shadow-lg transform hover:scale-105">
            Đăng ký ngay hôm nay!
          </a>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-400 text-sm py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-medium mb-4">Biolink</h3>
              <p className="mb-4">
                Công cụ tạo trang liên kết cá nhân đơn giản và hiệu quả nhất.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <i data-lucide="facebook" className="w-5 h-5"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i data-lucide="twitter" className="w-5 h-5"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <i data-lucide="instagram" className="w-5 h-5"></i>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Sản phẩm</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Tính năng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Giá cả
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Mẫu thiết kế
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Tích hợp
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Tài nguyên</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Hướng dẫn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Hỗ trợ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Công ty</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white">
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Điều khoản
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Bảo mật
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            &copy; {new Date().getFullYear()} Biolink Fast App. Tạo bởi Steven
            Lam.
          </div>
        </div>
      </footer>
    </div>
  );
}
