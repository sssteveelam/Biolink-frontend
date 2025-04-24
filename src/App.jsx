import LoginPage from "./pages/LoginPage"; // Import trang Login
import DashboardPage from "./pages/DashboardPage";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Import ProtectedRoute
import PublicProfilePage from "./pages/PublicProfilePage";
import { Routes, Route, Link, Navigate } from "react-router-dom"; // Thêm Navigate vào đây

function App() {
  return (
    <>
      {/* ... */}
      <Routes>
        {/* Các route cụ thể */}
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/register" ... /> */}
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
