import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { Loader2, AlertTriangle } from "lucide-react"; // Import icons

function PublicProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Bắt đầu với true để fetch ngay
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!username) {
        setIsLoading(false);
        setError("Không có username trong địa chỉ URL.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setProfileData(null); // Reset data trước khi fetch mới

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
  }, [username]);

  // --- Render Loading ---
  if (isLoading) {
    return (
      // Spinner đẹp hơn, căn giữa màn hình
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        {" "}
        {/* Thêm nền tạm thời khi loading */}
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  // --- Render Error ---
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-6 bg-gray-50">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-6" />{" "}
        {/* Icon lỗi */}
        <p className="text-2xl md:text-3xl text-red-600 mb-3 font-semibold">
          Oops! Có lỗi xảy ra
        </p>
        <p className="text-lg text-gray-600 mb-8 max-w-md">{error}</p>
        {/* Có thể thêm nút quay lại hoặc làm mới */}
        <button
          onClick={() => window.location.reload()} // Nút làm mới trang đơn giản
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-base font-medium transition duration-150 ease-in-out">
          Thử lại
        </button>
      </div>
    );
  }

  // --- Render Profile Data ---
  if (!profileData || !profileData.user) {
    // Trường hợp hiếm gặp: API trả về 200 nhưng data rỗng
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-6 bg-gray-50">
        <AlertTriangle className="w-16 h-16 text-yellow-400 mb-6" />
        <p className="text-2xl md:text-3xl text-gray-700 mb-3 font-semibold">
          Không tìm thấy dữ liệu
        </p>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Không có dữ liệu profile để hiển thị cho người dùng này.
        </p>
      </div>
    );
  }

  const { user, profile, links } = profileData;
  // Đảm bảo themeColor hợp lệ, nếu không dùng màu xám nhạt làm fallback
  const themeColor =
    profile?.themeColor && /^#[0-9A-F]{6}$/i.test(profile.themeColor)
      ? profile.themeColor
      : "#F3F4F6"; // Màu xám nhạt Tailwind (bg-gray-100)
  const bio = profile?.bio || "";
  const displayName = user.name || `@${user.username}`;

  // Tính màu chữ tương phản (nên dùng helper function)
  const contrastColor = getContrastColor(themeColor);
  const subtleContrastColor = getContrastColor(themeColor, 0.8); // Màu chữ phụ, mờ hơn

  return (
    // Container chính với màu nền động và padding
    <div
      style={{ backgroundColor: themeColor }}
      className="min-h-screen py-12 md:py-16 px-4 transition-colors duration-300 ease-in-out">
      <div className="max-w-md mx-auto flex flex-col items-center">
        {" "}
        {/* Giảm max-width cho vừa màn hình điện thoại */}
        {/* Avatar */}
        <div className="mb-4">
          {" "}
          {/* Bọc trong div để dễ kiểm soát margin hơn */}
          {user.image ? (
            <img
              src={user.image}
              alt={`${displayName}'s avatar`}
              // Bo tròn hoàn hảo, kích thước lớn hơn, viền trắng dày hơn, đổ bóng đẹp
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-xl border-4 border-white"
            />
          ) : (
            // Placeholder avatar
            <div
              className="w-24 h-24 md:w-28 md:h-28 rounded-full shadow-xl bg-white/50 border-4 border-white flex items-center justify-center text-5xl font-bold"
              style={{ color: contrastColor }}>
              {/* Chữ cái đầu, màu tương phản */}
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {/* Tên */}
        <h1
          className="text-2xl md:text-3xl font-bold mb-2 text-center break-words px-2" // Giảm kích thước chữ, thêm padding ngang nhỏ
          style={{ color: contrastColor }}>
          {displayName}
        </h1>
        {/* Bio */}
        {bio && (
          <p
            className="text-base md:text-lg text-center mb-8 max-w-lg px-2" // Giảm mb, thêm padding ngang
            style={{ color: subtleContrastColor }}>
            {bio}
          </p>
        )}
        {/* Danh sách Links */}
        <div className="w-full flex flex-col items-stretch space-y-4">
          {" "}
          {/* items-stretch để nút rộng bằng container, giảm space-y */}
          {links && links.length > 0 ? (
            links.map((link) => (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                // Style nút link: Giữ hiệu ứng glassy, tinh chỉnh padding, bo góc, shadow, hover
                className="block w-full px-6 py-4 bg-white bg-opacity-85 backdrop-blur-lg rounded-lg text-center text-base md:text-lg font-medium text-gray-800 shadow-md hover:shadow-xl hover:scale-[1.03] transform transition duration-200 ease-in-out border border-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/80"
                style={{ "--ring-offset-color": themeColor }} // Set màu offset cho ring dựa vào theme
              >
                {link.title}
              </a>
            ))
          ) : (
            <p
              className="text-center py-4"
              style={{ color: subtleContrastColor }}>
              Người dùng này chưa thêm link nào.
            </p>
          )}
        </div>
        {/* Footer */}
        <p
          className="mt-10 text-center text-xs"
          style={{ color: getContrastColor(themeColor, 0.6) }}>
          Powered by MyBiolink {/* Thay bằng tên ứng dụng của bạn */}
        </p>
      </div>
    </div>
  );
}
export default PublicProfilePage;

// Helper function (giữ nguyên hoặc cải tiến nếu cần)
function getContrastColor(hexcolor, opacity = 1) {
  try {
    if (!hexcolor || typeof hexcolor !== "string")
      return `rgba(0, 0, 0, ${opacity})`; // Đen nếu không có màu
    hexcolor = hexcolor.replace("#", "");
    if (hexcolor.length === 3)
      hexcolor = hexcolor
        .split("")
        .map((char) => char + char)
        .join("");
    if (hexcolor.length !== 6) return `rgba(0, 0, 0, ${opacity})`;

    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    // Ngưỡng 150 có vẻ cân bằng hơn cho nhiều màu sắc
    const color = yiq >= 150 ? "0, 0, 0" : "255, 255, 255";
    return `rgba(${color}, ${opacity})`;
  } catch (e) {
    console.error("Error calculating contrast color:", e);
    return `rgba(0, 0, 0, ${opacity})`;
  }
}
