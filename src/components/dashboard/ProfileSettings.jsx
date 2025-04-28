import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axiosConfig";
import toast from "react-hot-toast";
import { Save, Loader2 } from "lucide-react"; // Thêm icon Save và Loader2

export default function ProfileSettings() {
  const { authState } = useContext(AuthContext);
  const [bio, setBio] = useState("");
  const [themeColor, setThemeColor] = useState("#ffffff");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- Fetch profile data ---
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/user/profile/me");
        if (response.data) {
          setBio(response.data.bio || "");
          // Đảm bảo themeColor luôn là một string mã màu hợp lệ
          setThemeColor(
            response.data.themeColor &&
              /^#[0-9A-F]{6}$/i.test(response.data.themeColor)
              ? response.data.themeColor
              : "#ffffff"
          );
        } else {
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
  }, [authState.token]);

  // --- Handle profile update ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await api.put("/api/user/profile/me", {
        bio,
        themeColor,
      });
      // Cập nhật lại state để đảm bảo đồng bộ sau khi lưu
      setBio(response.data.bio || "");
      setThemeColor(
        response.data.themeColor &&
          /^#[0-9A-F]{6}$/i.test(response.data.themeColor)
          ? response.data.themeColor
          : "#ffffff"
      );
      toast.success("Cập nhật profile thành công!");
    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response ? err.response.data : err.message
      );
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Render Loading State ---
  if (isLoading) {
    return (
      // Container loading với style glassy
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/15 p-6 md:p-8 flex justify-center items-center min-h-[200px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="sr-only">Đang tải cài đặt profile...</span>
      </div>
    );
  }

  // --- Render Main Content ---
  return (
    // Container chính - ĐÃ ÁP DỤNG STYLE "GLASSY" VÀ VIỀN MỜ
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/15">
      {/* Thêm padding bên trong */}
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Cài đặt Profile
        </h3>
        <form onSubmit={handleProfileUpdate} className="space-y-5">
          {" "}
          {/* Tăng nhẹ space-y */}
          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-600 mb-1">
              Tiểu sử (Bio)
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              maxLength="160"
              // Style textarea nhất quán, viền mềm hơn, thêm transition
              className="block w-full px-3 py-2 border border-gray-300/70 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Giới thiệu ngắn về bạn..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {bio.length}/160 ký tự
            </p>{" "}
            {/* Căn phải cho đẹp */}
          </div>
          {/* Theme Color */}
          <div>
            <label
              htmlFor="themeColor"
              className="block text-sm font-medium text-gray-600 mb-1">
              Màu chủ đề
            </label>
            <div className="flex items-center space-x-3">
              {/* Color Picker */}
              <input
                id="themeColorPicker" // Đổi id để tránh trùng với input text
                name="themeColorPicker"
                type="color"
                // Style viền mềm hơn
                className="h-10 w-14 p-1 border border-gray-300/70 rounded-md cursor-pointer shadow-sm"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
              />
              {/* Text Input for Color Code */}
              <input
                id="themeColorText" // Đổi id
                name="themeColorText"
                type="text"
                // Style input nhất quán, viền mềm hơn, thêm transition
                className="block w-full px-3 py-2 border border-gray-300/70 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)} // Cho phép nhập tay mã màu
                placeholder="#ffffff"
                pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$" // Pattern để validate mã hex cơ bản
                title="Nhập mã màu dạng #rrggbb hoặc #rgb"
              />
            </div>
          </div>
          {/* Save Button */}
          <div>
            <button
              type="submit"
              disabled={isSaving}
              // Style nút tương tự các nút khác, dùng gradient, chữ trắng, thêm icon
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out">
              {isSaving ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" /> // Icon Save
              )}
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>{" "}
      {/* Kết thúc padding container */}
    </div> // Kết thúc container chính ProfileSettings
  );
}
