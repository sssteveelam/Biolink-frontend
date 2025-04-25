import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Import useParams để lấy username từ URL
import api from "../api/axiosConfig";

function PublicProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!username) {
        setIsLoading(false); // Dừng loading nếu không có username
        setError("No username provided in the URL.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setProfileData(null);

      try {
        const response = await api.get(
          `/api/profiles/${username.toLowerCase()}`
        );
        setProfileData(response.data);
      } catch (err) {
        console.error(
          "Error fetching public profile:",
          err.response ? err.response.data : err.message
        );
        if (err.response && err.response.status === 404) {
          setError(`Không tìm thấy người dùng "${username}".`);
        } else {
          setError("Lỗi khi tải trang profile. Vui lòng thử lại.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicProfile();
  }, [username]); // Fetch lại khi username thay đổi

  // --- Render Loading ---
  if (isLoading) {
    // Có thể thêm spinner đẹp hơn ở đây
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Đang tải...
      </div>
    );
  }

  // --- Render Error ---
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <p className="text-3xl text-red-500 mb-4 font-semibold">
          Oops! Có lỗi xảy ra.
        </p>
        <p className="text-xl text-gray-600 mb-8">{error}</p>
        {/* Nút quay lại trang chủ - bạn có thể tạo trang chủ sau */}
        {/* <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-medium">
                Về trang chủ
             </Link> */}
      </div>
    );
  }

  // --- Render Profile Data ---
  // Kiểm tra lại lần nữa phòng trường hợp API trả về 200 nhưng data rỗng (ít xảy ra)
  if (!profileData || !profileData.user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
        Không có dữ liệu profile để hiển thị.
      </div>
    );
  }

  // Lấy thông tin ra cho dễ dùng
  const { user, profile, links } = profileData;
  const themeColor = profile?.themeColor || "#F3F4F6";
  const bio = profile?.bio || "";
  const displayName = user.name || `@${user.username}`; // Ưu tiên hiển thị tên thật, nếu không có thì hiển thị @username

  return (
    // Áp dụng màu nền vào body hoặc div ngoài cùng
    // Sử dụng Tailwind class thay vì style inline nếu màu là cố định hoặc dùng CSS variable nếu muốn động hơn
    <div
      style={{ backgroundColor: themeColor }}
      className="min-h-screen py-16 px-4 transition-colors duration-300 ease-in-out">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Avatar */}
        {user.image ? (
          <img
            src={user.image}
            alt={`${displayName}'s avatar`}
            className="w-28 h-28 rounded-full mb-5 object-cover shadow-lg border-4 border-white" // Tăng kích thước và border
          />
        ) : (
          <div className="w-28 h-28 rounded-full mb-5 shadow-lg bg-gray-300 flex items-center justify-center text-5xl font-bold text-gray-600 border-4 border-white">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Tên */}
        <h1
          className="text-4xl font-bold mb-3 text-center break-words"
          style={{ color: getContrastColor(themeColor) }}>
          {displayName}
        </h1>

        {/* Bio */}
        {bio && (
          <p
            className="text-lg text-center mb-10 max-w-xl"
            style={{ color: getContrastColor(themeColor, 0.85) }}>
            {bio}
          </p>
        )}

        {/* Danh sách Links */}
        <div className="w-full max-w-lg flex flex-col items-center space-y-5">
          {" "}
          {/* Tăng max-width và space */}
          {links && links.length > 0 ? (
            links.map((link) => (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                // Styling nút link nổi bật hơn
                className="block w-full px-8 py-5 bg-white bg-opacity-90 backdrop-blur-md rounded-xl text-center text-xl font-semibold text-gray-900 shadow-lg hover:scale-105 hover:bg-opacity-100 transform transition duration-200 ease-in-out border border-white/40">
                {link.title}
              </a>
            ))
          ) : (
            <p
              className="text-lg"
              style={{ color: getContrastColor(themeColor, 0.75) }}>
              Người dùng này chưa thêm link nào.
            </p>
          )}
        </div>

        {/* Có thể thêm footer hoặc link về trang chủ của bạn ở đây */}
        <p
          className="mt-12 text-center text-sm"
          style={{ color: getContrastColor(themeColor, 0.6) }}>
          Powered by MyBiolink
        </p>
      </div>
    </div>
  );
}
export default PublicProfilePage;

// Helper function (giữ nguyên)
function getContrastColor(hexcolor, opacity = 1) {
  try {
    if (!hexcolor || typeof hexcolor !== "string")
      return `rgba(0, 0, 0, ${opacity})`;
    hexcolor = hexcolor.replace("#", "");
    if (hexcolor.length === 3) {
      hexcolor = hexcolor
        .split("")
        .map((char) => char + char)
        .join("");
    }
    if (hexcolor.length !== 6) return `rgba(0, 0, 0, ${opacity})`;

    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    // Công thức YIQ tính độ sáng (luma)
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    const color = yiq >= 140 ? "0, 0, 0" : "255, 255, 255"; // Tăng ngưỡng lên 140 thử xem
    return `rgba(${color}, ${opacity})`;
  } catch (e) {
    console.error("Error calculating contrast color:", e);
    return `rgba(0, 0, 0, ${opacity})`; // Fallback
  }
}
