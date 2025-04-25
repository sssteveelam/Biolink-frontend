import LoginPage from "./pages/LoginPage"; // Import trang Login
import DashboardPage from "./pages/DashboardPage";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Import ProtectedRoute
import PublicProfilePage from "./pages/PublicProfilePage";
import { Routes, Route, Link, Navigate } from "react-router-dom"; // Thêm Navigate vào đây
import RegisterPage from "./pages/RegisterPage"; // Import
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
    <Toaster
        position="top-center" // Vị trí hiển thị toast (có thể đổi thành 'top-right', 'bottom-center'...)
        reverseOrder={false} // Thứ tự hiển thị toast (false: mới nhất ở trên)
        gutter={8} // Khoảng cách giữa các toast
        toastOptions={{
          // Cấu hình mặc định cho các loại toast
          className: '', // Thêm class chung nếu muốn
          duration: 3000, // Thời gian hiển thị mặc định (3 giây)
          style: {
            background: '#363636', // Màu nền tối
            color: '#fff', // Chữ trắng
          },
          // Cấu hình riêng cho success/error
          success: {
            duration: 2000, // Hiện nhanh hơn chút
            // theme: { primary: 'green', secondary: 'black',}, // Có thể custom theme
          },
           error: {
            duration: 4000, // Hiện lâu hơn chút
          },
        }}
      />
      {/* ... */}
      <Routes>
        {/* Các route cụ thể */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        {/* Redirect từ trang gốc sang trang login */}
        <Route path="/" element={<Navigate to="/login" replace />} />{" "}
        {/* <-- THÊM DÒNG NÀY */}
        {/* Route động cho trang public - Đặt ở cuối */}
        <Route path="/:username" element={<PublicProfilePage />} />
        {/* <Route path="*" ... /> */}
      </Routes>
      {/* ... */}
    </>
  );
}

export default App;
