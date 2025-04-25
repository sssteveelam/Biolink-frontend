import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";

export default function ProfileSettings() {
  const { authState } = useContext(AuthContext); // Lấy trạng thái auth, đặc biệt là token
  const [bio, setBio] = useState("");
  const [themeColor, setThemeColor] = useState("#ffffff"); // Giá trị mặc định
  const [isLoading, setIsLoading] = useState(true); // Loading khi fetch data ban đầu
  const [isSaving, setIsSaving] = useState(false); // Loading khi bấm nút lưu

  // Fetch profile data khi component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);

      try {
        const response = await api.get("/api/user/profile/me");

        if (response.data) {
          setBio(response.data.bio || "");
          setThemeColor(response.data.themeColor);
        } else {
          // Nếu API trả về null/404, giữ giá trị state mặc định
          setBio("");
          setThemeColor("#ffffff");
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log("Profile not found, using default values.");
          setBio("");
          setThemeColor("#ffffff");
        } else {
          console.error(
            "Error fetching profile:",
            err.response ? err.response.data : err.message
          );

          toast.error("Lỗi khi tải thông tin profile");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [authState.token]); // Chỉ chạy lại nếu token thay đổi (ví dụ: sau khi login)

  // Hàm xử lý khi submit form cập nhật profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await api.put(
        "/api/user/profile/me",
        { bio, themeColor } // Dữ liệu gửi lên backend
      );

      // Cập nhật lại state với dữ liệu mới nhất từ server (tùy chọn)
      setBio(response.data.bio || "");
      setThemeColor(response.data.themeColor || "#ffffff");
      // thong bao thanh cong
      toast.success("Cập nhật profile thành công!");
    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response ? err.response.data : err.message
      );
      toast.error(
        `${err.response?.data?.message || "Lỗi khi cập nhật profile."}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Hiển thị trạng thái loading ban đầu
  if (isLoading) {
    return <div className="text-center p-4">Đang tải thông tin profile...</div>;
  }
  // Giao diện form
  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Cài đặt Profile
      </h3>
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1">
            Tiểu sử (Bio)
          </label>
          <textarea
            id="bio"
            name="bio"
            rows="3"
            maxLength="160" // Giới hạn giống trong schema
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Giới thiệu ngắn về bạn..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}></textarea>
          <p className="text-xs text-gray-500 mt-1">{bio.length}/160 ký tự</p>
        </div>

        <div>
          <label
            htmlFor="themeColor"
            className="block text-sm font-medium text-gray-700 mb-1">
            Màu chủ đề (Theme Color)
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="themeColor"
              name="themeColor"
              type="color" // Dùng input type color cho dễ chọn màu
              className="h-10 w-14 p-1 border border-gray-300 rounded-md cursor-pointer"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
            />
            {/* Hiển thị mã màu dạng text để user có thể copy/paste */}
            <input
              type="text"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)} // Cho phép nhập tay mã màu
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
