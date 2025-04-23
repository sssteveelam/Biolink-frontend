import { Routes, Route, Link } from "react-router-dom"; // Import Routes, Route, Link
import LoginPage from "./pages/LoginPage"; // Import trang Login
import DashboardPage from "./pages/DashboardPage";
import { ProtectedRoute } from "./components/ProtectedRoute"; // Import ProtectedRoute
import PublicProfilePage from "./pages/PublicProfilePage";

function App() {
  return (
    <>
      {" "}
      {/* Có thể dùng Fragment hoặc div bọc ngoài */}
      {/* Có thể thêm Header/Navbar ở đây (nằm ngoài Routes) */}
      {/* <nav>
         <Link to="/">Home</Link> | <Link to="/login">Login</Link>
      </nav> */}
      {/* ---------------------------------------- */}
      <Routes>
        {" "}
        {/* Định nghĩa các routes */}
        <Route path="/login" element={<LoginPage />} />
        {/* ---------------------------------------- */}
        {/* <Route path="/register" element={<div>Register Page</div>} /> */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="/:username" element={<PublicProfilePage />} />
        {/* <Route path="/" element={<div>Home Page</div>} /> */}
        {/* TODO: Add other routes later */}
        {/* ---------------------------------------- */}
      </Routes>
      {/* ---------------------------------------- */}
      {/* Có thể thêm Footer ở đây (nằm ngoài Routes) */}
    </>
  );
}

export default App;
