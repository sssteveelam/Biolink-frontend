import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Bỏ Navigate vì không dùng trực tiếp ở đây
import ProfileSettings from "../components/dashboard/ProfileSettings";
import LinkManager from "../components/dashboard/LinkManager";
import toast from "react-hot-toast";
import { LogOut, Loader2 } from "lucide-react"; // Import Loader2 nếu cần cho skeleton
import ShareProfileCard from "../components/ShareProfileCard"; // Đổi tên thành ShareProfileSection hoặc giữ nguyên

function DashboardPage() {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Bảng điều khiển - Biolink"; // Cập nhật title
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công. Hẹn gặp lại!");
    navigate("/login");
  };

  // --- Skeleton Loading (có thể làm chi tiết hơn) ---
  const renderLoadingSkeleton = () => (
    <div className="animate-pulse space-y-6 md:space-y-8 lg:grid lg:grid-cols-3 lg:gap-8">
      {/* Skeleton cho cột trái (2 cột lg) */}
      <div className="lg:col-span-2 space-y-6 md:space-y-8">
        <div className="h-24 bg-white/40 backdrop-blur-sm rounded-xl border border-white/10"></div>{" "}
        {/* Share card skeleton */}
        <div className="h-64 bg-white/40 backdrop-blur-sm rounded-xl border border-white/10"></div>{" "}
        {/* Profile settings skeleton */}
      </div>
      {/* Skeleton cho cột phải (1 cột lg) */}
      <div className="lg:col-span-1">
        <div className="h-96 bg-white/40 backdrop-blur-sm rounded-xl border border-white/10"></div>{" "}
        {/* Link manager skeleton */}
      </div>
    </div>
  );
  // -------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-11xl">
        {" "}
        {/* --- Header Responsive --- */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-10">
          {" "}
          {authState.user ? (
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2 sm:mb-0 mr-4">
              {" "}
              Xin chào,{" "}
              <span className="font-semibold block sm:inline">
                {" "}
                {authState.user.name || authState.user.username}!
              </span>
            </h1>
          ) : (
            // Skeleton Header
            <div className="h-8 bg-white/30 rounded w-3/4 mb-2 sm:mb-0 animate-pulse"></div>
          )}
          <button
            onClick={handleLogout}
            className="flex-shrink-0 flex items-center px-3 sm:px-4 py-2 bg-white/20 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 transition duration-150 ease-in-out backdrop-blur-sm border border-white/30"
            aria-label="Đăng xuất">
            <LogOut className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Đăng xuất</span>{" "}
            <span className="sm:hidden">Thoát</span>{" "}
          </button>
        </header>
        {/* --- Hết Header --- */}
        {/* --- Main Content --- */}
        {!authState.user ? (
          renderLoadingSkeleton()
        ) : (
          <main className="space-y-6 md:space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {" "}
              <section aria-labelledby="share-profile-heading">
                <ShareProfileCard />
              </section>
              <section
                aria-labelledby="profile-settings-heading"
                className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/15">
                {/* Giảm padding một chút trên mobile */}
                <div className="p-4 sm:p-6 md:p-8">
                  <ProfileSettings />
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <section
                aria-labelledby="link-manager-heading"
                className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/15">
                {/* Giảm padding một chút trên mobile */}
                <div className="p-4 sm:p-6 md:p-8">
                  <LinkManager />
                </div>
              </section>
            </div>
          </main>
        )}
        {/* --- Hết Main Content --- */}
      </div>{" "}
      {/* --- Footer  --- */}
      <div className="w-full text-center mt-12 mb-4">
        <a
          href="https://your-homepage.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-100 hover:text-white opacity-75 hover:opacity-100 transition">
          Powered by Biolink App
        </a>
      </div>
      {/* --- Hết Footer --- */}
    </div>
  );
}

export default DashboardPage;
