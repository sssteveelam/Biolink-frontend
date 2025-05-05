import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import ProfileSettings from "../components/dashboard/ProfileSettings";
import LinkManager from "../components/dashboard/LinkManager";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react"; // Nhớ cài đặt: npm install lucide-react
import ShareProfileCard from "../components/ShareProfileCard"; // <-- Import component mới

function DashboardPage() {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công. Hẹn gặp lại!");
    navigate("/login");
  };

  const renderLoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="h-6 bg-gray-300/50 rounded w-3/4"></div>{" "}
      {/* Skeleton cho welcome msg - làm mờ hơn chút */}
      <div className="h-40 bg-white/50 backdrop-blur-sm rounded-lg border border-white/10"></div>{" "}
      {/* Skeleton cho Card - style tương tự card thật */}
      <div className="h-60 bg-white/50 backdrop-blur-sm rounded-lg border border-white/10"></div>{" "}
      {/* Skeleton cho Card */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl space-y-8">
        <header className="flex justify-between items-center mb-6 md:mb-8">
          {authState.user ? (
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Xin chào,{" "}
              <span className="font-semibold">
                {authState.user.name || authState.user.username}!
              </span>
            </h1>
          ) : (
            <div className="h-8 bg-white/30 rounded w-1/2 animate-pulse"></div> // Skeleton cho tiêu đề
          )}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 transition duration-150 ease-in-out backdrop-blur-sm border border-white/30"
            aria-label="Đăng xuất">
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </button>
        </header>

        {!authState.user ? (
          renderLoadingSkeleton()
        ) : (
          <main className="space-y-6 md:space-y-8">
            {/* ==>> THÊM COMPONENT SHARE VÀO ĐÂY <<== */}
            <section aria-labelledby="share-profile-heading">
              <ShareProfileCard />
            </section>

            {/* Card Profile Settings - VIỀN ĐÃ ĐƯỢC LÀM MỜ HƠN */}
            <section
              aria-labelledby="profile-settings-heading"
              className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/15">
              {/* ^^^^^^^^^^^^^^^^^ Thay đổi ở đây */}
              <div className="p-6 md:p-8">
                <ProfileSettings />
              </div>
            </section>

            {/* Card Link Manager - VIỀN ĐÃ ĐƯỢC LÀM MỜ HƠN */}
            <section
              aria-labelledby="link-manager-heading"
              className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/15">
              {/* ^^^^^^^^^^^^^^^^^ Thay đổi ở đây */}
              <div className="p-6 md:p-8">
                <LinkManager />
              </div>
            </section>
          </main>
        )}
      </div>

      <div className="w-full text-center mt-10 ">
        <a href="/" className="text-md text-white">
          Powered by Biolink-Fast
        </a>
      </div>
    </div>
  );
}

export default DashboardPage;
