import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileSettings from "../components/dashboard/ProfileSettings"; // Kiểm tra lại đường dẫn
import LinkManager from "../components/dashboard/LinkManager"; // Hoặc '../components/LinkManager' tùy cấu trúc
import toast from "react-hot-toast";

function DashboardPage() {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Hẹn gặp lại!");
    navigate("/login");
  };

  return (
    <div className="  bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="flex justify-between items-center mb-6">
        {" "}
        {/* Thêm flex để đặt nút logout cạnh title */}
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-black font-semibold rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-150 ease-in-out">
          Đăng xuất
        </button>
      </div>

      {authState.user ? (
        <p className="mb-4 text-lg">
          Xin chào,{" "}
          <span className="font-semibold">
            {authState.user.name || authState.user.username}
          </span>
          !
        </p>
      ) : (
        <p className="mb-4 text-lg text-gray-500">
          Đang tải thông tin người dùng...
        </p>
      )}

      {/* Render component cài đặt profile ở đây */}
      <ProfileSettings />
      <LinkManager />
      {/* TODO: Thêm component quản lý Links ở đây */}
    </div>
  );
}

export default DashboardPage;
